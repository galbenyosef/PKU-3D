/* Official east-entrance photograph shows a closed rectangular frame on each
 * main door leaf. Restore the two omitted lower rails at the existing landing. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/445016209';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const original=b.e.add,h=Y.StudentCenterSouth46.heights.entrance;
  b.e.add=function(key,g,m,color,p,uv){
  const result=original.call(this,key,g,m,color,p,uv);
  if(key==='studentcenter46-main-door-box'&&p[0]===6&&Math.abs(m[13]-(h+2.56))<1e-5&&Math.abs(m[5]-.12)<1e-5){
   const lower=new Float32Array(m);lower[13]=h+.06;
   original.call(this,'studentcenter195-main-door-bottom-box',g,lower,color,p,uv);
  }
  return result;
 };
 try{return previous.call(this,b,f,add);}finally{b.e.add=original;}
};
Y.StudentCenter195Details={id:ID};
})(YY);
