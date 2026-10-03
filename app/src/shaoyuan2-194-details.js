/* Shaoyuan 2's photographed central entry surround (2016 official new facade).
 * Opening dimensions follow the inherited fit. Door leaf subdivision, hardware
 * and any changed 2025 entrance details remain unverified. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render;
A.render=function(b,f,...args){
 const result=previous.call(this,b,f,...args);
 if(f.properties.id!=='way/445016207'||f.properties.pickId!==194)return result;
 const id=b.id;b.id=194;
 try{b.local(-351.16,0,176.1,Math.PI/2,()=>{
  // The glazing ends at 3.30; the inherited canopy underside is 3.475.
  // A real head and two jambs close that reveal without another opaque pane.
  for(const s of[-1,1])b.box(s*2.75,1.74,.105,.14,3.48,.16,'#dfe3d9',24,1.194);
  b.box(0,3.36,.105,5.64,.25,.16,'#dfe3d9',24,1.194);
 });}finally{b.id=id;}
 return result;
};
})(YY);
