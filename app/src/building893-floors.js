/* Chengze126: three-storey flat-roof building in the official2025 scope.
 * 11.25m is a display-height fit from this feature's former7.5m/two-storey
 * estimate, not a measurement of126 or of its neighbors. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.id!=='way/916931881'||f.properties.pickId!==893)return prior.call(this,b,f,add);
 const top=11.25,body=top-.825;
 const result=A.footprint(b,f,(k,g,c,mat,id)=>{
  // Retain the original hip's plan tessellation density on the corrected flat
  // membrane. Flat roof material replaces the inappropriate pitched-roof finish.
  if(k.startsWith('v30-flat-roof-'))g=Y.Footprints.profiledSurface(f.geometry,()=>body,2.6);
  add(k,g,c,mat,id);
 },{height:body,floors:3,roof:'flat',style:'modern',key:'893-three-flat'});
 return{...result,strategy:'building893-three-floor-mass',officialFloors:3,totalHeightFit:top,heightMeasured:false,entranceVerified:false,allFacadesVerified:false};
};
})(YY);
