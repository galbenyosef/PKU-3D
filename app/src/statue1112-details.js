/* Foot contact repair; the bronze plinth is visible in the 2004 full-body photograph.
   Thickness is constrained by existing fitted geometry, not a measured reconstruction. */
(function(Y){'use strict';const P=Y.Builder.prototype,original=P.cervantes33;
P.cervantes33=function(){const result=original.apply(this,arguments);if(this.id===1112){
 // Existing stone cap top 1.195; shoe mesh bottom 1.210. A slight overlap
 // at both interfaces survives Float32 transforms without changing the statue.
 const key='statue1112-bronze-foot-contact';
 this.mesh(key,this.geo(key,()=>Y.Geo.box()),0,1.205,0, .86,.024,.70,'#68715b',10);
 }return result;};
})(YY);
