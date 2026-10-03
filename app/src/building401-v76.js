/* 401: registered south courtyard gate and two photographed gable ends.
 * U footprint and unseen bays/materials remain; single-storey vertical fit and
 * two roof end caps replace the old approximations. East doorway unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1075644756';
const L=[-108.514,-294.264],R=[-95.302,-295.341],length=Math.hypot(R[0]-L[0],R[1]-L[1]),u=[(R[0]-L[0])/length,(R[1]-L[1])/length],angle=-Math.atan2(u[1],u[0]),gateAlong=(-100.6-L[0])/u[0],center=[L[0]+u[0]*gateAlong,L[1]+u[1]*gateAlong];
const C={mortar:'#a5a699',stone:['#969181','#a39680','#b2a590','#8e968b'],brick:'#979b92',cap:'#b8b8a8',door:'#943d29',dark:'#594c37',roof:'#555c55',tile:'#747c71'};
// A clipped, non-lattice planar Voronoi packing. Sites have unequal spacings;
// all polygons share the same partition before an 8mm mortar inset.
function rubbleCells(a,c,seed,bottom=.32,top=2.375){
 let state=seed>>>0;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296};
 const sites=[],count=Math.round((c-a)*(top-bottom)/.23);
 for(let tries=0;sites.length<count&&tries<count*100;tries++){const p=[a+random()*(c-a),bottom+random()*(top-bottom)];if(sites.every(q=>Math.hypot(p[0]-q[0],p[1]-q[1])>.24))sites.push(p);}
 function clip(poly,nx,ny,k){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],d=p[0]*nx+p[1]*ny-k,e=q[0]*nx+q[1]*ny-k;if(d<=1e-10)out.push(p);if((d<=0)!==(e<=0)){const t=d/(d-e);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out;}
 return sites.map((site,id)=>{let poly=[[a,bottom],[c,bottom],[c,top],[a,top]];for(const q of sites){if(q===site)continue;poly=clip(poly,q[0]-site[0],q[1]-site[1],(q[0]*q[0]+q[1]*q[1]-site[0]*site[0]-site[1]*site[1])/2);}
  let inset=poly;for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],nx=q[1]-p[1],ny=p[0]-q[0];inset=clip(inset,nx,ny,nx*p[0]+ny*p[1]-.008*Math.hypot(nx,ny));}
  return {id,poly:inset,relief:.014+random()*.014};
 }).filter(cell=>cell.poly.length>=3);
}
const BODY_SCALE=(3.2-.4)/(4.35-.4);
const SOUTH=[{name:'east',a:[-95.302,-295.341],c:[-90.844,-295.463],rise:1.55,depth:3.6},{name:'west',a:[-115.150,-294.075],c:[-108.514,-294.264],rise:2.05,depth:4.5}].map(f=>{const width=Math.hypot(f.c[0]-f.a[0],f.c[1]-f.a[1]),u=[(f.c[0]-f.a[0])/width,(f.c[1]-f.a[1])/width],n=[-u[1],u[0]],origin=[(f.a[0]+f.c[0])/2,(f.a[1]+f.c[1])/2];return{...f,width,u,n,origin,angle:-Math.atan2(u[1],u[0])};});
const coordinates=(f,p)=>{const x=p[0]-f.origin[0],z=p[2]-f.origin[1];return[x*f.u[0]+z*f.u[1],-(x*f.n[0]+z*f.n[1])];};
const endTop=(f,x)=>3.2+f.rise*Math.pow(Math.max(0,1-Math.abs(x)/(f.width/2)),1.38)+.065*Math.pow(Math.min(1,Math.abs(x)/(f.width/2)),12);
function southBox(m){return SOUTH.some(f=>{const t=coordinates(f,[m[12],m[13],m[14]]),len=Math.hypot(m[8],m[10]);return len>0&&Math.abs((m[8]*f.n[0]+m[10]*f.n[1])/len-1)<1e-5&&Math.abs(t[0])<f.width/2+.4&&t[1]>-.3&&t[1]<.03;});}
function mapWall(g){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const ps=[0,8,16].map(k=>g.v.slice(i+k,i+k+8));if(SOUTH.some(f=>ps.every(p=>Math.abs(coordinates(f,p)[1])<1e-5&&Math.abs(coordinates(f,p)[0])<f.width/2+1e-5)))continue;for(const p of ps){p[1]=.4+(p[1]-.4)*BODY_SCALE;out.v.push(...p);}}return out;}
// Clip complete triangles at the cap boundaries. Vertices on the cut retain
// interpolated original heights/UVs, so the new cap returns to that exact seam.
function replaceRoof(g){const kept=new G.Geometry(),caps=SOUTH.map(()=>new G.Geometry());
 const clip=(poly,dist,sign)=>{const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=dist(p)*sign,b=dist(q)*sign;if(a<=1e-10)out.push(p);if((a<=0)!==(b<=0)){const t=a/(a-b);out.push(p.map((v,j)=>v+(q[j]-v)*t));}}return out;};
 function push(mesh,poly,face){for(let i=1;i+1<poly.length;i++){let ps=[poly[0],poly[i],poly[i+1]];if(face)ps=ps.map(p=>{const [x,d]=coordinates(face,p),t=Math.max(0,Math.min(1,(d-.5)/(face.depth-.5))),w=1-t*t*(3-2*t),q=p.slice();q[1]=p[1]*(1-w)+endTop(face,x)*w;return q;});const a=ps.map(p=>p.slice(0,3)),packed=a.map(p=>p.map(Math.fround));if(Math.hypot(...Y.M.cross(Y.M.sub(packed[1],packed[0]),Y.M.sub(packed[2],packed[0])))<1e-10)continue;
 if(face)mesh.tri(...a,ps.map(p=>p.slice(6,8)));else for(const p of ps)mesh.v.push(...p);
 }}
 for(let i=0;i<g.v.length;i+=24){let rest=[[0,8,16].map(k=>{const p=g.v.slice(i+k,i+k+8);p[1]-=1.15;return p;})];
  for(let j=0;j<SOUTH.length;j++){const f=SOUTH[j],next=[],planes=[p=>coordinates(f,p)[0]-f.width/2-.15,p=>-coordinates(f,p)[0]-f.width/2-.15,p=>coordinates(f,p)[1]-f.depth,p=>-coordinates(f,p)[1]-.001];
   for(const poly of rest){if(planes.some(fn=>poly.every(p=>fn(p)>1e-9))){next.push(poly);continue;}let inner=poly;for(const fn of planes){if(inner.length<3)break;const outside=clip(inner,fn,-1);if(outside.length>=3)next.push(outside);inner=clip(inner,fn,1);}if(inner.length>=3){if(inner.some(p=>coordinates(f,p)[0]<-1e-9)&&inner.some(p=>coordinates(f,p)[0]>1e-9)){push(caps[j],clip(inner,p=>coordinates(f,p)[0],1),f);push(caps[j],clip(inner,p=>coordinates(f,p)[0],-1),f);}else push(caps[j],inner,f);}
   }rest=next;
  }for(const poly of rest)push(kept,poly);
 }return{kept,caps};
}
function southEnds(b,roofCaps,feature){
 for(let fi=0;fi<SOUTH.length;fi++){const f=SOUTH[fi],cap=roofCaps[fi],boundary=[];for(let i=0;i<cap.v.length;i+=8){const p=cap.v.slice(i,i+3),q=coordinates(f,p);if(Math.abs(q[1])<1e-6)boundary.push([q[0],p[1]]);}boundary.sort((a,b)=>a[0]-b[0]);const front=boundary.filter((p,i)=>!i||p[0]-boundary[i-1][0]>1e-7);
 const top=x=>{for(let i=1;i<front.length;i++){const a=front[i-1],c=front[i];if(x<=c[0]+1e-7)return a[1]+(c[1]-a[1])*(x-a[0])/(c[0]-a[0]);}return front[front.length-1][1];};
 const closures=new G.Geometry(),ring=feature.geometry.coordinates[0],seen=new Set();for(let i=0;i<cap.v.length;i+=24)for(let j=0;j<3;j++){const a=cap.v.slice(i+j*8,i+j*8+3),c=cap.v.slice(i+((j+1)%3)*8,i+((j+1)%3)*8+3),qa=coordinates(f,a),qc=coordinates(f,c);if(Math.max(qa[1],qc[1])<1e-6||!ring.slice(1).some((q,k)=>[a,c].every(p=>Y.Footprints.distSegment([p[0],p[2]],ring[k],q)<1e-6)))continue;const k=[a,c].map(p=>p.map(x=>x.toFixed(7)).join(',')).sort().join('|');if(seen.has(k))continue;seen.add(k);let ps=[[a[0],3.2,a[2]],[c[0],3.2,c[2]],c,a],n=Y.M.norm(Y.M.cross(Y.M.sub(ps[1],ps[0]),Y.M.sub(ps[2],ps[0]))),mid=[(a[0]+c[0])/2,(a[2]+c[2])/2];if(Y.Footprints.inside([mid[0]+n[0]*.005,mid[1]+n[2]*.005],feature.geometry))ps.reverse();for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(k=>ps[k]);if(Math.hypot(...Y.M.cross(Y.M.sub(t[1],t[0]),Y.M.sub(t[2],t[0])))>1e-9)closures.tri(...t);}}
 if(closures.v.length)b.mesh('401-'+f.name+'-cap-side-closure',closures,0,0,0,1,1,1,C.brick,30);
 b.mesh('401-'+f.name+'-roof-cap',roofCaps[fi],0,0,0,1,1,1,C.roof,25);
  b.local(f.origin[0],0,f.origin[1],f.angle,()=>{
   const key='401-'+f.name+'-',mesh=(name,g,c,mat=30)=>b.mesh(key+name,g,0,0,0,1,1,1,c,mat),group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,key+name+'-'+k,...args)};try{fn()}finally{b.e.add=old}};
   const wall=new G.Geometry(),reveals=new G.Geometry(),glass=new G.Geometry(),sill=.92,spring=2.42,archRise=.16,ww=fi===0?.84:.96,windows=[-f.width*.215,f.width*.215].map(x=>({x,l:x-ww/2,r:x+ww/2}));
   const arch=(h,x)=>spring+archRise*Math.sqrt(Math.max(0,1-Math.pow((x-h.x)/(ww/2),2)));
   function strip(l,r,loL,loR,hiL,hiR){const a=[l,loL,0],c=[r,loR,0],d=[r,hiR,0],e=[l,hiL,0];wall.quad(a,c,d,e);wall.quad([l,hiL,-.18],[r,hiR,-.18],[r,loR,-.18],[l,loL,-.18]);}
   const cuts=[-f.width/2,f.width/2,0,...front.map(p=>p[0]),...windows.flatMap(h=>Array.from({length:17},(_,i)=>h.l+ww*i/16))];for(let i=0;i<=48;i++)cuts.push(-f.width/2+f.width*i/48);cuts.sort((a,b)=>a-b);const xs=cuts.filter((v,i)=>!i||v-cuts[i-1]>1e-7);
   for(let i=1;i<xs.length;i++){const l=xs[i-1],r=xs[i],h=windows.find(h=>(l+r)/2>h.l&&(l+r)/2<h.r);if(!h)strip(l,r,.4,.4,top(l),top(r));else{const a=arch(h,l),c=arch(h,r);strip(l,r,.4,.4,sill,sill);strip(l,r,a,c,top(l),top(r));reveals.quad([l,a,0],[l,a,-.18],[r,c,-.18],[r,c,0]);reveals.quad([l,sill,0],[r,sill,0],[r,sill,-.18],[l,sill,-.18]);glass.quad([l,sill,-.13],[r,sill,-.13],[r,c,-.13],[l,a,-.13]);}}
   for(const h of windows){reveals.quad([h.l,sill,0],[h.l,sill,-.18],[h.l,spring,-.18],[h.l,spring,0]);reveals.quad([h.r,sill,0],[h.r,spring,0],[h.r,spring,-.18],[h.r,sill,-.18]);}
   mesh('gable-wall',wall,C.brick);mesh('window-reveals',reveals,C.brick);mesh('window-glass',glass,'#485b50',28);
   group('window-frame',()=>{for(const h of windows){for(const x of[h.l+.027,h.r-.027])b.box(x,(sill+spring)/2,-.055,.054,spring-sill,.08,C.door,38);b.box(h.x,sill+.024,-.055,ww,.048,.08,C.door,38);b.box(h.x,(sill+spring+archRise)/2,-.055,.040,spring+archRise-sill,.08,C.door,38);for(let i=0;i<16;i++){const a=h.l+ww*i/16,c=h.l+ww*(i+1)/16;b.beam([a,arch(h,a)-.025,-.055],[c,arch(h,c)-.025,-.055],.055,C.door,38);}b.box(h.x,sill-.045,.01,ww+.15,.09,.31,C.cap,24);}});
   // The principal central red mullion is visible in both openings. Retain it
   // and the perimeter joinery, without guessing the finer internal lattice.
   const stones=C.stone.map(()=>new G.Geometry()),panels=[[-f.width/2+.34,f.width/2-.34,.44,.80]],margin=.11;
   const bands=[[-f.width/2+.32,windows[0].l-margin],[windows[0].r+margin,windows[1].l-margin],[windows[1].r+margin,f.width/2-.32]];for(const[a,c]of bands)if(c-a>.15)panels.push([a,c,1.04,2.59]);
   let seed=0;for(const[a,c,lo,hi]of panels)for(const cell of rubbleCells(a,c,960+fi*71+seed++,lo,hi)){const g=stones[cell.id%4],poly=cell.poly,cx=poly.reduce((s,p)=>s+p[0],0)/poly.length,cy=poly.reduce((s,p)=>s+p[1],0)/poly.length,z=.014+cell.relief;for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length];g.tri([cx,cy,z+.003],[a[0],a[1],z],[c[0],c[1],z]);g.quad([a[0],a[1],.002],[c[0],c[1],.002],[c[0],c[1],z],[a[0],a[1],z]);}}
   stones.forEach((g,i)=>mesh('gable-stone-'+i,g,C.stone[i],24));
   // Two thin raised bands follow the visible curved gable, rather than a
   // straight triangle. Grey coping meets the actual cap top at its edge.
   group('gable-coping',()=>{for(let i=0;i<48;i++){const a=-f.width/2+f.width*i/48,c=-f.width/2+f.width*(i+1)/48;b.beam([a,top(a)+.015,.018],[c,top(c)+.015,.018],.095,C.tile,19);b.beam([a,top(a)-.36,.065],[c,top(c)-.36,.065],.065,C.brick,30);}for(let x=-f.width/2+.10;x<f.width/2-.06;x+=.15)b.beam([x,top(x)-.045,-.06],[x,top(x)-.045,.10],.085,C.tile,19);});
  });
 }
}
function render(b,f,add){let retained,roofCaps,removedSouthBoxes=0;const old=b.e.add;
 b.e.add=function(key,g,m,color,params,uv){if(params[1]===f.properties.pickId){if(key==='math42-wall-401')g=mapWall(g);else if(key==='math42-continuous-roof-401'){const patched=replaceRoof(g);g=patched.kept;roofCaps=patched.caps;}else if(key==='box'){if(southBox(m)){removedSouthBoxes++;return;}m=new Float32Array(m);m[13]=.4+(m[13]-.4)*BODY_SCALE;m[5]*=BODY_SCALE;}}return old.call(this,key,g,m,color,params,uv);};
 try{retained=previous(b,f,add);}finally{b.e.add=old;}b.id=f.properties.pickId;
 if(!roofCaps||removedSouthBoxes!==28)throw Error('401 source south ends changed; re-register replacement');southEnds(b,roofCaps,f);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'401-'+name+'-'+k,...args)};try{fn()}finally{b.e.add=old}};
 const mesh=(name,g,c,mat=24)=>b.mesh('401-'+name,g,0,0,0,1,1,1,c,mat);
 const left=-gateAlong-.06,right=length-gateAlong+.06;
 b.local(center[0],0,center[1],angle,()=>{
  // Wall fragments end at the two jambs. There is no hidden full-width shell.
  const spans=[[left,-1.17],[1.17,right]],stones=C.stone.map(()=>new G.Geometry());
  function stone(cell,seed,side){const poly=cell.poly,cx=poly.reduce((s,p)=>s+p[0],0)/poly.length,cy=poly.reduce((s,p)=>s+p[1],0)/poly.length,z0=side*.201,z1=side*(.202+cell.relief),g=stones[seed%4];
   for(let i=0;i<poly.length;i++){const a=poly[i],q=poly[(i+1)%poly.length],aa=[a[0],a[1],z1],qq=[q[0],q[1],z1],p=[cx,cy,z1+side*.003];if(side>0)g.tri(p,aa,qq);else g.tri(p,qq,aa);
    const ps=[[a[0],a[1],z0],[q[0],q[1],z0],qq,aa];if(side<0)ps.reverse();g.quad(...ps);
   }
  }
  group('court-wall',()=>{for(const[a,c]of spans){b.box((a+c)/2,1.22,0,c-a,2.44,.40,C.mortar,24);b.box((a+c)/2,.15,0,c-a,.30,.43,C.brick,30);b.box((a+c)/2,2.46,0,c-a+.02,.16,.51,C.cap,24);}});
  let seed=0;for(let span=0;span<spans.length;span++){const[a,c]=spans[span];for(const cell of rubbleCells(a+.015,c-.015,401+span*911)){for(const side of[-1,1])stone(cell,seed,side);seed++;}}
  stones.forEach((g,i)=>mesh('rubble-stones-'+i,g,C.stone[i],24));
  // Stone feet and grey brick jambs remain outside the 1.80m clear opening.
  group('jamb',()=>{for(const x of[-1.17,1.17]){b.box(x,.32,0,.54,.64,.68,C.cap,24);b.box(x,1.78,0,.54,2.92,.62,C.brick,30);}b.box(0,2.98,0,2.88,.26,.67,C.brick,30);});
  group('door-frame',()=>{for(const x of[-.87,.87])b.box(x,1.62,.10,.10,2.58,.19,C.door,38);b.box(0,2.89,.37,1.82,.16,.10,C.door,38);b.box(0,.34,.05,1.82,.12,.36,C.door,38);});
  // Closed solid leaves are separate from the wall; removing them exposes a
  // real jamb-to-jamb opening. No glass or dark painted substitute sits behind.
  group('closed-leaves',()=>{for(const x of[-.421,.421])b.box(x,1.60,.045,.826,2.40,.10,C.door,38);});
  group('door-hardware',()=>{for(const x of[-.18,.18]){b.box(x,1.68,.109,.085,.16,.028,C.dark,29);b.box(x,1.68,.135,.04,.04,.052,C.dark,29);b.mesh('ring',b.geo('401-ring',()=>G.torus(20,6)),x,1.61,.15,.066,.078,.052,C.dark,29);}});
  // Only the independently legible number is included on the small right-
  // jamb plaque; no invented institution name or long inscription.
  group('number-plate',()=>{b.box(1.17,2.34,.326,.245,.225,.020,'#c8b578',38);
   for(const y of[2.304,2.371])b.mesh('digit8-loop',b.geo('401-digit8-loop',()=>G.torus(20,6)),1.128,y,.341,.032,.035,.018,'#575644',38);
   b.box(1.205,2.337,.341,.014,.133,.006,'#575644',38);b.box(1.205,2.273,.341,.045,.012,.006,'#575644',38);b.box(1.194,2.395,.341,.034,.012,.006,'#575644',38);
  });
  // Fit a shallow landing and three solid risers all the way down to ground.
  group('steps',()=>{b.box(0,.16,.34,2.35,.32,1.22,C.cap,24);for(let i=0;i<3;i++){const h=.24-i*.08;b.box(0,h/2,1.105+i*.31,2.35,h,.31,C.cap,24);}for(const x of[-1.06,1.06])b.box(x,.62,.25,.18,.60,.48,C.cap,24);});
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
 return{...retained,id:ID,strategy:'building401-south-gate-v76',retainedRoomFootprint:true,bodyHeight:3.2,southEndsReplaced:2,removedSouthBoxes,gateCenter:center.slice(),gateHeight:4.03,gateMeasured:false,limits:'South courtyard wall and gate are photograph-registered fits; U-shaped footprint and unseen bay counts/materials retained with a consistent single-storey height fit. East-side doorway and exact wall-foot offsets remain unverified.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add)};Y.Building401={id:ID,render,center,angle,length,gateAlong,endpoints:[L,R],rubbleCells,south:SOUTH,coordinates,endTop,bodyScale:BODY_SCALE,southBox};
})(YY);
