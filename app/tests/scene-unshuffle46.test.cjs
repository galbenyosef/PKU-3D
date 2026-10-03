const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../src/scene-cache46.js'),'utf8');
function decoder(){
 const module=vm.createContext({YY:{}});vm.runInContext(source.replace('Y.SceneCache46={','Y.workerSource=workerSource;Y.SceneCache46={'),module);
 const worker=vm.createContext({self:{},Uint8Array,Uint32Array});vm.runInContext(module.YY.workerSource,worker);return worker.unshuffle;
}
function arrange(bytes,width){const out=new Uint8Array(bytes.length);let q=0;for(let lane=0;lane<width;lane++)for(let i=lane;i<bytes.length;i+=width)out[q++]=bytes[i];return out.buffer;}
test('scene byte restoration preserves every bit, including uneven lanes and big-endian fallback',()=>{
 const restore=decoder();assert.equal(typeof restore,'function');
 for(const width of [1,2,3,4,7,8,16,28,32,64])for(let length=0;length<1100;length++){
  const bytes=Uint8Array.from({length},(_,i)=>(i*197+(i>>3)*89+length)&255),shuffled=arrange(bytes,width);
  const encodedBefore=new Uint8Array(shuffled).slice();for(const little of [true,false])assert.deepEqual(new Uint8Array(restore(shuffled,width,little)),bytes,`width ${width}, length ${length}, little ${little}`);assert.deepEqual(new Uint8Array(shuffled),encodedBefore,'input stays immutable');
 }
});
test('the worker verifies restored original bytes before transferring the decoded chunk',()=>{
 assert.match(source,/buffer=unshuffle\(inflated,m.shuffle\)/);
 assert.ok(source.indexOf("digest('SHA-256',buffer)")>source.indexOf('buffer=unshuffle(inflated,m.shuffle)'));
 assert.match(source,/actual!==m.sha256/);
 assert.match(source,/compiled=\[\],transfers=\[buffer\]/);
 assert.match(source,/postMessage\(\{index:m.index,buffer,compiled\},transfers\)/);
});

test('network stream and offline chunk decode the same bytes and reject damaged data',async()=>{
 const {gzipSync}=require('node:zlib'),{webcrypto,createHash}=require('node:crypto');
 const bytes=Uint8Array.from({length:4099},(_,i)=>(i*197+(i>>3)*89)&255),packed=gzipSync(new Uint8Array(arrange(bytes,32)));
 const digest=createHash('sha256').update(bytes).digest('hex');
 const module=vm.createContext({YY:{}});vm.runInContext(source.replace('Y.SceneCache46={','Y.workerSource=workerSource;Y.SceneCache46={'),module);
 async function run(options={}){
  let reply,wholeBodyReads=0,fetches=0;
  const data=options.corrupt?packed.subarray(0,packed.length-8):packed;
  const c=vm.createContext({Uint8Array,Uint32Array,Blob,Response,DecompressionStream,atob,crypto:webcrypto,self:{crypto:webcrypto,postMessage:r=>{reply=r;}},fetch:async()=>{
   fetches++;const response=new Response(data,{status:options.status||200});
   return {ok:response.ok,status:response.status,get body(){throw Error('Compressed response must be consumed once before decompression');},arrayBuffer(){wholeBodyReads++;return response.arrayBuffer();}};
  }});
  vm.runInContext(module.YY.workerSource,c);
  await c.self.onmessage({data:{index:7,url:'https://fixture/chunk.gz',rawBytes:options.rawBytes||bytes.length,shuffle:32,sha256:options.digest||digest,...(options.offline?{encoded:packed.toString('base64')}:{})}});
  assert.equal(wholeBodyReads,options.offline||options.status===404?0:1);assert.equal(fetches,options.offline?0:1);return reply;
 }
 for(const offline of [false,true]){const r=await run({offline});assert.equal(r.index,7);assert.equal(r.error,undefined);assert.deepEqual(new Uint8Array(r.buffer),bytes);}
 assert.match((await run({rawBytes:bytes.length+1})).error,/Incomplete scene chunk/);
 assert.match((await run({digest:'wrong'})).error,/checksum mismatch/);
 assert.match((await run({status:404})).error,/HTTP 404/);
 assert.ok((await run({corrupt:true})).error);
});

