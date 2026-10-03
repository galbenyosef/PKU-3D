'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),zlib=require('node:zlib');
const app=process.env.PKU_APP||path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(app,'src/scene-cache46.js'),'utf8'),sha=b=>crypto.createHash('sha256').update(Buffer.from(b)).digest('hex');
const moduleContext=vm.createContext({YY:{}}),marker='Y.SceneCache46={';assert.equal(source.split(marker).length,2,'One production worker export anchor');vm.runInContext(source.replace(marker,'Y.testWorkerSource=workerSource;'+marker),moduleContext);const workerSource=moduleContext.YY.testWorkerSource;
function worker(wa=WebAssembly,extra={}){const c=vm.createContext({Uint8Array,Uint32Array,Float32Array,Float64Array,ArrayBuffer,atob,Blob,Response,DecompressionStream,WebAssembly:wa,self:{},...extra});vm.runInContext(workerSource,c);return c;}
// Independently serialize known bytes into lanes, then demand exact reconstruction.
function arranged(bytes,width){const out=new Uint8Array(bytes.length);let q=0;for(let lane=0;lane<width;lane++)for(let i=lane;i<bytes.length;i+=width)out[q++]=bytes[i];return out.buffer;}
const pattern=n=>Uint8Array.from({length:n},(_,i)=>(i*197+(i>>>7)*89)&255);

test('production embedded SIMD module matches retained WAT provenance and hard memory limit',()=>{
 const bytes=Buffer.from(workerSource.match(/const encoded='([^']+)'/)[1],'base64');assert.equal(sha(bytes),'711a5061844f1c287a81ea1627e00289e29a9040815c755da2986b66ce7c3ad5');
 const wat=fs.readFileSync(path.resolve(__dirname,'../tools/scene-transpose237.wat'));assert.equal(sha(wat),'08f55fdef6ebc77caa8e097e5bdf96bc53dd01f7da3a145678e0d43a8de7cbb8');
 // The WAT is retained source, not a runtime fetch or a mandatory build dependency.
 const m=new WebAssembly.Instance(new WebAssembly.Module(bytes)).exports.memory;assert.equal(m.buffer.byteLength,512*1024);assert.throws(()=>m.grow(1),RangeError);
});

test('tile tails, uneven lanes and endian fallback preserve integer and NaN payload bits',()=>{
 const c=worker();for(const rows of[0,1,15,16,17,8191,8192,8193,16385]){const bits=new Uint32Array(rows*8),values=[0x7fc12345,0xffc76543,0x80000000,0x7f800000,0xff800000,0xffffffff,0,0x12345678];for(let i=0;i<bits.length;i++)bits[i]=values[i%values.length];const raw=new Uint8Array(bits.buffer),input=arranged(raw,32),copy=new Uint8Array(input).slice();assert.deepEqual(new Uint8Array(c.unshuffle(input,32)),raw);assert.deepEqual(new Uint8Array(input),copy);}
 for(const width of[2,4,7,32])for(const length of[1,31,33,511,513])for(const little of[false,true]){const raw=pattern(length);assert.deepEqual(new Uint8Array(c.unshuffle(arranged(raw,width),width,little)),raw);}
});

test('production helper compiles lazily and permanently falls back on absent or denied WASM',()=>{
 for(const mode of['absent','denied']){let calls=0,decoded=0;const wa=mode==='absent'?undefined:{Module:function(){calls++;throw Error('compile denied');}},c=worker(wa,{WebAssembly:wa,atob:s=>{decoded++;return atob(s);}}),raw=pattern(96),input=arranged(raw,32),copy=new Uint8Array(input).slice();assert.equal(vm.runInContext('wasm32State',c),undefined);c.unshuffle(arranged(pattern(33),32),32);assert.equal(decoded,0,'Partial records must not compile');for(let i=0;i<2;i++)assert.deepEqual(new Uint8Array(c.unshuffle(input,32)),raw);assert.deepEqual(new Uint8Array(input),copy);assert.equal(vm.runInContext('wasm32State',c),false);assert.equal(decoded,1);assert.equal(calls,mode==='absent'?0:1);}
});

test('trap after a completed tile recovers original full input and transfers only output',()=>{
 let modules=0,kernels=0;const wa={Module:function(b){modules++;return new WebAssembly.Module(b);},Instance:function(m){const real=new WebAssembly.Instance(m);return {exports:{memory:real.exports.memory,transpose32(n){if(++kernels===2)throw Error('late tile trap');real.exports.transpose32(n);}}};}};
 const c=worker(wa),raw=pattern(8193*32),input=arranged(raw,32),copy=new Uint8Array(input).slice();for(let i=0;i<2;i++){let output=c.unshuffle(input,32);const received=structuredClone(output,{transfer:[output]});assert.equal(output.byteLength,0);assert.deepEqual(new Uint8Array(received),raw);assert.deepEqual(new Uint8Array(input),copy);}assert.equal(modules,1);assert.equal(kernels,2);assert.equal(vm.runInContext('wasm32State',c),false);
});

test('actual worker awaits checksum before publishing, preserves metadata and offline decoding',async()=>{
 const vis=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.join(app,'src/visibility.js'),'utf8'),vis);const n=128,raw=pattern(n*33*4),input=arranged(raw,32),packed=zlib.gzipSync(new Uint8Array(input)),digest=crypto.createHash('sha256').update(raw).digest();let good=[];
 for(const offline of[false,true])for(const valid of[false,true]){let release,started,reply,fetches=0;const pending=new Promise(r=>release=r),called=new Promise(r=>started=r),subtle={digest:()=>{started();return pending;}},c=worker(WebAssembly,{crypto:{subtle},self:{crypto:{subtle},postMessage:(r,t)=>{reply={data:structuredClone(r,{transfer:t||[]}),count:t?.length||0};}},fetch:async()=>{fetches++;return new Response(packed);}});vm.runInContext('const essential=new Set('+JSON.stringify(vis.YY.Visibility.essentialMaterials)+');self.compileVisibility='+vis.YY.Visibility.compile.toString()+';',c);
 const request={index:7,url:'chunk',rawBytes:raw.length,shuffle:32,sha256:digest.toString('hex'),buckets:[{count:n,data:{offset:0,length:n*28},spatial:{offset:n*112,length:n*5},detailWidth:.5}],...(offline?{encoded:packed.toString('base64')}:{})};const task=c.self.onmessage({data:request});await called;assert.equal(reply,undefined,'No records published while checksum pending');release(valid?digest:new Uint8Array(32));await task;assert.equal(fetches,offline?0:1);if(valid){assert.deepEqual(new Uint8Array(reply.data.buffer),raw);assert.equal(reply.count,2);assert.equal(reply.data.compiled.length,1);good.push(reply.data);}else{assert.match(reply.data.error,/checksum mismatch/);assert.equal(reply.data.buffer,undefined);assert.equal(reply.count,0);}}
 assert.deepEqual(good[0],good[1],'HTTP and offline actual metadata/record transfer match');
});
