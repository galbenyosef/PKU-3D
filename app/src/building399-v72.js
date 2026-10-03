/* Independently registered east gable between humanities buildings 4 and 2.
 * Two window levels and curved gable roof are photographic; dimensions are fitted.
 * Unseen elevations remain plain; ground opening is not asserted to be an entrance. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,F=Y.Footprints,G=Y.Geo,ID='way/1075644753';
const O=[164.684,-390.020],R=Math.atan2(2.764,23.392),C=Math.cos(R),S=Math.sin(R),W=Math.hypot(23.392,2.764),D=1.375*S+11.537*C;
const H={wall:7.45,eave:7.6,ridge:11.25},colors={brick:'#858783',roof:'#60625c',tile:'#797c73',trim:'#aaa89c'};
const world=(u,v)=>[O[0]+u*C+v*S,O[1]-u*S+v*C],local=p=>[(p[0]-O[0])*C-(p[1]-O[1])*S,(p[0]-O[0])*S+(p[1]-O[1])*C];
// The independent source footprint has space for a modest eave on both sides.
const z0=-.32,z1=D+.32,zm=D/2;
function roofY(v){const span=v<zm?zm-z0:z1-zm,t=Math.max(0,Math.min(1,1-Math.abs(v-zm)/span));return H.eave-.30+(H.ridge-H.eave+.30)*Math.pow(t,1.33)+.30*Math.pow(1-t,8);}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const ring=F.polygons(f.geometry)[0][0],r=ring.slice(0,4).map(local),p=(u,y,v)=>{const q=world(u,v);return[q[0],y,q[1]];};
 // Split the source east wall around its two photographed openings.
 const walls=new G.Geometry(),holes=[{lo:.35,hi:2.70,w:1.72},{lo:4.90,hi:6.25,w:1.65}];
 for(const [i,a]of r.entries()){
  const c=r[(i+1)%r.length];if(i!==2){walls.quad(p(a[0],H.wall,a[1]),p(c[0],H.wall,c[1]),p(c[0],0,c[1]),p(a[0],0,a[1]));continue;}
  const cuts=[0,...holes.flatMap(q=>[q.lo,q.hi]),H.wall].sort((a,b)=>a-b);
  const at=(t,y)=>p(a[0]+(c[0]-a[0])*t,y,a[1]+(c[1]-a[1])*t);
  const strip=(lo,hi,t0,t1)=>walls.quad(at(t0,hi),at(t1,hi),at(t1,lo),at(t0,lo));
  for(let j=1;j<cuts.length;j++){const lo=cuts[j-1],hi=cuts[j],q=holes.find(q=>q.lo<=lo&&q.hi>=hi);if(!q)strip(lo,hi,0,1);else{strip(lo,hi,0,.5-q.w/(2*D));strip(lo,hi,.5+q.w/(2*D),1);}}
 }
 add('399-source-brick-walls',walls,colors.brick,18,id);
 // Close the shallow masonry strip beneath each long eave without adding a storey.
 const eaveWalls=new G.Geometry();for(const [a,c]of [[r[1],r[2]],[r[3],r[0]]])eaveWalls.quad(p(a[0],roofY(a[1]),a[1]),p(c[0],roofY(c[1]),c[1]),p(c[0],H.wall,c[1]),p(a[0],H.wall,a[1]));
 add('399-eave-wall-closure',eaveWalls,colors.brick,18,id);
 // Each gable follows the original short edge, including the slight mapped skew.
 for(const [name,a,c]of [['west',r[0],r[1]],['east',r[3],r[2]]]){
  const g=new G.Geometry();for(let j=0;j<40;j++){const t=j/40,tt=(j+1)/40,u=a[0]+(c[0]-a[0])*t,v=a[1]+(c[1]-a[1])*t,uu=a[0]+(c[0]-a[0])*tt,vv=a[1]+(c[1]-a[1])*tt;
   const pts=[p(u,H.wall,v),p(uu,H.wall,vv),p(uu,roofY(vv),vv),p(u,roofY(v),v)];g.quad(...(name==='west'?pts.reverse():pts));}
  add('399-'+name+'-brick-gable',g,colors.brick,18,id);
 }
 for(const [name,lo,hi]of [['north',z0,zm],['south',zm,z1]]){
  const q={name,axis:1,p:[[-.24,lo],[W+.25,lo],[W+.25,hi],[-.24,hi]],y:p=>roofY(p[1])},g=new G.Geometry();
  for(let j=0;j<40;j++){const v=lo+(hi-lo)*j/40,vv=lo+(hi-lo)*(j+1)/40;g.quad(p(-.24,roofY(v),v),p(-.24,roofY(vv),vv),p(W+.25,roofY(vv),vv),p(W+.25,roofY(v),v));}
  add('399-curved-roof-'+name,g,colors.roof,25,id);
  Y.RoofTiles.render(b,q,{origin:O,rotation:R,key:'399',color:colors.tile,eaveHigh:name==='south'});
 }
 b.local(O[0],0,O[1],R,()=>{
  const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'399-moulding-'+k,...args);};try{
   // East short elevation: one narrow opening on each storey; opaque shell cut above.
   for(const q of holes){
    b.box(W-.04,(q.lo+q.hi)/2,zm,.05,q.hi-q.lo,q.w,'#45534e',5);
    for(const v of[zm-q.w/2,zm,zm+q.w/2])b.box(W+.03,(q.lo+q.hi)/2,v,.17,q.hi-q.lo+.08,.075,'#733f32',6);
    if(q.lo<1){
     b.box(W+.03,2.05,zm,.17,.07,q.w+.08,'#733f32',6);
     for(const v of[zm-q.w/4,zm+q.w/4])b.box(W+.03,2.375,v,.15,.65,.045,'#733f32',6);
    }
    for(const y of[q.lo,q.hi])b.box(W+.03,y,zm,.17,.075,q.w+.08,'#733f32',6);
    b.box(W+.05,q.lo-.07,zm,.28,.10,q.w+.26,colors.trim,18);
   }
   // The stone belt stops at the lower opening, never crossing its glazing.
   const beltSpan=(D-holes[0].w)/2;
   for(const v of[beltSpan/2,D-beltSpan/2])b.box(W+.035,.62,v,.07,.075,beltSpan,colors.trim,18);
   // A shallow tiled eyebrow above the lower opening is visible in both east views.
   for(let j=0;j<11;j++)b.beam([W+.01,3.42,zm-1.25+j*.25],[W+.65,3.20,zm-1.25+j*.25],.15,colors.tile,25);
   b.box(W+.18,3.16,zm,.39,.15,2.58,'#733f32',6);
   b.box(W/2,H.ridge+.13,zm,W+.50,.22,.24,colors.tile,25);
   for(const x of [-.19,W+.20])for(let j=0;j<40;j++){
    const v=z0+(z1-z0)*j/40,vv=z0+(z1-z0)*(j+1)/40;
    b.beam([x,roofY(v)+.055,v],[x,roofY(vv)+.055,vv],.14,colors.trim,18);
    // Recessed, parallel brick bands are visible beneath both end roof lines.
    const faceX=x<0?-.025:W+.032;
    b.beam([faceX,roofY(v)-.33,v],[faceX,roofY(vv)-.33,vv],.065,colors.trim,18);
   }
  }finally{b.e.add=old;}
 });
 return{strategy:'building399-v72',sourceOutline:true,floors:2,storeysVerified:true,roof:'curved-gable',ridgeDirection:'east-west',dimensionFitted:true,entranceVerified:false,eastOpenings:2,occludedFacades:true,limits:'East gable and two opening levels registered to archived public panoramas; dimensions and colours fitted. Lower opening access function, unseen elevations and current condition remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building399={id:ID,render,world,local,heights:H,roofY,width:W,depth:D,northEave:z0,southEave:z1};
})(YY);
