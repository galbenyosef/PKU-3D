/* Changchunyuan 64: six-floor working fit from this building's 2015 room 622 record.
   Overall 15 m height and facade design remain estimates; entrance is unverified. */
(function(Y){'use strict';const previous=Y.Architecture30.render;
 Y.Architecture30.render=function(b,f,add){
  if(f.properties.pickId!==868||f.properties.id!=='way/849765885')return previous.call(this,b,f,add);
  return previous.call(this,b,{...f,properties:{...f.properties,floors:6}},add);
 };
})(YY);
