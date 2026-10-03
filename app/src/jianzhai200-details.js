/* Jian Hall, way/568832327 / pick 200: join the existing plaster shell to
 * its stone plinth. The 70 mm source gap is a model defect, not a survey. */
(function(Y){'use strict';
 const P=Y.Builder.prototype,original=P.northJian;
 P.northJian=function(p,...args){
  if(this.id!==200||p.id!==60)return original.call(this,p,...args);
  const box=this.n17Box,sign=this.sign;
  this.n17Box=function(key,x,y,z,w,h,d,...rest){
   if(key==='v17-plaster-wall'&&Math.abs(y-5.45)<1e-9&&Math.abs(h-9.3)<1e-9){y-=.035;h+=.07;}
   return box.call(this,key,x,y,z,w,h,d,...rest);
  };
  this.sign=function(text,x,y,z,...rest){
   // The retained gallery columns reach d/2 + 1.32; the old model label
   // at d/2 + 1.31 intersected the centre column. Keep its artwork intact.
   return sign.call(this,text,x,y,z+(text==='健斋'?.08:0),...rest);
  };
  try{return original.call(this,p,...args);}finally{this.n17Box=box;this.sign=sign;}
 };
})(YY);
