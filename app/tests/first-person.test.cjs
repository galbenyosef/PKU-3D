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
