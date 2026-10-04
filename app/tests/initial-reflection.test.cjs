'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
// Load the maintained runtime beside this test. GPU endpoints and scheduling
// are fake; visibility, water-footprint and render control flow are real.
const source=path.resolve(__dirname,'../src');
const scripts=['math.js','visibility.js','reflection-footprint.js','engine.js'].map(name=>
  new vm.Script(fs.readFileSync(path.join(source,name),'utf8'),{filename:name}));
const plain=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
function fixture({waterCount=2,mixed=false,noBounds=false,animated=false}={}){
  let clock=0,id=0,gpu=0,failUpload=false;
  const idle=new Map(),glCalls=[],draws=[];
  const context=vm.createContext({YY:{},performance:{now:()=>clock+=.25},
    requestIdleCallback:fn=>{idle.set(++id,fn);return id;},cancelIdleCallback:key=>idle.delete(key)});
  for(const script of scripts)script.runInContext(context);
  const C=vm.runInContext('({Map,Set,Float32Array,Uint16Array,WeakMap})',context),Y=context.YY;
  Y.Atmosphere={fog:()=>[0,0,0,0]};Y.DATA={toWorld:()=>[0,0]};
  const gl=new Proxy({}, {get(target,name){
    if(name in target)return target[name];
    if(/^[A-Z_0-9]+$/.test(name))return target[name]=String(name);
    return target[name]=()=>{
      glCalls.push(name);
      if(name==='bufferData'&&failUpload)throw Error('upload failed');
      if(['createBuffer','createVertexArray','fenceSync'].includes(name))return{gpu:++gpu};
      if(name==='isContextLost')return false;
    };
  }});
  const e=Object.assign(Object.create(Y.Engine.prototype),{
    gl,canvas:{width:1440,height:1000,clientWidth:1440,clientHeight:1000},aspect:1.44,
    shadowSize:2048,buckets:new C.Map(),visibilityCaches:new C.Map(),
    stats:{instances:64,triangles:64,visibilityBuilds:0,instanceUploadBytes:0},meshResources:[],
    shadowDirty:true,frameFences:[],shadowTarget:{f:{}},reflectTarget:{f:{},w:896,h:622},
    sceneTarget:{msF:{}},shadow:{},main:{},lastReflection:-1,frame:0
  });
  const waters=[],vertices=new C.Float32Array([-2,0,-2,0,1,0,0,0,2,0,-2,0,1,0,0,0,-2,0,2,0,1,0,0,0]);
  for(let i=0;i<64;i++){
    const water=i<waterCount,count=water&&mixed&&i===0?2:1;
    const data=new C.Float32Array(28*count),spatial=new C.Float32Array(5*count),x=i%15-7,z=Math.floor(i/15)-2;
    for(let j=0;j<count;j++){
      const d=j*28,s=j*5;data[d]=data[d+5]=data[d+10]=data[d+15]=1;
      data[d+12]=x;data[d+13]=water?i*.5:2;data[d+14]=z;
      data[d+20]=water&&j===0?4:i%17===0?44:0;data[d+21]=i===3?950001:i+1;data[d+22]=water&&animated?1:0;data[d+23]=1.5;
      spatial.set([x,data[d+13],z,3,1],s);
    }
    const resource={vertexCount:3,vertexBuffer:{},indexBuffer:null,vertexPublication:water?0:1};
    if(water&&!noBounds)resource.waterBounds=[0,0,0,2,0,2];
    e.meshResources.push(resource);
    const b={data,spatial,count,vertexCount:3,detailWidth:0,passes:new C.Map(),resource,tag:i};
    Y.Visibility.compile(b);e.prepareRanges(b);b.preparedCompiled=true;e.buckets.set('b'+i,b);
    if(water)waters.push({b,resource,index:i});
  }
  e.preparedInstanceCount=e.buckets.size;
  e.draw=function(program,vp,eye,pass){
    draws.push({pass,vp:plain(vp),eye:plain(eye),scissor:plain(this.reflectionCullRect),planes:plain(this.reflectionFootprintPlanes)});
    this.visibleScene(vp,pass===1?0:pass);
  };
  e.sky=()=>{};e.present=()=>{};e.frameAvailable=()=>true;
  const camera={eye:[0,40,50],target:[0,0,0],fov:.8,offsetX:-.18,offsetY:.07};
  const state={hour:10.5,season:1,weather:0,time:0,selected:0,isolate:0,explode:0,detailLOD:false,
    vegetation:true,routeEdges:new C.Set([1]),bucketSpatialIndex:false};
  function step(budget=8){
    assert(idle.size,'queued idle callback');const[key,fn]=idle.entries().next().value;idle.delete(key);
    const before=glCalls.length;fn({timeRemaining:typeof budget==='function'?budget:()=>budget});assert.equal(glCalls.length,before,'early idle work must never touch GL');
  }
  function finishIdle(){let n=0;while(idle.size){assert(++n<100,'bounded idle work');step();}}
  function publish(i=0,invalid=false){const v=vertices.slice();if(invalid)v[9]=1;e.preparedVertices(waters[i].index,v);}
  function publishAll(invalid=false){for(let i=0;i<waters.length;i++)publish(i,invalid);}
  function render(){
    e.render(camera,state);
    const visibility=[...e.visibilityCaches].sort((a,b)=>a[0]-b[0]).map(([slot,c])=>({
      slot,key:c.key,items:c.items.map(i=>[i.b.tag,i.record.offset,i.record.count,i.ranges]),
      drawItems:c.drawItems.map(i=>[i.b.tag,i.record.offset,i.record.count,i.pageRange208]),
      clearStart:c.clearStart,drawClearStart:c.drawClearStart,submitted:c.submitted,triangles:c.triangles,culled:c.culled,
      bytes:Buffer.from(e.instanceStreams.get(slot).data.buffer,0,e.instanceStreams.get(slot).used*4).toString('hex')
    }));
    return plain({visibility,draws,vp:e.vp,lightVP:e.lightVP,projection:e.projection,refVP:e.refVP,
      sun:e.sun,waterLevel:e.waterLevel,shadowCenter:e.shadowCenter,shadowRadius:e.shadowRadius});
  }
  return{e,C,Y,context,camera,state,waters,vertices,idle,glCalls,draws,step,finishIdle,publish,publishAll,render,
    prepare(){e.prepareInitialVisibility(camera,state);},
    ready(){publishAll();this.prepare();finishIdle();},failUploads(){failUpload=true;}};
}
function released(f){
  assert.equal(f.idle.size,0);assert.equal(f.e.initialVisibilityJob,null);assert.equal(f.e.initialReflectionWait,null);
  assert.equal(f.e.initialVisibilityPlans,null);assert.equal(f.e.initialVisibilityStats.retainedBytes,0);
}
function reflectionOnly(f){return f.draws.find(d=>d.pass===3);}

