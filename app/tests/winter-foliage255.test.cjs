'use strict';
const rawAssert=require('node:assert/strict'),path=require('node:path'),test=require('node:test');
let assertionCount=0;const assert=new Proxy(rawAssert,{get:(o,k)=>typeof o[k]==='function'?(...args)=>{assertionCount++;return o[k](...args);}:o[k]});
const {loadEngine}=require('./winter-foliage255-helper.cjs');
const appRoot=process.argv[2]?path.resolve(process.argv[2]):path.resolve(__dirname,'..');
const compiled=loadEngine(appRoot),Float32Array=compiled.Float32Array;let checks=0;
rawAssert.equal(compiled.candidate,compiled.Engine.prototype.draw,'test must call the actual loaded prototype method');
function make(config={}){
 const {pass=0,specialized=true,materials=[45,45],shape='normal',state={}}=config;
 const season=Object.hasOwn(config,'season')?config.season:3;
 const trace=[],g={};let vao=null;
 for(const k of ['TRIANGLES','UNSIGNED_SHORT','UNSIGNED_INT','BLEND','SRC_ALPHA','ONE_MINUS_SRC_ALPHA'])g[k]=k;
 for(const k of ['useProgram','enable','blendFunc','depthMask','disable'])g[k]=(...args)=>trace.push([k,...args]);
 g.bindVertexArray=v=>{vao=v;trace.push(['bind',v]);};
 for(const k of ['drawElementsInstanced','drawArraysInstanced'])g[k]=(...args)=>trace.push([k,vao,...args]);
 const data=new Float32Array(28*4);for(let j=0;j<4;j++){data[j*28]=data[j*28+5]=data[j*28+10]=data[j*28+15]=1;data[j*28+20]=j<2?materials[j]:j===2?46:28;data[j*28+21]=99;data[j*28+23]=2;}
 const stream={data,used:data.length};
 const b={uniformMaterial:45,foliageIsotropic:true,vertexCount:60,resource:{indexBuffer:true,indexType:'uint16'}};
 const item={b,record:{offset:0,count:2,vao:'leaf'}};
 if(shape==='page')item.pageRange208=[0,60];
 if(shape==='ranges')item.ranges=[[0,30],[30,30]];
 if(shape==='arrays')b.resource.indexBuffer=false;
 if(shape==='mixedHead')b.uniformMaterial=null;
 if(shape==='truncated')stream.used=28;
 if(shape==='badOffset')item.record.offset=.5;
 const other={b:{...b,uniformMaterial:46},record:{offset:56,count:1,vao:'evergreen'}};
 const clear={b:{...b,uniformMaterial:28,foliageIsotropic:false},record:{offset:84,count:1,vao:'glass'}};
 const cached={drawItems:[item,other,clear],drawClearStart:2,submitted:4,triangles:80,culled:0};
 const e={gl:g,state:{season,specializedFoliage:specialized,specializedCeramic:specialized,...state},instanceStreams:new Map([[0,stream],[2,stream],[3,stream]]),stats:{},shadowTarget:{tex:'shadowTex'},reflectTarget:{tex:'reflectTex'},dummy:'dummy',atlas:'atlas',materials:'materials',shoreTexture:'shore',people:{active:true,mask:true,metrics:{instances:2,triangles:5,mainCalls:1,shadowCalls:1},draw:()=>trace.push(['people'])},sky:()=>trace.push(['sky']),stateUniforms:(p,vp,eye,pa)=>trace.push(['uniforms',p.p,pa]),sampler:(p,k,n,t)=>trace.push(['sampler',p.p,k,n,t]),visibleScene:(vp,slot)=>{trace.push(['visibleScene',slot]);return cached;}};
 for(const k of ['main','shadow','foliage','ceramic','glass','membrane','unknown'])e[k]={p:k};
 const p=pass===2?e.shadow:e.main;
 return {e,p,item,cached,stream,trace,pass};
}
// Independent test data: expected outcomes are specified here, never derived from canSkip45.
const seasonTable=[
 ['summer',1,false],['threshold',2.5,false],['belowMidpoint',2.5+2**-24,false],
 ['midpointTie',2.5+2**-23,false],['nextFloat',2.5+2**-22,true],['winter',3,true],
 ['negativeInfinity',-Infinity,false],['infinity',Infinity,false],['nan',NaN,false],
 ['overflow',1e40,false],['string','3',false],['undefined',undefined,false]
];
const shapeTable=[['normal',true],['page',false],['ranges',false],['arrays',true],['mixedHead',false],['truncated',false],['badOffset',false]];
const materialTable=[[[45,45],true],[[45,46],false],[[46,45],false],[[45,16],false],[[45,NaN],false]];
const cases=[];
for(const [name,season,expectedSkip] of seasonTable)for(const pass of [0,1,2,3])for(const specialized of [false,true])cases.push({name,season,pass,specialized,expectedSkip});
for(const pass of [0,1,2,3])for(const [shape,shapeEligible] of shapeTable)for(const [materials,pure45] of materialTable)cases.push({pass,shape,materials,expectedSkip:shapeEligible&&pure45});
for(const pass of [0,1,2,3])for(const state of [{isolate:99,selected:99,explode:100,time:100,weather:2},{isolate:88,selected:88,explode:-100,time:0,weather:0,skyAfterOpaque:false}])cases.push({pass,state,expectedSkip:true});
test('actual Engine.draw matches the independent season/material/shape/state table',()=>{
for(const config of cases){
 const a=make(config),b=make(config),before=Buffer.from(b.stream.data.buffer).toString('hex'),items=b.cached.drawItems,records=items.map(x=>x.record);
 const skip=config.expectedSkip;
 if(config.name==='undefined'){assert.equal(a.e.state.season,undefined);assert.equal(b.e.state.season,undefined);}
 compiled.control.call(a.e,a.p,[1,0,0,1],[4,5,6],a.pass);compiled.candidate.call(b.e,b.p,[1,0,0,1],[4,5,6],b.pass);
 const expected=skip?a.trace.filter(x=>!(x[0]==='bind'&&x[1]==='leaf')&&!(/^draw/.test(x[0])&&x[1]==='leaf')):a.trace;
 assert.deepEqual(b.trace,expected,JSON.stringify(config));
 if(b.pass===0){const expectedStats={...a.e.stats};if(skip){expectedStats.drawnInstances-=2;expectedStats.drawnTriangles-=40;expectedStats.drawCalls-=1;}assert.deepEqual(b.e.stats,expectedStats);}
 assert.equal(Buffer.from(b.stream.data.buffer).toString('hex'),before);assert.equal(b.cached.drawItems,items);for(let j=0;j<records.length;j++)assert.equal(items[j].record,records[j]);checks++;
}
});
// Full draw execution with independently enumerated retained VAOs at each boundary.
const layoutTable=[
 {name:'firstTransparent45',m:[46,45,28],clear:1,skip:[[ ],[1],[1],[ ]]},
 {name:'lastOpaque45',m:[46,45,28],clear:2,skip:[[1],[1],[1],[1]]},
 {name:'allOpaqueSkipped',m:[45,45,45],clear:3,skip:[[0,1,2],[0,1,2],[0,1,2],[0,1,2]]},
 {name:'noTransparent',m:[46,45,46,45],clear:4,skip:[[1,3],[1,3],[1,3],[1,3]]},
 {name:'interleavedBoundary',m:[45,46,45,46,45,46,45],clear:4,skip:[[0,2],[0,2,4,6],[0,2,4,6],[0,2]]}
];
function makeLayout(layout,pass,specialized,skyAfterOpaque){
 const x=make({pass,specialized,state:{skyAfterOpaque}}),data=new Float32Array(layout.m.length*28);
 x.cached.drawItems=layout.m.map((mat,i)=>{data[i*28]=data[i*28+5]=data[i*28+10]=data[i*28+15]=1;data[i*28+20]=mat;return{b:{uniformMaterial:mat,foliageIsotropic:mat===45||mat===46,vertexCount:60,resource:{indexBuffer:true,indexType:'uint16'}},record:{offset:i*28,count:1,vao:'item'+i}};});
 x.stream.data=data;x.stream.used=data.length;x.cached.drawClearStart=layout.clear;x.cached.submitted=layout.m.length;x.cached.triangles=layout.m.length*20;return x;
}
let boundaryScenarios=0;
test('actual draw preserves opaque/transparent boundaries and end-of-opaque work',()=>{
for(const layout of layoutTable)for(const pass of [0,1,2,3])for(const specialized of [false,true])for(const skyAfterOpaque of [false,true]){
 const a=makeLayout(layout,pass,specialized,skyAfterOpaque),b=makeLayout(layout,pass,specialized,skyAfterOpaque),skip=new Set(layout.skip[pass].map(i=>'item'+i));
 const before=Buffer.from(b.stream.data.buffer).toString('hex'),items=b.cached.drawItems,records=items.map(x=>x.record),cached=b.cached;
 compiled.control.call(a.e,a.p,[1,0,0,1],[4,5,6],pass);compiled.candidate.call(b.e,b.p,[1,0,0,1],[4,5,6],pass);
 const expected=a.trace.filter(x=>!(x[0]==='bind'&&skip.has(x[1]))&&!(/^draw/.test(x[0])&&skip.has(x[1])));
 assert.deepEqual(b.trace,expected,layout.name+' pass '+pass);
 const actualDraws=b.trace.filter(x=>/^draw/.test(x[0])).map(x=>x[1]);
 assert.deepEqual(actualDraws,layout.m.map((_,i)=>'item'+i).filter(k=>!skip.has(k)));
 assert.equal(b.trace.filter(x=>x[0]==='people').length,pass===0||pass===3?1:0);
 assert.equal(b.trace.filter(x=>x[0]==='sky').length,(pass===0||pass===3)&&skyAfterOpaque?1:0);
 assert.equal(b.trace.filter(x=>x[0]==='enable'&&x[1]==='BLEND').length,(pass===0||pass===3)&&layout.clear<layout.m.length?1:0);
 if(pass===0)assert.deepEqual(b.e.stats,{...a.e.stats,drawnInstances:a.e.stats.drawnInstances-skip.size,drawnTriangles:a.e.stats.drawnTriangles-skip.size*20,drawCalls:a.e.stats.drawCalls-skip.size});
 assert.equal(Buffer.from(b.stream.data.buffer).toString('hex'),before);assert.equal(b.cached,cached);assert.equal(b.cached.drawItems,items);for(let i=0;i<records.length;i++)assert.equal(items[i].record,records[i]);
 boundaryScenarios++;checks++;
}
});
const programTable=[['main',[true,true,false,true,false,false]],['shadow',[false,false,true,false,false,false]],['unknown',[false,false,false,false,false,false]]];
test('actual draw falls back for unsupported program/pass pairs',()=>{
 for(const [name,expected] of programTable)for(const [i,pass] of [0,1,2,3,4,-1].entries()){
  const a=make({pass}),b=make({pass});a.p=a.e[name];b.p=b.e[name];
  compiled.control.call(a.e,a.p,[],[],pass);compiled.candidate.call(b.e,b.p,[],[],pass);
  const trace=expected[i]?a.trace.filter(x=>!(x[0]==='bind'&&x[1]==='leaf')&&!(/^draw/.test(x[0])&&x[1]==='leaf')):a.trace;
  assert.deepEqual(b.trace,trace,name+' pass '+pass);checks++;
 }
});
test('Float32 boundaries and shader discard ordering remain explicit',()=>{
// At the midpoint, ties-to-even maps to 2.5; the next representable float crosses the guard.
assert.equal(Math.fround(2.5+2**-23),2.5);assert.equal(Math.fround(2.5+2**-22),2.500000238418579);checks+=2;
// The original shader must still contain both unconditional winter exits and discard before picking.
const src=compiled.engineSource;
assert.equal((src.match(/if\(mat==45\.&&season>2\.5\)return false;/g)||[]).length,2);
assert.ok(src.indexOf('if((vMat==45.||vMat==46.)&&!vegetation46Visible(vMat,vUV,uSeason))discard;')<src.indexOf('if(uPass==1){int id='));checks+=2;
});
test('portable validation receipt',()=>{
assert.equal(checks,346,'all independent scenario groups completed');
assert.ok(new Float32Array(1) instanceof compiled.Float32Array);
const result={sourceHash:compiled.sourceHash,checks,assertionCount,traceScenarios:cases.length+boundaryScenarios,originalMatrixScenarios:cases.length,boundaryScenarios,expectedOracle:'Independent explicit season/material/shape/program/layout tables; no canSkip45 call computes expected draw traces',undefinedStateVerified:true,candidateDrawHash:compiled.candidateDrawHash,baselineDrawHash:compiled.baselineDrawHash,baselineEngineHash:compiled.baselineEngineHash,actualPrototypeMethod:true,actualHelperClosure:true,streamRealm:'engine VM Float32Array constructor',status:'PASS',scope:'Private original-vs-candidate CPU mock GL trace, not GPU execution or pixel/FPS validation',unchanged:['source engine','geometry','instance stream bytes','cached drawItems and records','draw ordering of retained geometry','shader/program/uniform/people/sky/blend control flow'],fallback:['Float32 season <= 2.5','nonfinite/non-number season','mixed45/46 or45/16','material head unknown','page208','ranges','transparent region','truncated stream','fractional offset','unsupported program/pass']};
console.log(JSON.stringify(result));
});
