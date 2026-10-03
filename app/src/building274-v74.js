/* Langrunyuan 8: located panorama facade candidate; roof retained byte-for-byte.
 * Four storeys and asymmetric facades are observed; all metre dimensions fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/873446764';
const O=[133.742,-539.006],R=Math.atan2(5.118,35.392),C=Math.cos(R),S=Math.sin(R),W=Math.hypot(35.392,5.118),D=1.794*S+12.336*C;
const world=(u,v)=>[O[0]+u*C+v*S,O[1]-u*S+v*C],local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
const doors=[W*.22,W*.78],northWindows=[4.2,11.8,15.8,19.8,23.8,31.8],pilasters=[.18,2.0,6.2,9.6,13.8,17.8,21.8,25.9,29.6,33.7,W-.18];
const colors={wall:'#b3b5a3',frame:'#d0d3c6',stone:'#92968b',dark:'#535e54',glass:'#4d6560',balcony:'#936954'};
function render(b,f,add){
 const id=f.properties.pickId,retained=[];let original;const originalAdd=b.e.add;
 // The v46 predecessor supplies its exact four hip planes. Suppress ALL of
 // its old opaque shell, generic windows and belts before rebuilding openings.
 b.e.add=()=>{};try{original=previous(b,f,(k,g,c,m,pick)=>{if(/^077-roof-[0-3]$/.test(k))retained.push({k,g,c,m,pick});});}finally{b.e.add=originalAdd;}
 if(retained.length!==4)throw new Error('274 requires the existing building077 roof before this module');
 b.id=id;for(const q of retained)add(q.k,q.g,q.c,q.m,q.pick);
 const H=original.bodyHeight,fh=(H-.55)/4,ring=f.geometry.coordinates[0].slice(0,4).map(local),p=(x,y,z)=>{const q=world(x,z);return[q[0],y,q[1]];};
 const north=[],south=[],east=[];
 for(let floor=0;floor<4;floor++){
  const lo=.95+floor*fh,hi=lo+2.06;
  for(const x of northWindows)north.push({x,w:2.28,lo,hi,type:'window',floor});
  for(const x of doors)north.push(floor?{x,w:.92,lo:lo-.12,hi:hi-.15,type:'stair',floor}:{x,w:1.64,lo:.30,hi:2.86,type:'door',floor});
  // The concealed west end is deliberately plain; east windows are visible.
  east.push({x:D*.52,w:1.44,lo,hi:lo+1.90,type:'window',floor});
  for(const x of[4.2,25.0,31.8])if(!(floor===0&&Math.abs(x-doors[1])<1.8))south.push({x,w:2.12,lo,hi,type:'window',floor});
  if(floor===0){south.push({x:11.5,w:5.8,lo:1.00,hi:3.08,type:'gallery',floor},{x:18.2,w:6.6,lo:1.00,hi:3.08,type:'gallery',floor},{x:doors[1],w:1.40,lo:.30,hi:2.75,type:'door',floor});}
  else for(const x of[10.8,17.2])south.push({x,w:4.55,lo:.70+floor*fh,hi:3.02+floor*fh,type:'balcony',floor});
 }
 function wall(a,c,holes,key){const g=new G.Geometry(),len=Math.hypot(c[0]-a[0],c[1]-a[1]),ys=[0,H,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b),at=(u,y)=>p(a[0]+(c[0]-a[0])*u/len,y,a[1]+(c[1]-a[1])*u/len);
  for(let j=1;j<ys.length;j++){const lo=ys[j-1],hi=ys[j];if(hi-lo<1e-8)continue;const spans=holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).map(q=>[q.x-q.w/2,q.x+q.w/2]).sort((a,b)=>a[0]-b[0]);let cursor=0;for(const [x,xx]of[...spans,[len,len]]){if(x>cursor)g.quad(at(cursor,lo),at(x,lo),at(x,hi),at(cursor,hi));cursor=Math.max(cursor,xx);}}
  add('274-shell-'+key,g,colors.wall,24,id);
 }
 // Original clockwise source edges are kept, including millimetric skew.
 wall(ring[0],ring[1],[],'west');wall(ring[1],ring[2],south,'south');
 wall(ring[2],ring[3],east.map(q=>({...q,x:D-q.x})),'east');wall(ring[3],ring[0],north.map(q=>({...q,x:W-q.x})),'north');
 b.local(O[0],0,O[1],R,()=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'274-detail-'+k,...args);};try{
  b.box(W/2,.15,D/2,W,.30,D,colors.stone,24);
  // Only the shallow observed eave fascia is added; the existing roof is untouched.
  for(const z of[-.10,D+.10]){b.box(W/2,H-.16,z,W+.12,.24,.36,colors.frame,24);b.box(W/2,H-.035,z,W+.18,.055,.47,colors.dark,6);}
  for(const x of[.08,W-.08])b.box(x,H-.16,D/2,.30,.24,D,colors.frame,24);
  for(const z of[-.075,D+.075]){
   for(const x of pilasters)b.box(x,H/2,z,.24,H,.24,colors.frame,24);
   for(let floor=1;floor<4;floor++)b.box(W/2,.55+floor*fh-.16,z,W,.29,.25,colors.frame,24);
  }
  // On the blank west gable, restrained frame lines are photographed.
  for(const z of[.2,D*.5,D-.2])b.box(-.045,H/2,z,.16,H,.22,colors.frame,24);
  for(let floor=1;floor<4;floor++)b.box(-.07,.55+floor*fh-.16,D/2,.17,.26,D,colors.frame,24);
  function rectangularOpening(q,side){
   const z=side==='north'?.085:D-.085,front=side==='north'?-.055:D+.055,sg=side==='north'?-1:1,frame=q.type==='door'?colors.dark:colors.frame;
   b.box(q.x,(q.lo+q.hi)/2,z,q.w,q.hi-q.lo,.10,colors.glass,5);
   for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,(q.lo+q.hi)/2,front,.065,q.hi-q.lo+.08,.17,frame,6);
   for(const y of[q.lo,q.hi])b.box(q.x,y,front,q.w+.09,.075,.17,frame,6);
   // Actual side reveals close the depth between masonry and recessed glazing.
   for(const x of[q.x-q.w/2-.035,q.x+q.w/2+.035])b.box(x,(q.lo+q.hi)/2,z-sg*.01,.075,q.hi-q.lo,.19,colors.wall,24);
   b.box(q.x,q.lo-.075,front+sg*.035,q.w+.20,.09,.27,colors.frame,24);
   const cross=q.type==='door'?q.hi-.48:q.hi-.43;
   b.box(q.x,cross,front,q.w,.052,.10,frame,6);
   if(q.type!=='stair')b.box(q.x,(q.lo+cross)/2,front,.052,cross-q.lo,.10,frame,6);
  }
  for(const q of north)rectangularOpening(q,'north');
  for(const q of south.filter(q=>q.type==='window'||q.type==='door'))rectangularOpening(q,'south');
  for(const q of east){b.box(W-.085,(q.lo+q.hi)/2,q.x,.10,q.hi-q.lo,q.w,colors.glass,5);for(const z of[q.x-q.w/2,q.x,q.x+q.w/2])b.box(W+.04,(q.lo+q.hi)/2,z,.16,q.hi-q.lo,.06,colors.frame,6);for(const y of[q.lo,q.hi-.42,q.hi])b.box(W+.04,y,q.x,.16,.06,q.w+.10,colors.frame,6);}
  // Two northern flat porticoes are aligned to stair openings, not window bays.
  for(const x of doors){
   b.box(x,.15,-.71,3.28,.30,1.82,colors.stone,24);
   b.box(x,.075,-1.77,2.36,.15,.52,colors.stone,24);
   for(const dx of[-1.36,1.36])b.box(x+dx,1.67,-1.31,.25,2.74,.30,colors.wall,24);
   b.box(x,3.05,-.70,3.65,.24,2.08,colors.wall,24);
   b.box(x,3.19,-.70,3.76,.07,2.17,colors.frame,24);
  }
  // A secondary south opening is visible, but its access role is not established.
  b.box(doors[1],.15,D+.46,1.90,.30,1.02,colors.stone,24);b.box(doors[1],.075,D+1.11,1.90,.15,.42,colors.stone,24);
  for(const q of south.filter(q=>q.type==='gallery'||q.type==='balcony')){
   const ground=q.type==='gallery',depth=ground?.58:.42,face=D+depth,base=ground?0:q.lo-.12,sill=ground?1.00:q.lo+.53,top=q.hi;
   // Projecting bases and cheeks replace opaque source-wall coverage in this bay.
   if(ground)b.box(q.x,(base+sill)/2,D+depth/2,q.w,sill-base,depth,colors.wall,24);
   else{
    b.box(q.x,q.lo-.06,D+depth/2,q.w,.12,depth,colors.stone,24);
    for(const y of[q.lo+.07,q.lo+.46])b.box(q.x,y,face-.04,q.w,.14,.12,colors.balcony,24);
    const pitch=q.w/12;
    for(let k=0;k<=12;k++){const x=q.x-q.w/2+k*pitch;b.box(x,q.lo+.265,face-.04,.10,.25,.12,colors.balcony,24);b.box(x+.052,q.lo+.265,face+.023,.025,.25,.024,colors.frame,24);}
    for(const y of[q.lo+.145,q.lo+.385])b.box(q.x,y,face+.024,q.w,.022,.025,colors.frame,24);
    for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,(q.lo+sill)/2,D+depth/2,.10,sill-q.lo,depth,colors.balcony,24);
   }
   for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,(sill+top)/2,D+depth/2,.11,top-sill,depth,colors.wall,24);
   b.box(q.x,(sill+top)/2,face-.035,q.w-.12,top-sill,.06,colors.glass,5);
   b.box(q.x,sill,face+.025,q.w+.15,.12,.19,colors.frame,24);
   b.box(q.x,top+.025,D+depth/2,q.w+.18,.10,depth+.18,colors.dark,6);
   const count=ground?Math.round(q.w/.95):4,frame=ground&&q.x<15?'#777b61':colors.frame;
   for(let k=0;k<=count;k++)b.box(q.x-q.w/2+q.w*k/count,(sill+top)/2,face+.025,.045,top-sill,.09,frame,6);
   for(const y of[ground?top-.37:sill+(top-sill)*.58,top])b.box(q.x,y,face+.025,q.w,.045,.09,frame,6);
   // Visible cages are local alterations. No identical cage is repeated everywhere.
   if((ground&&q.x<15)||(!ground&&q.floor===1)){
    const cage=face+.20,lo=sill+.08,hi=top-.05,n=Math.round(q.w/.23);
    for(let k=0;k<=n;k++)b.box(q.x-q.w/2+.08+k*(q.w-.16)/n,(lo+hi)/2,cage,.025,hi-lo,.025,'#777e70',9);
    for(const y of[lo,lo+(hi-lo)*.48,hi])b.box(q.x,y,cage,q.w-.10,.027,.027,'#777e70',9);
    for(const x of[q.x-q.w/2+.08,q.x+q.w/2-.08])for(const y of[lo,hi])b.box(x,y,face+.10,.025,.025,.23,'#777e70',9);
   }
  }
 }finally{b.e.add=old;}});
 return{...original,strategy:'building274-v74',floors:4,storeysVerified:true,sourceOutline:true,roof:'hip-planar-edge-intersections',roofPreserved:true,dimensionFitted:true,northEntrances:2,southOpening:true,limits:'Located historical panoramas establish north twin flat porticoes and south enclosed projecting windows. Metres, bay positions, colour and altered window divisions are fitted; hidden facades and current state remain unverified. Existing satellite-supported hip roof retained.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building274={id:ID,render,world,local,width:W,depth:D,doors,northWindows,pilasters};
})(YY);