// These compare synchronous and early paths of the SAME maintained engine.
// Cross-version research comparisons are deliberately kept outside this suite.

test('main/shadow finish without water; final successful water event queues slot3 once',async()=>{
  const f=fixture(),ordinary=fixture();f.prepare();f.finishIdle();
  assert.deepEqual([...f.e.initialVisibilityPlans.keys()],[0,2]);assert.equal(f.e.initialVisibilityJob,null);
  assert.equal(f.e.initialReflectionWait.pending.size,2);assert.equal(f.idle.size,0,'waiting does not poll');
  f.publish(0);assert.equal(f.idle.size,0);assert.equal(f.e.initialReflectionWait.pending.size,1);
  const live=[f.e.state,f.e.camera,f.e.waterLevel,f.e.refVP,f.e.reflectionCullRect,f.e.reflectionFootprintPlanes];
  f.publish(1);assert.equal(f.idle.size,1);assert.equal(f.e.initialVisibilityStats.reflectionStartedAt,undefined,'event only schedules');
  f.finishIdle();assert.deepEqual([...f.e.initialVisibilityPlans.keys()],[0,2,3]);
  assert.deepEqual([f.e.state,f.e.camera,f.e.waterLevel,f.e.refVP,f.e.reflectionCullRect,f.e.reflectionFootprintPlanes],live);
  assert(f.waters.every(({b})=>!b.reflectionFootprintWorld),'early footprint cache is job-owned');
  assert.equal(f.e.initialVisibilityStats.failed,undefined);assert.equal(f.e.initialVisibilityStats.reflectionFailed,undefined);
  await f.e.finishPrepared(async()=>{});ordinary.publishAll();
  assert.deepEqual(f.render(),ordinary.render());assert.equal(f.e.initialVisibilityStats.adoptedMask,13);
  assert.equal(f.e.initialVisibilityStats.adopted,3);assert.equal(reflectionOnly(f).planes.length,8);
  assert(f.waters.every(({b})=>b.reflectionFootprintWorld),'only real render fills live world cache');released(f);
});


