/* Public scan + sony020 display registration; no shoreline or paving edits.
 * Keep312 lintel/posts. Only the four brace low anchors descend40mm. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.willowArch33;
P.willowArch33=function(...args){
 const keys=['origin','rotation','beam'],descriptors=keys.map(k=>Object.getOwnPropertyDescriptor(this,k)),beam=this.beam;
 const values=[[-254.507935,.02,-359.674272],46.04507429419278*Math.PI/180,function(a,b,...rest){
  if(a[1]===2.97&&b[1]===.06&&Math.abs(b[0])===1.76&&Math.abs(b[2])===1)b=[b[0],.02,b[2]];
  return beam.call(this,a,b,...rest);
 }];
 try{keys.forEach((k,i)=>Object.defineProperty(this,k,{value:values[i],writable:true,enumerable:descriptors[i]?.enumerable??true,configurable:true}));return prior.apply(this,args);}
 finally{keys.forEach((k,i)=>{if(descriptors[i])Object.defineProperty(this,k,descriptors[i]);else delete this[k];});}
};})(YY);
