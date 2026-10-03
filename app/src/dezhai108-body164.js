/* De Hall, pick108: single mapped N-S range, not a paired-L inside one wing.
 * Complete roof footprint is visible in the registered native aerial image.
 * Two floors are documented; east courtyard loggia, bays, colours and heights
 * remain type/proportion fits. No independently registered entrance is invented.
 * Rigid roof coordinates allow exact reuse of complete physical tile columns. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M,F=Y.Footprints;
const S={id:'way/240832219',pick:108,width:17.82458168,depth:53.25,base:.74,floor:5.17,eave:10.136,ridge:14.64,gallery:2.4,tileSpacing:.31,tileCourse:.36,tileSection:8,fit:true};
const O=[-260.802,-205.997],ROT=Math.atan2(.144,17.824),C={wall:'#dedcd1',stone:'#b1b3a7',red:'#904134',wood:'#614332',blue:'#365f75',green:'#4d7565',pale:'#b9c3ad',glass:'#56675f',roof:'#657068',tile:'#90958a'};
function world(p){const c=Math.cos(ROT),s=Math.sin(ROT);return[O[0]+p[0]*c+p[2]*s,p[1],O[1]-p[0]*s+p[2]*c];}
// Private RoofTiles variant: identical ceramic section and lips; split convex
// patches share explicit parent grid bounds and clip partial courses without
// restarting their phase or adding a lip on an artificial clipping edge.
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function ceramic(b,q,{origin:O,rotation:R,key,color,eaveHigh=false,offset=.13}){
 const axis=q.axis,localLo=Math.min(...q.p.map(p=>p[axis])),localHi=Math.max(...q.p.map(p=>p[axis])),lo=q.grid?.lo??localLo,hi=q.grid?.hi??localHi;
  const across=1-axis,localA=Math.min(...q.p.map(p=>p[across])),localC=Math.max(...q.p.map(p=>p[across])),a=q.grid?.a??localA,c=q.grid?.c??localC;
  const eave=eaveHigh?hi:lo,direction=eave===lo?1:-1;
  const courses=Math.ceil((hi-lo)/.36),course=(hi-lo)/courses,radius=.075;
  const height=t=>{const p=[0,0];p[axis]=t;return q.y(p);};
  const derivative=t=>(height(t+.0001)-height(t-.0001))/.0002;
  const roofPolygon={type:'Polygon',coordinates:[[...q.p,q.p[0]]]};
  const inRoof=p=>F.inside(p,roofPolygon)||q.p.some((a,i)=>F.distSegment(p,a,q.p[(i+1)%q.p.length])<1e-7);
  function column(s,clipped){const g=new G.Geometry();let rowStart,rowEnd;
   function patch(x0,x1,t0,t1,profile,normal){
    t0=Y.M.clamp(t0,localLo,localHi);t1=Y.M.clamp(t1,localLo,localHi);if(Math.abs(t1-t0)<1e-10)return;
    let poly=clipped?q.p:[[s+x0,t0],[s+x1,t0],[s+x1,t1],[s+x0,t1]].map(p=>axis===1?p:[p[1],p[0]]);
    if(clipped)for(const [ax,k,greater]of [[across,s+x0,true],[across,s+x1,false],[axis,Math.min(t0,t1),true],[axis,Math.max(t0,t1),false]])if(poly.length)poly=clip(poly,ax,k,greater);
    if(poly.length<3)return;
    // The course lip stands slightly proud downhill and tapers beneath the next tile.
    const point=p=>{const x=p[across]-s,t=p[axis],f=(t-rowStart)/(rowEnd-rowStart),v=[...p];return {p:axis===1?[x,height(t)+profile(x)+.008*(1-f),t]:[t,height(t)+profile(x)+.008*(1-f),x],n:normal(x,derivative(t)-.008/(rowEnd-rowStart))};};
    // Keep normals smooth across the curved section, including cropped hip edges.
    if(F.area([...poly,poly[0]])>0)poly.reverse();
    const v=poly.map(point);for(let i=1;i<v.length-1;i++)g.tri(v[0].p,v[i].p,v[i+1].p,undefined,[v[0].n,v[i].n,v[i+1].n]);
   }
   const norm=(dx,dt)=>Y.M.norm(axis===1?[-dx,1,-dt]:[-dt,1,-dx]);
   for(let j=0;j<courses;j++){
    const t0=eave+direction*j*course,t1=eave+direction*(j+1)*course;rowStart=t0;rowEnd=t1;
    for(let k=0;k<8;k++){
     const x0=-radius*Math.cos(k*Math.PI/8),x1=-radius*Math.cos((k+1)*Math.PI/8);
     const shape=x=>.016+Math.sqrt(Math.max(0,radius*radius-x*x));
     const normal=(x,dt)=>norm(-x/Math.sqrt(Math.max(.0000001,radius*radius-x*x)),dt);
     // Two longitudinal subdivisions retain the underlying curved roof profile.
     for(let h=0;h<2;h++)patch(x0,x1,t0+(t1-t0)*h/2,t0+(t1-t0)*(h+1)/2,shape,normal);
     // A real semicircular ceramic lip, rather than a painted line at the eave.
     const rim=[];for(const [r,ang]of [[radius,k*Math.PI/8],[radius,(k+1)*Math.PI/8],[radius-.013,(k+1)*Math.PI/8],[radius-.013,k*Math.PI/8]]){
      const x=-r*Math.cos(ang),p=axis===1?[s+x,t0]:[t0,s+x];rim.push({p,x,y:height(t0)+.024+r*Math.sin(ang)});
     }
     if(t0>=localLo-1e-9&&t0<=localHi+1e-9&&(!clipped||rim.every(v=>inRoof(v.p)))){
      const v=rim.map(v=>axis===1?[v.x,v.y,t0]:[t0,v.y,v.x]);g.quad(...((axis===1?direction>0:direction<0)?v:v.reverse()));
     }
    }
    // Shallow concave pan tiles carry runoff between the rounded cover tiles.
    for(let k=0;k<4;k++){
     const x0=radius+(.31-2*radius)*k/4,x1=radius+(.31-2*radius)*(k+1)/4;
     const shape=x=>.008+.008*Math.pow((x-.155)/.08,2),normal=(x,dt)=>norm(.016*(x-.155)/(.08*.08),dt);
     patch(x0,x1,t0,t1,shape,normal);
    }
   }
   // Ceramic shading uses metric surface coordinates; coherent unused UVs let
   // the lossless cache share identical vertices without changing any triangles.
   for(let i=0;i<g.v.length;i+=8){g.v[i+6]=g.v[i];g.v[i+7]=g.v[i+2];}
   return g;
  }
  const edgeTiles=new G.Geometry();let shared=null;
  b.local(O[0],0,O[1],R,()=>{
   for(let s=a+offset;s<c;s+=.31){
    if(s+.235<localA||s-.075>localC)continue;
    const full=[localLo,localHi].every(t=>[-radius,.31-radius].every(x=>{const p=axis===1?[s+x,t]:[t,s+x];return inRoof(p);}));
    if(full){if(!shared)shared=column(s,false);b.mesh(key+'-tile-column-'+q.name,shared,axis===1?s:0,0,axis===0?s:0,1,1,1,color,25);}
    else{const g=column(s,true);for(let i=0;i<g.v.length;i+=8){const v=g.v.slice(i,i+8);v[axis===1?0:2]+=s;edgeTiles.v.push(...v);}}
   }
   b.mesh(key+'-tile-hip-cuts-'+q.name,edgeTiles,0,0,0,1,1,1,color,25);
  });
}

function render(b,f){const previousState=[b.origin,b.rotation,b.id,b.anim];b.origin=[0,0,0];b.rotation=0;b.id=S.pick;b.anim=0;
try{
 const boxG=G.box(),mesh=(name,g,c,mat=24)=>b.mesh('dezhai108-body164-'+name,g,0,0,0,1,1,1,c,mat),box=(name,c,mat,x,y,z,w,h,d)=>b.mesh('dezhai108-body164-'+name,boxG,x,y,z,w,h,d,c,mat),beam=(name,c,a,d,r)=>{const axis=M.norm(M.sub(d,a)),side=M.norm(M.cross(axis,Math.abs(axis[2])>.95?[1,0,0]:[0,0,1])),up=M.cross(side,axis),T=new Float32Array([...M.mul(side,r),0,...M.mul(axis,Math.hypot(...M.sub(d,a))),0,...M.mul(up,r),0,...a,1]),root=M.transform(b.origin,[1,1,1],b.rotation);b.e.add('dezhai108-body164-'+name,G.cylinder(8,1),M.multiply(root,T),c,[20,S.pick,0,0]);};
 const W=S.width,D=S.depth,B=S.base,F=S.floor,E=S.eave,ring=f.geometry.coordinates[0].slice(0,-1);
 mesh('mapped-base-top',G.polygon(ring,B),C.stone,10);const base=new G.Geometry();for(let i=0;i<ring.length;i++){const a=ring[i],d=ring[(i+1)%ring.length];base.quad([a[0],0,a[1]],[d[0],0,d[1]],[d[0],B,d[1]],[a[0],B,a[1]]);}mesh('mapped-base-sides',base,C.stone,10);const bottom=G.polygon(ring,0);for(let i=0;i<bottom.v.length;i+=24){const a=bottom.v.slice(i,i+8);bottom.v.splice(i,8,...bottom.v.slice(i+16,i+24));bottom.v.splice(i+16,8,...a);for(const j of[0,8,16])for(let k=3;k<6;k++)bottom.v[i+j+k]*=-1;}mesh('mapped-base-bottom',bottom,C.stone,10);
 mesh('mapped-upper-floor',G.polygon(ring,F),C.stone,10);const under=G.polygon(ring,F-.24);for(let i=0;i<under.v.length;i+=24){const a=under.v.slice(i,i+8);under.v.splice(i,8,...under.v.slice(i+16,i+24));under.v.splice(i+16,8,...a);for(const j of[0,8,16])for(let k=3;k<6;k++)under.v[i+j+k]*=-1;}mesh('mapped-upper-floor-underside',under,C.stone,10);const floorEdge=new G.Geometry();floorEdge.v=base.v.slice();for(let i=1;i<floorEdge.v.length;i+=8)floorEdge.v[i]=F-.24+floorEdge.v[i]/B*.24;mesh('mapped-upper-floor-edge',floorEdge,C.stone,10);mesh('mapped-ceiling',G.polygon(ring,E-.12),C.wall,24);
 b.local(O[0],0,O[1],ROT,()=>{
 const west=-W/2+.25,east=W/2-S.gallery,south=-.28,north=-D+.25;
 function face(name,a,d,holes){const len=Math.hypot(d[0]-a[0],d[1]-a[1]),r=-Math.atan2(d[1]-a[1],d[0]-a[0]);b.local(a[0],0,a[1],r,()=>{
  const levels=[B,E,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>1e-8);
  for(let j=1;j<levels.length;j++){const lo=levels[j-1],hi=levels[j],qs=holes.filter(q=>q.lo<=lo&&q.hi>=hi).sort((a,b)=>a.x-b.x);let cur=0;const part=(a,d)=>{if(d>a)box(name+'-wall',C.wall,24,(a+d)/2,(lo+hi)/2,-.16,d-a,hi-lo,.32);};for(const q of qs){part(cur,q.x-q.w/2);cur=q.x+q.w/2;}part(cur,len);}
  for(const q of holes){const cy=(q.lo+q.hi)/2,h=q.hi-q.lo;box(name+'-glass',C.glass,28,q.x,cy,-.085,q.w,h,.045);for(const s of[-1,1])box('window-frame',C.red,20,q.x+s*q.w/2,cy,.03,.09,h+.09,.19);for(const y of[q.lo,q.hi,q.hi-.48])box('window-frame',C.red,20,q.x,y,.03,q.w,.08,.19);box('window-frame',C.red,20,q.x,cy,.04,.075,h,.16);
   for(const s of[-1,1])box('window-lattice',C.red,20,q.x+s*q.w*.29,cy,.10,.04,h*.68,.045);for(const y of[q.lo+.50,q.hi-.76])box('window-lattice',C.red,20,q.x,y,.10,q.w,.043,.045);box('window-sill',C.stone,10,q.x,q.lo-.07,.04,q.w+.18,.12,.30);
  }
 });}
 const windows=(L,n)=>[0,1].flatMap(l=>Array.from({length:n},(_,i)=>({x:(i+.5)*L/n,w:Math.min(2.20,L/n*.59),lo:1.42+l*4.16,hi:4.04+l*4.16})));
 face('west-fit',[west,north],[west,south],windows(south-north,9));face('east-fit',[east,south],[east,north],windows(south-north,9));face('south-unregistered',[west,south],[east,south],windows(east-west,3));face('north-fit',[east,north],[west,north],windows(east-west,3));
 // Existing courtyard-facing type is retained as an explicitly unverified fit;
 // no north staircase, false plaque or copied Caizhai door is emitted.
 const cx=W/2-.32,cz0=north+.10,cz1=south-.04,span=cz1-cz0,bays=10;
 box('east-gallery-floor',C.stone,10,(east+W/2)/2,F-.12,-D/2,W/2-east,.24,D);
 for(let i=0;i<=bays;i++){const z=cz0+i*span/bays;b.mesh('dezhai108-body164-column',G.cylinder(16,1),cx,B,z,.25,E-B,.25,C.red,20);b.mesh('dezhai108-body164-column-foot',G.cylinder(16,1),cx,B-.11,z,.37,.22,.37,C.stone,10);
  for(const y of[F-.27,E-.42]){box('column-cap',C.wood,20,cx,y-.29,z,.60,.20,.78);box('column-support',C.wood,20,cx,y-.49,z,.48,.31,.36);for(const s of[-1,1])beam('column-short-brace',C.wood,[cx,y-.77,z+s*.17],[cx,y-.28,z+s*.62],.10);}
 }
 for(const y of[F-.27,E-.42]){box('painted-beam',C.blue,20,cx,y,-D/2,.53,.53,D-.6);for(const s of[-1,1])box('painted-red-edge',C.red,20,cx+.285,y+s*.22,-D/2,.025,.055,D-.6);
  for(let i=0;i<bays;i++){const z=cz0+(i+.5)*span/bays,ww=span/bays-.60;box('painted-field',C.green,20,cx+.28,y,z,.035,.31,ww);for(const sy of[-1,1])box('painted-inner-line',C.pale,20,cx+.305,y+sy*.11,z,.025,.023,ww*.72);for(const sz of[-1,1])beam('painted-end-line',C.pale,[cx+.305,y-.11,z+sz*ww*.36],[cx+.305,y+.11,z+sz*ww*.30],.022);}
 }
 for(const y of[F+.28,F+1.02])box('gallery-rail',C.red,20,cx,y,-D/2,.14,.12,D-.6);for(let i=0;i<=40;i++)box('gallery-baluster',C.red,20,cx,F+.65,cz0+i*span/40,.075,.72,.075);
 for(let z=cz0+.18;z<cz1-.10;z+=.35)box('eave-rafter',C.wood,20,cx+.45,E-.13,z,1.32,.14,.09);for(const x of[cx+.32,cx+.82])box('eave-purlin',C.wood,20,x,E-.205,-D/2,.16,.13,D-.6);
 // Rigid, curved hip-and-gable roof. Main roof does not inherit map shear.
 const hx=W/2+.85,hz=D/2+.9,zc=-D/2,inset=3.7,breakT=.52,rise=S.ridge-E,y=t=>E+rise*Math.pow(M.clamp(t,0,1),1.42),edge=t=>hz-inset*Math.min(1,t/breakT),surf=new G.Geometry();
 const addQuad=(g,ps)=>{for(const ids of[[0,1,2],[0,2,3]]){const p=ids.map(i=>ps[i]);if(Math.hypot(...M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])))>1e-9)g.tri(...p,p.map(p=>[p[0],p[2]]));}};
 const patches=[];
 for(const side of[-1,1]){
  const q=(t,u)=>[side*hx*(1-t),y(t),zc+u*edge(t)];for(let j=0;j<24;j++)for(let i=0;i<60;i++){const ps=[q(j/24,-1+i/30),q(j/24,-1+(i+1)/30),q((j+1)/24,-1+(i+1)/30),q((j+1)/24,-1+i/30)];addQuad(surf,side>0?ps.reverse():ps);}
  // Split at the hip break: each clipped tile polygon is convex. A fan over
  // the unsplit six-corner region would invert a few tiny pan triangles.
  patches.push({name:'main-upper-'+side,axis:0,grid:{lo:side<0?-hx:0,hi:side>0?hx:0,a:zc-hz,c:zc+hz},p:[[0,zc-hz+inset],[side*hx*(1-breakT),zc-hz+inset],[side*hx*(1-breakT),zc+hz-inset],[0,zc+hz-inset]],y:p=>y(1-Math.abs(p[0])/hx),high:side>0});
  patches.push({name:'main-lower-'+side,axis:0,grid:{lo:side<0?-hx:0,hi:side>0?hx:0,a:zc-hz,c:zc+hz},p:[[side*hx*(1-breakT),zc-hz+inset],[side*hx,zc-hz],[side*hx,zc+hz],[side*hx*(1-breakT),zc+hz-inset]],y:p=>y(1-Math.abs(p[0])/hx),high:side>0});
  const endQ=(t,u)=>[u*hx*(1-t),y(t),zc+side*edge(t)];for(let j=0;j<14;j++)for(let i=0;i<32;i++){const ps=[endQ(j*breakT/14,-1+i/16),endQ(j*breakT/14,-1+(i+1)/16),endQ((j+1)*breakT/14,-1+(i+1)/16),endQ((j+1)*breakT/14,-1+i/16)];addQuad(surf,side<0?ps.reverse():ps);}
  patches.push({name:'hip-'+side,axis:1,p:[[-hx,zc+side*hz],[hx,zc+side*hz],[hx*(1-breakT),zc+side*(hz-inset)],[-hx*(1-breakT),zc+side*(hz-inset)]],y:p=>y((hz-Math.abs(p[1]-zc))*breakT/inset),high:side>0});
  const end=zc+side*(hz-inset),gable=new G.Geometry(),pp=[[-hx*(1-breakT),y(breakT),end],[hx*(1-breakT),y(breakT),end],[0,S.ridge,end]];gable.tri(...(side<0?pp.reverse():pp));mesh('gable-'+side,gable,C.red,20);
  for(const sx of[-1,1]){beam('gable-rake',C.tile,[sx*hx*(1-breakT),y(breakT),end],[0,S.ridge,end],.15);for(let j=0;j<14;j++){const a=j*breakT/14,d=(j+1)*breakT/14;beam('hip-ridge',C.tile,[sx*hx*(1-a),y(a)+.055,zc+side*edge(a)],[sx*hx*(1-d),y(d)+.055,zc+side*edge(d)],.18);}}
  beam('ridge-return',C.tile,[0,S.ridge,end],[0,S.ridge+.52,end+side*.30],.16);
 }
 mesh('roof-shell',surf,C.roof,2);box('ridge',C.tile,2,0,S.ridge+.10,zc,.30,.22,2*(hz-inset));box('roof-soffit',C.wood,20,0,E-.10,zc,2*hx,.08,2*hz);
 for(const s of[-1,1]){box('long-eave-fascia',C.wood,20,s*hx,E-.09,zc,.12,.19,2*hz);box('end-eave-fascia',C.wood,20,0,E-.09,zc+s*hz,2*hx,.19,.12);}
 // Shared complete columns + exact polygon-clipped hip fragments. The mature
 // generator preserves eight semicircle facets, real ceramic lips and pan tiles.
 for(const q of patches)ceramic(b,q,{origin:[0,0],rotation:0,key:'dezhai108-body164-ceramic',color:C.tile,eaveHigh:q.high});
 });
 return{id:S.id,strategy:'dezhai108-single-north-south-wing',floors:2,roofAxis:'north-south',entranceRegistered:false,eastGallery:'type-fit',measured:false};
}finally{[b.origin,b.rotation,b.id,b.anim]=previousState;}}
A.render=function(b,f,add){return f.properties.id===S.id&&f.properties.pickId===S.pick?render(b,f):prior.call(this,b,f,add);};Y.Dezhai108Body164={spec:S,world,origin:O,rotation:ROT,render};
})(YY);
