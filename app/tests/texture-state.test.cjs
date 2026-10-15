'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const engineFile=process.env.PKU_ENGINE_SOURCE||path.resolve(__dirname,'../src/engine.js');
// The sky fixture uses an identity VP, whose inverse is itself. Geometry,
// lighting and uniform-value caching are outside this texture-state test.
const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
const context=vm.createContext({YY:{M:{inverse:m=>m}},clearTimeout});
vm.runInContext(fs.readFileSync(engineFile,'utf8'),context,{filename:engineFile});
const P=context.YY.Engine.prototype;
const samplerNames=['uShadowMap','uReflectionMap','uAtlas','uMaterials','uShoreDistance','uScan1119'];
const programNames=['main','ceramic','foliage','stone','mapped','ground','glass','membrane','shadow','skyProg'];
function fixture({transparent=true}={}){
 const gl={TEXTURE0:33984,TEXTURE_2D:3553,TEXTURE_2D_ARRAY:35866,TRIANGLES:4,
  active:33991,bindings:new Map(),calls:[],draws:[],program:null,vao:null,serial:0,
  activeTexture(unit){this.active=unit;this.calls.push(['active',unit]);},
  bindTexture(target,texture){this.bindings.set(this.active+':'+target,texture??null);this.calls.push(['bind',this.active,target,texture]);},
  getUniformLocation(p,name){return{p,name};},
  uniform1i(location,unit){location.p.units[location.name]=unit;this.calls.push(['uniform',location.p.name,location.name,unit]);},
  useProgram(p){this.program=p;},bindVertexArray(v){this.vao=v;},
  snapshot(){return{active:this.active,bindings:new Map(this.bindings),program:this.program?.name,vao:this.vao};},
  drawArraysInstanced(...args){this.draws.push({kind:'surface',args,...this.snapshot()});},
  drawArrays(...args){this.draws.push({kind:'sky',args,...this.snapshot()});},
  createTexture(){return{name:'published-'+ ++this.serial};}
 };
 for(const name of ['enable','disable','blendFunc','depthMask','texImage2D','pixelStorei','generateMipmap','texParameteri'])gl[name]=()=>{};
 const e=Object.assign(Object.create(P),{gl,stats:{},state:{season:1,specializedFoliage:false,specializedOrdinary:false,specializedGround:false,skyAfterOpaque:false},shadowTarget:{tex:{name:'shadow'}},reflectTarget:{tex:{name:'reflection'}},dummy:{name:'dummy'},atlas:{name:'atlas'},materials:{name:'materials'},shoreTexture:{name:'shore'},scan1119:{name:'scan'},emptyVAO:{name:'sky-vao'},people:null,
  uniform(){},stateUniforms(p){gl.useProgram(p.p);}});
 for(const name of programNames)e[name]={p:{name,units:{}},u:{}};
 const mats=transparent?[9,25,44,47,44]:[9,25];
 const plan={drawItems:mats.map((mat,i)=>({b:{uniformMaterial:mat,vertexCount:3,resource:{}},record:{count:1,vao:{name:'vao-'+i}}})),drawClearStart:2,submitted:mats.length,triangles:mats.length,culled:0};
 e.visibleScene=()=>plan;
 const requests=[];e.sampler=function(...args){requests.push(args.slice(0,4));return P.sampler.apply(this,args);};
 return{e,gl,requests,draw(pass=0){e.draw(e.main,identity,[0,0,1],pass);}};
}
function binds(gl){return gl.calls.filter(c=>c[0]==='bind');}
function expectedBindings(e,pass=0){return[e.shadowTarget.tex,pass===3?e.dummy:e.reflectTarget.tex,e.atlas||e.dummy,e.materials||e.dummy,e.shoreTexture,e.scan1119];}
function assertSurfaceState(f,pass=0){
 const expected=expectedBindings(f.e,pass),draws=f.gl.draws.filter(d=>d.kind==='surface');assert(draws.length>0);
 for(const draw of draws){assert.equal(draw.active,f.gl.TEXTURE0+5,'original last requested active unit');
  for(let unit=0;unit<expected.length;unit++){const target=unit===3||unit===5?f.gl.TEXTURE_2D_ARRAY:f.gl.TEXTURE_2D;assert.equal(draw.bindings.get((f.gl.TEXTURE0+unit)+':'+target),expected[unit],draw.program+' unit '+unit);}
 }
}
function pollute(f){const {gl}=f;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,{name:'external-2d'});gl.activeTexture(gl.TEXTURE0+5);gl.bindTexture(gl.TEXTURE_2D_ARRAY,{name:'external-array'});gl.activeTexture(gl.TEXTURE0+7);}

test('first null or undefined binding is emitted; repeated binding still initializes each program sampler',()=>{
 for(const texture of [null,undefined]){
  const {e,gl}=fixture(),state=[];e.sampler(e.main,'uAtlas',2,texture,state);e.sampler(e.glass,'uAtlas',2,texture,state);
  assert.equal(binds(gl).length,1);assert.equal(binds(gl)[0][3],texture);
  assert.equal(e.main.p.units.uAtlas,2);assert.equal(e.glass.p.units.uAtlas,2);
  assert.equal(gl.calls.filter(c=>c[0]==='uniform').length,2);assert.equal(gl.active,gl.TEXTURE0+2);
 }
});

