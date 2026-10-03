/* Fashu983: four-storey photo-proportion height fit, not a surveyed elevation.
 * Preserve the existing facade treatment and full inherited roof tessellation. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.id!=='way/1031892013'||f.properties.pickId!==983)return prior.call(this,b,f,add);
 const fr=Y.ArchitectureAdapter.frame(f.geometry),body=14.4,rise=Math.min(5.4,Math.max(1.1,Math.min(fr.w,fr.d)*.17)),height=body+rise;
 const proxy={...f,properties:{...f.properties,height,floors:4,roofTreatment:'hip'}};
 const mesh=b.mesh;let result;
 // Existing spandrel fronts overlap the middle-row glazing by6.5mm. Recess
 // the same solid panel41mm and confine it to the second/third-row gap.
 // Two millimetres of concealed overlap at each end avoid a numerical seam.
 b.mesh=function(key,g,x,y,z,...rest){if(key==='194-north-vertical-spandrel'){z-=.041;y=body*(.515+.5985)/2;rest[1]=body*(.5985-.515)+.004;}return mesh.call(this,key,g,x,y,z,...rest);};
 try{result=prior.call(this,b,proxy,(key,g,c,mat,id)=>add(key+'-983-height-fit',g,c,key==='194-north-gray-brick'?30:mat,id));}finally{b.mesh=mesh;}
 return{...result,strategy:'building983-four-storey-height',bodyHeight:body,totalHeightFit:height,heightMeasured:false,displayHeightRetained:false,roofReconstructed:false,sharedStructureReconstructed:false,scope:'own-north-photo-height-fit; prior-facade-and-placeholder-roof'};
};
})(YY);
