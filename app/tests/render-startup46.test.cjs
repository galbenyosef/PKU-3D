const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),c=vm.createContext({YY:{M:require('../src/math.js')},performance});
for(const file of ['visibility.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(root,'src',file),'utf8'),c);
function compiler(failCompile=0,failLink=0){let shaderId=0,programId=0;const shaders=[],programs=[],events=[];
 const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,
 createShader(type){const x={id:++shaderId,type,deleted:0};shaders.push(x);return x;},shaderSource(s,src){s.source=src;},compileShader(){events.push('compile');},getShaderParameter(s){events.push('shader-status');return s.id!==failCompile;},getShaderInfoLog(){return 'compile failure';},deleteShader(s){s.deleted++;},
 createProgram(){const p={id:++programId,deleted:0,attached:new Set()};programs.push(p);return p;},attachShader(p,s){p.attached.add(s);},detachShader(p,s){assert.equal(p.deleted,0,'detach before deleting the program');p.attached.delete(s);},linkProgram(){events.push('link');},getProgramParameter(p){events.push('program-status');return p.id!==failLink;},getProgramInfoLog(){return 'link failure';},deleteProgram(p){assert.equal(p.attached.size,0);p.deleted++;}};
 const e=Object.create(c.YY.Engine.prototype);e.gl=gl;return{e,shaders,programs,events};
}
test('initial programs share identical stages, then release every temporary shader exactly once',()=>{
 const {e,shaders,programs}=compiler();e.compilePrograms();assert.equal(programs.length,9);assert.equal(shaders.length,14);assert.equal(e.shaderCache,null);assert.ok(e.membrane);
 // Ceramic uses its own vertex stage; the remaining identical stages stay shared.
 assert.equal(shaders.filter(s=>s.type===e.gl.VERTEX_SHADER).length,5);assert.equal(shaders.filter(s=>s.type===e.gl.FRAGMENT_SHADER).length,9);
 assert.equal(new Set(shaders.map(s=>s.type+'\0'+s.source)).size,shaders.length);
 assert.ok(shaders.every(s=>s.deleted===1));assert.ok(programs.every(p=>!p.deleted&&!p.attached.size));
 e.program('dynamic vertex','dynamic fragment');assert.equal(shaders.length,16);assert.ok(shaders.every(s=>s.deleted===1));
});
test('compile and link failures release partial programs and shared stages without invalid detach calls',()=>{
 for(const [compile,link]of [[3,0],[0,3]]){const {e,shaders,programs}=compiler(compile,link);assert.throws(()=>e.compilePrograms(),/failure/);assert.equal(e.shaderCache,null);assert.ok(shaders.every(s=>s.deleted===1));assert.ok(programs.every(p=>p.deleted===1));}
});
test('instance metadata can compile before mesh upload, but readiness still requires every GPU buffer',async()=>{
 const e=Object.create(c.YY.Engine.prototype),b={count:1,detailWidth:0,resource:{vertexCount:3,indexType:'uint16',vertexBuffer:null,indexBuffer:null}};
 e.buckets=new Map([['mesh',b]]);e.visibilityCaches=new Map();e.gl={bindVertexArray(){}};
 let compiled=0;const original=e.compileBucket;e.compileBucket=function(bucket){compiled++;return original.call(this,bucket);};
 const data=new Float32Array(28),spatial=new Float32Array([0,1,0,2,1]);for(const i of [0,5,10,15])data[i]=1;data[20]=18;data[21]=123;
 e.preparedInstances({key:'mesh'},data,spatial);assert.equal(compiled,1);assert.equal(b.uniformId,123);
 await assert.rejects(()=>e.finishPrepared(async()=>{}),/Incomplete prepared scene bucket/);
 b.resource.vertexBuffer={};b.resource.indexBuffer={};await e.finishPrepared(async()=>{});assert.equal(compiled,1);assert.equal(b.data,data);assert.equal(b.spatial,spatial);
 assert.throws(()=>e.preparedInstances({key:'mesh'},new Float32Array(1),spatial),/Incomplete/);assert.equal(b.data,data);
 e.disposed=true;assert.throws(()=>e.preparedInstances({key:'mesh'},data,spatial),/interrupted/);
});
function resources(Y){const source=fs.readFileSync(path.join(root,'src/app-v29.js'),'utf8').match(/async function loadRenderResources\(next,onProgress,prepared\)\{[\s\S]*?\n\}/)[0];const run=new Function('Y',source+';return loadRenderResources;')(Y);return(next,...args)=>{next.loadScan1119??=async()=>{};return run(next,...args);};}
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};}
test('scan textures also gate readiness and all three resources settle before failure cleanup',async()=>{
 for(const failed of [null,'texture','scene','scan']){
  const jobs={texture:deferred(),scene:deferred(),scan:deferred()},error=new Error(failed||'unused'),events=[];
  const load=resources({SCENE_PACKAGE46:{},SceneCache46:{load:()=>jobs.scene.promise}});
  let settled=false;
  const ready=load({loadMaterials:()=>jobs.texture.promise,loadScan1119:()=>jobs.scan.promise,finishPrograms(){events.push('validate');}});
  const checked=ready.then(()=>{settled=true;assert.equal(failed,null);},e=>{settled=true;assert.equal(e,error);});
  if(failed)jobs[failed].reject(error);
  const pending=Object.keys(jobs).filter(k=>k!==failed);
  for(const name of pending.slice(0,-1))jobs[name].resolve({});
  await new Promise(resolve=>setImmediate(resolve));assert.equal(settled,false);assert.deepEqual(events,[]);
  jobs[pending.at(-1)].resolve({});await checked;assert.deepEqual(events,failed?[]:['validate']);
 }
});
test('texture and scene startup overlap, with readiness waiting for both',async()=>{
 const texture=deferred(),scene=deferred(),calls=[],expected={registry:new Map()};
 const load=resources({SCENE_PACKAGE46:{},SceneCache46:{load(){calls.push('scene');return scene.promise;}}});
 let settled=false;const ready=load({loadMaterials(){calls.push('texture');return texture.promise;}}).then(x=>{settled=true;return x;});
 await Promise.resolve();assert.deepEqual(calls,['texture','scene']);scene.resolve(expected);await Promise.resolve();assert.equal(settled,false);
 texture.resolve();assert.equal(await ready,expected);
});
test('failed startup waits for the other upload before allowing disposal',async()=>{
 for(const failed of ['texture','scene']){
  const texture=deferred(),scene=deferred(),error=new Error(failed);let settled=false;
  const load=resources({SCENE_PACKAGE46:{},SceneCache46:{load:()=>scene.promise}}),ready=load({loadMaterials:()=>texture.promise});
  const checked=ready.catch(e=>{settled=true;assert.equal(e,error);});
  ({texture,scene})[failed].reject(error);await Promise.resolve();await Promise.resolve();assert.equal(settled,false);
  ({texture,scene})[failed==='texture'?'scene':'texture'].resolve({});await checked;assert.equal(settled,true);
 }
});
test('uncached scene construction remains available and propagates errors',async()=>{
 const expected={},load=resources({createMetricCampus:()=>expected});assert.equal(await load({loadMaterials:async()=>{}}),expected);
 const fail=resources({createMetricCampus(){throw new Error('scene failure');}});await assert.rejects(fail({loadMaterials:async()=>{}}),/scene failure/);
});

