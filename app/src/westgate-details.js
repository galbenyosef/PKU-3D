/* West Gate details, proportionally reconstructed from PKU's public photographs.
 * Sources and limits: docs/development/westgate-details.md. Not a measured scan.
 * Kept separate from generic lions and the administrative building's qilin. */
(function(Y){'use strict';
const G=Y.Geo,M=Y.M,P=Y.Builder.prototype;
// A blended upper face removes intersecting primitive seams while retaining a
// real recessed mouth and eye sockets. It is baked once, never sampled at runtime.
function carvedFace(){
 const g=new G.Geometry(),parts=[[0,2.56,-.015,.53,.31,.29],[0,2.69,.18,.48,.13,.23],[0,2.38,.36,.35,.115,.23],[0,2.445,.53,.145,.078,.08],[0,2.55,.315,.15,.185,.205,.075],[-.15,2.355,.49,.18,.065,.105],[.15,2.355,.49,.18,.065,.105],[-.26,2.59,.265,.205,.092,.085,.065],[.26,2.59,.265,.205,.092,.085,.065]];
 // Extend the nasal root into the forehead and broaden only this union. The
 // official oblique view shows an uninterrupted slope, not a pinched join.
 const ell=(p,o)=>{const x=(p[0]-o[0])/o[3],y=(p[1]-o[1])/o[4],z=(p[2]-o[2])/o[5];return(Math.hypot(x,y,z)-1)*Math.min(o[3],o[4],o[5]);};
 const blend=(a,b,k)=>{const h=Math.max(0,k-Math.abs(a-b))/k;return Math.min(a,b)-h*h*k*.25;};
 // The photographed mouth corners turn back into the cheek, rather than
 // continuing as straight rods across an empty gap. Give the curled lip a
 // continuous cheek bed and blend its curved relief into the same stone field.
 for(const side of[-1,1])parts.push([side*.33,2.39,.235,.16,.145,.17,.055]);
 const cheek=[];
 for(const side of[-1,1])for(let i=0;i<=14;i++){
  const t=i/14,u=1-t;
  cheek.push([side*(u*u*.16+2*u*t*.36+t*t*.43),u*u*2.35+2*u*t*2.28+t*t*2.49,u*u*.475+2*u*t*.34+t*t*.145,.035+.018*Math.sin(t*Math.PI)]);
 }
 const cheekDistance=p=>{let d=Infinity;
  for(let i=0;i<cheek.length-1;i++){if(i===14)continue;const a=cheek[i],b=cheek[i+1],dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy+(p[2]-a[2])*dz)/(dx*dx+dy*dy+dz*dz)));
   d=Math.min(d,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy,p[2]-a[2]-t*dz)-(a[3]+t*(b[3]-a[3])));
  }return d;
 };
 const field=p=>{let d=Infinity;for(const o of parts)d=blend(d,ell(p,o),o[6]||.025);
  if(Math.abs(p[0])>.10&&p[1]<2.56&&p[1]>2.26&&p[2]>.075)d=blend(d,cheekDistance(p),.035);
  for(const side of[-1,1])d=Math.max(d,-ell(p,[side*.25,2.505,.32,.10,.067,.077]));
  return Math.max(d,-ell(p,[0,2.245,.48,.29,.045,.22]));
 };
 const normal=p=>{const e=.0008;return M.norm([0,1,2].map(k=>{const a=p.slice(),b=p.slice();a[k]+=e;b[k]-=e;return field(a)-field(b);}));};
 const lo=[-.58,2.19,-.38],hi=[.58,2.93,.71],n=lo.map((v,i)=>Math.ceil((hi[i]-v)/.022)),step=lo.map((v,i)=>(hi[i]-v)/n[i]);
 const index=(x,y,z)=>(z*(n[1]+1)+y)*(n[0]+1)+x,values=new Float64Array((n[0]+1)*(n[1]+1)*(n[2]+1));
 const point=(x,y,z)=>[lo[0]+x*step[0],lo[1]+y*step[1],lo[2]+z*step[2]];
 for(let z=0;z<=n[2];z++)for(let y=0;y<=n[1];y++)for(let x=0;x<=n[0];x++)values[index(x,y,z)]=field(point(x,y,z));
 const corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tets=[[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6],[0,5,1,6]];
 function emit(a,b,c){let ns=[normal(a),normal(b),normal(c)],cross=M.cross(M.sub(b,a),M.sub(c,a));if(Math.hypot(...cross)<1e-12)return;
  if(cross.reduce((v,q,i)=>v+q*(ns[0][i]+ns[1][i]+ns[2][i]),0)<0){[b,c]=[c,b];[ns[1],ns[2]]=[ns[2],ns[1]];}g.tri(a,b,c,undefined,ns);
 }
 for(let z=0;z<n[2];z++)for(let y=0;y<n[1];y++)for(let x=0;x<n[0];x++){
  const ds=corners.map(c=>values[index(x+c[0],y+c[1],z+c[2])]);if(ds.every(d=>d>=0)||ds.every(d=>d<0))continue;
  const ps=corners.map(c=>point(x+c[0],y+c[1],z+c[2])),edge=(a,b)=>{const t=ds[a]/(ds[a]-ds[b]);return ps[a].map((v,i)=>v+(ps[b][i]-v)*t);};
  for(const tet of tets){const inside=tet.filter(i=>ds[i]<0),out=tet.filter(i=>ds[i]>=0);
   if(inside.length===1||inside.length===3){const a=(inside.length===1?inside:out)[0],others=inside.length===1?out:inside;emit(...others.map(b=>edge(a,b)));}
   else if(inside.length===2){const[a,b]=inside,[c,d]=out,ac=edge(a,c),ad=edge(a,d),bc=edge(b,c),bd=edge(b,d);emit(ac,ad,bc);emit(bc,ad,bd);}
  }
 }
 return g;
}
// A curl is cut into the lock surface, not drawn as a floating wire. Local +Z
// faces outward; each lock is oriented around the skull when it is assembled.
function carvedLock(){
 const g=new G.Geometry(),n=80,m=48;
 const point=(u,v)=>{
  const r=Math.sin(v),phase=Math.atan2(Math.sin(u-3*Math.PI*(1-r/.84)),Math.cos(u-3*Math.PI*(1-r/.84)));
  const taper=Math.min(1,r/.15)*Math.max(0,Math.min(1,(.96-r)/.13));
  const cut=v<Math.PI/2?.04*Math.exp(-Math.pow(phase*Math.max(r,.16)/.13,2))*taper*Math.cos(v):0;
  return[.12*r*Math.cos(u),.145*r*Math.sin(u),.115*Math.cos(v)-cut];
 };
 const normal=(u,v)=>{if(v<1e-6)return[0,0,1];if(v>Math.PI-1e-6)return[0,0,-1];const e=.00001;return M.norm(M.cross(M.sub(point(u,v+e),point(u,v-e)),M.sub(point(u+e,v),point(u-e,v))));};
 for(let i=0;i<n;i++)for(let j=0;j<m;j++){
  const u=i*2*Math.PI/n,w=(i+1)*2*Math.PI/n,v=j*Math.PI/m,t=(j+1)*Math.PI/m;
  const A=point(u,v),B=point(w,v),C=point(w,t),D=point(u,t),na=normal(u,v),nb=normal(w,v),nc=normal(w,t),nd=normal(u,t);
  if(j)g.tri(A,C,B,undefined,[na,nc,nb]);if(j<m-1)g.tri(A,D,C,undefined,[na,nd,nc]);
 }
 return g;
}
// Only the two photographed ear-to-jaw locks taper back into the neck. The
// carved spiral and every sample are retained; the lower root folds inward
// instead of presenting the full round edge of another stacked disc.
function shapedTempleLock(shape,tier){
 const g=new G.Geometry(),h=.145,stretch=tier===2?1.18:1.23,depth=tier===2?1:.80,fold=tier===2?.15:.11;
 for(let i=0;i<shape.v.length;i+=8){
  const q=shape.v,x=q[i],y=q[i+1],z=q[i+2],width=1+.22*y/h,t=(1-y/h)/2;
  // Keep the exposed upper scroll convex. Whole-depth compression and a
  // quadratic bend tilted its visible centre into a plate in side view.
  // A quartic bend leaves that face fuller while retaining the same buried root.
  const bend=tier===2?t*t*t*t:t*t,slope=tier===2?2*fold*t*t*t/h:fold*t/h;
  const nx=q[i+3]/width,nz=q[i+5]/depth,ny=(q[i+4]-(.22/h)*x*nx-slope*nz)/stretch;
  g.vertex([x*width,y*stretch,tier===2?z*depth-fold*bend:z*depth-fold*t*t],M.norm([nx,ny,nz]),q.slice(i+6,i+8));
 }
 return g;
}
// A compact upper ear fold tapers into the temple instead of hanging as an
// oversized oval plate. The concave opening and upper rolled lip stay continuous.
// Local +Z is the visible side; dimensions follow the photographed head profile.
function carvedEar(){
 const g=new G.Geometry(),n=48,m=32;
 const point=(u,v)=>{const r=Math.sin(v),front=v<Math.PI/2;
  return [.10*r*Math.cos(u)*(1+.38*r*Math.sin(u)),.125*r*Math.sin(u),.085*Math.cos(v)+.025*r*r*Math.sin(u)-(front?.067*Math.pow(1-r*r,2):0)];
 };
 const normal=(u,v)=>{if(v<1e-6)return[0,0,1];if(v>Math.PI-1e-6)return[0,0,-1];const e=.00001;return M.norm(M.cross(M.sub(point(u,v+e),point(u,v-e)),M.sub(point(u+e,v),point(u-e,v))));};
 for(let i=0;i<n;i++)for(let j=0;j<m;j++){
  const u=i*2*Math.PI/n,w=(i+1)*2*Math.PI/n,v=j*Math.PI/m,t=(j+1)*Math.PI/m;
  const A=point(u,v),B=point(w,v),C=point(w,t),D=point(u,t),na=normal(u,v),nb=normal(w,v),nc=normal(w,t),nd=normal(u,t);
  if(j)g.tri(A,C,B,undefined,[na,nc,nb]);if(j<m-1)g.tri(A,D,C,undefined,[na,nd,nc]);
 }
 return g;
}
// A periodic ellipse sweep uses one continuous outward frame, with no reference
// axis switch. The centreline and thickness retain the fitted collar placement.
function carvedCollar(){
 const g=new G.Geometry(),n=96,m=16,r=.038;
 const rings=Array.from({length:n},(_,i)=>{
  const a=i*2*Math.PI/n,c=Math.cos(a),s=Math.sin(a),out=M.norm([c/.51,0,s/.45]);
  return Array.from({length:m},(_,j)=>{const t=j*2*Math.PI/m,ct=Math.cos(t),st=Math.sin(t),normal=[out[0]*ct,st,out[2]*ct];
   return{p:[.51*c+r*normal[0],2.065+r*normal[1],.065+.45*s+r*normal[2]],normal};
  });
 });
 for(let i=0;i<n;i++)for(let j=0;j<m;j++){
  const A=rings[i][j],B=rings[(i+1)%n][j],C=rings[(i+1)%n][(j+1)%m],D=rings[i][(j+1)%m];
  g.tri(A.p,C.p,B.p,undefined,[A.normal,C.normal,B.normal]);
  g.tri(A.p,D.p,C.p,undefined,[A.normal,D.normal,C.normal]);
 }
 return g;
}
// One reusable carved mesh, rather than hundreds of independently drawn beads.
function sculpture(limb=0,lift=0){
 const g=new G.Geometry();
 function ell(x,y,z,a,b,c,n=24,m=16){
  const p=(u,v)=>[x+a*Math.sin(v)*Math.cos(u),y+b*Math.cos(v),z+c*Math.sin(v)*Math.sin(u)];
  const normal=q=>M.norm([(q[0]-x)/(a*a),(q[1]-y)/(b*b),(q[2]-z)/(c*c)]);
  for(let i=0;i<n;i++)for(let j=0;j<m;j++){
   const A=p(i*2*Math.PI/n,j*Math.PI/m),B=p((i+1)*2*Math.PI/n,j*Math.PI/m),C=p((i+1)*2*Math.PI/n,(j+1)*Math.PI/m),D=p(i*2*Math.PI/n,(j+1)*Math.PI/m);
   if(j)g.tri(A,B,C,undefined,[normal(A),normal(B),normal(C)]);
   if(j<m-1)g.tri(A,C,D,undefined,[normal(A),normal(C),normal(D)]);
  }
 }
 function tube(points,r,sides=8){
  const rings=points.map((p,i)=>{const d=M.norm(M.sub(points[Math.min(i+1,points.length-1)],points[Math.max(i-1,0)])),a=M.norm(M.cross(d,Math.abs(d[2])>.9?[0,1,0]:[0,0,1])),b=M.cross(d,a);return Array.from({length:sides},(_,k)=>{const t=k*2*Math.PI/sides;return p.map((v,j)=>v+r*(a[j]*Math.cos(t)+b[j]*Math.sin(t)));});});
  for(let i=1;i<rings.length;i++)for(let k=0;k<sides;k++){const q=(k+1)%sides;g.quad(rings[i-1][k],rings[i-1][q],rings[i][q],rings[i][k]);}
 }
 // Smooth section lofts join chest/neck and taper the legs without bead-like joints.
 function loft(x,z,rings,n=40){
  const point=(j,a)=>{const [y,rx,rz,oz=0]=rings[j];return[x+rx*Math.cos(a),y,z+oz+rz*Math.sin(a)];};
  const normal=(j,a)=>{const lo=point(Math.max(0,j-1),a),hi=point(Math.min(rings.length-1,j+1),a),t=[-rings[j][1]*Math.sin(a),0,rings[j][2]*Math.cos(a)];return M.norm(M.cross(M.sub(hi,lo),t));};
  for(let j=0;j<rings.length-1;j++)for(let k=0;k<n;k++){const a=k*2*Math.PI/n,c=(k+1)*2*Math.PI/n,A=point(j,a),B=point(j+1,a),C=point(j+1,c),D=point(j,c);g.tri(A,B,C,undefined,[normal(j,a),normal(j+1,a),normal(j+1,c)]);g.tri(A,C,D,undefined,[normal(j,a),normal(j+1,c),normal(j,c)]);}
 }
 // Independent forelegs keep the head/body mesh shared across the pair.
 // Shoulder profiles join the chest while the independently raised paw stays on its ball.
 if(limb){
  const s=limb;
  loft(s*.39,.34,[[1.08+lift,.14,.16],[1.22+lift*.7,.155,.18],[1.43+lift*.3,.16,.19,-.015],[1.60,.18,.215,-.035],[1.76,.215,.245,-.075],[1.89,.235,.26,-.15],[2.015,.20,.225,-.22]]);
  ell(s*.37,1.12+lift,.48,.23,.13,.26);
  for(let k=0;k<4;k++)ell(s*.37+(k-1.5)*.10,1.075+lift,.65,.053,.085,.10,16,10);
  return g;
 }
 // A forward throat shoulder supports the jaw and meets the inner collar.
 // The former abrupt retreat exposed a background slit below the lower jaw.
 loft(0,-.10,[[1.01,.24,.28],[1.18,.35,.37],[1.38,.425,.42],[1.57,.50,.47,.035],[1.76,.565,.51,.075],[1.91,.57,.515,.09],[2.04,.52,.44,.12],[2.065,.50,.45,.135],[2.095,.46,.40,.155],[2.13,.425,.355,.175],[2.16,.40,.34,.17],[2.22,.37,.29,.11],[2.28,.34,.27,.07],[2.4,.22,.20]]);
 for(const s of[-1,1])ell(s*.35,1.32,-.26,.30,.34,.39);
 // Neck and broad brow; the mouth remains an actual gap between upper/lower jaws.
 ell(0,2.33,-.11,.43,.32,.24);
 const face=carvedFace();for(let i=0;i<face.v.length;i++)g.v.push(face.v[i]);
 ell(0,2.16,.33,.32,.065,.24);
 for(const s of[-1,1]){
  ell(s*.25,2.50,.285,.055,.035,.028);
  ell(s*.23,2.255,.46,.033,.059,.033,16,10);
 }
 const lock=carvedLock();
 function placeLock(x,y,z,a,sx=1,sy=1,sz=1,shape=lock){
  const sn=Math.sin(a),cs=Math.cos(a);
  for(let i=0;i<shape.v.length;i+=8){const q=shape.v,px=q[i]*sx,py=q[i+1]*sy,pz=q[i+2]*sz,nx=q[i+3]/sx,ny=q[i+4]/sy,nz=q[i+5]/sz;
   g.vertex([x+cs*px+sn*pz,y+py,z-sn*px+cs*pz],M.norm([cs*nx+sn*nz,ny,-sn*nx+cs*nz]),q.slice(i+6,i+8));
  }
 }
 const ear=carvedEar();for(const side of[-1,1])placeLock(side*.49,2.69,.035,side*1.10,1,1,1,ear);
 // Temple and rear locks face radially away from the head. Previously every
 // spiral faced forward, disappearing inside the rear locks or floating sideways.
 for(let row=0;row<3;row++)for(let k=0;k<11;k++){
  const a=(k/10*1.72-.86)*Math.PI,r=.44+row*.012;
  const x=Math.sin(a)*r,z=-.07-Math.cos(a)*.30,y=2.69-row*.19;
  placeLock(x,y,z,Math.atan2(Math.sin(a),-Math.cos(a)));
 }
 const templeUpper=shapedTempleLock(lock,2),templeLower=shapedTempleLock(lock,3);
 // Frontal scrolls along the brow and temples, visible above the muzzle.
 for(const side of[-1,1])for(let k=0;k<5;k++){
  const x=side*(.41+.055*Math.sin(k*.8)),y=2.71-k*.14,z=.16-k*.025;
  placeLock(x,y,z,side*.70,.115/.12,.10/.145,1,k===2?templeUpper:k===3?templeLower:lock);
 }
 // Crown scrolls grow from the brow instead of floating in a common front
 // plane. The rising centre follows the visible arched crown; spacing is fitted.
 for(let k=-2;k<=2;k++)placeLock(k*.17,2.855-.015*Math.abs(k)-.015*k*k,.18+.02*Math.abs(k),k*.18,.105/.12,.105/.145,.095/.115);
 // The existing broad brow is now backed into the forehead field. Its
 // smooth convex lip surrounds the recessed eye without a duplicate tube
 // sitting proud of the face like a separate stone bean.
 // Collar, hanging chest ornament and curled tail visible from the side.
 const collar=carvedCollar();for(let i=0;i<collar.v.length;i++)g.v.push(collar.v[i]);
 // The photo shows a framed hanging chest ornament rather than a plain oval bead.
 tube([[0,2.06,.525],[0,2.005,.508],[0,1.97,.510]],.025);
 const pendantStart=g.v.length;
 ell(0,1.865,.601,.112,.145,.037);
 tube([[-.085,1.965,.624],[.085,1.965,.624],[.095,1.76,.624],[-.095,1.76,.624],[-.085,1.965,.624]],.017);
 for(const side of[-1,1])ell(side*.043,1.90,.642,.032,.018,.016,16,10);
 ell(0,1.845,.644,.064,.028,.022,20,12);
 tube([[-.06,1.795,.643],[0,1.78,.652],[.06,1.795,.643]],.015);
 // Keep the photographed framed relief against the rounded chest instead of
 // suspending it on a long forward arm. Bend the existing carved detail as one
 // plate, preserving its front outline and sampling; transform normals with
 // the inverse transpose of z'=z+f(y), not just the vertex positions.
 for(let i=pendantStart;i<g.v.length;i+=8){
  const dy=g.v[i+1]-1.865,slope=-.08*dy/(.145*.145);
  g.v[i+2]-=.075+.04*dy*dy/(.145*.145);
  const n=M.norm([g.v[i+3],g.v[i+4]-slope*g.v[i+5],g.v[i+5]]);
  g.v[i+3]=n[0];g.v[i+4]=n[1];g.v[i+5]=n[2];
 }
 tube(Array.from({length:25},(_,i)=>{const a=i/24*Math.PI*1.6;return[.34*Math.sin(a),1.35+i*.026,-.47-.07*Math.cos(a)];}),.065);
 return g;
}
// Rectangular stone mouldings with continuous sloping shoulders, shared by both bases.
function plinth(){
 const g=new G.Geometry(),rings=[[0,1.69,1.83],[.13,1.69,1.83],[.18,1.60,1.74],[.24,1.60,1.74],[.29,1.44,1.59],[.36,1.44,1.59],[.41,1.30,1.45],[.71,1.30,1.45],[.76,1.49,1.63],[.81,1.49,1.63],[.85,1.67,1.80],[.93,1.67,1.80],[.96,1.63,1.76],[.995,1.63,1.76]];
 const ring=([y,w,d])=>[[-w/2,y,-d/2],[-w/2,y,d/2],[w/2,y,d/2],[w/2,y,-d/2]];
 for(let i=1;i<rings.length;i++){const a=ring(rings[i-1]),b=ring(rings[i]);for(let j=0;j<4;j++){const k=(j+1)%4;g.quad(a[j],a[k],b[k],b[j]);}}
 const a=ring(rings[0]),b=ring(rings.at(-1));g.quad(a[3],a[2],a[1],a[0]);g.quad(b[0],b[1],b[2],b[3]);return g;
}
function plinthCarving(){
 const g=new G.Geometry(),box=G.box();
 function bar(x,y,z,w,h,d){for(let i=0;i<box.v.length;i+=8)g.vertex([x+box.v[i]*w,y+box.v[i+1]*h,z+box.v[i+2]*d],box.v.slice(i+3,i+6),box.v.slice(i+6,i+8));}
 // Shallow key-pattern strip observed on the front; hidden faces remain unclaimed.
 for(let i=-4;i<=4;i++){
  const x=i*.166,pts=[[-.071,-.023],[-.071,.025],[.067,.025],[.067,-.020],[-.019,-.020],[-.019,.004],[.038,.004]];
  for(let j=1;j<pts.length;j++){const a=pts[j-1],b=pts[j];bar(x+(a[0]+b[0])/2,.961+(a[1]+b[1])/2,.886,Math.max(.009,Math.abs(b[0]-a[0])),Math.max(.009,Math.abs(b[1]-a[1])),.012);}
 }
 // Broad petal shoulders taper to a lower point instead of separate spherical beads.
 for(const side of[-1,1])for(let i=-4;i<=4;i++){
  const x=i*.16,front=side*.815,tip=[x,.734,side*.80],ridge=[x,.796,side*.855];
  const outline=[[x-.074,.820,front],[x-.078,.783,front],[x-.043,.750,front],tip,[x+.043,.750,front],[x+.078,.783,front],[x+.074,.820,front]];
  for(let j=1;j<=outline.length;j++){const a=outline[j-1],b=outline[j%outline.length];if(side>0)g.tri(a,b,ridge);else g.tri(b,a,ridge);}
 }
 return g;
}
P.westGateLion=function(x,z,s=1){this.local(x,0,z,0,()=>{
 const stone='#b8b7aa';
 // Moulded plinth / recessed waist / lotus-like shoulder visible in the reference.
 this.mesh('westgate-plinth-profile',this.geo('westgate-plinth-profile',plinth),0,0,0,s,s,s,stone,10,.2);
 this.mesh('westgate-plinth-carving',this.geo('westgate-plinth-carving',plinthCarving),0,0,0,s,s,s,stone,10,.24);
 for(const side of[-1,1]){
  this.box(side*.66*s,.56*s,0,.018*s,.24*s,1.12*s,'#a5a699',10,.22);
  this.box(0,.56*s,side*.735*s,1.06*s,.24*s,.018*s,'#a5a699',10,.22);
 }
 this.mesh('westgate-carved-lion',this.geo('westgate-carved-lion',()=>sculpture()),0,0,0,1.23*s,s,s,stone,10,.6);
 for(const side of[-1,1]){
  const lift=x>0&&side===-1?.23:0,key='westgate-lion-foreleg-'+side+'-'+lift;
  this.mesh(key,this.geo(key,()=>sculpture(side,lift)),0,0,0,1.23*s,s,s,stone,10,.6);
 }
 // The south lion's raised inner paw rests on a carved ball in the official photo.
 // The opposite forepaw accessory is not sufficiently documented here.
 if(x>0){this.sphere(-.47*s,1.17*s,.49*s,.19*s,.19*s,.19*s,stone,10,.6,true);for(let i=0;i<8;i++){let a=i*Math.PI/4;this.sphere((-.47+Math.cos(a)*.15)*s,(1.17+Math.sin(a)*.15)*s,.61*s,.036*s,.036*s,.024*s,stone,10,.62,true);}}
 });};
