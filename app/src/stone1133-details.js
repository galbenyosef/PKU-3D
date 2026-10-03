/* Official economics forecourt photo: lettering occupies the right-hand field.
 * Fit layout only; original stone, atlas pixels, and uncertain placement stay intact. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.economicsMarker32;
P.economicsMarker32=function(...args){if(this.id!==1133)return prior.apply(this,args);
 const own=Object.hasOwn(this,'mesh'),mesh=this.mesh;
 this.mesh=function(key,g,x,y,z,sx,sy,sz,c,mat,part,r,uv){
  if(key==='v32-econ-name'||key==='v32-econ-en'){
   const chinese=key==='v32-econ-name',ratio=chinese?2.48/sx:2.20/sx;
   x=.83;sx*=ratio;sy=chinese?.57:sy*ratio;
   const slope=.06/1.87,zFront=.34-(y-.17)*slope;
   z=zFront+.004;const k=key+'-1133-sloped',h=sy;
   g=this.geo(k,()=>{const q=new Y.Geo.Geometry(),normal=Y.M.norm([0,slope*h,1]);
    for(let i=0;i<g.v.length;i+=24){const ps=[0,8,16].map(j=>[g.v[i+j],g.v[i+j+1],-slope*h*g.v[i+j+1]]),tex=[0,8,16].map(j=>g.v.slice(i+j+6,i+j+8));q.tri(...ps,tex,[normal,normal,normal]);}return q;});key=k;
  }return mesh.call(this,key,g,x,y,z,sx,sy,sz,c,mat,part,r,uv);
 };try{return prior.apply(this,args);}finally{if(own)this.mesh=mesh;else delete this.mesh;}
};})(YY);
