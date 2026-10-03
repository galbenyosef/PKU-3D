/* Chengze western third slab: OSM/2024 map 106, 2022 plan 108; official 2025 scope
 * specifies three storeys and a flat roof. 11.25 m is the former feature's
 * 7.5 m / two-storey estimate scaled to three, not a measured height.
 * Door and facade schedules remain unverified. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/916931896';
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==908)return prior.call(this,b,f,add);
 const total=11.25,body=total-.825;
 const r=A.footprint(b,f,(k,g,c,m,id)=>{
  // Preserve the source roof's full plan tessellation on the corrected flat
  // membrane, with the flat-roof material and its original physical UV scale.
  if(k.startsWith('v30-flat-roof-'))g=Y.Footprints.profiledSurface(f.geometry,()=>body,2.6);
  add(k,g,c,m,id);
 },{floors:3,height:body,roof:'flat',style:'modern',key:'908-three-flat'});
 return{...r,strategy:'building908-documented-three-storeys',officialFloors:3,totalHeightFit:total,heightMeasured:false,sourceFootprintPreserved:true,entranceVerified:false,facadesVerified:false};};
})(YY);
