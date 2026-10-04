'use strict';
// Tiny, deterministic worker contracts. The decoder module boundary is stubbed;
// gzip, SHA, loader control flow and transfer decisions execute the maintained source.
// No network, official WASM, scene payload, browser or GPU is used.
const test=require('node:test'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync(path.resolve(__dirname,'../src/scene-cache46.js'),'utf8');
const instrumented=source.replace(' Y.SceneCache46={warmup,load,receive,textureSource,decodeOrder};',' Y.__codecTest={workerSource,codecOptions,localCodecURL};\n Y.SceneCache46={warmup,load,receive,textureSource,decodeOrder};');
assert.notEqual(instrumented,source,'private test accessor must attach to the loader export');
const outer={YY:{},location:{protocol:'https:',origin:'https://scene.test'},URL,crypto:require('node:crypto').webcrypto,WebAssembly,console};
vm.runInNewContext(instrumented,outer);
const originalWorker=outer.YY.__codecTest.workerSource;
new vm.Script(originalWorker);
const {gzipSync}=require('node:zlib'),{createHash,webcrypto}=require('node:crypto');
const hash=b=>createHash('sha256').update(b).digest('hex');
const raw=Uint8Array.from({length:64},(_,i)=>(i*17+5)%256),packed=gzipSync(raw);
const legacy='https://scene.test/cache/chunk.bin.gz',modern='https://scene.test/cache/chunk.meshopt-v1.bin.gz',decoderURL='https://scene.test/cache/meshopt_decoder.mjs';
const descriptor={codec:'gzip-meshopt-attributes-v1',url:modern,bytes:packed.length,sha256:hash(packed),decodedBytes:raw.length,stride:4,count:16};
function message(extra={}){return {index:7,url:legacy,rawBytes:raw.length,sha256:hash(raw),shuffle:0,buckets:[],decoderURL,alternative:{...descriptor},...extra};}
function worker(opts={}){
 const posts=[],fetches=[],imports=[],decodes=[],aborted=[];
 const ctx={Blob,Response,DecompressionStream,Uint8Array,Uint32Array,Float32Array,Float64Array,ArrayBuffer,Map,Set,URL,AbortController,WebAssembly:opts.noWasm?undefined:WebAssembly,crypto:opts.crypto||(opts.noSubtle?{}:webcrypto),atob,clearTimeout,setTimeout:opts.timeout?(fn=>setTimeout(fn,1)):setTimeout,console};
 ctx.self=ctx;ctx.compileVisibility=()=>{};
 ctx.postMessage=(data,transfers)=>posts.push({data,transfers});
 ctx.fetch=async(url,init)=>{
  fetches.push(url);if(init?.signal)init.signal.addEventListener('abort',()=>aborted.push(url));
  if(opts.responses&&Object.hasOwn(opts.responses,url)){const x=opts.responses[url];return typeof x==='function'?x():new Response(x.body,{status:x.status||200});}
  return new Response(packed);
 };
 ctx.__importDecoder=async url=>{
  imports.push(url);if(opts.importFailure)throw Error('Import rejected');
  return{MeshoptDecoder:{supported:true,ready:opts.timeout?new Promise(()=>{}):opts.readyFailure?Promise.reject(Error('Ready rejected')):Promise.resolve(),decodeVertexBuffer(...args){decodes.push(args);if(opts.decodeFailure)throw Error('Decode rejected');args[0].set(opts.badRaw?new Uint8Array(raw.length):args[3]);}}};
 };
 // Replace only the import boundary. Real fetch/inflate/length/digest/fallback logic runs below.
 const patched=originalWorker.replace('import(url)','__importDecoder(url)');assert.notEqual(patched,originalWorker);
 vm.runInNewContext(patched,ctx);
 return{ctx,posts,fetches,imports,decodes,aborted,async send(m){const before=posts.length;await ctx.onmessage({data:m});assert.equal(posts.length,before+1,'exactly one final response per task');return posts.at(-1).data;}};
}
test('modern success publishes verified bytes; one decoder import; prefetch reused',async()=>{
 const w=worker();const nextModern=modern+'-2',nextLegacy=legacy+'-2';
 const a=await w.send(message({shuffle:32,prefetchURL:nextLegacy,prefetchAlternative:{...descriptor,url:nextModern}}));
 assert.equal(a.codec,descriptor.codec);assert.equal(a.fallbackReason,undefined);assert.deepEqual(new Uint8Array(a.buffer),raw);assert.equal(w.decodes[0].length,4,'no filter parameter');
 const b=await w.send(message({index:8,url:nextLegacy,alternative:{...descriptor,url:nextModern}}));
 assert.equal(b.codec,descriptor.codec);assert.equal(w.imports.length,1);assert.deepEqual(w.fetches,[modern,nextModern]);
});
for(const [name,opts,override] of [
 ['import failure',{importFailure:true}],['ready rejection',{readyFailure:true}],['ready timeout',{timeout:true}],
 ['HTTP error',{responses:{[modern]:{status:404,body:'missing'}}}],
 ['gzip corruption',{responses:{[modern]:{body:new Uint8Array(packed.length)}}}],
 ['transport length mismatch',{}, {alternative:{...descriptor,bytes:packed.length+1}}],
 ['inflated stream length mismatch',{}, {alternative:{...descriptor,decodedBytes:raw.length+1}}],
 ['decode exception',{decodeFailure:true}],['raw checksum mismatch',{badRaw:true}],
 ['count stride mismatch',{}, {alternative:{...descriptor,count:15}}],
 ['bounded length descriptor',{}, {alternative:{...descriptor,decodedBytes:65*1024*1024}}]
])test(name+' falls back once and disables modern for this worker',async()=>{
 const w=worker(opts),r=await w.send(message(override));assert.equal(r.codec,'legacy');assert.equal(typeof r.fallbackReason,'string');assert.deepEqual(new Uint8Array(r.buffer),raw);
 const modernFetches=w.fetches.filter(x=>x===modern).length,importCount=w.imports.length;
 const again=await w.send(message());assert.equal(again.codec,'legacy');assert.equal(w.imports.length,importCount);assert.equal(w.fetches.filter(x=>x===modern).length,modernFetches);assert.equal(w.fetches.filter(x=>x===legacy).length,2);
});
test('legacy failure after modern failure remains terminal',async()=>{
 const w=worker({importFailure:true,responses:{[legacy]:{body:gzipSync(new Uint8Array(raw.length))}}});const r=await w.send(message());assert.match(r.error,/checksum mismatch/);assert.equal(r.buffer,undefined);assert.deepEqual(w.fetches,[legacy]);
});
test('prefetched modern response is aborted after raw verification failure',async()=>{
 const w=worker({badRaw:true}),nextModern=modern+'-next',nextLegacy=legacy+'-next';
 const r=await w.send(message({prefetchURL:nextLegacy,prefetchAlternative:{...descriptor,url:nextModern}}));assert.equal(r.codec,'legacy');assert.deepEqual(w.aborted,[nextModern]);
 assert.deepEqual(w.fetches,[modern,nextModern,legacy,nextLegacy]);
 const again=await w.send(message({url:nextLegacy,alternative:{...descriptor,url:nextModern}}));assert.equal(again.codec,'legacy');assert.deepEqual(w.fetches,[modern,nextModern,legacy,nextLegacy]);
});
test('legacy without extension; unknown extension; no WASM; no subtle',async()=>{
 for(const [opts,extra] of [[{}, {alternative:null}],[{}, {alternative:{...descriptor,codec:'unknown'}}],[{noWasm:true},{}],[{noSubtle:true},{}]]){
  const w=worker(opts),r=await w.send(message(extra));assert.equal(r.codec,'legacy');assert.equal(r.fallbackReason,undefined);assert.equal(w.imports.length,0);assert.deepEqual(w.fetches,[legacy]);
 }
});
test('file protocol uses retained encoded legacy without import or fetch',async()=>{
 const w=worker(),r=await w.send(message({url:'file:///scene/chunk.gz',encoded:packed.toString('base64')}));assert.equal(r.codec,'legacy');assert.equal(w.imports.length,0);assert.equal(w.fetches.length,0);assert.deepEqual(new Uint8Array(r.buffer),raw);
});
test('same-origin local resource selection and absent/unknown extensions',()=>{
 const {localCodecURL,codecOptions}=outer.YY.__codecTest,base='https://scene.test/cache/';
 assert.equal(localCodecURL(base,'meshopt_decoder.mjs'),decoderURL);
 for(const file of ['https://other.test/x','/x','../x','%2e%2e/x','%2e%2e%2fx','x?y','x#y','x\\y'])assert.equal(localCodecURL(base,file),null,file);
 const options=codecOptions({codecResources:{decoder:{file:'meshopt_decoder.mjs'}}},base);
 assert.equal(options({alternative:{...descriptor,file:'modern.gz'}}).url,base+'modern.gz');
 assert.equal(options({}),null);assert.equal(options({alternative:{codec:'unknown',file:'a'}}),null);assert.equal(codecOptions({},base)({alternative:descriptor}),null);
});
test('modern and legacy final raw SHA failure never publishes a buffer',async()=>{
 const w=worker(),r=await w.send(message({sha256:'0'.repeat(64)}));assert.match(r.error,/checksum mismatch/);assert.equal(r.buffer,undefined);assert.equal(w.posts.length,1);assert.deepEqual(w.fetches,[modern,legacy]);
});
test('modern chunk can prefetch a following legacy chunk',async()=>{
 const w=worker(),nextLegacy=legacy+'2',a=await w.send(message({prefetchURL:nextLegacy,prefetchAlternative:null}));assert.equal(a.codec,descriptor.codec);
 const b=await w.send(message({url:nextLegacy,alternative:null}));assert.equal(b.codec,'legacy');assert.deepEqual(w.fetches,[modern,nextLegacy]);assert.equal(w.imports.length,1);
});
test('legacy chunk can prefetch a following supported modern chunk',async()=>{
 const w=worker(),a=await w.send(message({alternative:null,prefetchURL:legacy+'2',prefetchAlternative:{...descriptor,url:modern+'2'}}));assert.equal(a.codec,'legacy');
 const b=await w.send(message({url:legacy+'2',alternative:{...descriptor,url:modern+'2'}}));assert.equal(b.codec,descriptor.codec);assert.deepEqual(w.fetches,[legacy,modern+'2']);
});
test('warmup remains exactly two workers and dispose terminates idempotently',()=>{
 const made=[],revoked=[];
 class MockWorker{constructor(url){this.url=url;this.terminated=0;made.push(this);}terminate(){this.terminated++;}}
 const host={YY:{Visibility:{essentialMaterials:[],compile:function(){}}},Blob,Worker:MockWorker,URL:{createObjectURL:()=> 'blob:worker',revokeObjectURL:url=>revoked.push(url)}};
 vm.runInNewContext(source,host);const pool=host.YY.SceneCache46.warmup();assert.equal(made.length,2);pool.dispose();pool.dispose();assert.deepEqual(made.map(w=>w.terminated),[1,1]);assert.deepEqual(revoked,['blob:worker']);
});
test('partial worker construction failure disposes the existing slot',()=>{
 const made=[],revoked=[];
 class MockWorker{constructor(){if(made.length)throw Error('blocked second worker');this.terminated=0;made.push(this);}terminate(){this.terminated++;}}
 const host={YY:{Visibility:{essentialMaterials:[],compile:function(){}}},Blob,Worker:MockWorker,URL:{createObjectURL:()=> 'blob:worker',revokeObjectURL:url=>revoked.push(url)}};
 vm.runInNewContext(source,host);assert.throws(()=>host.YY.SceneCache46.warmup(),/blocked/);assert.equal(made.length,1);assert.equal(made[0].terminated,1);assert.equal(revoked.length,1);
});
test('decode scheduling preserves stable instance/geometry order and does not mutate records',()=>{
 const chunks=[{rawBytes:10},{rawBytes:50},{rawBytes:20},{rawBytes:50}],content=[{buckets:[]},{buckets:[{}]},{buckets:[]},{buckets:[{}]}];
 const before=JSON.stringify({chunks,content});
 assert.deepEqual(Array.from(outer.YY.SceneCache46.decodeOrder(chunks,content)),[1,0,3,2]);
 assert.equal(JSON.stringify({chunks,content}),before);
 assert.deepEqual(Array.from(outer.YY.SceneCache46.decodeOrder(chunks,content.map(()=>({buckets:[]})))),[0,1,2,3]);
 assert.deepEqual(Array.from(outer.YY.SceneCache46.decodeOrder([],[])),[]);
});

test('modern records cannot publish until the final raw digest resolves',async()=>{
 let startDigest,releaseDigest;
 const began=new Promise(resolve=>{startDigest=resolve;});
 const gate=new Promise(resolve=>{releaseDigest=resolve;});
 const crypto={subtle:{async digest(...args){startDigest();await gate;return webcrypto.subtle.digest(...args);}}};
 const w=worker({crypto}),pending=w.send(message());
 await began;assert.equal(w.posts.length,0,'decoded bytes must remain private before raw SHA verification');
 releaseDigest();const result=await pending;assert.equal(result.codec,descriptor.codec);assert.deepEqual(new Uint8Array(result.buffer),raw);
});

test('digest rejection triggers one same-job legacy attempt and publishes no bytes if it also fails',async()=>{
 let digestCalls=0;
 const w=worker({crypto:{subtle:{async digest(){digestCalls++;throw Error('Digest unavailable');}}}});
 const result=await w.send(message());assert.match(result.error,/Digest unavailable/);assert.equal(result.buffer,undefined);
 assert.equal(digestCalls,2);assert.deepEqual(w.fetches,[modern,legacy]);assert.equal(w.posts.length,1);
});

test('decoder startup failure in one worker does not disable another worker',async()=>{
 const failed=worker({importFailure:true}),healthy=worker();
 assert.equal((await failed.send(message())).codec,'legacy');
 assert.equal((await healthy.send(message())).codec,descriptor.codec);
 assert.equal((await failed.send(message())).codec,'legacy');
 assert.equal(failed.imports.length,1);assert.equal(healthy.imports.length,1);
});
