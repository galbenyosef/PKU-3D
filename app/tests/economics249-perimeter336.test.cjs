const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const APP=path.resolve(__dirname,'..'),ctx=vm.createContext({console,atob,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});
vm.runInContext('var YY={}',ctx);
for(const[,name]of fs.readFileSync(APP+'/index.html','utf8').matchAll(/script src="src\/(.*?)\.js"/g)){
 if(name==='scene-v29')break;
 vm.runInContext(fs.readFileSync(APP+'/src/'+name+'.js','utf8'),ctx,{filename:name});
}
const Y=ctx.YY,f=Y.CAMPUS.features.find(f=>f.properties.pickId===249),rows=[],sourceRows=[],adapter=Y.ArchitectureAdapter.render;
Y.ArchitectureAdapter.render=function(b,f,method,source,options){return adapter(b,f,(b,...args)=>{
 const emit=b.e.add;b.e.add=(...a)=>{sourceRows.push(a);return emit(...a);};
 try{return typeof method==='function'?method(b,...args):b[method](...args);}finally{b.e.add=emit;}
},source,options);};
const b=new Y.Builder({add(...a){rows.push(a);}}),result=Y.Architecture30.render(b,f,(key,g,col,mat,id)=>b.e.add(key,g,Y.M.identity(),col,[mat,id,0,0]));
const hash=a=>crypto.createHash('sha256').update(JSON.stringify(a)).digest('hex'),shape=r=>[r[0],Array.from(r[1].v),r[3],r[4],r[5]],whole=r=>[...shape(r),Array.from(r[2])];
function points(r){const a=[];for(let i=0;i<r[1].v.length;i+=8)a.push(Y.M.apply(r[2],[...r[1].v.slice(i,i+3),1]));return a;}
function sectionX(z){const xs=[];for(const r of rows.slice(1)){const ps=points(r);for(let i=0;i<ps.length;i+=3)for(let j=0;j<3;j++){
 const a=ps[i+j],c=ps[i+(j+1)%3];if((a[2]<=z&&c[2]>=z)||(c[2]<=z&&a[2]>=z)){
  if(Math.abs(c[2]-a[2])<1e-9){if(a[1]>.1)xs.push(a[0]);if(c[1]>.1)xs.push(c[0]);}
  else{const t=(z-a[2])/(c[2]-a[2]);if(a[1]+t*(c[1]-a[1])>.1)xs.push(a[0]+t*(c[0]-a[0]));}
 }
 }}return xs;}

// The old broad rear wing occupied the Small East Gate road. This section uses
// the actual registered OSM edge, not the model's own fit calculation.
test('Economics rear facade leaves the registered Small East Gate axis clear',()=>{
 const z=-422.8303988802362,edgeX=250.003+(z+397.537)/( -449.556+397.537)*(243.17-250.003),xs=sectionX(z);
 assert.ok(xs.length>100,'the section crosses the complete building facade');
 assert.ok(Math.max(...xs)<=edgeX+.015,`rear surface x=${Math.max(...xs)} must stay west of the mapped edge x=${edgeX}`);
 assert.ok(Math.max(...xs)>edgeX-.35,`retain the rear wall: actual ${Math.max(...xs)}, edge ${edgeX}`);
 assert.ok(256.98863924520197-Math.max(...xs)>10.25,'preserve the mapped space between the rear wall and gate');
});

// Frozen from the retained source before the rear-wing repair. Keep every
// original instance, atlas rectangle and material while allowing the small
// transition meshes to gain triangles where the rear line changes direction.
test('rear fitting preserves every shared mesh, glyph, UV and ordered detail record',()=>{
 assert.equal(rows.length,3264);assert.equal(result.retained,3263);assert.equal(result.clipped,0);assert.equal(result.dropped,0);
 assert.equal(hash(rows.map(r=>[r[0].split('-rear336-')[0],r[3],r[4],r[5]])),'17529c44f135394cb84d85ad233ace2a6ec4169ae6569540c23e5517a46a6ab1');
 const meshes=new Map();for(const r of rows){if(meshes.has(r[0]))assert.equal(r[1],meshes.get(r[0]),r[0]+' keeps shared geometry');else meshes.set(r[0],r[1]);}
 assert.ok(rows.every(r=>Array.from(r[2]).every(Number.isFinite)));
});

