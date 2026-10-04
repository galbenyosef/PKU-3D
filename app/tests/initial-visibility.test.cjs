'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=process.env.PKU_APP_ROOT||path.resolve(__dirname,'..');
const scripts=['math.js','visibility.js','engine.js'].map(name=>
  new vm.Script(fs.readFileSync(path.join(root,'src',name),'utf8'),{filename:name}));
const plain=value=>JSON.parse(JSON.stringify(value));

// Run the maintained planner and render method. Only GPU endpoints, draw submission
// and idle scheduling are fake; each draw still executes visibleScene and uploads.
function fixture(){
  let clock=0,id=0,gpu=0;
  const idle=new Map(),glCalls=[],draws=[];
  const context=vm.createContext({YY:{},performance:{now:()=>clock+=.25},
    requestIdleCallback:fn=>{idle.set(++id,fn);return id;},
    cancelIdleCallback:key=>idle.delete(key)});
  for(const script of scripts)script.runInContext(context);
  const C=vm.runInContext('({Map,Set,Float32Array})',context),Y=context.YY;
  Y.Atmosphere={fog:()=>[0,0,0,0]};Y.DATA={toWorld:()=>[0,0]};
  const gl=new Proxy({}, {get(target,name){
    if(name in target)return target[name];
    if(/^[A-Z_0-9]+$/.test(name))return target[name]=String(name);
    return target[name]=()=>{
      glCalls.push(name);
      if(['createBuffer','createVertexArray','fenceSync'].includes(name))return{gpu:++gpu};
      if(name==='isContextLost')return false;
    };
  }});
  const e=Object.assign(Object.create(Y.Engine.prototype),{
    gl,canvas:{width:1440,height:1000,clientWidth:1440,clientHeight:1000},aspect:1.44,
    shadowSize:2048,buckets:new C.Map(),visibilityCaches:new C.Map(),
    stats:{instances:64,triangles:64,visibilityBuilds:0,instanceUploadBytes:0},
    meshResources:[],shadowDirty:true,frameFences:[],shadowTarget:{f:{}},
    reflectTarget:{f:{},w:100,h:80},sceneTarget:{msF:{}},shadow:{},main:{},lastReflection:-1,frame:0
  });
  // Shared meshes, vegetation, route geometry, water and ordinary opaque instances.
  const meshes=[];
  for(let i=0;i<64;i++){
    const data=new C.Float32Array(28),spatial=new C.Float32Array(5);
    const x=i%15-7,z=Math.floor(i/15)-2;
    data[0]=data[5]=data[10]=data[15]=1;data[12]=x;data[13]=2;data[14]=z;
    data[20]=i%19===0?4:i%17===0?44:0;data[21]=i===3?950001:i+1;data[23]=i%3;
    spatial.set([x,2,z,1,1]);
    const resource=meshes[i>>1]||(meshes[i>>1]={vertexCount:3,vertexBuffer:{},indexBuffer:null});
    const b={data,spatial,count:1,vertexCount:3,detailWidth:0,passes:new C.Map(),resource,tag:i};
    Y.Visibility.compile(b);e.prepareRanges(b);b.preparedCompiled=true;e.buckets.set('b'+i,b);
  }
  e.preparedInstanceCount=e.buckets.size;
  e.draw=function(program,vp,eye,pass){draws.push({pass,vp:plain(vp),eye:plain(eye)});this.visibleScene(vp,pass===1?0:pass);};
  e.sky=()=>{};e.present=()=>{};e.frameAvailable=()=>true;e.reflectionScissor=()=>null;
  const camera={eye:[0,40,50],target:[0,0,0],fov:.8,offsetX:-.18,offsetY:0};
  const state={hour:10.5,season:1,weather:0,time:0,selected:0,isolate:0,explode:0,
    detailLOD:false,vegetation:true,routeEdges:new C.Set([1]),bucketSpatialIndex:false};
  function finishIdle(){
    let count=0;
    while(idle.size){assert(++count<100,'idle planner terminates');const[key,fn]=idle.entries().next().value;idle.delete(key);fn({timeRemaining:()=>8});}
    assert(!e.initialVisibilityStats?.failed,'optional planner did not silently fail');
  }
  function render(){
    e.render(camera,state);
    const visibility=[...e.visibilityCaches].sort((a,b)=>a[0]-b[0]).map(([slot,c])=>({
      slot,key:c.key,items:c.items.map(i=>[i.b.tag,i.record.offset,i.record.count,i.ranges]),
      draws:c.drawItems.map(i=>[i.b.tag,i.record.offset,i.record.count,i.pageRange208]),
      clearStart:c.clearStart,drawClearStart:c.drawClearStart,
      submitted:c.submitted,triangles:c.triangles,culled:c.culled,
      bytes:Buffer.from(e.instanceStreams.get(slot).data.buffer,0,e.instanceStreams.get(slot).used*4).toString('hex')
    }));
    return plain({visibility,draws,vp:e.vp,lightVP:e.lightVP,projection:e.projection,
      refVP:e.refVP,sun:e.sun,shadowCenter:e.shadowCenter,shadowRadius:e.shadowRadius});
  }
  return{e,C,camera,state,idle,glCalls,draws,finishIdle,render,
    prepare(){e.prepareInitialVisibility(camera,state);},
    ready(){this.prepare();finishIdle();}};
}
function released(f){
  assert.equal(f.idle.size,0);assert.equal(f.e.initialVisibilityJob,null);
  assert.equal(f.e.initialVisibilityPlans,null);assert.equal(f.e.initialVisibilityStats.retainedBytes,0);
}

