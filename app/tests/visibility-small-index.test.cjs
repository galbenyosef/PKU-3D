const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../src/visibility.js'),'utf8');
const context=vm.createContext({YY:{},Float32Array,Float64Array,Uint8Array,Uint32Array,Map,Set});
vm.runInContext(source,context);const V=context.YY.Visibility;
const bytes=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
const state={selected:0,isolate:0,explode:0,detailLOD:true,vegetation:true,routeEdges:new Set()};
const planes=[[1,0,0,100]];
function fixture({n=8,material=25,width=0,size=2,ids,part=2}={}){
 const data=new Float32Array(n*28),spatial=new Float32Array(n*5);
 for(let k=0;k<n;k++){const i=k*28;data[i]=data[i+5]=data[i+10]=data[i+15]=1;data[i+20]=material;data[i+21]=ids?.[k]??17;data[i+23]=part;const words=new Uint32Array(data.buffer);words[i+18]=0x80000000;words[i+19]=0x7fc01234;spatial.set([0,0,0,1,size],k*5);}
 const b={data,spatial,count:n,detailWidth:width};V.compile(b);return b;
}
// Complete the same public, incremental index preparation used by the renderer.
function prepare(b,epoch){const iterator=V.buildBucketIndexSteps(new Map([['fixture',b]]),epoch);let step;do{step=iterator.next();}while(!step.done);assert.equal(step.value.epoch,epoch);assert.equal(step.value.size,1);}
function compare(options={},expected={count:8,culled:0}){
 const {bucket={},mode='ample',changes={},eye=[0,0,0],focal=800,pa=planes,epochMode='current',mutate}=options;
 const snapshots=[];
 for(const optimized of [false,true]){
  const b=fixture(bucket),epoch={};prepare(b,epoch);if(mutate)mutate(b);
  const sourceBefore=Buffer.from(bytes(b.data));
  const out=mode==='alias'?b.data:new Float32Array(mode==='grow'?29:28+b.data.length+28).fill(-77);
  const stream={data:out,used:28},result={count:99,culled:99};
  const activeEpoch=optimized?(epochMode==='current'?epoch:epochMode==='wrong'?{}:null):null;
  assert.equal(V.select(b,pa,eye,focal,{...state,...changes},stream,false,true,result,activeEpoch),result);
  assert.equal(result.count,expected.count);assert.equal(result.culled,expected.culled);assert.equal(stream.used,28);
  assert.deepEqual(bytes(b.data),sourceBefore);
  snapshots.push({count:result.count,culled:result.culled,output:Buffer.from(bytes(stream.data)),source:sourceBefore});
 }
 assert.deepEqual(snapshots[1],snapshots[0],'epoch and no-epoch full bytes/capacity differ');return snapshots[1];
}
test('no epoch retains scalar plane/detail traversal; indexed epoch preserves nonempty raw copy',()=>{
 const b=fixture(),epoch={};prepare(b,epoch);let eyeReads=0,planeReads=0;
 const eye=new Proxy([0,0,0],{get(t,k){if(['0','1','2'].includes(k))eyeReads++;return t[k];}});
 const plane=new Proxy(planes[0],{get(t,k){if(['0','1','2','3'].includes(k))planeReads++;return t[k];}});
 const stream={data:new Float32Array(280).fill(-77),used:28};
 const r=V.select(b,[plane],eye,800,state,stream,false,true,undefined,null);
 assert.equal(r.count,8);assert.equal(r.culled,0);assert.equal(eyeReads,24);assert.equal(planeReads,36);
 const checked=compare();assert.deepEqual(checked.output.subarray(28*4,9*28*4),checked.source);
 assert.deepEqual(checked.output.subarray(0,28*4),bytes(new Float32Array(28).fill(-77)));
 assert.deepEqual(checked.output.subarray(9*28*4),bytes(new Float32Array(28).fill(-77)));
});
test('LOD, surface and material38 thresholds preserve equality and neighbours',()=>{
 for(const [bucket,limit]of [[{size:2},1000],[{material:4,width:.85},800],[{material:38,size:2},2*800/.85]]){
  for(const scale of [1-1e-10,1,1+1e-10])compare({bucket,changes:bucket.material===38?{selected:17}:{},eye:[limit*scale,0,0]},scale>1?{count:0,culled:8}:{count:8,culled:0});
 }
 for(const distance of [259.999999,260,260.000001])compare({bucket:{size:0},eye:[distance,0,0]},distance<260?{count:8,culled:0}:{count:0,culled:8});
});
test('route, vegetation, isolate, selected and explode filters keep exact counts',()=>{
 compare({bucket:{ids:[950001,17,17,17,17,17,17,17]}},{count:7,culled:0});
 compare({bucket:{ids:[950001,17,17,17,17,17,17,17]},changes:{routeEdges:new Set([1])}});
 compare({bucket:{ids:[800001,17,17,17,17,17,17,17]},changes:{vegetation:false}},{count:7,culled:0});
 compare({changes:{isolate:17}});compare({changes:{isolate:99}},{count:0,culled:0});
 compare({changes:{selected:17},eye:[2000,0,0]});
 compare({changes:{selected:17,explode:2},pa:[[0,-1,0,1]]},{count:0,culled:0});
});
test('capacity growth and source/output alias retain generic copy semantics',()=>{
 compare({mode:'grow'});compare({mode:'alias'});
 for(const n of [7,8,127,128])compare({bucket:{n}},{count:n,culled:0});
});
test('invalidated epoch and replaced source identities do not reuse stale acceptance',()=>{
 for(const epochMode of ['none','wrong'])compare({epochMode,mutate:b=>{b.data[21]=950001;}},{count:7,culled:0});
 compare({mutate:b=>{b.data=new Float32Array(b.data);b.data[21]=950001;}},{count:7,culled:0});
 compare({mutate:b=>{b.spatial=new Float32Array(b.spatial);b.spatial[0]=-200;}},{count:7,culled:0});
 // In-place metadata changes are supported only after invalidating/rebuilding the epoch.
 const b=fixture(),oldEpoch={};prepare(b,oldEpoch);b.data[21]=950001;V.compile(b);const nextEpoch={};prepare(b,nextEpoch);
 const result=V.select(b,planes,[0,0,0],800,state,{data:new Float32Array(280),used:28},false,true,undefined,nextEpoch);
 assert.equal(result.count,7);assert.equal(result.culled,0);
});
