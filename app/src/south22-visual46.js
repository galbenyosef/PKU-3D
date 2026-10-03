/* Physical south building22, not manifest22. The two roof slopes and the
 * photographed eastern gable replace the inherited shared heren block.
 * Plan, eaves and ornaments are image fits, not a measured survey. */
(function(Y){'use strict';
const A=Y.Architecture30,G=Y.Geo,ID='relation/12815352',prior=A.render;
const P={"centre":[87.50275,674.6455000000001],"rotation":0.049677933097649174,"W":51.2,"D":11.722701602950904,"roofW":52.6,"roofD":13.12,"entryX":-0.8028756950982472,"entryZ":5.862864183206034,"faceSkew":0.005856322958403833,"wallRing":[[-25.54777317911164,6.011277476640334],[-0.8028756950982472,5.862864183206034],[25.653283264757725,5.711424126310399],[25.537370376800702,-5.711424126310571],[-25.6428804624468,-6.011277476640505],[-25.54777317911164,6.011277476640334]]};
const H={base:.45,floor:3.2,eave:10.10,ridge:12.85};
const C={brick:'#91968f',stone:'#b3b4a7',roof:'#69716e',tile:'#8d9589',red:'#863a33',glass:'#5b706c',green:'#3e685d'};
const roofY=v=>H.eave+(H.ridge-H.eave)*Math.pow(Math.max(0,1-Math.abs(v)/(P.roofD/2)),1.43);
function roof(b,x,z,w,d,y,rise,key){
 const main=new G.Geometry(),ribs=new G.Geometry(),end=new G.Geometry(),cap=new G.Geometry(),N=32;
 const profile=v=>y+rise*Math.pow(Math.max(0,1-Math.abs(v)/(d/2)),1.43);
 for(let j=0;j<N;j++){
  const a=-d/2+d*j/N,c=-d/2+d*(j+1)/N,pa=profile(a),pc=profile(c);
  main.quad([x-w/2,pa,z+a],[x-w/2,pc,z+c],[x+w/2,pc,z+c],[x+w/2,pa,z+a]);
  for(let u=-w/2+.10;u<w/2;u+=.24)ribs.quad([x+u-.023,pa+.027,z+a],[x+u-.023,pc+.027,z+c],[x+u+.023,pc+.027,z+c],[x+u+.023,pa+.027,z+a]);
  for(const side of [-1,1]){
   // The hard-gable wall is at the actual wall face, not at the projecting
   // roof tip: an outer closure would hide the attic vent and the three eaves.
   const wallX=x+side*(key==='main'?P.W/2:w/2),q=[[wallX,y,z+a],[wallX,y,z+c],[wallX,pc,z+c],[wallX,pa,z+a]];if(side>0)q.reverse();end.quad(...q);
   cap.quad([x+side*w/2-.075,pa+.08,z+a],[x+side*w/2-.075,pc+.08,z+c],[x+side*w/2+.075,pc+.08,z+c],[x+side*w/2+.075,pa+.08,z+a]);
  }
 }
 const m=(name,g,col,mat)=>b.mesh('south22-'+key+'-'+name,g,0,0,0,1,1,1,col,mat);
 m('two-slopes',main,C.roof,2);ribs.detailWidth=.046;m('tile-rows',ribs,C.tile,2);m('hard-gable',end,C.brick,30);m('gable-coping',cap,C.tile,2);
 b.box(x,y+rise+.055,z,w,.16,.23,C.tile,2);
 for(const s of[-1,1]){b.box(x,y-.12,z+s*d/2,w,.24,.19,C.red,6);for(let u=-w/2+.12;u<w/2;u+=.29)b.box(x+u,y-.11,z+s*(d/2-.17),.085,.12,.49,C.green,6);}
}
function window(b,x,y,z,w=1.9,h=1.98){
 b.box(x,y,z,w+.14,h+.16,.10,C.red,6);b.box(x,y,z+.065,w,h,.040,C.glass,5);
 for(const q of[-1/6,1/6])b.box(x+q*w,y+h*.12,z+.099,.052,h*.73,.04,C.red,6);
 b.box(x,y-h*.245,z+.100,w,.055,.05,C.red,6);b.box(x,y-h*.375,z+.103,.052,h*.25,.04,C.red,6);
 b.box(x,y+h*.55,z-.010,w+.32,.20,.18,C.stone,10);b.box(x,y-h*.54,z+.11,w+.24,.15,.28,C.stone,10);
}
function archedDoor(b){
 const door=new G.Geometry(),rim=new G.Geometry(),half=.87,spring=2.2,base=.36;
 const pts=[[-half,base,0],[half,base,0],[half,spring,0]];for(let j=1;j<=24;j++){const a=j/24*Math.PI;pts.push([half*Math.cos(a),spring+half*Math.sin(a),0]);}pts.push([-half,base,0]);
 for(let j=0;j+1<pts.length;j++)door.tri([0,1.6,.045],pts[j],pts[j+1]);
 for(let j=0;j<24;j++){const a=j/24*Math.PI,c=(j+1)/24*Math.PI;rim.quad([Math.cos(a)*half,spring+Math.sin(a)*half,.07],[Math.cos(a)*(half+.16),spring+Math.sin(a)*(half+.16),.07],[Math.cos(c)*(half+.16),spring+Math.sin(c)*(half+.16),.07],[Math.cos(c)*half,spring+Math.sin(c)*half,.07]);}
 b.mesh('south22-gable-arched-door',door,0,0,0,1,1,1,C.red,6);b.mesh('south22-gable-arch-stone',rim,0,0,0,1,1,1,C.stone,10);
 for(const x of[-.91,.91])b.box(x,1.3,.065,.16,2.3,.14,C.stone,10);
 for(const s of[-1,1])b.box(s*.43,1.67,.11,.69,.91,.035,C.glass,5);
 b.box(0,1.38,.14,.085,2.0,.06,C.red,6);b.box(0,2.23,.14,1.7,.075,.06,C.red,6);
}
function gable(b,side){b.local(side*P.W/2,0,0,side*Math.PI/2,()=>{
 for(const x of[-2.20,0,2.20]){window(b,x,5.05,.09,x===0?1.85:1.38,2.05);window(b,x,8.18,.09,x===0?1.85:1.38,x===0?2.65:2.05);}
 for(const x of[-3.2,-1.15,1.15,3.2])b.box(x,6.3,.17,.24,6.5,.34,C.stone,10);
 b.local(0,0,.11,0,()=>archedDoor(b));
 b.box(0,3.68,.91,6.7,.22,1.72,C.stone,10);
 for(const x of[-3.18,3.18])b.box(x,2.0,.73,.28,3.4,.32,C.stone,10);
 // Observed second-floor solid ornamental parapet, with low open top rail.
 // The new west gallery absorbs this landing. Keep its outer north edge,
 // while opening the overlapping parapet into the continuous gallery deck.
 if(side===1){
  b.box(0,4.11,1.74,6.65,.67,.17,C.stone,10);b.box(0,4.60,1.74,6.65,.13,.18,C.stone,10);
  for(const x of[-3.2,-1.6,0,1.6,3.2])b.box(x,4.44,1.74,.13,.68,.18,C.stone,10);
  for(const x of[-3.24,3.24]){b.box(x,4.12,.93,.17,.68,1.66,C.stone,10);b.box(x,4.60,.93,.18,.13,1.66,C.stone,10);}
 }else{
  b.box(2.50,4.11,1.74,1.45,.67,.17,C.stone,10);b.box(2.50,4.60,1.74,1.45,.13,.18,C.stone,10);
  b.box(3.24,4.12,.93,.17,.68,1.66,C.stone,10);b.box(3.24,4.60,.93,.18,.13,1.66,C.stone,10);
 }
 for(const [x,w,y] of[[-2.24,2.22,9.74],[0,3.0,10.26],[2.24,2.22,9.74]]){
  const q=new G.Geometry(),fascia=new G.Geometry(),N=20,profile=u=>y+.38*Math.pow(Math.abs(u)/(w/2),3);
  for(let j=0;j<N;j++){const u=-w/2+w*j/N,v=-w/2+w*(j+1)/N,a=profile(u),c=profile(v);q.quad([x+u,a,1.02],[x+v,c,1.02],[x+v,c+.38,.04],[x+u,a+.38,.04]);fascia.quad([x+u,a-.17,1.02],[x+v,c-.17,1.02],[x+v,c,1.02],[x+u,a,1.02]);}
  b.mesh('south22-gable-three-decorative-eaves-'+x,q,0,0,0,1,1,1,C.roof,2);b.mesh('south22-gable-curved-red-fascia-'+x,fascia,0,0,0,1,1,1,C.red,6);for(let u=-w/2+.12;u<w/2;u+=.26)b.box(x+u,profile(u)-.11,.67,.07,.12,.7,C.green,6);
 }
 // Round red attic vent is observed in the east gable original.
 const disc=new G.Geometry();for(let j=0;j<24;j++){const a=j/24*Math.PI*2,c=(j+1)/24*Math.PI*2;disc.tri([0,11.70,.025],[.24*Math.cos(a),11.70+.16*Math.sin(a),.025],[.24*Math.cos(c),11.70+.16*Math.sin(c),.025]);}b.mesh('south22-attic-vent',disc,0,0,0,1,1,1,C.red,6);
 });}
// South doorway only: preserve the original ground ring and all other faces.
function southDoorWall(ground){
 const original=Y.Footprints.walls(ground,.5,H.eave),g=new G.Geometry(),r=P.wallRing,cs=Math.cos(P.faceSkew),sn=Math.sin(P.faceSkew),u=p=>cs*(p[0]-P.entryX)-sn*(p[1]-P.entryZ);
 // The first two ring segments share the independently registered entry node.
 g.v.push(...original.v.slice(2*6*8));
 for(let i=0;i<2;i++){const a=r[i],c=r[i+1],ua=u(a),uc=u(c),cuts=[ua,...[-1.45,1.45].filter(x=>x>ua&&x<uc),uc],at=(x,y)=>{const t=(x-ua)/(uc-ua);return[a[0]+(c[0]-a[0])*t,y,a[1]+(c[1]-a[1])*t];},panel=(a,c,lo,hi)=>g.quad(at(a,lo),at(c,lo),at(c,hi),at(a,hi));
  for(let j=1;j<cuts.length;j++){const lo=cuts[j-1],hi=cuts[j],mid=(lo+hi)/2;if(mid>-1.45&&mid<1.45){panel(lo,hi,.5,.6);panel(lo,hi,3.25,H.eave);}else panel(lo,hi,.5,H.eave);}
 }
 return g;
}
function southDoor(b){
 const box=(x,y,z,w,h,d,c=C.red,mat=6)=>b.box(x,y,z,w,h,d,c,mat);
 const pane=(x0,x1,y0,y1)=>{box((x0+x1)/2,(y0+y1)/2,.13,x1-x0,y1-y0,.04,C.glass,5);};
 // Paired leaves, narrow glazed sidelights and a wide upper light are visible
 // in the institute's own 2023 doorway photo. Absolute sizes remain fitted.
 for(const x of[-1.41,-1.04,1.04,1.41])box(x,1.925,.10,.08,2.65,.16);
 box(0,1.625,.10,.08,2.05,.16);
 for(const y of[.64,2.65,3.21])box(0,y,.10,2.9,.08,.16);
 pane(-1.37,-1.08,1.43,2.61);pane(1.08,1.37,1.43,2.61);
 pane(-1,-.04,1.43,2.61);pane(.04,1,1.43,2.61);
 pane(-1,1,2.69,3.17);pane(-1.37,-1.08,2.69,3.17);pane(1.08,1.37,2.69,3.17);
 for(const [x0,x1]of[[-1.37,-1.08],[-1,-.04],[.04,1],[1.08,1.37]]){
  // Bounded inset timber panels; no solid plate behind any glazing.
  for(const [lo,hi]of[[.68,1.05],[1.09,1.39]])box((x0+x1)/2,(lo+hi)/2,.075,x1-x0,hi-lo,.10);
  for(const y of[1.07,1.41])box((x0+x1)/2,y,.105,x1-x0,.04,.16);
  for(const y of[1.84,2.24])box((x0+x1)/2,y,.158,x1-x0,.025,.025);
 }
 // The short neutral reveal joins the frame to the source wall, not a room fit.
 for(const x of[-1.45,1.45])box(x,1.925,-.02,.025,2.65,.26,C.brick,30);
 box(0,3.25,-.02,2.9,.025,.26,C.brick,30);
 box(.09,1.51,.22,.035,.18,.05,'#303533',29);box(.17,1.56,.235,.18,.035,.045,'#303533',29);
 box(.87,2.68,.22,.19,.055,.07,'#b8c0bb',29);b.beam([.91,2.71,.22],[.98,2.79,.18],.012,'#b8c0bb',29);
}
function render(b,f){b.id=f.properties.pickId;
 // Preserve the two existing atlas allocations so later campus labels keep
 // their exact UVs. The old floating facade lettering is not drawn again.
 const add=b.e.add;b.e.add=()=>{};try{b.lettering('22号楼',0,0,0,1,1,0,'#663d34');b.lettering('外国哲学研究所',0,0,0,1,1,0,'#775749');}finally{b.e.add=add;}
 b.local(P.centre[0],0,P.centre[1],P.rotation,()=>{
 const ground={type:'Polygon',coordinates:[P.wallRing]};
 b.mesh('south22-ground-plinth-walls',Y.Footprints.walls(ground,0,.6),0,0,0,1,1,1,C.stone,10);b.mesh('south22-ground-plinth-top',Y.Footprints.surface(ground,.6),0,0,0,1,1,1,C.stone,10);
 b.mesh('south22-original-ground-walls',southDoorWall(ground),0,0,0,1,1,1,C.brick,30);b.mesh('south22-wall-top',Y.Footprints.surface(ground,H.eave),0,0,0,1,1,1,C.brick,30);
 for(const side of[-1,1])b.local(0,0,side*P.D/2,side<0?Math.PI-P.faceSkew:P.faceSkew,()=>{
  for(const y of[.85,3.64,6.84,9.94]){
   if(side>0&&y===.85){const center=P.entryX*Math.cos(P.faceSkew)-(P.entryZ-P.D/2)*Math.sin(P.faceSkew);for(const[a,c]of[[-P.W/2,center-1.49],[center+1.49,P.W/2]])b.box((a+c)/2,y,.10,c-a,.19,.22,C.stone,10);}
   else b.box(0,y,.10,P.W,.19,.22,C.stone,10);
  }
  for(let k=-6;k<=6;k++)for(let f=0;f<3;f++){if(side>0&&k===0&&f===0)continue;window(b,k*3.58,1.88+H.floor*f,.105,1.85,1.95);}
  for(const k of[-6.5,-4.5,-2.5,-.5,.5,2.5,4.5,6.5]){
   const x=k*3.58,doorCenter=P.entryX*Math.cos(P.faceSkew)-(P.entryZ-P.D/2)*Math.sin(P.faceSkew);
   // The inherited regular pier at the left leaf is absent in the named door
   // photo. Trim only its doorway-height intersection, preserving both ends.
   if(side>0&&Math.abs(x-doorCenter)<1.45+.145){for(const[lo,hi]of[[.415,.6],[3.25,10.045]])b.box(x,(lo+hi)/2,.20,.29,hi-lo,.27,C.stone,10);}
   else b.box(x,5.23,.20,.29,9.63,.27,C.stone,10);
  }
 });
 roof(b,0,0,P.roofW,P.roofD,H.eave,H.ridge-H.eave,'main');
 for(const side of[-1,1]){gable(b,side);const x=side*(P.roofW/2-.15);for(const[a,c]of[[[x,12.95,0],[x-side*.10,13.16,0]],[[x-side*.10,13.16,0],[x-side*.42,13.25,0]],[[x-side*.42,13.25,0],[x-side*.63,13.13,0]]])b.beam(a,c,.13,C.tile,2);}
 // South door belongs to the courtyard; the gable arched door is distinct.
 b.local(P.entryX,0,P.entryZ+.13,P.faceSkew,()=>{
  southDoor(b);
  for(const x of[-1.75,1.75])b.box(x,1.87,.37,.38,3.0,.73,C.brick,30);
  roof(b,0,.58,4.4,1.45,3.5,.55,'south-entry');
  for(let j=0;j<3;j++)b.box(0,.08+j*.12,1.28-j*.31,4.12,.16,.64,C.stone,10);
 });
 });return{id:ID,strategy:'south22-independent-hard-gable',floors:3,storeyHeight:3.2,totalHeightApproximate:13,heightIsSurvey:false,roof:'two-curved-slopes-with-ridge',eastGable:'three-decorative-eaves-arched-entry-and-balcony',southEntry:'courtyard',planFit:true,allFacadesVerified:false};}
A.render=(b,f,add)=>f.properties.id===ID?render(b,f):prior(b,f,add);
Y.South22Visual46={id:ID,render,plan:P,height:H,roofY};
})(YY);