test('CPU plans survive final geometry validation and match ordinary main/shadow/reflection render',async()=>{
  const ordinary=fixture(),early=fixture(),e=early.e;
  const before=[e.state,e.camera,e.shadowCenter,e.shadowDirty];
  early.ready();
  assert.equal(early.glCalls.length,0,'planning must never touch GL');
  assert.deepEqual([e.state,e.camera,e.shadowCenter,e.shadowDirty],before,'planning leaves live frame state untouched');
  assert.deepEqual([...e.initialVisibilityPlans.keys()],[0,2],'reflection is prepared only by real render');
  await e.finishPrepared(async()=>{});
  assert.equal(e.initialVisibilityPlans.size,2,'geometry barrier retains completed CPU plans');
  assert.deepEqual(early.render(),ordinary.render(),'same keys, records, stream bytes and all pass matrices');
  assert.deepEqual(early.draws.map(d=>d.pass),[2,3,0],'execute real shadow/reflection/main control flow');
  assert(early.draws.every(d=>Object.values(d.vp).every(Number.isFinite)));
  assert.notDeepEqual(early.draws[1].vp,early.draws[2].vp,'reflected view has its own matrix');
  assert(Math.abs(e.projection[8]-early.camera.offsetX)<1e-6,'projection preserves view offset');
  assert.equal(e.initialVisibilityStats.adopted,2);assert.equal(e.initialVisibilityStats.adoptedMask,5);
  assert(e.initialVisibilityStats.peakRetainedBytes>0);released(early);
});

const changes={
  camera:f=>{f.camera.eye[0]+=1;},
  'CSS viewport':f=>{f.e.canvas.clientHeight=900;},
  'drawing viewport':f=>{f.e.canvas.width=1500;f.e.aspect=1.5;},
  route:f=>{f.state.routeEdges.clear();},
  isolation:f=>{f.state.isolate=9;f.state.selected=9;},
  sunlight:f=>{f.state.hour=16;},
  inspection:f=>{f.state.inspectionMask={objectId:0,buckets:new f.C.Set(['b2'])};}
};
for(const [name,change] of Object.entries(changes))test(name+' change discards stale plans and produces the ordinary frame',()=>{
  const ordinary=fixture(),early=fixture();early.ready();change(ordinary);change(early);
  assert.deepEqual(early.render(),ordinary.render());
  assert(early.e.initialVisibilityStats.discarded>0);released(early);
});

test('yielding captures camera arrays and route sets instead of sharing mutable UI state',()=>{
  const ordinary=fixture(),early=fixture();early.prepare();
  early.state.routeEdges.clear();early.camera.eye[0]=200;
  early.finishIdle();early.state.routeEdges.add(1);early.camera.eye[0]=0;
  assert.deepEqual(early.render(),ordinary.render());assert.equal(early.e.initialVisibilityStats.adopted,2);
});

test('first render cancels pending work and stale callbacks cannot affect a newer job',()=>{
  const f=fixture();f.prepare();const stale=f.idle.values().next().value;
  f.prepare();const current=f.e.initialVisibilityJob;stale({timeRemaining:()=>8});
  assert.equal(f.e.initialVisibilityJob,current);assert.equal(f.idle.size,1);
  assert.deepEqual(f.render(),fixture().render());assert.equal(f.e.initialVisibilityStats.adopted,0);released(f);
  stale({timeRemaining:()=>8});released(f);
});

