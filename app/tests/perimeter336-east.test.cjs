const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const APP=path.resolve(__dirname,'..'),plain=v=>JSON.parse(JSON.stringify(v));
const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>({scale(){}})})}});
vm.runInContext('var YY={}',ctx);ctx.YY.CAMPUS=JSON.parse(fs.readFileSync(APP+'/data/campus.json','utf8'));
for(const name of['math','geometry','models','gates-v33','perimeter335','gate767-details'])vm.runInContext(fs.readFileSync(APP+'/src/'+name+'.js','utf8'),ctx,{filename:name});
const Y=ctx.YY,before=plain(Y.CAMPUS.features.map(f=>({id:f.properties.id,pickId:f.properties.pickId,geometry:f.geometry}))),oldRender=Y.Gates33.render;
const source=APP+'/src/perimeter336-east.js';if(fs.existsSync(source))vm.runInContext(fs.readFileSync(source,'utf8'),ctx,{filename:'perimeter336-east'});
const eastModule=()=>{assert.ok(Y.Perimeter336East,'east perimeter reference module is installed');return Y.Perimeter336East;};
function capture(){const records=[],b=new Y.Builder({add:(key,g,m,col,meta)=>records.push({key,g,m,col,meta})});return{records,b};}
function finite(records){assert.ok(records.length>0);assert.ok(records.every(r=>r.m.every(Number.isFinite)&&r.g.v.every(Number.isFinite)));}

// Catch a broad north-wall selector sealing the photographed Law School opening
// or changing unrelated campus sections.
test('east wall follows the photographed stretches while the Law School opening stays clear',()=>{
 const E=eastModule();
 for(const q of[[426.344,-342],[430,-275],[433.1561,-212],[438.967,-101.108],[443.9388,-20]])assert.equal(E.style(q),'tiled-wall');
 for(const q of[[432.1081,-232],[432.632,-222],[433.1561,-212.001]])assert.equal(E.style(q),'building-frontage');
 for(const q of[[425,-370],[430,-10],[300,-275],[-430,-275],[450,70],[465,390],[475,530],[474.444,580.943]])assert.equal(E.style(q),null);
});

// Catch accidental closure of the public Wang Kezhen forecourt or expansion of
// that exception north over the independent Yanyuan Building gate.
test('only the evidenced southeast building forecourt suppresses the extra campus fence',()=>{
 const E=eastModule();
 for(const q of[[477.356,589.16],[477.219,615.231],[476.938,656.58],[457.09,697.73],[457.876,740.511]])assert.equal(E.style(q),'building-frontage');
 for(const q of[[474.444,580.943],[430,651.695],[478,745],[124.391,747.262]])assert.equal(E.style(q),null);
});

test('official Yanyuan gate identity keeps original source coordinates and every pick ID',()=>{
 eastModule();const f=Y.CAMPUS.features.find(f=>f.properties.id==='node/10729924621'),p=f.properties;
 assert.equal(p.name,'燕园大厦门');assert.equal(p.label,'燕园大厦门');assert.ok(p.aliases.includes('邱门'));
 assert.ok(p.references.some(r=>r.url==='https://bwb.pku.edu.cn/ywbl/xyjt/65951255933548b2b4586a196bc384d1.htm'));
 assert.deepEqual(plain(Y.CAMPUS.features.map(f=>({id:f.properties.id,pickId:f.properties.pickId,geometry:f.geometry}))),before);
 const ids=Y.CAMPUS.features.map(f=>f.properties.pickId);assert.equal(ids.length,new Set(ids).size);
});

// Catch replacement by a flat texture or per-cell rebuild: the curved coping
// must retain measurable surface relief and the same geometry across cells.
test('tiled wall emits shared three-dimensional coping and preserves caller state',()=>{
 const E=eastModule(),{b,records}=capture();b.origin=[17,4,9];b.rotation=.41;b.id=73;b.anim=6;const old=plain([b.origin,b.rotation,b.id,b.anim]);
 E.tiledWall(b,2.4,{a:[430,-280],c:[430,-277.6]});const first=records.slice();E.tiledWall(b,1.7,{a:[430,-277.6],c:[430,-275.9]});
 assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),old);finite(records);
 const tile=first.find(r=>r.key.includes('perimeter336-east')&&r.key.includes('tile'));assert.ok(tile,'coping uses shared tile geometry');
 assert.ok(records.slice(first.length).some(r=>r.g===tile.g),'adjacent cells reuse geometry');
 const vertices=[];for(let i=0;i<tile.g.v.length;i+=8)vertices.push(tile.g.v.slice(i,i+3));
 assert.ok(new Set(vertices.map(v=>v[1].toFixed(4))).size>8,'curved relief has many real heights');
 assert.ok(Math.max(...vertices.map(v=>v[2]))-Math.min(...vertices.map(v=>v[2]))>.35,'both pitched coping faces are present');
});

test('both pitched coping faces expose upward normals for lighting and face culling',()=>{
 const E=eastModule(),{b,records}=capture();E.tiledWall(b,2.4,{});
 const tile=records.find(r=>r.key.includes('tile'));assert.ok(tile);
 for(let i=0;i<tile.g.v.length;i+=8)assert.ok(tile.g.v[i+4]>=-1e-8,'coping surface faces outward above the wall');
});

