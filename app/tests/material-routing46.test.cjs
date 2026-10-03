const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const c=vm.createContext({YY:{Visibility:{compile(){}}}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8'),c);
const e=Object.create(c.YY.Engine.prototype);
function classify(columns,material=45){const data=new Float32Array(28);columns.forEach((v,i)=>data.set(v,i*4));const b={data,count:1,uniformMaterial:material,materials:new Set([material])};e.compileBucket(b);return b.foliageIsotropic;}
test('leaf specialization requires an orthogonal similarity transform',()=>{
 assert.equal(classify([[2,0,0],[0,2,0],[0,0,2]]),true);
 const a=.47,c=Math.cos(a)*7,s=Math.sin(a)*7;
 assert.equal(classify([[c,0,-s],[0,7,0],[s,0,c]],46),true);
 assert.equal(classify([[2,0,0],[0,3,0],[0,0,2]]),false);
 // Equal column lengths alone are insufficient for a sheared transform.
 assert.equal(classify([[1,0,0],[.6,.8,0],[0,0,1]]),false);
 assert.equal(classify([[0,0,0],[0,0,0],[0,0,0]]),false);
});
test('non-leaf and mixed-material geometry always retains the general shader',()=>{
 for(const material of[0,4,18,24,44,null]){
  if(material===44)continue;
  assert.equal(classify([[1,0,0],[0,1,0],[0,0,1]],material),false);
 }
});

test('first opaque draw and subsequent material switches use the actual bound program',()=>{
 for(const pass of [0,3])for(const ceramic of [true,false])for(const materials of [[18,null,24],[25,18,25,45,24],[45,18,25,24]]){
  const engine=Object.create(c.YY.Engine.prototype),draws=[];let bound;
  for(const name of ['main','ceramic','foliage','glass'])engine[name]={p:name};
  engine.state={specializedCeramic:ceramic,skyAfterOpaque:false};engine.stats={};engine.shadowTarget={tex:{}};engine.reflectTarget={tex:{}};
  engine.gl={useProgram(p){bound=p;},bindVertexArray(){},drawArraysInstanced(){draws.push(bound);}};
  engine.stateUniforms=function(p){this.gl.useProgram(p.p);};engine.sampler=()=>{};
  const drawItems=materials.map(mat=>({b:{uniformMaterial:mat,foliageIsotropic:mat===45,vertexCount:3,resource:{}},record:{count:1,vao:{}},ranges:null}));
  engine.visibleScene=()=>({drawItems,drawClearStart:drawItems.length,submitted:materials.length,triangles:materials.length,culled:0});
  engine.draw(engine.main,[],[],pass);
  assert.deepEqual(draws,materials.map(mat=>mat===25&&ceramic?'ceramic':mat===45?'foliage':'main'));
 }
});
