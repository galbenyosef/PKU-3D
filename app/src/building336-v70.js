/* 336: Red Lake south range; panorama-registered single-storey white walls,
 * red lattice and west stepped gable. Heights and occluded bays are fitted.
 * The north connector 338 is a separate object; no connector entrance here. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009051997';
const O=[-325.363,-360.185],U=[22.769,-.266],V=[.154,12.425];
const H={base:.70,eave:4.40,rise:3.60};
const point=(u,v,y)=>[O[0]+U[0]*u+V[0]*v,y,O[1]+U[1]*u+V[1]*v];
const COL={roof:'#72796c',tile:'#9ca08a',fascia:'#993f32',end:'#e6e3d8',wall:'#e6e3d8',red:'#a13f30',stone:'#b5b6ab',glass:'#354a43',green:'#385d50'};
function render(b,f){
 const eave=H.eave,rise=H.rise,ridge=eave+rise;
 const u0=-.014,u1=1.014,v0=0,v1=1.028;
 const profile=(u,v)=>{
  const t=Math.max(0,1-Math.abs((v-.5)/.5));
  const end=Math.pow(Math.abs((u-.5)/.514),10);
  return eave+rise*Math.pow(t,1.35)+.14*end*(1-t);
 };
 const mesh=(key,g,c,mat=19)=>{
  // Closure strips taper to zero at the eave. Remove only collapsed closure
  // triangles after Float32 quantization; all roof and tile samples stay intact.
  if(key==='roof-gable-closures'){
   const clean=new G.Geometry();
   for(let i=0;i<g.v.length;i+=24){
    const ps=[i,i+8,i+16].map(j=>g.v.slice(j,j+3).map(Math.fround)),ab=Y.M.sub(ps[1],ps[0]),ac=Y.M.sub(ps[2],ps[0]),n=Y.M.cross(ab,ac),len=Math.hypot(...n);
    if(len>1e-9)for(let j=0;j<3;j++)clean.vertex(ps[j],n.map(v=>v/len),g.v.slice(i+j*8+6,i+j*8+8));
   }
   g=clean;
  }
  b.id=f.properties.pickId;b.mesh('336-'+key,g,0,0,0,1,1,1,c,mat);};
 const surfaces=new G.Geometry(),tiles=new G.Geometry(),ends=new G.Geometry();
 function patch(g,a,c,v,w,offset=0){
  const ps=[[a,v],[c,v],[c,w],[a,w]].map(([u,z])=>point(u,z,profile(u,z)+offset));
  if(w>v)ps.reverse();g.quad(...ps);
 }
 for(const [a,z] of [[v0,.5],[.5,v1]])for(let i=0;i<24;i++)for(let j=0;j<18;j++)patch(surfaces,u0+(u1-u0)*i/24,u0+(u1-u0)*(i+1)/24,a+(z-a)*j/18,a+(z-a)*(j+1)/18);
 for(let u=u0+.004;u<u1-.006;u+=.0102)for(const [a,z] of [[v0,.5],[.5,v1]])for(let j=0;j<18;j++)for(let k=0;k<3;k++)patch(tiles,u+k*.00105,Math.min(u+(k+1)*.00105,u1),a+(z-a)*j/18,a+(z-a)*(j+1)/18,.011+Math.sin((k+.5)*Math.PI/3)*.032);
 tiles.detailWidth=.024;
 // Real gable closure, no unsupported red-painted insert or invented ornament.
 for(const u of [0,1])for(let j=0;j<36;j++){
  const a=j/36,z=(j+1)/36,ps=[point(u,a,eave),point(u,z,eave),point(u,z,profile(u,z)),point(u,a,profile(u,a))];
  if(u===1)ps.reverse();ends.quad(...ps);
 }
 for(const v of [0,1])for(let j=0;j<24;j++){
  const a=j/24,z=(j+1)/24,ps=[point(a,v,eave),point(z,v,eave),point(z,v,profile(z,v)),point(a,v,profile(a,v))];
  if(v===0)ps.reverse();ends.quad(...ps);
 }
 mesh('roof-surface',surfaces,COL.roof);mesh('roof-tile-rolls',tiles,COL.tile);mesh('roof-gable-closures',ends,COL.end,24);
 b.id=f.properties.pickId;
 const beam=(name,a,c,width,color)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'336-'+name+'-'+k,...args);};try{b.beam(a,c,width,color,19);}finally{b.e.add=old;}};
 beam('ridge-cap',point(u0,.5,ridge+.065),point(u1,.5,ridge+.065),.18,COL.tile);
 for(const u of [u0,u1])for(const [a,z] of [[v0,.5],[.5,v1]])for(let j=0;j<18;j++){
  const v=a+(z-a)*j/18,w=a+(z-a)*(j+1)/18;beam('gable-trim',point(u,v,profile(u,v)-.045),point(u,w,profile(u,w)-.045),.105,COL.fascia);
 }
 // The source connector shares the north boundary between u=.380 and .668.
 // No projecting north eave or fascia crosses that separate building's opening.
 for(const [v,a,z] of [[v1,u0,u1],[v0,u0,.376],[v0,.674,u1]])for(let j=0;j<24;j++){
  const u=a+(z-a)*j/24,w=a+(z-a)*(j+1)/24;beam('eave-edge',point(u,v,profile(u,v)-.065),point(w,v,profile(w,v)-.065),.13,COL.fascia);
 }

 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'336-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}};
 function face(name,a,c,holes,posts=[]){
  const pa=point(...a,0),pc=point(...c,0),W=Math.hypot(pc[0]-pa[0],pc[2]-pa[2]);
  b.local(pa[0],0,pa[2],-Math.atan2(pc[2]-pa[2],pc[0]-pa[0]),()=>group(name,()=>{
   const hs=holes.map(h=>({...h,x:h.t*W,lo:h.door?H.base:1.08,hi:3.66,w:h.door?1.65:2.16}));
   const levels=[0,H.base,1.08,3.66,H.eave];
   for(let j=1;j<levels.length;j++){const lo=levels[j-1],hi=levels[j],cuts=hs.filter(h=>h.lo<=lo&&h.hi>=hi).sort((a,b)=>a.x-b.x);let cur=0;
    const wall=(a,c)=>{if(c>a+.001)b.box((a+c)/2,(lo+hi)/2,-.16,c-a,hi-lo,.32,hi<=H.base?COL.stone:COL.wall,24);};
    for(const h of cuts){wall(cur,h.x-h.w/2);cur=h.x+h.w/2;}wall(cur,W);
   }
   for(const h of hs){const y=(h.lo+h.hi)/2,height=h.hi-h.lo;
    b.box(h.x,y,-.09,h.w-.04,height-.04,.055,COL.glass,5);
    for(const x of[h.x-h.w/2,h.x,h.x+h.w/2])b.box(x,y,.02,.075,height+.06,.20,COL.red,6);
    for(const y of[h.lo,h.hi,h.hi-.61])b.box(h.x,y,.02,h.w+.075,.075,.20,COL.red,6);
    for(const side of[-1,1]){const cx=h.x+side*h.w/4;
     for(const dx of[-.26,.26])b.box(cx+dx,y,.038,.032,height-.12,.07,COL.red,6);
     for(let y=h.lo+.28;y<h.hi-.1;y+=.38)b.box(cx,y,.044,h.w/2-.09,.029,.07,COL.red,6);
    }
    if(!h.door)b.box(h.x,h.lo-.045,.045,h.w+.16,.085,.27,COL.stone,24);
   }
   b.box(W/2,H.base-.035,.012,W,.07,.36,COL.stone,24);
   b.box(W/2,H.eave-.22,.04,W,.36,.40,COL.green,6);
   // Only photographically visible structural red posts are added: the
   // north-west wing and the two sides of the south central window.
   group('observed-posts',()=>{for(const t of posts)b.cyl(t*W,H.base,.025,.15,H.eave-.40-H.base,COL.red,16,1,6);});
   // Color blocks indicate the observed painted beam rhythm; no exact motifs claimed.
   for(let x=.32;x<W;x+=.42)b.box(x,H.eave-.16,.245,.14,.12,.045,'#c3b989',6);
  }));
 }
 // Clockwise faces keep positive local z outside the wall.
 face('west-observed',[0,0],[0,1],[{t:.25},{t:.75}]);
 face('south-partly-observed',[0,1],[1,1],[{t:.10},{t:.30},{t:.50},{t:.70,door:true},{t:.90}],[.40,.60]);
 face('east-fitted',[1,1],[1,0],[{t:.25},{t:.75}]);
 // Only the exposed wings receive bays; the separate 338 junction has none.
 face('north-west-observed',[.38,0],[0,0],[{t:.25},{t:.75}],[.04,.50,.96]);
 face('north-east-fitted',[1,0],[.668,0],[{t:.25},{t:.75}]);
 // The neighbour is a low west portal, not an enclosed connector occupying
 // this entire edge. Close 336's own envelope strictly inward of its north
 // boundary; do not invent doors/windows on the obscured shared segment.
 const ja=point(.668,0,0),jc=point(.380,0,0),jw=Math.hypot(jc[0]-ja[0],jc[2]-ja[2]);
 b.local(ja[0],0,ja[2],-Math.atan2(jc[2]-ja[2],jc[0]-ja[0]),()=>group('junction-inward-closure',()=>{
  b.box(jw/2,H.base/2,-.16,jw,H.base,.32,COL.stone,24);
  b.box(jw/2,(H.base+H.eave)/2,-.16,jw,H.eave-H.base,.32,COL.wall,24);
 }));
 mesh('ceiling',G.polygon(f.geometry.coordinates[0].slice(0,-1),eave-.14),COL.wall,24);
 // West gable: white horizontal steps below the red wind board. The source
 // is occluded centrally; this is a fitted stepped profile, not traced ornament.
 const red=new G.Geometry(),white=new G.Geometry();
 for(let j=0;j<24;j++){
  const a=j/24,c=(j+1)/24,min=Math.min(profile(0,a),profile(0,c)),top=eave+Math.max(0,Math.floor((min-eave-.30)/.60))*.60;
  if(top>eave)white.quad(point(-.001,a,eave),point(-.001,a,top),point(-.001,c,top),point(-.001,c,eave));
  red.quad(point(-.002,a,top),point(-.002,a,profile(0,a)-.025),point(-.002,c,profile(0,c)-.025),point(-.002,c,top));
 }
 mesh('west-stepped-white-gable',white,COL.wall,24);mesh('west-red-wind-board',red,COL.red,6);
 return{id:ID,strategy:'building336-v70',bodyHeight:eave,roofRise:rise,storeys:1,sourceOutline:true,westWindows:2,northConnectorExcluded:true,northEnvelopeClosed:true,southDoorObserved:false,southOpeningEvidence:'partly_visible_candidate',mainEntranceVerified:false,heightMeasured:false,allFacadesVerified:false,limits:'West gable and north-west wing directly observed; south dark opening east of centre is a partly visible door candidate, not a verified door type. Heights, lattice spacing, south bay count and hidden east/north-east bays fitted. No entrance borrowed from 338 or 337.'};
}
A.render=function(b,f,add){return f.properties.pickId===336&&f.properties.id===ID?render(b,f):previous.call(this,b,f,add);};
Y.Building336={id:ID,render,point,H};
})(YY);
