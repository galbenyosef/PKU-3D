const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/app-v29.js','utf8');
const start=source.indexOf('function architectureDistance46('),end=source.indexOf('function fitArchitectureView(',start);
const ctx={Math};vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);
test('all envelope corners fit the unobscured view at front, side, rear and roof angles',()=>{
 for(const aspect of [390/844,1440/1000])for(const yaw of [0,.72,Math.PI/2,Math.PI])for(const elevation of [.18,.55,1.5]){
  const box=[-29,2,-7,15,31,38],target=[-5,14,13],sx=.62,sy=.24;
  const d=ctx.architectureDistance46(box,target,yaw,elevation,aspect,sx,sy);
  for(const x of [box[0],box[3]])for(const y of [box[1],box[4]])for(const z of [box[2],box[5]]){
   const a=x-target[0],b=y-target[1],c=z-target[2],along=a*Math.sin(yaw)+c*Math.cos(yaw),depth=b*Math.sin(elevation)+along*Math.cos(elevation);
   assert.ok(d-depth>0);
   assert.ok(Math.abs((a*Math.cos(yaw)-c*Math.sin(yaw))/((d-depth)*Math.tan(.4)*aspect))<=sx);
   assert.ok(Math.abs((b*Math.cos(elevation)-along*Math.sin(elevation))/((d-depth)*Math.tan(.4)))<=sy);
  }
 }
});
test('view changes fit long wings without inheriting a blanket mobile distance',()=>{
 const box=[-30,0,-4,30,8,4],target=[0,3.36,0];
 const front=ctx.architectureDistance46(box,target,0,.18,390/844,.9,.24);
 const side=ctx.architectureDistance46(box,target,Math.PI/2,.18,390/844,.9,.24);
 assert.ok(front>side*1.5);assert.ok(front<60*2.05*2.5);
});