test('water already ready and water arriving during main/shadow both schedule one later reflection job',()=>{
  for(const timing of ['before','during']){
    const f=fixture();if(timing==='before')f.publishAll();f.prepare();
    if(timing==='during'){
      while(!f.e.initialVisibilityPlans.has(0))f.step();const mainJob=f.e.initialVisibilityJob;
      f.publishAll();assert.equal(f.e.initialVisibilityJob,mainJob);assert.equal(f.idle.size,1);
    }
    f.finishIdle();assert.equal(f.e.initialVisibilityStats.completed,3);assert.equal(f.idle.size,0);
    f.render();assert.equal(f.e.initialVisibilityStats.adoptedMask,13);released(f);
  }
});


test('completed-null footprint is ready; never confuse shared buffer or bounds with publication',()=>{
  const f=fixture(),ordinary=fixture();f.prepare();f.finishIdle();
  assert(f.waters.every(({resource,b})=>resource.vertexBuffer&&b.waterRanges));assert.equal(f.e.initialVisibilityStats.completed,2);
  f.publishAll(true);ordinary.publishAll(true);assert(f.waters.every(({resource})=>resource.vertexPublication===1&&resource.reflectionFootprint===null));
  f.finishIdle();assert.equal(f.e.initialVisibilityStats.completed,3);
  assert.deepEqual(f.render(),ordinary.render());assert.equal(reflectionOnly(f).planes,null);assert.equal(f.e.initialVisibilityStats.adoptedMask,13);
});


test('no water queues no reflection wait/job',()=>{
  const f=fixture({waterCount:0});f.prepare();f.finishIdle();assert.equal(f.e.initialVisibilityStats.completed,2);
  assert(!f.e.initialReflectionWait);assert.equal(f.idle.size,0);f.render();assert(!reflectionOnly(f));
});


test('explicit main matrix participates in slot3 key even with unchanged reflected matrix',()=>{
  const f=fixture();f.ready();const context=f.e.initialVisibilityPlans.get(3),jobSources=context.reflectionSources;
  assert(jobSources.every(s=>s.bucket.resource===s.resource));
  const frame=f.e.frameMatrices(f.camera,f.state),view=f.e.reflectionView(f.e.initialVisibilityPlans.get(0).plan,f.camera,f.state,frame.projection);
  const descriptor=f.e.reflectionDescriptor(f.e.initialVisibilityPlans.get(0).plan,frame.vp,view.vp,view.waterLevel,f.e.canvas,f.e.reflectTarget,f.state,new f.C.WeakMap());
  const first=f.e.visiblePlanContext(view.vp,3,f.state,f.camera,descriptor).key;
  const mainVP=frame.vp.slice();mainVP[12]+=.001;
  assert.notEqual(f.e.visiblePlanContext(view.vp,3,f.state,f.camera,{...descriptor,mainVP}).key,first);
});


test('first real render cancels waiting and queued slot3; late publication cannot resurrect work',()=>{
  for(const queued of [false,true]){
    const f=fixture();f.prepare();f.finishIdle();if(queued)f.publishAll();
    const stale=f.idle.values().next().value;f.render();released(f);
    if(!queued)f.publishAll();if(stale)stale({timeRemaining:()=>8});released(f);
  }
});


