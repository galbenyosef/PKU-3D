/* Two registered views reject the former thin SW hip outline. Four equal
 * .60 m face-u widths/.12 m vertical shells are a same-construction fit;
 * the northern pair is not independently measured. Keep plateau cap section. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,S={hipHalfWidth:.60,hipThickness:.12,transitionHeight:.30,dimensions:'photo-fit-not-surveyed'};
A.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add,own=Object.prototype.hasOwnProperty.call(b.e,'add');b.e.add=function(k,g,m,c,p,uv){
 if(k==='wang-roof-rise167-caps')return emit.call(this,'wang-hip-caps175-shell',b.geo('wang-hip-caps175-shell',()=>Y.WangRoofRise167.caps(S)),m,c,p,uv);
 if(k.startsWith('wang-roof-rise167-seams-')){const face=Number(k.slice(-1));return emit.call(this,'wang-hip-caps175-seams-'+face,b.geo('wang-hip-caps175-seam-shape-'+face%2,()=>Y.WangRoofRise167.seam(face%2,S)),m,c,p,uv);}
 return emit.call(this,k,g,m,c,p,uv);
};try{return previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}};
Y.WangHipCaps175=S;
})(YY);
