/* The photographed outer entrance has a stone stair between its low landing
 * and sill. Keep the inherited footprint, door leaves and every original part. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='relation/13259483';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const had=Object.prototype.hasOwnProperty.call(b,'lawCourtyard'),old=b.lawCourtyard;
 b.lawCourtyard=function(...args){
  const result=old.apply(this,args);
  // The existing lowest landing ends at the source ring (local z≈32.213).
  // This intermediate tread stays within that ring and overlaps both retained
  // landing and sill foundation. Its shallow rise respects the fitted model.
  this.mesh('guoshuang-entry-middle-tread',this.geo('box',Y.Geo.box),0,.185,31.70,2.95,.05,.36,'#a7aaa2',24,.16);
  return result;
 };
 try{return previous.call(this,b,f,add);}finally{if(had)b.lawCourtyard=old;else delete b.lawCourtyard;}
};
Y.GuoshuangDetails={id:ID};
})(YY);
