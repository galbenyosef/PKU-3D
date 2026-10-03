const test=require('node:test'),assert=require('node:assert/strict');
const {load}=require('./campus338-model-helper.cjs');
const target='src/building070-v46.js';
const candidate=process.env.CAMPUS338_RESEARCH2_CANDIDATE;
const readSource=(file,code)=>file===target&&candidate?require('node:fs').readFileSync(candidate,'utf8'):code;
const state=load({transform:readSource});
function records(state){const Y=state.Y,f=Y.CAMPUS.features.find(f=>f.properties.pickId===253),out=[];
 const b=new Y.Builder({add(k,g,m,c,p,uv){out.push({k,v:Array.from(g.v),m:Array.from(m),c,p:Array.from(p),detailWidth:g.detailWidth,uv:uv&&Array.from(uv)});}});
 Y.Architecture30.render(b,f,(k,g,c,mat,id)=>b.e.add(k,g,Y.M.identity(),c,[mat,id,0,0]));return out;
}
const out=records(state),grid=out.find(x=>x.k.includes('atrium-grid')),glass=out.find(x=>x.k==='070-atrium-glass');
function bucket(row){const data=new Float32Array(28);data.set(row.m);data.set([1,1,1,1],16);data.set(row.p,20);const b={data,detailWidth:row.detailWidth};b.spatial=state.Y.Visibility.prepare(data,{v:row.v});state.Y.Visibility.compile(b);return b;}
test('structural glazing grid survives the actual aerial visibility selector',()=>{
 assert.ok(grid&&glass);const b=bucket(grid),old=bucket({...grid,detailWidth:.12}),s=b.spatial;
 const eye=[s[0],s[1]+180,s[2]],options={selected:253,vegetation:true,detail:true};
 assert.equal(state.Y.Visibility.select(old,[],eye,700,options).count,0,'counterfactual reproduces whole-grid disappearance');
 assert.equal(state.Y.Visibility.select(b,[],eye,700,options).count,1,'structural grid stays visible with unchanged global policy');
});
test('glazing and every grid triangle face upward, with finite unit normals',()=>{
 for(const r of [glass,grid])for(let i=0;i<r.v.length;i+=8){assert.ok(r.v.slice(i,i+8).every(Number.isFinite));assert.ok(r.v[i+4]>.99);assert.ok(Math.abs(Math.hypot(...r.v.slice(i+3,i+6))-1)<2e-5);}
 assert.equal(glass.p[0],44);assert.equal(grid.p[0],9);
});
test('only visibility metadata changes: all geometry transforms and materials are retained',()=>{
 const before=load({transform(file,code){code=readSource(file,code);if(file===target){assert.ok(code.includes("mesh('atrium-grid',grid,C.frame,9);"));code=code.replace("mesh('atrium-grid',grid,C.frame,9);","grid.detailWidth=.12;mesh('atrium-grid',grid,C.frame,9);");}return code;}});
 const withoutWidth=rows=>rows.map(({detailWidth,...r})=>r);
 assert.deepEqual(withoutWidth(out),withoutWidth(records(before)));
});
