const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/app-v29.js','utf8');
function setup(roads=[{points:[[0,30],[0,-30]],w:6}],options={}){
 const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync('app/src/network.js','utf8'),c);vm.runInContext(source.split('/* Campus viewer */')[0],c);
 const graph=c.YY.Network.build(roads),walk=new c.YY.FirstPerson(graph,options);assert(walk.enter([0,0]));return{walk,graph,Y:c.YY};
}
const near=(a,b,tolerance=1e-7)=>assert(Math.abs(a-b)<tolerance,`${a} != ${b}`);
test('eye remains at pedestrian height above terrain and dragging cannot invert camera',()=>{
 const {walk}=setup(undefined,{ground:(x,z)=>3+x*.1+z*.2});near(walk.camera().eye[1],4.68);walk.move(1,0,.1);near(walk.camera().eye[1],4.68+walk.position[1]*.2);walk.look(100,1e6);assert.equal(walk.pitch,-1.1);walk.look(0,-1e6);assert.equal(walk.pitch,1.1);assert(walk.camera().target.every(Number.isFinite));
});
test('movement is frame-time based, diagonal speed normalized and long pauses bounded',()=>{
 const a=setup([{points:[[0,100],[0,-100]],w:100}]).walk,b=setup([{points:[[0,100],[0,-100]],w:100}]).walk;
 for(let i=0;i<60;i++)a.move(1,0,1/60);for(let i=0;i<30;i++)b.move(1,1,1/30);near(Math.hypot(...a.position),2.1);near(Math.hypot(...b.position),2.1);
 const before=a.position.slice();a.move(1,0,120,true);assert(Math.hypot(a.position[0]-before[0],a.position[1]-before[1])<=.16*4.2+1e-8);
});
test('walking stops at road margins and never snaps to a disconnected nearby road',()=>{
 const {walk}=setup([{points:[[0,20],[0,-20]],w:2},{points:[[2,20],[2,-20]],w:2}]);
 for(let i=0;i<100;i++)walk.move(0,1,.1);assert(walk.position[0]<=.7);assert(!walk.allowed([2,0]));
});
test('existing intersections remain walkable in both directions',()=>{
 const {walk}=setup([{points:[[0,20],[0,-20]],w:4},{points:[[-20,0],[20,0]],w:4}]);
 for(let i=0;i<40;i++)walk.move(0,1,.1);near(walk.position[0],8.4);walk.yaw=-Math.PI/2;for(let i=0;i<40;i++)walk.move(1,0,.1);near(walk.position[0],0);
});
test('substeps stop at building barriers and route playback refuses blocked ground',()=>{
 const {walk}=setup(undefined,{blocked:p=>p[1]<-1});for(let i=0;i<20;i++)walk.move(1,0,.16,true);assert(walk.position[1]>=-1);
 const r={points:[[0,0],[0,-10]],length:10};assert.equal(walk.follow(r,2),false);assert(walk.position[1]>=-1);
});
test('route follows both legs of a bend exactly and turns by shortest angle',()=>{
 const {walk}=setup([{points:[[0,0],[0,-10],[10,-10]],w:4}]);const r={points:[[0,0],[0,-10],[10,-10]],length:20};assert(walk.follow(r,15));near(walk.position[0],5);near(walk.position[1],-10);near(walk.yaw,Math.PI/2);
 assert(walk.follow(r,25));near(walk.position[0],10);near(walk.position[1],-10);assert.equal(walk.follow({points:[[0,0]],length:0},0),false);
 walk.yaw=Math.PI-.02;walk.follow({points:[[0,0],[-.02,10]],length:10},1,.1);assert(Math.abs(walk.yaw-Math.PI)<.05);
});
test('enter uses nearest road projection, skips blocked road segments and handles empty network',()=>{
 const {walk,Y}=setup([{points:[[0,0],[0,-10]],w:3},{points:[[20,0],[20,-10]],w:3}],{blocked:p=>p[0]<10});near(walk.position[0],20);assert(walk.enter([21,-4]));near(walk.position[1],-4);assert.equal(new Y.FirstPerson({nodes:[],edges:[]}).enter([0,0]),false);
});
test('route scrub captures requested progress before pause updates the controls',()=>{
 const node={value:'999'},route={length:200};let handler;
 const assignment=source.match(/\$\('route-progress'\)\.oninput=([^\n]*?);\n/)[1];
 const c=vm.createContext({$:()=>node,route,routeDistance:40,pauseTravel:()=>{node.value='200'},moveAlong:()=>{},syncWalkUI:()=>{}});
 vm.runInContext('handler='+assignment,c);c.handler();near(c.routeDistance,199.8);
});

