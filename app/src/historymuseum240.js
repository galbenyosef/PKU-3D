/* Private northwest entry/grade candidate, awaiting whole-scene review.
 * West/north location follows the paired official photos and north-up imagery.
 * Heights, bays and below-platform backing remain display fits. */
(function(Y){'use strict';
 const A=Y.Architecture30,old=A.render,M=Y.M,fit=Y.HistoryEntry240.fit;
 const floor=fit.rise,oldFloor=Y.HistoryMuseum46.gallery.bottom,dy=floor-oldFloor,entryAlong=-13.2;
 const shell=Object.freeze({west:-7.70,east:7.70,north:-19.7859652086,south:18.358781519});
 // Waterside photograph supports planted grade and a low retaining course.
 // Cross-section heights and width are fits; no survey datum is implied.
 function plantedGrade(){
  const grass=new Y.Geo.Geometry(),stone=new Y.Geo.Geometry(),bottom=-.03;
  const section=[[5.21,.12],[3.21,1.20],[3.21,1.65],[0,2.15]],stations=[];
  for(const z of[4.5,6,18.35])stations.push({x:-7.79,z,nx:-1,nz:0,t:Math.min(1,(z-4.5)/1.5)});
  // A fitted elliptical return keeps the existing mapped footway clear.
  for(let i=1;i<=8;i++){const a=i*Math.PI/16;stations.push({x:-7.79,z:18.35,nx:-Math.cos(a),nz:.65*Math.sin(a),t:1});}
  for(const x of[-3,2,5.5,7.79])stations.push({x,z:18.35,nx:0,nz:.65,t:Math.min(1,(7.79-x)/2.29)});
  const at=(i,j)=>{const [r,h]=section[i],q=stations[j];return[q.x+q.nx*r,.12+(h-.12)*q.t,q.z+q.nz*r];};
  function quad(mesh,pts){const uv=[[0,0],[1,0],[1,1],[0,1]];
   for(const ids of[[0,1,2],[0,2,3]]){const [a,b,c]=ids.map(k=>pts[k]);
    if(Math.hypot(...M.cross(M.sub(b,a),M.sub(c,a)))>1e-9)mesh.tri(a,b,c,ids.map(k=>uv[k]));
   }
  }
  for(let j=1;j<stations.length;j++)for(let i=1;i<section.length;i++){
   const pts=[at(i-1,j-1),at(i-1,j),at(i,j),at(i,j-1)];
   quad(i===2?stone:grass,pts);quad(grass,pts.map(p=>[p[0],bottom,p[2]]).reverse());
  }
  // Closed perimeter through existing ground, including the curved corner.
  const last=stations.length-1,ring=section.map((_,i)=>at(i,0));
  for(let j=1;j<=last;j++)ring.push(at(3,j));
  for(let i=2;i>=0;i--)ring.push(at(i,last));
  for(let j=last-1;j>0;j--)ring.push(at(0,j));
  for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];quad(grass,[a,b,[b[0],bottom,b[2]],[a[0],bottom,a[2]]]);}
  return {grass,stone,footprint:ring.map(p=>[p[0],p[2]])};
 }
 function build(b,f){
  const fr=Y.HistoryMuseum46.frame(f),w=fr.w,d=shell.south-shell.north,mid=(shell.north+shell.south)/2,stone='#bfc2b7',glass='#4e6569',metal='#919d98';
  const top=Y.HistoryMuseum46.gallery.top+dy,oldId=b.id;b.id=57;
  b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
   const grade=plantedGrade();
   b.mesh('waterside-planted-grade',grade.grass,0,0,0,1,1,1,'#819879',3);
   b.mesh('waterside-retaining-course',grade.stone,0,0,0,1,1,1,'#b4b7aa',10);
   // Above-ground plinth supports the unchanged roof footprint at the fitted datum.
   b.box(0,(floor-.12)/2,mid,15.6,floor-.12,d+.2,stone,10);
   b.box(0,floor-.12,mid,15.6,.24,d+.2,stone,10);
   b.box(0,(floor+top)/2,shell.north,15.4,top-floor,.20,stone,10);
   // The waterside photograph shows a narrow continuous clerestory at the south eave.
   const sill=top-.73,head=top-.13;
   b.box(0,(floor+sill)/2,shell.south,15.4,sill-floor,.20,stone,10);
   b.box(0,(head+top)/2,shell.south,15.4,top-head,.20,stone,10);
   for(const side of[-1,1])b.box(side*7.40,(sill+head)/2,shell.south,.60,head-sill,.20,stone,10);
   b.box(0,(sill+head)/2,shell.south-.035,14.2,head-sill,.07,glass,5);
   for(const y of[sill,head])b.box(0,y,shell.south+.025,14.2,.055,.08,metal,9);
   for(let x=-7.1;x<=7.11;x+=1.42)b.box(x,(sill+head)/2,shell.south+.025,.045,head-sill,.08,metal,9);
   // Official 2024 terrace views show a continuous narrow east clerestory.
   // The same-eave south datum is retained; north extent and bay spacing follow
   // the existing mapped shell as display fits, not a surveyed full elevation.
   const east0=shell.north+.40,east1=shell.south-.40,eastMid=(east0+east1)/2,eastLength=east1-east0;
   const eastEmit=b.e.add;b.e.add=function(k,...args){return eastEmit.call(this,'history321-east-clerestory-'+k,...args);};
   try{b.box(shell.east,(floor+sill)/2,mid,.20,sill-floor,d,stone,10);
   b.box(shell.east,(head+top)/2,mid,.20,top-head,d,stone,10);
   for(const z of[(shell.north+east0)/2,(east1+shell.south)/2])b.box(shell.east,(sill+head)/2,z,.20,head-sill,.40,stone,10);
   b.box(shell.east-.035,(sill+head)/2,eastMid,.07,head-sill,eastLength,glass,5);
   for(const y of[sill,head])b.box(shell.east+.025,y,eastMid,.08,.055,eastLength+.08,metal,9);
   // No opening state is inferred. Keep the full glazed run behind narrow frames.
   const bays=Math.ceil(eastLength/1.42),spacing=eastLength/bays;
   for(let i=0;i<=bays;i++)b.box(shell.east+.025,(sill+head)/2,east0+i*spacing,.08,head-sill,.045,metal,9);
   }finally{b.e.add=eastEmit;}
   const x=-w/2+2.5;
   // The north door group replaces the former short-end entrance.
   const door0=entryAlong-3.6,door1=entryAlong+3.6;
   for(const [lo,hi]of[[shell.north+.10,door0],[door1,shell.south-.10]]){
    b.box(x,(floor+top)/2,(lo+hi)/2,.09,top-floor,hi-lo,glass,5);
    for(let z=lo;z<=hi;z+=1.5)b.box(x-.08,(floor+top)/2,z,.10,top-floor,.06,metal,9);
   }
   for(const z of[shell.north+.3,door0,door1,-5,-.25,4.5,9.25,14,shell.south-.3]){
    b.box(-w/2+.5,floor+.13,z,.68,.26,.68,stone,10);b.cyl(-w/2+.5,floor+.26,z,.235,top-floor-.26,'#dadbd0',24,1,10);
   }
   const doorX=-w/2+.35;
   // Glazed returns join the projecting door plane to recessed long-facade glazing.
   for(const z of[door0,door1]){
    b.box((doorX+x)/2,(floor+top)/2,z,x-doorX+.08,top-floor,.08,glass,5);
    for(const xx of[doorX,x])b.box(xx,(floor+top)/2,z,.07,top-floor,.10,metal,9);
    for(const y of[floor+.035,top-.035])b.box((doorX+x)/2,y,z,x-doorX+.10,.07,.10,metal,9);
   }
   b.box((doorX+x)/2,top-.025,entryAlong,x-doorX+.10,.05,7.28,stone,10);
   b.local(doorX,0,entryAlong,-Math.PI/2,()=>{
    const emit=b.e.add;b.e.add=function(k,...args){return emit.call(this,'history240-upper-'+k,...args);};
    try{
     // Four fitted glass leaves in two paired bays; reference is not a hardware survey.
     for(const u of[-2.7,-.9,.9,2.7])b.box(u,floor+1.47,-.12,1.76,2.94,.08,glass,5);
     for(const u of[-3.6,-1.8,0,1.8,3.6])b.box(u,floor+1.5,-.05,.07,3,.10,metal,9);
     for(const y of[floor+.035,floor+2.99])b.box(0,y,-.05,7.27,.07,.10,metal,9);
     b.box(0,(floor+3+top)/2,-.12,7.27,top-floor-3,.08,glass,5);
     b.box(0,top-.55,-.075,7.0,.80,.09,'#586c65',9);
     b.lettering('北京大学校史馆',0,top-.55,-.018,6.45,.72,0,'#d7c68f');
     for(const u of[-1.91,-1.69,1.69,1.91]){b.beam([u,floor+1.05,.10],[u,floor+1.90,.10],.025,metal,9);for(const y of[floor+1.05,floor+1.90])b.beam([u,y,-.01],[u,y,.10],.025,metal,9);}
    }finally{b.e.add=emit;}
    Y.HistoryEntry240.build(b);
    // The second stair climbs from the north plaza to the same landing.
    const n=20,run=5.8,step=run/n;
    for(let i=0;i<n;i++){const h=floor*(i+1)/n;b.box(-4-run+(i+.5)*step,h/2,2.5,step,h,3,stone,10);}
    for(const z of[1.05,3.95]){b.beam([-4-run,.98,z],[-4,floor+.98,z],.035,metal,9);for(let i=0;i<=5;i++){const x=-4-run+i*run/5,h=floor*i/5;b.beam([x,h,z],[x,h+.98,z],.032,metal,9);}}
    // Shallow glass canopy in the 2018 exterior, tied back to the stone wall.
    b.box(0,2.66,4.35,3.1,.065,1.35,'#668880',5);for(const x of[-1.3,1.3])b.beam([x,2.73,3.87],[x,2.62,4.98],.035,metal,9);
    b.box(3.25,.06,6,28.5,.12,4.3,'#c8c5b7',7);
    // A fitted pedestrian connector joins the photographed forecourt to the unchanged mapped footway.
    const start=b.world([12,0,8.05]),road=Y.CAMPUS.features.find(f=>f.properties.pickId===29),q=road.geometry.coordinates;
    let nearest=null;for(let i=1;i<q.length;i++){const a=q[i-1],v=[q[i][0]-a[0],q[i][1]-a[1]],t=Math.max(0,Math.min(1,((start[0]-a[0])*v[0]+(start[2]-a[1])*v[1])/(v[0]*v[0]+v[1]*v[1]))),p=[a[0]+t*v[0],a[1]+t*v[1]],distance=Math.hypot(start[0]-p[0],start[2]-p[1]);if(!nearest||distance<nearest.distance)nearest={p,distance};}
    const paths=[[start[0],start[2]],nearest.p];
    b.e.add('history240-road-connector',Y.JianEntry238.pavement(paths,2.2),M.identity(),'#c8c5b7',[7,57,0,.1]);
   });
  });b.id=oldId;return {fr,floor,top,dy};
 }
 A.render=function(b,f,add){if(f.properties.pickId!==57)return old.call(this,b,f,add);const emit=b.e.add,rows=[];b.e.add=(k,g,m,c,p,uv)=>rows.push({k,g,m:new Float32Array(m),c,p,uv});let prev;try{prev=old.call(this,b,{...f,properties:{...f.properties,height:8.8}},add);}finally{b.e.add=emit;}
  // Retain every original tiled-roof vertex, normal and material; change only datum.
  let roofs=0;for(const r of rows)if(r.p[0]===2||r.k==='v30-clipped-57-historymuseum-#d7d6cc|10|0'||r.k==='v30-clipped-57-historymuseum-#bebcaf|10|0'){r.m[13]+=dy;emit.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);roofs++;}
  const fr=Y.HistoryMuseum46.frame(f);let eastWindows=0,eastTriangles=0;
  for(const row of rows){
   const points=[];for(let i=0;i<row.g.v.length;i+=8)points.push(fr.local(M.apply(row.m,[...row.g.v.slice(i,i+3),1])));
   if([5,9].includes(row.p[0])&&points.every(p=>p[0]>7.69)&&points.every(p=>p[1]<4.88)){
    // Only these ten unsupported low broad-window records are removed.
    eastWindows++;continue;
   }
   if(row.p[0]!==13)continue;
   // The previous full east wall alone is superseded by the fitted stone/glass run.
   for(let i=0;i<points.length;i+=3)if(points.slice(i,i+3).every(p=>Math.abs(p[0]-shell.east)<.001))eastTriangles++;
  }
  if(eastWindows!==10||eastTriangles<2)throw Error('Original museum east facade changed; review before replacing');
  const saved=b.e.add;b.e.add=function(k,...args){return saved.call(this,'history240-shell-'+k,...args);};let geometry;try{geometry=build(b,f);}finally{b.e.add=saved;}
  const {westGallery,galleryScope,...base}=prev;return {...base,eastWindows,eastTriangles,detail:'history240-private-grade-candidate',entryLocation:'west-north-photo-map-fit',floorDatum:floor,datumMeasured:false,roofTranslation:dy,roofRecords:roofs,wholeBuildingAccepted:false};
 };
 Y.History240={floor,dy,entryAlong,shell,build,plantedGrade};
})(YY);