function interaction({width=1440,height=1000,observation,displayBounds,isolate=0,panelLeft=1120,panelTop=540}={}){
 const elements=new Map(),el=id=>{if(!elements.has(id))elements.set(id,{hidden:false,getBoundingClientRect:()=>({left:panelLeft,top:panelTop})});return elements.get(id);};const feature={properties:{id:'test/long-wing',pickId:7,kind:'building',bounds:[-30,-6,70,25],centre:[20,9.5],height:12,frontAngle46:.4,frontElevation46:.31,...(observation===undefined?{}:{frontObservation46:observation}),...(displayBounds===undefined?{}:{displayBounds46:displayBounds})}};
 const c={Math,Number,Array,selected:7,by:new Map([[7,feature]]),state:{isolate},orbit:{},planView:{},innerWidth:width,innerHeight:height,Y:{Landscape42:{elevation:()=>2}},YY:{},$ :el,root:{classList:{contains:()=>true}},document:{querySelector:()=>({getBoundingClientRect:()=>({bottom:78})})},drawPlan(){},changeMode(){}};vm.createContext(c);
 vm.runInContext(source.slice(source.indexOf('function frontObservation46('),source.indexOf('function changeMode(')),c);
 vm.runInContext(source.slice(source.indexOf('function camera(){'),source.indexOf('function el(')),c);
 vm.runInContext('function bounds(f){return f.properties.bounds}function point(f){return f.properties.centre}',c);
 const buttons=source.slice(source.indexOf("$('front-view').onclick="),source.indexOf("$('ne-view').onclick="));vm.runInContext(buttons,c);
 return{c,feature,click:id=>{el(id).onclick();return JSON.parse(JSON.stringify(c.orbit));}};
}
const observation={target:[-18,3,11],bounds:[-23,2,9,-13,8,13],yaw:1.6,elevation:.29};
function assertScreenFit(c,box){const view=c.camera(),o=c.orbit,sy=Math.sin(o.yaw),cy=Math.cos(o.yaw),se=Math.sin(o.elevation),ce=Math.cos(o.elevation),aspect=c.innerWidth/c.innerHeight,cx=c.innerWidth*(1-(view.offsetX||0))/2,centerY=c.innerHeight*(1-(view.offsetY||0))/2,mobile=c.innerWidth<=650,rect=c.$('detail').getBoundingClientRect(),right=mobile?c.innerWidth-16:rect.left-16,bottom=mobile?rect.top-12:c.innerHeight-60;
 for(const x of[box[0],box[3]])for(const y of[box[1],box[4]])for(const z of[box[2],box[5]]){const dx=x-o.target[0],dy=y-o.target[1],dz=z-o.target[2],along=dx*sy+dz*cy,depth=o.distance-dy*se-along*ce;assert.ok(depth>0);const px=cx+(dx*cy-dz*sy)/(depth*Math.tan(.4)*aspect)*c.innerWidth/2,py=centerY-(dy*ce-along*se)/(depth*Math.tan(.4))*c.innerHeight/2;assert.ok(px>=16&&px<=right,`horizontal crop ${px}`);assert.ok(py>=90&&py<=bottom,`vertical crop ${py}`);}
}
test('actual front button focuses optional entrance bounds and fits real desktop/mobile panels',()=>{
 for(const layout of[{width:1440,height:1000,panelLeft:1120},{width:1024,height:768,panelLeft:680},{width:390,height:844,panelTop:470},{width:430,height:932,panelTop:550}]){const h=interaction({...layout,observation});const o=h.click('front-view');assert.deepEqual(o.target,observation.target);assert.equal(o.yaw,observation.yaw);assert.equal(o.elevation,observation.elevation);assertScreenFit(h.c,observation.bounds);assert.notEqual(h.c.orbit.target,observation.target,'do not alias metadata');h.c.orbit.target[0]++;assert.equal(observation.target[0],-18);}
 const narrow=interaction({observation,panelLeft:650}).click('front-view'),wide=interaction({observation,panelLeft:1250}).click('front-view');assert.ok(narrow.distance>wide.distance,'distance follows actual available panel space');
});
test('side back roof and isolated front buttons ignore entrance framing and preserve default interaction',()=>{
 for(const isolate of[0,7])for(const id of['front-view','side-view','back-view','roof-view']){if(!isolate&&id==='front-view')continue;const configured=interaction({observation,isolate}),baseline=interaction({isolate});assert.deepEqual(configured.click(id),baseline.click(id));}
 const fresh=interaction({observation});fresh.click('front-view');assert.deepEqual(fresh.click('side-view'),interaction().click('side-view'),'front target must not leak into following side click');
});
test('invalid or missing observation metadata falls back atomically to default front fit',()=>{
 const invalid=[null,{}, {...observation,target:[0,NaN,0]}, {...observation,target:[-18,3,Infinity]}, {...observation,target:[-18,3]}, {...observation,target:Array(3)}, {...observation,bounds:[-23,2,9,-13,8]}, {...observation,bounds:[-23,2,9,-23,8,13]}, {...observation,bounds:[-23,2,9,-24,8,13]}, {...observation,bounds:[-23,2,9,-13,Infinity,13]}, {...observation,target:[-100,3,11]}, {...observation,yaw:NaN}, {...observation,yaw:'1.6'}, {...observation,elevation:0}, {...observation,elevation:-.1}, {...observation,elevation:Math.PI/2}, {...observation,elevation:Infinity}];
 const expected=interaction().click('front-view');for(const value of invalid)assert.deepEqual(interaction({observation:value}).click('front-view'),expected);
});