P.westGateDoor=function(x,y,z,w,h,side,angle){this.local(x,y,z,angle,()=>{
 // side chooses the hinge edge; both leaves open into the passage, not through walls.
 const wood='#81372c',edge='#a4523a';
 this.box(side*w/2,h/2,0,w,h,.15,wood,20,.85);
 for(let i=1;i<6;i++)this.box(side*w*i/6,h/2,.079,.014,h-.12,.012,'#713127',20,.86);
 for(const yy of[.13,h-.14])this.box(side*w/2,yy,0,w-.08,.18,.22,edge,20,.88);
 for(const xx of[side*.09,side*(w-.09)])this.box(xx,h/2,0,.12,h,.21,edge,20,.88);
 for(let row=1;row<=8;row++)for(let col=1;col<=4;col++)this.sphere(side*w*col/5,h*row/9,.105,.043,.043,.037,'#ae9562',9,.9,true);
 const handle=side*w*.78;
 this.cyl(0,-.04,0,.10,h+.22,wood,16,1,20,.87);
 this.box(handle,h*.47,.10,.15,.20,.045,'#9b845b',9,.92);
 this.mesh('westgate-door-ring',this.geo('westgate-door-ring',()=>G.torus(32,10)),handle,h*.44,.15,.10,.12,.12,'#b5a16b',9,.93);
 // Exposed reverse battens are visible on open leaves from within the gate.
 for(const yy of[.52,h*.48,h-.5])this.box(side*w/2,yy,-.115,w-.10,.13,.13,'#7c4430',20,.89);
 });};
})(YY);
