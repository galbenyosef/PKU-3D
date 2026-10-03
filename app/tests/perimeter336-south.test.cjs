const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const APP=path.resolve(__dirname,'..'),ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});
vm.runInContext('var YY={}',ctx);
for(const m of fs.readFileSync(APP+'/index.html','utf8').matchAll(/script src="src\/(.*?)\.js"/g)){if(m[1]==='scene-v29')break;vm.runInContext(fs.readFileSync(APP+'/src/'+m[1]+'.js','utf8'),ctx,{filename:m[1]});}
const Y=ctx.YY,plain=v=>JSON.parse(JSON.stringify(v)),resource=Y.CAMPUS.features.find(f=>f.properties.pickId===137),gate=Y.CAMPUS.features.find(f=>f.properties.id==='node/380722026');
function station(){const records=[],b=new Y.Builder({add:(key,g,m,col,meta)=>records.push({key,g,m,meta})});Y.Building042.render(b,resource,(key,g,col,mat,id)=>records.push({key,g,world:true,id}));return records;}
test('station door and low annex occupy the photographed west extension beside South Gate',()=>{
 const data=station(),door=data.filter(r=>r.key.includes('red-door-jamb'));
 assert.equal(door.length,2);assert.ok(door.every(r=>r.m[12]>151&&r.m[12]<159),'the doorway must not remain at the old x=172 location');
 const roof=data.find(r=>r.key==='042-flat-roof-west-annex'),xs=roof.g.v.filter((_,i)=>i%8===0);
 assert.ok(Math.min(...xs)<151&&Math.min(...xs)>145);assert.ok(Math.max(...xs)<166,'annex does not replace the first 16 metres of the main block');
 const target=resource.properties.frontObservation46.target;assert.ok(target[0]>151&&target[0]<159,'front view follows the actual moved entrance');
 assert.equal(Y.CAMPUS.features.filter(f=>f.properties.id==='way/240832252').length,1);
 assert.deepEqual(plain(resource.geometry.coordinates[0][0]),[163.6,726.787],'raw building footprint remains source data');
});
test('South Gate canopy is set back from its mapped outer control point, with wings ahead of the columns',()=>{
 const records=[],b=new Y.Builder({add:(key,g,m,col,meta)=>records.push({key,g,m,meta})});const original=plain(gate.geometry.coordinates);
 b.origin=[2,3,4];b.rotation=.4;b.id=123;b.anim=7;Y.Gates33.render(b,gate);
 const canopy=records.find(r=>Math.abs(r.m[0]-17.2)<.001&&Math.abs(r.m[5]-.66)<.001);
 assert.ok(canopy);assert.ok(canopy.m[12]-17.42/2>116.1,'west canopy must clear No.24 east gable');assert.ok(canopy.m[14]<737&&canopy.m[14]>731,'mapped checkpoint must not be reused as the physical roof anchor');
 const wings=records.filter(r=>Math.abs(r.m[0]-7.6)<.001&&Math.abs(r.m[5]-3.22)<.001);
 assert.equal(wings.length,2);assert.ok(wings.every(r=>r.m[14]>canopy.m[14]+5&&r.m[14]<744));
 assert.deepEqual(plain(gate.geometry.coordinates),original);assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),[[2,3,4],.4,123,7]);
 assert.ok(records.every(r=>r.m.every(Number.isFinite)&&r.g.v.every(Number.isFinite)));
});

test('South Gate east wing joins the station west wall without a leftover fence across its forecourt',()=>{
 const runs=Y.Fences35.plan(Y.CAMPUS),links=Y.Perimeter335.planConnections(Y.CAMPUS,runs),join=links.find(l=>l.name==='south-east');
 assert.ok(join);assert.ok(Math.min(join.a[0],join.c[0])<142&&Math.max(join.a[0],join.c[0])>147);
 assert.ok(join.a[1]<743&&join.c[1]<743,'return meets the actual station wall instead of the administrative ring');
 assert.equal(runs.filter(r=>r.campus&&r.a[0]>140.7&&r.a[0]<164&&r.a[1]>743).length,0);
});
