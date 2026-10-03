/* May Fourth track: fitted to way/783033430 around soccer way/1101754966.
 * Radii are display fits, not surveyed or competition-certified dimensions. */
(function(Y){'use strict';
 const original=Y.Sports32.render,inner=36.61181683287843,straight=40.6,lane=1.0987950561509228;
 function capsule(r){const p=[];for(let i=0;i<=64;i++){const a=i*Math.PI/64;p.push([1+Math.cos(a)*r,straight+Math.sin(a)*r]);}for(let i=0;i<=64;i++){const a=Math.PI+i*Math.PI/64;p.push([1+Math.cos(a)*r,-straight+Math.sin(a)*r]);}p.push(p[0]);return p;}
 Y.Sports32.render=function(b,f){
  if(f.properties.pickId!==248||f.properties.id!=='way/783033430')return original.call(this,b,f);
  const mesh=b.mesh;
  b.mesh=function(key,g,...args){
   if(key==='track40-infield'){g=Y.Footprints.surface({type:'Polygon',coordinates:[capsule(inner)]},.18);args[7]=0;}
   if(key==='track40-lanes'){
    g=new Y.Geo.Geometry();for(let i=0;i<=8;i++)g.v.push(...Y.Geo.ribbon(capsule(inner+i*lane).slice(0,-1),.10,.235,true).v);
    g.v.push(...Y.Geo.ribbon([[1+inner,straight*.55],[1+inner+8*lane,straight*.55]],.12,.237,false).v);
   }
   return mesh.call(this,key,g,...args);
  };
  try{return original.call(this,b,f);}finally{b.mesh=mesh;}
 };
})(YY);
