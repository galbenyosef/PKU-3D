/* Economics entrance: four dark framed glass leaves and the photographed dark
 * header enclosure. Fitted dimensions; no temporary banners or display text. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/783033431',M=Y.M,localBounds=new WeakMap(),rearMeshes=new WeakMap();
function bounds(g,m){
 let q=localBounds.get(g);if(!q){q=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<g.v.length;i+=8)for(let j=0;j<3;j++){q[j]=Math.min(q[j],g.v[i+j]);q[j+3]=Math.max(q[j+3],g.v[i+j]);}localBounds.set(g,q);}
 const out=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(const x of[q[0],q[3]])for(const y of[q[1],q[4]])for(const z of[q[2],q[5]]){const p=M.apply(m,[x,y,z,1]);for(let j=0;j<3;j++){out[j]=Math.min(out[j],p[j]);out[j+3]=Math.max(out[j+3],p[j]);}}return out;
}
// The old rectangular rear bar filled the mapped road beside Small East Gate.
// Register its northern envelope to the existing OSM rear edge at that gate's
// axis. Fade the correction over source x=10..35, where the mapped southern
// outline widens, so the far end and the separately fitted round hall stay put.
function fitRear(records,f,frame,sourceFrame,drum){
 const bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
 for(const r of records){if([0,3,16].includes(r[4][0]))continue;const q=bounds(r[1],r[2]);if(q[4]<Math.min(4,Math.max(1.3,f.properties.height*.08)))continue;for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j+3]);}}
 // Measure BEFORE changing any record. Re-fitting the shortened geometry would
 // expand it again and move the photographed west entrance and round hall.
 Object.assign(sourceFrame,{w:bb[3]-bb[0],d:bb[5]-bb[2],centre:[(bb[0]+bb[3])/2,(bb[2]+bb[5])/2]});
 const root=M.multiply(M.transform([frame.centre[0],0,frame.centre[1]],[(frame.w-.15)/sourceFrame.w,f.properties.height/bb[4],(frame.d-.15)/sourceFrame.d],frame.r),M.transform([-sourceFrame.centre[0],0,-sourceFrame.centre[1]],[1,1,1],0));
 const gate=Y.CAMPUS?.features.find(q=>q.properties.id==='node/10080038172'),axis=gate?.geometry.coordinates[1]??-422.8303988802362,hits=[];
 for(const polygon of Y.Footprints.polygons(f.geometry))for(const ring of polygon)for(let i=1;i<ring.length;i++){const a=ring[i-1],b=ring[i];if((a[1]<=axis&&b[1]>axis)||(b[1]<=axis&&a[1]>axis))hits.push(a[0]+(axis-a[1])/(b[1]-a[1])*(b[0]-a[0]));}
 let inverse;try{inverse=M.inverse(root);}catch{throw Error('Economics rear336 singular matrix');}
 const north=M.apply(inverse,[Math.max(...hits),0,axis,1])[2]/bb[2];
 if(!Number.isFinite(north)||north<=0||north>=1)throw Error('Economics rear336 registration no longer matches its source');
 for(const r of records){if(drum.has(r[2]))continue;const q=bounds(r[1],r[2]);if(q[2]>=0||q[0]>=35)continue;
  if(q[3]<=10&&q[5]<=0){
   // Entirely negative northern details share their unchanged source mesh.
   // Parts crossing z=0 use a split mesh so the whole positive side stays put.
   const lo=q[2]*north,hi=q[5]<0?q[5]*north:q[5],span=q[5]-q[2],scale=span>1e-9?(hi-lo)/span:1,offset=lo-scale*q[2];
   r[2]=M.multiply(M.transform([0,0,offset],[1,1,scale],0),r[2]);
  }else{
   const warped=rearMesh(r[0],r[1],r[2],north);r[0]=warped.key;r[1]=warped.geo;
  }
 }
}
function rearMesh(key,geo,m,north){
 // Height is absent from the key: repeated window floors share the same small
 // transition mesh. Retain each original matrix, atlas rectangle and material.
 const signature=[north,...[0,2,8,10,12,14].map(i=>m[i])].join('_');let cache=rearMeshes.get(geo);if(!cache){cache=new Map();rearMeshes.set(geo,cache);}if(cache.has(signature))return cache.get(signature);
 const out=new Y.Geo.Geometry(),det=m[0]*m[10]-m[8]*m[2],factor=x=>north+(1-north)*Math.max(0,Math.min(1,(x-10)/25));
 function split(poly,axis,cut){
  const ds=poly.map(p=>p[axis]-cut);if(Math.min(...ds)>=-1e-9||Math.max(...ds)<=1e-9)return[poly];
  const lo=[],hi=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],a=ds[i],b=ds[(i+1)%poly.length];if(a<=0)lo.push(p);if(a>=0)hi.push(p);if(a*b<0){const t=a/(a-b),v=p.map((x,j)=>x+(q[j]-x)*t);lo.push(v);hi.push(v);}}
  return[lo,hi].filter(p=>p.length>=3);
 }
 for(let i=0;i<geo.v.length;i+=24){let pieces=[[0,8,16].map(j=>{const v=Array.from(geo.v.slice(i+j,i+j+8));return[...v,m[0]*v[0]+m[8]*v[2]+m[12],m[2]*v[0]+m[10]*v[2]+m[14]];})];
  // Split rather than clip: both sides and their interpolated UVs survive.
  for(const[axis,cut]of[[8,10],[8,35],[9,0]])pieces=pieces.flatMap(p=>split(p,axis,cut));
  for(const poly of pieces)for(let j=1;j<poly.length-1;j++){
   const tri=[poly[0],poly[j],poly[j+1]],pts=tri.map(v=>{const dz=v[9]<0?v[9]*(factor(v[8])-1):0;return[v[0]-m[8]*dz/det,v[1],v[2]+m[0]*dz/det];});
   if(Math.hypot(...M.cross(M.sub(pts[1],pts[0]),M.sub(pts[2],pts[0])))<1e-12)continue;
   // All affected source meshes are flat boxes. Recompute their outward face
   // normals after fitting; the retained orthogonal matrix handles its scale.
   out.tri(...pts,tri.map(v=>v.slice(6,8)));
  }
 }
 const result={key:key+'-rear336-'+signature,geo:{...geo,v:out.v}};cache.set(signature,result);return result;
}
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==249)return prior.call(this,b,f,add);
 const own=Object.hasOwn(b,'economicsHall'),hall=b.economicsHall,drum=new WeakSet();
 b.economicsHall=function(...args){
  const ownMesh=Object.hasOwn(this,'econMesh'),mesh=this.econMesh;
  const ownWindow=Object.hasOwn(this,'econWindow'),window=this.econWindow;
  this.econWindow=function(x,y,z,w,h,r=0,key='v14-drum-window'){
   // The approximate flat-wing panes were inset behind solid source boxes.
   // Retain their full detail, but bring their existing glazing clear of the wall.
   const offset=key==='v14-drum-window'?0:.35;
   return window.call(this,x+Math.sin(r)*offset,y,z+Math.cos(r)*offset,w,h,r,key);
  };
  // The mapped southern curved end is approximately round, unlike the old
  // whole-building fit which stretched the drum along the long north/south axis.
  // Reuse every drum/window/dome vertex while fitting that component separately.
  const add0=this.e.add,round=this.econRoundSolid,dome=this.econDome;
  const ownRound=Object.hasOwn(this,'econRoundSolid'),ownDome=Object.hasOwn(this,'econDome');let onDrum=false;
  const M=Y.M,drumFit=M.multiply(M.transform([20.2,0,11.5],[.50,1,1.40],0),M.transform([-18.8,0,-1.5],[1,1,1],0));
  this.econRoundSolid=function(...a){onDrum=true;return round.apply(this,a);};
  this.econDome=function(...a){try{return dome.apply(this,a);}finally{onDrum=false;}};
  this.e.add=function(k,g,m,...a){if(onDrum){m=M.multiply(drumFit,m);drum.add(m);}return add0.call(this,k,g,m,...a);};
  this.econMesh=function(k,...a){if(['v14-entry-door','v14-entry-handle-frame','v14-door-pull','v14-entry-portal','v14-entry-tread'].includes(k))return;return mesh.call(this,k,...a);};
  // Remove the invented elevated stair assembly, including its rails. Lower
  // the vestibule floor as well, so a ground-level door is not a painted panel
  // against the old floor slab. Only exact source entrance records are changed.
  const methods=['box','beam','cyl'],saved=methods.map(k=>[k,Object.getOwnPropertyDescriptor(this,k),this[k]]);
  const box=this.box,beam=this.beam,cyl=this.cyl;
  this.box=function(x,y,z,w,h,d,...a){
   if(x===-5.5&&y===2.02&&z===8&&w===29.5&&h===.24&&d===32)y=.20;
   if(x===-2.5&&y===1.98&&z===26.7&&w===19.8&&h===.35&&d===7.4){y=.21;h=.22;}
   return box.call(this,x,y,z,w,h,d,...a);
  };
  this.beam=function(a,b,...rest){if(a[1]===1.2&&a[2]===35.6&&b[1]===2.98&&b[2]===30.3)return;return beam.call(this,a,b,...rest);};
  this.cyl=function(x,y,z,r,...a){if(r===.044&&(x===-14.55||x===9.55)&&z>=31&&z<=35.4)return;return cyl.call(this,x,y,z,r,...a);};
  let result;try{result=hall.apply(this,args);}finally{for(const[k,desc]of saved){if(desc)Object.defineProperty(this,k,desc);else delete this[k];}if(ownMesh)this.econMesh=mesh;else delete this.econMesh;this.e.add=add0;if(ownWindow)this.econWindow=window;else delete this.econWindow;if(ownRound)this.econRoundSolid=round;else delete this.econRoundSolid;if(ownDome)this.econDome=dome;else delete this.econDome;}
  const put=(k,x,y,z,w,h,d,color,mat=29)=>this.econMesh('economics249-'+k,x,y,z,w,h,d,color,mat,.96),frame='#3f4b4f';
  // Photo: near-grade threshold, four narrow tall leaves, a dark display
  // housing and two slender stone piers rising above it. Dimensions fitted.
  const pitch=.85,bottom=.32,height=2.88,centre=bottom+height/2;
  for(let i=0;i<4;i++){
   const x=-2.5+(i-1.5)*pitch;
   put('leaf-glass',x,centre,24,pitch-.09,height-.12,.065,'#335265',28);
   for(const sign of[-1,1])put('leaf-stile',x+sign*(pitch/2-.025),centre,24.09,.05,height,.16,frame);
   for(const y of[bottom+.03,bottom+height-.03])put('leaf-rail',x,y,24.09,pitch,.06,.16,frame);
   put('leaf-crossrail',x,bottom+1.04,24.10,pitch-.05,.045,.17,frame);
   put('pull',x+(i%2===0?.31:-.31),bottom+1.22,24.25,.035,.62,.15,'#aab4b2');
  }
  put('transom-glass',-2.5,3.43,24,3.4,.44,.065,'#335265',28);
  put('transom-rail',-2.5,3.65,24.09,3.4,.06,.16,frame);
  put('header-box',-2.5,4.02,24.08,3.46,.65,.22,'#383c3e',29);
  for(const sign of[-1,1])put('header-edge',-2.5+sign*1.75,4.02,24.13,.04,.69,.25,'#adb4b2');
  for(const y of[3.68,4.36])put('header-edge',-2.5,y,24.13,3.54,.04,.25,'#adb4b2');
  for(const sign of[-1,1]){
   const x=-2.5+sign*1.9;
   // The photographed stone uprights continue to the atrium's upper beam.
   // Follow the existing curved curtain plane instead of leaving free posts
   // forward of it. Top 24.30 exactly meets the roof slab underside.
   const wall=23.8-2.2*Math.cos((x+21.2)/30.4*Math.PI/2),z=wall+.18;
   put('stone-pier',x,(.32+24.30)/2,z,.28,24.30-.32,.42,'#b4b6aa',24);
   put('pier-foot',x,.40,z+.02,.38,.16,.48,'#c7c9be',24);
   for(let j=1;.48+j*.6<24.30;j++)put('pier-joint',x,.48+j*.6,z+.214,.28,.012,.006,'#91968d',24);
  }
  put('approach-join',-2.5,.19,30.8,19.8,.22,.9,'#babeb2',26);
  return result;
 };
 try{
  // Two independent observed axes: the entrance faces west, and the curved
  // wing is at the southern end. Fit that handedness to the long OSM axis.
  const source=Y.ARCHIVE.legacy[String(f.properties.legacyId)],frame=Y.ArchitectureAdapter.frame(f.geometry,3*Math.PI/2),sourceFrame={};
  add('v30-footprint-base-'+f.properties.pickId,Y.Footprints.surface(f.geometry,.045),'#b5bbae',10,f.properties.pickId);
  const result=Y.ArchitectureAdapter.render(b,f,(builder,...args)=>{
   const emit=builder.e.add,records=[];builder.e.add=(...record)=>records.push(record);
   try{builder.economicsHall(...args);}finally{builder.e.add=emit;}
   fitRear(records,f,frame,sourceFrame,drum);for(const r of records)emit(...r);
  },source,{name:'economics249',frame,sourceFrame,preserveOuterParts:true});
  result.entranceFacing='west';result.roundWing='south';result.dimensionsMeasured=false;return result;
 }finally{if(own)b.economicsHall=hall;else delete b.economicsHall;}
};Y.Economics249Details={id:ID};
})(YY);
