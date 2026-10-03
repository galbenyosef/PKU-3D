/* V37: direct, photo-led geometry in the shared metre frame.
   Zhihua: FEI Architects 2023 built work, east/west photos and ground plan.
   Nongyuan: BRDR exterior photographs, checked against the 2025 reopening photos.
   Dimensions of visible details are estimates; no global fitting or footprint clipping. */
(function(Y){'use strict';const G=Y.Geo,PI=Math.PI;
const palette={wall:'#e5d6b7',pier:'#eee1c5',stone:'#c9c5b7',roof:'#9b9d93',glass:'#52666a',frame:'#65594e'};
function box(b,key,x,y,z,w,h,d,col=palette.wall,mat=24){b.mesh('v37-'+key,b.geo('box',G.box),x,y,z,w,h,d,col,mat);}
function window(b,x,y,z,w,h,r=0,{frame=palette.frame,glass=palette.glass,vertical=2,horizontal=1}={}){
 b.local(x,y,z,r,()=>{
  box(b,'window-recess',0,0,-.045,w+.12,h+.12,.16,'#514f47');
  box(b,'window-glass',0,0,.045,w-.13,h-.13,.07,glass,28);
  for(const q of[-1,1]){box(b,'window-jamb',q*(w/2-.035),0,.13,.07,h,.14,frame,29);box(b,'window-head',0,q*(h/2-.035),.13,w,.07,.14,frame,29);}
  for(let k=1;k<vertical;k++)box(b,'window-mullion',-w/2+w*k/vertical,0,.14,.055,h-.07,.14,frame,29);
  for(let k=1;k<=horizontal;k++)box(b,'window-transom',0,-h/2+h*k/(horizontal+1),.14,w-.07,.05,.13,frame,29);
 });
}
function flatBlock(b,key,x0,z0,x1,z1,h,{tone=palette.wall,parapet=.5,base=.15,wall=true}={}){
 const x=(x0+x1)/2,z=(z0+z1)/2,w=x1-x0,d=z1-z0;
 if(wall)box(b,key+'-wall',x,(h+base)/2,z,w,h-base,d,tone);
 box(b,key+'-roof',x,h-.08,z,w-.08,.15,d-.08,palette.roof);
 for(const side of[-1,1]){box(b,key+'-parapet-x',x+side*(w/2-.11),h+parapet/2-.12,z,.22,parapet,d,tone);box(b,key+'-parapet-z',x,h+parapet/2-.12,z+side*(d/2-.11),w,parapet,.22,tone);}
}
function facade(b,x,z,r,width,h,floors,bays,{piers=true,first=2.0,fh=4.0,windowW,windowH=1.65,skip}={}){
 b.local(x,0,z,r,()=>{
  for(let i=0;i<bays;i++){const xx=-width/2+(i+.5)*width/bays;
   for(let f=0;f<floors;f++){if(skip?.(i,f))continue;window(b,xx,first+f*fh,.04,windowW||width/bays*.62,windowH,0,{vertical:3,horizontal:1});}
  }
  if(piers)for(let i=0;i<=bays;i++)box(b,'zhihua-pilaster',-width/2+i*width/bays,h/2,.28,.38,h,.65,palette.pier);
  if(piers)box(b,'zhihua-lintel',0,h-.42,.25,width+.35,.78,.66,palette.pier);
  // Fine vertical joints, independent of the storey rhythm.
  for(let i=1;i<Math.ceil(width/.7);i++)box(b,'zhihua-panel-joint',-width/2+i*.7,h/2,.012,.012,h-.8,.014,'#cfc1a6');
 });
}
function verticalLetters(b,text,x,y,z,r=0,size=1.0){for(const [i,ch]of [...text].entries())b.lettering(ch,x,y-i*size*1.22,z,size,size,r,'#858577');}
function stairs(b,key,x,z,width,run,top,r=0,{n=24,solidRail=false,solidRailSide=null}={}){
 b.local(x,0,z,r,()=>{
  for(let i=0;i<n;i++){const y=top*(i+1)/n,zz=run/2-(i+.5)*run/n;box(b,key+'-tread',0,y/2,zz,width,y,run/n+.014,palette.stone);}
  for(const side of[-1,1]){
   if(solidRail&&(solidRailSide===null||solidRailSide===side)){
    const gg=b.geo(key+'-solid-cheek-'+side,()=>{const g=new G.Geometry(),x=side*(width/2+.10),d=.17;const profile=[[run/2,0],[run/2,1.05],[-run/2,top+1.05],[-run/2,0]];
     for(const offset of[-d,d])g.quad([x+offset,profile[0][1],profile[0][0]],[x+offset,profile[1][1],profile[1][0]],[x+offset,profile[2][1],profile[2][0]],[x+offset,profile[3][1],profile[3][0]]);
     g.quad([x-d,1.05,run/2],[x+d,1.05,run/2],[x+d,top+1.05,-run/2],[x-d,top+1.05,-run/2]);
     for(const [z,h]of[[run/2,1.05],[-run/2,top+1.05]])g.quad([x-d,0,z],[x+d,0,z],[x+d,h,z],[x-d,h,z]);
     g.quad([x-d,0,run/2],[x-d,0,-run/2],[x+d,0,-run/2],[x+d,0,run/2]);return g;});
    b.mesh(key+'-solid-cheek-'+side,gg,0,0,0,1,1,1,palette.wall,24);
   }else{
    for(const dy of[.45,.95])b.beam([side*width/2,dy,run/2],[side*width/2,top+dy,-run/2],.035,'#b6bfb7',29);
    for(let i=0;i<=8;i++)box(b,key+'-rail-post',side*width/2,top*i/8+.5,run/2-run*i/8,.06,1,.06,'#aebbb2',29);
   }
  }
 });
}
const zhihuaParts=[
 {key:'north-range',rect:[-23.2,-36.6,19.5,-21.7],h:16.45},
 {key:'north-west-end',rect:[-38.25,-34.5,-23.2,-23.45],h:16.45},
 {key:'north-east-end',rect:[19.5,-34.15,34.55,-24.4],h:16.45},
 {key:'west-north-link',rect:[-28.25,-23.45,-21.05,-15.45],h:16.45},
 {key:'west-main',rect:[-29.5,-15.45,-21.05,12.9],h:20.28},
 {key:'west-south-link',rect:[-28.15,12.9,-20.2,22.55],h:16.45},
 {key:'south-range',rect:[-24.1,21.02,24.2,36.36],h:16.45},
 {key:'south-west-end',rect:[-38.35,22.65,-24.1,34.75],h:16.45},
 {key:'south-east-end',rect:[24.2,20.95,38.3,33.55],h:16.45},
 {key:'auditorium',rect:[-21.05,-14.05,6.78,10.2],h:8.7},
 {key:'east-foyer',rect:[6.78,-17.65,25.55,11.75],h:8.6}
];
function zhihua(b,f){
 // All coordinates here are local east/south, with only a rigid map rotation.
 for(const p of zhihuaParts)flatBlock(b,'zhihua-'+p.key,...p.rect,p.h,{parapet:p.key==='west-main'?.5:.4});
 // Four-storey north/south ranges, with recessed brown frames and thin cream piers.
 for(const [z,r,w,x]of[[-36.68,PI,42.7,-1.85],[-21.60,0,41.35,-.38],[36.48,0,48.3,.05],[20.91,PI,44.3,1.95]])facade(b,x,z,r,w,16.45,4,10,{first:2,fh:3.9,windowH:1.6});
 for(const [x,z,w]of[[-30.7,-34.59,15],[-30.9,34.85,14.4],[26.95,-34.24,15],[31.15,33.66,14.3]])facade(b,x,z,z<0?PI:0,w,16.45,4,3,{first:2,fh:3.9,windowH:1.6});
 // Wing ends are mostly blank in the east photograph, not a repeated window grid.
 for(const [x,z,d]of[[-38.35,-28.95,11.05],[-38.45,28.7,12.1]])facade(b,x,z,-PI/2,d,16.45,4,2,{first:2,fh:3.9,windowH:1.6,piers:false});
 // Western five-storey entrance bar: ground glazing plus four upper window rows.
 b.local(-29.58,0,-1.275,-PI/2,()=>{
  facade(b,0,0,0,28.35,20.65,4,7,{first:6.0,fh:3.9,windowW:3.0,windowH:1.75});
  for(let i=0;i<7;i++)window(b,-12.15+i*4.05,2.25,.15,3.55,3.6,0,{vertical:2,horizontal:1});
  box(b,'zhihua-west-canopy',0,4.28,1.55,30.0,.30,3.7,'#d6cfbb');
  for(const x of[-12.1,-8.05,-4,0,4,8.05,12.1])box(b,'zhihua-west-entry-column',x,2.05,2.68,.28,4.1,.34,palette.pier);
  for(let i=0;i<5;i++)box(b,'zhihua-west-stair',0,.09*(i+1),3.75-i*.3,10,.18*(i+1),.34,palette.stone);
 });
 facade(b,-20.95,-1.275,PI/2,28.35,20.28,4,7,{first:6,fh:3.9,windowW:2.8,windowH:1.75,piers:false});
 // Recessed shoulders and the upright lettering documented at the west entrance.
 for(const [z,d]of[[-19.45,8.0],[17.73,9.65]])facade(b,-28.32,z,-PI/2,d,16.45,4,1,{first:2,fh:3.9,windowW:1.65,piers:false});
 b.local(-28.37,0,-20.0,-PI/2,()=>verticalLetters(b,'智华楼',1.7,13.0,.12,0,1.0));
 b.local(-38.43,0,28.7,-PI/2,()=>verticalLetters(b,'数学科学学院',-3.7,14.2,.12,0,.68));
 // Low eastern multi-purpose hall with vertical white piers and two-storey glass.
 b.local(25.66,0,-2.95,PI/2,()=>{
  for(let i=0;i<9;i++){const x=-13.1+i*3.275;window(b,x,4.35,.08,i%3===1?1.7:1.4,7.25,0,{vertical:2,horizontal:2});}
  for(let i=0;i<=9;i++)box(b,'zhihua-east-hall-pier',-14.7+i*3.27,4.45,.23,.46,8.6,.48,'#eee9da');
  box(b,'zhihua-east-hall-lintel',0,8.37,.20,29.45,.55,.55,'#eee9da');
  box(b,'zhihua-east-hall-floorband',0,4.40,.12,29.4,.24,.30,'#ded8c8');
 });
 // The auditorium roof is low and gently barrel-shaped, separate from the flat wings.
 const vault=b.geo('zhihua37-auditorium-vault',()=>{const g=new G.Geometry();for(let i=0;i<48;i++){const z=-14.05+24.25*i/48,zz=-14.05+24.25*(i+1)/48,y=q=>8.77+1.65*Math.sin((q+14.05)/24.25*PI);g.quad([-20.8,y(z),z],[6.6,y(z),z],[6.6,y(zz),zz],[-20.8,y(zz),zz]);}return g;});
 b.mesh('zhihua37-auditorium-vault',vault,0,0,0,1,1,1,'#a8aca1',24);
 // Paired exterior escape stairs at the east ends, a conspicuous part of the new facade.
 for(const [x,z,dir]of[[36.12,-29.25,1],[39.88,27.15,-1]]){
  stairs(b,'zhihua37-escape-'+dir,x,z,2.7,8.2,3.75,dir<0?PI:0,{n:23,solidRail:true});
  b.local(x,3.75,z,0,()=>stairs(b,'zhihua37-escape-upper-'+dir,0,0,2.7,8.2,3.75,dir<0?0:PI,{n:23,solidRail:true}));
  box(b,'zhihua-east-stair-landing',x,3.6,z-dir*4.65,3.2,.3,1.2,palette.wall);
 }
 b.local(34.69,0,-29.2,PI/2,()=>verticalLetters(b,'智华楼',2.4,14.5,.12,0,.9));
 // Thin stone plinths articulate the base without capping the two real courtyards.
 for(const p of zhihuaParts){const [x0,z0,x1,z1]=p.rect;box(b,'zhihua-plinth',(x0+x1)/2,.24,(z0+z1)/2,x1-x0+.1,.28,z1-z0+.1,'#b7b7a8');}
 return {parts:zhihuaParts.length,westFloors:5,wingFloors:4,eastHallFloors:2,independentStairs:2};
}
const nongForecourt={base:.12,top:.825,left:-23.6,right:3.85,front:-49.9,back:-39,rampOuter:-25.3,rampStart:-47.7,rampEnd:-39,landingEnd:-37.2};
const nongNorthEntry={x:-14.25,w:4.2,base:nongForecourt.top,h:3.75,front:-39.78,rear:-35.8,curtainH:2.72};
function nongNorthForecourt(b,f){
 const C=nongForecourt,tone='#b8b7ab',height=C.top-C.base,mid=(C.base+C.top)/2,width=C.right-C.left;
 box(b,'nong-forecourt-platform',(C.left+C.right)/2,mid,(C.front+C.back)/2,width,height,C.back-C.front,tone);
 // Five broad risers lead to the raised entrance. Heights and run are fitted
 // to the dated exterior photographs; this is not an accessibility survey.
 for(let i=1;i<=5;i++){
  const y=C.base+height*i/5,z=C.front-1.65+(i-.5)*.33;
  box(b,'nong-forecourt-step',(C.left+C.right)/2,(C.base+y)/2,z,width,y-C.base,.33,tone);
  box(b,'nong-forecourt-nosing',(C.left+C.right)/2,y-.012,z-.145,width,.024,.04,'#d0cec1');
 }
 const rw=C.left-C.rampOuter,rx=(C.left+C.rampOuter)/2;
 box(b,'nong-ramp-upper-landing',rx,mid,(C.front+C.rampStart)/2,rw,height,C.rampStart-C.front,tone);
 const ramp=b.geo('nong37-side-ramp',()=>{const g=new G.Geometry(),a=C.rampOuter,c=C.left,z=C.rampStart,zz=C.rampEnd;
  g.quad([a,C.top,z],[c,C.top,z],[c,C.base,zz],[a,C.base,zz]);
  for(const x of[a,c])g.tri([x,C.base,z],[x,C.top,z],[x,C.base,zz]);
  g.quad([a,C.base,z],[c,C.base,z],[c,C.top,z],[a,C.top,z]);return g;});
 b.mesh('nong37-side-ramp',ramp,0,0,0,1,1,1,tone,24);
 box(b,'nong-ramp-bottom-landing',rx,C.base-.035,(C.rampEnd+C.landingEnd)/2,rw,.07,C.landingEnd-C.rampEnd,tone);
 for(const x of[C.rampOuter+.06,C.left-.06]){
  for(const dh of[.48,.94])b.beam([x,C.top+dh,C.rampStart],[x,C.base+dh,C.rampEnd],.027,'#a7b4b0',29);
  for(let i=0;i<=6;i++){const t=i/6,y=C.top-height*t,z=C.rampStart+(C.rampEnd-C.rampStart)*t;box(b,'nong-ramp-post',x,y+.48,z,.05,.96,.05,'#a7b4b0',29);}
 }
 for(const dh of[.48,.94])b.beam([C.rampOuter+.06,C.top+dh,C.front],[C.rampOuter+.06,C.top+dh,C.rampStart],.027,'#a7b4b0',29);
 box(b,'nong-ramp-corner-post',C.rampOuter+.06,C.top+.48,C.front,.05,.96,.05,'#a7b4b0',29);
 box(b,'nong-forecourt-apron',(C.rampOuter+C.right)/2,C.base-.035,C.front-2.65,C.right-C.rampOuter,.07,2,tone);
 // Join the lower ramp landing to the actual east edge of Nongyuan West Road.
 const road=Y.CAMPUS?.features?.find(q=>q.properties.id==='way/595764178');
 if(road){const line=road.geometry.coordinates,a=line[0],c=line[1],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),half=road.properties.width/2;
  const edgeA=[a[0]+dz/len*half,a[1]-dx/len*half],edgeC=[c[0]+dz/len*half,c[1]-dx/len*half];
  for(const [key,z0,z1]of[['ramp-road',C.rampEnd,C.landingEnd],['apron-road',C.front-3.65,C.front-1.65]]){
  const ends=[z0,z1].map(z=>b.world([C.rampOuter,C.base,z]));
  const edge=ends.map(p=>{const t=Math.max(0,Math.min(1,((p[0]-edgeA[0])*dx+(p[2]-edgeA[1])*dz)/(len*len)));return[edgeA[0]+t*dx,C.base,edgeA[1]+t*dz];});
  const local=p=>{const x=p[0]-b.origin[0],z=p[2]-b.origin[2];return[Math.cos(b.rotation)*x-Math.sin(b.rotation)*z,p[1]-b.origin[1],Math.sin(b.rotation)*x+Math.cos(b.rotation)*z];};
  const g=new G.Geometry();g.quad(...[ends[0],ends[1],edge[1],edge[0]].map(local));b.mesh('nong37-'+key+'-connection',g,0,0,0,1,1,1,tone,24);
  }
 }
 b.noPlant((C.rampOuter+C.right)/2,(C.front-3.65+C.landingEnd)/2,C.right-C.rampOuter,C.landingEnd-C.front+3.65);
}
function nongNorthVestibule(b){
 const E=nongNorthEntry,tone='#465a62',glass='#748c92',half=E.w/2,inner=half-.5,depth=.78;
 b.local(E.x,E.base,E.front,PI,()=>{
  box(b,'nong-entry-floor',0,-.065,-1.99,E.w,.13,3.98,palette.stone);
  box(b,'nong-entry-rear',0,E.h/2,-3.93,E.w,E.h,.05,'#333b38');
  box(b,'nong-entry-soffit',0,E.h-.04,-depth/2,E.w,.08,depth,tone,29);
  for(const x of[-half,half]){
   box(b,'nong-entry-jamb',x,E.h/2,0,.09,E.h,.12,tone,29);
   box(b,'nong-entry-return-glass',x,E.h/2,-depth/2,.025,E.h-.14,depth-.08,glass,28);
   box(b,'nong-entry-return-foot',x,.045,-depth/2,.08,.09,depth,tone,29);
  }
  for(const y of[.045,E.curtainH,E.h-.045])box(b,'nong-entry-crossbar',0,y,0,E.w,.09,.12,tone,29);
  for(const x of[-inner,inner])box(b,'nong-entry-sidelight-frame',x,E.h/2,0,.07,E.h,.12,tone,29);
  for(const side of[-1,1])box(b,'nong-entry-sidelight',side*(half-.25),E.curtainH/2,0,.41,E.curtainH-.12,.025,glass,28);
  for(const [a,c]of[[-half,-inner],[-inner,0],[0,inner],[inner,half]])box(b,'nong-entry-transom',(a+c)/2,(E.curtainH+E.h)/2,0,c-a-.09,E.h-E.curtainH-.10,.025,glass,28);
  box(b,'nong-entry-transom-mullion',0,(E.curtainH+E.h)/2,.025,.065,E.h-E.curtainH,.10,tone,29);
  // Both dated exterior sources show hanging strip curtains; concealed door
  // leaves and handles are not reconstructed from the curtains' vertical lines.
  const strips=b.geo('nong37-north-strip-curtain',()=>{const g=new G.Geometry(),count=30,step=inner*2/count;
   for(let i=0;i<count;i++){const x=-inner+i*step,w=step-.009,z=-.07-(i%3)*.006,low=.055+(i%4)*.004;
    g.quad([x,low,z],[x+w,low,z-.012],[x+w,E.curtainH-.06,z],[x,E.curtainH-.06,z]);
   }return g;});
  b.mesh('nong37-north-strip-curtain',strips,0,0,0,1,1,1,'#819597',28);
 });
}
function nongyuan(b,f){
 const brick='#aaa394',frame='#77796e',glass='#4c6870';
 nongNorthForecourt(b,f);
 // L-shaped dining blocks leave the southwest recess open. Northern front is recessed.
 flatBlock(b,'nong-main',-23.6,-39.0,23.55,19.65,12.15,{tone:brick,parapet:.25,wall:false});
 const E=nongNorthEntry,left=E.x-E.w/2,right=E.x+E.w/2,head=E.base+E.h;
 for(const [a,c]of[[-23.6,left],[right,23.55]])box(b,'nong-main-wall',(a+c)/2,6.15,-9.675,c-a,12,58.65,brick);
 box(b,'nong-main-wall-head',E.x,(head+12.15)/2,-9.675,E.w,12.15-head,58.65,brick);
 box(b,'nong-main-wall-rear',E.x,(head+.15)/2,(E.rear+19.65)/2,E.w,head-.15,19.65-E.rear,brick);
 box(b,'nong-main-entry-threshold',E.x,(E.base+.15)/2,-37.4,E.w,E.base-.15,3.2,palette.stone);
 flatBlock(b,'nong-south-wing',-7.15,19.65,23.5,50.3,12.15,{tone:brick,parapet:.25});
 // Low pitched roof masses from the design photograph, set back behind the parapets.
 for(const [key,x0,z0,x1,z1]of[['main',-22.7,-37.5,22.6,17.9],['south',-6.3,21.1,22.6,49.1]]){
  const zm=(z0+z1)/2,y=12.20,rise=2.2;
  const roof=b.geo('nong37-gable-'+key,()=>{const g=new G.Geometry();g.quad([x0,y,z0],[x0,y+rise,zm],[x1,y+rise,zm],[x1,y,z0]);g.quad([x1,y,z1],[x1,y+rise,zm],[x0,y+rise,zm],[x0,y,z1]);g.tri([x0,y,z0],[x0,y,z1],[x0,y+rise,zm]);g.tri([x1,y,z1],[x1,y,z0],[x1,y+rise,zm]);return g;});
  b.mesh('nong37-gable-'+key,roof,0,0,0,1,1,1,'#626762',24);
  for(let i=0;i<=Math.round((x1-x0)/.6);i++){const x=x0+(x1-x0)*i/Math.round((x1-x0)/.6);b.beam([x,y+.07,z0],[x,y+rise+.07,zm],.028,'#777c74',38);b.beam([x,y+rise+.07,zm],[x,y+.07,z1],.028,'#777c74',38);}
 }
 // Slim brick courses instead of broad white office-style floor bands.
 for(const [x,z,r,w]of[[-23.72,-10,-PI/2,57.8],[23.67,4.9,PI/2,90.1],[8.2,50.42,0,30.6]])b.local(x,0,z,r,()=>{
  for(let i=1;i<58;i++)box(b,'nong-brick-course',0,.21*i,.018,w,.012,.022,'#979487');
  const bays=Math.floor(w/6.4);for(let i=0;i<bays;i++)for(let floor=0;floor<3;floor++)window(b,-w/2+(i+.5)*w/bays,2.0+floor*3.75,.06,2.65,1.5,0,{frame,glass,vertical:2,horizontal:1});
 });
 // South-west recess entrance: glass replaces the blank ground and first-floor wall.
 b.local(-15.42,0,19.79,0,()=>{
  // BRDR low-canopy facade: upper glazing and a lower curtained entrance.
  // Keep the existing map placement/envelope; dimensions are photo-fitted,
  // not surveyed. Curtains do not establish hidden door leaves or hardware.
  window(b,0,(3.40+6.725)/2,.12,10.9,6.725-3.40,0,{frame,glass,vertical:6,horizontal:1});
  for(const x of[-3.775,3.775])window(b,x,1.90,.12,3.35,2.60,0,{frame,glass,vertical:2,horizontal:1});
  for(const x of[-2.10,2.10])box(b,'window-jamb',x,1.90,.25,.07,2.60,.14,frame,29);
  box(b,'window-head',0,3.165,.25,4.20,.07,.14,frame,29);
  const southCurtain=b.geo('nong37-south-strip-curtain',()=>{const g=new G.Geometry(),count=30,inner=4.06,step=inner/count;
   for(let i=0;i<count;i++){const x=-inner/2+i*step,w=step-.009,z=.19-(i%3)*.006,low=.64+(i%4)*.004;
    g.quad([x,low,z],[x+w,low,z-.012],[x+w,3.11,z],[x,3.11,z]);
   }return g;});
  b.mesh('nong37-south-strip-curtain',southCurtain,0,0,0,1,1,1,'#819597',28);
  box(b,'nong-south-entry-canopy',0,3.3,1.65,12.5,.20,3.5,'#aaa99d');
  for(const x of[-5.35,5.35])box(b,'nong-south-entry-column',x,1.60,2.83,.20,3.20,.20,'#a6a99b');
  for(let i=0;i<5;i++)window(b,-3.2+i*1.6,9.55,.1,.37,1.8,0,{frame,glass,vertical:1,horizontal:0});
  // Extend the existing highest tread into the hard landing, without a
  // new instance or a slope. Its .60 top meets the refitted entrance base.
  for(let i=0;i<4;i++){
   const front=2.685,rear=-.08,z=i===3?(front+rear)/2:3.40-i*.29,d=i===3?front-rear:.31;
   box(b,'nong-south-entry-step',0,.075*(i+1),z,10.5,.15*(i+1),d,palette.stone);
  }
  b.lettering('农园',0,7.45,.12,2.35,.8,0,'#696b61');
 });
 // North hall: two-storey glazing behind a deep, high canopy.
 b.local(0,0,-39.15,PI,()=>{
  for(let i=0;i<10;i++){
   const x=-21+i*4.65,a=x-2.06,c=x+2.06,cutA=-right,cutC=-left;
   if(c<=cutA||a>=cutC)window(b,x,4.7,.08,4.12,8.55,0,{frame,glass,vertical:2,horizontal:3});
   else{
    window(b,x,(head+8.975)/2,.08,4.12,8.975-head,0,{frame,glass,vertical:2,horizontal:1});
    for(const [l,r]of[[a,Math.min(c,cutA)],[Math.max(a,cutC),c]])if(r-l>.15)window(b,(l+r)/2,(.425+head)/2,.08,r-l,head-.425,0,{frame,glass,vertical:1,horizontal:1});
   }
  }
  // Leave the stair flight open up to its upper tread; the former continuous
  // slab and balustrade cut across the flight before it reached the landing.
  const stairLeft=-3.88,stairRight=-1.32;
  for(const [a,c]of[[-22.75,stairLeft],[stairRight,22.75]])box(b,'nong-north-balcony',(a+c)/2,5.25,1.7,c-a,.26,3.4,'#aaa89a');
  box(b,'nong-north-balcony-landing',(stairLeft+stairRight)/2,5.25,.51,stairRight-stairLeft,.26,1.02,'#aaa89a');
  // BRDR north exterior and the 2025 reopening photo both show an opaque
  // parapet below the low rail, only traced here from the stair to the NW tower.
  // Top 6.10 and .24 thickness are photo-proportion fits; keep the stair notch.
  box(b,'nong-north-solid-balustrade175',7.565,5.735,3.28,17.77,.73,.24,'#aaa89a');
  for(let i=0;i<=18;i++){const x=-22.2+i*2.47;if(x>stairLeft-.03&&x<stairRight+.03)continue;box(b,'nong-balcony-post',x,5.88,3.34,.055,1.1,.055,'#acb5aa',29);}
  for(const [a,c]of[[-22.3,stairLeft],[stairRight,22.3]])box(b,'nong-balcony-handrail',(a+c)/2,6.4,3.34,c-a,.045,.06,'#acb5aa',29);
 });
 box(b,'nong-north-canopy',0,11.2,-44.5,47.35,.24,10.4,'#b2b3a6');
 box(b,'nong-canopy-joint-backing',0,11.08,-44.5,47.35,.012,10.4,'#959b94');
 // The north exterior photographs resolve panel joints beneath the canopy.
 // Retain its fitted envelope; shallow panels leave the backing visible in
 // real recessed joints instead of drawing dark lines on a flat face.
 const soffit=b.geo('nong37-canopy-soffit-panels',()=>{const g=new G.Geometry(),cols=32,rows=6,gap=.024,y=11.055,top=11.08;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
   const a=-23.675+i*47.35/cols+gap/2,c=-23.675+(i+1)*47.35/cols-gap/2,z=-49.7+j*10.4/rows+gap/2,zz=-49.7+(j+1)*10.4/rows-gap/2;
   g.quad([a,y,z],[c,y,z],[c,y,zz],[a,y,zz]);
   g.quad([a,y,z],[a,y,zz],[a,top,zz],[a,top,z]);
   g.quad([c,y,zz],[c,y,z],[c,top,z],[c,top,zz]);
   g.quad([c,y,z],[a,y,z],[a,top,z],[c,top,z]);
   g.quad([a,y,zz],[c,y,zz],[c,top,zz],[a,top,zz]);
  }return g;});
 b.mesh('nong37-canopy-soffit-panels',soffit,0,0,0,1,1,1,'#b2b3a6',24);
 for(const x of[-21,-13,-5,3,11,21]){
  // Every supporting column is continuous from the entry paving to the canopy.
  b.mesh('nong37-grounded-column',b.geo('nong37-round-column',()=>G.cylinder(16)),x,.11,x>=3?-39.65:-48.45,.23,11.0,.23,'#bdbda9',24);
 }
 // North-west glazed stair tower, tied to the building and canopy.
 box(b,'nong-nw-tower-side',-19,5.45,-43.6,5.1,10.7,7.7,brick);
 window(b,-19,5.0,-47.51,4.45,8.85,PI,{frame,glass,vertical:2,horizontal:4});
 window(b,-21.61,5.0,-43.6,7.0,8.85,-PI/2,{frame,glass,vertical:3,horizontal:4});
 // Enclosed sloping glass prism at the north-east: no floating single plane.
 const x0=4.7,x1=22.8,zFront=-49.5,zBack=-40.0,yFront=.55,yBack=5.65;
 const prism=b.geo('nong37-glass-prism',()=>{const g=new G.Geometry();g.quad([x0,yFront,zFront],[x0,yBack,zBack],[x1,yBack,zBack],[x1,yFront,zFront]);for(const x of[x0,x1])g.quad([x,.22,zFront],[x,yFront,zFront],[x,yBack,zBack],[x,.22,zBack]);return g;});
 b.mesh('nong37-enclosed-glass',prism,0,0,0,1,1,1,glass,28);
 box(b,'nong-glass-plinth',(x0+x1)/2,.22,(zFront+zBack)/2,x1-x0,.3,zBack-zFront,'#8f9286');
 for(let i=0;i<=9;i++){const x=x0+(x1-x0)*i/9;b.beam([x,yFront+.04,zFront],[x,yBack+.04,zBack],.065,frame,29);}
 for(let i=0;i<=4;i++){const t=i/4;b.beam([x0,yFront+(yBack-yFront)*t+.05,zFront+(zBack-zFront)*t],[x1,yFront+(yBack-yFront)*t+.05,zFront+(zBack-zFront)*t],.055,frame,29);}
 for(const x of[x0,x1])b.beam([x,.22,zFront],[x,yBack,zBack],.07,frame,29);
 // BRDR's clear north exterior distinguishes the opaque prism-side cheek
 // from the open metal railing on the outer side of the flight.
 b.local(0,nongForecourt.top,0,0,()=>stairs(b,'nong37-north-stair',2.6,-44.72,2.0,9.1,5.38-nongForecourt.top,PI,{n:30,solidRail:true,solidRailSide:-1}));
 nongNorthVestibule(b);
 return {northGlass:true,northColumns:6,southwestEntry:true,northVestibule:'photo-fitted',northDoorLeavesVerified:false};
}

