const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=process.env.PKU_APP_ROOT||path.resolve(__dirname,'..');
const c=vm.createContext({YY:{M:{},Visibility:{prepareSingle(){}}},clearTimeout});
for(const name of ['material-detail.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(root,'src',name),'utf8'),c);
const P=c.YY.Engine.prototype;
function bucket(mat,count=1){
 const data=new Float32Array(count*28);for(let i=0;i<count;i++){data[i*28]=data[i*28+5]=data[i*28+10]=data[i*28+15]=1;data[i*28+20]=mat;}
 const b={count,data,uniformMaterial:mat,materials:new Set([mat]),vertexCount:3,resource:{}};
 P.compileBucket.call(Object.create(P),b,{});return b;
}
function item(mat,offset,resource){const b=bucket(mat);if(resource)b.resource=resource;return{b,record:{offset,count:1,vao:{}},ranges:null};}
test('specialized sources preserve the full material expression by literal substitution',()=>{
 const e=Object.assign(Object.create(P),{gl:{isContextLost:()=>false,getExtension:()=>null},program(v,f){return{p:{},v,f}}});
 e.compilePrograms(true);
 for(const [name,mat]of [['ground',0],['mapped',6],['stone',21]]){
  assert.equal(e[name].v,e.main.v);
  assert.equal(e[name].f,e.main.f.replace(/\bvMat\b/g,mat+'.').replace('flat in float '+mat+'.;',''));
 }
});
test('mixed instance data cannot route as constant material or merge across program boundaries',()=>{
 for(const mat of [0,6,21]){
  const b=bucket(mat,2);assert.equal(mat===0?b.groundMaterial:b.ordinaryMaterial,mat===0?true:mat);
  b.data[48]=mat===0?6:0;P.compileBucket.call(Object.create(P),b,{});
  assert.equal(b.groundMaterial,false);assert.equal(b.ordinaryMaterial,0);
 }
 const resource={};
 for(const [a,b,draws]of [[0,0,1],[6,6,1],[21,21,1],[0,6,2],[6,21,2],[21,9,2]]){
  const items=[item(a,0,resource),item(b,28,resource)];
  const grouped=P.groupDraws.call(Object.create(P),items,2);
  assert.equal(grouped.drawItems.length,draws);assert.equal(items[0].record.count,1);
  assert.equal(grouped.drawItems.reduce((n,x)=>n+x.record.count,0),2);
 }
});
function draw(pass,ordinary,ground){
 let active;const drawn=[],samplers=[],uniforms=[];
 const gl={useProgram(p){active=p.name},bindVertexArray(){},drawArraysInstanced(){drawn.push(active)},enable(){},disable(){},blendFunc(){},depthMask(){}};
 const e=Object.assign(Object.create(P),{gl,state:{season:1,specializedFoliage:false,specializedCeramic:false,specializedOrdinary:ordinary,specializedGround:ground,skyAfterOpaque:false},stats:{},shadowTarget:{tex:{}},reflectTarget:{tex:{}},dummy:{},
  stateUniforms(p){active=p.p.name;uniforms.push(active)},sampler(p,n,u){samplers.push([p.p.name,n,u])},visibleScene(){return{drawItems:[0,6,21,0,9,44,47].map((m,i)=>item(m,i*28)),drawClearStart:5,submitted:7,triangles:7,culled:0}}});
 for(const name of ['main','ground','mapped','stone','glass','membrane','shadow'])e[name]={p:{name}};
 e.draw(pass===2?e.shadow:e.main,[],[],pass);return{drawn,samplers,uniforms};
}
test('ground and ordinary switches independently preserve draw order and all six sampler units',()=>{
 const units=['uShadowMap','uReflectionMap','uAtlas','uMaterials','uShoreDistance','uScan1119'];
 for(const pass of [0,3])for(const ordinary of [false,true])for(const ground of [false,true]){
  const r=draw(pass,ordinary,ground),g=ground?'ground':'main';
  assert.deepEqual(r.drawn,[g,ordinary?'mapped':'main',ordinary?'stone':'main',g,'main','glass','membrane']);
  for(const name of [...(ground?['ground']:[]),...(ordinary?['mapped','stone']:[])]){
   assert.equal(r.uniforms.filter(x=>x===name).length,1);
   assert.deepEqual(r.samplers.filter(x=>x[0]===name),units.map((u,i)=>[name,u,i]));
  }
 }
 for(const pass of [1,2])assert.deepEqual(draw(pass,true,true).drawn,Array(7).fill(pass===1?'main':'shadow'));
});
