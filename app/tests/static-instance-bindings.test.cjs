'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');

// Exercise real engine methods with byte-preserving GL storage and draw reads.
const localSource=path.resolve(__dirname,'../src');
const supportSource=fs.existsSync(path.join(localSource,'math.js'))?localSource:path.resolve('app/src');
const engineSource=process.env.PKU_ENGINE_SOURCE||path.join(localSource,'engine.js');
const Y={},context=vm.createContext({YY:Y,performance,Float32Array,Float64Array,Uint8Array,Uint16Array,Uint32Array,ArrayBuffer,Map,Set});
for(const name of ['math','visibility'])vm.runInContext(fs.readFileSync(path.join(supportSource,name+'.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(engineSource,'utf8'),context);
const bytes=a=>Buffer.from(new Uint8Array(a.buffer,a.byteOffset,a.byteLength));
const words=a=>new Uint32Array(a.buffer,a.byteOffset,a.length);

function fakeGL(){
 let serial=0,vao=null,array=null;
 const trace=[],deletedBuffers=[],deletedVAOs=[],counts={creates:0,instancePointers:0,uploads:0};
 function draw(kind,args,instances){
  assert(vao,'a draw must bind a VAO');
  const first=vao.attrs[3];assert(first?.buffer.bytes,'instance buffer must be uploaded');
  for(let a=3;a<=9;a++){
   const p=vao.attrs[a];assert.equal(p.buffer,first.buffer);assert.equal(p.offset,first.offset+(a-3)*16);
   assert.equal(p.stride,112);assert.equal(p.size,4);assert.equal(p.divisor,1);
  }
  const end=first.offset+instances*112;assert(end<=first.buffer.bytes.length,'instance fetch stays in bounds');
  trace.push({kind,args,instances,index:vao.index?.name||null,
   vertices:[0,1,2].map(a=>{const p=vao.attrs[a];return[p.buffer.name,p.size,p.type,p.normalized,p.stride,p.offset];}),
   bytes:Buffer.from(first.buffer.bytes.subarray(first.offset,end))});
 }
 const gl=new Proxy({
  createBuffer(){counts.creates++;return{id:++serial};},
  createVertexArray(){return{id:++serial,attrs:{},divisors:{}};},
  bindVertexArray(v){vao=v;},
  bindBuffer(target,b){if(target==='ARRAY_BUFFER')array=b;else if(target==='ELEMENT_ARRAY_BUFFER'&&vao)vao.index=b;},
  vertexAttribDivisor(a,n){vao.divisors[a]=n;},
  vertexAttribPointer(a,size,type,normalized,stride,offset){vao.attrs[a]={buffer:array,size,type,normalized,stride,offset,divisor:vao.divisors[a]||0};if(a>=3)counts.instancePointers++;},
  bufferData(target,data){array.bytes=typeof data==='number'?new Uint8Array(data):new Uint8Array(bytes(data));counts.uploads++;},
  getBufferParameter(){return array?.bytes?.length||0;},
  bufferSubData(target,offset,data,start=0,length=data.length-start){array.bytes.set(new Uint8Array(data.buffer,data.byteOffset+start*data.BYTES_PER_ELEMENT,length*data.BYTES_PER_ELEMENT),offset);counts.uploads++;},
  drawArraysInstanced(mode,first,count,instances){draw('arrays',[mode,first,count],instances);},
  drawElementsInstanced(mode,count,type,offset,instances){draw('indexed',[mode,count,type,offset],instances);},
  deleteBuffer(b){if(b)deletedBuffers.push(b);},deleteVertexArray(v){if(v)deletedVAOs.push(v);},
 },{get:(o,k)=>k in o?o[k]:typeof k==='string'&&k===k.toUpperCase()?k:()=>{}});
 return{gl,trace,deletedBuffers,deletedVAOs,counts};
}

function fixture({shared=false,deferred=true,enabled=true,count=3,hiddenMiddle=false}={}){
 const mock=fakeGL(),buckets=new Map(),resources=[];
 for(let i=0;i<count;i++){
  const resource=shared&&resources[0]||{vertexBuffer:{name:'vertices-'+i},indexBuffer:{name:'indices-'+i},indexType:'uint16'};
  resources.push(resource);const data=new Float32Array(28);data.set(Y.M.identity());data[20]=24;data[21]=i+1;data.set([0,0,1,1],24);
  const b={count:1,data,resource,vertexCount:6,spatial:new Float32Array([hiddenMiddle&&i===1?100:0,0,0,1,1]),passes:new Map()};
  Y.Visibility.compile(b);buckets.set('b'+i,b);
 }
 const e=Object.assign(Object.create(Y.Engine.prototype),{gl:mock.gl,buckets,visibilityCaches:new Map(),instanceStreams:new Map(),
  state:{deferredInstanceVAO:deferred,staticInstanceBindings:enabled,selected:0,isolate:0,explode:0,detailLOD:false,meshCulling:true,vegetation:true,bucketSpatialIndex:false,routeEdges:new Set(),specializedCeramic:false,specializedFoliage:false,specializedOrdinary:false,specializedGround:false,skyAfterOpaque:false},
  qualityPreset:'high',camera:{eye:[0,0,10],fov:.8},canvas:{clientHeight:1000},stats:{visibilityBuilds:0,instanceUploadBytes:0},
  main:{p:{}},glass:{p:{}},membrane:{p:{}},shadowTarget:{tex:{}},reflectTarget:{w:100,h:100,tex:{}},meshResources:[],
  uniform(){},sampler(){},stateUniforms(){},disposeTarget(){},releaseProgramStages(){}});
 return{e,mock,bs:[...buckets.values()],vp:Y.M.identity()};
}

function snapshot(f,slot=0){
 const{e,mock,vp}=f;mock.trace.length=0;
 const plan=e.visibleScene(vp,slot);e.draw(e.main,vp,e.camera.eye,slot);
 const stream=e.instanceStreams.get(slot);
 return{trace:mock.trace.slice(),stream:bytes(stream.data.subarray(0,stream.used)),
  logical:Array.from(plan.items,x=>[x.record.offset,x.record.count]),heads:Array.from(plan.drawItems,x=>[x.record.offset,x.record.count])};
}
function compact(f,b=f.bs[0],pass=9){
 const stream=f.e.instanceStream(pass);stream.data=new Float32Array(28);
 f.e.instanceCache(b,pass,1,stream,b.data,true);return stream;
}
function boundDraw(f,b,stream,offset=0,count=1,pass=9){
 const record=f.e.instanceVAO(b,pass,stream,offset,count);f.e.uploadInstances(stream);
 f.mock.gl.bindVertexArray(record.vao);f.mock.gl.drawArraysInstanced(f.mock.gl.TRIANGLES,0,b.vertexCount,count);
 return record;
}

test('deferred singleton heads preserve draws across passes and retain static pointers when compact offsets move',()=>{
 const f=fixture(),ordinary=fixture({enabled:false});
 for(const slot of [0,2,3]){
  assert.deepEqual(snapshot(f,slot),snapshot(ordinary,slot));
  for(const b of f.bs)assert.equal(b.passes.get(slot).instanceBuffer,f.e.staticInstanceBindings.buffer);
  const before={...f.mock.counts};snapshot(f,slot);assert.deepEqual(f.mock.counts,before,'cached visibility changes no pointers or uploads');
 }
 const before=f.mock.counts.instancePointers;
 for(const x of [f,ordinary]){x.e.state.isolate=2;x.e.visibilityCaches.clear();}
 assert.deepEqual(snapshot(f),snapshot(ordinary));
 const record=f.bs[1].passes.get(0);
 assert.equal(record.offset,0,'public offset follows the compact stream');assert.equal(record.instanceOffset,28);
 assert.equal(f.mock.counts.instancePointers,before,'unchanged static bytes need no new attribute pointers');
});

for(const deferred of [false,true])test('shared-mesh A/C grouped draw skips arena B; deferred='+deferred,()=>{
 const f=fixture({shared:true,deferred,hiddenMiddle:true});f.e.prepareStaticInstanceBindings();
 const result=snapshot(f),stream=f.e.instanceStreams.get(0);
 assert.deepEqual(result.logical,[[0,1],[28,1]],'grouping leaves logical counts intact');
 assert.deepEqual(result.heads,[[0,2]]);assert.equal(result.trace.length,1);
 assert.deepEqual(result.trace[0].bytes,Buffer.concat([bytes(f.bs[0].data),bytes(f.bs[2].data)]));
 assert.equal(f.bs[0].passes.get(0).instanceBuffer,stream.buffer,'grouped head binds the live stream');
 if(!deferred){
  const b=f.bs[0],external=compact(f,b,8),record=f.e.instanceCache(b,8,1,{...external,used:0},b.data);
  assert.equal(record.instanceBuffer,external.buffer,'external immediate calls stay on the ordinary path');
 }
});

test('changed source and independently changed compact bytes fall back and can return to the immutable binding',()=>{
 const f=fixture({count:1}),b=f.bs[0],stream=compact(f,b);
 const first=boundDraw(f,b,stream),arena=f.e.staticInstanceBindings,original=bytes(b.data);
 assert.equal(first.instanceBuffer,arena.buffer);
 words(b.data)[24]=0x80000000;
 assert(f.e.staticInstanceBindingSource(b,1,stream,0),'admission follows compact bytes until the changed source is gathered');
 stream.used=0;f.e.instanceCache(b,9,1,stream,b.data,true);
 let record=boundDraw(f,b,stream);assert.equal(record.instanceBuffer,stream.buffer);assert.deepEqual(f.mock.trace.at(-1).bytes,bytes(b.data));
 new Uint8Array(b.data.buffer).set(original);stream.used=0;f.e.instanceCache(b,9,1,stream,b.data,true);
 record=boundDraw(f,b,stream);assert.equal(record.instanceBuffer,arena.buffer,'same numeric offset must still rebind the buffer');
 words(stream.data)[25]=0x3f800001;
 record=boundDraw(f,b,stream);assert.equal(record.instanceBuffer,stream.buffer);assert.deepEqual(f.mock.trace.at(-1).bytes,bytes(stream.data));
 assert.deepEqual(bytes(b.data),original);assert.deepEqual(bytes(arena.words),original);
});

test('signed zero and distinct NaN payloads survive packing, nonzero views, admission and draw reads',()=>{
 const f=fixture({count:1}),b=f.bs[0],source=new Float32Array(32);b.data=source.subarray(2,30);
 words(b.data).set([0,0x80000000,0x7fc12345,0x7fc54321,0x7f812345,0x7f800000,0xff800000,1]);
 const stream=compact(f,b),storage=new Float32Array(36);storage.set(stream.data,4);stream.data=storage.subarray(4,32);
 boundDraw(f,b,stream);const arena=f.e.staticInstanceBindings;
 assert.deepEqual(bytes(arena.words),bytes(b.data));assert.deepEqual(f.mock.trace.at(-1).bytes,bytes(b.data));
 for(const [index,value] of [[0,0x80000000],[2,0x7fc12346]]){
  const old=words(stream.data)[index];words(stream.data)[index]=value;
  const record=boundDraw(f,b,stream);assert.equal(record.instanceBuffer,stream.buffer);assert.deepEqual(f.mock.trace.at(-1).bytes,bytes(stream.data));
  words(stream.data)[index]=old;assert.equal(boundDraw(f,b,stream).instanceBuffer,arena.buffer);
 }
});

test('unsupported counts, buckets and out-of-range compact offsets refuse admission',()=>{
 const f=fixture({count:1}),b=f.bs[0],stream=compact(f,b);assert(f.e.staticInstanceBindingSource(b,1,stream,0));
 for(const count of [undefined,0,2,-1])assert.equal(f.e.staticInstanceBindingSource(b,count,stream,0),null);
 for(const offset of [-1,.5,1,28,NaN,Infinity])assert.equal(f.e.staticInstanceBindingSource(b,1,stream,offset),null);
 assert.equal(f.e.staticInstanceBindingSource({...b},1,stream,0),null,'unregistered bucket');
 b.count=2;assert.equal(f.e.staticInstanceBindingSource(b,1,stream,0),null);b.count=1;
 stream.used=27;assert.equal(f.e.staticInstanceBindingSource(b,1,stream,0),null);
});

test('diagnostic disable and reenable rebind after explicit visibility-cache invalidation',()=>{
 const f=fixture(),ordinary=fixture({enabled:false});snapshot(f);const arena=f.e.staticInstanceBindings;
 for(const enabled of [false,true]){
  f.e.state.staticInstanceBindings=enabled;f.e.visibilityCaches.clear();ordinary.e.visibilityCaches.clear();
  assert.deepEqual(snapshot(f),snapshot(ordinary));
  const stream=f.e.instanceStreams.get(0);
  for(const b of f.bs)assert.equal(b.passes.get(0).instanceBuffer,enabled?arena.buffer:stream.buffer);
 }
});

test('real stream growth preserves bytes and refreshes aliases, including empty uploads and changed views',()=>{
 const f=fixture({count:1}),b=f.bs[0],stream=compact(f,b);assert(f.e.staticInstanceBindingSource(b,1,stream,0));
 const old=stream.staticInstanceBindingWords,expected=bytes(stream.data);
 Object.defineProperty(stream.data.buffer,'transfer',{value:undefined,configurable:true});
 f.e.instanceCache(b,9,1,stream,b.data,true);
 assert.notEqual(stream.data.buffer,old.buffer);assert.deepEqual(bytes(stream.data),Buffer.concat([expected,expected]));
 assert(f.e.staticInstanceBindingSource(b,1,stream,28));assert.equal(stream.staticInstanceBindingWords.buffer,stream.data.buffer);
 stream.data=stream.data.subarray(28);stream.used=28;
 assert(f.e.staticInstanceBindingSource(b,1,stream,0));assert.equal(stream.staticInstanceBindingWords.byteOffset,stream.data.byteOffset);
 assert.equal(stream.staticInstanceBindingWords.length,28);
 stream.data=new Float32Array(28);stream.used=0;const uploads=f.mock.counts.uploads;
 f.e.uploadInstances(stream);assert.equal(stream.staticInstanceBindingWords,null);assert.equal(f.mock.counts.uploads,uploads);
});

for(const failure of ['null','undersized','oversized','upload-throws','size-query-throws'])test('optional allocation failure stays on the ordinary path: '+failure,()=>{
 const f=fixture({count:1}),b=f.bs[0],stream=compact(f,b),g=f.mock.gl;
 const saved={createBuffer:g.createBuffer,bufferData:g.bufferData,getBufferParameter:g.getBufferParameter};let attempts=0;
 g.createBuffer=()=>{attempts++;return failure==='null'?null:saved.createBuffer();};
 if(failure==='undersized'||failure==='oversized')g.getBufferParameter=()=>failure==='undersized'?108:116;
 if(failure==='upload-throws')g.bufferData=()=>{throw Error('synthetic allocation failure');};
 if(failure==='size-query-throws')g.getBufferParameter=()=>{throw Error('synthetic size query failure');};
 assert.equal(f.e.staticInstanceBindingSource(b,1,stream,0),null);assert.equal(f.e.staticInstanceBindings,null);
 assert.equal(f.mock.deletedBuffers.length,failure==='null'?0:1);
 if(failure.endsWith('throws'))assert.match(f.e.staticInstanceBindingsError,/synthetic/);
 assert.equal(f.e.staticInstanceBindingSource(b,1,stream,0),null);assert.equal(attempts,1,'failed optional arena is not retried');
 Object.assign(g,saved);assert.equal(boundDraw(f,b,stream).instanceBuffer,stream.buffer);assert.deepEqual(f.mock.trace.at(-1).bytes,bytes(b.data));
 f.e.dispose();f.e.dispose();assert.equal(new Set(f.mock.deletedBuffers).size,f.mock.deletedBuffers.length,'failed allocation is deleted only once');
});

test('more than 4 MiB of eligible records is rejected before allocation without a large scene fixture',()=>{
 const f=fixture({count:1}),data=f.bs[0].data,overCap=Math.floor(4*1024*1024/112)+1;
 // Stream virtual bucket descriptors sharing one record; retain no giant map.
 f.e.buckets={*values(){for(let i=0;i<overCap;i++)yield{count:1,data};}};
 const before=f.mock.counts.creates;assert.equal(f.e.prepareStaticInstanceBindings(),null);
 assert.equal(f.mock.counts.creates,before);assert.equal(f.mock.counts.uploads,0);
});

test('empty eligibility allocates nothing; dispose releases one arena and a fresh engine owns independent storage',()=>{
 const empty=fixture({count:0});assert.equal(empty.e.prepareStaticInstanceBindings(),null);assert.equal(empty.mock.counts.creates,0);
 const f=fixture(),fresh=fixture();assert.deepEqual(snapshot(f),snapshot(fresh));
 const arena=f.e.staticInstanceBindings,next=fresh.e.staticInstanceBindings;
 for(const key of ['buffer','words','entries'])assert.notEqual(arena[key],next[key]);
 assert.deepEqual(bytes(arena.words),bytes(next.words));
 const vaos=f.bs.map(b=>b.passes.get(0).vao);f.e.dispose();f.e.dispose();
 assert.equal(f.mock.deletedBuffers.filter(b=>b===arena.buffer).length,1);assert.equal(arena.entries.size,0);assert.equal(f.e.staticInstanceBindings,null);
 assert.equal(f.mock.deletedVAOs.length,vaos.length);for(const vao of vaos)assert.equal(f.mock.deletedVAOs.filter(v=>v===vao).length,1);
 assert.equal(fresh.mock.deletedBuffers.length,0);assert.deepEqual(snapshot(fresh).trace,fixtureTrace());
});
function fixtureTrace(){return snapshot(fixture()).trace;}
