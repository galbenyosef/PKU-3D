/* Pick 40 only: retain the documented forty north-entry risers. The old top
 * landing projected over the upper four steps; its rear edge stays fixed.
 * Dimensions remain fitted; the OSM/overall-envelope uncertainty is unchanged. */
(function(Y){'use strict';
const P=Y.Builder.prototype,previous=P.qiuGymnasium;
P.qiuGymnasium=function(...args){
 if(this.id!==40)return previous.apply(this,args);
 const original=this.v16box;
 this.v16box=function(key,x,y,z,w,h,d,...rest){
  if(key==='qiu36-top-landing'){
   const rear=z-d/2,front=2.1;
   z=(rear+front)/2;d=front-rear;
  }
  return original.call(this,key,x,y,z,w,h,d,...rest);
 };
 try{return previous.apply(this,args);}finally{this.v16box=original;}
};
})(YY);
