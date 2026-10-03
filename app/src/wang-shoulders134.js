/* Visible south/outboard coping projection only. Photos show a shallow wall-edge
 * lip; high stone/low glass shoulder topology remains unresolved. Keep the old
 * north/inboard boundaries and all heights. 0.12 local is a photo-fit, not survey. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30;
const oldProjection=.55,projection=.12,trim=oldProjection-projection;
P.wangTower30=function(){const box=this.v16box;this.v16box=function(k,x,y,z,w,h,d,c,mat,part){
 if(k==='v16-wang-shoulder-cap'&&(x===-18||x===18))return box.call(this,'wang-shoulders134-coping',x-Math.sign(x)*trim/2,y,z-trim/2,w-trim,h,d-trim,c,mat,part);
 return box.call(this,k,x,y,z,w,h,d,c,mat,part);
};try{return previous.call(this);}finally{this.v16box=box;}};
Y.WangShoulders134={scope:'south-and-outboard-coping-projection-only',oldProjection,projection,worldProjection:projection*.76,heightsUnchanged:true,northAndInboardUnchanged:true,shoulderStepUnresolved:true,source:'https://www.huitu.com/photo/show/20191217/200525503032.html',dimensions:'photo-fit-not-surveyed'};
})(YY);
