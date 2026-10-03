/* Exact two canopy brace source calls only. Preserve geometry and metric UVs;
 * encode a compensated final normal for the existing vertex shader. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,TAG='library-canopy-normal182-source';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],projection=n=>Math.abs(n[1])>.55?0:Math.abs(n[2])>Math.abs(n[0])?1:2;
function brace(a,z,t,c,mat,part){return[-1,1].some(s=>a?.length===3&&z?.length===3&&a.every((x,i)=>x===[s*6.3,5.55,22.7][i])&&z.every((x,i)=>x===[s*10,7.32,30.7][i]))&&t===.075&&c==='#6b7168'&&mat===9&&part===1.76;}
A.render=function(b,f,add){
 if(f.properties.pickId!==1)return prior.call(this,b,f,add);
 const e=b.e,emit=e.add,beam=b.beam,ownAdd=Object.hasOwn(e,'add'),ownBeam=Object.hasOwn(b,'beam');let calls=0,records=0;
 b.beam=function(...args){
  if(!brace(...args))return beam.apply(this,args);
  if(++calls>2)throw Error('Library canopy182 source count changed');
  const owner=this.e,send=owner.add,own=Object.hasOwn(owner,'add');let count=0;
  owner.add=function(k,g,m,c,p,uv){if(k!=='cyl8_1'||++count!==1)throw Error('Library canopy182 beam emission changed');return send.call(this,TAG,g,m,c,p,uv);};
  try{return beam.apply(this,args);}finally{if(own)owner.add=send;else delete owner.add;}
 };
 e.add=function(k,g,m,c,p,uv){
  if(k!=='v30-'+TAG)return emit.call(this,k,g,m,c,p,uv);
  if(++records>2||p[0]!==9||p[1]!==1||p[3]!==1.76||c!=='#6b7168')throw Error('Library canopy182 final registration changed');
  const a=[Array.from(m.slice(0,3)),Array.from(m.slice(4,7)),Array.from(m.slice(8,11))],co=[cross(a[1],a[2]),cross(a[2],a[0]),cross(a[0],a[1])],det=dot(a[0],co[0]),d=a.map(x=>dot(x,x));
  if(!Number.isFinite(det)||Math.abs(det)<1e-12)throw Error('Library canopy182 singular matrix');
  const v=new Float32Array(g.v);
  for(let i=0;i<v.length;i+=8){const n=Array.from(v.slice(i+3,i+6)),target=[0,1,2].map(k=>co.reduce((s,c,j)=>s+c[k]*n[j],0)/det),q=co.map((c,j)=>d[j]*dot(c,target)/det),length=Math.hypot(...q),unit=q.map(x=>x/length),scale=projection(n)===0?.85/Math.abs(unit[1]):Math.abs(unit[1])>.3?.25/Math.abs(unit[1]):1,fixed=unit.map(x=>Math.fround(x*scale)),size=Math.hypot(...fixed);
   if(!fixed.every(Number.isFinite)||size<.001||size>32||projection(n)!==projection(fixed)||(projection(n)===0?Math.abs(fixed[1])<.8:Math.abs(fixed[1])>.3))throw Error('Library canopy182 projection changed');
   v.set(fixed,i+3);
  }
  const key='library-canopy-normal182-'+a.flat().map(x=>Object.is(x,-0)?'-0':String(x)).join('_');
  return emit.call(this,key,{...g,v},m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(ownAdd)e.add=emit;else delete e.add;if(ownBeam)b.beam=beam;else delete b.beam;}
 if(calls!==2||records!==2)throw Error('Library canopy182 incomplete assembly');
 return result;
};
})(YY);
