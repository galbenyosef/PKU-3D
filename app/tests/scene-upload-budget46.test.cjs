const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
async function load(chunks,cost,options={}){
 let clock=0,yields=0,workers=0,terminated=0,vertices=0,indices=0,instances=0,finished=false;const progress=[];
 const manifest={version:2,base:'./scene/',atlas:'atlas.png',chunks:Array.from({length:chunks},(_,i)=>({file:i+'.bin',rawBytes:64})),meshes:Array.from({length:chunks},(_,i)=>({buffer:{chunk:i,offset:0,length:8},indices:{chunk:i,offset:32},indexType:'uint16',vertexCount:3})),buckets:Array.from({length:chunks},(_,i)=>({mesh:i,data:{chunk:i,offset:0,length:1},spatial:{offset:4,length:1}})),campus:{registryIds:[]},packedStats:{compressedBytes:1},sourceHash:'fixture'};
 if(options.meshOnly)manifest.buckets=[];
 const buffers=[],copiedVertices=[],copiedIndices=[],retained=[];
 const engine={beginPrepared(){},preparedVertices(i,v){copiedVertices.push(Array.from(v));vertices++;clock+=cost;},preparedIndices(i,v){copiedIndices.push(Array.from(v));indices++;clock+=cost;},preparedInstances(record,v){retained.push(v);instances++;clock+=cost;},setAtlas(){},async finishPrepared(){finished=true;}};
 const Y={SCENE_PACKAGE46:manifest,CAMPUS:{features:[]}};
 class Worker{constructor(){workers++;}postMessage(m){assert.ok(!this.active,"only one active decode per worker");this.active=true;if(this.prefetchURL)assert.equal(m.url,this.prefetchURL,"consume the reserved next response");this.prefetchURL=m.prefetchURL;const buffer=new ArrayBuffer(64);new Float32Array(buffer,0,8).set([1,2,3,4,5,6,7,8]);new Uint16Array(buffer,32,3).set([2,1,0]);if(options.withoutTransfer)Object.defineProperty(buffer,'transfer',{value:undefined});buffers.push(buffer);queueMicrotask(()=>{clock+=options.decodeWait||0;this.active=false;this.onmessage({data:{index:m.index,buffer,compiled:m.buckets.map(()=>({}))}});});}terminate(){terminated++;}}
 class Image{set src(value){queueMicrotask(()=>this.onload());}}
 const c=vm.createContext({YY:Y,location:{protocol:'http:'},document:{baseURI:'http://localhost/'},URL,Blob,Worker,Image,performance:{now:()=>clock},requestAnimationFrame(cb){yields++;clock+=16;queueMicrotask(()=>cb(clock));},queueMicrotask});
 vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/visibility.js'),'utf8'),c);
 vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/scene-cache46.js'),'utf8'),c);
 const prepared=options.prewarm?Y.SceneCache46.warmup():undefined;
 if(prepared){assert.equal(workers,2);assert.equal(vertices,0);}
 await Y.SceneCache46.load(engine,(n,total)=>progress.push([n,total]),prepared);prepared?.dispose();
 assert.equal(workers,2);assert.equal(terminated,2);assert.equal(vertices,chunks);assert.equal(indices,chunks);assert.equal(instances,options.meshOnly?0:chunks);assert.equal(finished,true);assert.deepEqual(progress.map(x=>x[0]).sort((a,b)=>a-b),Array.from({length:chunks},(_,i)=>i+1));
 if(options.inspect)return{buffers,copiedVertices,copiedIndices,retained};
 return yields;
}
test('small completed chunks do not each force an idle frame',async()=>assert.equal(await load(6,.1),0));
test('upload work still yields when the seven millisecond budget is exhausted',async()=>{const yields=await load(12,2);assert.ok(yields>0);assert.ok(yields<12*3);});
test('geometry backing buffers detach only after both GPU uploads, while instance views stay live',async()=>{
 const mesh=await load(4,2,{meshOnly:true,inspect:true});
 assert.ok(mesh.buffers.every(b=>b.byteLength===0));
 for(const v of mesh.copiedVertices)assert.deepEqual(v,[1,2,3,4,5,6,7,8]);
 for(const v of mesh.copiedIndices)assert.deepEqual(v,[2,1,0]);
 const mixed=await load(4,2,{inspect:true});assert.ok(mixed.buffers.every(b=>b.byteLength===64));assert.ok(mixed.retained.every(v=>v[0]===1));
 const fallback=await load(2,2,{meshOnly:true,inspect:true,withoutTransfer:true});assert.ok(fallback.buffers.every(b=>b.byteLength===64));assert.deepEqual(fallback.copiedIndices[0],[2,1,0]);
});

test('instance-heavy chunks start early without changing manifest or dropping mesh chunks',()=>{
 const Y={},c=vm.createContext({YY:Y});vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/scene-cache46.js'),'utf8'),c);
 const chunks=[{rawBytes:100},{rawBytes:90},{rawBytes:80},{rawBytes:140},{rawBytes:20}],contents=[[],[],[{}],[{}],[]].map(buckets=>({buckets})),before=JSON.stringify({chunks,contents});
 assert.deepEqual(Array.from(Y.SceneCache46.decodeOrder(chunks,contents)),[3,0,2,1,4]);
 assert.equal(JSON.stringify({chunks,contents}),before);
 assert.deepEqual(Array.from(Y.SceneCache46.decodeOrder(chunks,contents.map(()=>({buckets:[]})))),[0,1,2,3,4]);
 assert.deepEqual(Array.from(Y.SceneCache46.decodeOrder([],[])),[]);
});

test('decoder waiting does not spend the upload budget or add idle frames',async()=>{
 assert.equal(await load(6,.1,{decodeWait:100}),0);
 assert.ok(await load(12,2,{decodeWait:100})>0,'actual upload work must still yield');
});

test('warmed decoders are reused and idempotent cleanup terminates only two workers',async()=>{
 assert.equal(await load(6,.1,{prewarm:true}),0);
});
test('partial decoder warmup failure releases the first worker and object URL',()=>{
 let created=0,terminated=0,revoked=0;const Y={Visibility:{essentialMaterials:[],compile(){}}};
 const c=vm.createContext({YY:Y,Blob,URL:{createObjectURL:()=> 'blob:fixture',revokeObjectURL(){revoked++;}},Worker:class{constructor(){if(++created===2)throw Error('worker startup failure');}terminate(){terminated++;}}});
 vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../src/scene-cache46.js'),'utf8'),c);
 assert.throws(()=>Y.SceneCache46.warmup(),/worker startup failure/);assert.equal(terminated,1);assert.equal(revoked,1);
});