// Execute the maintained tick and event handlers with a real walker and GPU gate;
// only DOM, rAF scheduling and GL fence completion are simulated.
const engineSource=fs.readFileSync('app/src/engine.js','utf8');
function navigationClock({gpuBusy=false}={}){
 const {walk}=setup(),events=new Map();let renders=0;
 const line=prefix=>{const found=source.split('\n').find(s=>s.startsWith(prefix));assert(found,`Missing viewer hook: ${prefix}`);return found;};
 const engine={software:false,shadowDirty:false,frameFences:[],
  gl:{TIMEOUT_EXPIRED:1,clientWaitSync:f=>f.ready?2:1,deleteSync(){}},
  render(){renders++;this.frameFences.push({ready:!gpuBusy});assert(this.frameFences.length<=2,'GPU queue must remain bounded');}};
 const context=vm.createContext({
  ready:true,mode:'3d',animation:true,last:0,lastDraw:0,lastInput:null,labelTick:0,frameRequest:0,lastVisualKey:'',labelsPending:false,
  state:{firstPerson:true,time:0,routeEdges:new Set()},keys:new Set(),walker:walk,engine,noWalkRoute:new Set(),
  route:null,routePlaying:false,routeDistance:0,walkDetached:false,
  document:{hidden:false,querySelectorAll:()=>[],addEventListener:(name,callback)=>events.set(name,callback)},
  window:{addEventListener:(name,callback)=>events.set(name,callback)},root:{querySelector:()=>null},canvas:{width:800,height:600},
  requestAnimationFrame:()=>1,camera:()=>walk.camera(),$:()=>({hidden:true}),browseCamera:{step(){},cancel(){}},
  syncWalkUI(){},syncWalkPosition(){},drawLabels(){},moveAlong(){},say(){}
 });
 const gate=engineSource.match(/ frameAvailable\(\)\{[\s\S]*?\n \}/);assert(gate,'Missing GPU frame gate');
 engine.frameAvailable=vm.runInContext('({'+gate[0]+'}).frameAvailable',context);
 const start=source.indexOf('function tick(now){'),end=source.indexOf('\nasync function loadRenderResources',start);assert(start>=0&&end>start);
 vm.runInContext([
  line('function pauseTravel(){'),line('function stopWalkInput(){'),
  line("window.addEventListener('blur'"),line("document.addEventListener('visibilitychange'"),source.slice(start,end)
 ].join('\n'),context);
 return {context,walk,step:now=>context.tick(now),emit:name=>events.get(name)(),get renders(){return renders;}};
}

test('viewer navigation preserves one-second walking distance at 10, 15, 20 and 60 Hz',()=>{
 for(const hz of [10,15,20,60]){
  const f=navigationClock();f.context.keys.add('KeyW');
  for(let i=0;i<=hz;i++)f.step(100+i*1000/hz);
  near(-f.walk.position[1],2.1);
 }
});

test('blur and hidden events discard held input and elapsed time even without a hidden rAF',()=>{
 for(const event of ['blur','visibilitychange']){
  const f=navigationClock();f.context.keys.add('KeyW');f.step(100);f.step(110);near(-f.walk.position[1],.021);
  f.context.routePlaying=true;
  if(event==='visibilitychange')f.context.document.hidden=true;
  f.emit(event);assert.equal(f.context.keys.size,0);assert.equal(f.context.routePlaying,false);
  // No background rAF is delivered. A fresh press before the first resumed tick
  // must not inherit the interval before blur/hidden; the next tick moves normally.
  f.context.document.hidden=false;f.context.keys.add('KeyW');f.step(10000);near(-f.walk.position[1],.021);
  f.step(10010);near(-f.walk.position[1],.042);
 }
});

test('two in-flight GPU frames do not stop navigation or accumulate a recovery jump',()=>{
 const f=navigationClock({gpuBusy:true});f.context.keys.add('KeyW');
 for(let i=0;i<=60;i++)f.step(100+i*1000/60);
 assert.equal(f.renders,2);assert.equal(f.context.engine.frameFences.length,2);near(-f.walk.position[1],2.1);
 for(const fence of f.context.engine.frameFences)fence.ready=true;
 f.step(1120);assert.equal(f.renders,3);near(-f.walk.position[1],2.142);
});
