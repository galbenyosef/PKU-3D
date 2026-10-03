/* De Hall (way/240832219, pick 108). Close a source-model wall/plinth gap;
 * the fitted 70 mm is not a surveyed historic construction dimension. */
(function(Y){'use strict';
 const P=Y.Builder.prototype,original=P.northZhai;
 P.northZhai=function(p,...args){
  if(this.id!==108||p.id!==55)return original.call(this,p,...args);
  const box=this.n17Box;
  this.n17Box=function(key,x,y,z,w,h,d,...rest){
   // Extend the two existing wall volumes downward; retain their top, footprint,
   // material and all separate windows, columns, roof and gallery geometry.
   if(key==='v17-plaster-wall'&&y===5.4&&h===9.2){y-=.035;h+=.07;}
   return box.call(this,key,x,y,z,w,h,d,...rest);
  };
  try{return original.call(this,p,...args);}finally{this.n17Box=box;}
 };
})(YY);