test('Yanyuan gate has open iron leaves and finite geometry without leaking transforms',()=>{
 eastModule();const f=Y.CAMPUS.features.find(f=>f.properties.id==='node/10729924621'),{b,records}=capture();b.origin=[7,3,11];b.rotation=.73;b.id=44;b.anim=9;const old=plain([b.origin,b.rotation,b.id,b.anim]);
 const result=Y.Gates33.render(b,f);assert.equal(result.profile,'yanyuan-building-gate-official2024');assert.equal(result.currentAccessVerified,false);
 assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),old);finite(records);assert.ok(records.every(r=>r.meta[1]===f.properties.pickId));
 const leaves=records.filter(r=>r.key==='perimeter336-east-yanyuan-leaf');assert.equal(leaves.length,2);assert.equal(leaves[0].g,leaves[1].g);
 const booth=records.find(r=>r.key==='perimeter336-east-guard-roof');assert.ok(booth,'official view retains a separate blue-roof booth behind the gate');
 assert.ok(booth.m[12]<f.geometry.coordinates[0]-5,'booth is set inside the gate, not substituted for the southern pedestrian canopy');
 // The free ends open toward the public street, while retaining a real passage.
 assert.ok(leaves.every(r=>Math.abs(r.m[0])>.4),'leaves are shown partly open');
 for(const r of leaves){const xs=[];for(let i=0;i<r.g.v.length;i+=8)xs.push(Y.M.apply(r.m,[...r.g.v.slice(i,i+3),1])[0]);assert.ok(Math.max(...xs)>f.geometry.coordinates[0]+2.5,'free ends open east toward the street');}
 assert.ok(records.some(r=>r.key==='box'&&r.col==='#45554c'),'retain the southern enclosed booth base');
 const bounds=leaves.map(r=>{const xs=[];for(let i=0;i<r.g.v.length;i+=8){const v=Y.M.apply(r.m,[...r.g.v.slice(i,i+3),1]);xs.push(v[2]);}return[Math.min(...xs),Math.max(...xs)];});
 assert.ok(Math.max(bounds[0][0],bounds[1][0])-Math.min(bounds[0][1],bounds[1][1])>2,'leaf geometry leaves the central passage clear');
});

test('gate wrapper restores state when emission fails and preserves existing resource gate',()=>{
 eastModule();const f=Y.CAMPUS.features.find(f=>f.properties.id==='node/10729924621'),{b}=capture();b.origin=[8,9,10];b.rotation=.32;b.id=13;b.anim=2;const old=plain([b.origin,b.rotation,b.id,b.anim]);
 b.e.add=()=>{throw Error('upload rejected');};assert.throws(()=>Y.Gates33.render(b,f),/upload rejected/);assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),old);
 const resource=Y.CAMPUS.features.find(f=>f.properties.id==='node/10076453368'),a=capture(),c=capture();
 assert.deepEqual(plain(Y.Gates33.render(a.b,resource)),plain(oldRender(c.b,resource)));
 assert.deepEqual(plain(a.records.map(r=>[r.key,r.m,r.meta])),plain(c.records.map(r=>[r.key,r.m,r.meta])));
});

test('Yanyuan leaf retains the detailed high free end and lower hinge from the registered closed view',()=>{
 eastModule();const {b}=capture();Y.Gates33.render(b,Y.CAMPUS.features.find(f=>f.properties.id==='node/10729924621'));
 const v=b.cache['perimeter336-east-yanyuan-leaf'].v,outer=[],inner=[];
 for(let i=0;i<v.length;i+=8){if(v[i]<.05)outer.push(v[i+1]);if(v[i]>3.35)inner.push(v[i+1]);}
 assert.ok(Math.max(...inner)>Math.max(...outer)+.25,'do not mistake the nearer free end for the outer hinge');
 const original=Y.Gate767Details.leaf().v;assert.equal(v.length,original.length,'retain pointed finials and lower grille details');
 for(let i=0;i<original.length;i+=24)for(const[j,k]of[[0,16],[8,8],[16,0]]){
  assert.deepEqual(Array.from(v.slice(i+j,i+j+8)),[3.4-original[i+k],original[i+k+1],original[i+k+2],-original[i+k+3],...original.slice(i+k+4,i+k+8)],'reflect the original leaf with corrected winding and unchanged UVs');
 }
});

test('release script order keeps the 2024 gate renderer and its metadata active',()=>{
 const c=vm.createContext({console,document:{createElement:()=>({getContext:()=>({scale(){}})})}});
 vm.runInContext('var YY={}',c);c.YY.CAMPUS=JSON.parse(fs.readFileSync(APP+'/data/campus.json','utf8'));
 for(const name of ['math','geometry','models'])vm.runInContext(fs.readFileSync(APP+'/src/'+name+'.js','utf8'),c,{filename:name});
 // Load every gate wrapper in the real page order, including later legacy
 // refinements that an isolated module fixture cannot detect overriding it.
 for(const [,file] of fs.readFileSync(APP+'/index.html','utf8').matchAll(/script src="(src\/[^"]+\.js)"/g)){
  const code=fs.readFileSync(APP+'/'+file,'utf8');
  if(file==='src/gates-v33.js'||/Y\.Gates33\.render\s*=/.test(code))vm.runInContext(code,c,{filename:file});
 }
 const f=c.YY.CAMPUS.features.find(f=>f.properties.id==='node/10729924621'),records=[];
 const b=new c.YY.Builder({add:(key,g,m,col,meta)=>records.push({key,g,m,col,meta})});
 assert.equal(c.YY.Gates33.render(b,f).profile,'yanyuan-building-gate-official2024');
 assert.ok(records.some(r=>r.key==='perimeter336-east-yanyuan-leaf'));
 assert.ok(!records.some(r=>r.key==='gate767-arched-iron-leaf'));
 assert.match(f.properties.architecture.summary,/南侧带围护/);
 assert.match(f.properties.heightSource,/2024/);
});
