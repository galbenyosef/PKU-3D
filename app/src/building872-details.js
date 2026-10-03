/* 60 / 60A: sixth-floor terraces and separate roof strips, registered to the
 * University's own sixth-floor plans and the subject's native orthophoto.
 * Pitch/elevation remain display fits within the former 15.825 m envelope. */
(function(Y){'use strict';const previous=Y.Architecture30.render,G=Y.Geo,M=Y.M,F=Y.Footprints;
const FLOOR=.55+5*(15-.55)/6,EAVE=14.68,RIDGE=15.825;
function lerp(a,b,t){return a.map((v,i)=>v+(b[i]-v)*t)}
function clip(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=fn(a),db=fn(b);if(da>=-1e-9)out.push(a);if((da>=0)!==(db>=0))out.push(lerp(a,b,da/(da-db)));}return out;}
function parts(f){const[A,B,C,D,E,H]=f.geometry.coordinates[0],dx=H[0]-A[0],dz=H[1]-A[1],vx=D[0]-C[0],vz=D[1]-C[1],t=((C[0]-A[0])*vz-(C[1]-A[1])*vx)/(dx*vz-dz*vx),N=lerp(A,H,t);return[{q:[A,N,C,B],north:131/589,rooms:258/589,ridge:.69,caps:[[624/1378,751/1378]]},{q:[N,H,E,D],north:120/718,rooms:342/718,ridge:.71,caps:[[389/1300,519/1300],[1164/1300,1]]}];}
function point(part,s,t,y){const[a,b,c,d]=part.q,n=lerp(a,b,s),south=lerp(d,c,s),p=lerp(n,south,t);return[p[0],y,p[1]];}
function local(part,p){const[a,b,,d]=part.q,ux=b[0]-a[0],uz=b[1]-a[1],vx=d[0]-a[0],vz=d[1]-a[1],dx=p[0]-a[0],dz=p[1]-a[1],det=ux*vz-uz*vx;return[(dx*vz-dz*vx)/det,(ux*dz-uz*dx)/det];}
function roofs(part){const n=part.north,r=part.rooms,c=part.ridge,out=[{box:[0,0,1,n],h:p=>13.18+.42*p[1]/n},{box:[0,r,1,c],h:p=>EAVE+(RIDGE-EAVE)*(p[1]-r)/(c-r)},{box:[0,c,1,1],h:p=>EAVE+(RIDGE-EAVE)*(1-p[1])/(1-c)}];for(const[a,b]of part.caps){const mid=(a+b)/2;out.push({box:[a,0,mid,c],h:p=>EAVE+(RIDGE-EAVE)*(p[0]-a)/(mid-a)},{box:[mid,0,b,c],h:p=>EAVE+(RIDGE-EAVE)*(b-p[0])/(b-mid)});}return out;}
Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==872||f.properties.id!=='way/849765894')return previous.call(this,b,f,add);
 const ps=parts(f),original=b.e.add,emit=original.bind(b.e),cutKeys=new Map();
 b.e.add=function(k,g,m,c,p,uv){if(p[1]!==872)return emit(k,g,m,c,p,uv);const ys=[];for(let i=0;i<g.v.length;i+=8)ys.push(M.apply(m,[...g.v.slice(i,i+3),1])[1]);if(Math.max(...ys)<=FLOOR+1e-5)return emit(k,g,m,c,p,uv);
 // Retain the full original sixth-floor window meshes on the occupied south
 // strip/end returns. North-facing sixth-floor windows belonged to false infill.
 if((p[0]===5||p[0]===9)&&Math.min(...ys)>FLOOR){const q=ps.map(p=>({p,st:local(p,[m[12],m[14]])})).find(({st})=>st[0]>=-.015&&st[0]<=1.015&&st[1]>=-.02&&st[1]<=1.025);if(q&&q.st[1]>=q.p.rooms+.03)return emit(k,g,m,c,p,uv);return;}
 if(Math.min(...ys)>=FLOOR-1e-6)return;const cut=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const poly=clip([0,8,16].map(j=>Array.from(g.v.slice(i+j,i+j+8))),v=>FLOOR-M.apply(m,[...v.slice(0,3),1])[1]);for(let j=1;j<poly.length-1;j++)for(const v of[poly[0],poly[j],poly[j+1]])cut.v.push(...v);}if(cut.v.length){
 // Close the top of each original projecting box at the terrace cut. The
 // footprint slab closes the main wall ring, not these projecting pilasters.
 if(k==='box'){const hits=[];for(let j=0;j<cut.v.length;j+=8){const v=cut.v.slice(j,j+3);if(Math.abs(M.apply(m,[...v,1])[1]-FLOOR)<1e-6&&!hits.some(p=>Math.hypot(...p.map((x,i)=>x-v[i]))<1e-7))hits.push(v);}if(hits.length>2){const center=hits.reduce((p,q)=>p.map((v,i)=>v+q[i]/hits.length),[0,0,0]);hits.sort((a,b)=>Math.atan2(a[2]-center[2],a[0]-center[0])-Math.atan2(b[2]-center[2],b[0]-center[0]));for(let j=0;j<hits.length;j++){const a=hits[j],c=hits[(j+1)%hits.length];if(Math.hypot(...M.cross(M.sub(c,center),M.sub(a,center)))>1e-9)cut.tri(center,c,a,[center,c,a].map(p=>[p[0],p[2]]),[[0,1,0],[0,1,0],[0,1,0]]);}}}
 const signature=JSON.stringify(Array.from(new Float32Array(cut.v)));if(!cutKeys.has(signature))cutKeys.set(signature,'roof872-preserved-cut-'+cutKeys.size);emit(cutKeys.get(signature),cut,m,c,p,uv);}
 };
 let result;try{result=previous.call(this,b,{...f,properties:{...f.properties,floors:6}},add);}finally{b.e.add=original;}
 const roof=new G.Geometry(),walls=new G.Geometry();
 // Exposed terrace end parapets are present in both sixth-floor outlines.
 const guards=new G.Geometry();
 for(const part of ps){const rs=roofs(part),xs=new Set([0,1]),ts=new Set([0,1]);for(const r of rs){xs.add(r.box[0]);xs.add(r.box[2]);ts.add(r.box[1]);ts.add(r.box[3]);}
 // Meter-scale tessellation retains lighting detail; boundaries and every ridge
 // are explicit subdivisions, with intersections clipped analytically.
 const width=Math.hypot(...part.q[1].map((v,i)=>v-part.q[0][i])),depth=Math.hypot(...part.q[3].map((v,i)=>v-part.q[0][i]));for(let s=1;s<Math.ceil(width/.65);s++)xs.add(s/Math.ceil(width/.65));for(let t=1;t<Math.ceil(depth/.5);t++)ts.add(t/Math.ceil(depth/.5));const X=[...xs].sort((a,b)=>a-b),T=[...ts].sort((a,b)=>a-b);
 const contains=(r,p)=>p[0]>r.box[0]-1e-10&&p[0]<r.box[2]+1e-10&&p[1]>r.box[1]-1e-10&&p[1]<r.box[3]+1e-10;
 for(const side of[0,1]){if(part.caps.some(([a,b])=>side>=a-1e-8&&side<=b+1e-8))continue;const w=.16/width,s0=side?1-w:0,s1=side?1:w,t0=part.north,t1=part.rooms,quad=(a,b,c,d)=>guards.quad(point(part,...a),point(part,...b),point(part,...c),point(part,...d));quad([s0,t0,FLOOR],[s0,t1,FLOOR],[s0,t1,FLOOR+.95],[s0,t0,FLOOR+.95]);quad([s1,t1,FLOOR],[s1,t0,FLOOR],[s1,t0,FLOOR+.95],[s1,t1,FLOOR+.95]);quad([s0,t1,FLOOR+.95],[s1,t1,FLOOR+.95],[s1,t0,FLOOR+.95],[s0,t0,FLOOR+.95]);quad([s0,t0,FLOOR],[s1,t0,FLOOR],[s1,t1,FLOOR],[s0,t1,FLOOR]);quad([s1,t0,FLOOR],[s0,t0,FLOOR],[s0,t0,FLOOR+.95],[s1,t0,FLOOR+.95]);quad([s0,t1,FLOOR],[s1,t1,FLOOR],[s1,t1,FLOOR+.95],[s0,t1,FLOOR+.95]);}
 function top(p){const a=rs.filter(r=>contains(r,p));return a.length?Math.max(...a.map(r=>r.h(p))):null;}
 function tri(mesh,a,b,c){const pp=[a,b,c].map(v=>point(part,...v)),uv=[a,b,c].map(v=>[v[0]*width/.42,v[1]*depth/.42]);const fp=pp.map(p=>Array.from(new Float32Array(p)));if(Math.hypot(...M.cross(M.sub(fp[2],fp[0]),M.sub(fp[1],fp[0])))>1e-10)mesh.tri(pp[0],pp[2],pp[1],[uv[0],uv[2],uv[1]]);}
 for(let ix=1;ix<X.length;ix++)for(let iz=1;iz<T.length;iz++){const a=X[ix-1],c=X[ix],d=T[iz-1],e=T[iz],mid=[(a+c)/2,(d+e)/2],active=rs.filter(r=>contains(r,mid));for(const r of active){let poly=[[a,d],[c,d],[c,e],[a,e]];for(const other of active){if(other===r)continue;poly=clip(poly,p=>r.h(p)-other.h(p));}if(poly.length<3||Math.abs(poly.reduce((v,p,i)=>{const q=poly[(i+1)%poly.length];return v+p[0]*q[1]-p[1]*q[0]},0))<1e-12)continue;for(let j=1;j<poly.length-1;j++)tri(roof,[...poly[0],r.h(poly[0])],[...poly[j],r.h(poly[j])],[...poly[j+1],r.h(poly[j+1])]);}
 // A vertical exterior exists only where the neighboring cell has no roof.
 if(!active.length)continue;for(const [p,q,o]of[[[a,d],[c,d],[mid[0],d-1e-6]],[[c,d],[c,e],[c+1e-6,mid[1]]],[[c,e],[a,e],[mid[0],e+1e-6]],[[a,e],[a,d],[a-1e-6,mid[1]]]]){const outside=rs.filter(r=>contains(r,o)),at=(arr,p)=>arr.length?Math.max(...arr.map(r=>r.h(p))):FLOOR,hp=at(active,p),hq=at(active,q),lp=at(outside,p),lq=at(outside,q);if(Math.max(hp-lp,hq-lq)<1e-4)continue;walls.quad(point(part,...q,Math.min(hq,lq)),point(part,...p,Math.min(hp,lp)),point(part,...p,hp),point(part,...q,hq));}}
 }
 add('roof872-terrace-floor',F.surface(f.geometry,FLOOR),'#969a8d',22,872);
 add('roof872-terrace-end-parapets',guards,'#dddcd1',18,872);
 add('roof872-occupied-shell',walls,'#dddcd1',18,872);
 add('roof872-segmented-red-roofs',roof,'#aa6255',19,872);
 return{...result,roof:'registered-sixth-floor-terraces',roofRise:RIDGE-EAVE,terraceHeight:FLOOR,roofMaximum:RIDGE,roofHeightSource:'display-fit-within-existing-envelope',roofSections:2};
};
})(YY);
