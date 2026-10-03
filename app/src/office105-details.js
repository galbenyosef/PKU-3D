/* Beigong Building: connect the existing two stair flights to the door plinth.
 * The landing is visible in the university's 2020 front photograph; fitted
 * dimensions retain the existing stair and threshold heights, not a survey. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/240832216';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'historicOffice'),old=b.historicOffice;
 b.historicOffice=function(p,w=59,d=23){
  const result=old.call(this,p,w,d),key='office105-stair-landing';
  // The highest treads end at facade+2.94; the old plinth ends at +1.09.
  // A grounded landing bridges both, with a small rise to the door sill.
  this.mesh(key,this.geo(key,()=>Y.Geo.box()),0,.86,d/2+.06+1.90,11.6,1.72,2.40,'#adada2',10,.245);
  return result;
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.historicOffice=old;else delete b.historicOffice;}
};
Y.Office105Details={id:ID};
})(YY);
