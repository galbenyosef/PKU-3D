/* 400/82 courtyard: registered southern gate and finite wall segments only.
 * Load after building401-v76.js for its deterministic masonry packing helper.
 * Old T-shaped house remains unchanged; eastern room connection is unfinished. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1075644754';
const L=[-135.655,-295.085],R=[-121.7,-294.95],length=Math.hypot(R[0]-L[0],R[1]-L[1]),u=[(R[0]-L[0])/length,(R[1]-L[1])/length],angle=-Math.atan2(u[1],u[0]),gateAlong=(-127.95-L[0])/u[0],center=[L[0]+u[0]*gateAlong,L[1]+u[1]*gateAlong],scale=[.85,.88,.85];
const C={mortar:'#a5a699',stone:['#969181','#a39680','#b2a590','#8e968b'],brick:'#979b92',cap:'#b8b8a8',door:'#943d29',dark:'#594c37',roof:'#555c55',tile:'#747c71'};
function render(b,f,add){const retained=previous.call(A,b,f,add),oldId=b.id;b.id=f.properties.pickId;try{
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'400-'+name+'-'+k,...args)};try{fn()}finally{b.e.add=old}};
 const mesh=(name,g,c,mat=24)=>b.mesh('400-'+name,g,0,0,0,1,1,1,c,mat);
 const left=(-gateAlong-.06)/scale[0],right=(length-gateAlong)/scale[0];
 const emit=b.e.add,frame=Y.M.transform(b.world([center[0],0,center[1]]),[1,1,1],b.rotation+angle),fit=Y.M.multiply(Y.M.multiply(frame,Y.M.transform([0,0,0],scale,0)),Y.M.inverse(frame));
 b.e.add=function(k,g,m,...args){return emit.call(this,k,g,Y.M.multiply(fit,m),...args)};
 try{b.local(center[0],0,center[1],angle,()=>{
  // Wall fragments end at the two jambs. There is no hidden full-width shell.
  const spans=[[left,-1.17],[1.17,right]],stones=C.stone.map(()=>new G.Geometry());
  function stone(cell,seed,side){const poly=cell.poly,cx=poly.reduce((s,p)=>s+p[0],0)/poly.length,cy=poly.reduce((s,p)=>s+p[1],0)/poly.length,z0=side*.201,z1=side*(.202+cell.relief),g=stones[seed%4];
   for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length],aa=[a[0],a[1],z1],qq=[q[0],q[1],z1],p=[cx,cy,z1+side*.003];if(side>0)g.tri(p,aa,qq);else g.tri(p,qq,aa);
    const ps=[[a[0],a[1],z0],[q[0],q[1],z0],qq,aa];if(side<0)ps.reverse();g.quad(...ps);
   }
  }
  group('court-wall',()=>{for(const[a,c]of spans){b.box((a+c)/2,1.22,0,c-a,2.44,.40,C.mortar,24);b.box((a+c)/2,.15,0,c-a,.30,.43,C.brick,30);b.box((a+c)/2,2.46,0,c-a+.02,.16,.51,C.cap,24);}});
  let seed=0;for(let span=0;span<spans.length;span++){const[a,c]=spans[span];for(const cell of Y.Building401.rubbleCells(a+.015,c-.015,400+span*911)){for(const side of[-1,1])stone(cell,seed,side);seed++;}}
  stones.forEach((g,i)=>mesh('rubble-stones-'+i,g,C.stone[i],24));
  // Stone feet and grey brick jambs remain outside the 1.80m clear opening.
  group('jamb',()=>{for(const x of[-1.17,1.17]){b.box(x,.32,0,.54,.64,.68,C.cap,24);b.box(x,1.78,0,.54,2.92,.62,C.brick,30);}b.box(0,2.98,0,2.88,.26,.67,C.brick,30);});
  group('door-frame',()=>{for(const x of[-.87,.87])b.box(x,1.54,.10,.10,2.74,.19,C.door,38);b.box(0,2.89,.37,1.82,.16,.10,C.door,38);b.box(0,.20,.05,1.82,.08,.36,C.door,38);});
  // Closed solid leaves are separate from the wall; removing them exposes a
  // real jamb-to-jamb opening. No glass or dark painted substitute sits behind.
  // Two solid leaves with complementary rebated edges. The left leaf's rear
  // tongue covers the front reveal; the right leaf is relieved to receive it.
  // No third strip or wall backs the opening, and both pieces leave with the doors.
  group('closed-leaves',()=>{
   const profiles=[['left',[[-.834,-.005],[.03,-.005],[.03,.03],[-.008,.03],[-.008,.095],[-.834,.095]]],['right',[[.03,-.005],[.834,-.005],[.834,.095],[.008,.095],[.008,.031],[.03,.031]]]];
   for(const[name,profile]of profiles){const g=G.polygon(profile,2.8),bottom=G.polygon(profile,.24);for(let i=0;i<bottom.v.length;i+=24){const ps=[0,16,8].map(k=>bottom.v.slice(i+k,i+k+3));g.tri(...ps);}for(let i=0;i<profile.length;i++){const a=profile[i],q=profile[(i+1)%profile.length];g.quad([a[0],.24,a[1]],[a[0],2.8,a[1]],[q[0],2.8,q[1]],[q[0],.24,q[1]]);}b.mesh('rebated-'+name,g,0,0,0,1,1,1,C.door,38);}
  });
  group('door-hardware',()=>{for(const x of[-.18,.18]){b.box(x,1.68,.109,.085,.16,.028,C.dark,29);b.box(x,1.68,.135,.04,.04,.052,C.dark,29);b.mesh('ring',b.geo('400-ring',()=>G.torus(20,6)),x,1.61,.15,.066,.078,.052,C.dark,29);}});
  // Only the independently legible number is included on the small right-
  // jamb plaque; no invented institution name or long inscription.
  group('number-plate',()=>{b.box(1.17,2.34,.326,.245,.225,.020,'#c8b578',38);
   for(const y of[2.304,2.371])b.mesh('digit8-loop',b.geo('400-digit8-loop',()=>G.torus(20,6)),1.128,y,.341,.032,.035,.018,'#575644',38);
   const two=[[1.179,2.382],[1.188,2.398],[1.215,2.397],[1.227,2.383],[1.222,2.366],[1.181,2.292],[1.181,2.275],[1.229,2.275]];for(let i=1;i<two.length;i++)b.beam([two[i-1][0],two[i-1][1],.341],[two[i][0],two[i][1],.341],.012,'#575644',38);

  });
  // Photo-supported low forecourt platform and separate threshold, no stair flight.
  group('platform',()=>{b.box(0,.08,.53,2.35,.16,1.60,C.cap,24);for(const x of[-1.06,1.06])b.box(x,.46,.25,.18,.60,.48,C.cap,24);});
  group('red-eave-beam',()=>b.box(0,3.00,.36,2.36,.16,.16,C.door,38));
  // Eleven front-facing round red rafter ends are legible in 82-road.png.
  // Their short tails overlap the red beam; no unseen rear row is invented.
  const rafter=b.geo('400-round-rafter24',()=>{const g=G.cylinder(24,1);for(let i=0;i<g.v.length;i+=8){const z=g.v[i+2],nz=g.v[i+5];g.v[i+2]=g.v[i+1];g.v[i+1]=-z;g.v[i+5]=g.v[i+4];g.v[i+4]=-nz;}return g;});
  group('front-round-rafters',()=>{for(let i=0;i<11;i++)b.mesh('round-rafter',rafter,-1.075+i*.215,2.985,.28,.095,.095,.22,C.door,38);});
  // Small white under-eave disk lamp, with a mount penetrating the lintel.
  // Existing opaque materials only: it is not an emissive light source.
  group('eave-lamp',()=>{b.cyl(0,2.84,.42,.10,.05,'#c9c9bf',24,1,24);b.cyl(0,2.797,.42,.145,.05,'#e3e2d8',24,1,24);});

  const roof=new G.Geometry(),tiles=new G.Geometry(),ends=new G.Geometry(),xa=-1.60,xb=1.60,za=-.73,zb=.76,mid=(za+zb)/2,half=(zb-za)/2,eave=3.19;
  const y=(x,z)=>eave+.67*Math.pow(Math.max(0,1-Math.abs((z-mid)/half)),1.4)+.10*Math.pow(Math.abs(x/1.6),8)*Math.pow(Math.abs((z-mid)/half),2),p=(x,z,o=0)=>[x,y(x,z)+o,z];
  for(let side=0;side<2;side++)for(let j=0;j<18;j++)for(let i=0;i<32;i++){const a=xa+(xb-xa)*i/32,c=xa+(xb-xa)*(i+1)/32,v=za+half*side+half*j/18,w=v+half/18;roof.quad(p(a,v),p(a,w),p(c,w),p(c,v));}
  for(let x=xa+.028;x<xb-.035;x+=.10)for(let side=0;side<2;side++)for(let j=0;j<18;j++)for(let k=0;k<3;k++){const a=x+k*.011,c=a+.011,v=za+half*side+half*j/18,w=v+half/18,off=.012+Math.sin((k+.5)*Math.PI/3)*.022;tiles.quad(p(a,v,off),p(a,w,off),p(c,w,off),p(c,v,off));}
  for(const x of[xa,xb])for(let j=0;j<36;j++){const a=za+(zb-za)*j/36,c=za+(zb-za)*(j+1)/36,ps=[[x,eave-.18,a],[x,eave-.18,c],p(x,c),p(x,a)];if(x===xb)ps.reverse();ends.quad(...ps);}
  for(const z of[za,zb])for(let j=0;j<32;j++){const a=xa+(xb-xa)*j/32,c=xa+(xb-xa)*(j+1)/32,ps=[[a,eave-.18,z],[c,eave-.18,z],p(c,z),p(a,z)];if(z===za)ps.reverse();ends.quad(...ps);}
  mesh('gate-roof',roof,C.roof,19);tiles.detailWidth=.022;mesh('gate-tile-rolls',tiles,C.tile,19);mesh('gate-gable',ends,C.brick,30);
  group('cornice',()=>{b.box(0,3.08,0,3.12,.16,1.39,C.brick,30);b.box(0,3.185,0,3.14,.09,1.42,C.brick,30);b.box(0,3.90,mid,3.25,.105,.14,C.tile,19);});
  // Raised gable coping follows the photographed curved end silhouette.
  group('gable-coping',()=>{for(const x of[-1.57,1.57])for(let side=0;side<2;side++)for(let j=0;j<18;j++){const a=za+half*side+half*j/18,c=a+half/18;b.beam(p(x,a,.10),p(x,c,.10),.11,C.tile,19);}});
 });
 }finally{b.e.add=emit;}
}finally{b.id=oldId;}return{...retained,id:ID,detail:'math400-south-courtyard-gate101',gateCenter:center.slice(),gateMeasured:false,registrationAccuracy:'photo_fit_with_map_disagreement',triangulatedGateCenter:[-127.95494034559418,-294.76316537054424],gateCenterFitDelta:[center[0]+127.95494034559418,center[1]+294.76316537054424],gateHeight:4.03*scale[1],retainedHouseGeometry:true,eastWingUnresolved:true,eastWallTerminus:R.slice(),scope:'Registered 82 courtyard gate and finite south wall only; existing T house untouched, eastern wing and its junction remain incomplete.'};}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous.call(this,b,f,add)};Y.Math400Entry101={center,angle,endpoints:[L,R],length,gateAlong,scale};})(YY);
