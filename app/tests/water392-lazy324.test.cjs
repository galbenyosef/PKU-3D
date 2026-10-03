const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const expected=['d56948470751651347df270ad1fa8264301df8e69a1f875e14bc323bd32b4a0d','2c4054eb4c087bc7d26f64a1516c8e743f50f0ee227cec23d57f6d7159e8f54e'];
const hash=g=>crypto.createHash('sha256').update(Buffer.from(new Float32Array(g.v).buffer)).digest('hex');
function load(){
 const context=vm.createContext({console});vm.runInContext('var YY={}',context);
 for(const file of ['math.js','geometry.js','data.js'])vm.runInContext(fs.readFileSync(path.join(root,'src',file),'utf8'),context);
 const Y=context.YY,ribbon=Y.Geo.ribbon,audit={calls:0,failAt:0};
 Y.Geo.ribbon=function(...args){audit.calls++;if(audit.calls===audit.failAt)throw Error('injected ribbon failure');return ribbon.apply(this,args);};
 Y.Network={build(){},route(){},routeEdges(){}};
 vm.runInContext(fs.readFileSync(process.env.PKU_WATER392_SOURCE||path.join(root,'src/water392-road316.js'),'utf8'),context);
 return {Y,audit,roads:[243,481].map(id=>Y.CAMPUS.features.find(f=>f.properties.pickId===id))};
}
test('cached scene module loading skips road geometry; first use retains exact meshes and identity',()=>{
 const {Y,audit,roads}=load();assert.equal(audit.calls,0);
 const meshes=roads.map(f=>Y.Water392Road316.roadGeometry(f));assert.equal(audit.calls,2);
 assert.deepEqual(meshes.map(hash),expected);
 roads.forEach((f,i)=>assert.equal(Y.Water392Road316.roadGeometry(f),meshes[i]));assert.equal(audit.calls,2);
});
test('first use retains module input snapshot after public path and width changes',()=>{
 const {Y,roads}=load();Y.Water392Road316.paths.west243[0][0]+=50;Y.Water392Road316.paths.branch481[0][1]-=30;
 roads.forEach(f=>{f.properties.width+=3;});assert.deepEqual(roads.map(f=>hash(Y.Water392Road316.roadGeometry(f))),expected);
});
test('failed pair initialization retries both roads and publishes no partial mesh',()=>{
 const {Y,audit,roads}=load();audit.failAt=2;
 assert.throws(()=>Y.Water392Road316.roadGeometry(roads[0]),/injected ribbon failure/);assert.equal(audit.calls,2);
 const meshes=roads.map(f=>Y.Water392Road316.roadGeometry(f));assert.equal(audit.calls,4);assert.deepEqual(meshes.map(hash),expected);
 roads.forEach((f,i)=>assert.equal(Y.Water392Road316.roadGeometry(f),meshes[i]));assert.equal(audit.calls,4);
});
