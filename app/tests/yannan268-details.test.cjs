const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),root=path.resolve(__dirname,'..');
function capture(enabled,pick=268,sealed=true){
 const canvas=new Proxy({measureText:()=>({width:100})},{get:(o,k)=>o[k]||(()=>{})}),c=vm.createContext({console,document:{createElement:()=>({getContext:()=>canvas})},YY:{COLORS:{roof:'#636968',glass:'#546c76',wood:'#704c38',stone:'#bcbeba',wall:'#d3d2c8'}}});
 const legacy=[...fs.readFileSync(root+'/index.html','utf8').matchAll(/src="src\/(legacy\/[^" ]+).js"/g)].map(q=>q[1]);
 for(const n of ['math','geometry','footprints','engine','models','architecture-data',...legacy,'architecture-adapter','architecture-v30',...(enabled?['yannan268-details']:[])])vm.runInContext(fs.readFileSync(root+'/src/'+n+'.js','utf8').replace(sealed?'__NO_MATCH__':'closeCuts(f,roofFaces,add);',''),c,{filename:n});
 const Y=c.YY,out=[],raw=[],e={buckets:new Map(),stats:{instances:0}},b=new Y.Builder({add(k,g,m,color,p,uv){Y.Engine.prototype.add.call(e,k,g,m,color,p,uv);assert.deepEqual(Array.from(e.buckets.get(k).geometry.v),Array.from(new Float32Array(g.v)));out.push({k,v:Array.from(g.v),m:Array.from(m),color,p:Array.from(p),uv});}});
 const roof=b.heritageRoof,mesh=b.mesh;let inRoof=false,inDoor=false;const door=b.heritageDoor;b.heritageDoor=function(...a){inDoor=true;try{return door.apply(this,a);}finally{inDoor=false;}};
 b.heritageRoof=function(...a){inRoof=true;try{return roof.apply(this,a);}finally{inRoof=false;}};
 const tracking=b.heritageRoof;
 b.mesh=function(k,g,x,y,z,sx,sy,sz,color,mat=0,detail=0,r=0,uv){raw.push({door:inDoor||k.startsWith('yannan268-')&&!inRoof,roof:inRoof,k,v:Array.from(g.v),m:Array.from(Y.M.transform(this.world([x,y,z]),[sx,sy,sz],this.rotation+r)),color,mat,detail});return mesh.call(this,k,g,x,y,z,sx,sy,sz,color,mat,detail,r,uv);};
 const f=JSON.parse(fs.readFileSync(root+'/data/campus.json')).features.find(f=>f.properties.pickId===pick),result=Y.Architecture30.render(b,f,(k,g,color,mat,id)=>b.e.add(k,g,Y.M.identity(),color,[mat,id,0,0]));assert.equal(b.heritageRoof,tracking);return{out,raw,result};
}
const isCentralPost=q=>q.k==='box'&&Math.abs(q.m[12])<.25&&Math.abs(q.m[13]-1.93)<1e-5&&Math.abs(q.m[0]-.11)<1e-6&&Math.abs(q.m[5]-3.12)<1e-5&&Math.abs(q.m[10]-.11)<1e-6;
const before=capture(false),after=capture(true);
test('target only: source outside roof and door remains exact, neighbouring house unchanged',()=>{
 const keep=q=>q.raw.filter(q=>!q.roof&&!q.door&&!isCentralPost(q)&&!(q.k==='box'&&q.color==='#b3b4a9'&&Math.abs(q.m[5]-.16)<1e-6));assert.ok(JSON.stringify(keep(before))===JSON.stringify(keep(after)),'source non-door/roof submissions differ');
 assert.equal(JSON.stringify(capture(false,267).out),JSON.stringify(capture(true,267).out));
 assert.equal(after.result.frame.r,before.result.frame.r);assert.equal(after.result.scale[0],before.result.scale[0]);assert.equal(after.result.scale[2],before.result.scale[2]);
});
test('rolled roof retains tile detail and both roof directions, single leaf and independent transom survive Adapter',()=>{
 assert.equal(after.raw.filter(q=>q.k==='yannan268-roll-roof').length,2);
 assert.equal(before.raw.filter(q=>q.k==='heritage-eave-tile').length,after.raw.filter(q=>q.k==='heritage-eave-tile').length);
 for(const q of after.raw.filter(q=>q.k==='yannan268-roll-roof')){assert.equal(q.v.length/24,96);assert.ok(q.v.some((v,i)=>i%8===1&&v>.4&&v<.6));}
 assert.equal(after.out.filter(q=>q.k==='v30-yannan268-single-glass').length,1);assert.equal(after.out.filter(q=>q.k==='v30-yannan268-upper-transom-glass').length,1);assert.equal(after.out.filter(q=>q.k==='v30-yannan268-entry-step').length,3);
 assert.ok(after.out.every(q=>q.v.every(Number.isFinite)&&q.m.every(Number.isFinite)));
});
const apply=(m,p)=>[0,1,2].map(i=>m[i]*p[0]+m[4+i]*p[1]+m[8+i]*p[2]+m[12+i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function hit(o,d,a,b,c){const e=sub(b,a),f=sub(c,a),h=cross(d,f),det=dot(e,h);if(Math.abs(det)<1e-9)return Infinity;const s=sub(o,a),u=dot(s,h)/det;if(u<0||u>1)return Infinity;const q=cross(s,e),v=dot(d,q)/det;if(v<0||u+v>1)return Infinity;const t=dot(f,q)/det;return t>1e-6?t:Infinity;}
test('door and separate transom glazing clear all opaque geometry',()=>{
 const triangles=[];for(const q of after.out){if(q.p[0]===5)continue;for(let i=0;i<q.v.length;i+=24)triangles.push([0,8,16].map(k=>apply(q.m,q.v.slice(i+k,i+k+3))));}
 for(const q of after.out.filter(q=>['v30-yannan268-single-glass','v30-yannan268-upper-transom-glass'].includes(q.k))){const n=[q.m[8],q.m[9],q.m[10]],l=Math.hypot(...n),normal=n.map(x=>x/l),d=normal.map(x=>-x);for(const x of[-.13,.13])for(const y of[-.15,.15]){const p=apply(q.m,[x,y,.5]),o=p.map((v,i)=>v+normal[i]*.6);let nearest=Infinity;for(const t of triangles)nearest=Math.min(nearest,hit(o,d,...t));assert.ok(nearest>=.6-1e-5,`blocked ${q.k} ${nearest}`);}}
});
test('cut shell only adds geometry, stays on mapped boundary and closes its roof intersections',()=>{
 const open=capture(true,268,false);assert.equal(JSON.stringify(after.out.filter(q=>q.k!=='yannan268-cut-wall-shell')),JSON.stringify(open.out));
 const shell=after.out.find(q=>q.k==='yannan268-cut-wall-shell');assert.ok(shell&&shell.v.length>0);
 const f=JSON.parse(fs.readFileSync(root+'/data/campus.json')).features.find(f=>f.properties.pickId===268),r=f.geometry.coordinates[0];
 const distance=p=>Math.min(...r.slice(1).map((b,i)=>{const a=r[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[2]-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(p[0]-a[0]-t*dx,p[2]-a[1]-t*dz);}));
 for(let i=0;i<shell.v.length;i+=8){const p=shell.v.slice(i,i+3);assert.ok(distance(p)<1e-5);assert.ok(p[1]>=.029&&p[1]<=3.901);}
 for(let i=0;i<shell.v.length;i+=24){const a=shell.v.slice(i,i+3),b=shell.v.slice(i+8,i+11),c=shell.v.slice(i+16,i+19);assert.ok(dot(cross(sub(b,a),sub(c,a)),shell.v.slice(i+3,i+6))>0);}
});
test('every roof-covered boundary sample has a wall below it, and rolled faces retain valid outward normals',()=>{
 const roofs=[],walls=[],f=JSON.parse(fs.readFileSync(root+'/data/campus.json')).features.find(f=>f.properties.pickId===268),r=f.geometry.coordinates[0];
 for(const q of after.out)for(let i=0;i<q.v.length;i+=24){const t=[0,8,16].map(k=>apply(q.m,q.v.slice(i+k,i+k+3)));if(q.p[0]===19)roofs.push(t);if(q.k==='yannan268-cut-wall-shell')walls.push(t);}
 let checked=0;for(let i=1;i<r.length;i++){const a=r[i-1],b=r[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=[-dz/len,0,dx/len];for(const t of[.1,.3,.5,.7,.9]){const p=[a[0]+dx*t,5,a[1]+dz*t];let nearest=Infinity;for(const tri of roofs)nearest=Math.min(nearest,hit(p,[0,-1,0],...tri));if(!Number.isFinite(nearest))continue;const top=5-nearest;if(top<.1)continue;for(const y of[.1,top*.45,top*.85]){const o=[p[0]+n[0]*.1,y,p[2]+n[2]*.1];let wall=Infinity;for(const tri of walls)wall=Math.min(wall,hit(o,n.map(v=>-v),...tri));assert.ok(Math.abs(wall-.1)<1e-4,`open boundary ${i-1}/${t}/${y}`);checked++;}}}assert.ok(checked>=30);
 for(const q of after.raw.filter(q=>q.k.startsWith('yannan268-roll-')))for(let i=0;i<q.v.length;i+=24){const a=q.v.slice(i,i+3),b=q.v.slice(i+8,i+11),c=q.v.slice(i+16,i+19);assert.ok(dot(cross(sub(b,a),sub(c,a)),q.v.slice(i+3,i+6))>0);}
 const steps=after.out.filter(q=>q.k==='v30-yannan268-entry-step');for(const q of steps)assert.ok(Math.abs(q.m[13]-q.m[5]/2)<1e-6,'step grounded');
});
test('entire approach depth to the door is clear, with four side posts and original header retained',()=>{
 assert.equal(before.raw.filter(isCentralPost).length,1);assert.equal(after.raw.filter(isCentralPost).length,0);
 const posts=q=>q.raw.filter(q=>q.k==='box'&&Math.abs(q.m[0]-.11)<1e-6&&Math.abs(q.m[5]-3.12)<1e-5&&Math.abs(q.m[10]-.11)<1e-6);assert.equal(posts(after).length,4);
 const triangles=[];for(const q of after.out)for(let i=0;i<q.v.length;i+=24)triangles.push([0,8,16].map(k=>apply(q.m,q.v.slice(i+k,i+k+3))));
 const leaf=after.out.find(q=>q.k==='v30-yannan268-single-glass'),front=leaf.m[14]+.2;
 // Probe a walking corridor from beyond the veranda to just before the leaf.
 // Earlier short rays stopped before reaching the obstructing central post.
 for(const x of[-.4,-.2,0,.2,.4])for(const y of[.65,1.0,1.4,1.8]){const o=[leaf.m[12]+x,y,front+3.5];let nearest=Infinity;for(const t of triangles)nearest=Math.min(nearest,hit(o,[0,0,-1],...t));assert.ok(nearest>=3.5-1e-5,`door approach blocked ${x}/${y}/${nearest}`);}
});
if(process.env.YANNAN268_REPORT){const summary=q=>({records:q.out.length,triangles:q.out.reduce((s,q)=>s+q.v.length/24,0),result:q.result});fs.writeFileSync(process.env.YANNAN268_REPORT,JSON.stringify({before:summary(before),after:summary(after)},null,2));fs.writeFileSync(path.join(path.dirname(process.env.YANNAN268_REPORT),'updated.json'),JSON.stringify(after));fs.writeFileSync(path.join(path.dirname(process.env.YANNAN268_REPORT),'baseline.json'),JSON.stringify(before));}
