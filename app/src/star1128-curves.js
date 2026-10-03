/* Beijing University Star: continuous normals on the existing curved ribbon
 * edges. Positions, UVs, tessellation, supports and island elevation unchanged. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.pkuStar33;
P.pkuStar33=function(...args){
 if(this.id!==1128)return previous.apply(this,args);
 const mesh=this.mesh,own=Object.hasOwn(this,'mesh');
 this.mesh=function(key,geometry,...rest){
  if(/^pku-star33-band-[0-3]$/.test(key)){
   const smoothKey=key+'-1128-continuous-edges';
   const smooth=this.geo(smoothKey,()=>{
    const g=new Y.Geo.Geometry();g.v=Array.from(geometry.v);
    // Each of the 64 arc segments has two planar ribbon quads followed by
    // outer/inner cylindrical edge quads. End caps stay sharply defined.
    for(let segment=0;segment<64;segment++)for(let vertex=12;vertex<24;vertex++){
     const i=(segment*24+vertex)*8,x=g.v[i],y=g.v[i+1]-2.85,r=Math.hypot(x,y),sign=vertex<18?1:-1;
     g.v[i+3]=sign*x/r;g.v[i+4]=sign*y/r;g.v[i+5]=0;
    }
    return g;
   });
   return mesh.call(this,smoothKey,smooth,...rest);
  }
  return mesh.call(this,key,geometry,...rest);
 };
 try{return previous.apply(this,args);}finally{if(own)this.mesh=mesh;else delete this.mesh;}
};
})(YY);
