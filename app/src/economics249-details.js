/* Economics entrance: four dark framed glass leaves and the photographed dark
 * header enclosure. Fitted dimensions; no temporary banners or display text. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/783033431';
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==249)return prior.call(this,b,f,add);
 const own=Object.hasOwn(b,'economicsHall'),hall=b.economicsHall;
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
  this.e.add=function(k,g,m,...a){return add0.call(this,k,g,onDrum?M.multiply(drumFit,m):m,...a);};
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
  const source=Y.ARCHIVE.legacy[String(f.properties.legacyId)],frame=Y.ArchitectureAdapter.frame(f.geometry,3*Math.PI/2);
  add('v30-footprint-base-'+f.properties.pickId,Y.Footprints.surface(f.geometry,.045),'#b5bbae',10,f.properties.pickId);
  const result=Y.ArchitectureAdapter.render(b,f,'economicsHall',source,{name:'economics249',frame,preserveOuterParts:true});
  result.entranceFacing='west';result.roundWing='south';result.dimensionsMeasured=false;return result;
 }finally{if(own)b.economicsHall=hall;else delete b.economicsHall;}
};Y.Economics249Details={id:ID};
})(YY);