test('initial program batch submits every link before synchronizing shader status',()=>{
 const {e,events}=compiler();e.compilePrograms();assert.equal(events.filter(x=>x==='link').length,9);
 assert.ok(events.lastIndexOf('link')<events.indexOf('shader-status'));
 assert.ok(events.lastIndexOf('shader-status')<events.indexOf('program-status'));assert.equal(e.programBatch,null);
});

test('renderer construction failure releases decoders started before it',async()=>{
 const text=fs.readFileSync(path.join(root,'src/app-v29.js'),'utf8').match(/async function init\(recover=false\)\{[\s\S]*?\n\}/)[0],events=[],rootNode={dataset:{}};
 const Y={SCENE_PACKAGE46:{},SceneCache46:{warmup(){events.push('warmup');return{dispose(){events.push('dispose');}};}},Engine:class{constructor(){events.push('engine');throw Error('GPU initialization failed');}}};
 const run=new Function('Y','root','events',`let renderGeneration=0,ready=false;const canvas={},console={error(){}},$=()=>({}),changeMode=mode=>events.push(mode);${text};return init(true);`);
 await run(Y,rootNode,events);assert.deepEqual(events,['warmup','engine','plan','dispose']);assert.equal(rootNode.dataset.ready,'plan-only');
});

test('deferred compilation issues links without blocking status queries and validates once',()=>{
 const {e,events,shaders}=compiler();e.compilePrograms(true);
 assert.equal(events.filter(x=>x==='link').length,9);assert.equal(events.includes('shader-status'),false);
 assert.ok(shaders.every(s=>s.deleted===0));e.finishPrograms();e.finishPrograms();
 assert.equal(events.filter(x=>x==='program-status').length,9);assert.ok(shaders.every(s=>s.deleted===1));
});
test('deferred shader failures cannot pass readiness and cancelled stages release once',async()=>{
 for(const [compile,link]of [[3,0],[0,3]]){
  const {e,shaders,programs}=compiler(compile,link);e.compilePrograms(true);
  const load=resources({createMetricCampus:()=>({})});e.loadMaterials=async()=>{};e.loadScan1119=async()=>{};
  await assert.rejects(load(e),/failure/);assert.ok(shaders.every(s=>s.deleted===1));assert.ok(programs.every(p=>p.deleted===1));
 }
 const {e,shaders,events}=compiler();e.compilePrograms(true);e.disposed=true;e.releaseProgramStages();e.releaseProgramStages();
 assert.ok(shaders.every(s=>s.deleted===1));assert.throws(()=>e.finishPrograms(),/interrupted/);assert.equal(events.includes('shader-status'),false);
});
test('readiness validates deferred programs only after both uploads settle',async()=>{
 const texture=deferred(),scene=deferred(),events=[];
 const load=resources({SCENE_PACKAGE46:{},SceneCache46:{load:()=>scene.promise}});
 const ready=load({loadMaterials:()=>texture.promise,finishPrograms(){events.push('validate');}});
 scene.resolve({});await Promise.resolve();await Promise.resolve();assert.deepEqual(events,[]);
 texture.resolve();await ready;assert.deepEqual(events,['validate']);
});
