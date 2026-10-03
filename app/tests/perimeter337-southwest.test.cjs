const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const APP=path.resolve(__dirname,'..'),name='perimeter337-southwest',candidate=path.join(APP,'src',name+'.js');
const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});
vm.runInContext('var YY={}',ctx);
// Always omit this module during baseline load, even after index integration.
for(const m of fs.readFileSync(path.join(APP,'index.html'),'utf8').matchAll(/script src="src\/(.*?)\.js"/g)){if(m[1]==='scene-v29')break;if(m[1]===name)continue;vm.runInContext(fs.readFileSync(path.join(APP,'src',m[1]+'.js'),'utf8'),ctx,{filename:m[1]});}
const Y=ctx.YY,source=JSON.stringify(Y.CAMPUS),runs=Y.Fences35.plan(Y.CAMPUS),priorPlan=JSON.stringify(runs),previous=Y.Perimeter335.renderConnections;
assert.equal(Y.Perimeter337Southwest,undefined,'baseline must not load candidate twice');vm.runInContext(fs.readFileSync(candidate,'utf8'),ctx,{filename:name});
const plain=x=>JSON.parse(JSON.stringify(x)),links=plain(Y.Perimeter337Southwest.plan(Y.CAMPUS,runs)),gate=Y.CAMPUS.features.find(f=>f.properties.id==='node/2485149510'),road=Y.CAMPUS.features.find(f=>f.properties.id==='way/628032111');
const r=Y.Gate763Details.frame(gate),p=gate.geometry.coordinates,world=(x,z)=>[p[0]+x*Math.cos(r)+z*Math.sin(r),p[1]-x*Math.sin(r)+z*Math.cos(r)];
const sub=(a,b)=>a.map((v,i)=>v-b[i]),cross=(a,b)=>a[0]*b[1]-a[1]*b[0],dist=(p,a,b)=>{const u=sub(b,a),v=sub(p,a),t=Math.max(0,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(u[0]**2+u[1]**2)));return Math.hypot(...p.map((x,i)=>x-a[i]-t*u[i]));};
function segmentDistance(a,b,c,d){const u=sub(b,a),v=sub(d,c),w=sub(c,a),den=cross(u,v);if(Math.abs(den)>1e-12){const t=cross(w,v)/den,s=cross(w,u)/den;if(t>=0&&t<=1&&s>=0&&s<=1)return 0;}return Math.min(dist(a,c,d),dist(b,c,d),dist(c,a,b),dist(d,a,b));}
function capture(render){const out=[],b=new Y.Builder({add(k,g,m,c,meta,uv){out.push({k,v:Array.from(g.v),m:Array.from(m),meta:Array.from(meta||[])});}});b.origin=[9,8,7];b.rotation=.7;b.id=121;b.anim=2;const old=JSON.stringify([b.origin,b.rotation,b.id,b.anim]);render(b,Y.CAMPUS,runs);assert.equal(JSON.stringify([b.origin,b.rotation,b.id,b.anim]),old);return out;}
const before=capture(previous),after=capture(Y.Perimeter335.renderConnections),added=after.slice(before.length);
test('source features, roads, all fence runs and old connection geometry remain unchanged',()=>{assert.equal(JSON.stringify(Y.CAMPUS),source);assert.equal(JSON.stringify(Y.Fences35.plan(Y.CAMPUS)),priorPlan);assert.deepEqual(after.slice(0,before.length),before);assert.deepEqual(plain(p),[-382.703,617.441]);});
test('six finite positive links connect the two original wall endpoints to the existing gate walls',()=>{
 assert.equal(links.length,6);for(const l of links){assert([...l.a,...l.c].every(Number.isFinite));assert(Math.hypot(...sub(l.a,l.c))>.1);assert.equal(l.style,'rubble');}
 for(const [a,b]of[[0,1],[1,2],[2,3],[4,5]])assert.deepEqual(links[a].c,links[b].a);
 const ends=runs.filter(s=>s.campus).flatMap(s=>[plain(s.a),plain(s.c)]);for(const i of[0,4])assert(ends.some(e=>e.every((v,k)=>v===links[i].a[k])));
 assert.deepEqual(links[3].c,world(-1.63,1.92));assert.deepEqual(links[5].c,world(1.64,2.325));
});
test('actual shared rubble geometry is finite, grounded and retains state with no extra gate submissions',()=>{
 assert.equal(added.length,6*links.reduce((n,l)=>n+Math.ceil(Math.hypot(...sub(l.c,l.a))/2.4),0),'each un-stretched wall cell retains body/cap and four relief meshes');
 for(const rec of added.filter(r=>r.k.startsWith('perimeter335-rubble-')))assert(Math.hypot(rec.m[0],rec.m[1],rec.m[2])<=1.000001,'shared 2.4m stones must not stretch along long links');
 for(const rec of added){assert([...rec.v,...rec.m,...rec.meta].every(Number.isFinite));assert.equal(rec.meta[1],0);for(let i=0;i<rec.v.length;i+=8){const q=Y.M.apply(rec.m,[...rec.v.slice(i,i+3),1]);assert(q[1]>=.14999&&q[1]<=2.32001);}}
});
test('full actual 2m road ribbon clears exact link segments, including the widest cap half-thickness',()=>{
 assert.equal(road.properties.width,2,'use the actual source display width, never a relaxed inferred width');const roadHalf=road.properties.width/2,capHalf=.55/2;
 let minimum=Infinity;for(const l of links)for(let j=1;j<road.geometry.coordinates.length;j++)minimum=Math.min(minimum,segmentDistance(l.a,l.c,road.geometry.coordinates[j-1],road.geometry.coordinates[j]));
 assert(minimum>roadHalf+capHalf+.30,`road edge allowance ${minimum-roadHalf-capHalf} must exceed .30m`);
 // Check every submitted vertex against the entire actual-width road ribbon.
 let actual=Infinity;for(const rec of added)for(let i=0;i<rec.v.length;i+=8){const q=Y.M.apply(rec.m,[...rec.v.slice(i,i+3),1]),xz=[q[0],q[2]];for(let j=1;j<road.geometry.coordinates.length;j++)actual=Math.min(actual,dist(xz,road.geometry.coordinates[j-1],road.geometry.coordinates[j]));}
 assert(actual>roadHalf+.30,`actual outer mesh to road edge ${actual-roadHalf}`);
 console.log('SOUTHWEST337_CLEARANCE',JSON.stringify({roadWidth:road.properties.width,minimumWallCentreToRoadCentre:minimum,capHalfThickness:capHalf,conservativeRoadEdgeMargin:minimum-roadHalf-capHalf,actualVertexRoadEdgeMargin:actual-roadHalf}));
});

test('the actual page load order retains the southwest connection wrapper',()=>{
 const c=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});vm.runInContext('var YY={}',c);
 for(const [,file]of fs.readFileSync(path.join(APP,'index.html'),'utf8').matchAll(/script src="src\/(.*?)\.js"/g)){if(file==='scene-v29')break;vm.runInContext(fs.readFileSync(path.join(APP,'src',file+'.js'),'utf8'),c,{filename:file});}
 assert.ok(c.YY.Perimeter337Southwest,'module is wired into the real index');
 assert.deepEqual(capture(c.YY.Perimeter335.renderConnections),after,'later modules must not replace or double the return-wall emission');
});
