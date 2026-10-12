'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../src');
function runtime(){const c=vm.createContext({YY:{Builder:function(){}},console});for(const name of ['math.js','geometry.js','trees-v46.js','quality-lod.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),c);return c.YY;}
const hash=v=>crypto.createHash('sha256').update(Buffer.from(new Float32Array(v).buffer)).digest('hex');
test('every High tree mesh retains its original Float32 bytes; lower meshes stay bounded and finite',()=>{
 const y=runtime(),expected=require('./fixtures/tree-high-quality-hashes.json');
 for(const [key,parts]of Object.entries(expected)){
  const split=key.lastIndexOf('-'),bundle=y.Trees46.geometry(key.slice(0,split),Number(key.slice(split+1)));
  for(const [part,digest]of Object.entries(parts)){
   const original=bundle[part];assert.equal(hash(original.v),digest,key+' '+part);assert.equal(original.qualityRole,'tree');assert.equal(original.qualityLods.length,2);
   const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(let i=0;i<original.v.length;i+=8)for(let j=0;j<3;j++){lo[j]=Math.min(lo[j],original.v[i+j]);hi[j]=Math.max(hi[j],original.v[i+j]);}
   let previous=original.v.length;
   for(const g of original.qualityLods){assert(g.v.length>0&&g.v.length<previous);assert.equal(g.v.length%24,0);previous=g.v.length;assert(g.v.every(Number.isFinite));for(let i=0;i<g.v.length;i+=8)for(let j=0;j<3;j++)assert(g.v[i+j]>=lo[j]&&g.v[i+j]<=hi[j]);}
  }
 }
});
test('LOD hysteresis retains a stable band in both directions',()=>{
 const {level}=runtime().QualityLOD;
 assert.equal(level(50,'medium',0),0);assert.equal(level(50,'medium',1),1);
 assert.equal(level(70,'medium',1),0);assert.equal(level(30,'medium',0),1);
 assert.equal(level(32,'low',1),1);assert.equal(level(32,'low',2),2);
 assert.equal(level(20,'low',1),2);assert.equal(level(40,'low',2),1);
 assert.equal(level(4,'medium',0,'roof'),0);assert.equal(level(1,'medium',0,'roof'),1);assert.equal(level(.5,'low',1,'roof'),2);
});
test('curved and hip-clipped roof tiles retain High geometry and use complete reduced arc meshes',()=>{
 const c=vm.createContext({YY:{}});for(const name of ['math.js','geometry.js','footprints.js','roof-tiles.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),c);
 const expected=require('./fixtures/roof-high-quality-hashes.json');let index=0;
 for(const axis of [0,1]){
  const b={local(x,y,z,r,fn){fn();},mesh(key,g,...args){const original=expected[index++];assert.equal(axis,original.axis);assert.equal(key,original.key);assert.equal(hash(g.v),original.hash);assert.deepEqual(args,original.args);assert.equal(g.qualityRole,'roof');assert.equal(g.qualityLods.length,2);for(const reduced of g.qualityLods){assert(reduced.v.every(Number.isFinite));assert(reduced.v.length<=g.v.length);if(g.v.length)assert(reduced.v.length>0);}}};
  c.YY.RoofTiles.render(b,{axis,name:'sample',p:[[-4,0],[4,0],[2,6],[-2,6]],y:p=>6+.18*p[axis]+.008*p[axis]*p[axis]},{origin:[0,0],rotation:0,key:'sample',color:'#777777'});
 }
 assert.equal(index,expected.length);
});
test('partition preserves every selected record, identity and per-level order; inspection restores full geometry',()=>{
 const y=runtime(),e={qualityPreset:'low',canvas:{clientHeight:1000},reflectTarget:{h:320},shadowSize:1024},b={vertexCount:600,passes:new Map()};y.QualityLOD.attach(b,[{vertexCount:300},{vertexCount:150}]);
 const data=new Float32Array(28*4);for(let k=0;k<4;k++){const i=k*28;data[i]=data[i+5]=data[i+10]=12;data[i+15]=1;data[i+14]=[40,300,900,300][k];data[i+21]=800000+k;}
 const context={slot:0,state:{selected:800002},lodEye:[0,6,0],focal:1000};let stream={used:0,data:data.slice()};
 const parts=y.QualityLOD.partition(e,b,context,stream,4);assert.deepEqual(Array.from(parts,p=>p.count),[2,2]);assert.deepEqual(Array.from({length:4},(_,k)=>stream.data[k*28+21]),[800000,800002,800001,800003]);
 for(let k=0;k<4;k++){const id=stream.data[k*28+21],index=id-800000;assert.deepEqual(stream.data.slice(k*28,k*28+28),data.slice(index*28,index*28+28));}
 stream={used:0,data:data.slice()};context.state={isolate:800001};const inspected=y.QualityLOD.partition(e,b,context,stream,4);assert.equal(inspected.length,1);assert.equal(inspected[0].b,b);assert.deepEqual(stream.data,data);
 context.state={};context.slot=3;context.waterLevel=0;stream={used:0,data:data.slice()};const reflected=y.QualityLOD.partition(e,b,context,stream,4);assert.equal(reflected.reduce((n,p)=>n+p.count,0),4);assert(e.qualityHistory.has(0)&&e.qualityHistory.has(3));
});
