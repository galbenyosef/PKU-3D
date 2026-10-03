const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const APP=path.resolve(__dirname,'..');
function capture(){
 const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});vm.runInContext('var YY={}',ctx);
 for(const n of [...fs.readFileSync(APP+'/index.html','utf8').matchAll(/script src="src\/(.*?)\.js"/g)].map(m=>m[1])){if(n==='scene-v29')break;vm.runInContext(fs.readFileSync(APP+'/src/'+n+'.js','utf8'),ctx,{filename:n});}
 const Y=ctx.YY,f=Y.CAMPUS.features.find(f=>f.properties.pickId===268),out=[],e={buckets:new Map(),stats:{instances:0}};
 const b=new Y.Builder({add(k,g,m,c,p,uv){Y.Engine.prototype.add.call(e,k,g,m,c,p,uv);const v=e.buckets.get(k).geometry.v,pts=[];for(let i=0;i<v.length;i+=8)pts.push(Y.M.apply(m,[...v.slice(i,i+3),1]).slice(0,3));out.push({k,c,p:Array.from(p),pts,bb:[0,1,2].map(a=>[Math.min(...pts.map(p=>p[a])),Math.max(...pts.map(p=>p[a]))])});}});
 Y.Landscape42.withElevation(b,f,()=>Y.Architecture30.render(b,f,(k,g,c,mat,id)=>b.e.add(k,g,Y.M.identity(),c,[mat,id,0,0])));return{out,M:Y.M};
}
const {out,M}=capture(),platforms=out.filter(r=>r.k==='v30-box'&&r.c==='#b3b4a9'&&Math.abs(r.bb[1][1]-.3163101524)<1e-5);
function ray(o,d,rows){let nearest=Infinity;for(const r of rows)for(let i=0;i<r.pts.length;i+=3){const[a,b,c]=r.pts.slice(i,i+3),e=M.sub(b,a),f=M.sub(c,a),h=M.cross(d,f),det=M.dot(e,h);if(Math.abs(det)<1e-10)continue;const s=M.sub(o,a),u=M.dot(s,h)/det,q=M.cross(s,e),v=M.dot(d,q)/det,t=M.dot(f,q)/det;if(u>=0&&v>=0&&u+v<=1&&t>1e-6)nearest=Math.min(nearest,t);}return nearest;}
test('existing three veranda blocks reach the ground without moving their top or footprint',()=>{
 assert.equal(platforms.length,3);const expected=[[-28.69774795,-23.84820008,401.85801315,404.25203323],[-20.02775323,-17.70185339,401.85801315,404.25203323],[-23.84820092,-20.02775276,401.85801259,402.52766857]];
 platforms.forEach((r,i)=>{assert(r.bb[1][0]<=.0450001,`suspended base at ${r.bb[1][0]}`);for(const[a,b]of[[r.bb[0][0],expected[i][0]],[r.bb[0][1],expected[i][1]],[r.bb[2][0],expected[i][2]],[r.bb[2][1],expected[i][3]]])assert(Math.abs(a-b)<2e-5);});
});
test('low horizontal rays hit both exposed platform fronts instead of passing beneath them',()=>{
 for(const r of platforms.slice(0,2))for(const fraction of[.15,.5,.85])for(const y of[.06,.10,.15]){const x=r.bb[0][0]+(r.bb[0][1]-r.bb[0][0])*fraction,o=[x,y,r.bb[2][1]+.1];assert(Math.abs(ray(o,[0,0,-1],out)-.1)<1e-5,`open undercroft at ${o}`);}
});
test('three exposed tread heights remain unchanged',()=>{
 const steps=out.filter(r=>r.k==='v30-yannan268-entry-step');assert.equal(steps.length,3);steps.forEach((r,i)=>{assert(Math.abs(r.bb[1][1]-[.1042780802,.2085561603,.3128342032][i])<1e-6);const x=(r.bb[0][0]+r.bb[0][1])/2,z=(r.bb[2][0]+r.bb[2][1])/2;assert(Math.abs((1-ray([x,1,z],[0,-1,0],out))-r.bb[1][1])<1e-6);});
});