test('unit, target and texture object identity determine binding; targets on one unit remain independent',()=>{
 const {e,gl}=fixture(),state=[],a={name:'a'},b={name:'b'};
 e.sampler(e.main,'uAtlas',0,a,state);e.sampler(e.main,'uAtlas',0,b,state);e.sampler(e.main,'uMaterials',0,a,state);e.sampler(e.main,'uAtlas',1,b,state);e.sampler(e.main,'uAtlas',0,b,state);
 assert.equal(gl.bindings.get(gl.TEXTURE0+':'+gl.TEXTURE_2D),b);assert.equal(gl.bindings.get(gl.TEXTURE0+':'+gl.TEXTURE_2D_ARRAY),a);
 assert.equal(gl.bindings.get((gl.TEXTURE0+1)+':'+gl.TEXTURE_2D),b);assert.equal(gl.active,gl.TEXTURE0);
 assert.equal(e.main.p.units.uAtlas,0);assert.equal(e.main.p.units.uMaterials,0);
 assert(binds(gl).some(c=>c[1]===gl.TEXTURE0&&c[2]===gl.TEXTURE_2D&&c[3]===b));
 const before=binds(gl).length;e.sampler(e.main,'uAtlas',0,b,state);assert.equal(binds(gl).length,before);
});

test('real draw skips repeated bindings across programs and preserves all six sampler uniforms and draw states',()=>{
 const f=fixture();f.draw();assertSurfaceState(f);assert.equal(f.gl.draws.filter(d=>d.kind==='surface').length,5);
 assert(binds(f.gl).length<f.requests.length,'repeated sampler requests must remove actual GL binds');
 for(const name of ['main','ceramic','glass','membrane'])assert.deepEqual(f.e[name].p.units,Object.fromEntries(samplerNames.map((n,i)=>[n,i])));
 assert.equal(f.gl.active,f.gl.TEXTURE0+5);
});

test('people and sky callbacks can mutate GL directly; transparent draws rebuild the binding snapshot',()=>{
 for(const boundary of ['people','sky','both']){
  const f=fixture();let peopleCalls=0,skyCalls=0;
  if(boundary!=='sky')f.e.people={draw(){peopleCalls++;pollute(f);const before=binds(f.gl).length;f.e.sampler(f.e.main,'uAtlas',2,f.e.atlas);assert.equal(binds(f.gl).length,before+1,'four-argument callback sampler remains uncached');}};
  if(boundary!=='people'){f.e.state.skyAfterOpaque=true;f.e.sky=function(...args){skyCalls++;pollute(f);return P.sky.apply(this,args);};}
  f.draw();assertSurfaceState(f);assert.equal(peopleCalls,boundary==='sky'?0:1);assert.equal(skyCalls,boundary==='people'?0:1);
  assert.equal(f.gl.active,f.gl.TEXTURE0+5);
 }
});

test('end-of-opaque callback preserves its final active unit; the next draw starts with fresh state',()=>{
 const f=fixture({transparent:false});let calls=0;f.e.people={draw(){calls++;pollute(f);}};
 f.draw();assertSurfaceState(f);assert.equal(calls,1);assert.equal(f.gl.active,f.gl.TEXTURE0+7);
 f.e.people=null;f.gl.draws=[];f.gl.calls=[];f.draw();assertSurfaceState(f);assert.equal(binds(f.gl).length,6);assert.equal(f.gl.active,f.gl.TEXTURE0+5);
});

test('resource publication between draws cannot leave a stale sampler binding',()=>{
 const f=fixture();f.draw();f.gl.activeTexture(f.gl.TEXTURE0);f.e.atlas=null;f.e.setAtlas({});const published=f.e.atlas;
 assert.equal(f.gl.bindings.get(f.gl.TEXTURE0+':'+f.gl.TEXTURE_2D),published,'actual setAtlas writes the currently active unit');
 f.gl.draws=[];f.gl.calls=[];f.draw(3);assertSurfaceState(f,3);
 assert.equal(f.gl.bindings.get((f.gl.TEXTURE0+2)+':'+f.gl.TEXTURE_2D),published);
});

test('a callback exception discards pass-local state before a subsequent draw',()=>{
 const f=fixture();f.e.people={draw(){pollute(f);throw Error('callback interrupted');}};
 assert.throws(()=>f.draw(),/callback interrupted/);assert.equal(f.gl.vao,null,'existing draw cleanup still executes');
 f.e.people=null;f.gl.draws=[];f.gl.calls=[];f.draw();assertSurfaceState(f);assert.equal(f.gl.active,f.gl.TEXTURE0+5);
});

test('sampler calls outside a draw remain unconditional after a rendered pass',()=>{
 const f=fixture();f.draw();f.gl.calls=[];f.e.sampler(f.e.main,'uAtlas',2,f.e.atlas);f.e.sampler(f.e.main,'uAtlas',2,f.e.atlas);
 assert.equal(binds(f.gl).length,2);assert.equal(f.gl.active,f.gl.TEXTURE0+2);
});
