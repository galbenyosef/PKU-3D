const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../src/app-v29.js'),'utf8');
function fixture(width=1440){
 let now=0,available=true,detail=false,catalog=true;
 const rendered=[],labels=[],c={YY:{},qualityPreset:'high',Math,performance:{now:()=>now},innerWidth:width,innerHeight:1000,
  state:{firstPerson:false,time:0,routeEdges:new Set()},orbit:{target:[20,5,9.5],distance:500,yaw:.4,elevation:.31},
  root:{classList:{contains:()=>!catalog}},document:{hidden:false},$:id=>({hidden:id==='detail'?!detail:true}),canvas:{width,height:1000},
  ready:true,mode:'3d',last:0,lastInput:null,lastDraw:0,frameRequest:0,animation:false,routePlaying:false,route:null,routeDistance:0,
  labelTick:0,labelsPending:false,lastVisualKey:'',lastLabelCameraKey:'',browseMotion:{matches:false},
  requestAnimationFrame:()=>1,drawLabels(){labels.push({...rendered.at(-1)});}};
 c.Y=c.YY;c.engine={software:false,shadowDirty:false,frameAvailable:()=>available,render:view=>rendered.push({...view})};vm.createContext(c);
 const helpers=source.indexOf('/* Time-based orbit transitions.'),viewer=source.indexOf('/* Campus viewer */',helpers);
 assert(helpers>=0&&viewer>helpers,'production camera helper boundary');vm.runInContext(source.slice(helpers,viewer),c);
 for(const name of ['panelLayoutOffset','finishPanelOffset','camera']){const line=source.split('\n').find(s=>s.startsWith('function '+name+'('));assert(line,'production '+name);vm.runInContext(line,c);}
 c.panelOffset=new c.YY.PanelOffset(c.panelLayoutOffset());c.browseCamera=new c.YY.BrowseCamera(c.orbit,{clock:()=>now,immediate:()=>c.browseMotion.matches});
 const start=source.indexOf('function tick(now){'),end=source.indexOf('\nasync function loadRenderResources',start);
 assert(start>=0&&end>start,'production tick boundary');vm.runInContext(source.slice(start,end),c);
 return{c,rendered,labels,set(options){if('detail'in options)detail=options.detail;if('catalog'in options)catalog=options.catalog;if('available'in options)available=options.available;if('now'in options)now=options.now;},tick(t){now=t;c.tick(t)}};
}

test('camera reads never advance a panel transition, including after a pending layout change',()=>{
 const h=fixture();h.tick(200);const before=JSON.stringify(h.c.camera());h.set({detail:true,now:250});
 for(let i=0;i<5;i++)assert.equal(JSON.stringify(h.c.camera()),before);
 assert.equal(h.c.panelOffset.active,false);h.tick(260);h.tick(300);
 const displayed=JSON.stringify(h.c.camera()),start=h.c.panelOffset.start;h.set({now:800});
 for(let i=0;i<5;i++)assert.equal(JSON.stringify(h.c.camera()),displayed);
 assert.equal(h.c.panelOffset.start,start);assert.equal(h.c.panelOffset.active,true);
});

test('GPU queue gate prevents transition advancement; accepted frames finish exactly and return to idle',()=>{
 const h=fixture();h.tick(200);h.set({detail:true,available:false});h.tick(250);
 assert.equal(h.c.panelOffset.active,false);assert.equal(h.rendered.length,1);
 h.set({available:true});h.tick(260);assert.equal(h.c.panelOffset.offsetX,-.18);assert.equal(h.c.panelOffset.active,true);
 h.tick(300);const intermediate=h.c.panelOffset.offsetX;assert(intermediate>-.18&&intermediate<.22);
 h.set({available:false});h.tick(350);assert.equal(h.c.panelOffset.offsetX,intermediate);
 h.set({available:true});h.tick(420);assert.equal(h.c.panelOffset.offsetX,.22);assert.equal(h.c.panelOffset.active,false);
 const count=h.rendered.length;h.tick(620);assert.equal(h.rendered.length,count);
});

test('reduced-motion close and reopen refresh labels on the changed rendered projection within 170 ms',()=>{
 for(const width of [1440,390]){const h=fixture(width),axis=width>650?'offsetX':'offsetY',open=width>650?.22:.34;
  h.c.browseMotion.matches=true;h.set({detail:true});h.tick(200);assert.equal(h.labels.at(-1)[axis],open);
  const count=h.labels.length;h.set({detail:false,catalog:false});h.tick(250);
  assert.equal(h.labels.length,count+1);assert.equal(h.labels.at(-1)[axis],0);assert.equal(h.c.labelsPending,false);
  h.set({detail:true});h.tick(290);assert.equal(h.labels.length,count+2);assert.equal(h.labels.at(-1)[axis],open);assert.equal(h.c.panelOffset.active,false);
 }
});

test('pre-tick immediate finish survives queue blocking and refreshes labels on the first accepted frame',()=>{
 const h=fixture();h.tick(200);h.set({detail:true});h.tick(210);h.tick(250);const count=h.labels.length;
 h.c.finishPanelOffset();assert.equal(h.c.panelOffset.active,false);assert.equal(h.c.panelOffset.offsetX,.22);
 h.set({available:false});h.tick(260);assert.equal(h.labels.length,count);assert.notEqual(h.rendered.at(-1).offsetX,.22);
 h.set({available:true});h.tick(270);assert.equal(h.labels.length,count+1);assert.equal(h.labels.at(-1).offsetX,.22);assert.equal(h.c.labelsPending,false);
});

test('unchanged projection preserves the original label cadence during normal animation',()=>{
 const h=fixture();h.c.animation=true;h.tick(200);const count=h.labels.length;
 h.tick(230);h.tick(260);assert.equal(h.labels.length,count);assert.equal(h.rendered.length,3);
 h.tick(380);assert.equal(h.labels.length,count+1);assert(h.c.state.time>0);
});
