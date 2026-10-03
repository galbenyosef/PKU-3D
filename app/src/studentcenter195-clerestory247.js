/* Close the accidental gap below the existing student-center clerestory panes.
 * Window locations and dimensions remain the existing, unmeasured fit. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/445016209';
const sill=/^studentcenter46-(west-outside|west-north-end|west-south-end|west-above-atrium|north-outside|south-outside|north-inner|south-inner)-masonry-box$/;
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const original=b.e.add;
 b.e.add=function(key,g,m,color,p,uv){
  // Existing masonry stops at top-2.65; the pane starts at top-2.32.
  // Preserve the lower edge and grow this course to the pane's lower edge.
  if(sill.test(key)&&p[0]===18&&Math.abs(m[5]-.60)<1e-5){
   const closed=new Float32Array(m);closed[5]=.93;closed[13]+=.165;
   return original.call(this,key,g,closed,color,p,uv);
  }
  return original.call(this,key,g,m,color,p,uv);
 };
 try{return previous.call(this,b,f,add);}finally{b.e.add=original;}
};
Y.StudentCenter195Clerestory247={id:ID};
})(YY);
