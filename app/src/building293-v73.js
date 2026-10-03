/* Humanities building 4: two photographed storeys, east colonnade and low porch.
 * Metres are photo-proportion fits. West facade and inter-building links unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/939378516';
const O=[158.74,-424.407],R=Math.atan2(2.532,22.154),C=Math.cos(R),S=Math.sin(R),W=Math.hypot(22.154,2.532),D=3.86*S+33.421*C;
const H={wall:8.65,eave:9.05,ridge:14.05,finial:14.58,max:14.612},COL={brick:'#777a77',stone:'#aeaaa0',roof:'#5c615c',tile:'#777c74',red:'#8c3c30',wood:'#784c34',blue:'#304d67',green:'#38635a'};
const world=(u,v)=>[O[0]+u*C+v*S,O[1]-u*S+v*C],local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
const x0=-1.12,x1=W+1.12,mid=W/2,z0=-.28,z1=D+.28;
function roofY(x){const t=Math.max(0,Math.min(1,1-Math.abs(x-mid)/(mid-x0)));return H.eave-.45+(H.ridge-H.eave+.45)*Math.pow(t,1.5)+.45*Math.pow(1-t,8);}
function lift(x,z){const d=Math.max(0,Math.min(z-z0,z1-z)),a=Math.max(0,1-d/3);return .72*a*a*Math.pow(Math.abs((x-mid)/(mid-x0)),3);}
const surfaceY=(x,z)=>roofY(x)+lift(x,z);
const bays=6,start=3.05,end=D-3.05,span=(end-start)/bays,glassX=W-1.91,windowStart=start+span*3,skirtTop=1.28;
function render(b,f,add){const id=f.properties.pickId;b.id=id;const p=(x,y,z)=>{const q=world(x,z);return[q[0],y,q[1]];};
 const ring=F.polygons(f.geometry)[0][0].slice(0,4).map(local),walls=new G.Geometry();
 for(let i=0;i<4;i++){const a=ring[i],c=ring[(i+1)%4];if(i===2)continue;walls.quad(p(a[0],0,a[1]),p(c[0],0,c[1]),p(c[0],H.wall,c[1]),p(a[0],H.wall,a[1]));}
 // East shell has genuine empty gallery openings; masonry survives only at ends.
 for(const [a,c]of[[0,start],[end,D]])walls.quad(p(W,0,c),p(W,0,a),p(W,H.wall,a),p(W,H.wall,c));
 add('293-source-brick-walls',walls,COL.brick,18,id);
 function roof(name,lo,hi,za,zb,height,color,tiles=true){
  const main=name.startsWith('main-'),heightAt=(x,z)=>height(x)+(main?lift(x,z):0),g=new G.Geometry(),nz=main?48:1;for(let k=0;k<nz;k++)for(let j=0;j<40;j++){const x=lo+(hi-lo)*j/40,xx=lo+(hi-lo)*(j+1)/40,z=za+(zb-za)*k/nz,zz=za+(zb-za)*(k+1)/nz;g.quad(p(x,heightAt(x,z),z),p(x,heightAt(x,zz),zz),p(xx,heightAt(xx,zz),zz),p(xx,heightAt(xx,z),z));}
  add('293-roof-'+name,g,color,25,id);
  const originalAdd=b.e.add;let columnIndex=0;
  if(main)b.e.add=function(key,geo,m,...args){const base=local([m[12],m[14]])[1],edge=key.includes('hip-cuts'),needs=edge||base<z0+3.4||base>z1-3.4;if(!needs)return originalAdd.call(this,key,geo,m,...args);const warped=new G.Geometry();warped.v=Array.from(geo.v);for(let i=0;i<warped.v.length;i+=8){const x=warped.v[i],z=warped.v[i+2]+base,dx=(lift(x+.0001,z)-lift(x-.0001,z))/.0002,dz=(lift(x,z+.0001)-lift(x,z-.0001))/.0002,n=Y.M.norm([warped.v[i+3]-warped.v[i+4]*dx,warped.v[i+4],warped.v[i+5]-warped.v[i+4]*dz]);warped.v[i+1]+=lift(x,z);for(let j=0;j<3;j++)warped.v[i+3+j]=n[j];}return originalAdd.call(this,key+'-swept-'+columnIndex++,warped,m,...args);};
  try{if(tiles)Y.RoofTiles.render(b,{name,axis:0,p:[[lo,za],[hi,za],[hi,zb],[lo,zb]],y:q=>height(q[0])},{origin:O,rotation:R,key:'293',color:COL.tile,eaveHigh:height(hi)<height(lo)});}finally{b.e.add=originalAdd;}
 }
 roof('main-west',x0,mid,z0,z1,roofY,COL.roof);roof('main-east',mid,x1,z0,z1,roofY,COL.roof);
 // Solid end infills follow exactly the same sampled curve as each roof half.
 for(const [name,z,reverse]of[['north',z0,false],['south',z1,true]]){
  const g=new G.Geometry();for(const [lo,hi]of[[x0,mid],[mid,x1]])for(let j=0;j<40;j++){const x=lo+(hi-lo)*j/40,xx=lo+(hi-lo)*(j+1)/40,pts=[p(x,8.55,z),p(xx,8.55,z),p(xx,surfaceY(xx,z),z),p(x,surfaceY(x,z),z)];g.quad(...(reverse?pts:pts.reverse()));}
  add('293-'+name+'-gable-closure',g,name==='south'?'#853e32':COL.brick,name==='south'?6:18,id);
 }
 const soffit=new G.Geometry();soffit.quad(p(x0,8.55,z0),p(x1,8.55,z0),p(x1,8.55,z1),p(x0,8.55,z1));add('293-roof-soffit',soffit,COL.wood,6,id);
 const fascia=new G.Geometry();for(const [x,rev]of[[x0,true],[x1,false]])for(let j=0;j<48;j++){const z=z0+(z1-z0)*j/48,zz=z0+(z1-z0)*(j+1)/48,q=[p(x,8.55,z),p(x,surfaceY(x,z),z),p(x,surfaceY(x,zz),zz),p(x,8.55,zz)];fascia.quad(...(rev?q.reverse():q));}add('293-eave-closure',fascia,COL.red,6,id);
 const porch={lo:W-.20,hi:W+3.35,za:4.0,zb:D-4.0};
 const stations=[porch.lo,porch.lo+(porch.hi-porch.lo)*.25,(porch.lo+porch.hi)/2,porch.lo+(porch.hi-porch.lo)*.75,porch.hi];
 const py=x=>{const j=Math.min(3,Math.max(0,Math.floor((x-porch.lo)/(porch.hi-porch.lo)*4))),a=stations[j],c=stations[j+1],t=Math.max(0,Math.min(1,(x-a)/(c-a))),rise=j%2?1-t:t;return 3.55+.95*Math.pow(rise,1.4)+.16*Math.pow(1-rise,8);};
 for(let j=0;j<4;j++)roof('porch-'+j,stations[j],stations[j+1],porch.za,porch.zb,py,COL.roof);
 for(const [name,z,rev]of[['north',porch.za,false],['south',porch.zb,true]]){const g=new G.Geometry();for(let k=0;k<4;k++){const lo=stations[k],hi=stations[k+1];for(let j=0;j<40;j++){const x=lo+(hi-lo)*j/40,xx=lo+(hi-lo)*(j+1)/40,q=[p(x,3.45,z),p(xx,3.45,z),p(xx,py(xx),z),p(x,py(x),z)];g.quad(...(rev?q:q.reverse()));}}add('293-porch-'+name+'-closure',g,COL.red,6,id);}

 // White wall-mounted building numeral, with no invented framed plaque.
 const numeral=new G.Geometry(),numberZ=D-1.32,numberY=5.75;
 function numberStroke(a,c,width){const dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy),nx=-dy/l*width/2,ny=dx/l*width/2;const q=[[a[0]-nx,a[1]-ny],[c[0]-nx,c[1]-ny],[c[0]+nx,c[1]+ny],[a[0]+nx,a[1]+ny]].map(t=>p(W+.035,numberY+t[1],numberZ-t[0]));numeral.quad(...q);}
 numberStroke([.085,-.24],[.085,.24],.050);numberStroke([-.15,-.06],[.17,-.06],.047);numberStroke([-.15,-.06],[.055,.24],.047);
 add('293-white-number-4',numeral,'#f1efe4',10,id);
 // Shallow painted geometry: observed nested blue/green frames and paired dots.
 const greenPaint=new G.Geometry(),palePaint=new G.Geometry(),goldPaint=new G.Geometry();
 function line2(g,a,c,width,point){const dx=c[0]-a[0],dy=c[1]-a[1],len=Math.hypot(dx,dy);if(len<1e-7)return;const nx=-dy/len*width/2,ny=dx/len*width/2;g.quad(...[[a[0]-nx,a[1]-ny],[c[0]-nx,c[1]-ny],[c[0]+nx,c[1]+ny],[a[0]+nx,a[1]+ny]].map(point));}
 for(let i=0;i<bays;i++){const z=start+(i+.5)*span,point=q=>p(W+.137,8.02+q[1],z-q[0]);
  for(const [g,w,h,thick]of[[greenPaint,span-.38,.61,.036],[palePaint,span-.62,.46,.022],[greenPaint,span-.79,.35,.021]]){const q=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];for(let j=0;j<4;j++)line2(g,q[j],q[(j+1)%4],thick,point);}
  for(const sign of[-1,1])for(const x of[span*.32,span*.40])for(const y of[-.10,.10]){const cx=x*sign,r=.030;for(let k=0;k<12;k++){const t=k/12*Math.PI*2,tt=(k+1)/12*Math.PI*2;goldPaint.tri(point([cx,y]),point([cx+r*Math.cos(t),y+r*Math.sin(t)]),point([cx+r*Math.cos(tt),y+r*Math.sin(tt)]));}}
  for(const scale of[1,.74])for(let k=0;k<48;k++){const t=k/48*Math.PI*2,tt=(k+1)/48*Math.PI*2;line2(goldPaint,[.54*scale*Math.cos(t),.13*scale*Math.sin(t)],[.54*scale*Math.cos(tt),.13*scale*Math.sin(tt)],.013,point);}
 }
 add('293-painted-green-frames',greenPaint,COL.green,6,id);add('293-painted-pale-frames',palePaint,'#668c85',6,id);add('293-painted-gold-dots',goldPaint,'#bdaa70',6,id);
 // South gable colour composition, fitted from the visible central cluster and curls;
 // this records the legible arrangement rather than claiming stroke-for-stroke copying.
 const scrolls=new G.Geometry(),gablePoint=q=>p(mid+q[0],q[1],z1+.035);
 function scrollPath(points,width=.042){for(let j=1;j<points.length;j++)line2(scrolls,points[j-1],points[j],width,gablePoint);}
 for(const scale of[1,.64])scrollPath(Array.from({length:145},(_,i)=>{const a=i/144*Math.PI*2,r=1+.16*Math.cos(8*a);return[1.10*scale*r*Math.cos(a),11.25+1.25*scale*r*Math.sin(a)];}),.038);
 for(const side of[-1,1])for(const [cx,cy,rx,ry]of[[2.05,11.0,.72,.92],[3.65,10.18,.77,.66],[5.30,9.45,.71,.46]]){
  scrollPath(Array.from({length:85},(_,i)=>{const t=i/84,a=-.6+t*Math.PI*3.4,r=1-.78*t;return[side*(cx+rx*r*Math.cos(a)),cy+ry*r*Math.sin(a)];}));
  scrollPath(Array.from({length:49},(_,i)=>{const t=i/48;return[side*(cx-.65+t*1.3),cy-.35-.28*Math.sin(t*Math.PI)];}),.035);
 }
 add('293-south-gable-gold-scrolls',scrolls,'#c3ad74',6,id);
 b.local(O[0],0,O[1],R,()=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'293-detail-'+k,...args);};try{
  // Platform and gallery slab stop inside this building's north/south boundaries.
  b.box(W/2,.23,D/2,W,.46,D,COL.stone,18);
  b.box(W-.99,4.18,D/2,2.22,.32,end-start,COL.stone,18);
  b.box(W+1.005,.27,D/2,4.85,.54,porch.zb-porch.za,COL.stone,18);
  for(let j=0;j<3;j++){const top=.44-j*.105;b.box(W+3.45+j*.30,top/2,D/2,.60,top,16,COL.stone,18);}
  for(let i=0;i<bays;i++){const z=start+(i+.5)*span;
   // The south observed window field has a solid lower section; the north
   // entrance-like field remains glazed to platform level. Bay boundaries are fitted.
   const windowField=z>windowStart,groundBottom=windowField?skirtTop+.07:.55;
   b.box(glassX,(groundBottom+3.30)/2,z,.10,3.30-groundBottom,span-.18,windowField?'#34443e':'#354a42',5);
   if(windowField){b.box(glassX+.025,(.54+skirtTop)/2,z,.17,skirtTop-.54,span,'#4a524e',18);b.box(glassX+.08,skirtTop+.035,z,.28,.07,span,'#a1a49a',18);}
   for(const y of[groundBottom,3.30])b.box(glassX+.09,y,z,.08,.055,span-.12,'#282e2b',6);
   // Sparse dark mullions model visible divisions, not verified operable leaves.
   for(const offset of[-.21,.22])b.box(glassX+.09,(groundBottom+3.30)/2,z+span*offset,.08,3.30-groundBottom,.045,'#282e2b',6);
   if(!windowField)b.box(glassX+.09,1.43,z,.08,.050,span-.12,'#282e2b',6);
   b.box(glassX,6.10,z,.10,2.70,span-.18,'#405853',5);
   for(const y of[4.75,7.45])b.box(glassX+.07,y,z,.13,.10,span-.12,COL.wood,6);
   b.box(glassX+.05,6.15,z,.13,.07,span-.12,COL.wood,6);
   b.box(W-.05,5.35,z,.12,.11,span-.30,COL.wood,6);b.box(W-.05,4.62,z,.12,.10,span-.30,COL.wood,6);
   for(let j=1;j<9;j++)b.box(W-.05,4.99,z-span/2+j*span/9,.085,.65,.065,COL.wood,6);
   b.box(W-.01,8.02,z,.20,.75,span-.20,COL.blue,6);

  }
  for(let i=0;i<=bays;i++){const z=start+i*span;b.cyl(W-.05,4.35,z,.15,3.95,COL.red,16,1,6);b.box(glassX+.08,6.10,z,.18,2.80,.14,COL.wood,6);b.box(glassX+.09,1.925,z,.08,2.75,.060,'#282e2b',6);}
  for(let i=0;i<5;i++){const z=porch.za+.5+i*(porch.zb-porch.za-1)/4;b.cyl(W+2.95,.55,z,.18,2.9,COL.red,16,1,6);b.box(W+2.95,.63,z,.47,.16,.47,COL.stone,18);}
  b.box(W+2.97,3.43,D/2,.25,.31,porch.zb-porch.za,COL.blue,6);
  b.box(W+3.34,3.61,D/2,.14,.16,porch.zb-porch.za,COL.red,6);
  b.box((porch.lo+porch.hi)/2,3.43,D/2,porch.hi-porch.lo,.08,porch.zb-porch.za,COL.wood,6);
  for(const x of[stations[1],stations[3]])b.box(x,4.58,D/2,.18,.16,porch.zb-porch.za+.10,COL.tile,25);
  b.box(mid,H.ridge+.12,D/2,.26,.24,z1-z0+.12,COL.tile,25);
  for(const z of[z0,z1]){
   for(const [lo,hi]of[[x0,mid],[mid,x1]])for(let j=0;j<40;j++){const x=lo+(hi-lo)*j/40,xx=lo+(hi-lo)*(j+1)/40;b.beam([x,surfaceY(x,z)+.04,z],[xx,surfaceY(xx,z)+.04,z],.14,COL.tile,25);}
   b.beam([mid,H.ridge+.16,z],[mid,H.finial,z+(z<0?-.10:.10)],.12,COL.tile,25);
  }

 }finally{b.e.add=old;}});
 return{strategy:'building293-v73',sourceOutline:true,floors:2,storeysVerified:true,roof:'curved-gable',ridgeDirection:'north-south',dimensionFitted:true,entranceVerified:true,limits:'East porch, red colonnade, recessed openings, south gable and two storeys registered to public panoramas. Height and dimensions fitted; west facade and connector ownership unverified; no connecting geometry added.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building293={id:ID,render,world,local,heights:H,roofY,surfaceY,lift,width:W,depth:D,x0,x1,z0,z1,glassX,start,end,span,bays,windowStart,skirtTop};
})(YY);
