/* Resource Hotel: restored omitted OSM way 240825484. Public aerial and
 * historical exterior photo guide the roof; heights/window dimensions are fits.
 * Load after architecture-v30.js and before catalog/scene construction. */
(function(Y){'use strict';
const ID='way/240825484',PICK=1338,G=Y.Geo,A=Y.Architecture30,previous=A.render;
const ring=[[-373.86,644.10],[-366.60,741.04],[-305.22,736.49],[-306.80,715.37],[-341.29,717.93],[-346.96,642.11],[-373.86,644.10]];
const O=ring[0],R=Math.atan2(7.26,96.94),CO=Math.cos(R),SI=Math.sin(R),world=(x,z)=>[O[0]+x*CO+z*SI,O[1]-x*SI+z*CO];
const references=[
'https://www.openstreetmap.org/way/240825484',
'https://isdplus.pku.edu.cn/ORIENTATION/zwb/lhqdzb1/zsap.htm',
'https://jjgcb.pku.edu.cn/zbtb/zbgg/1059jjgcb152055.htm',
'https://www.iinhotel.com/45593',
'https://pavo.elongstatic.com/i/tHotel800_600/nw_000dhe3d.jpg',
'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'];
const feature=Y.CAMPUS.features.find(f=>f.properties.id===ID);
if(!feature||feature.properties.pickId!==PICK||Y.CAMPUS.features.filter(f=>f.properties.pickId===PICK).length!==1)throw Error('Resource Hotel338 source feature missing or identity collision');

const C={wall:'#d6d3c7',red:'#a35f53',stone:'#bcbcaf',glass:'#637b7d',frame:'#d0d3cb',roof:'#555e67',flat:'#92968b'};
function render(b,f){
 b.id=f.properties.pickId;
 const oldAdd=b.e.add;b.e.add=function(k,...args){return oldAdd.call(this,'resource-hotel338-'+k,...args);};
 try{
 // One segmented wall builder for the main facades and hollow roof towers.
 function face(width,bottom,top,holes,color=C.wall,redStrips=[]){
  const levels=[bottom,top,...holes.flatMap(h=>[h.lo,h.hi])].sort((a,c)=>a-c);
  const wall=(a,c,lo,hi)=>{
   const cuts=[a,c,...redStrips.flat().filter(x=>x>a&&x<c)].sort((a,c)=>a-c);
   for(let k=1;k<cuts.length;k++){const l=cuts[k-1],r=cuts[k];if(r<=l)continue;const middle=(l+r)/2,col=redStrips.some(q=>middle>=q[0]&&middle<=q[1])?C.red:color;b.box(middle,(lo+hi)/2,.17,r-l,hi-lo,.34,col,24);}
  };
  for(let j=1;j<levels.length;j++){const lo=levels[j-1],hi=levels[j];if(hi<=lo)continue;let cursor=0;for(const h of holes.filter(h=>h.lo<=lo&&h.hi>=hi).sort((a,c)=>a.x-c.x)){wall(cursor,h.x-h.w/2,lo,hi);cursor=h.x+h.w/2;}wall(cursor,width,lo,hi);}
  for(const h of holes){b.box(h.x,(h.lo+h.hi)/2,.20,h.w-.05,h.hi-h.lo-.05,.055,C.glass,5);for(const xx of[h.x-h.w/2,h.x,h.x+h.w/2])b.box(xx,(h.lo+h.hi)/2,.28,.06,h.hi-h.lo,.12,C.frame,29);for(const yy of[h.lo,h.hi])b.box(h.x,yy,.28,h.w,.08,.14,C.frame,29);}
 }
 // Exact map ring: real wall openings retain the L-shaped courtyard void.
 for(let i=0;i<ring.length-1;i++){
  const a=ring[i],q=ring[i+1],len=Math.hypot(q[0]-a[0],q[1]-a[1]),n=Math.max(3,Math.round(len/4.25));
  b.local(a[0],0,a[1],-Math.atan2(q[1]-a[1],q[0]-a[0]),()=>{
   const holes=[];for(let fl=0;fl<6;fl++)for(let j=0;j<n;j++){const x=(j+.5)*len/n,w=len/n*.65;if(i===0&&fl===0&&x+w/2>66.45&&x-w/2<70.55)continue;holes.push({x,w,lo:.85+fl*3.35,hi:2.70+fl*3.35});}
   if(i===0)holes.push({x:68.5,w:4.1,lo:.28,hi:3.20,door:true});
   face(len,0,20.65,holes,C.wall,i===0?[10.5,32,49].map(z=>[z-3.4,z+3.4]):[]);
   for(const y of[.30,3.35,20.6]){
    if(i===0&&y===.30){for(const [a,c]of[[0,66.45],[70.55,len]])b.box((a+c)/2,y,0,c-a,.16,.42,C.stone,24);}
    else b.box(len/2,y,0,len,.16,.42,C.stone,24);
   }
  });
 }
 function tower(cx,cz,w,d,bottom,top,rows,small=false){
  // Clockwise XZ edges; glazing sits inside wall thickness, with true openings.
  const points=[[cx-w/2,cz-d/2],[cx-w/2,cz+d/2],[cx+w/2,cz+d/2],[cx+w/2,cz-d/2]];
  for(let i=0;i<4;i++){const a=points[i],q=points[(i+1)%4],width=Math.hypot(q[0]-a[0],q[1]-a[1]);b.local(a[0],0,a[1],-Math.atan2(q[1]-a[1],q[0]-a[0]),()=>{
   const holes=small?(i===0?[{x:width/2,w:1.05,lo:21.55,hi:22.75}]:[]):rows.map(y=>({x:width/2,w:width-1.5,lo:y-.9,hi:y+.9}));
   face(width,bottom,top,holes,C.red);
   // West and south photographed faces retain dense seven-bar glazing;
   // preserve the existing north treatment, without adding unseen east bars.
   // face() already supplies the central bar, so add only the other six.
   if(!small&&(i===0||i===1||i===3))for(const y of rows)for(const j of[-3,-2,-1,1,2,3])b.box(width/2+j*1.2,y,.28,.065,1.9,.08,C.frame,29);
  });}
 }
 b.mesh('flat-roof',G.polygon(ring.slice(0,-1),20.65),0,0,0,1,1,1,C.flat,7);
 b.local(O[0],0,O[1],R,()=>{
  // West photo-facing slope is separate from the large flat rear roof.
  b.roof(4.7,20.65,48.5,96.8,10.4,2.1,C.roof,Math.PI/2,.94);
  // Three short stair-tower caps visible in the aerial; spacing fitted to pixels.
  for(const z of[10.5,32.0,49.0]){
   tower(5.1,z,7.6,6.8,19.85,23.25,[],true);
   b.roof(5.1,23.25,z,8.7,7.8,2.4,C.roof,0,.02);
  }
  // Historical southwest two-storey roof lantern, not an invented full tower.
  tower(7,84.8,10,11,20.65,26.95,[22.1,25.0]);
  for(const y of[22.1,25.0])b.roof(7,y+1.15,84.8,12.0,13.0,1.35,C.roof,0,.72);
  b.roof(7,27.0,84.8,11.8,12.7,4.2,C.roof,0,.70);
  // Flat southern wing; raised perimeter only, no speculative roof machinery.
  for(const [x,z,w,d]of[[43.8,76.5,34.5,.25],[61.6,86.7,.25,21],[43.8,97.1,35.3,.25]])b.box(x,21.0,z,w,.7,d,C.stone,24);
  // West entrance/display fit, modest recess and sheltered threshold.
  b.box(-1.2,3.4,68.5,2.9,.22,5.2,C.stone,24);
  b.box(-1.3,.14,68.5,3.2,.28,5.0,C.stone,24);
 });
 }finally{b.e.add=oldAdd;}
 return {strategy:'resource-hotel338',sourceOutlinePreserved:true,historicalExterior:true,heightMeasured:false,wholeFacadeVerified:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous.call(this,b,f,add);};
Y.ResourceHotel338={id:ID,pickId:PICK,feature,ring,world,render,references};
})(YY);
