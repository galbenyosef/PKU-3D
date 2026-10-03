/* Keep Tizhai's original six pagoda tile rings; seat the decorative hip ridges
 * on those rings instead of spanning the concave roof with floating chords. */
(function(Y){'use strict';const P=Y.Builder.prototype,old=P.northOctagon;
// Preserve the original source frame: ridge end-cap width must not rescale the building.
const adapter=Y.ArchitectureAdapter,render=adapter.render;
adapter.render=function(b,f,method,source,options={}){if(f.properties.id==='way/445014559')options={...options,sourceFrame:{centre:[0,0],w:14.975287936627865,d:14.933654576539995}};return render.call(this,b,f,method,source,options);};
const rings=[[1,.1],[.99,0],[.88,-.03],[.78,.16],[.59,.57],[.43,.95]];
P.northOctagon=function(p,w,d){if(this.id!==189)return old.call(this,p,w,d);const beam=this.beam;
this.beam=function(a,b,width,color,mat,part){const radius=Math.hypot(a[0],a[2]),roof= Math.abs(radius-8)<1e-5?[10.75,3.9]:Math.abs(radius-7.8)<1e-5?[5.1,1.2]:null;
if(roof&&width===.11&&mat===2&&part===2.18){const [base,height]=roof,n=[a[0]/radius,a[2]/radius];for(let i=0;i<rings.length-1;i++){const point=([r,y])=>[n[0]*radius*r,base+height*y+.035,n[1]*radius*r];beam.call(this,point(rings[i]),point(rings[i+1]),width,color,mat,part);}return;}
return beam.call(this,a,b,width,color,mat,part);};
try{return old.call(this,p,w,d);}finally{this.beam=beam;}
};Y.Tizhai189Roof={rings,roofFacesUnchanged:true,ridgeFollowsExistingTileProfile:true};
})(YY);
