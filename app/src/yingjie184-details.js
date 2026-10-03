/* The photographed courtyard-facing skylights have two panes. Rear divisions
 * remain unverified. Scope is the native entrance pavilion, not its neighbours. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/444991873',near=(a,b)=>Math.abs(a-b)<1e-8;
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'s19Roof'),roof=b.s19Roof;
 const ownBox=Object.prototype.hasOwnProperty.call(b,'s19box'),box=b.s19box;
 // Keep the forecourt surface; extend only its unsupported underside to ground.
 b.s19box=function(key,x,y,z,w,h,d,...args){
  if(key==='v19-forecourt'&&near(y,.09)&&near(h,.15)){y=.0075;h=.315;}
  return box.call(this,key,x,y,z,w,h,d,...args);
 };
 b.s19Roof=function(w,d,eave,rise,bays,overhang){
  const ownBeam=Object.prototype.hasOwnProperty.call(this,'beam'),beam=this.beam,frontRotation=this.rotation;
  this.beam=function(a,z,r,color,material,part){
   // Match only quarter-height horizontal glazing bars in the front roof call.
   const t=(a[1]-.10)/rise;
   if(near(this.rotation,frontRotation)&&near(a[1],z[1])&&near(a[2],z[2])&&near(r,.055)&&material===29&&near(part,2.34)&&(near(t,.3375)||near(t,.6925)))return;
   return beam.call(this,a,z,r,color,material,part);
  };
  try{return roof.call(this,w,d,eave,rise,bays,overhang);}finally{if(ownBeam)this.beam=beam;else delete this.beam;}
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.s19Roof=roof;else delete b.s19Roof;if(ownBox)b.s19box=box;else delete b.s19box;}
};
Y.Yingjie184Details={id:ID};
})(YY);
