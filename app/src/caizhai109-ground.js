/* Close only the existing main-wing plaster/stone joint of Caizhai.
 * Retain the stone ledge, wall top, gallery and all accepted entrance details. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/240832220';
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const box=b.n17Box,own=Object.prototype.hasOwnProperty.call(b,'n17Box');let closed=false;
 b.n17Box=function(...args){
  if(!closed&&args[0]==='v17-plaster-wall'&&Math.abs(args[2]-args[5]/2-.8)<1e-8){args[2]-=.035;args[5]+=.07;closed=true;}
  return box.apply(this,args);
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.n17Box=box;else delete b.n17Box;}
};
})(YY);
