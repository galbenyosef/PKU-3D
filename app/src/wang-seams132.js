/* Keep the photo-fit seam paths; bake their tilted boxes before the tower's
 * horizontal fit so the renderer receives orthogonal instance axes. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo,M=Y.M;
 function slopeGeometry(face){
  const {base,plateau,rise,baseY}=Y.WangRoof120,B=base.map(v=>v/2),T=plateau.map(v=>v/2),y=rise,g=new G.Geometry(),unit=G.box();
  const bottom=[[-B[0],0,-B[1]],[-B[0],0,B[1]],[B[0],0,B[1]],[B[0],0,-B[1]]],top=[[-T[0],y,-T[1]],[-T[0],y,T[1]],[T[0],y,T[1]],[T[0],y,-T[1]]],i=face,j=(i+1)%4,normal=M.norm(M.cross(M.sub(bottom[j],bottom[i]),M.sub(top[j],bottom[i])));
  for(let k=1;k<24;k++){
   const t=k/24,a=bottom[i].map((v,d)=>v+(bottom[j][d]-v)*t),b=top[i].map((v,d)=>v+(top[j][d]-v)*t),delta=M.sub(b,a),lo=a.map((v,d)=>v+delta[d]*.008),hi=a.map((v,d)=>v+delta[d]*.990),up=M.norm(M.sub(hi,lo)),side=M.norm(M.cross(up,normal)),len=Math.hypot(...M.sub(hi,lo)),mid=lo.map((v,d)=>(v+hi[d])/2+normal[d]*.015+(d===1?baseY:0));
   const lm=new Float32Array([...M.mul(side,.065),0,...M.mul(up,len),0,...M.mul(normal,.045),0,...mid,1]);
   // Match the original box vertices and UVs in their original triangle order.
   // The local frame is orthogonal before Architecture30's horizontal fit.
   const axes=[0,4,8].map(o=>lm.slice(o,o+3)),lengthSq=axes.map(a=>M.dot(a,a));
   for(let v=0;v<unit.v.length;v+=8){const n=[0,1,2].map(d=>axes.reduce((sum,axis,k)=>sum+axis[d]*unit.v[v+3+k]/lengthSq[k],0));g.vertex(M.apply(lm,[...unit.v.slice(v,v+3),1]).slice(0,3),M.norm(n),unit.v.slice(v+6,v+8));}
  }
  return g;
 }
 P.wangTower30=function(){const add=this.e.add,builder=this;let count=0;
  this.e.add=function(key,geo,m,color,params,uv){
   if(key!=='wang-roof120-seam')return add.call(this,key,geo,m,color,params,uv);
   const index=count++,face=Math.floor(index/23);if(index%23)return;
   const shape=builder.geo('wang-seams132-shape-'+face%2,()=>slopeGeometry(face%2)),root=M.transform(builder.origin,[1,1,1],builder.rotation+(face>=2?Math.PI:0));
   // Four ordered buckets retain the four original slope runs; opposite slopes
   // share byte-identical geometry and differ only by a half-turn instance.
   return add.call(this,'wang-seams132-face-'+face,shape,root,color,params,uv);
  };
  try{previous.call(this);}finally{this.e.add=add;}
 };
 Y.WangSeams132={slopeGeometry,paths:'unchanged-photo-fit',seamsPerSlope:23,sharedShapes:2};
})(YY);