function render(b,f){const p=f.properties;if(!['way/445012606','way/240832248','way/1091239428'].includes(p.id))return null;
 const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[p.centre[0],0,p.centre[1]];b.rotation=.0467;b.id=p.pickId;b.anim=0;
 try{
  if(p.id==='way/240832248')return {id:p.id,strategy:'nongyuan37-photo-model',...nongyuan(b,f)};
  if(p.id==='way/445012606')return {id:p.id,strategy:'zhihua37-photo-model',...zhihua(b,f)};
  if(p.id==='way/1091239428'){
   // OSM supplies a small footprint only. Do not invent a two-storey tower.
   const ring=f.geometry.coordinates[0],local=ring.map(q=>{const dx=q[0]-p.centre[0],dz=q[1]-p.centre[1];return[Math.cos(.0467)*dx-Math.sin(.0467)*dz,Math.sin(.0467)*dx+Math.cos(.0467)*dz];});
   b.mesh('unverified37-footprint',b.geo('unverified37-footprint',()=>G.ribbon(local,.07,.025,false)),0,0,0,1,1,1,'#acb0a4',24);return {id:p.id,strategy:'unverified-outline-only',noHeightEvidence:true};
  }
  return null;
 }finally{[b.origin,b.rotation,b.id,b.anim]=old;}
}
Y.Districts37={render,zhihuaParts,window,stairs,nongNorthEntry,nongForecourt};
})(YY);