const displayBounds=Object.freeze([-48,-5,-30,97,30,50]);
const viewButtons=['front-view','side-view','back-view','roof-view'];
test('actual view buttons include cantilevers and below-grade display extents on desktop and mobile',()=>{
 for(const layout of[{width:1440,height:1000,panelLeft:1120},{width:1024,height:768,panelLeft:680},{width:390,height:844,panelTop:470},{width:430,height:932,panelTop:550}])for(const isolate of[0,7]){
  const h=interaction({...layout,isolate,displayBounds}),before=JSON.stringify(h.feature);
  for(const id of viewButtons){const o=h.click(id),old=interaction({...layout,isolate}).click(id);assertScreenFit(h.c,displayBounds);assert.ok(o.distance>old.distance,`${id} must include the added extent`);assert.deepEqual(o.target,old.target);assert.equal(o.yaw,old.yaw);assert.equal(o.elevation,old.elevation);}
  assert.equal(JSON.stringify(h.feature),before,'view changes must not mutate source bounds or display metadata');
 }
});
test('entrance observation wins over display extent only on the actual front button',()=>{
 for(const layout of[{width:1440,height:1000},{width:390,height:844,panelTop:470}]){
  const both=interaction({...layout,observation,displayBounds});
  assert.deepEqual(both.click('front-view'),interaction({...layout,observation}).click('front-view'));
  assertScreenFit(both.c,observation.bounds);
  for(const id of viewButtons.slice(1)){assert.deepEqual(both.click(id),interaction({...layout,displayBounds}).click(id));assertScreenFit(both.c,displayBounds);}
 }
});
test('invalid display bounds preserve legacy front side back and roof framing',()=>{
 const invalid=[null,{},'[-48,-5,-30,97,30,50]',[-48,-5,-30,97,30],[-48,-5,-30,97,30,50,60],Array(6),[-48,-5,-30,97,30,undefined],[-48,-5,-30,97,30,'50'],[-48,-5,-30,97,30,NaN],[-48,-5,-30,Infinity,30,50],[-Infinity,-5,-30,97,30,50],[-48,-5,-30,-48,30,50],[-48,-5,-30,-49,30,50],[-48,30,-30,97,30,50],[-48,-5,50,97,30,50]];
 for(const layout of[{width:1440,height:1000},{width:390,height:844,panelTop:470}])for(const value of invalid)for(const id of viewButtons){assert.deepEqual(interaction({...layout,displayBounds:value}).click(id),interaction(layout).click(id));}
});
test('world display bounds are not ground-offset or replaced by point-feature displayRadius',()=>{
 const h=interaction({displayBounds});h.feature.properties.bounds=[20,9.5,20,9.5];h.feature.properties.displayRadius=1000;h.click('side-view');assertScreenFit(h.c,displayBounds);
 const distance=h.c.orbit.distance;h.c.Y.Landscape42.elevation=()=>200;h.c.fitArchitectureView(h.feature);assert.equal(h.c.orbit.distance,distance,'already-world bounds must not acquire terrain height');
 h.feature.properties.displayRadius=1;h.c.fitArchitectureView(h.feature);assert.equal(h.c.orbit.distance,distance,'explicit extent wins over fallback radius');
});

test('registered rear entrance uses only the rear button and preserves independent front observation',()=>{
 const rear={target:[35,4,-2],bounds:[29,2,-5,41,9,1],yaw:3.26,elevation:.16};
 for(const layout of[{width:1440,height:1000,panelLeft:1120},{width:390,height:844,panelTop:470}]){
  const h=interaction({...layout,observation});h.feature.properties.backObservation46=rear;
  const o=h.click('back-view');assert.deepEqual(o.target,rear.target);assert.equal(o.yaw,rear.yaw);assertScreenFit(h.c,rear.bounds);
  for(const id of['front-view','side-view','roof-view'])assert.deepEqual(h.click(id),interaction({...layout,observation}).click(id));
  h.c.state.isolate=7;assert.deepEqual(h.click('back-view'),interaction({...layout,observation,isolate:7}).click('back-view'));
 }
});
test('invalid rear metadata falls back to whole-building rear view without borrowing front target',()=>{
 for(const q of[null,{}, {...observation,target:[NaN,3,11]}, {...observation,bounds:[-23,2,9,-23,8,13]}, {...observation,elevation:0}]){
  const h=interaction({observation});h.feature.properties.backObservation46=q;
  assert.deepEqual(h.click('back-view'),interaction({observation}).click('back-view'));
 }
});
