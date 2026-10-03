/* Named library ridge finials and trusses: compensate the orthogonal-column normal formula
 * without moving geometry or changing its metric texture projection. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,KEY='v30-v11-east-roof-ridge-finial',TRUSS='v30-v11-east-truss';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const projection=n=>Math.abs(n[1])>.55?0:Math.abs(n[2])>Math.abs(n[0])?1:2;
A.render=function(b,f,add){
 if(f.properties.pickId!==1)return prior.call(this,b,f,add);
 const owner=b.e,emit=owner.add,own=Object.prototype.hasOwnProperty.call(owner,'add');let count=0,trusses=0;
 owner.add=function(k,g,m,c,p,uv){
  if(k!==KEY&&k!==TRUSS)return emit.call(this,k,g,m,c,p,uv);
  const truss=k===TRUSS;if(truss)trusses++;else count++;
  if(p[0]!==24||p[1]!==1||count>2||trusses>14)throw Error('Library finial181 registration changed');
  const a=[Array.from(m.slice(0,3)),Array.from(m.slice(4,7)),Array.from(m.slice(8,11))],co=[cross(a[1],a[2]),cross(a[2],a[0]),cross(a[0],a[1])],det=dot(a[0],co[0]),d=a.map(v=>dot(v,v));
  if(!Number.isFinite(det)||Math.abs(det)<1e-12)throw Error('Library finial181 singular frame');
  const v=new Float32Array(g.v);
  for(let i=0;i<v.length;i+=8){const n=Array.from(v.slice(i+3,i+6)),target=[0,1,2].map(k=>co.reduce((s,c,j)=>s+c[k]*n[j],0)/det),q=co.map((c,j)=>d[j]*dot(c,target)/det),len=Math.hypot(...q),unit=q.map(x=>x/len),scale=truss?(projection(n)===0?.85/Math.abs(unit[1]):Math.abs(unit[1])>.3?.25/Math.abs(unit[1]):1):1,fixed=unit.map(x=>Math.fround(x*scale));
   if(!(len>0&&Number.isFinite(len))||!fixed.every(Number.isFinite)||Math.hypot(...fixed)<.001||Math.hypot(...fixed)>32||projection(n)!==projection(fixed)||(truss&&(projection(n)===0?Math.abs(fixed[1])<.8:Math.abs(fixed[1])>.3)))throw Error('Library finial181 texture projection changed');
   v.set(fixed,i+3);
  }
  // Normal compensation is matrix-specific. Never overwrite the old shared box.
  const key='library-finial-normal181-'+(truss?'truss-':'finial-')+a.flat().map(x=>Object.is(x,-0)?'-0':String(x)).join('_');
  return emit.call(this,key,{...g,v},m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(own)owner.add=emit;else delete owner.add;}
 if(count!==2||trusses!==14)throw Error('Library finial181 incomplete registration');
 return result;
};
})(YY);
