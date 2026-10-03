/* Jingchunyuan 75: two mapped courts, low rolled roofs and a through-gate axis. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='relation/14320161';
const R=Math.atan2(5.452,38.389),CO=Math.cos(R),SI=Math.sin(R),O=[2.391,-429.459];
const C={brick:'#a4a7a0',roof:'#737b77',tile:'#89918a',wood:'#983f31',green:'#286a59',blue:'#376d86',gold:'#c7b26b',glass:'#586e6b',stone:'#b7b6a2'};
const H={wall:3.15,roof:4.95,gate:5.75},gate={u:19.4,v:60.65,width:2.7,orientation:'south-inferred',confidence:'spatial-inference-not-survey'};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
// Photo-fitted small seated door lions, independent of the larger forecourt pair.
// The worn relief and anatomy are approximations; no scan or hidden-side survey exists.
function doorStone(){
 const g=new G.Geometry(),M=Y.M;
 function surface(fn,n=32,m=20){
  const normal=(u,v)=>M.norm(M.cross(M.sub(fn(u+.0001,v),fn(u-.0001,v)),M.sub(fn(u,v+.0001),fn(u,v-.0001))));
  for(let i=0;i<n;i++)for(let j=0;j<m;j++){
   const u=i*2*Math.PI/n,w=(i+1)*2*Math.PI/n,v=.00001+j*(Math.PI-.00002)/m,t=.00001+(j+1)*(Math.PI-.00002)/m;
   const a=fn(u,v),b=fn(w,v),c=fn(w,t),d=fn(u,t);
   g.tri(a,b,c,undefined,[normal(u,v),normal(w,v),normal(w,t)]);g.tri(a,c,d,undefined,[normal(u,v),normal(w,t),normal(u,t)]);
  }
 }
 function ell(x,y,z,rx,ry,rz,wrinkle=0){surface((u,v)=>{const k=1+wrinkle*Math.sin(u*3+v*7)*Math.sin(v);return[x+rx*Math.cos(u)*Math.sin(v)*k,y+ry*Math.cos(v),z+rz*Math.sin(u)*Math.sin(v)*k];},24,16);}
 function loft(x,z,rings,n=32){
  const p=(j,a)=>{const [y,rx,rz,dz=0]=rings[j];return[x+rx*Math.cos(a),y,z+dz+rz*Math.sin(a)];};
  const norm=(j,a)=>M.norm(M.cross(M.sub(p(Math.min(j+1,rings.length-1),a),p(Math.max(0,j-1),a)),[-rings[j][1]*Math.sin(a),0,rings[j][2]*Math.cos(a)]));
  for(let j=0;j<rings.length-1;j++)for(let k=0;k<n;k++){const a=k*2*Math.PI/n,b=(k+1)*2*Math.PI/n;g.tri(p(j,a),p(j+1,a),p(j+1,b),undefined,[norm(j,a),norm(j+1,a),norm(j+1,b)]);g.tri(p(j,a),p(j+1,b),p(j,b),undefined,[norm(j,a),norm(j+1,b),norm(j,b)]);}
 }
 // Square chamfered base, recessed waist and upper bearing ledge.
 const rings=[[0,.19,.205],[.025,.195,.21],[.075,.19,.205],[.09,.175,.19],[.18,.175,.19],[.205,.195,.21],[.24,.185,.20]];
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<4;i++){
  const p=(r,k)=>{const[y,x,z]=rings[r];return[[-x,-z],[x,-z],[x,z],[-x,z]][k%4];};
  const a=p(j,i),b=p(j,i+1),c=p(j+1,i+1),d=p(j+1,i);g.quad([b[0],rings[j][0],b[1]],[a[0],rings[j][0],a[1]],[d[0],rings[j+1][0],d[1]],[c[0],rings[j+1][0],c[1]]);
 }
 g.quad([-.185,.24,.20],[.185,.24,.20],[.185,.24,-.20],[-.185,.24,-.20]);
 // Worn triangular hanging cloth relief visible on the front of each base.
 g.tri([-.17,.24,.211],[0,.105,.222],[.17,.24,.211]);
 g.tri([-.13,.235,.214],[0,.13,.229],[0,.23,.235]);g.tri([0,.23,.235],[0,.13,.229],[.13,.235,.214]);
 loft(0,-.035,[[.24,.095,.10],[.31,.12,.125],[.40,.135,.12],[.49,.17,.13,.015],[.55,.155,.115,.025],[.60,.105,.085,.01],[.66,.085,.07]]);
 for(const side of [-1,1]){
  ell(side*.105,.33,-.045,.077,.095,.095);
  loft(side*.119,.086,[[.24,.035,.055,.014],[.28,.036,.045,.012],[.36,.033,.034],[.43,.041,.044,-.012],[.49,.055,.054,-.025],[.54,.040,.040,-.045]]);
  ell(side*.119,.257,.128,.048,.029,.068);
  for(let t=-1;t<=1;t++)ell(side*.119+t*.025,.25,.177,.014,.019,.025);
 }
 // Broad head with integral projecting muzzle, eye sockets and a cut mouth line.
 const gauss=(x,y,cx,cy,rx,ry)=>Math.exp(-(((x-cx)/rx)**2+((y-cy)/ry)**2));
 surface((u,v)=>{
  const x=.118*Math.cos(u)*Math.sin(v),y=.685+.113*Math.cos(v),front=Math.max(0,Math.sin(u));
  let z=.012+.105*Math.sin(u)*Math.sin(v);
  if(front>0){let d=.051*gauss(x,y,0,.663,.083,.034)+.065*gauss(x,y,0,.690,.033,.017)+.022*gauss(x,y,0,.717,.023,.036)-.052*gauss(x,y,0,.638+.014*(x/.08)**2,.077,.009);
   for(const side of [-1,1])d+=.021*gauss(x,y,side*.041,.662,.028,.019)-.026*gauss(x,y,side*.019,.684,.009,.006);
   for(const side of [-1,1])d+=.039*gauss(x,y,side*.059,.731-.16*Math.abs(x),.042,.013)-.035*gauss(x,y,side*.061,.704,.023,.009);
   z+=d*front*front;
  }return[x,y,z];
 },48,32);
 // Irregular swept mane locks and folded ears, kept close to the cranium.
 for(const side of [-1,1]){
  ell(side*.106,.725,-.005,.037,.043,.03,.12);
  for(let i=0;i<4;i++)ell(side*(.102-i*.006),.714-i*.032,-.045-i*.009,.043,.040,.043,.10);
 }
 for(let i=-2;i<=2;i++)ell(i*.038,.776-Math.abs(i)*.009,-.011,.027,.022,.069,.08);
 return g;
}
// Large forecourt pair: separate photo-fitted anatomy, not scaled door stones.
function forecourtLion(side=0,part='core'){
 const g=new G.Geometry(),M=Y.M,ballSide=-side;
 const gauss=(x,y,cx,cy,rx,ry)=>Math.exp(-(((x-cx)/rx)**2+((y-cy)/ry)**2));
 function surface(fn,n=40,m=28){
  const normal=(u,v)=>M.norm(M.cross(M.sub(fn(u+.0001,v),fn(u-.0001,v)),M.sub(fn(u,v+.0001),fn(u,v-.0001))));
  for(let i=0;i<n;i++)for(let j=0;j<m;j++){
   const u=i*2*Math.PI/n,w=(i+1)*2*Math.PI/n,v=.00001+j*(Math.PI-.00002)/m,t=.00001+(j+1)*(Math.PI-.00002)/m;
   g.tri(fn(u,v),fn(w,v),fn(w,t),undefined,[normal(u,v),normal(w,v),normal(w,t)]);
   g.tri(fn(u,v),fn(w,t),fn(u,t),undefined,[normal(u,v),normal(w,t),normal(u,t)]);
  }
 }
 function ell(x,y,z,rx,ry,rz){surface((u,v)=>[x+rx*Math.cos(u)*Math.sin(v),y+ry*Math.cos(v),z+rz*Math.sin(u)*Math.sin(v)],28,20);}
 function loft(x,z,rings,n=48){
  const p=(j,a)=>{const [y,rx,rz,dz=0]=rings[j];return[x+rx*Math.cos(a),y,z+dz+rz*Math.sin(a)];};
  const norm=(j,a)=>M.norm(M.cross(M.sub(p(Math.min(j+1,rings.length-1),a),p(Math.max(0,j-1),a)),[-rings[j][1]*Math.sin(a),0,rings[j][2]*Math.cos(a)]));
  for(let j=0;j<rings.length-1;j++)for(let k=0;k<n;k++){const a=k*2*Math.PI/n,b=(k+1)*2*Math.PI/n;g.tri(p(j,a),p(j+1,a),p(j+1,b),undefined,[norm(j,a),norm(j+1,a),norm(j+1,b)]);g.tri(p(j,a),p(j+1,b),p(j,b),undefined,[norm(j,a),norm(j+1,b),norm(j,b)]);}
 }
 function tube(points,r,n=8){
  const rings=points.map((p,i)=>{const tangent=M.norm(M.sub(points[Math.min(i+1,points.length-1)],points[Math.max(0,i-1)])),a=M.norm(M.cross(tangent,Math.abs(tangent[2])>.9?[0,1,0]:[0,0,1])),b=M.cross(tangent,a);return Array.from({length:n},(_,j)=>p.map((v,k)=>v+r*(a[k]*Math.cos(j*2*Math.PI/n)+b[k]*Math.sin(j*2*Math.PI/n))));});
  for(let i=1;i<rings.length;i++)for(let j=0;j<n;j++)g.quad(rings[i-1][j],rings[i-1][(j+1)%n],rings[i][(j+1)%n],rings[i][j]);
 }
 if(part==='mane'){
  // Canonical carved lock: full-resolution geometry reused through transforms.
  surface((u,v)=>{
   const r=Math.sin(v),rr=Math.hypot(Math.cos(u)*r,Math.cos(v)),theta=Math.atan2(Math.cos(v),Math.cos(u)*r),phase=Math.atan2(Math.sin(theta-3*Math.PI*(1-rr/.85)),Math.cos(theta-3*Math.PI*(1-rr/.85)));
   const cut=Math.sin(u)>0?.018*Math.exp(-((phase*Math.max(rr,.16)/.22)**2))*Math.min(1,rr/.12)*Math.max(0,Math.min(1,(.96-rr)/.12)):0;
   return[.115*Math.cos(u)*r,.14*Math.cos(v),.085*Math.sin(u)*r-cut];
  },80,56);
  return g;
 }
 if(part==='base'){
 // Recessed waist and spreading mouldings under the square bearing slab.
 const tiers=[[0,1.08,1.18],[.07,1.08,1.18],[.12,1.0,1.10],[.19,.89,.97],[.24,.81,.89],[.34,.81,.89],[.39,.92,1.0],[.46,1.08,1.18],[.53,1.10,1.20],[.56,1.06,1.16]];
 const ring=([y,w,d])=>[[-w/2,y,-d/2],[-w/2,y,d/2],[w/2,y,d/2],[w/2,y,-d/2]];
 for(let i=1;i<tiers.length;i++){const a=ring(tiers[i-1]),b=ring(tiers[i]);for(let j=0;j<4;j++)g.quad(a[j],a[(j+1)%4],b[(j+1)%4],b[j]);}
 const top=ring(tiers.at(-1));g.quad(...top);
 // Triangular hanging cloth: woven pattern on the left, broader scrolls on
 // the right, as visible in the reference. Exact worn motifs remain approximate.
 g.tri([-.53,.52,.606],[0,.12,.620],[.53,.52,.606]);
 tube([[-.53,.52,.61],[0,.12,.625],[.53,.52,.61]],.017);
 if(side<0){
  for(let y=.22;y<.50;y+=.052){const half=(y-.12)/.40*.53-.035;for(let x=-half;x<half;x+=.068){const pts=[];for(let k=0;k<=20;k++){const a=k*2*Math.PI/20;pts.push([x+.029*Math.cos(a),y+.021*Math.sin(2*a),.626]);}tube(pts,.0035,6);}}
 }else for(const x of [-.28,0,.28]){
  const pts=[];for(let k=0;k<=40;k++){const t=k/40,a=t*Math.PI*3,r=.09*(1-t)+.009;pts.push([x+r*Math.cos(a),.405+r*Math.sin(a),.629]);}tube(pts,.009);
 }
 return g;
 }
 if(part==='legs'){
 // One bent foreleg rests above the worn round support; its partner is straight.
 for(const q of [-1,1]){
  const lifted=q===ballSide,base=lifted?.72:.57,x=q*.285;
  if(lifted)surface((u,v)=>{const k=1+.04*Math.sin(8*u)*Math.sin(v);return[x+.16*Math.cos(u)*Math.sin(v)*k,.665+.105*Math.cos(v),.37+.15*Math.sin(u)*Math.sin(v)*k];},40,24);
  const rings=[];for(let j=0;j<=28;j++){
   const t=j/28,y=base+(1.32-base)*t;
   let r=.087+.055*t*t;if(!lifted&&y<1.09&&y>.69)r*=1-.11*Math.exp(-(((Math.sin((y-.69)/.088*Math.PI))/.18)**2));
   rings.push([y,r,r*.95,-.15*t*t]);
  }
  rings.push([1.40,.10,.095,-.17],[1.44,.06,.07,-.18]);loft(x,.29,rings,36);
  ell(x,base+.024,.36,.125,.064,.17);
  for(let j=-1;j<=2;j++)ell(x+(j-.5)*.053,base+.012,.49,.034,.038,.064);
 }
 return g;
 }
 // A seated haunch supports a continuous belly, broad chest and neck.
 loft(0,-.19,[[.80,.11,.12],[.88,.21,.22],[1.03,.33,.29],[1.19,.41,.35,.025],[1.32,.395,.35,.07],[1.43,.32,.29,.09],[1.54,.26,.24,.09],[1.64,.23,.20,.08]]);
 for(const q of [-1,1])ell(q*.27,.77,-.19,.19,.23,.24);
 // Collar and worn central pendant seen across the chest.
 const collar=[];for(let i=0;i<=48;i++){const a=i*2*Math.PI/48;collar.push([.315*Math.cos(a),1.405,.035+.272*Math.sin(a)]);}tube(collar,.018);
 ell(0,1.25,.305,.10,.135,.043);tube([[0,1.41,.307],[0,1.34,.335]],.022);
 // Profile-led mask: the short muzzle and recessed mouth are part of the
 // same surface as the forehead and cheeks, without a separate smiling lip.
 const headStart=g.v.length,shape=(q,p)=>Math.sign(q)*Math.abs(q)**p;
 const profile=[[1.415,.14],[1.455,.35],[1.49,.445],[1.52,.40],[1.56,.265],[1.59,.34],[1.62,.49],[1.665,.515],[1.70,.52],[1.75,.53],[1.83,.49],[1.93,.37],[2.025,.075]];
 function faceDepth(y){
  const found=profile.findIndex(p=>p[0]>=y),i=found<0?profile.length-2:Math.max(0,found-1);
  const a=profile[i],c=profile[i+1],lo=profile[Math.max(0,i-1)],hi=profile[Math.min(profile.length-1,i+2)],h=c[0]-a[0],t=Math.max(0,Math.min(1,(y-a[0])/h));
  const m=(c[1]-lo[1])/(c[0]-lo[0])*h,n=(hi[1]-a[1])/(hi[0]-a[0])*h;
  return Math.max(Math.min(a[1],c[1]),Math.min(Math.max(a[1],c[1]),(2*t*t*t-3*t*t+1)*a[1]+(t*t*t-2*t*t+t)*m+(-2*t*t*t+3*t*t)*c[1]+(t*t*t-t*t)*n));
 }
 surface((u,v)=>{
  const x=.395*shape(Math.cos(u)*Math.sin(v),.88),y=1.72+.305*shape(Math.cos(v),.88),front=Math.max(0,Math.sin(u)),middle=.075+.31*Math.sin(v);
  let z=.075+.31*Math.sin(u)*Math.sin(v);
  if(front>0){
   const lipRise=.045*(x/.32)**2*Math.exp(-(((y-1.56)/.10)**2));
   let d=(faceDepth(y-lipRise)-middle)*front;
   for(const q of [-1,1])d+=.055*gauss(x,y,q*.24,1.77,.095,.035)-.035*gauss(x,y,q*.25,1.722,.029,.016)-.041*gauss(x,y,q*.07,1.645,.028,.018);
   // Broad, worn ridges at the brow and muzzle; fitted carving, not noise beads.
   d+=(.010*Math.cos(x*31)+.004*Math.cos(x*67))*gauss(x,y,0,1.755,.34,.025);
   d+=(.009*Math.cos(x*39)+.003*Math.sin(x*73))*gauss(x,y,0,1.625,.27,.025);
   z+=d*front*front;
  }return[x,y,z];
 },96,96);
 // The reference head bears slightly downward; rotate the entire head/mane
 // together so the short muzzle does not read as an upright human smile.
 const co=Math.cos(.20),si=Math.sin(.20);
 for(let i=headStart;i<g.v.length;i+=8){const y=g.v[i+1]-1.72,z=g.v[i+2]-.075,ny=g.v[i+4],nz=g.v[i+5];g.v[i+1]=1.76+y*co-z*si;g.v[i+2]=.075+y*si+z*co;g.v[i+4]=ny*co-nz*si;g.v[i+5]=ny*si+nz*co;}
 return g;
}
// Fit the photo-established axial stone walk to the existing rendered road
// boundary. The gate orientation remains inferred; this is not a survey trace.
function entranceApproach(road){
 if(!road||road.geometry.type!=='LineString'||!(road.properties.width>0))return null;
 const ribbon=G.ribbon(road.geometry.coordinates,road.properties.width,.12).v;
 const u0=gate.u-1.75,u1=gate.u+1.75,start=gate.v+.40;let best=null;
 for(let i=0;i<ribbon.length;i+=48)for(const [j,k]of [[0,8],[40,16]]){
  const a=local([ribbon[i+j],ribbon[i+j+2]]),c=local([ribbon[i+k],ribbon[i+k+2]]),du=c[0]-a[0];
  if(Math.abs(du)<1e-8)continue;
  const t0=(u0-a[0])/du,t1=(u1-a[0])/du;
  if(Math.min(t0,t1)<0||Math.max(t0,t1)>1)continue;
  const v0=a[1]+t0*(c[1]-a[1]),v1=a[1]+t1*(c[1]-a[1]);
  if(Math.min(v0,v1)<=start||Math.max(v0,v1)>start+25)continue;
  if(!best||v0+v1<best.v0+best.v1)best={v0,v1,edge:[world(...a),world(...c)]};
 }
 if(!best)return null;
 const poly=[[u0,start],[u1,start],[u1,best.v1],[u0,best.v0]];
 return{poly,outline:[...poly,poly[0]].map(p=>world(...p)),edge:best.edge};
}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const approach=entranceApproach(Y.CAMPUS?.features.find(q=>q.properties.id==='way/595764208'));const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function frame(u,v,r,fn){const p=world(u,v);b.local(p[0],0,p[1],R+r,fn);}
 function block(name,box,base,top,color=C.brick){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('010-'+name,g,color,color===C.brick?30:24,id);}
 block('north-main',[-1,-1,40,10.93],0,H.wall);
 block('west-body',[-1,10.93,8.69,51.87],0,H.wall);
 block('east-body',[29.51,10.93,40,51.87],0,H.wall);
 // Preserve both holes, and cut a real axis through BOTH southern and middle transverse blocks.
 for(const [name,v0,v1] of [['middle',20.52,36.48],['south',51.70,61]]){
  if(name==='south'){
   // Recess only the photo-established front windows. Keep a solid rear wall;
   // no room layout or unobserved interior is inferred from the glazing.
   for(const [wing,u0,u1,cx]of [['west',-1,18.05,15.4],['east',20.75,40,23.4]]){
    const a=cx-1.25,c=cx+1.25;
    block(name+'-'+wing+'-back',[u0,v0,u1,60.1],0,H.wall);
    block(name+'-'+wing+'-left',[u0,60.1,a,v1],0,H.wall);
    block(name+'-'+wing+'-right',[c,60.1,u1,v1],0,H.wall);
    block(name+'-'+wing+'-sill',[a,60.1,c,v1],0,.87);
    block(name+'-'+wing+'-head',[a,60.1,c,v1],2.53,H.wall);
   }
  }else{block(name+'-west',[-1,v0,18.05,v1],0,H.wall);block(name+'-east',[20.75,v0,40,v1],0,H.wall);}
  block(name+'-passage-lintel',[18.05,v0,20.75,v1],2.85,H.wall,C.wood);
 }
 // Narrow gallery strips lie on mapped solid ground, with open passages underneath their roofs.
 for(const [u,v0,v1] of [[9.0,11.1,20.5],[29.1,11.1,20.5],[9.8,36.5,51.7],[29.2,36.5,51.7]]){
  frame(u,v0,0,()=>{for(let v=0;v<=v1-v0;v+=3.0)b.cyl(0,.05,v,.11,2.8,C.wood,10,1,6);b.box(0,2.86,(v1-v0)/2,.48,.2,v1-v0,C.green,6);});
 }
 // Smooth-top rolled profiles: zero slope at the crown, slight lifted tile edges, no pointed ridge.
 function rolled(name,box,axis,base=3.17,rise=1.6){const cross=axis==='u'?1:0,mid=(box[cross]+box[cross+2])/2,half=(box[cross+2]-box[cross])/2,mesh=new G.Geometry(),ends=new G.Geometry(),tiles=new G.Geometry();
  const height=p=>{const t=Math.min(1,Math.abs((p[cross]-mid)/half));return base+rise*(1-t*t)+.28*Math.pow(t,12);};
  for(let j=0;j<24;j++){const region=box.slice();region[cross]=box[cross]+j*(half*2)/24;region[cross+2]=box[cross]+(j+1)*(half*2)/24;for(const p of pieces(f,region)){for(let i=1;i<p.length-1;i++)mesh.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],height(p),p[1])));for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];ends.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],height(c),c[1]),vertex(a[0],height(a),a[1]));}}}
  add('010-'+name+'-rolled-roof',mesh,C.roof,2,id);add('010-'+name+'-roof-end',ends,C.brick,30,id);
  // Thin raised tile ribs follow the same curved surface and are clipped to the original footprint.
  const along=1-cross;for(let s=box[along]+.2;s<box[along+2];s+=.34)for(let j=0;j<24;j++){const rr=box.slice();rr[along]=s-.026;rr[along+2]=s+.026;rr[cross]=box[cross]+j*half*2/24;rr[cross+2]=box[cross]+(j+1)*half*2/24;for(const p of pieces(f,rr))for(let i=1;i<p.length-1;i++)tiles.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],height(p)+.045,p[1])));}
  add('010-'+name+'-tile-ribs',tiles,C.tile,2,id);
 }
 rolled('north',[-.05,0,38.78,10.93],'u',3.17,1.75);
 rolled('middle-back',[-.05,20.52,38.82,28.4],'u');rolled('middle-front',[-.05,28.4,38.82,36.48],'u',3.17,1.45);
 rolled('south',[-.05,51.7,38.84,60.65],'u',3.17,1.42);
 rolled('north-west',[0,10.93,8.69,20.52],'v',3.0,1.3);rolled('north-east',[28.75,10.93,38.81,20.67],'v',3.0,1.4);
 rolled('south-west',[0,36.48,9.52,51.86],'v',3.0,1.4);rolled('south-east',[29.51,36.32,38.83,51.71],'v',3.0,1.4);
 function lattice(x,y,w,h,z=.15){b.box(x,y,z,w+.14,h+.14,.15,C.wood,6);b.box(x,y,z+.1,w,h,.04,C.glass,5);for(let i=0;i<=4;i++)b.box(x-w/2+w*i/4,y,z+.15,.04,h,.06,C.wood,6);for(let i=1;i<=4;i++)b.box(x,y-h/2+h*i/5,z+.15,w,.035,.06,C.wood,6);b.box(x,y-h/2-.14,z+.10,w+.17,.22,.13,C.wood,6);}
 // The two street-facing windows have four tall leaves, lower timber panels
 // and a long-rectangle lattice; do not propagate this photo-specific pattern
 // to the unseen rear and courtyard windows.
 function gateWindow(x,y,w,h,z){
  const left=x-w/2,bottom=y-h/2,top=y+h/2,step=w/4,glassBottom=bottom+.31,glassTop=top-.095;
  const timber=C.wood,shade='#69392f';
  b.box(x,y,z,w+.17,h+.17,.17,shade,20);
  b.box(x,(glassBottom+glassTop)/2,z+.10,w-.09,glassTop-glassBottom,.025,C.glass,5);
  for(const xx of [left-.04,left+w+.04])b.box(xx,y,z+.16,.075,h+.12,.13,timber,20);
  for(const yy of [bottom-.035,top+.035])b.box(x,yy,z+.16,w+.15,.07,.13,timber,20);
  for(let i=0;i<4;i++){
   const cx=left+(i+.5)*step,a=cx-step/2+.023,c=cx+step/2-.023;
   for(const xx of [a,c])b.box(xx,y,z+.19,.043,h,.095,timber,20);
   b.box(cx,bottom+.15,z+.177,step-.064,.285,.07,timber,20);
   b.box(cx,bottom+.15,z+.218,step-.17,.17,.022,shade,20);
   // Raised panel border; the source does not establish interior joinery.
   for(const xx of [cx-(step-.17)/2,cx+(step-.17)/2])b.box(xx,bottom+.15,z+.241,.021,.18,.021,timber,20);
   for(const yy of [bottom+.06,bottom+.24])b.box(cx,yy,z+.241,step-.17,.021,.021,timber,20);
   for(const yy of [glassBottom,glassTop])b.box(cx,yy,z+.19,step-.04,.05,.10,timber,20);
   const lo=glassBottom+.16,hi=glassTop-.14,half=step*.245;
   for(const xx of [cx-half,cx+half])b.box(xx,(lo+hi)/2,z+.23,.027,hi-lo,.045,timber,20);
   for(const yy of [lo,hi])b.box(cx,yy,z+.23,half*2+.027,.027,.045,timber,20);
   // Small returns at mid-height connect the long rectangle to its side rails.
   const middle=(lo+hi)/2;
   for(const side of [-1,1]){
    const inner=cx+side*half,outer=cx+side*(step/2-.05);
    for(const yy of [middle-.047,middle+.047])b.box((inner+outer)/2,yy,z+.23,Math.abs(outer-inner),.024,.045,timber,20);
   }
   for(const yy of [glassBottom+.085,glassTop-.067]){
    b.box(cx,yy,z+.23,.08,.022,.045,timber,20);
    for(const xx of [cx-.025,cx+.025])b.box(xx,yy,z+.23,.020,.09,.045,timber,20);
   }
  }
  // Each pair has a fine gold perimeter, visible on both reference windows.
  for(const cx of [x-w/4,x+w/4]){
   for(const xx of [cx-w/4+.012,cx+w/4-.012])b.box(xx,y,z+.253,.008,h+.015,.008,C.gold,9);
   for(const yy of [bottom-.008,top+.008])b.box(cx,yy,z+.253,w/2-.024,.008,.008,C.gold,9);
  }
  b.box(x,bottom-.13,z+.09,w+.25,.12,.29,timber,20);
 }
 function boundary(a,c,fn){const dx=c[0]-a[0],dz=c[1]-a[1];b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>fn(Math.hypot(dx,dz)));}
 const pg=F.polygons(f.geometry)[0];for(let ri=0;ri<pg.length;ri++){const ring=pg[ri],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive===(ri===0))[a,c]=[c,a];const aa=local(a),cc=local(c),south=ri===0&&aa[1]>60&&cc[1]>60;boundary(a,c,len=>{const n=Math.max(1,Math.round(len/4.8));for(let k=0;k<n;k++){const x=(k+.5)*len/n,p=[aa[0]+(cc[0]-aa[0])*x/len,aa[1]+(cc[1]-aa[1])*x/len];if(south||(Math.abs(p[0]-19.4)<2.9&&ri>0))continue;lattice(x,1.7,Math.min(2.4,len/n-.8),1.5);}if(Math.abs(cc[0]-aa[0])>10&&(south||ri>0)){const gx=(19.4-aa[0])/(cc[0]-aa[0])*len;for(const [lo,hi] of [[0,gx-1.45],[gx+1.45,len]])if(hi>lo)b.box((lo+hi)/2,.40,.035,hi-lo,.10,.12,'#818a82',24);}else b.box(len/2,.40,.035,len,.10,.12,'#818a82',24);});}}
 // Main gate is placed at the south outer edge as an explicit spatial inference from the full axis.
 frame(gate.u,gate.v,0,()=>{
  for(const x of [-1.63,1.63])b.box(x,1.68,.10,.40,3.36,.58,C.green,20);
  b.box(0,3.62,.1,4.05,.78,.65,C.blue,20);
  // The upper rail sits below the eave, with an open tier above the lower beam.
  b.box(0,4.50,1.28,5.15,.22,.38,'#244b5c',20);
  b.box(0,4.635,1.43,5.40,.075,.22,C.wood,20);
  for(const x of [-1.63,1.63]){
   b.box(x,4.055,.31,.30,.12,.43,C.green,20);
   b.beam([x,4.04,.31],[x,4.44,1.26],.12,C.green,20);
   b.box(x,4.38,1.15,.37,.16,.55,C.green,20);
  }
  for(const x of [-1.0,-.34,.34,1.0])b.beam([x,4.0,.28],[x,4.40,1.27],.05,C.green,20);
  // Photo-established lower beam: five framed panels between three upper and
  // three lower picture fields. The paintings themselves remain unregistered.
  const ink='#193c4c',ochre='#baa36c',faded='#a0ada3';
  function faceLine(points,z,width,color){for(let i=1;i<points.length;i++)b.beam([...points[i-1],z],[...points[i],z],width/2,color,9);}
  function insetFrame(cx,cy,w,h,z,color){
   const c=.035,points=[[-w/2+c,-h/2],[w/2-c,-h/2],[w/2,-h/2+c],[w/2,h/2-c],[w/2-c,h/2],[-w/2+c,h/2],[-w/2,h/2-c],[-w/2,-h/2+c],[-w/2+c,-h/2]].map(p=>[p[0]+cx,p[1]+cy]);
   faceLine(points,z,.015,color);
  }
  for(let i=0;i<5;i++){
   const x=(i-2)*.675;
   b.box(x,3.63,.455,.59,.37,.065,i%2?C.green:'#25496c',20);
   b.box(x,3.63,.495,.43,.23,.015,ink,20);
   insetFrame(x,3.63,.44,.24,.509,ochre);
  }
  for(const y of [3.34,3.92]){
   b.box(0,y,.448,3.36,.16,.04,C.green,20);
   for(const x of [-1.10,0,1.10]){
    b.box(x,y,.479,.94,.133,.024,faded,20);
    for(const side of [-1,1])faceLine([[x+side*.49,y-.077],[x+side*.455,y-.035],[x+side*.478,y],[x+side*.455,y+.035],[x+side*.49,y+.077]],.50,.020,ochre);
   }
   for(const yy of [y-.085,y+.085])b.box(0,yy,.481,3.4,.016,.025,ochre,9);
  }
  for(let i=0;i<6;i++)b.box((i-2.5)*.675,3.63,.478,.073,.39,.042,ochre,20);
  for(const side of [-1,1]){
   const x=side*1.77;
   b.box(x,3.66,.44,.25,1.08,.18,ochre,20);
   for(const dx of [-.105,.105])b.box(x+dx,3.66,.542,.014,1.01,.024,C.gold,9);
   b.box(x,3.13,.46,.28,.07,.21,ochre,20);
  }
  // Shaped shoulders and four small hanging blocks replace a straight block edge.
  function relief(name,points,back,front,color){
   const g=new G.Geometry(),cap=G.polygon(points,0);
   for(let i=0;i<cap.v.length;i+=24){const q=[];for(let j=0;j<3;j++){const k=i+j*8;q.push([cap.v[k],cap.v[k+2],front]);}g.tri(q[0],q[2],q[1]);g.tri([q[0][0],q[0][1],back],[q[1][0],q[1][1],back],[q[2][0],q[2][1],back]);}
   for(let i=0;i<points.length;i++){const a=points[i],c=points[(i+1)%points.length];g.quad([...a,back],[...c,back],[...c,front],[...a,front]);}
   b.mesh(name,b.geo(name,()=>g),0,0,0,1,1,1,color,20);
  }
  for(const side of [-1,1]){
   const points=[[1.03,3.23],[1.71,3.23],[1.71,3.055],[1.54,3.055],[1.48,3.09],[1.30,3.12],[1.18,3.10]].map(([x,y])=>[x*side,y]);
   relief('010-gate-shoulder-'+side,points,.16,.47,C.blue);
   faceLine([...points,points[0]],.49,.019,C.gold);
  }
  for(const x of [-1.02,-.34,.34,1.02]){
   const points=[[x-.13,3.23],[x+.13,3.23],[x+.095,3.14],[x,3.115],[x-.095,3.14]];
   relief('010-gate-pendant-'+x,points,.16,.45,C.blue);
   faceLine(points.slice(1).concat([points[0]]),.469,.019,C.gold);
  }

  // Closed and open official views agree: fixed red side panels surround a
  // narrower double-leaf opening. Do not turn those painted panels into doors.
  for(const side of [-1,1]){
   const cx=side*1.07;
   b.box(cx,1.67,.015,.66,3.04,.16,C.wood,20);
   for(const [lo,hi]of [[.20,.53],[.68,.99],[1.22,3.00]]){
    b.box(cx,(lo+hi)/2,.103,.43,hi-lo,.02,'#80372d',20);
    for(const xx of [cx-.225,cx+.225])b.box(xx,(lo+hi)/2,.122,.024,hi-lo+.024,.022,C.gold,9);
    for(const yy of [lo,hi])b.box(cx,yy,.122,.474,.024,.022,C.gold,9);
   }
  }
  b.box(0,3.015,.015,1.48,.33,.16,C.wood,20);
  for(const xx of [-.75,.75])b.box(xx,1.50,.118,.026,2.70,.026,C.gold,9);
  b.box(0,2.86,.118,1.526,.026,.026,C.gold,9);
  for(const side of [-1,1])b.local(side*.74,.16,.025,-side*Math.PI/2,()=>{
   const direction=-side,w=.72,h=2.67,cx=direction*w/2;
   b.box(cx,h/2,0,w,h,.095,C.wood,20);
   // The dark ring pulls are visible in the closed official photograph.
   // Their backing shape and fitted dimensions are not a carving survey.
   const hx=direction*(w-.15),metal='#3c4b3e';
   b.box(hx,1.69,.063,.14,.18,.028,metal,9);
   b.sphere(hx,1.75,.095,.034,.034,.035,metal,9,0,true);
   b.mesh('010-door-ring',b.geo('010-door-ring',()=>G.torus(24,8)),hx,1.65,.108,.075,.095,.045,metal,9);
  });
  b.box(0,.075,.1,2.75,.15,.60,C.wood,20);if(!approach)b.box(0,.045,2.1,3.5,.09,4.7,'#b8b9ac',10);
  for(const x of [-4.0,4.0])gateWindow(x,1.7,2.4,1.55,-.11);
  b.box(2.26,2.20,.14,.65,.26,.1,'#99895f',9);if(b.lettering)b.lettering('教育基金会',2.26,2.20,.205,.56,.14,0,'#514b38');
  // Two small carved door stones stay next to the jambs.
  for(const x of [-.89,.89])b.mesh('010-small-door-lion',b.geo('010-small-door-lion',doorStone),x,.09,.65,1,1,1,C.stone,10);
  // Independent large pair, with mirrored raised forepaws and distinct visible
  // cloth decoration. Hidden carving is not claimed as a surveyed replica.
  for(const side of [-1,1]){
   b.mesh('010-forecourt-lion-core',b.geo('010-forecourt-lion-core',()=>forecourtLion()),side*5.8,0,3.8,1,1,1,C.stone,10);
   for(const part of ['base','legs']){const key='010-forecourt-lion-'+part+'-'+side;b.mesh(key,b.geo(key,()=>forecourtLion(side,part)),side*5.8,0,3.8,1,1,1,C.stone,10);}
   const co=Math.cos(.20),si=Math.sin(.20),tilt=new Float32Array([1,0,0,0,0,co,si,0,0,-si,co,0,0,1.76-1.72*co+.075*si,.075-1.72*si-.075*co,1]);
   const root=Y.M.multiply(Y.M.transform(b.world([side*5.8,0,3.8]),[1,1,1],b.rotation),tilt),mesh=b.geo('010-forecourt-mane',()=>forecourtLion(0,'mane'));
   function lock(x,y,z,angle,sx=1,sy=1){const matrix=Y.M.multiply(root,Y.M.transform([x,y,z],[sx,sy,1],angle));b.e.add('010-forecourt-mane',mesh,matrix,C.stone,[10,id,b.anim,0]);}
   for(const q of [-1,1])for(let i=0;i<4;i++)lock(q*(.345-i*.018),1.90-i*.12,i<2?.14-i*.10:-.09-i*.012,q*.72);
   for(let i=-2;i<=2;i++)lock(i*.14,1.99-Math.abs(i)*.025,.12,i*.20,.85,.65);
  }

 });
 if(approach){
  add('010-approach-bed',F.surface({type:'Polygon',coordinates:[approach.outline]},.121),'#999d92',10,id);
  const poly=approach.poly,tiles=new G.Geometry(),border=new G.Geometry(),u0=poly[0][0],u1=poly[1][0],v0=poly[0][1],end=Math.max(poly[2][1],poly[3][1]);
  function patch(mesh,lo,hi,start,end,y){
   let p=poly;for(const [axis,k,greater]of [[0,lo,true],[0,hi,false],[1,start,true],[1,end,false]])if(p.length)p=clip(p,axis,k,greater);
   if(p.length<3)return;
   for(const tri of F.capTriangles([[...p,p[0]]]))mesh.tri(...tri.map(q=>vertex(q[0],y,q[1])));
  }
  // Broad rectangular slabs with narrow joints, clipped at the diagonal road
  // edge. Flush side bands do not introduce a barrier across the public walk.
  for(let row=0,v=v0;v<end;row++,v+=.55)for(let u=u0+.16-(row%2)*.53;u<u1-.16;u+=1.06)patch(tiles,Math.max(u+.004,u0+.16),Math.min(u+1.056,u1-.16),v+.004,v+.546,.124);
  for(const [a,c]of [[u0,u0+.15],[u1-.15,u1]])for(let v=v0;v<end;v+=1.1)patch(border,a,c,v+.003,v+1.097,.124);
  add('010-approach-slabs',tiles,'#c1c0b2',10,id);add('010-approach-borders',border,'#aaaea1',10,id);
  const sides=new G.Geometry();for(const [a,c]of [[poly[0],poly[3]],[poly[2],poly[1]]])sides.quad(vertex(a[0],0,a[1]),vertex(c[0],0,c[1]),vertex(c[0],.121,c[1]),vertex(a[0],.121,a[1]));add('010-approach-sides',sides,'#999d92',10,id);
  const xs=approach.outline.map(p=>p[0]),zs=approach.outline.map(p=>p[1]);b.noPlant((Math.min(...xs)+Math.max(...xs))/2,(Math.min(...zs)+Math.max(...zs))/2,Math.max(...xs)-Math.min(...xs),Math.max(...zs)-Math.min(...zs));
 }
 // Separate taller rolled gate roof; its small projection is not a replacement ground footprint.
 const roof=new G.Geometry(),ribs=new G.Geometry(),roofY=(x,z)=>4.35+1.15*(1-Math.pow(z/2.0,2))+.28*Math.pow(Math.abs(z/2),12)+.25*Math.pow(Math.abs(x/3.0),8);
 for(let i=0;i<24;i++)for(let j=0;j<12;j++){const x=-3+i*.25,xx=x+.25,z=-2+j/3,zz=z+1/3;roof.quad(vertex(gate.u+x,roofY(x,z),gate.v+z-.5),vertex(gate.u+x,roofY(x,zz),gate.v+zz-.5),vertex(gate.u+xx,roofY(xx,zz),gate.v+zz-.5),vertex(gate.u+xx,roofY(xx,z),gate.v+z-.5));}
 add('010-decorated-gate-rolled-roof',roof,C.roof,2,id);
 const soffit=new G.Geometry();for(let i=0;i<roof.v.length;i+=24){const p=[];for(let j=0;j<3;j++){const k=i+j*8;p.push([roof.v[k],roof.v[k+1]-.05,roof.v[k+2]]);}soffit.tri(p[0],p[2],p[1]);}add('010-gate-roof-boarding',soffit,C.wood,20,id);
 // Curved rafters contact the tile surface and the eave rail; no floating roof.
 // Spacing follows the visible repeated roof rhythm, with fitted section sizes.
 frame(gate.u,gate.v,0,()=>{
  for(let x=-2.7;x<=2.701;x+=.30)for(let j=0;j<24;j++){
   const z=-2+j/6,zz=Math.min(z+1/6,1.90);
   b.beam([x,roofY(x,z)-.11,z-.5],[x,roofY(x,zz)-.11,zz-.5],.055,C.wood,20);
  }
 });
 for(let x=-2.85;x<3;x+=.30)for(let j=0;j<24;j++){const z=-2+j/6,zz=z+1/6;ribs.quad(vertex(gate.u+x-.035,roofY(x,z)+.05,gate.v+z-.5),vertex(gate.u+x-.035,roofY(x,zz)+.05,gate.v+zz-.5),vertex(gate.u+x+.035,roofY(x,zz)+.05,gate.v+zz-.5),vertex(gate.u+x+.035,roofY(x,z)+.05,gate.v+z-.5));}add('010-gate-tile-ribs',ribs,C.tile,2,id);
 // A second aligned red framed passage is visible behind the courtyard in the dated photograph.
 frame(19.4,36.4,0,()=>{for(const x of [-1.48,1.48])b.box(x,1.45,.10,.28,2.9,.35,C.wood,6);b.box(0,2.72,.10,3.20,.30,.35,C.wood,6);});
 frame(19.4,10.94,0,()=>{b.box(0,1.28,.13,2.65,2.56,.15,C.wood,6);for(const x of [-.67,.67])lattice(x,1.67,1.15,1.38,.24);});
 // Photo-established front-court path and three short risers before the middle passage.
 // The platform is local to the axis; the rest of either court stays at its existing level.
 function ground(name,u0,u1,v0,v1,top,color){const g=new G.Geometry(),a=vertex(u0,top,v0),c=vertex(u1,top,v0),d=vertex(u1,top,v1),e=vertex(u0,top,v1);g.quad(a,e,d,c);for(const [p,q] of [[a,c],[c,d],[d,e],[e,a]])g.quad([p[0],0,p[2]],[q[0],0,q[2]],q,p);add('010-'+name,g,color,10,id);}
 ground('court-axis-path',17.7,21.1,39.55,51.7,.04,'#b8b9ac');
 ground('gate-passage-path',18.1,20.7,51.7,60.65,.04,'#b8b9ac');
 ground('court-grass-west',10.0,17.65,39.55,51.5,.018,'#819879');
 ground('court-grass-east',21.15,29.0,39.55,51.5,.018,'#819879');
 for(let i=0;i<3;i++)ground('inner-stair-'+(i+1),17.15,21.65,39.1-i*.45,39.55-i*.45,.18+i*.14,'#a8ada4');
 ground('inner-platform',17.15,21.65,36.48,38.2,.46,'#a8ada4');
 // Continue through the existing aperture. Its short internal slope returns to the rear floor
 // without inventing a second exterior staircase that the photographs do not establish.
 ground('passage-landing',18.1,20.7,35.7,36.48,.46,'#a8ada4');
 {const g=new G.Geometry();g.quad(vertex(18.1,.04,32.7),vertex(18.1,.46,35.7),vertex(20.7,.46,35.7),vertex(20.7,.04,32.7));add('010-passage-level-transition',g,'#a8ada4',10,id);}
 ground('middle-passage-floor',18.1,20.7,20.52,32.7,.04,'#b8b9ac');
 // Two conservative cypress silhouettes in the front court; exact trunks remain photo-fitted.
 const originalAdd=b.e.add;b.e.add=function(key,...args){return originalAdd.call(this,'010-vegetation-cypress-'+key,...args);};
 try{for(const [u,v,h] of [[13.0,43.1,8.8],[25.5,41.2,9.3]])frame(u,v,0,()=>{b.cyl(0,0,0,.26,h*.74,'#685d4a',10,.62,6);b.sphere(0,h*.66,0,1.8,h*.35,1.55,'#496b4c',33);b.sphere(.5,h*.85,.1,1.3,h*.18,1.1,'#54784f',33);});}finally{b.e.add=originalAdd;}
 return {strategy:'building010-v46',floors:1,sourceOutline:true,twoCourts:true,throughGate:true,gatePlacementInferred:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building010={id:ID,render,world,local,pieces,heights:H,gate,entranceApproach,excludeGeneratedTree(point){const [u,v]=local(point);return u>8.69&&u<29.51&&v>36.48&&v<51.70;}};
})(YY);
