/* Existing Kaiyuan rooftop plant only: close the measured model-space gap.
 * Retain fitted plant count, tops, XZ and all roof/facade geometry; not a survey. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.lawKaiyuan;
P.lawKaiyuan=function(...args){const own=Object.hasOwn(this,'box'),box=this.box;this.box=function(x,y,z,w,h,d,c,mat,part,...rest){if(y===26.85&&z===-15&&w===8&&h===1.4&&d===6&&mat===9&&part===2.57&&[-15,5,25].includes(x)){const top=y+h/2,bottom=25.83+.25/2;y=(top+bottom)/2;h=top-bottom;}return box.call(this,x,y,z,w,h,d,c,mat,part,...rest);};try{return previous.apply(this,args);}finally{if(own)this.box=box;else delete this.box;}};
})(YY);