test('worker visibility compilation preserves every metadata field and transfers original ordered records',async()=>{
 const {gzipSync}=require('node:zlib'),{webcrypto,createHash}=require('node:crypto');
 const module=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/visibility.js'),'utf8'),module);vm.runInContext(source.replace('Y.SceneCache46={','Y.workerSource=workerSource;Y.SceneCache46={'),module);
 const V=module.YY.Visibility;
 for(const count of [1,63,128,193])for(const detailWidth of [0,.025])for(const offline of [false,true]){
  const raw=new ArrayBuffer(count*33*4),data=new Float32Array(raw,0,count*28),spatial=new Float32Array(raw,count*28*4,count*5);
  for(let k=0;k<count;k++){const i=k*28,j=k*5;data[i]=1+k%3;data[i+5]=2;data[i+10]=.5;data[i+15]=1;data[i+20]=[8,38,45,6][k%4];data[i+21]=k%9===0?950002:55;data[i+23]=k%5-2;spatial.set([k*1.3,2-k%7,-k,1+k%4,k%2?.02:2],j);}
  const expected={data,spatial,detailWidth};V.compile(expected);delete expected.data;delete expected.spatial;delete expected.detailWidth;
  const bytes=new Uint8Array(raw),packed=gzipSync(new Uint8Array(arrange(bytes,32))),sha256=createHash('sha256').update(bytes).digest('hex');let reply,transferCount;
  const c=vm.createContext({Uint8Array,Uint32Array,Float32Array,Float64Array,ArrayBuffer,Blob,Response,DecompressionStream,atob,crypto:webcrypto,self:{crypto:webcrypto,postMessage:(r,transfer)=>{transferCount=transfer?.length;reply=structuredClone(r,{transfer:transfer||[]});}},fetch:async()=>new Response(packed)});
  vm.runInContext(module.YY.workerSource+'\nconst essential=new Set('+JSON.stringify(V.essentialMaterials)+');self.compileVisibility='+V.compile.toString()+';',c);
  const bucket={count,detailWidth,data:{offset:0,length:count*28},spatial:{offset:count*28*4,length:count*5}};
  await c.self.onmessage({data:{index:1,url:'https://fixture/chunk.gz',rawBytes:raw.byteLength,shuffle:32,sha256,buckets:[bucket],...(offline?{encoded:packed.toString('base64')}:{})}});
  assert.equal(reply.error,undefined);assert.deepEqual(new Uint8Array(reply.buffer),bytes);assert.deepEqual(reply.compiled[0],structuredClone(expected));assert.ok(transferCount>=2,'metadata arrays must transfer without copying');
 }
});

test('metadata may overlap hashing but neither records nor metadata escape before verification',async()=>{
 const {gzipSync}=require('node:zlib');
 const module=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/visibility.js'),'utf8'),module);vm.runInContext(source.replace('Y.SceneCache46={','Y.workerSource=workerSource;Y.SceneCache46={'),module);
 for(const matches of [true,false]){
  let release,compiled,reply;const hashReady=new Promise(r=>release=r),metadataReady=new Promise(r=>compiled=r);
  const crypto={subtle:{digest:()=>hashReady}},raw=new Uint8Array(132),packed=gzipSync(raw);
  const c=vm.createContext({Uint8Array,Uint32Array,Float32Array,ArrayBuffer,Blob,Response,DecompressionStream,atob,crypto,self:{crypto,compileVisibility(bucket,allocate){module.YY.Visibility.compile(bucket,allocate);compiled();},postMessage:r=>{reply=r;}},fetch:async()=>new Response(packed)});
  vm.runInContext(module.YY.workerSource,c);
  const pending=c.self.onmessage({data:{index:1,url:'https://fixture/chunk.gz',rawBytes:132,shuffle:0,sha256:'00'.repeat(32),buckets:[{count:1,detailWidth:0,data:{offset:0,length:28},spatial:{offset:112,length:5}}]}});
  await metadataReady;assert.equal(reply,undefined,'unverified records must stay in the worker');
  release(new Uint8Array(32).fill(matches?0:1).buffer);await pending;
  if(matches){assert.equal(reply.error,undefined);assert.deepEqual(new Uint8Array(reply.buffer),raw);}else{assert.match(reply.error,/checksum mismatch/);assert.equal(reply.buffer,undefined);assert.equal(reply.compiled,undefined);}
 }
});

test('one response is prefetched during decoding and reused only after its own verification',async()=>{
 const {gzipSync}=require('node:zlib'),{webcrypto,createHash}=require('node:crypto');
 const bytes=new Uint8Array(64).fill(17),packed=gzipSync(bytes),digest=createHash('sha256').update(bytes).digest('hex');
 const module=vm.createContext({YY:{}});vm.runInContext(source.replace('Y.SceneCache46={','Y.workerSource=workerSource;Y.SceneCache46={'),module);
 for(const failure of [null,'checksum','http','network']){
  let release,hashStarted,hashes=0;const firstHash=new Promise(r=>release=r),started=new Promise(r=>hashStarted=r),fetches=[],replies=[];
  const crypto={subtle:{digest(...args){hashes++;if(hashes===1){hashStarted();return firstHash;}return webcrypto.subtle.digest(...args);}}};
  const c=vm.createContext({Uint8Array,Uint32Array,Blob,Response,DecompressionStream,atob,crypto,self:{crypto,postMessage:r=>replies.push(r)},fetch:async url=>{
   fetches.push(url);if(url==='second'&&failure==='network')throw Error('prefetch network failure');
   return new Response(url==='second'&&failure==='checksum'?gzipSync(new Uint8Array(64).fill(18)):packed,{status:url==='second'&&failure==='http'?404:200});
  }});vm.runInContext(module.YY.workerSource,c);
  const message=(index,url,prefetchURL)=>({data:{index,url,prefetchURL,rawBytes:bytes.length,shuffle:0,sha256:digest}});
  const active=c.self.onmessage(message(0,'first','second'));await started;
  assert.deepEqual(fetches,['first','second']);assert.equal(hashes,1,'prefetch must not decode or hash another chunk');assert.equal(replies.length,0,'unverified bytes must not escape');
  release(await webcrypto.subtle.digest('SHA-256',bytes));await active;
  await c.self.onmessage(message(1,'second',undefined));
  assert.deepEqual(fetches,['first','second'],'reserved response must not be fetched twice');
  assert.deepEqual(new Uint8Array(replies[0].buffer),bytes);
  if(failure){assert.ok(replies[1].error);assert.equal(replies[1].buffer,undefined);}else assert.deepEqual(new Uint8Array(replies[1].buffer),bytes);
 }
});

test('restoration preserves special 32-bit payloads without numeric conversion',()=>{
 const restore=decoder(),bytes=new Uint8Array(new Uint32Array([0,0x80000000,0x7fffffff,0xffffffff,0x7fc00001,0xffc01234,0x0000ffff,0xffff0000]).buffer);
 for(const width of [2,4,16,32])for(const little of [true,false])assert.deepEqual(new Uint8Array(restore(arrange(bytes,width),width,little)),bytes);
});
