'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function loadEngine(appRoot){
 const engineSource=fs.readFileSync(path.join(appRoot,'src/engine.js'),'utf8');
 const fixture=require('./fixtures/winter-foliage255-original-draw.json');
 assert.equal(fixture.engineSourceSHA256,'39290e84053d69118d0f8e0222a1e22591de273cd8221de6c711fb7cb0ddce87');
 assert.equal(fixture.drawSHA256,'b7f24dbbfc43452ab30e7f729527a502b374506552de48601f20264fb9cf0f55');
 assert.equal(sha(fixture.source),fixture.drawSHA256,'original draw fixture integrity');
 const context=vm.createContext({YY:{}});
 vm.runInContext(engineSource,context,{filename:'src/engine.js'});
 // Take the live prototype method, retaining the actual engine helper closure.
 // Do not recompile/modify the candidate function or expose a copied predicate.
 const candidate=context.YY.Engine.prototype.draw;
 const originalControl=vm.runInContext('({'+fixture.source+'}).draw',context,{filename:'fixtures/winter-foliage255-original-draw.json'});
 // The scan-texture layer was added after this frozen foliage fixture. Adapt
 // that one independent resource binding without changing the fixture bytes,
 // foliage decisions, draw order or the live candidate method.
 function control(...args){
  const sampler=this.sampler;
  this.sampler=function(program,name,...rest){
   const result=sampler.call(this,program,name,...rest);
   if(name==='uShoreDistance')sampler.call(this,program,'uScan1119',5,this.scanTexture1119);
   return result;
  };
  try{return originalControl.apply(this,args);}finally{this.sampler=sampler;}
 }
 // Stream allocation must use this exact constructor: the actual helper uses instanceof.
 const Float32Array=vm.runInContext('Float32Array',context);
 return {candidate,control,Float32Array,engineSource,sourceHash:sha(engineSource),baselineEngineHash:fixture.engineSourceSHA256,baselineDrawHash:fixture.drawSHA256,candidateDrawHash:sha(candidate.toString()),Engine:context.YY.Engine};
}
module.exports={loadEngine};