test('optional footprint failure preserves finished main/shadow plans',()=>{
  const f=fixture(),ordinary=fixture();f.prepare();f.finishIdle();f.publishAll();ordinary.publishAll();
  const planes=f.Y.ReflectionFootprint.planes;f.Y.ReflectionFootprint.planes=()=>{throw Error('optional footprint failure');};
  f.finishIdle();f.Y.ReflectionFootprint.planes=planes;
  assert.match(f.e.initialVisibilityStats.reflectionFailed,/optional footprint failure/);assert.equal(f.e.initialVisibilityStats.failed,undefined);
  assert.deepEqual([...f.e.initialVisibilityPlans.keys()],[0,2]);assert.deepEqual(f.render(),ordinary.render());assert.equal(f.e.initialVisibilityStats.adoptedMask,5);released(f);
});


test('source drift between reflection slices cancels only slot3',()=>{
  const f=fixture();f.prepare();f.finishIdle();f.publishAll();let deadlines=0;f.step(()=>++deadlines<=2?8:0);
  assert(f.e.initialVisibilityJob?.reflection);f.waters[0].resource.reflectionFootprint={...f.waters[0].resource.reflectionFootprint};
  f.finishIdle();assert.deepEqual([...f.e.initialVisibilityPlans.keys()],[0,2]);assert.equal(f.e.initialVisibilityStats.reflectionCancelled,true);
  f.render();assert.equal(f.e.initialVisibilityStats.adoptedMask,5);released(f);
});


test('failed vertex upload never declares readiness',()=>{
  const f=fixture();f.prepare();f.finishIdle();f.failUploads();
  assert.throws(()=>f.publish(0),/upload failed/);assert.equal(f.waters[0].resource.vertexPublication,0);
  assert.equal(f.e.initialReflectionWait.pending.size,2);assert.equal(f.idle.size,0);
});


test('page208 successful logical publication, not aliased VBO, releases readiness',()=>{
  const f=fixture();f.prepare();f.finishIdle();
  const members=f.waters.map(w=>w.resource),arr=new f.C.Float32Array(48);arr.set(f.vertices,0);arr.set(f.vertices,24);
  const page={members,vertexBytes:192,indexBytes:12,vertexSeen:[false,false],indexSeen:[false,false],indexRemaining208:2,packedIndices208:null};
  members.forEach((m,i)=>Object.assign(m,{page208:page,pageMember208:i,pageVertexBase208:i*3,indexByteOffset208:i*6,buffer:{offset:i*96,length:24},originalIndexed208:false}));
  f.e.pages208=[page];f.e.preparedVertices(0,new f.C.Float32Array(arr.buffer,0,24));
  assert(members[1].vertexBuffer);assert.equal(members[0].vertexPublication,1);assert.equal(members[1].vertexPublication,0);
  assert.equal(f.e.initialReflectionWait.pending.size,1);assert.equal(f.idle.size,0);
  f.e.preparedVertices(1,new f.C.Float32Array(arr.buffer,96,24));assert.equal(members[1].vertexPublication,1);assert.equal(f.idle.size,1);
  f.finishIdle();assert.equal(f.e.initialVisibilityStats.completed,3);
  assert.throws(()=>f.e.preparedVertices(1,new f.C.Float32Array(arr.buffer,96,24)),/Invalid/);assert.equal(members[1].vertexPublication,1);
});


test('empty idle budget defers reflection descriptor setup and preserves one callback',()=>{
  const f=fixture();f.prepare();f.finishIdle();f.publishAll();
  f.step(0);assert.equal(f.e.initialVisibilityStats.reflectionStartedAt,undefined);assert.equal(f.idle.size,1);
  assert(f.waters.every(({b})=>!b.reflectionFootprintWorld));f.finishIdle();assert.equal(f.e.initialVisibilityStats.completed,3);
});


test('reflection-only cancellation never consumes a main/shadow idle callback',()=>{
  const f=fixture();f.prepare();while(!f.e.initialVisibilityPlans.has(0))f.step();
  const job=f.e.initialVisibilityJob,callback=f.idle.values().next().value;assert(job&&!job.reflection);
  f.e.cancelInitialReflection();assert.equal(f.e.initialVisibilityJob,job);assert.equal(f.idle.values().next().value,callback);
  f.finishIdle();assert.deepEqual([...f.e.initialVisibilityPlans.keys()],[0,2]);f.publishAll();assert.equal(f.idle.size,0);
});


