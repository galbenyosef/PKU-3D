/* Historical 2013 west entrance candidate. Not a whole-building reconstruction:
 * the low northeast/east wing is known to differ from the inherited solid.
 * Preserve the mapped outline and unresolved wing split pending roof registration. */
(function(Y){'use strict';
const A=Y.Architecture30,F=Y.Footprints,G=Y.Geo,prior=A.render,ID='relation/14320159';
const P=[303.491,-617.396],Q=[293.345,-675.756],L=Math.hypot(Q[0]-P[0],Q[1]-P[1]),U=[(Q[0]-P[0])/L,(Q[1]-P[1])/L],N=[U[1],-U[0]],R=Math.atan2(N[0],N[1]);
const E={along:10.8,width:4.4,threshold:.72,head:3.12,depth:.42,frame:.62,landing:1.50,steps:6,tread:.30};
const point=(s,y,d=0)=>[P[0]+U[0]*s+N[0]*d,y,P[1]+U[1]*s+N[1]*d];
const onWest=(x,z)=>F.distSegment([x,z],P,Q)<.001;
function render(b,f,add){
 const lo=E.along-E.width/2,hi=E.along+E.width/2,id=f.properties.pickId;
 const wall=new G.Geometry(),panel=(a,c,y0,y1)=>{if(c>a&&y1>y0)wall.quad(point(c,y0),point(a,y0),point(a,y1),point(c,y1));};
 panel(0,lo,.30,f.properties.height);panel(hi,L,.30,f.properties.height);panel(lo,hi,.30,E.threshold);panel(lo,hi,E.head,f.properties.height);
 const replace=(key,g,color,mat,pick)=>{
  if(key.startsWith('v30-walls-22-')){const kept=new G.Geometry();for(let i=0;i<g.v.length;i+=24)if(![0,8,16].every(j=>onWest(g.v[i+j],g.v[i+j+2])))kept.v.push(...g.v.slice(i,i+24));add(key,kept,color,mat,pick);add('22-west-wall-aperture',wall,'#656967',18,id);}
  else add(key,g,color,mat,pick);
 };
 A.footprint(b,f,replace,{key:'west-entry-candidate',renderFacade(builder,e,s){
  if(!onWest(e.a[0],e.a[1])||!onWest(e.c[0],e.c[1]))return false;
  for(let floor=0;floor<s.floors;floor++)for(let k=0;k<s.count;k++){
   const t=(k+.5)*s.stride,x=e.a[0]+e.ux*t,z=e.a[1]+e.uz*t,along=(x-P[0])*U[0]+(z-P[1])*U[1];
   // Drop each entire original window group intersecting the stone portal.
   if(floor===0&&along+s.ww/2>lo-E.frame&&along-s.ww/2<hi+E.frame)continue;
   builder.window(x+e.nx*.045,.55+s.fh*(floor+.52),z+e.nz*.045,s.ww,Math.min(2.65,s.fh*.63),s.r,'#b8bcb8');
  }return true;
 }});
 const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'22-west-entry-'+k,...args);};b.id=id;
 try{const c=point(E.along,0);b.local(c[0],0,c[2],R,()=>{
  const w=E.width,h=E.head-E.threshold,y=(E.head+E.threshold)/2;
  // Side and head reveals terminate at a recessed glass door plane; no wall behind it.
  for(const x of[-w/2,w/2])b.box(x,y,-E.depth/2,.10,h,E.depth,'#929691',24);
  b.box(0,E.head,-E.depth/2,w,.10,E.depth,'#929691',24);
  b.box(0,y-.02,-E.depth,w-.14,h-.04,.045,'#3d5255',28);
  for(const x of[-w/2+.08,-w*.25,0,w*.25,w/2-.08])b.box(x,y,-E.depth+.045,.065,h-.10,.07,'#b9c0bd',29);
  for(const yy of[E.threshold+.07,E.head-.07,E.head-.54])b.box(0,yy,-E.depth+.045,w-.16,.065,.07,'#b9c0bd',29);
  for(const x of[-(w+E.frame)/2,(w+E.frame)/2])b.box(x,(E.threshold+E.head+.46)/2,.12,E.frame,E.head+.46-E.threshold,.34,'#92948d',24);
  b.box(0,E.head+.23,.12,w,.46,.34,'#92948d',24);
  b.box(0,E.threshold/2,E.landing/2,w+E.frame*2,E.threshold,E.landing,'#777c79',10);
  // Continue the existing fitted landing level through the recessed doorway.
  // Its rear reaches the glass; its front only meets the landing, with no
  // duplicate top surface. This closes a model gap, not a surveyed elevation.
  const sillDepth=E.depth+.025;
  b.mesh('threshold117',b.geo('box',G.box),0,E.threshold/2,-sillDepth/2,w-.10,E.threshold,sillDepth,'#777c79',10);
  for(let j=0;j<E.steps;j++){const top=E.threshold*(1-(j+1)/E.steps);if(top>0)b.box(0,top/2,E.landing+(j+.5)*E.tread,w+E.frame*2,top,E.tread,'#888c87',10);}
  // Only the photographed south/right edge is guarded. Do not infer a left
  // railing or a wheelchair ramp from the occluded side circulation.
  const rx=w/2+E.frame-.10,rail=.86,front=E.landing+(E.steps-1)*E.tread;
  const railPoints=[[rx,E.threshold+rail,.18],[rx,E.threshold+rail,E.landing],[rx,E.threshold/E.steps+rail,front]];
  for(let j=1;j<railPoints.length;j++)b.beam(railPoints[j-1],railPoints[j],.045,'#aab1b0',29);
  for(const z of[.18,E.landing,front]){const ground=z<=E.landing?E.threshold:E.threshold/E.steps;b.beam([rx,ground,z],[rx,ground+rail,z],.042,'#9ca5a3',29);}
  b.beam([rx,E.threshold+.44,.18],[rx,E.threshold+.44,E.landing],.025,'#aab1b0',29);
  b.beam([rx,E.threshold+.44,E.landing],[rx,E.threshold/E.steps+.44,front],.025,'#aab1b0',29);
  // Six equal risers meet original terrain; the final tread is grade itself.
 });}finally{b.e.add=old;}
 return {strategy:'northeast22-west-entry-candidate',historicReference:2013,wholeBuildingComplete:false,eastLowWingUnresolved:true,dimensionsMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):prior(b,f,add);};
Y.Northeast22={id:ID,render,E,P,Q,U,N,point};
})(YY);
