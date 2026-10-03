/* Load the byte-exact prepared scene off the UI thread, in bounded chunks. */
(function(Y){'use strict';
 const pendingFiles=new Map();
 let localTextures;
 async function textureSource(kind,url){
  if(location.protocol!=='file:')return url;
  if(!localTextures)localTextures=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=Y.TEXTURE_FALLBACK46;script.onload=()=>{script.remove();Y.LOCAL_TEXTURES46?resolve(Y.LOCAL_TEXTURES46):reject(Error('Local textures are incomplete'));};script.onerror=()=>{script.remove();reject(Error('Local texture file is missing'));};document.head.append(script);});
  return(await localTextures)[kind];
 }
 // Keep the late-arriving index loop independent of earlier width-32/2 warmup.
 // The byte operations and endian/alignment guards remain unchanged.
 const workerSource=`function unshuffle4(src,out){
   const words=new Uint32Array(out.buffer),n=words.length;
   for(let i=0;i<n;i++)words[i]=src[i]|src[n+i]<<8|src[2*n+i]<<16|src[3*n+i]<<24;
   return out.buffer;
}
function unshuffle32(src,out){
 const words=new Uint32Array(out.buffer),rows=src.length/32;
 for(let i=0,j=0;i<rows;i++,j+=8){
  words[j+0]=src[0*rows+i]|src[1*rows+i]<<8|src[2*rows+i]<<16|src[3*rows+i]<<24;
  words[j+1]=src[4*rows+i]|src[5*rows+i]<<8|src[6*rows+i]<<16|src[7*rows+i]<<24;
  words[j+2]=src[8*rows+i]|src[9*rows+i]<<8|src[10*rows+i]<<16|src[11*rows+i]<<24;
  words[j+3]=src[12*rows+i]|src[13*rows+i]<<8|src[14*rows+i]<<16|src[15*rows+i]<<24;
  words[j+4]=src[16*rows+i]|src[17*rows+i]<<8|src[18*rows+i]<<16|src[19*rows+i]<<24;
  words[j+5]=src[20*rows+i]|src[21*rows+i]<<8|src[22*rows+i]<<16|src[23*rows+i]<<24;
  words[j+6]=src[24*rows+i]|src[25*rows+i]<<8|src[26*rows+i]<<16|src[27*rows+i]<<24;
  words[j+7]=src[28*rows+i]|src[29*rows+i]<<8|src[30*rows+i]<<16|src[31*rows+i]<<24;
 }
 return out.buffer;
}
// Lossless bounded SIMD transpose. All decoding/checksum publication stays below.
let wasm32State;
function unshuffle32SIMD(buffer){
 if(wasm32State===false)return null;
 try{
  if(!wasm32State){
   const encoded='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',binary=atob(encoded),bytes=new Uint8Array(binary.length);
   for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
   const instance=new WebAssembly.Instance(new WebAssembly.Module(bytes));
   if(instance.exports.memory.buffer.byteLength!==524288)throw Error('Unexpected transpose memory');
   wasm32State={instance,view:new Uint8Array(instance.exports.memory.buffer)};
  }
  const src=new Uint8Array(buffer),rows=src.length/32,out=new Uint8Array(src.length),v=wasm32State.view;
  for(let row=0;row<rows;row+=8192){
   const n=Math.min(8192,rows-row);
   for(let lane=0;lane<32;lane++)v.set(src.subarray(lane*rows+row,lane*rows+row+n),lane*n);
   wasm32State.instance.exports.transpose32(n);
   out.set(v.subarray(n*32,n*64),row*32);
  }
  return out.buffer;
 }catch{wasm32State=false;return null;}
}
function unshuffle(buffer,width,little=new Uint8Array(new Uint32Array([1]).buffer)[0]===1){
  if(little&&width===32&&buffer.byteLength%32===0){const result=unshuffle32SIMD(buffer);if(result!==null)return result;}
  const src=new Uint8Array(buffer),out=new Uint8Array(src.length);
  // Index streams have contiguous word output. Specialize those widths so
  // each write restores one full word, preserving every bit without conversion.
  if(little&&width===4&&src.length%4===0){
   return unshuffle4(src,out);
  }
  if(little&&width===2&&src.length%4===0){
   const words=new Uint32Array(out.buffer),n=src.length/2;
   for(let i=0,j=0;j<words.length;i+=2,j++)words[j]=src[i]|src[n+i]<<8|src[i+1]<<16|src[n+i+1]<<24;
   return out.buffer;
  }
  if(little&&width===32&&src.length%32===0)return unshuffle32(src,out);
  // Restore four byte lanes per write without converting floating-point values.
  // Partial final records have equally sized lanes within each aligned word.
  if(little&&width%4===0&&src.length%4===0){
   const words=new Uint32Array(out.buffer),rows=Math.floor(src.length/width),tail=src.length%width,step=width/4;
   for(let lane=0;lane<width;lane+=4){
    const n=rows+(lane<tail?1:0),a=lane*rows+Math.min(lane,tail),b=a+n,c=b+n,d=c+n;
    for(let i=0,j=lane/4;i<n;i++,j+=step)words[j]=src[a+i]|src[b+i]<<8|src[c+i]<<16|src[d+i]<<24;
   }
  }else{let q=0;for(let lane=0;lane<width;lane++)for(let i=lane;i<src.length;i+=width)out[i]=src[q++];}
  return out.buffer;
 }
 let prefetched;
 self.onmessage=async({data:m})=>{try{
  let stream;
  if(m.encoded){const s=atob(m.encoded),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);stream=new Blob([a]).stream();}
  else{
   const pending=prefetched;prefetched=null;
   const r=await(pending?.url===m.url?pending.promise:fetch(m.url));
   if(!r.ok)throw Error('Scene chunk HTTP '+r.status);
   // One compressed response may arrive while this chunk decodes. No second
   // decompression or checksum starts until the next explicit worker message.
   if(m.prefetchURL){const promise=fetch(m.prefetchURL);promise.catch(()=>{});prefetched={url:m.prefetchURL,promise};}
   stream=new Blob([await r.arrayBuffer()]).stream();
  }
  // The HTTP branch consumes the complete compressed response first.
  // Decode its Blob stream through the original gzip validation path.
  const inflated=await new Response(stream.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  if(inflated.byteLength!==m.rawBytes)throw Error('Incomplete scene chunk');
  let buffer=inflated;
  if(m.shuffle)buffer=unshuffle(inflated,m.shuffle);
  const verified=(async()=>{
  if(self.crypto?.subtle){const digest=await crypto.subtle.digest('SHA-256',buffer),actual=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');if(actual!==m.sha256)throw Error('Scene chunk checksum mismatch');}
  })();verified.catch(()=>{});
  const compiled=[],transfers=[buffer],records=m.buckets||[];
  // Directly compile typed metadata views into one aligned per-chunk arena.
  // The original records retain their own buffer and every view keeps its type.
  let metadataBytes=0,metadataOffset=0;
  const reserve=(Type,n)=>{metadataBytes=Math.ceil(metadataBytes/Type.BYTES_PER_ELEMENT)*Type.BYTES_PER_ELEMENT+n*Type.BYTES_PER_ELEMENT;};
  for(const record of records){
   const n=record.count;
   if(record.data.length!==n*28||record.spatial.length!==n*5)throw Error('Incomplete prepared scene bucket');
   if(record.detailWidth)reserve(Float64Array,n);reserve(Uint8Array,n);
   if(n>=128){reserve(Float64Array,Math.ceil(n/64)*5);reserve(Float64Array,Math.ceil(n/64)*4);reserve(Uint8Array,Math.ceil(n/64));}
  }
  const metadata=records.length?new ArrayBuffer(metadataBytes):null;
  const allocate=(Type,n)=>{metadataOffset=Math.ceil(metadataOffset/Type.BYTES_PER_ELEMENT)*Type.BYTES_PER_ELEMENT;const view=new Type(metadata,metadataOffset,n);metadataOffset+=view.byteLength;return view;};
  if(metadata)transfers.push(metadata);
  // Overlap local metadata work with asynchronous checksum verification.
  // Instance records themselves are never reordered or rewritten.
  for(const record of records){
   const bucket={data:new Float32Array(buffer,record.data.offset,record.data.length),spatial:new Float32Array(buffer,record.spatial.offset,record.spatial.length),detailWidth:record.detailWidth};
   if(bucket.data.length!==record.count*28||bucket.spatial.length!==record.count*5)throw Error('Incomplete prepared scene bucket');
   self.compileVisibility(bucket,allocate);delete bucket.data;delete bucket.spatial;delete bucket.detailWidth;
   compiled.push(bucket);
  }
  if(metadataOffset!==metadataBytes)throw Error('Incomplete visibility metadata arena');
  await verified; // Never publish or upload records before checksum success.
  self.postMessage({index:m.index,buffer,compiled},transfers);
 }catch(e){self.postMessage({index:m.index,error:String(e)});}};`;
 const yieldUI=()=>new Promise(resolve=>requestAnimationFrame(resolve));
 function localChunk(base,index,chunk){
  if(pendingFiles.has(chunk.key))return pendingFiles.get(chunk.key).promise;
  const script=document.createElement('script');script.src=base+chunk.fallback;
  let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});
  const finish=()=>{script.remove();pendingFiles.delete(chunk.key);};
  pendingFiles.set(chunk.key,{promise,resolve:encoded=>{finish();resolve(encoded);}});
  script.onerror=()=>{finish();reject(Error('Scene data file is missing: '+chunk.fallback));};document.head.append(script);return promise;
 }
 function receive(key,encoded){pendingFiles.get(key)?.resolve(encoded);}
 // Begin CPU-heavy instance preparation while later mesh chunks still decode.
 // This only schedules chunks: manifest bucket order and all record bytes stay intact.
 function decodeOrder(chunks,content){
  const instances=[],geometry=[],order=[];
  chunks.forEach((_,i)=>(content[i].buckets.length?instances:geometry).push(i));
  instances.sort((a,b)=>chunks[b].rawBytes-chunks[a].rawBytes||a-b);
  for(let i=0;i<Math.max(instances.length,geometry.length);i++){
   if(i<instances.length)order.push(instances[i]);if(i<geometry.length)order.push(geometry[i]);
  }
  return order;
 }
 function warmup(){
  const workerURL=URL.createObjectURL(new Blob([workerSource,'\nconst essential=new Set('+JSON.stringify(Y.Visibility.essentialMaterials)+');self.compileVisibility='+Y.Visibility.compile.toString()+';'],{type:'text/javascript'})),workers=[];
  let disposed=false;
  const dispose=()=>{if(disposed)return;disposed=true;workers.forEach(w=>w.terminate());URL.revokeObjectURL(workerURL);};
  try{for(let i=0;i<2;i++)workers.push(new Worker(workerURL));}catch(error){dispose();throw error;}
  return{workers,dispose};
 }
 async function load(engine,onProgress=()=>{},prepared){
  const m=Y.SCENE_PACKAGE46;if(!m||(m.version!==2&&m.version!==3)||(m.version===3&&(![1,2].includes(m.normalTransformFormat194)||![1,2].includes(Y.Engine.normalTransformFormat194)||Y.Engine.normalTransformFormat194<m.normalTransformFormat194)))throw Error('Prepared scene manifest is missing or incompatible');
  const started=performance.now(),base=new URL(m.base,document.baseURI).href;
  const pool=prepared||warmup(),workers=pool.workers;let cursor=0,completed=0;
  const chunks=m.chunks.map(()=>({meshes:[],indices:[],buckets:[]}));
  m.meshes.forEach((mesh,index)=>{chunks[mesh.buffer.chunk].meshes.push({mesh,index});if(mesh.indices)chunks[mesh.indices.chunk].indices.push({mesh,index});});
  m.buckets.forEach(bucket=>chunks[bucket.data.chunk].buckets.push(bucket));
  const order=decodeOrder(m.chunks,chunks);
  engine.beginPrepared(m);
  const atlasSource=await textureSource('atlas',base+m.atlas),atlas=new Image();const atlasReady=new Promise((resolve,reject)=>{atlas.onload=resolve;atlas.onerror=()=>reject(Error('Scene lettering atlas could not load'));atlas.src=atlasSource;});
  // Attach a handler immediately, even while the chunk workers are still active.
  atlasReady.catch(()=>{});
  const decode=(worker,index,chunk,encoded,prefetchURL)=>new Promise((resolve,reject)=>{
   worker.onmessage=({data:r})=>r.error?reject(Error(r.error)):resolve(r);
   worker.onerror=e=>reject(Error(e.message||'Scene decoder failed'));
   worker.postMessage({index,url:base+chunk.file,encoded,prefetchURL,rawBytes:chunk.rawBytes,shuffle:chunk.shuffle,sha256:chunk.sha256,buckets:chunks[index].buckets.map(record=>({...record,detailWidth:m.meshes[record.mesh].detailWidth||0}))});
  });
  try{
   const takeIndex=()=>cursor<order.length?order[cursor++]:null,first=workers.map(takeIndex);
   await Promise.all(workers.map(async(worker,wi)=>{
    let reserved=first[wi];
    // One pending decode per worker overlaps the current chunk's bounded upload.
    const requestNext=()=>{
     if(reserved===null)return null;
     const index=reserved,chunk=m.chunks[index];reserved=takeIndex();
     const prefetchURL=location.protocol!=='file:'&&reserved!==null?base+m.chunks[reserved].file:undefined;
     const result=(async()=>{const encoded=location.protocol==='file:'?await localChunk(base,index,chunk):undefined;return decode(worker,index,chunk,encoded,prefetchURL);})();
     result.catch(()=>{});return{index,result};
    };
    // Carry the same upload budget across chunk boundaries. A small chunk
    // need not add an idle frame immediately after an in-chunk UI yield.
    let next=requestNext(),checkpoint=performance.now();
    while(next){
     const {index,result}=next,waiting=performance.now();
     const {buffer,compiled}=await result;
     // Decoder wait does not consume the main-thread upload work budget.
     // Preserve accumulated upload time across chunks, excluding only this await.
     checkpoint+=performance.now()-waiting;next=requestNext();
     const content=chunks[index];
     if(engine.disposed)throw Error('Scene loading was interrupted');
     for(const{mesh,index:mi}of content.meshes){engine.preparedVertices(mi,new Float32Array(buffer,mesh.buffer.offset,mesh.buffer.length));if(performance.now()-checkpoint>7){await yieldUI();checkpoint=performance.now();}}
     for(const{mesh,index:mi}of content.indices){const Type=mesh.indexType==='uint16'?Uint16Array:Uint32Array;engine.preparedIndices(mi,new Type(buffer,mesh.indices.offset,mesh.vertexCount));if(performance.now()-checkpoint>7){await yieldUI();checkpoint=performance.now();}}
     for(let bi=0;bi<content.buckets.length;bi++){const bucket=content.buckets[bi];engine.preparedInstances(bucket,new Float32Array(buffer,bucket.data.offset,bucket.data.length),new Float32Array(buffer,bucket.spatial.offset,bucket.spatial.length),compiled[bi]);if(performance.now()-checkpoint>7){await yieldUI();checkpoint=performance.now();}}
     // WebGL has copied every vertex/index view by this point. Explicitly release
     // geometry-only backing storage instead of retaining it until a later GC.
     // Instance chunks stay attached: visibility caches still use their views.
     if(!content.buckets.length&&typeof buffer.transfer==='function')buffer.transfer(0);
     onProgress(++completed,m.chunks.length);if(performance.now()-checkpoint>7){await yieldUI();checkpoint=performance.now();}
    }
   }));
   await atlasReady;if(engine.disposed)throw Error('Scene loading was interrupted');engine.setAtlas(atlas);await engine.finishPrepared(yieldUI);
   const by=new Map(Y.CAMPUS.features.map(f=>[f.properties.pickId,f]));
   const campus={...m.campus,registry:new Map(m.campus.registryIds.map(id=>[id,by.get(id)]))};delete campus.registryIds;
   Y.sceneLoad46={ms:performance.now()-started,compressedBytes:m.packedStats.compressedBytes,chunks:m.chunks.length,sourceHash:m.sourceHash};
   return campus;
  }finally{pool.dispose();}
 }
 Y.SceneCache46={warmup,load,receive,textureSource,decodeOrder};
})(YY);
