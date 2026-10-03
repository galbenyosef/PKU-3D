/* Chengze104: official three-storey flat roof, registered to its own imagery.
 * Retain the prior three-storey facade; roof rim dimensions remain display fits. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,F=Y.Footprints;
A.render=function(b,f,add){if(f.properties.id!=='way/916931893'||f.properties.pickId!==905)return prior.call(this,b,f,add);
 const fr=Y.ArchitectureAdapter.frame(f.geometry),body=10.85-Math.min(5.4,Math.max(1.1,Math.min(fr.w,fr.d)*.17),10.85*.29);
 const result=A.footprint(b,f,(k,g,c,mat,id)=>{
  if(k.startsWith('v30-roof-ends-905-'))return;
  if(k.startsWith('v30-roof-905-')){k='building905-flat-membrane';g=F.profiledSurface(f.geometry,()=>body,2.6);mat=22;}
  add(k,g,c,mat,id);
 },{height:10.85,floors:3,roof:'hip',style:'modern'});
 b.id=905;
 for(const pg of F.polygons(f.geometry))for(const ring of pg){const s=F.area(ring)>0?1:-1;for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),nx=(c[1]-a[1])/len*s,nz=-(c[0]-a[0])/len*s;
  b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,Math.atan2(nx,nz),()=>b.box(0,body+.10,-.09,len,.22,.18,'#c7cbbf',24));
 }}
 return{...result,strategy:'building905-flat-roof',roof:'flat',roofRise:0,bodyHeight:body,totalHeightFit:body+.21,heightMeasured:false,entranceVerified:false};
};
})(YY);
