'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=path.resolve(__dirname,'../src'),plain=v=>JSON.parse(JSON.stringify(v));
function fixture(){
 const c=vm.createContext({YY:{}});for(const name of ['math.js','reflection-footprint.js'])vm.runInContext(fs.readFileSync(path.join(source,name),'utf8'),c);
 let calls=0;const original=c.YY.ReflectionFootprint.planes;c.YY.ReflectionFootprint.planes=function(...args){calls++;return original.apply(this,args);};
 vm.runInContext(fs.readFileSync(path.join(source,'engine.js'),'utf8'),c);
 const C=vm.runInContext('({Set,Map,WeakMap,Float32Array})',c),Y=c.YY,M=Y.M;
 const e=Object.assign(Object.create(Y.Engine.prototype),{gl:{},buckets:new C.Map(),bucketIndexGeneration:0,bucketIndexEpoch:{}});
 const data=new C.Float32Array(28);data[0]=data[5]=data[10]=data[15]=1;data[20]=4;data[21]=1;data[23]=1;
 const vertices=new C.Float32Array([-2,0,-2,0,1,0,0,0,2,0,-2,0,1,0,0,0,-2,0,2,0,1,0,0,0]);
 const resource={waterBounds:[0,0,0,2,0,2],vertexCount:3,vertexBuffer:{},vertexPublication:1,reflectionFootprint:Y.ReflectionFootprint.prepare(vertices)};
 const b={data,resource,count:1,uniformMaterial:4,materials:new C.Set([4]),vertexCount:3};e.prepareRanges(b);e.buckets.set('water',b);
 const visible={items:[{b}]},canvas={width:1440,height:1000},target={w:896,h:622,f:{}},state={selected:0,explode:0};
 const projection=M.perspective(.8,1.44,.1,6500);let main=M.multiply(projection,M.lookAt([0,40,50],[0,0,0],[0,1,0])),ref=M.multiply(projection,M.lookAt([0,-40,50],[0,0,0],[0,-1,0]));
 function call(worldCache){const a=main.slice(),z=ref.slice(),d=e.reflectionDescriptor(visible,a,z,0,canvas,target,state,worldCache);assert.equal(d.mainVP,a);assert.equal(d.refVP,z);return d;}
 return{e,b,Y,C,resource,canvas,target,state,call,calls:()=>calls,camera(){main=M.multiply(projection,M.lookAt([1,40,50],[0,0,0],[0,1,0]));},reflect(){ref[12]+=.1;}};
}
function warm(f){const a=f.call();assert.equal(a.footprintPlanes.length,8);assert.equal(a.scissor.length,4);assert.deepEqual(plain(f.call()),plain(a));return a;}
function originalResult(f){f.state.reflectionDescriptorCache=false;const d=f.call();delete f.state.reflectionDescriptorCache;return plain(d);}
test('equal-value cloned VP matrices reuse geometry and preserve current VP references',()=>{const f=fixture();warm(f);for(let k=0;k<4;k++){f.state.time=k;f.call();}assert.equal(f.calls(),1);f.state.reflectionDescriptorCache=false;f.call();f.call();assert.equal(f.calls(),3);});
test('caller deep mutation cannot change later cached descriptor outputs',()=>{const f=fixture(),expected=plain(warm(f)),bad=f.call();bad.scissor[0]=-99;bad.footprintPlanes[0][0]=Infinity;bad.footprintPlanes.push([1,2,3,4]);bad.target.w=0;const next=f.call();assert.deepEqual(plain(next),expected);assert.notEqual(next.scissor,bad.scissor);assert.notEqual(next.footprintPlanes[0],bad.footprintPlanes[0]);assert.equal(f.calls(),1);});
test('camera, reflection matrix, viewport and target changes invalidate descriptor reuse',()=>{
 for(const mutate of [f=>f.camera(),f=>f.reflect(),f=>f.canvas.width=900,f=>f.target.w=600,f=>f.target.f={},f=>f.e.bucketIndexGeneration++]){const f=fixture();warm(f);mutate(f);const n=f.calls(),d=f.call();assert.equal(f.calls(),n+1);assert.deepEqual(plain(d),originalResult(f));}
});
test('source matrix, source polygon and existing world-cache mutations invalidate reuse',()=>{
 for(const mutate of [f=>f.b.data[12]+=.2,f=>f.resource.reflectionFootprint.polygon[0][0]-=.2,f=>f.b.reflectionFootprintWorld.footprint[0][0]-=.2,f=>f.b.reflectionFootprintWorld.y+=.1,f=>{delete f.b.reflectionFootprintWorld;}]){const f=fixture();warm(f);mutate(f);const n=f.calls(),d=f.call();assert.equal(f.calls(),n+1);assert.deepEqual(plain(d),originalResult(f));}
});
test('supplied WeakMap always runs original planes and receives job-owned world cache',()=>{
 const f=fixture();warm(f);delete f.b.reflectionFootprintWorld;
 for(let k=0;k<2;k++){const cache=new f.C.WeakMap(),n=f.calls(),d=f.call(cache);assert.equal(f.calls(),n+1);assert(cache.has(f.b));assert.equal(f.b.reflectionFootprintWorld,undefined);assert.equal(d.footprintPlanes.length,8);}
});
test('unsafe and mixed water retain conservative fallback on repeated calls',()=>{
 for(const mutate of [f=>f.b.uniformMaterial=null,f=>f.b.data[22]=1,f=>f.resource.reflectionFootprint=null,f=>f.b.waterRanges=null]){const f=fixture();warm(f);mutate(f);for(let k=0;k<2;k++){const d=f.call();assert.equal(d.footprintPlanes,null);assert.deepEqual(plain(d),originalResult(f));}delete f.state.reflectionDescriptorCache;}
});
test('runtime planes replacement bypasses cached descriptors',()=>{
 const f=fixture();warm(f);const old=f.Y.ReflectionFootprint.planes;let replacements=0;f.Y.ReflectionFootprint.planes=function(...args){replacements++;const p=old.apply(this,args);p[0][3]+=.01;return p;};const a=f.call(),b=f.call();assert.equal(replacements,2);assert.deepEqual(plain(a),plain(b));assert.deepEqual(plain(a),originalResult(f));
});
test('runtime scissor replacement bypasses cached descriptors',()=>{
 const f=fixture();warm(f);const old=f.e.reflectionScissor;let replacements=0;f.e.reflectionScissor=function(...args){replacements++;const s=old.apply(this,args);s[0]++;return s;};const a=f.call(),b=f.call();assert.equal(replacements,2);assert.deepEqual(plain(a),plain(b));assert.deepEqual(plain(a),originalResult(f));
});