for(const [name,action] of Object.entries({
  invalidation:f=>f.e.invalidateBucketIndex(),
  recompilation:f=>f.e.compileBucket(f.e.buckets.values().next().value),
  disposal:f=>f.e.dispose()
}))test(name+' releases both queued and completed plans',()=>{
  for(const complete of [false,true]){
    const f=fixture();f.prepare();const stale=f.idle.values().next().value;
    if(complete)f.finishIdle();action(f);released(f);
    stale({timeRemaining:()=>8});released(f);
  }
});

test('generation guard rejects completed plans even if invalidation cleanup was bypassed',()=>{
  const f=fixture();f.ready();f.e.bucketIndexGeneration=(f.e.bucketIndexGeneration||0)+1;
  assert.deepEqual(f.render(),fixture().render());assert.equal(f.e.initialVisibilityStats.adopted,0);
  assert.equal(f.e.initialVisibilityStats.discarded,2);released(f);
});

test('generation guard stops an in-flight callback before it can publish',()=>{
  const f=fixture();f.prepare();f.e.bucketIndexGeneration=(f.e.bucketIndexGeneration||0)+1;
  f.finishIdle();assert.equal(f.e.initialVisibilityStats.completed,0);released(f);
});

test('only unique successful metadata publications signal readiness, once per scene',()=>{
  const f=fixture(),e=f.e;let publications=0;
  const manifest={version:2,meshes:[{vertexCount:3}],
    buckets:[{key:'one',mesh:0,count:1},{key:'two',mesh:0,count:1}],stats:{}};
  e.onInstanceDataReady=()=>{publications++;assert([...e.buckets.values()].every(b=>b.preparedCompiled));};
  const data=new f.C.Float32Array(28),spatial=new f.C.Float32Array([0,2,0,1,1]);
  data[0]=data[5]=data[10]=data[15]=1;
  for(let scene=1;scene<=2;scene++){
    e.beginPrepared(manifest);assert.equal(e.preparedInstanceCount,0);
    assert.throws(()=>e.preparedInstances({key:'one'},new f.C.Float32Array(0),spatial),/Incomplete/);
    assert.equal(e.preparedInstanceCount,0);
    e.preparedInstances({key:'one'},data,spatial);e.preparedInstances({key:'one'},data,spatial);
    assert.equal(publications,scene-1);
    e.preparedInstances({key:'two'},data,spatial);e.preparedInstances({key:'two'},data,spatial);
    assert.equal(publications,scene);assert.equal(e.preparedInstanceCount,2);
  }
});


test('borrowed add remains usable by a CPU-only collector without renderer lifecycle methods',()=>{
  const context=vm.createContext({YY:{}});
  for(const script of scripts)script.runInContext(context);
  const Y=context.YY,collector={buckets:new Map(),stats:{instances:0},
    invalidateBucketIndex:Y.Engine.prototype.invalidateBucketIndex};
  assert.equal(collector.cancelInitialVisibility,undefined);
  const geometry={v:[.1,.2,.3,0,1,0,0,0],detailWidth:2},matrix=Y.M.identity();
  Y.Engine.prototype.add.call(collector,'mesh',geometry,matrix,'#ffffff',[0,7,0,0]);
  const bucket=collector.buckets.get('mesh'),firstGeometry=bucket.geometry;
  assert.deepEqual(Array.from(firstGeometry.v),geometry.v.map(Math.fround));
  assert.equal(bucket.detailWidth,2);assert.equal(bucket.instances.length,28);
  // First-key mesh reuse and instance accumulation remain independent of GL.
  Y.Engine.prototype.add.call(collector,'mesh',{v:[99]},matrix,[.2,.3,.4],[0,8,0,0]);
  assert.equal(bucket.geometry,firstGeometry);assert.equal(bucket.instances.length,56);
  assert.equal(collector.stats.instances,2);assert.equal(collector.bucketIndexGeneration,2);
  assert.equal(collector.bucketIndex,null);assert.equal(collector.bucketIndexJob,null);
  // beginPrepared also borrows the same CPU invalidation entry point.
  collector.visibilityCaches=new Map();
  Y.Engine.prototype.beginPrepared.call(collector,{version:2,meshes:[],buckets:[],stats:{}});
  assert.equal(collector.buckets.size,0);assert.equal(collector.preparedInstanceCount,0);
});