test('original fitting scale and all round-hall and west-entrance records remain at their original coordinates',()=>{
 assert.deepEqual(Array.from(result.scale),[1.4242476841281813,1.0174216095490511,.4921232907964432]);
 const start=rows.findIndex(r=>r[0]==='v30-cyl96_1'),end=rows.findLastIndex(r=>r[0]==='economics249-dome-normal196-cyl8_1')+1;
 assert.equal(end-start,1764);assert.equal(hash(rows.slice(start,end).map(whole)),'934f531f82b4fd91e9aa32331de455e0fd041679ffd9bfa355dbea054262bfe1');
 const west=rows.filter(r=>/^(?:v30-(?:economics249-|v14-arc-glass|v14-atrium-|v14-name-pier|v14-facade-character|v14-narrow-slit|v14-front-return-window))/.test(r[0]));
 assert.equal(west.length,518);assert.equal(hash(west.map(whole)),'85164868abb4d7b34ffc91e1802abe8f43752f04309ede3b7c360917e2816a08');
});

test('cross-seam masonry and its roof remain continuous while positive facade vertices stay fixed',()=>{
 const wings=sourceRows.filter(r=>r[0].split('-rear336-')[0]==='v14-brick-wing');assert.equal(wings.length,3);
 for(const[i,zMax]of[[0,31.5],[2,8.5]]){
  const zs=points(wings[i]).map(p=>p[2]);assert.ok(Math.abs(Math.max(...zs)-zMax)<.00001);
  assert.ok(Math.min(...zs)>-14,'rear ends compress without cutting or discarding their triangles');
 }
 const rear=points(wings[1]),north=rear.filter(p=>p[0]<-34.9),south=rear.filter(p=>p[0]>34.9);
 assert.ok(north.every(p=>p[2]>-14&&p[2]<0),'north end leaves the gate corridor clear');
 assert.ok(south.some(p=>Math.abs(p[2]+34)<.00001),'south end retains its original rear wall');
 assert.ok(south.some(p=>Math.abs(p[2]+20)<.00001),'south end retains its original inner wall');
 assert.ok(wings[0][1].v.length>288&&wings[2][1].v.length>288,'cross-zero wings split at the fixed facade plane');
});

test('split boxes retain their full UV area and finite outward triangle normals',()=>{
 const warped=sourceRows.filter(r=>r[0].includes('-rear336-'));
 assert.ok(warped.length>50,'exercise transition windows and cross-zero walls');
 for(const r of warped){
  const v=r[1].v;assert.ok(v.every(Number.isFinite));let uvArea=0;
  for(let i=0;i<v.length;i+=24){
   const a=v.slice(i,i+3),b=v.slice(i+8,i+11),c=v.slice(i+16,i+19),n=Y.M.norm(Y.M.cross(Y.M.sub(b,a),Y.M.sub(c,a)));
   for(const k of[0,8,16]){const normal=v.slice(i+k+3,i+k+6);assert.ok(Math.abs(Math.hypot(...normal)-1)<1e-6);assert.ok(n.reduce((s,x,j)=>s+x*normal[j],0)>.999999,'outward face normal '+r[0]);}
   const u=[0,8,16].map(k=>v.slice(i+k+6,i+k+8));uvArea+=Math.abs((u[1][0]-u[0][0])*(u[2][1]-u[0][1])-(u[2][0]-u[0][0])*(u[1][1]-u[0][1]))/2;
  }
  assert.ok(Math.abs(uvArea-6)<1e-6,'all six box faces retain original interpolated UV area '+r[0]);
 }
 const byMesh=new Map();for(const r of warped){const n=byMesh.get(r[1])||new Set();n.add(r[2][13]);byMesh.set(r[1],n);}
 assert.ok([...byMesh.values()].filter(ys=>ys.size===5).length>=10,'repeated window floors reuse transition meshes');
});

test('cross-zero facade surfaces retain the exact positive half, including UV interpolation',()=>{
 const r=sourceRows.find(r=>r[0].startsWith('v14-brick-wing-rear336-')),v=r[1].v,ps=points(r);
 // Original north return box centre [-29,-1], size [15,65]. On its
 // positive-z half, source x/z and the original cube UV mapping must agree.
 assert.ok(ps.some(p=>Math.abs(p[2])<1e-6),'a real split at z=0 prevents positive-side stretch');
 for(let i=0;i<v.length;i+=8){if(ps[i/8][2]<-1e-6)continue;
  assert.ok(Math.abs(v[i])<=.5+1e-7&&Math.abs(v[i+2])<=.5+1e-7);
  const n=v.slice(i+3,i+6),uv=v.slice(i+6,i+8);
  if(n[1]>.999)assert.ok(Math.abs(uv[0]-(v[i]+.5))<1e-6&&Math.abs(uv[1]-(.5-v[i+2]))<1e-6,'positive roof UV stays fixed');
 }
 const gate=Y.CAMPUS.features.find(q=>q.properties.pickId===1336);
 assert.deepEqual(Array.from(gate.geometry.coordinates),[256.98863924520197,-422.8303988802362]);
});
