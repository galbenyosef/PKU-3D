/* Jun Hall, OSM way/240832222. Single N-S range; south end loggia,
 * east central entrance from individually labelled photographs.
 * All heights/depths and hidden north elevation remain proportional fits. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/240832222';
const SW=[-161.439,-212.365],SE=[-141.582,-212.642],NW=[-162.173,-263.130],NE=[-142.027,-263.418];
const O=[(SW[0]+SE[0])/2,(SW[1]+SE[1])/2],R=-Math.atan2(SE[1]-SW[1],SE[0]-SW[0]),W=Math.hypot(SE[0]-SW[0],SE[1]-SW[1]),D=50.77;
const H={base:.85,floor:5.05,eave:10.15,ridge:15.2},DEPTH=4.0;
const C={wall:'#e4e1d5',stone:'#b2b4aa',red:'#984336',wood:'#854437',glass:'#50645e',blue:'#386577',green:'#487366',gold:'#c4aa70',roof:'#69736e',tile:'#90988a'};
const lerp=(a,b,t)=>a.map((q,i)=>q+(b[i]-q)*t),BS=lerp(SW,NW,DEPTH/D),BE=lerp(SE,NE,DEPTH/D);
function render(b,f){b.id=f.properties.pickId;
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'jun111-'+name+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
 const mesh=(name,g,col,mat=24)=>b.mesh('jun111-'+name,g,0,0,0,1,1,1,col,mat);
 const ring=f.geometry.coordinates[0].slice(0,-1);mesh('base-top',G.polygon(ring,H.base),C.stone);mesh('upper-floor',G.polygon([BS,BE,NE,NW],H.floor),C.wall);mesh('ceiling',G.polygon([BS,BE,NE,NW],H.eave-.09),C.wall);
 let base=new G.Geometry();for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];base.quad([a[0],.08,a[1]],[c[0],.08,c[1]],[c[0],H.base,c[1]],[a[0],H.base,a[1]]);}mesh('base-edge',base,C.stone);
 function face(name,a,c,holes){const len=Math.hypot(c[0]-a[0],c[1]-a[1]),rot=-Math.atan2(c[1]-a[1],c[0]-a[0]);b.local(a[0],0,a[1],rot,()=>{
  const ys=[H.base,H.eave,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b).filter((a,i,t)=>!i||a-t[i-1]>1e-6);
  group(name+'-wall',()=>{for(let i=1;i<ys.length;i++){const lo=ys[i-1],hi=ys[i],cuts=holes.filter(q=>q.lo<=lo&&q.hi>=hi).sort((a,b)=>a.x-b.x);let cur=0;const part=(a,c)=>{if(c>a)b.box((a+c)/2,(lo+hi)/2,-.18,c-a,hi-lo,.36,C.wall,24);};for(const q of cuts){part(cur,q.x-q.w/2);cur=q.x+q.w/2;}part(cur,len);}});
  group(name+'-openings',()=>holes.forEach(q=>{if(q.entry)return;const h=q.hi-q.lo,cy=(q.lo+q.hi)/2;b.box(q.x,cy,-.14,q.w,h,.04,q.door?(q.doorColor||C.wood):C.glass,q.door?6:5);for(const x of[q.x-q.w/2,q.x+q.w/2])b.box(x,cy,.025,.085,h+.09,.20,C.red,6);for(const y of[q.lo,q.hi,q.hi-.48])b.box(q.x,y,.025,q.w+.09,.08,.20,C.red,6);
   if(q.door){b.box(q.x,cy,.03,.09,h,.21,C.red,6);}
   else{for(const x of[-.3,.3])b.box(q.x+q.w*x,cy-.15,.055,.042,h-.65,.11,C.red,6);for(const y of[q.lo+.38,q.lo+.62,q.hi-.77])b.box(q.x,y,.055,q.w,.043,.11,C.red,6);for(const x of[-.18,.18])b.box(q.x+q.w*x,q.hi-.25,.055,.035,.40,.11,C.red,6);}
   b.box(q.x,q.lo-.07,.05,q.w+.17,.11,.32,C.stone,24);
  }));
 });}
 const long=(a,c)=>{const L=Math.hypot(c[0]-a[0],c[1]-a[1]);return [0,1].flatMap(level=>Array.from({length:8},(_,bay)=>[-1,0,1].map(k=>({x:(bay+.5)*L/8+k*L/8*.25,w:1.22,lo:1.1+level*4.35,hi:4.12+level*4.35}))).flat());};
 const east=long(BE,NE),EL=Math.hypot(NE[0]-BE[0],NE[1]-BE[1]);
 // Center bay has two flanking windows and the observed central entrance.
 const doorX=EL*3.5/8;const eastHoles=east.filter(q=>!(q.lo<2&&Math.abs(q.x-doorX)<.01));for(const q of eastHoles)if(q.lo<2&&Math.abs(q.x-doorX)<2)q.x=doorX+Math.sign(q.x-doorX)*2.10;eastHoles.push({x:doorX,w:1.86,lo:H.base,hi:3.76,door:true,entry:true});
 face('east',BE,NE,eastHoles);face('west',NW,BS,long(NW,BS));
 const northW=Math.hypot(NE[0]-NW[0],NE[1]-NW[1]);face('north-provisional',NE,NW,[0,1].flatMap(l=>Array.from({length:5},(_,i)=>({x:(i+.5)*northW/5,w:1.8,lo:1.1+l*4.35,hi:4.1+l*4.35}))));
 const southW=Math.hypot(BE[0]-BS[0],BE[1]-BS[1]);face('south-recess',BS,BE,[0,1].flatMap(l=>Array.from({length:5},(_,i)=>({x:(i+.5)*southW/5,w:i===2?2.1:1.7,lo:i===2?H.base+l*4.2:1.1+l*4.35,hi:4.12+l*4.35,door:i===2,doorColor:C.wall}))));
 b.local(O[0],0,O[1],R,()=>{
  group('south-loggia',()=>{b.box(0,H.floor,-DEPTH/2,W,.25,DEPTH,C.stone,24);for(let i=0;i<6;i++){const x=-W/2+.35+i*(W-.7)/5;b.cyl(x,H.base,-.22,.28,H.eave-H.base,C.red,16,1,6);b.cyl(x,H.base-.13,-.22,.38,.22,C.stone,16,1,24);}for(const y of[H.floor-.25,H.eave-.55]){b.box(0,y,-.22,W,.62,.55,C.blue,6);for(let i=0;i<5;i++){let x=-W/2+(i+.5)*W/5;b.box(x,y,-.52,W/5*.68,.09,.035,C.gold,6);b.box(x,y,-.55,W/5*.51,.25,.03,C.green,6);}}
   b.box(0,H.floor+.38,-.22,W,.55,.17,C.red,6);b.box(0,H.floor+1.03,-.22,W,.11,.24,C.red,6);for(let i=0;i<31;i++)b.box(-W/2+i*W/30,H.floor+.77,-.22,.07,.49,.1,C.red,6);
   for(const x of[-W/2+.35,W/2-.35]){b.box(x,H.floor+.38,-DEPTH/2,.18,.55,DEPTH,C.red,6);b.box(x,H.floor+1.03,-DEPTH/2,.23,.11,DEPTH,C.red,6);}
  });
  group('steps',()=>{for(let k=0;k<4;k++)b.box(0,(k+1)*H.base/8,.25+(3-k)*.36,3.5,(k+1)*H.base/4,.8,C.stone,24);});
  group('side-columns',()=>{for(const s of[-1,1])for(let j=1;j<=9;j++){const z=-DEPTH-(j-1)*(D-DEPTH)/8;b.cyl(s*(W/2-.12),H.base,z,.27,H.eave-H.base,C.red,16,1,6);}for(const s of[-1,1]){b.box(s*W/2,H.eave-.40,-D/2,.38,.64,D,C.blue,6);b.box(s*W/2,4.79,-(D+DEPTH)/2,.18,.16,D-DEPTH,C.wall,24);}});
  roof(b,group,mesh);
 });
 // Recessed east door and small tiled hood use the same real east wall frame.
 b.local(BE[0],0,BE[1],-Math.atan2(NE[1]-BE[1],NE[0]-BE[0]),()=>group('east-entry',()=>{// The stone portal surrounds an actual empty wall opening; door leaves sit behind the wall.
 const stone='#c8c9bc';for(const side of[-1,1])b.box(doorX+side*1.10,2.455,-.13,.36,3.21,.66,stone,24);
 b.box(doorX,3.94,-.13,2.56,.36,.66,stone,24);
 // Deep red inner jambs and a shallow glazed transom above two separate leaves.
 for(const side of[-1,1])b.box(doorX+side*.89,2.305,-.43,.10,2.91,.15,C.red,6);
 b.box(doorX,3.70,-.43,1.86,.12,.15,C.red,6);b.box(doorX,3.31,-.43,1.86,.10,.15,C.red,6);
 b.box(doorX,3.505,-.49,1.72,.29,.035,C.glass,5);for(const x of[-.43,0,.43])b.box(doorX+x,3.505,-.43,.045,.30,.12,C.red,6);
 for(const side of[-1,1]){const x=doorX+side*.43;b.box(x,2.09,-.49,.84,2.46,.055,C.wood,6);
 b.box(x,2.565,-.446,.65,1.19,.025,C.glass,5);
 for(const xx of[-.35,.35])b.box(x+xx,2.10,-.418,.075,2.46,.09,C.red,6);
 for(const yy of[.91,1.70,1.94,3.20])b.box(x,yy,-.418,.76,.065,.09,C.red,6);
 b.box(x,1.34,-.414,.62,.59,.04,C.red,6);}
 b.box(doorX,2.09,-.416,.07,2.46,.095,C.red,6);
 b.n17Roof(doorX,4.25,.42,3.45,1.56,.43);for(let i=0;i<4;i++)b.box(doorX,(i+1)*H.base/8,.35+(3-i)*.34,2.7,(i+1)*H.base/4,.8,C.stone,24);}));
 return{id:ID,strategy:'junzhai111-photo-registered',roofAxis:'north-south',floors:2,attic:true,southLoggia:true,longFacade:'solid-wall',eastDoor:true,measured:false,allFacadesVerified:false};
}
function roof(b,group,mesh){const hx=W/2+1.0,hz=D/2+1.1,inset=3.9,rise=H.ridge-H.eave,zc=-D/2;
 const y=t=>H.eave+rise*Math.pow(t,1.42),end=t=>hz-inset*Math.min(1,t/.52),surf=new G.Geometry(),tile=new G.Geometry();
 function patch(g,side,t0,t1,u0,u1,offset=0){const q=(t,u)=>[side*hx*(1-t),y(t)+.33*Math.pow(Math.abs(u),10)*(1-t)*(1-t)+offset,zc+u*end(t)];const v=[q(t0,u0),q(t0,u1),q(t1,u1),q(t1,u0)];g.quad(...(side>0?v.reverse():v));}
 for(const side of[-1,1]){for(let j=0;j<24;j++)for(let i=0;i<60;i++)patch(surf,side,j/24,(j+1)/24,-1+i/30,-1+(i+1)/30);for(let i=0;i<Math.ceil(2*hz/.31);i++)for(let j=0;j<24;j++){const n=Math.ceil(2*hz/.31);patch(tile,side,j/24,(j+1)/24,-1+2*i/n,-1+2*i/n+.0032,.043);}}
 for(const s of[-1,1]){for(let j=0;j<14;j++)for(let i=0;i<28;i++){const q=(t,u)=>[u*hx*(1-t),y(t)+.33*Math.pow(Math.abs(u),10)*(1-t)*(1-t),zc+s*end(t)];let a=j*.52/14,c=(j+1)*.52/14,u=-1+i/14,v=-1+(i+1)/14;const pp=[q(a,u),q(a,v),q(c,v),q(c,u)];surf.quad(...(s<0?pp.reverse():pp));}
  const g=new G.Geometry();const pp=[[-hx*.48,y(.52),zc+s*(hz-inset)],[hx*.48,y(.52),zc+s*(hz-inset)],[0,H.ridge,zc+s*(hz-inset)]];g.tri(...(s<0?pp.reverse():pp));mesh('gable-'+s,g,C.red,6);
  group('attic-'+s,()=>{b.box(0,y(.52)+.54,zc+s*(hz-inset+.025),3.6,.9,.09,C.wood,6);for(let i=0;i<7;i++)b.box(-1.65+i*.55,y(.52)+.54,zc+s*(hz-inset+.08),.06,.86,.06,C.gold,6);});
 }
 const under=new G.Geometry();under.quad([-hx,H.eave-.06,zc-hz],[hx,H.eave-.06,zc-hz],[hx,H.eave-.06,zc+hz],[-hx,H.eave-.06,zc+hz]);mesh('roof-soffit',under,C.wood,6);const lip=new G.Geometry();for(const side of[-1,1])for(let i=0;i<60;i++){const u=-1+i/30,v=-1+(i+1)/30;const pts=[[side*hx,H.eave-.06,zc+u*hz],[side*hx,H.eave-.06,zc+v*hz],[side*hx,H.eave+.33*Math.pow(Math.abs(v),10),zc+v*hz],[side*hx,H.eave+.33*Math.pow(Math.abs(u),10),zc+u*hz]];lip.quad(...(side>0?pts.reverse():pts));}for(const side of[-1,1])for(let i=0;i<28;i++){const u=-1+i/14,v=-1+(i+1)/14;const pts=[[u*hx,H.eave-.06,zc+side*hz],[v*hx,H.eave-.06,zc+side*hz],[v*hx,H.eave+.33*Math.pow(Math.abs(v),10),zc+side*hz],[u*hx,H.eave+.33*Math.pow(Math.abs(u),10),zc+side*hz]];lip.quad(...(side<0?pts.reverse():pts));}mesh('eave-edge',lip,C.wood,6);mesh('roof',surf,C.roof,2);tile.detailWidth=.04;mesh('roof-tile-ribs',tile,C.tile,2);
 group('roof-ridges',()=>{b.box(0,H.ridge+.1,zc,.30,.22,2*(hz-inset),C.tile,2);for(const s of[-1,1]){b.beam([0,H.ridge,zc+s*(hz-inset)],[0,H.ridge+.6,zc+s*(hz-inset+.32)],.17,C.tile,2);for(const x of[-1,1])b.beam([x*hx*.48,y(.52),zc+s*(hz-inset)],[0,H.ridge,zc+s*(hz-inset)],.12,C.tile,2);}});
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};Y.Junzhai111={id:ID,render,heights:H,origin:O,rotation:R,width:W,depth:D};
})(YY);
