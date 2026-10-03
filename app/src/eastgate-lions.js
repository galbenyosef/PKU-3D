/* East Gate Qingstone lions. Photo-proportioned, not a survey or scan.
 * The 2020 pair differs from the older West Gate pair; see source documentation. */
(function(Y){'use strict';
const G=Y.Geo,M=Y.M;
function carving(part=0,lift=0){
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

 function curl(x,y,z,r,turn=0){
  // Swept parallel ridges describe a lock rather than a cluster of round beads.
  for(let strand=0;strand<3;strand++)tube(Array.from({length:33},(_,i)=>{
   const t=i/32*Math.PI*3.3+turn,rr=r*(1-i/38)+strand*.009;
   return[x+rr*Math.cos(t),y+rr*Math.sin(t),z+.022*Math.sin(i/32*Math.PI)];
  }),.008,6);
 }
 if(part){
  loft(part*.41,.25,[[1.10+lift,.16,.20,.14],[1.28+lift*.8,.18,.20,.08],[1.56+lift*.35,.19,.21],[1.92,.24,.23,-.04],[2.10,.23,.20,-.08]]);
  ell(part*.42,1.13+lift,.48,.25,.15,.27);
  for(let k=0;k<4;k++){
   const x=part*.42+(k-1.5)*.112;
   ell(x,1.13+lift,.67,.069,.11,.13,20,12);
   ell(x,1.08+lift,.765,.035,.057,.045,16,10);
  }
  for(let k=0;k<3;k++)curl(part*(.55+k*.02),1.80-k*.15,.33,.062,part*.7);
  return g;
 }
 loft(0,-.14,[[1.02,.31,.32],[1.22,.48,.45],[1.52,.55,.45],[1.86,.60,.43,.035],[2.12,.56,.38,.065],[2.36,.38,.29,.035],[2.53,.28,.25]]);
 for(const s of[-1,1]){
  ell(s*.48,1.35,-.33,.29,.33,.36);
  for(let k=0;k<4;k++)ell(s*(.44+k*.095),1.10,-.17,.065,.085,.12,16,10);
 }
 // Broad forehead, sloping cheeks, separated lower jaw and open mouth cavity.
 ell(0,2.76,-.09,.54,.39,.35,40,28);
 ell(0,2.95,.08,.46,.19,.29,32,20);
 ell(0,2.58,.36,.35,.12,.23,32,20);
 ell(0,2.30,.35,.34,.09,.24,32,16);
 ell(0,2.65,.52,.17,.105,.10,28,16);
 for(const s of[-1,1]){
  ell(s*.43,2.59,.025,.15,.30,.29,28,20);
  ell(s*.245,2.80,.26,.17,.09,.11,24,16);
  ell(s*.24,2.755,.337,.095,.055,.045,24,16);
  ell(s*.155,2.565,.50,.18,.09,.105,24,16);
  // Flattened ear with raised rim; no dark painted eye or mouth patch.
  ell(s*.43,3.055,.09,.12,.13,.082,24,16);
  tube(Array.from({length:25},(_,i)=>{const t=i/24*Math.PI*2;return[s*.43+.095*Math.cos(t),3.055+.106*Math.sin(t),.153];}),.016);
  ell(s*.22,2.445,.46,.035,.080,.038,20,12);
  tube(Array.from({length:17},(_,i)=>[s*(.105+i*.021),2.83+Math.sin(i/16*Math.PI)*.055,.348-i*.003]),.030);
  for(let line=0;line<3;line++)tube(Array.from({length:17},(_,i)=>{const t=i/16*Math.PI*.8;return[s*(.13+.22*Math.sin(t)),2.59-line*.028-.10*(1-Math.cos(t)),.54-.13*Math.sin(t)];}),.009,6);
 }
 for(let k=-3;k<=3;k++)ell(k*.065,2.385,.47,.025,.030,.033,12,8);
 // Locks follow the head surface: frontal crown, cheeks, and rear mantle.
 for(let row=0;row<4;row++)for(let k=0;k<13;k++){
  const a=(k/12*1.85-.925)*Math.PI,x=Math.sin(a)*(.48+row*.013),z=-.09-Math.cos(a)*.32,y=3.03-row*.17;
  ell(x,y,z,.125,.15,.10,20,12);
  // Align spiral plane with the outward normal around the head.
  const start=g.v.length;curl(0,y,0,.096,k*.63);
  const nx=Math.sin(a),nz=-Math.cos(a);
  for(let j=start;j<g.v.length;j+=8){const u=g.v[j],v=g.v[j+2],nu=g.v[j+3],nv=g.v[j+5];g.v[j]=x+nz*u+nx*(v+.094);g.v[j+2]=z-nx*u+nz*(v+.094);g.v[j+3]=nz*nu+nx*nv;g.v[j+5]=-nx*nu+nz*nv;}
 }
 for(const side of[-1,1])for(let k=0;k<5;k++)curl(side*(.39+.035*Math.sin(k)),2.97-k*.16,.28-k*.012,.073,side*k*.7);
 for(let k=-2;k<=2;k++)curl(k*.155,3.055-Math.abs(k)*.018,.29,.065,k*.8);
 // Two raised edges define the carved collar; pendant hangs on the chest.
 for(const delta of[-.038,.038])tube(Array.from({length:49},(_,i)=>{const a=i/48*Math.PI*2;return[.56*Math.cos(a),2.17-.16*Math.sin(a)+delta,.045+.38*Math.sin(a)];}),.020);
 ell(0,1.88,.46,.12,.16,.065);ell(0,1.80,.49,.095,.085,.060);
 tube(Array.from({length:25},(_,i)=>{const a=i/24*2*Math.PI;return[.093*Math.cos(a),1.82,.49+.06*Math.sin(a)];}),.012);
 for(const side of[-1,1])for(let k=0;k<6;k++)tube([[side*.52,2.04,.17],[side*(.53+k*.008),1.84,.20],[side*(.52+k*.008),1.74,.19]],.008,6);
 tube(Array.from({length:33},(_,i)=>{const a=i/32*Math.PI*1.7;return[.38*Math.sin(a),1.34+i*.025,-.47-.075*Math.cos(a)];}),.068);
 return g;
}
function ball(){
 const g=new G.Geometry(),center=[-.41,1.25,.48],r=.24;
 // One closed ball and its petal lattice are compiled into one shared resource.
 const source=G.sphere(40,28);for(let i=0;i<source.v.length;i+=8)g.vertex(source.v.slice(i,i+3).map((v,k)=>center[k]+v*r),source.v.slice(i+3,i+6),source.v.slice(i+6,i+8));
 for(let row=1;row<8;row++)for(let col=0;col<14;col++){
  const lat=row*Math.PI/8,lon=(col+(row%2)*.5)*Math.PI/7;
  for(let j=0;j<16;j++){
   const point=t=>{const v=lat+.13*Math.sin(t),u=lon+.18*Math.cos(t);return[center[0]+.244*Math.sin(v)*Math.cos(u),center[1]+.244*Math.cos(v),center[2]+.244*Math.sin(v)*Math.sin(u)];};
   const a=point(j*Math.PI/8),b=point((j+1)*Math.PI/8),n=M.norm(M.sub(a,center)),d=M.norm(M.cross(M.sub(b,a),n)),q=p=>p.map((v,k)=>v+d[k]*.006),s=p=>p.map((v,k)=>v-d[k]*.006);
   g.quad(s(a),s(b),q(b),q(a),n);
  }
 }
 return g;
}
Y.Builder.prototype.eastGateLion=function(x,z){this.local(x,0,z,0,()=>{
 const stone='#a4aaa2';
 for(const [y,w,h,d]of[[.08,1.64,.16,1.78],[.21,1.55,.10,1.68],[.48,1.34,.44,1.49],[.74,1.46,.09,1.61],[.85,1.62,.13,1.76],[.97,1.64,.11,1.78]])this.box(0,y,0,w,h,d,stone,10,.4);
 for(const side of[-1,1]){this.box(side*.677,.47,0,.012,.29,1.23,stone,10,.42);this.box(0,.47,side*.752,1.10,.29,.012,stone,10,.42);}
 // Central pointed apron visible in the 2025 frontal photograph; fine relief unresolved.
 this.mesh('east-lion-apron',this.geo('east-lion-apron',()=>{const g=new G.Geometry();g.quad([-.35,.80,.898],[0,.47,.898],[.35,.80,.898],[0,.91,.898]);return g;}),0,0,0,1,1,1,stone,10,.45);
 this.mesh('east-lion-carving',this.geo('east-lion-carving',()=>carving()),0,0,0,1,1,1,stone,10,.6);
 for(const side of[-1,1]){const lift=x>0&&side===-1?.27:0,key='east-lion-leg-'+side+'-'+lift;this.mesh(key,this.geo(key,()=>carving(side,lift)),0,0,0,1,1,1,stone,10,.6);}
 // North lion's ball is documented. South accessory remains unresolved, not duplicated.
 if(x>0)this.mesh('east-lion-ball',this.geo('east-lion-ball',ball),0,0,0,1,1,1,stone,10,.6);
});};
})(YY);
