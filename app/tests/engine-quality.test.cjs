'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=path.resolve(__dirname,'../src');
function fixture({software=false,dpr=1,preset,rect={left:0,top:0,width:1440,height:1000}}={}){
 const live=new Set(),deleted=new Set(),samples=[],reads=[];let serial=0,checks=0,allocations=0,failCheck=Infinity,failAllocation=Infinity;
 const gl=new Proxy({
  getExtension(name){if(name==='WEBGL_debug_renderer_info')return{UNMASKED_RENDERER_WEBGL:'RENDERER'};if(name==='EXT_color_buffer_float')return{};return null;},
  getParameter(name){return name==='MAX_SAMPLES'?4:name==='RENDERER'?(software?'SwiftShader':'Test hardware'):0;},getInternalformatParameter(){return[4];},isContextLost(){return false;},
  checkFramebufferStatus(){return ++checks===failCheck?'INCOMPLETE':'FRAMEBUFFER_COMPLETE';},
  renderbufferStorageMultisample(target,count){samples.push(count);},readPixels(x,y,w,h,format,type,out){reads.push([x,y,w,h]);out[0]=73;}
 },{get(o,key){if(key in o)return o[key];if(/^[A-Z0-9_]+$/.test(key))return key;
  if(key.startsWith('create'))return()=>{if(++allocations===failAllocation)return null;const v={id:++serial,kind:key.slice(6)};live.add(v);return v;};
  if(key.startsWith('delete'))return value=>{if(!value)return;assert(!deleted.has(value),'resource deleted twice');assert(live.has(value),'deleted unknown resource');deleted.add(value);live.delete(value);};
  return()=>{};
 }});
 const canvas={width:300,height:150,clientWidth:rect.width,clientHeight:rect.height,getContext(){return gl;},getBoundingClientRect(){return rect;}};
 const c=vm.createContext({YY:{},window:{devicePixelRatio:dpr},console});
 for(const file of ['math.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(source,file),'utf8'),c);
 const e=new c.YY.Engine(canvas,{deferPrograms:true,...(preset===undefined?{}:{qualityPreset:preset})});
 return{e,canvas,gl,live,deleted,samples,reads,c,failCheck(n){failCheck=checks+n;},failAllocation(n){failAllocation=allocations+n;},clearFailure(){failCheck=failAllocation=Infinity;}};
}
const targets=e=>['shadowTarget','sceneTarget','pickTarget','reflectTarget'].map(k=>e[k]);
function snapshot(e){return{preset:e.qualityPreset,quality:e.quality,shadow:e.shadowSize,width:e.canvas.width,height:e.canvas.height,aspect:e.aspect,generation:e.reflectionTargetGeneration,targets:targets(e)};}

test('HIGH preserves original hardware/software target formulas and MSAA across DPRs',()=>{
 for(const software of [false,true])for(const dpr of [1,1.25,2]){
  const f=fixture({software,dpr}),e=f.e;e.resize(1440,1000);
  const scale=Math.min(dpr,1.5)*(software?.66:1),w=Math.round(1440*scale),h=Math.round(1000*scale),rf=Math.min(software?512:896,w*.72)/w;
  assert.equal(e.qualityPreset,'high');assert.equal(e.quality,software?.66:1);assert.equal(e.shadowSize,software?768:2048);assert.equal(e.canvas.width,w);assert.equal(e.canvas.height,h);assert.equal(e.reflectTarget.w,Math.round(w*rf));assert.equal(e.reflectTarget.h,Math.round(h*rf));assert.equal(e.msaaSamples,4);assert.equal(e.hdr,true);assert(f.samples.every(n=>n===4));e.dispose();assert.equal(f.live.size,0);
 }
});
test('presets use the requested resolution budgets while retaining HDR/MSAA and scene state',()=>{
 for(const software of [false,true])for(const name of ['medium','low']){
  const f=fixture({software,preset:name}),e=f.e,medium=name==='medium';e.resize(1440,1000);
  const scale=(software?.66:1)*(medium?.85:.70),w=Math.round(1440*scale),h=Math.round(1000*scale),cap=software?(medium?384:256):(medium?672:448),rf=Math.min(cap,w*(medium?.60:.48))/w;
  assert.equal(e.canvas.width,w);assert.equal(e.canvas.height,h);assert.equal(e.shadowSize,software?(medium?576:384):(medium?1536:1024));assert.equal(e.reflectTarget.w,Math.round(w*rf));assert.equal(e.reflectTarget.h,Math.round(h*rf));assert.equal(e.msaaSamples,4);assert(e.hdr);e.dispose();assert.equal(f.live.size,0);
 }
});
test('repeated switches retire old resources, invalidate plans, and return exactly to HIGH dimensions',()=>{
 const f=fixture(),e=f.e;e.resize(1440,1000);const first=snapshot(e),liveCount=f.live.size;
 e.state={selected:45,detailLOD:true};e.camera={eye:[1,2,3]};const state=e.state,camera=e.camera,buckets=e.buckets;
 for(const name of ['medium','low','high','low','medium','high']){
  const previous=targets(e),generation=e.reflectionTargetGeneration;e.visibilityCaches.set(0,{});e.initialVisibilityPlans=new Map([[0,{}]]);e.lastReflection=8;e.lastReflectKey='old';e.shadowDirty=false;
  assert.equal(e.setQualityPreset(name),true);assert.equal(e.qualityPreset,name);assert.equal(e.visibilityCaches.size,0);assert.equal(e.initialVisibilityPlans,null);assert.equal(e.lastReflection,-1);assert.equal(e.lastReflectKey,null);assert(e.shadowDirty);assert.equal(e.reflectionTargetGeneration,generation+1);assert(previous.every(t=>f.deleted.has(t.f)));assert.equal(f.live.size,liveCount);assert.equal(e.state,state);assert.equal(e.camera,camera);assert.equal(e.buckets,buckets);
 }
 assert.equal(e.canvas.width,first.width);assert.equal(e.canvas.height,first.height);assert.equal(e.shadowSize,first.shadow);assert.equal(e.quality,first.quality);assert(f.samples.every(n=>n===4));e.dispose();assert.equal(f.live.size,0);assert.equal(e.setQualityPreset('low'),false);
});
test('same preset and identical resize reuse targets; tiny reflection dimensions remain valid',()=>{
 const f=fixture(),e=f.e;e.resize(1440,1000);const initial=targets(e),count=f.live.size,generation=e.reflectionTargetGeneration;
 assert.equal(e.setQualityPreset('high'),false);e.resize(1440,1000);assert.deepEqual(targets(e),initial);assert.equal(f.live.size,count);assert.equal(e.reflectionTargetGeneration,generation);
 e.resize(1,1);for(const name of ['medium','low','high']){e.setQualityPreset(name);assert(e.reflectTarget.w>=1&&e.reflectTarget.h>=1);}e.dispose();assert.equal(f.live.size,0);
});
test('every framebuffer failure rolls back the complete preset and deletes partial replacements',()=>{
 for(let failure=1;failure<=6;failure++){
  const f=fixture(),e=f.e;e.resize(1440,1000);const before=snapshot(e),owned=new Set(f.live);f.failCheck(failure);
  assert.throws(()=>e.setQualityPreset('medium'),/framebuffer|Framebuffer/);assert.deepEqual(snapshot(e),before);assert.deepEqual(f.live,owned);
  f.clearFailure();assert(e.setQualityPreset('medium'));e.dispose();assert.equal(f.live.size,0);
 }
});
test('null allocations also roll back without leaked partial framebuffer attachments',()=>{
 // A tier switch allocates 15 GL objects, including the replaced temporary depth buffer.
 for(let failure=1;failure<=15;failure++){
  const f=fixture(),e=f.e;e.resize(1440,1000);const before=snapshot(e),owned=new Set(f.live);f.failAllocation(failure);
  assert.throws(()=>e.setQualityPreset('medium'),/allocation failed/);assert.deepEqual(snapshot(e),before);assert.deepEqual(f.live,owned);f.clearFailure();e.dispose();assert.equal(f.live.size,0);
 }
});
test('invalid presets have predictable errors and cannot mutate a working engine',()=>{
 const f=fixture(),e=f.e;e.resize(1440,1000);const before=snapshot(e);
 for(const name of ['bad','HIGH','__proto__',null,{},undefined]){assert.throws(()=>e.setQualityPreset(name),/Unknown quality preset/);assert.deepEqual(snapshot(e),before);}
 assert(Object.isFrozen(f.c.YY.Engine.qualityProfiles));assert(Object.isFrozen(f.c.YY.Engine.qualityProfiles.high));e.dispose();assert.equal(f.live.size,0);
});
test('pre-resize choice and restored engines retain the explicitly chosen quality',()=>{
 const f=fixture();assert(f.e.setQualityPreset('low'));assert.equal(f.e.sceneTarget,undefined);assert.equal(f.e.shadowSize,1024);f.e.resize(800,600);const before=snapshot(f.e);f.e.dispose();assert.equal(f.live.size,0);
 const restored=fixture({preset:'low'});restored.e.resize(800,600);assert.equal(restored.e.canvas.width,before.width);assert.equal(restored.e.reflectTarget.w,before.targets[3].w);assert.equal(restored.e.shadowSize,before.shadow);restored.e.dispose();assert.equal(restored.live.size,0);
});
test('picking maps CSS client coordinates into each preset target at the existing viewport origin',()=>{
 const f=fixture(),e=f.e;e.resize(1440,1000);e.camera={eye:[0,0,0]};e.state={};e.draw=()=>{};
 for(const name of ['high','medium','low']){e.setQualityPreset(name);assert.equal(e.pick(720,500),73);assert.deepEqual(f.reads.at(-1),[Math.floor(e.pickTarget.w/2),e.pickTarget.h-1-Math.floor(e.pickTarget.h/2),1,1]);}
 e.dispose();assert.equal(f.live.size,0);
});
