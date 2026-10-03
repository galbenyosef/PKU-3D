/* Education College, real building 27 / pick 134. The west entrance piers
 * have pale stone feet in the registered front photographs. Their 0.90 m
 * model height is a proportional fit; the original pier envelope is retained. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render;
 A.render=function(b,f,add){
  if(f.properties.id!=='way/240832249'||f.properties.pickId!==134)return previous.call(this,b,f,add);
  const mesh=b.mesh;let added=0;
  b.mesh=function(key,g,x,y,z,w,h,d,c,mat,...rest){
   if(key==='south-education-unit-box'&&x===0&&z===0&&y===4.65&&w===1.3&&h===8.5&&d===1.25&&c==='#8f918b'){
    // Partition the existing solid: no cladding overlay or narrowed doorway.
    added++;
    mesh.call(this,key,g,x,y+.45,z,w,h-.90,d,c,mat,...rest);
    return mesh.call(this,key,g,x,.85,z,w,.90,d,'#c9ccc1',10,...rest);
   }
   return mesh.call(this,key,g,x,y,z,w,h,d,c,mat,...rest);
  };
  try{const result=previous.call(this,b,f,add);if(result&&Number.isFinite(result.detailInstances))result.detailInstances+=added;return result;}finally{b.mesh=mesh;}
 };
})(YY);
