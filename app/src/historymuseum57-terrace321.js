/* Pick 57: bounded plaque study from the official 2024 terrace photographs.
 * The southeast/east-wall registration follows the northeast Archive backdrop
 * and the stated east slope / south water. Axial placement and size are fits.
 * No terrace footprint, hidden support, furniture layout or calligraphy facsimile
 * is asserted. Existing east windows, roof, entries and grade remain unchanged. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render;
 const fit=Object.freeze({east:7.70,along:16.10,width:2.40,height:.90,thickness:.06,centreAboveFloor:2.05});
 function plaque(b,f){
  const fr=Y.HistoryMuseum46.frame(f),floor=Y.History240.floor,oldId=b.id,emit=b.e.add;
  b.id=57;
  b.e.add=function(k,...args){return emit.call(this,'history321-terrace-plaque-'+k,...args);};
  try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
   b.local(fit.east+.10,0,fit.along,Math.PI/2,()=>{
    const y=floor+fit.centreAboveFloor;
    // A closed wood plate meets the existing continuous east wall at its back.
    b.box(0,y,0,fit.width,fit.height,fit.thickness,'#a94723',6);
    // Existing native lettering is a readable title, not the photographed script.
    b.lettering('志愿者之家',0,y,.033,fit.width*.86,fit.height*.63,0,'#25765d');
   });
  });}finally{b.e.add=emit;b.id=oldId;}
 }
 A.render=function(b,f,add){const result=previous.call(this,b,f,add);if(f.properties.pickId===57)plaque(b,f);return result;};
 Y.HistoryTerrace321=Object.freeze({fit,plaque,scope:'2024 named terrace wooden plaque only; dimensions/axis are fits; script not reproduced'});
})(YY);
