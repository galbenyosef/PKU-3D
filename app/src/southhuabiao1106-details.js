/* Continuous south-column lotus bearing: broad shoulders and tapered lower tips.
 * Twenty-four repetitions and dimensions remain photo-based display fits. */
(function(Y){'use strict';const previous=Y.Heritage31.render;
function lotusBand(){
 const g=new Y.Geo.Geometry(),N=576,H=14,tau=Math.PI*2;
 const point=(a,t)=>{t=Math.max(0,Math.min(1,t));const q=Math.abs(Math.atan2(Math.sin(a*24),Math.cos(a*24)))/Math.PI;
  const bottom=.62+.055*q*q,wide=.08+.92*Math.sin(Math.min(1,t/.8)*Math.PI/2),shoulder=Math.max(0,1-(q/wide)**2),relief=.036*Math.sin(Math.PI*t)*shoulder;
  const r=.72+.095*t+.012*Math.sin(Math.PI*t)+relief;return[Math.sin(a)*r,bottom+(.93-bottom)*t,Math.cos(a)*r];
 };
 const normal=(a,t)=>Y.M.norm(Y.M.cross(Y.M.sub(point(a+.0001,t),point(a-.0001,t)),Y.M.sub(point(a,t+.0001),point(a,t-.0001))));
 for(let j=0;j<H;j++)for(let i=0;i<N;i++){const a=i*tau/N,b=(i+1)*tau/N,t=j/H,u=(j+1)/H,A=point(a,t),B=point(b,t),C=point(b,u),D=point(a,u),ns=[normal(a,t),normal(b,t),normal(b,u),normal(a,u)],uv=[[a*.78,A[1]],[b*.78,B[1]],[b*.78,C[1]],[a*.78,D[1]]];
  g.tri(A,B,C,[uv[0],uv[1],uv[2]],[ns[0],ns[1],ns[2]]);g.tri(A,C,D,[uv[0],uv[2],uv[3]],[ns[0],ns[2],ns[3]]);
 }
 for(let i=0;i<N;i++){const a=i*tau/N,b=(i+1)*tau/N;g.tri([0,.62,0],point(b,0),point(a,0));g.tri([0,.93,0],point(a,1),point(b,1));}
 return g;
}
Y.Heritage31.render=function(b,f){
 if(f.properties.id!=='node/4754165059')return previous(b,f);
 const emit=b.e.add;let corrected=false;
 b.e.add=function(k,g,m,c,p,uv){
  if(k==='cyl8_1'&&p[1]===1106&&Math.abs(m[5]-.31)<1e-5&&Math.abs(m[0]-1.09)<1e-5&&Math.abs(m[10]-1.09)<1e-5){
   const mm=new Float32Array(m),scale=.68/1.09;for(const i of[0,1,2,8,9,10])mm[i]*=scale;corrected=true;return emit.call(this,k,g,mm,c,p,uv);
  }return emit.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous(b,f);}finally{b.e.add=emit;}
 if(corrected){const old=b.id;b.id=1106;try{b.local(f.properties.centre[0],.1,f.properties.centre[1],f.properties.rotation||0,()=>{
  b.mesh('southhuabiao1106-lotus-band',b.geo('southhuabiao1106-lotus-band',lotusBand),0,0,0,1,1,1,'#babfb3',10,.23);
 });}finally{b.id=old;}}
 return result;
};
})(YY);
