/* East gate: clip the terminal footway717 against the real road304/38 junction.
 * The two road widths differ. Only their actual final/initial quads own paving;
 * source centre lines, navigation and every other footway segment stay intact. */
(function(Y){'use strict';const G=Y.Geo;
function clip(f,g){
 if(f.properties.pickId!==717||f.properties.id!=='way/1175104559')return g;
 const find=(pick,id)=>Y.CAMPUS.features.find(q=>q.properties.pickId===pick&&q.properties.id===id),east=find(304,'way/970687433'),west=find(38,'way/33457409'),node=[453.289,133.297],same=p=>p&&p[0]===node[0]&&p[1]===node[1];
 if(!east||!west||east.properties.width!==4||west.properties.width!==5.5||f.properties.width!==2||f.geometry.coordinates.length!==13||!same(f.geometry.coordinates.at(-1))||!same(east.geometry.coordinates[0])||!same(west.geometry.coordinates.at(-1)))throw Error('Road717 junction source changed; recheck boundary');
 const ring=(road,last)=>{const v=new Float32Array(Y.Landscape42.warp(G.ribbon(road.geometry.coordinates,road.properties.width,.12,false)).v),start=last?v.length-48:0;return[0,8,16,40].map(k=>[v[start+k],v[start+k+2]]);},rings=[ring(east,false),ring(west,true)],out=new G.Geometry(),raw=new Float32Array(g.v),start=raw.length-48;
 // This endpoint is outside all terrain-warp and ground-cut regions.
 const unwarped=G.ribbon(f.geometry.coordinates,2,.12,false).v.slice(-48),flat=new G.Geometry();for(let i=0;i<48;i+=24)flat.tri(...[0,8,16].map(k=>unwarped.slice(i+k,i+k+3)));const expected=new Float32Array(flat.v);if(raw.length!==12*48||expected.length!==48||expected.some((v,i)=>v!==raw[start+i]))throw Error('Road717 terminal topology or ground transform changed');
 const cross=(a,b,p)=>(b[0]-a[0])*(p[2]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
 function half(poly,dist,inside){const result=[],s=inside?1:-1;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=dist(a)*s,db=dist(b)*s;if(da>=0)result.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);result.push(a.map((v,k)=>v+(b[k]-v)*t));}}return result;}
 const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[2]-a[2]*b[0];},0))/2;
 function subtract(poly,r){let remaining=poly,result=[];const signed=r.reduce((s,a,i)=>{const b=r[(i+1)%r.length];return s+a[0]*b[1]-a[1]*b[0];},0),sign=Math.sign(signed);for(let i=0;i<r.length&&remaining.length>=3;i++){const a=r[i],b=r[(i+1)%r.length],dist=p=>cross(a,b,p)*sign;const outside=half(remaining,dist,false);if(outside.length>=3&&area(outside)>1e-10)result.push(outside);remaining=half(remaining,dist,true);}return result;}
 out.v.push(...raw.slice(0,start));for(let i=start;i<raw.length;i+=24){let polygons=[[0,8,16].map(k=>Array.from(raw.slice(i+k,i+k+8)))];for(const r of rings)polygons=polygons.flatMap(p=>subtract(p,r));for(const p of polygons)for(let k=1;k+1<p.length;k++)for(const v of[p[0],p[k],p[k+1]])out.vertex(v.slice(0,3),v.slice(3,6),v.slice(6,8));}
 // Float32 conversion must not move an intersection back into either road.
 const next=(x,dir)=>{const a=new Float32Array([x]),u=new Uint32Array(a.buffer);if(x===0)return dir>0?1.401298464324817e-45:-1.401298464324817e-45;u[0]+=(x>0)===(dir>0)?1:-1;return a[0];};
 for(let i=start;i<out.v.length;i+=8){let p=out.v.slice(i,i+8);p[0]=Math.fround(p[0]);p[2]=Math.fround(p[2]);for(let repeat=0;repeat<4;repeat++)for(const r of rings){const sign=Math.sign(r.reduce((s,a,j)=>{const b=r[(j+1)%r.length];return s+a[0]*b[1]-a[1]*b[0];},0)),edges=r.map((a,j)=>{const b=r[(j+1)%r.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]);return{d:cross(a,b,p)*sign/len,dx:(b[1]-a[1])*sign,dz:-(b[0]-a[0])*sign};});if(edges.every(e=>e.d>0)){const e=edges.sort((a,b)=>a.d-b.d)[0];if(Math.abs(e.dx)>=Math.abs(e.dz))p[0]=next(p[0],e.dx);else p[2]=next(p[2],e.dz);}}out.v[i]=p[0];out.v[i+2]=p[2];}
 if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;
}Y.Road717Join={clip};})(YY);
