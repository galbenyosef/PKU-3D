/* Seven individually mounted calligraphic letters, traced from the original
 * PKU photograph. Their complete spacing is retained; dimensions are fitted
 * to the photographed facade width, not surveyed. No rectangular signboard. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,D=Y.StudentCenter195NameTrace;
const spec={id:'way/445016209',pixelSize:41.638/1378,pixelHeight:41.638/1378,centrePixel:[829.5,447],centreY:10.46,depth:.035,headerBottom:9.70};
A.render=function(b,f,add){
 if(f.properties.id!==spec.id||f.properties.pickId!==195)return previous.call(this,b,f,add);
 const lettering=b.lettering,own=Object.prototype.hasOwnProperty.call(b,'lettering'),box=b.box,ownBox=Object.prototype.hasOwnProperty.call(b,'box');
 // The photo's header is about 1.6 m relative to the full frontage, rather
 // than the old 1.1 m strip. Keep its top and the recessed glazing fixed.
 b.box=function(x,y,z,w,h,d,...rest){
  if(Math.abs(x-41.21)<1e-6&&y===10.75&&h===1.10&&Math.abs(d-41.638)<1e-6){y=10.5;h=1.6;}
  return box.call(this,x,y,z,w,h,d,...rest);
 };
 b.lettering=function(text,x,y,z,w,h,r,color){
  if(text!==D.text)return lettering.apply(this,arguments);
  // Retain the original atlas slot so all other signs keep their exact UVs.
  const mesh=this.mesh,ownMesh=Object.prototype.hasOwnProperty.call(this,'mesh');
  this.mesh=function(){};
  try{lettering.apply(this,arguments);}finally{if(ownMesh)this.mesh=mesh;else delete this.mesh;}
  const key='studentcenter195-photo-name',shape=this.geo(key,()=>{
   const g=new G.Geometry(),unit=G.box(),s=spec.pixelSize;
   for(const [px,py,pw,ph]of D.rects){
    const xx=(px+pw/2-spec.centrePixel[0])*s,yy=(spec.centrePixel[1]-py-ph/2)*spec.pixelHeight;
    for(let i=0;i<unit.v.length;i+=8)g.vertex([xx+unit.v[i]*pw*s,yy+unit.v[i+1]*ph*spec.pixelHeight,unit.v[i+2]*spec.depth],unit.v.slice(i+3,i+6),unit.v.slice(i+6,i+8));
   }
   return g;
  });
  this.mesh(key,shape,x+.025,spec.centreY,z,1,1,1,'#413c34',9,.85,r);
 };
 try{return previous.call(this,b,f,add);}finally{if(own)b.lettering=lettering;else delete b.lettering;if(ownBox)b.box=box;else delete b.box;}
};
Y.StudentCenter195Name={...spec,source:D.source,sourceSHA256:D.sha256};
})(YY);
