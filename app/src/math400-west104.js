/* 82 courtyard entire west wing and south gable. Load after entry101 and wing102.
 * Footprint anchor and southern height/photo proportions fitted, not surveyed.
 * North transition is unverified; original north body and all other wings stay. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1075644754',rubbleCells=Y.Building401.rubbleCells;
const C={stone:['#969181','#a39680','#b2a590','#8e968b'],brick:'#979b92',cap:'#b8b8a8',door:'#943d29',roof:'#555c55',tile:'#747c71'};
const SOUTH=[{name:'west',a:[-141.497,-294.852],c:[-135.655,-295.085],rise:2.05}].map(f=>{const width=Math.hypot(f.c[0]-f.a[0],f.c[1]-f.a[1]),u=[(f.c[0]-f.a[0])/width,(f.c[1]-f.a[1])/width],n=[-u[1],u[0]],origin=[(f.a[0]+f.c[0])/2,(f.a[1]+f.c[1])/2];return{...f,width,u,n,origin,angle:-Math.atan2(u[1],u[0])};});
const coordinates=(f,p)=>{const x=p[0]-f.origin[0],z=p[2]-f.origin[1];return[x*f.u[0]+z*f.u[1],-(x*f.n[0]+z*f.n[1])];};
const endTop=(f,x)=>3.3+f.rise*Math.pow(Math.max(0,1-Math.abs(x)/(f.width/2)),1.38)+.065*Math.pow(Math.min(1,Math.abs(x)/(f.width/2)),12);
function southBox(m){return SOUTH.some(f=>{const t=coordinates(f,[m[12],m[13],m[14]]),len=Math.hypot(m[8],m[10]);return len>0&&Math.abs((m[8]*f.n[0]+m[10]*f.n[1])/len-1)<1e-5&&Math.abs(t[0])<f.width/2+.4&&t[1]>-.3&&t[1]<.03;});}
const eastEnd=[-136.578,-313.894],westEnd=[-142.223,-313.684],F=SOUTH[0],H=F.width/2;
const eastNorth=coordinates(F,[eastEnd[0],0,eastEnd[1]]),westNorth=coordinates(F,[westEnd[0],0,westEnd[1]]),depth=westNorth[1];
const rightKnots=[[H,0],...[[ -136.014,-304.212],[-136.484,-311.341],eastEnd].map(p=>coordinates(F,[p[0],0,p[1]]))];
const right=d=>{let i=1;while(i<rightKnots.length-1&&d>rightKnots[i][1])i++;const a=rightKnots[i-1],b=rightKnots[i];return a[0]+(b[0]-a[0])*(d-a[1])/(b[1]-a[1]);},left=d=>-H+(westNorth[0]+H)*d/depth;
const signed=p=>coordinates(F,p)[0]-right(coordinates(F,p)[1]);
const world=(x,y,d)=>[F.origin[0]+F.u[0]*x-F.n[0]*d,y,F.origin[1]+F.u[1]*x-F.n[1]*d];
const mapY=(p,y)=>.4+(y-.4)*(2.9/4.4);
function roofHeight(p){const[x,d]=coordinates(F,p),l=left(d),r=right(d),q=Math.max(0,1-Math.abs((x-(l+r)/2)/((r-l)/2))),hip=Math.min(1,Math.max(0,(depth-d)/2));return 3.3+2.05*Math.pow(q,1.38)*hip+.065*Math.pow(1-q,12);}
function clip(poly,fn,sign=1){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=fn(p)*sign,b=fn(q)*sign;if(a<=1e-10)out.push(p);if((a<=0)!==(b<=0)){const t=a/(a-b);out.push(p.map((v,j)=>v+(q[j]-v)*t));}}return out;}
function bands(poly){let rest=poly,out=[];for(const q of rightKnots.slice(1,-1)){const fn=p=>coordinates(F,p)[1]-q[1],a=clip(rest,fn);if(a.length>=3)out.push(a);rest=clip(rest,fn,-1);}if(rest.length>=3)out.push(rest);return out;}
function put(g,ps,change){for(let i=1;i+1<ps.length;i++){let t=[ps[0],ps[i],ps[i+1]];if(change)t=t.map(change);const a=t.map(p=>p.slice(0,3)),f=a.map(p=>p.map(Math.fround));if(Math.hypot(...Y.M.cross(Y.M.sub(f[1],f[0]),Y.M.sub(f[2],f[0])))<1e-10)continue;if(change)g.tri(...a,t.map(p=>p.slice(6,8)));else for(const p of t)g.v.push(...p);}}
function mapWall(g){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const ps=[0,8,16].map(k=>g.v.slice(i+k,i+k+8));if(ps.every(p=>Math.abs(coordinates(F,p)[1])<1e-5))continue;for(const poly of bands(ps)){put(out,clip(poly,signed,-1));put(out,clip(poly,signed),p=>{p=p.slice();p[1]=mapY(p,p[1]);return p;});}}return out;}
function replaceRoof(g){const kept=new G.Geometry(),cap=new G.Geometry(),joint=new G.Geometry(),seams=[];
const deform=p=>{p=p.slice();p[1]=roofHeight(p);return p;};
function fine(ps,level=0){const lens=ps.map((p,i)=>Math.hypot(p[0]-ps[(i+1)%3][0],p[2]-ps[(i+1)%3][2])),k=lens.indexOf(Math.max(...lens));if(lens[k]>.30&&level<9){const a=ps[k],b=ps[(k+1)%3],c=ps[(k+2)%3],m=a.map((v,j)=>(v+b[j])/2);fine([a,m,c],level+1);fine([m,b,c],level+1);}else{const p=ps.map(deform).map(p=>p.slice(0,3).map(Math.fround)),n=Y.M.cross(Y.M.sub(p[1],p[0]),Y.M.sub(p[2],p[0]));if(n[1]>1e-10)put(cap,ps,deform);}}
for(let i=0;i<g.v.length;i+=24){const original=[0,8,16].map(k=>g.v.slice(i+k,i+k+8));if(original.every(p=>p[0]>-135.655)){put(kept,original);continue;}for(const ps of bands(original)){const inner=clip(ps,signed),outer=clip(ps,signed,-1);put(kept,outer);
// Split the mapped roof along the ridge before subdivision.
const ridge=p=>{const[x,d]=coordinates(F,p);return x-(left(d)+right(d))/2;};
for(const side of[-1,1]){const poly=clip(inner,ridge,side);for(let j=1;j+1<poly.length;j++)fine([poly[0],poly[j],poly[j+1]]);}
if(inner.length>=3&&outer.length>=3){const pts=inner.filter(p=>Math.abs(signed(p))<1e-7);if(pts.length===2&&Math.hypot(pts[0][0]-pts[1][0],pts[0][2]-pts[1][2])>1e-7){let[a,b]=pts;if(coordinates(F,a)[1]>coordinates(F,b)[1])[a,b]=[b,a];const lowA=deform(a),lowB=deform(b);seams.push({a:a.slice(0,3),b:b.slice(0,3),lowA:lowA.slice(0,3),lowB:lowB.slice(0,3)});let q=[lowA.slice(0,3),lowB.slice(0,3),b.slice(0,3),a.slice(0,3)];const n=Y.M.cross(Y.M.sub(q[1],q[0]),Y.M.sub(q[2],q[0]));if(n[0]*F.u[0]+n[2]*F.u[1]>0)q.reverse();for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(k=>q[k]);if(Math.hypot(...Y.M.cross(Y.M.sub(t[1],t[0]),Y.M.sub(t[2],t[0])))>1e-9)joint.tri(...t);}}}}
}return {kept,caps:[cap],joint,seams};}
// A masonry arch is actual separated voussoirs, not just the wall texture.
// Fifteen blocks and dimensions are fitted; the photograph does not count them.
function brickArch(h,spring,rise,half){const g=new G.Geometry(),blocks=[],count=15,thickness=.17,gap=.006;
 const point=(t,outer,z)=>{const x=Math.cos(t),y=Math.sin(t),nx=x/half,ny=y/rise,n=Math.hypot(nx,ny);return[h.x+half*x+(outer?thickness*nx/n:0),spring+rise*y+(outer?thickness*ny/n:0),z];};
 for(let b=0;b<count;b++){const start=b*Math.PI/count+gap,end=(b+1)*Math.PI/count-gap,first=g.v.length;
 for(let j=0;j<4;j++){const a=start+(end-start)*j/4,c=start+(end-start)*(j+1)/4,ia=point(a,false,.048),ic=point(c,false,.048),oa=point(a,true,.048),oc=point(c,true,.048),ib=point(a,false,-.018),id=point(c,false,-.018),ob=point(a,true,-.018),od=point(c,true,-.018);
 g.quad(ia,oa,oc,ic);g.quad(ib,id,od,ob);g.quad(ib,ia,ic,id);g.quad(ob,od,oc,oa);if(j===0)g.quad(ib,ob,oa,ia);if(j===3)g.quad(id,ic,oc,od);
 }blocks.push({first,count:g.v.length-first,start,end});}return{geometry:g,blocks,count,thickness,gap};}
// Finer photo-fitted stone sizes for this facade only; shared401 generator stays unchanged.
function westRubbleCells(a,c,seed,lo,hi){const k=1.8;return rubbleCells(a*k,c*k,seed,lo*k,hi*k).map(cell=>({...cell,poly:cell.poly.map(p=>p.map(v=>v/k)),relief:cell.relief/k}));}
function southEnds(b,roofCaps,feature){
 for(let fi=0;fi<SOUTH.length;fi++){const f=SOUTH[fi],cap=roofCaps[fi],boundary=[];for(let i=0;i<cap.v.length;i+=8){const p=cap.v.slice(i,i+3),q=coordinates(f,p);if(Math.abs(q[1])<1e-6)boundary.push([q[0],p[1]]);}boundary.sort((a,b)=>a[0]-b[0]);const front=boundary.filter((p,i)=>!i||p[0]-boundary[i-1][0]>1e-7);
 const top=x=>{for(let i=1;i<front.length;i++){const a=front[i-1],c=front[i];if(x<=c[0]+1e-7)return a[1]+(c[1]-a[1])*(x-a[0])/(c[0]-a[0]);}return front[front.length-1][1];};
 const closures=new G.Geometry(),ring=feature.geometry.coordinates[0],seen=new Set();for(let i=0;i<cap.v.length;i+=24)for(let j=0;j<3;j++){const a=cap.v.slice(i+j*8,i+j*8+3),c=cap.v.slice(i+((j+1)%3)*8,i+((j+1)%3)*8+3),qa=coordinates(f,a),qc=coordinates(f,c);if(Math.max(qa[1],qc[1])<1e-6||!ring.slice(1).some((q,k)=>[a,c].every(p=>Y.Footprints.distSegment([p[0],p[2]],ring[k],q)<1e-6)))continue;const k=[a,c].map(p=>p.map(x=>x.toFixed(7)).join(',')).sort().join('|');if(seen.has(k))continue;seen.add(k);let ps=[[a[0],3.3,a[2]],[c[0],3.3,c[2]],c,a],n=Y.M.norm(Y.M.cross(Y.M.sub(ps[1],ps[0]),Y.M.sub(ps[2],ps[0]))),mid=[(a[0]+c[0])/2,(a[2]+c[2])/2];if(Y.Footprints.inside([mid[0]+n[0]*.005,mid[1]+n[2]*.005],feature.geometry))ps.reverse();for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(k=>ps[k]);if(Math.hypot(...Y.M.cross(Y.M.sub(t[1],t[0]),Y.M.sub(t[2],t[0])))>1e-9)closures.tri(...t);}}
 if(closures.v.length)b.mesh('400-west104-'+f.name+'-cap-side-closure',closures,0,0,0,1,1,1,C.brick,30);
 b.mesh('400-west104-'+f.name+'-roof-cap',roofCaps[fi],0,0,0,1,1,1,C.roof,19);
  b.local(f.origin[0],0,f.origin[1],f.angle,()=>{
   const key='400-west104-'+f.name+'-',mesh=(name,g,c,mat=30)=>b.mesh(key+name,g,0,0,0,1,1,1,c,mat),group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,key+name+'-'+k,...args)};try{fn()}finally{b.e.add=old}};
   const wall=new G.Geometry(),reveals=new G.Geometry(),glass=new G.Geometry(),sill=.98,spring=2.43,archRise=.20,ww=1.35,windows=[0].map(x=>({x,l:x-ww/2,r:x+ww/2}));
   const arch=(h,x)=>spring+archRise*Math.sqrt(Math.max(0,1-Math.pow((x-h.x)/(ww/2),2)));
   function strip(l,r,loL,loR,hiL,hiR){const a=[l,loL,0],c=[r,loR,0],d=[r,hiR,0],e=[l,hiL,0];wall.quad(a,c,d,e);wall.quad([l,hiL,-.18],[r,hiR,-.18],[r,loR,-.18],[l,loL,-.18]);}
   const cuts=[-f.width/2,f.width/2,0,...front.map(p=>p[0]),...windows.flatMap(h=>Array.from({length:17},(_,i)=>h.l+ww*i/16))];for(let i=0;i<=48;i++)cuts.push(-f.width/2+f.width*i/48);cuts.sort((a,b)=>a-b);const xs=cuts.filter((v,i)=>!i||v-cuts[i-1]>1e-7);
   for(let i=1;i<xs.length;i++){const l=xs[i-1],r=xs[i],h=windows.find(h=>(l+r)/2>h.l&&(l+r)/2<h.r);if(!h)strip(l,r,.4,.4,top(l),top(r));else{const a=arch(h,l),c=arch(h,r);strip(l,r,.4,.4,sill,sill);strip(l,r,a,c,top(l),top(r));reveals.quad([l,a,0],[l,a,-.18],[r,c,-.18],[r,c,0]);reveals.quad([l,sill,0],[r,sill,0],[r,sill,-.18],[l,sill,-.18]);glass.quad([l,sill,-.13],[r,sill,-.13],[r,c,-.13],[l,a,-.13]);}}
   for(const h of windows){reveals.quad([h.l,sill,0],[h.l,sill,-.18],[h.l,spring,-.18],[h.l,spring,0]);reveals.quad([h.r,sill,0],[h.r,spring,0],[h.r,spring,-.18],[h.r,sill,-.18]);}
   mesh('gable-wall',wall,C.brick);mesh('window-reveals',reveals,C.brick);mesh('window-glass',glass,'#485b50',28);for(const h of windows)mesh('arch-brick-ring',brickArch(h,spring,archRise,ww/2).geometry,C.brick,30);
   group('window-frame',()=>{for(const h of windows){for(const x of[h.l+.027,h.r-.027])b.box(x,(sill+spring)/2,-.055,.054,spring-sill,.08,C.door,38);b.box(h.x,sill+.024,-.055,ww,.048,.08,C.door,38);b.box(h.x,(sill+spring+archRise)/2,-.055,.040,spring+archRise-sill,.08,C.door,38);for(let i=0;i<16;i++){const a=h.l+ww*i/16,c=h.l+ww*(i+1)/16;b.beam([a,arch(h,a)-.025,-.055],[c,arch(h,c)-.025,-.055],.055,C.door,38);}b.box(h.x,sill-.045,.01,ww+.15,.09,.31,C.cap,24);}});
   // The principal central red mullion is visible in this opening. Retain it
   // and the perimeter joinery, without guessing the finer internal lattice.
   const stones=C.stone.map(()=>new G.Geometry()),panels=[[-f.width/2+.34,f.width/2-.34,.44,.80]],margin=.22;
   const bands=[[-f.width/2+.32,windows[0].l-margin],[windows[0].r+margin,f.width/2-.32]];for(const[a,c]of bands)if(c-a>.15)panels.push([a,c,1.04,2.59]);
   let seed=0;for(const[a,c,lo,hi]of panels)for(const cell of westRubbleCells(a,c,960+fi*71+seed++,lo,hi)){const g=stones[cell.id%4],poly=cell.poly,cx=poly.reduce((s,p)=>s+p[0],0)/poly.length,cy=poly.reduce((s,p)=>s+p[1],0)/poly.length,z=.014+cell.relief;for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length];g.tri([cx,cy,z+.003],[a[0],a[1],z],[c[0],c[1],z]);g.quad([a[0],a[1],.002],[c[0],c[1],.002],[c[0],c[1],z],[a[0],a[1],z]);}}
   stones.forEach((g,i)=>mesh('gable-stone-'+i,g,C.stone[i],24));
   // The photographed roof projects beyond the gable. A closed curved slab
   // ties the forward coping and tile ends back into the existing roof edge.
   const eave=new G.Geometry(),back=-.035,forward=.26;
   for(let i=0;i<48;i++){const a=-f.width/2+f.width*i/48,c=-f.width/2+f.width*(i+1)/48,ya=top(a),yc=top(c),al=[a,ya-.095,back],ar=[a,ya-.095,forward],cl=[c,yc-.095,back],cr=[c,yc-.095,forward],at=[a,ya+.045,back],af=[a,ya+.045,forward],ct=[c,yc+.045,back],cf=[c,yc+.045,forward];
    eave.quad(at,af,cf,ct);eave.quad(al,cl,cr,ar);eave.quad(ar,cr,cf,af);eave.quad(al,at,ct,cl);if(i===0)eave.quad(al,ar,af,at);if(i===47)eave.quad(cl,ct,cf,cr);
   }mesh('projecting-gable-eave',eave,C.roof,19);
   group('gable-coping',()=>{for(let i=0;i<48;i++){const a=-f.width/2+f.width*i/48,c=-f.width/2+f.width*(i+1)/48;b.beam([a,top(a)+.045,.28],[c,top(c)+.045,.28],.075,C.tile,19);b.beam([a,top(a)-.36,.025],[c,top(c)-.36,.025],.065,C.brick,30);}for(let x=-f.width/2+.10;x<f.width/2-.06;x+=.15)b.beam([x,top(x)-.045,-.04],[x,top(x)-.045,.25],.085,C.tile,19);});
  });
 }
}

function render(b,f,add){let retained,patched,removedSouthBoxes=0,seq=0,mappedBoxes=0;const old=b.e.add;
b.e.add=function(key,g,m,color,params,uv){if(params[1]===400){if(key==='math42-wall-400'||key==='400-wing102-retained-math42-wall-400')g=mapWall(g);else if(key==='math42-continuous-roof-400'||key==='400-wing102-retained-math42-continuous-roof-400'){patched=replaceRoof(g);g=patched.kept;}else if(key==='box'){if(southBox(m)){removedSouthBoxes++;return;}const ps=[];for(let i=0;i<g.v.length;i+=8){const p=g.v.slice(i,i+8),w=Y.M.apply(m,[...p.slice(0,3),1]);ps.push([...w.slice(0,3),...p.slice(3)]);}if(ps.every(p=>signed(p)<=1e-6)){m=new Float32Array(m);m[13]=mapY([m[12],m[13],m[14]],m[13]);for(const j of[1,5,9])m[j]*=2.9/4.4;mappedBoxes++;}else if(ps.some(p=>signed(p)<-1e-6)){const mesh=new G.Geometry();for(let i=0;i<ps.length;i+=3){for(const tri of bands(ps.slice(i,i+3))){put(mesh,clip(tri,signed,-1),p=>p);put(mesh,clip(tri,signed),p=>{p=p.slice();p[1]=mapY(p,p[1]);return p;});}}key='400-west104-retained-box-'+seq++;g=mesh;m=Y.M.identity();mappedBoxes++;}}}return old.call(this,key,g,m,color,params,uv);};
try{retained=previous(b,f,add);}finally{b.e.add=old;}if(!patched||removedSouthBoxes!==14)throw Error('400 west gable source changed: '+removedSouthBoxes);b.id=400;const cleanEmit=b.e.add;let removedCollapsedTriangles=0;b.e.add=function(k,g,...args){if(k.startsWith('400-west104-')){const clean=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const p=[0,8,16].map(k=>g.v.slice(i+k,i+k+3).map(Math.fround));if(Math.hypot(...Y.M.cross(Y.M.sub(p[1],p[0]),Y.M.sub(p[2],p[0])))>1e-10)clean.v.push(...g.v.slice(i,i+24));else removedCollapsedTriangles++;}g=clean;}return cleanEmit.call(this,k,g,...args);};try{southEnds(b,patched.caps,f);if(patched.joint.v.length)b.mesh('400-west104-north-junction',patched.joint,0,0,0,1,1,1,C.brick,30);
// Matched tile rolls across the complete low wing, not a short lowered end cap.
const tiles=new G.Geometry();for(let d=.10;d<depth-.10;d+=.19){const l=left(d),r=right(d),mid=(l+r)/2;for(const side of[-1,1])for(let j=0;j<24;j++){const x=mid+side*(r-l)/2*j/24,xx=mid+side*(r-l)/2*(j+1)/24,pts=[[x,d-.025],[xx,d-.025],[xx,d+.025],[x,d+.025]].map(([x,z],i)=>{const p=world(x,0,z);p[1]=roofHeight(p)+(i<2?.012:.033);return p;});if(side<0)pts.reverse();tiles.quad(...pts);}}b.mesh('400-west104-wing-tile-rolls',tiles,0,0,0,1,1,1,C.tile,19);
}finally{b.e.add=cleanEmit;}return {...retained,west104RemovedCollapsedTriangles:removedCollapsedTriangles,westSouthGable104:true,west104RemovedBoxes:removedSouthBoxes,west104MappedBoxes:mappedBoxes,west104NorthTransitionVerified:false,west104Fit:{eave:3.3,ridge:5.35,length:depth},registrationAccuracy:'photo_fit_with_map_disagreement',west104Seams:patched.seams};}
A.render=(b,f,add)=>f.properties.id===ID?render(b,f,add):previous(b,f,add);Y.Math400West104={westRubbleCells,brickArch,south:SOUTH,coordinates,endTop,mapY,world,roofHeight,signed,left,right,depth};
})(YY);