test('a stale slot3 callback cannot publish or cancel a newer main/shadow job',()=>{
  const f=fixture();f.prepare();f.finishIdle();f.publishAll();const stale=f.idle.values().next().value;
  f.prepare();const job=f.e.initialVisibilityJob;stale({timeRemaining:()=>8});assert.equal(f.e.initialVisibilityJob,job);assert.equal(f.idle.size,1);
  f.finishIdle();assert.equal(f.e.initialVisibilityStats.completed,3);f.render();assert.equal(f.e.initialVisibilityStats.adoptedMask,13);released(f);
});


test('water bucket replacement while waiting cancels reflection only',()=>{
  const f=fixture();f.prepare();f.finishIdle();f.waters[0].b.resource={...f.waters[0].resource};f.publishAll();
  assert.deepEqual([...f.e.initialVisibilityPlans.keys()],[0,2]);assert.equal(f.idle.size,0);assert.equal(f.e.initialVisibilityStats.reflectionCancelled,true);
});


test('mixed, unbounded and animated water retain conservative fallback after every required publication',()=>{
  for(const options of [{mixed:true},{noBounds:true},{animated:true}]){
    const f=fixture(options),ordinary=fixture(options);f.prepare();f.finishIdle();
    assert.equal(f.e.initialReflectionWait.pending.size,2,'all material4 items, not only main.water');
    f.publish(1);assert.equal(f.idle.size,0);f.publish(0);ordinary.publishAll();f.finishIdle();
    assert.deepEqual(f.render(),ordinary.render());assert.equal(reflectionOnly(f).planes,null);
    assert.equal(f.e.initialVisibilityStats.adoptedMask,13);released(f);
  }
});

test('changed input or reflection target/switches discard stale slot3 and match synchronous render',()=>{
  const changes=[f=>{f.camera.eye[0]+=2;},f=>{f.e.reflectTarget.w=512;},
    f=>{f.e.reflectTarget={...f.e.reflectTarget};},f=>{f.state.reflectionScissor=false;},
    f=>{f.state.reflectionFrustum=false;},f=>{f.state.reflectionFootprint=false;}];
  for(const change of changes){
    const f=fixture(),ordinary=fixture();f.ready();ordinary.publishAll();change(f);change(ordinary);
    assert.deepEqual(f.render(),ordinary.render());assert.equal(f.e.initialVisibilityStats.adoptedMask&8,0);
    assert(f.e.initialVisibilityStats.discarded>0);released(f);
  }
});

test('epoch, recompile, disposal and target replacement clear waiting or queued reflection work',()=>{
  const actions=[f=>f.e.invalidateBucketIndex(),f=>f.e.compileBucket(f.waters[0].b),f=>f.e.dispose()];
  for(const action of actions)for(const queued of [false,true]){
    const f=fixture();f.prepare();f.finishIdle();if(queued)f.publishAll();const stale=f.idle.values().next().value;
    action(f);released(f);if(stale)stale({timeRemaining:()=>8});released(f);
  }
  const f=fixture();f.prepare();f.finishIdle();f.e.reflectTarget={...f.e.reflectTarget};f.publishAll();
  released(f);assert.equal(f.e.initialVisibilityStats.reflectionStartedAt,undefined);
});

test('publication, footprint and bucket-resource identity changes reject only stale reflection plans',()=>{
  const mutations=[f=>f.e.preparedVertexPublished(f.waters[0].resource),
    f=>{f.waters[0].resource.reflectionFootprint={...f.waters[0].resource.reflectionFootprint};},
    f=>{f.waters[0].b.resource={...f.waters[0].resource};}];
  for(const mutate of mutations){
    const f=fixture(),ordinary=fixture();f.ready();ordinary.publishAll();mutate(f);
    assert.deepEqual(f.render(),ordinary.render());assert.equal(f.e.initialVisibilityStats.adoptedMask,5);
    assert.equal(f.e.initialVisibilityStats.discarded,1);released(f);
  }
});

test('new scene initialization resets resource publication readiness',()=>{
  const f=fixture();f.e.beginPrepared({version:2,meshes:[{vertexCount:3,vertexPublication:9}],buckets:[],stats:{}});
  assert.equal(f.e.meshResources[0].vertexPublication,0);
});
