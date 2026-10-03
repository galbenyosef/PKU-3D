/* Remote Sensing Building main entry (way/104345641, pick41).
 * Existing official 2024 graduation photo establishes framed inward-open
 * leaves and silver closer arms; no new style or hidden pulls are inferred.
 * Close two 2.5mm leaf-glass edge gaps with 2mm frame insertion. Move the
 * first closer-arm endpoint into its existing housing underside, retaining
 * elbow/leaf endpoints and all opening, floor, stair and approach geometry. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.pickId!==41||f.properties.id!=='way/104345641')return prior.call(this,b,f,add);
 const keys=['box','beam'],saved=keys.map(k=>[k,Object.hasOwn(b,k),b[k]]),box=b.box,beam=b.beam;
 b.box=function(x,y,z,w,h,d,c,mat,...rest){
  if(mat===28&&c==='#718c98'&&Math.abs(w-1.0925)<1e-8&&Math.abs(h-1.815)<1e-8&&d===.030&&z===0)w+=.009;
  return box.call(this,x,y,z,w,h,d,c,mat,...rest);
 };
 b.beam=function(a,c,r,col,mat,...rest){
  if(col==='#b9c2bf'&&r===.013&&mat===29&&Math.abs(a[1]-2.45)<1e-8&&Math.abs(c[1]-2.41)<1e-8&&Math.abs(a[2]+2.67)<1e-8){a=a.slice();a[1]=2.48;}
  return beam.call(this,a,c,r,col,mat,...rest);
 };
 try{return prior.call(this,b,f,add);}finally{for(const[k,own,fn]of saved){if(own)b[k]=fn;else delete b[k];}}
};})(YY);
