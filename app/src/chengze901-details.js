/* 130's 2023 SW panorama: the ground-floor opening on the west return is
 * broad; the two upper openings remain narrow. Width is a display fit.
 * Preserve every source mesh, the T footprint, heights and the complete roof. */
(function(Y){'use strict';const previous=Y.Architecture30.render;
Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==901||f.properties.id!=='way/916931889')return previous.call(this,b,f,add);
 const ring=f.geometry.coordinates[0],a=ring[2],z=ring[3],len=Math.hypot(z[0]-a[0],z[1]-a[1]),u=[(z[0]-a[0])/len,(z[1]-a[1])/len],n=[-u[1],u[0]],original=b.e.add;let changed=0;
 const close=(a,b)=>Math.abs(a-b)<.002;
 b.e.add=function(k,g,m,c,p,uv){if(p[1]!==901)return original.call(this,k,g,m,c,p,uv);const w=Math.hypot(m[0],m[1],m[2]),h=Math.hypot(m[4],m[5],m[6]),t=(m[12]-a[0])*u[0]+(m[14]-a[1])*u[1],d=(m[12]-a[0])*n[0]+(m[14]-a[1])*n[1];let width,shift;
 if(w&&Math.abs((m[0]*u[0]+m[2]*u[1])/w-1)<1e-5){
  if(p[0]===5&&close(t,1.10)&&close(d,.042)&&close(m[13],2.08)&&close(w,.62)&&close(h,1.60))width=1.80;
  if(p[0]===24&&close(d,.084)){
   if(close(t,1.10)&&(close(m[13],1.28)||close(m[13],2.88))&&close(w,.72)&&close(h,.07))width=1.90;
   if(close(m[13],2.08)&&close(w,.055)&&close(h,1.68)&&(close(t,.79)||close(t,1.41)))shift=(t<1.10?-1:1)*(.90-.31);
  }
 }
 if(width!==undefined||shift!==undefined){const out=new Float32Array(m);if(width!==undefined)for(const i of[0,1,2])out[i]*=width/w;if(shift!==undefined){out[12]+=u[0]*shift;out[14]+=u[1]*shift;}changed++;return original.call(this,k,g,out,c,p,uv);}
 return original.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 return{...result,westGroundReturnWindowPhotoVerified:true,westGroundReturnWindowWidthFit:1.80,westGroundReturnWindowChangedRecords:changed,windowDimensionsMeasured:false,entranceVerified:false};
};})(YY);
