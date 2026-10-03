/* Private 321 candidate. Original scan topology, dimensions fitted to local ground ~25.5m.
 * Keep original 135 aperture/visible-flight streams and 63/133 entrances. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
const fit={u:[-13.2,6.5],canopyV:[-3.4,.25],canopyY:[14.55,15.0],lowTerraceV:[-7.2,-3.4],lowY:12.0,upperTerraceV:[-15,-7.2],upperY:15.1,dimensionsMeasured:false,sourceGroundDatum:25.5};
const cuts=[{min:[-13.2,14.45,-3.4],max:[6.5,30,.35]},{min:[-13.2,12,-7.2],max:[6.5,30,-3.4]},{min:[-13.2,15.1,-15],max:[6.5,30,-7.2]}];
function split(poly,axis,value,sign){const inside=[],outside=[],d=v=>sign*(v.q[axis]-value);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);(da>=0?inside:outside).push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db),mix=k=>a[k].map((v,j)=>v+(b[k][j]-v)*t),v={q:mix('q'),p:mix('p'),n:mix('n'),uv:mix('uv')};inside.push(v);outside.push(v);}}return{inside,outside};}
function difference(poly,box){if([0,1,2].some(i=>Math.max(...poly.map(v=>v.q[i]))<=box.min[i]||Math.min(...poly.map(v=>v.q[i]))>=box.max[i]))return{parts:[poly],changed:false};let rest=poly,parts=[];for(let i=0;i<3;i++)for(const[v,sign]of[[box.min[i],1],[box.max[i],-1]]){const q=split(rest,i,v,sign);if(q.outside.length>=3)parts.push(q.outside);rest=q.inside;if(rest.length<3)return{parts:[poly],changed:false};}return{parts,changed:true};}
function cutRecord(r,fr,cuts){const v=r.g.v,inv=M.inverse(r.m),triangles=[],g=new G.Geometry();let changed=false;
 for(let i=0;i<v.length;i+=24){let polys=[[]];for(let j=0;j<3;j++){const k=i+j*8,p=M.apply(r.m,[v[k],v[k+1],v[k+2],1]).slice(0,3),n=M.norm([inv[0]*v[k+3]+inv[1]*v[k+4]+inv[2]*v[k+5],inv[4]*v[k+3]+inv[5]*v[k+4]+inv[6]*v[k+5],inv[8]*v[k+3]+inv[9]*v[k+4]+inv[10]*v[k+5]]);polys[0].push({p,n,q:fr.local(p),uv:[v[k+6],v[k+7]]});}
  for(const box of cuts){const next=[];for(const p of polys){const q=difference(p,box);changed ||= q.changed;next.push(...q.parts);}polys=next;}
  triangles.push(...polys);
 }
 if(!changed)return null;
 for(const p of triangles)for(let j=1;j+1<p.length;j++){const t=[p[0],p[j],p[j+1]],a=M.sub(t[1].p,t[0].p),b=M.sub(t[2].p,t[0].p);if(Math.hypot(...M.cross(a,b))<1e-9)continue;for(const v of t)g.vertex(v.p,M.norm(v.n),v.uv);}
 if(r.g.detailWidth)g.detailWidth=r.g.detailWidth;return g;
}


function details(b,fr){const old=b.id;b.id=389;const box=(key,x,y,z,w,h,d,c='#9fa39d',mat=24)=>b.mesh('f389-r321-'+key,b.geo('f389-r321-box',G.box),x,y,z,w,h,d,c,mat);
try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
 const [left,right]=fit.u,mid=(left+right)/2,width=right-left,metal='#aebbb8';
 box('low-terrace',mid,11.88,-5.3,width,.24,3.8,'#626157',20);
 box('upper-terrace',mid,14.98,-11.1,width,.24,7.8,'#626157',20);
 // The inherited building south of this narrow scope stays at its original fitted height.
 box('south-technical-riser',mid,15.55,-15.04,width,.9,.08);
 box('terrace-riser',mid,13.55,-7.25,width,3.1,.1);
 // North screen cap and a single transparent pitched sheet, never stacked glass boxes.
 box('screen-cap',mid,14.39,.025,width,.12,.35);
 const glass=new G.Geometry();glass.quad([left,14.55,-3.4],[left,15,.25],[right,15,.25],[right,14.55,-3.4]);
 b.mesh('f389-r321-canopy-glass',glass,0,0,0,1,1,1,'#688c90',5);
 const roofY=v=>14.55+(v+3.4)*.45/3.65;
 for(let i=0;i<=12;i++){const u=left+width*i/12;b.beam([u,14.55,-3.4],[u,15,.25],.055,metal,29);}
 for(const v of[-3.4,-2.18,-.97,.25])b.beam([left,roofY(v),v],[right,roofY(v),v],.055,metal,29);
 // Visible upper connection: fitted east flight links 12m terrace to 15.1m terrace.
 // Source supports the diagonal topology; tread count and rail profiles remain fits.
 const x0=-7.0,x1=-1.8,z=-5.7,w=1.35,n=15,lo=12,hi=15.1;
 const slab=new G.Geometry();slab.quad([x0,lo-.18,z-w/2],[x0,lo-.18,z+w/2],[x1,hi-.18,z+w/2],[x1,hi-.18,z-w/2]);
 for(const side of[-1,1]){const q=z+side*w/2;slab.quad([x0,lo-.18,q],[x1,hi-.18,q],[x1,hi,q],[x0,lo,q]);}
 b.mesh('f389-r321-upper-run-soffit',slab,0,0,0,1,1,1,'#929990',24);
 const stairs=new G.Geometry();for(let i=0;i<n;i++){const a=x0+(x1-x0)*i/n,c=x0+(x1-x0)*(i+1)/n,y=lo+(hi-lo)*i/n,h=lo+(hi-lo)*(i+1)/n;const p=[a,y,z-w/2],q=[c,h,z-w/2],r=[a,h,z-w/2],P=[a,y,z+w/2],Q=[c,h,z+w/2],R=[a,h,z+w/2];stairs.tri(p,q,r);stairs.tri(P,R,Q);stairs.quad(r,q,Q,R);stairs.quad(p,r,R,P);stairs.quad(p,P,Q,q);}
 b.mesh('f389-r321-upper-run-treads',stairs,0,0,0,1,1,1,'#a5aaa2',24);
 box('upper-run-landing',-1.35,14.98,-6.0,.9,.24,2.4);
 for(const side of[-1,1]){const zz=z+side*w/2;for(const offset of[.5,1.0])b.beam([x0,lo+offset,zz],[x1,hi+offset,zz],.045,metal,29);for(let j=0;j<=5;j++){const t=j/5,xx=x0+(x1-x0)*t,yy=lo+(hi-lo)*t;box('upper-run-post-'+side+'-'+j,xx,yy+.5,zz,.045,1,.045,metal,29);}}
 for(const [a,c]of[[left,-1.8],[-.9,right]])box('upper-terrace-front-'+a,(a+c)/2,15.5,-7.25,c-a,.8,.14);

 // Roof-side edge closures are limited to the newly cut solid surface ends.
 for(const u of[left,right]){box('terrace-edge-'+u,u,12.4,-5.3,.12,.8,3.8);}
 });}finally{b.id=old;}}
function replaceMethod(o,k,v){const d=Object.getOwnPropertyDescriptor(o,k);Object.defineProperty(o,k,d&&'value'in d?{...d,value:v}:{value:v,writable:true,configurable:true,enumerable:d?d.enumerable:true});return()=>{if(d)Object.defineProperty(o,k,d);else delete o[k];};}
function signature(r){return JSON.stringify([r.k,Array.from(r.m),r.c,Array.from(r.p),r.uv?Array.from(r.uv):null,Array.from(r.g.v)]);}
A.render=function(b,f,add){if(f.properties.pickId!==389)return previous.call(this,b,f,add);if(!Y.Foreign389Upper135)throw Error('321 requires preserved 135 private candidate');const fr=Y.Foreign389North133.frame(),old=b.e.add,oldWindow=b.window,rows=[],excluded=new Set();let result,removedWindowGroups=0;
 const restoreWindow=replaceMethod(b,'window',function(...args){const emit=this.e.add,group=[],restoreEmit=replaceMethod(this.e,'add',function(k,g,m,c,p,uv){group.push({k,g,m:new Float32Array(m),c,p:[...p],uv});});try{oldWindow.apply(this,args);}finally{restoreEmit();}const bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(const r of group)for(let i=0;i<r.g.v.length;i+=8){const q=fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1]));for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j]);}}if(cuts.some(c=>[0,1,2].every(j=>bb[j]<c.max[j]&&bb[j+3]>c.min[j]))){removedWindowGroups++;for(const r of group)excluded.add(signature(r));}for(const r of group)emit.call(this.e,r.k,r.g,r.m,r.c,r.p,r.uv);});
 const restoreAdd=replaceMethod(b.e,'add',function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p:[...p],uv});});try{result=previous.call(this,b,f,add);}finally{restoreAdd();restoreWindow();}
let changed=0;for(let i=0;i<rows.length;i++){const r=rows[i];if(excluded.has(signature(r)))continue;const protectedStream=(r.k.startsWith('f389-u135-')&&!r.k.includes('retained'))||(r.k.startsWith('f389-n133-')&&!r.k.includes('retained'))||(r.k.startsWith('f389-')&&!r.k.startsWith('f389-u135-')&&!r.k.startsWith('f389-n133-')&&!r.k.startsWith('f389-cut-'));const g=protectedStream?null:cutRecord(r,fr,cuts);if(g){changed++;if(g.v.length)old.call(b.e,'f389-r321-retained-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}details(b,fr);return{...result,roof321:{fit,cutRecords:changed,removedWindowGroups,wholeBuildingAccepted:false,completeCirculationVerified:false}};};Y.Foreign389Roof321={fit,cuts};})(YY);
