const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const APP=path.resolve(__dirname,'..');
const corrections={
 'building012-v46': ["b.cyl(-width/2+.8+i*(width-1.6)/8,3.15,1.65,.10,.08,'#c7c8b8',24,1,24)","b.cyl(-width/2+.8+i*(width-1.6)/8,3.15,1.65,.10,.08,'#c7c8b8',24,1,8)"],
 'building080-v46': ['b.sphere(q[0]+sign*2.15,floor+.3,q[1],.72,.42,1.0,C.stone,10,.18,true)','b.sphere(q[0]+sign*2.15,floor+.3,q[1],.72,.42,1.0,C.stone,8,.18,true)']
};
function capture(fixed,pick){
 const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});vm.runInContext('var YY={}',ctx);
 const names=[...fs.readFileSync(APP+'/index.html','utf8').matchAll(/script src="src\/(.*?)\.js"/g)].map(m=>m[1]);
 for(const n of names){if(n==='scene-v29')break;let code=fs.readFileSync(APP+'/src/'+n+'.js','utf8');if(corrections[n]){const[a,b]=corrections[n];assert.equal(code.split(a).length-1,1,'exact source call '+n);if(!fixed)code=code.replace(a,b);}vm.runInContext(code,ctx,{filename:n});}
 const Y=ctx.YY,f=Y.CAMPUS.features.find(f=>f.properties.pickId===pick),e=Object.create(Y.Engine.prototype),out=[];e.buckets=new Map();e.stats={instances:0};
 const b=new Y.Builder({add(k,g,m,c,p,uv){const first=e.buckets.get(k)?.geometry;Y.Engine.prototype.add.call(e,k,g,m,c,p,uv);const cached=e.buckets.get(k).geometry;assert.deepEqual(Array.from(cached.v),Array.from(g.v,Math.fround),'first-key Float32 '+k);if(first)assert.equal(first,cached);out.push({k,v:Array.from(cached.v),m:Array.from(m),c,p:Array.from(p),uv:uv&&Array.from(uv)});}});
 const run=()=>Y.Landscape42.withElevation(b,f,()=>Y.Architecture30.render(b,f,(k,g,c,mat,id)=>b.e.add(k,g,Y.M.identity(),c,[mat,id,0,0])));run();const saved=out.slice();out.length=0;run();assert.deepEqual(saved,out,'repeat cache');return{out,Y};
}





const pairs=[41,286].map(id=>({id,before:capture(false,id),after:capture(true,id)}));
test('only the 9 entrance discs and 18 garden rocks change exact material metadata',()=>{
 for(const{id,before,after}of pairs){assert.equal(after.out.length,before.out.length);let changed=0;
 for(let i=0;i<before.out.length;i++){const a=before.out[i],b=after.out[i];if(JSON.stringify(a)===JSON.stringify(b))continue;changed++;assert.equal(a.p[0],8);assert.equal(a.p[1],id);assert.equal(b.p[0],id===41?24:10);assert.equal(a.k,id===41?'cyl24_1':'080-garden-stones-sphereSmooth');assert.equal(a.c,id===41?'#c7c8b8':'#aaa995');assert.deepEqual({...b,p:[8,...b.p.slice(1)]},a,'all vertex/matrix/color/UV/order and remaining metadata remain identical');}
 assert.equal(changed,id===41?9:18);
 }
});
test('changed non-sign meshes really used full-domain vertex UVs; all actual sign records remain unchanged',()=>{
 for(const{id,before,after}of pairs){let count=0;for(let i=0;i<before.out.length;i++){const a=before.out[i],b=after.out[i];if(a.p[0]===b.p[0]){if(a.p[0]===8)assert.deepEqual(a,b);continue;}count++;
 const u=[],v=[];for(let j=0;j<a.v.length;j+=8){u.push(a.v[j+6]);v.push(a.v[j+7]);}assert.deepEqual([Math.min(...u),Math.min(...v),Math.max(...u),Math.max(...v)],[0,0,1,1]);assert.ok(!a.uv||JSON.stringify(a.uv)==='[0,0,1,1]');assert.notEqual(b.p[0],8);}
 assert.equal(count,id===41?9:18);}
});
test('other explicit renderer IDs remain full-stream delegates',()=>{for(const id of[40,285])assert.deepEqual(capture(false,id).out,capture(true,id).out);});
