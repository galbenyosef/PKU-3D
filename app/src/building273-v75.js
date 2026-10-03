/* Langrunyuan 9: located panorama facade candidate; roof retained byte-for-byte.
 * Four storeys and asymmetric facades are observed; all metre dimensions fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/873446763';
const O=[129.318,-573.038],R=Math.atan2(5.119,35.392),C=Math.cos(R),S=Math.sin(R),W=Math.hypot(35.392,5.119),D=1.794*S+12.336*C;
const world=(u,v)=>[O[0]+u*C+v*S,O[1]-u*S+v*C],local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
const doors=[7.55,27.05],southDoors=[8.05,27.30],northWindows=[3.65,11.45,15.55,19.70,23.20,31.75],pilasters=[.20,1.75,5.55,9.45,13.50,17.60,21.45,25.25,28.95,33.75,W-.20];
const colors={wall:'#afb09e',frame:'#c9cdbb',stone:'#92958a',dark:'#536355',glass:'#516962',balcony:'#949a85'};
function render(b,f,add){
 const id=f.properties.pickId,retained=[];let original;const originalAdd=b.e.add;
 // The v46 predecessor supplies its exact four hip planes. Suppress ALL of
 // its old opaque shell, generic windows and belts before rebuilding openings.
 b.e.add=()=>{};try{original=previous(b,f,(k,g,c,m,pick)=>{if(/^076-roof-[0-3]$/.test(k))retained.push({k,g,c,m,pick});});}finally{b.e.add=originalAdd;}
 if(retained.length!==4)throw new Error('273 requires the existing building076 roof before this module');
 b.id=id;for(const q of retained)add(q.k,q.g,q.c,q.m,q.pick);
 const H=original.bodyHeight,fh=(H-.55)/4,ring=f.geometry.coordinates[0].slice(0,4).map(local),p=(x,y,z)=>{const q=world(x,z);return[q[0],y,q[1]];};
 const north=[],south=[],west=[];
 for(let floor=0;floor<4;floor++){
  const lo=.95+floor*fh,hi=lo+2.06;
  for(const x of northWindows)north.push({x,w:2.28,lo,hi,type:'window',floor});
  for(const x of doors)north.push(floor?{x,w:1.00,lo:lo-.08,hi:hi-.12,type:'stair',floor}:{x,w:1.52,lo:.24,hi:2.50,type:x===doors[0]?'green-door':'unknown-door',floor});
  // One north-half west window stack is photographed; east wall remains cautious.
  west.push({x:D*.28,w:1.68,lo,hi:lo+1.94,type:'window',floor});
  for(const x of[6.10,11.40,23.55,31.60])south.push({x,w:x<7?1.72:1.92,lo,hi,type:'window',floor});
  if(floor===0){south.push({x:2.75,w:3.80,lo:.96,hi:3.02,type:'gallery',floor},{x:17.10,w:7.65,lo:.96,hi:3.02,type:'gallery',floor});for(let j=0;j<2;j++)south.push({x:southDoors[j],w:j?1.40:1.46,lo:.24,hi:2.74,type:j?'south-east-door':'open-door',floor});}
  else for(const x of[2.75,15.10,19.15])south.push({x,w:3.65,lo:.69+floor*fh,hi:3.0+floor*fh,type:'balcony',floor});
 }
 function wall(a,c,holes,key){const g=new G.Geometry(),len=Math.hypot(c[0]-a[0],c[1]-a[1]),ys=[0,H,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b),at=(u,y)=>p(a[0]+(c[0]-a[0])*u/len,y,a[1]+(c[1]-a[1])*u/len);
  for(let j=1;j<ys.length;j++){const lo=ys[j-1],hi=ys[j];if(hi-lo<1e-8)continue;const spans=holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).map(q=>[q.x-q.w/2,q.x+q.w/2]).sort((a,b)=>a[0]-b[0]);let cursor=0;for(const [x,xx]of[...spans,[len,len]]){if(x>cursor)g.quad(at(cursor,lo),at(x,lo),at(x,hi),at(cursor,hi));cursor=Math.max(cursor,xx);}}
  add('273-shell-'+key,g,colors.wall,24,id);
 }
 // Original clockwise source edges are kept, including millimetric skew.
 wall(ring[0],ring[1],west,'west');wall(ring[1],ring[2],south,'south');
 wall(ring[2],ring[3],[],'east');wall(ring[3],ring[0],north.map(q=>({...q,x:W-q.x})),'north');
 // The round west-wall 9 marker is directly photographed. No invented words.
 const badge=new G.Geometry(),rim=new G.Geometry(),glyph=new G.Geometry(),mount=new G.Geometry(),badgeZ=D*.76,badgeY=5.60;
 const badgeP=(u,y,x=-.040)=>p(x,badgeY+y,badgeZ+u);
 for(let j=0;j<48;j++){const a=j/48*Math.PI*2,c=(j+1)/48*Math.PI*2;badge.tri(badgeP(0,0),badgeP(.235*Math.cos(a),.235*Math.sin(a)),badgeP(.235*Math.cos(c),.235*Math.sin(c)));rim.quad(badgeP(.255*Math.cos(a),.255*Math.sin(a),-.043),badgeP(.255*Math.cos(c),.255*Math.sin(c),-.043),badgeP(.230*Math.cos(c),.230*Math.sin(c),-.043),badgeP(.230*Math.cos(a),.230*Math.sin(a),-.043));}
 for(let j=0;j<48;j++){const a=j/48*Math.PI*2,c=(j+1)/48*Math.PI*2;mount.quad(badgeP(.255*Math.cos(a),.255*Math.sin(a),.02),badgeP(.255*Math.cos(c),.255*Math.sin(c),.02),badgeP(.255*Math.cos(c),.255*Math.sin(c),-.04),badgeP(.255*Math.cos(a),.255*Math.sin(a),-.04));}
 add('273-west-number-mount',mount,'#454d42',24,id);
 function stroke(a,c,w){const dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy),nx=-dy/l*w/2,ny=dx/l*w/2;glyph.quad(...[[a[0]-nx,a[1]-ny],[c[0]-nx,c[1]-ny],[c[0]+nx,c[1]+ny],[a[0]+nx,a[1]+ny]].map(q=>badgeP(q[0],q[1],-.047)));}
 for(let j=0;j<32;j++){const a=j/32*Math.PI*2,c=(j+1)/32*Math.PI*2;stroke([.073*Math.cos(a),.060+.082*Math.sin(a)],[.073*Math.cos(c),.060+.082*Math.sin(c)],.028);}stroke([.072,.055],[.065,-.10],.030);stroke([.065,-.10],[-.015,-.13],.030);
 add('273-west-number-disc',badge,'#dedfd1',24,id);add('273-west-number-rim',rim,'#454d42',24,id);add('273-west-number-glyph',glyph,'#384336',24,id);
 b.local(O[0],0,O[1],R,()=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'273-detail-'+k,...args);};try{
  b.box(W/2,.12,D/2,W,.24,D,colors.stone,24);
  // Only the shallow observed eave fascia is added; the existing roof is untouched.
  for(const z of[-.10,D+.10]){b.box(W/2,H-.16,z,W+.12,.24,.36,colors.frame,24);b.box(W/2,H-.035,z,W+.18,.055,.47,colors.dark,6);}
  for(const x of[.08,W-.08])b.box(x,H-.16,D/2,.30,.24,D,colors.frame,24);
  for(const z of[-.075,D+.075]){
   for(const x of(z<0?pilasters:[.20,4.90,7.10,9.25,13.15,17.13,21.18,25.10,29.20,33.80,W-.20]))b.box(x,H/2,z,.24,H,.24,colors.frame,24);
   for(let floor=1;floor<4;floor++)b.box(W/2,.55+floor*fh-.16,z,W,.29,.25,colors.frame,24);
  }
  // On the blank west gable, restrained frame lines are photographed.
  for(const z of[.2,D*.5,D-.2])b.box(-.045,H/2,z,.16,H,.22,colors.frame,24);
  for(let floor=1;floor<4;floor++)b.box(-.07,.55+floor*fh-.16,D/2,.17,.26,D,colors.frame,24);
  function rectangularOpening(q,side){
   const z=side==='north'?.12:D-.12,front=side==='north'?-.055:D+.055,sg=side==='north'?-1:1,isDoor=q.type.includes('door'),frame=isDoor?colors.dark:colors.frame;
   if(!isDoor)b.box(q.x,(q.lo+q.hi)/2,z,q.w,q.hi-q.lo,.10,colors.glass,5);
   else if(q.type==='open-door'){
    // The historical south-west door is open: no leaf or glazing closes it.
    b.box(q.x,(q.lo+q.hi)/2,D-1.40,q.w,q.hi-q.lo,.08,'#263029',24);
    for(const x of[q.x-q.w/2-.055,q.x+q.w/2+.055])b.box(x,(q.lo+q.hi)/2,D-.65,.11,q.hi-q.lo,1.30,colors.wall,24);
    b.box(q.x,q.hi+.035,D-.65,q.w+.10,.07,1.30,colors.wall,24);
   }else b.mesh(q.type,G.box(),q.x,(q.lo+q.hi)/2,z,q.w,q.hi-q.lo,.08,q.type==='green-door'?'#3e5946':'#46534a',q.type==='green-door'?37:6);

   for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,(q.lo+q.hi)/2,front,.065,q.hi-q.lo+.08,.17,frame,q.type==='green-door'?37:isDoor?6:29);
   for(const y of[isDoor?q.lo-.04:q.lo,q.hi])b.box(q.x,y,front,q.w+.09,.075,.17,frame,q.type==='green-door'?37:isDoor?6:29);
   // Actual side reveals close the depth between masonry and recessed glazing.
   for(const x of[q.x-q.w/2-.035,q.x+q.w/2+.035])b.box(x,(q.lo+q.hi)/2,z-sg*.01,.075,q.hi-q.lo,.19,colors.wall,24);
   b.box(q.x,q.lo-.075,front+sg*.035,q.w+.20,.09,.27,colors.frame,24);
   if(!isDoor){const cross=q.hi-.42;b.box(q.x,cross,front,q.w,.05,.10,frame,q.type==='green-door'?37:isDoor?6:29);if(q.type!=='stair')b.box(q.x,(q.lo+cross)/2,front,.05,cross-q.lo,.10,frame,q.type==='green-door'?37:isDoor?6:29);}
   if(q.type==='green-door'){
    b.box(q.x,1.34,.066,.044,2.10,.035,'#2f4434',37);
    for(const y of[.55,.70,1.44,2.22])b.box(q.x,y,.066,q.w-.14,.035,.035,'#647353',37);
    for(const dx of[-.56,-.29,.29,.56])b.box(q.x+dx,1.46,.066,.025,1.50,.035,'#586d51',37);
    b.box(q.x,.405,.066,q.w-.10,.24,.035,'#35503d',37);
    b.box(q.x,3.04,-.025,.31,.14,.025,'#6d7663',24);
   }

  }
  for(const q of north)rectangularOpening(q,'north');
  for(const q of south.filter(q=>q.type==='window'||q.type.includes('door')))rectangularOpening(q,'south');
  for(const q of west){b.box(.10,(q.lo+q.hi)/2,q.x,.10,q.hi-q.lo,q.w,colors.glass,5);for(const z of[q.x-q.w/2,q.x,q.x+q.w/2])b.box(-.055,(q.lo+q.hi)/2,z,.16,q.hi-q.lo,.06,colors.frame,29);for(const y of[q.lo,q.hi-.40,q.hi])b.box(-.055,y,q.x,.16,.06,q.w+.10,colors.frame,29);
   if(q.floor<2){const n=q.floor?9:8;for(let k=0;k<=n;k++)b.box(-.22,(q.lo+q.hi)/2,q.x-q.w/2+.06+k*(q.w-.12)/n,.025,q.hi-q.lo,.025,colors.frame,9);for(const y of[q.lo,q.hi])b.box(-.22,y,q.x,.025,.028,q.w,colors.frame,9);}
  }
  // The photographed 9号 west portico has broad piers, a taller headspace,
  // and a low landing; its dimensions are independently fitted from its own view.
  for(const x of doors){
   b.box(x,.12,-.86,3.42,.24,2.10,colors.stone,24);b.box(x,.06,-2.00,2.25,.12,.44,colors.stone,24);
   for(const dx of[-1.45,1.45])b.box(x+dx,1.84,-1.53,.43,3.20,.48,colors.wall,24);
   b.box(x,3.46,-.88,3.88,.28,2.34,colors.wall,24);b.box(x,3.63,-.88,3.99,.065,2.44,colors.frame,24);
  }
  for(const x of southDoors){b.box(x,.12,D+.35,1.82,.24,.84,colors.stone,24);b.box(x,.06,D+.91,1.82,.12,.34,colors.stone,24);}
  for(const q of south.filter(q=>q.type==='gallery'||q.type==='balcony')){
   const ground=q.type==='gallery',depth=ground?.46:.34,face=D+depth,base=ground?0:q.lo-.12,sill=ground?q.lo:q.lo+.53,top=q.hi;
   // Projecting bases and cheeks replace opaque source-wall coverage in this bay.
   if(ground)b.box(q.x,(base+sill)/2,D+depth/2,q.w,sill-base,depth,colors.wall,24);
   else{
    b.box(q.x,q.lo-.06,D+depth/2,q.w,.12,depth,colors.stone,24);
    // Stepped pale-edged slots match the visible continuous keyhole-like motif.
    // Front panel segments leave actual negative space, not painted rectangles.
    const n=10,pitch=q.w/n;
    for(const y of[q.lo+.045,q.lo+.485])b.box(q.x,y,face-.04,q.w,.09,.12,colors.balcony,24);
    for(let k=0;k<n;k++){const x=q.x-q.w/2+(k+.5)*pitch,slot=.17,head=.24;
     for(const side of[-1,1]){
      const wid=(pitch-slot)/2;b.box(x+side*(slot/2+wid/2),q.lo+.205,face-.04,wid,.23,.12,colors.balcony,24);
      const hw=(pitch-head)/2;b.box(x+side*(head/2+hw/2),q.lo+.375,face-.04,hw,.11,.12,colors.balcony,24);
      b.box(x+side*slot/2,q.lo+.205,face+.024,.024,.23,.025,colors.frame,24);
      b.box(x+side*head/2,q.lo+.375,face+.024,.024,.11,.025,colors.frame,24);
      b.box(x+side*(slot+head)/4,q.lo+.32,face+.024,(head-slot)/2,.025,.025,colors.frame,24);
     }
     for(const y of[q.lo+.09,q.lo+.43])b.box(x,y,face+.024,y<q.lo+.2?slot:head,.022,.025,colors.frame,24);
    }
    for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,(q.lo+sill)/2,D+depth/2,.10,sill-q.lo,depth,colors.balcony,24);
   }
   for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,(sill+top)/2,D+depth/2,.11,top-sill,depth,colors.wall,24);
   b.box(q.x,(sill+top)/2,face-.035,q.w-.12,top-sill,.06,colors.glass,5);
   b.box(q.x,sill,face+.025,q.w+.15,.12,.19,colors.frame,24);
   b.box(q.x,top+.025,D+depth/2,q.w+.18,.10,depth+.18,colors.dark,6);
   const count=ground?Math.round(q.w/.95):4,frame=colors.frame;
   for(let k=0;k<=count;k++)b.box(q.x-q.w/2+q.w*k/count,(sill+top)/2,face+.025,.045,top-sill,.09,frame,29);
   for(const y of[ground?top-.37:sill+(top-sill)*.58,top])b.box(q.x,y,face+.025,q.w,.045,.09,frame,29);
   // Visible cages are local alterations. No identical cage is repeated everywhere.
   if((ground&&q.x<5)||(!ground&&q.floor===1&&q.x<5)){
    const cage=face+.20,lo=sill+.08,hi=top-.05,n=Math.round(q.w/.23);
    for(let k=0;k<=n;k++)b.box(q.x-q.w/2+.08+k*(q.w-.16)/n,(lo+hi)/2,cage,.025,hi-lo,.025,'#777e70',9);
    for(const y of[lo,lo+(hi-lo)*.48,hi])b.box(q.x,y,cage,q.w-.10,.027,.027,'#777e70',9);
    for(const x of[q.x-q.w/2+.08,q.x+q.w/2-.08])for(const y of[lo,hi])b.box(x,y,face+.10,.025,.025,.23,'#777e70',9);
   }
  }
 }finally{b.e.add=old;}});
 return{...original,strategy:'building273-v75',floors:4,storeysVerified:true,sourceOutline:true,roof:'hip-planar-edge-intersections',roofPreserved:true,dimensionFitted:true,northEntrances:2,southEntrances:2,historicalAppearance:true,southWestOpen:true,limits:'Pre-renovation historical panoramas establish north porticoes, west green door, two south openings and stepped balcony apertures. Metres, bay positions and divisions fitted; east wall and current condition unverified. The 2020 project covered selected apartments; no whole-building reconstruction claim. Existing hip roof retained.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building273={id:ID,render,world,local,width:W,depth:D,doors,southDoors,northWindows,pilasters};
})(YY);
