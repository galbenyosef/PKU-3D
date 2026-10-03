/* Pick404: single-storey courtyard type correction. Heights/roof curve/window positions are photo-fitted, not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){
 if(f.properties.pickId!==404||f.properties.id!=='way/1075644759')return prior.apply(this,arguments);
 const forward=(key,g,color,mat,id)=>{
  // Keep the native stone material/colour and close its 3cm gap to nominal ground.
  if(key.startsWith('v30-plinth-404-')){g=Y.Footprints.walls(f.geometry,0,.30);color='#afb5a9';}
  add(key,g,color,mat,id);
 };
 return A.footprint(b,f,forward,{key:'sishanyuan404',height:5.5,floors:1,style:'heritage',roof:'hip',palette:{wall:'#8d9086',roof:'#646c67',frame:'#854636'},renderFacade(builder,e,{body,fh,r}){
  // Retain the original edge-by-edge bay distribution, with one fitted window row.
  // No entry location or elaborate lattice pattern is inferred from the group photo.
  const count=Math.max(1,Math.floor(e.len/4.35)),stride=e.len/count;
  for(let k=0;k<count;k++){
   const t=(k+.5)*stride;
   builder.window(e.a[0]+e.ux*t+e.nx*.045,.55+fh*.52,e.a[1]+e.uz*t+e.nz*.045,Math.min(2.75,stride*.68),Math.min(2.65,fh*.63),r,'#854636');
  }
  return true;
 }});
};
})(YY);
