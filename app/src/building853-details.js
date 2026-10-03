/* Changchunyuan 65: official accommodation records establish a sixth floor.
   Total height, unobserved facade design and entrance bearing remain fitted/unknown. */
(function(Y){'use strict';const previous=Y.Architecture30.render;
 Y.Architecture30.render=function(b,f,add){
  if(f.properties.pickId!==853||f.properties.id!=='way/849765886')return previous.call(this,b,f,add);
  const corrected={...f,properties:{...f.properties,floors:6}};
  return previous.call(this,b,corrected,add);
 };
})(YY);
