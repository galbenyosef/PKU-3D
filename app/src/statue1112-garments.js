/* Front/oblique photo silhouette fit, not a scan. Hidden back detail is not reconstructed. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.cervantes33,M=Y.M;
// Forty angular segments retain the original loft tessellation; denser vertical
// sampling supports curved hems and folds without flattening the original detail.
function surface(point,rows,cols=40,doubleSided=false){const g=new Y.Geo.Geometry(),normal=(u,v)=>{const e=.00001,du=M.sub(point(Math.min(1,u+e),v),point(Math.max(0,u-e),v)),dv=M.sub(point(u,v+e),point(u,v-e));return M.norm(M.cross(du,dv));};
 for(let j=0;j<rows;j++)for(let k=0;k<cols;k++){const u=j/rows,U=(j+1)/rows,v=k/cols,V=(k+1)/cols,a=point(u,v),b=point(U,v),c=point(U,V),d=point(u,V),na=normal(u,v),nb=normal(U,v),nc=normal(U,V),nd=normal(u,V);
 g.tri(a,b,c,undefined,[na,nb,nc]);g.tri(a,c,d,undefined,[na,nc,nd]);if(doubleSided){g.tri(d,c,b,undefined,[nd.map(x=>-x),nc.map(x=>-x),nb.map(x=>-x)]);g.tri(d,b,a,undefined,[nd.map(x=>-x),nb.map(x=>-x),na.map(x=>-x)]);}}return g;}
function interpolate(rows,y){let i=1;while(i<rows.length-1&&y>rows[i][0])i++;const a=rows[i-1],b=rows[i],t=Math.max(0,Math.min(1,(y-a[0])/(b[0]-a[0])));return a.map((x,k)=>x+(b[k]-x)*t);}
function garment(key){
 if(key==='cerv33-draped-cloak')return surface((u,v)=>{
  const a=-.15+v*(Math.PI+.30),hem=.77+.12*v+.06*Math.sin(3*Math.PI*v),shoulder=1.68+.06*Math.sin(Math.PI*v),r=.28+.29*Math.pow(1-u,.9),fold=.020*Math.sin(5*Math.PI*v+.3*u)*Math.pow(1-u,1.2);
  // Existing local origin x=.19,z=-.13: center the photographed drape around
  // both shoulders, shorten it to the breeches and curve its hanging edge.
  return [Math.cos(a)*(r+fold)-.19,hem+(shoulder-hem)*u,-Math.sin(a)*(.10+.20*(1-u))+fold+.07*u];
 },26,32,true);
 if(key==='cerv33-doublet-rounded')return surface((u,v)=>{const a=v*Math.PI*2,y=.84+u*.94,p=interpolate([[.84,.30,.18],[.98,.285,.18],[1.13,.205,.17],[1.40,.255,.205],[1.60,.31,.19],[1.73,.23,.16],[1.78,.17,.13]],y),hem=(.105*Math.abs(Math.cos(a))-.025*Math.max(0,Math.sin(a)))*Math.pow(1-u,8),fold=.006*Math.sin(4*a)*Math.sin(u*Math.PI)*Math.max(0,Math.sin(a));return [p[1]*Math.cos(a),y+hem,p[2]*Math.sin(a)+fold];},26);
 const leg=key.match(/^cerv34-leg-(-?1)$/);if(leg){const s=Number(leg[1]);return surface((u,v)=>{const a=v*Math.PI*2,y=.09+u*.94,p=interpolate([[.09,.087,.09,s*.17,.05],[.35,.095,.095,s*.15,.01],[.55,.110,.115,s*.145,0],[.62,.115,.12,s*.145,0],[.76,.181,.163,s*.15,0],[.89,.173,.17,s*.145,0],[1.03,.135,.14,s*.13,0]],y),fold=.011*Math.sin(a*7+.5*y)*Math.max(0,Math.sin(a))*Math.sin(Math.PI*Math.max(0,Math.min(1,(y-.60)/.43)));return[p[3]+(p[1]+fold)*Math.cos(a),y,p[4]+(p[2]+fold)*Math.sin(a)];},24);}
 const sleeve=key.match(/^cerv34-sleeve-(-?1)$/);if(sleeve){const s=Number(sleeve[1]);return surface((u,v)=>{const a=v*Math.PI*2,y=1.12+u*.57,p=interpolate([[1.12,.125,.125,s*.43,.055],[1.22,.14,.15,s*.42,.035],[1.40,.15,.16,s*.35,.01],[1.58,.16,.17,s*.28,0],[1.69,.115,.13,s*.24,-.01]],y),fold=.014*Math.sin(a*5+u*5)*Math.sin(u*Math.PI)*Math.max(0,Math.sin(a));return[p[3]+(p[1]+fold)*Math.cos(a),y,p[4]+(p[2]+fold)*Math.sin(a)];},16);}
 return null;
}
P.cervantes33=function(){if(this.id!==1112)return previous.apply(this,arguments);const mesh=this.mesh;this.mesh=function(key,g,...args){if(key==='cerv33-draped-cloak'||key==='cerv33-doublet-rounded'||/^cerv34-(leg|sleeve)-(-?1)$/.test(key)){const revised=key+'-photo1112';return mesh.call(this,revised,this.geo(revised,()=>garment(key)),...args);}if(key==='sphereSmooth'&&args[0]===0&&args[2]===.18&&args[3]===.015&&args[4]===.017&&args[6]==='#66715b'){args[2]=interpolate([[.84,.18],[.98,.18],[1.13,.17],[1.40,.205],[1.60,.19],[1.73,.16],[1.78,.13]],args[1])[1]+.010;}return mesh.call(this,key,g,...args);};try{return previous.apply(this,arguments);}finally{this.mesh=mesh;}};
})(YY);
