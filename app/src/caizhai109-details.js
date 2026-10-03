/* Caizhai only: close the existing west gallery plinth below its retained floor.
 * The official Confucian Canon centre photograph shows a continuous solid stone
 * base. This local closure does not correct the inherited paired-L massing fit. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/240832220';
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const box=b.n17Box,own=Object.prototype.hasOwnProperty.call(b,'n17Box');let closed=false;
 b.n17Box=function(...args){
  // The first lower gallery is the long main wing; the later short north
  // gallery remains untouched because its real arrangement is unresolved.
  if(!closed&&args[0]==='v17-gallery-slab'&&args[2]===.88&&args[5]===.26&&args[6]===2.6){args[2]=.505;args[5]=1.01;closed=true;}
  return box.apply(this,args);
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.n17Box=box;else delete b.n17Box;}
};
Y.Caizhai109Details={id:ID};
})(YY);
