/* Surviving historicOffice v9Lattice diagonals only. Preserve entry163 removal,
 * geometry and metric UVs;
 * encode a compensated final normal for the existing vertex shader. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,TAG='office105-lattice-normal183-source';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],projection=n=>Math.abs(n[1])>.55?0:Math.abs(n[2])>Math.abs(n[0])?1:2;
A.render=function(b,f,add){
 if(f.properties.pickId!==105||f.properties.id!=='way/240832216')return prior.call(this,b,f,add);
 const e=b.e,emit=e.add,beam=b.beam,lattice=b.v9Lattice,ownAdd=Object.hasOwn(e,'add'),ownBeam=Object.hasOwn(b,'beam'),ownLattice=Object.hasOwn(b,'v9Lattice');let calls=0,records=0,depth=0;
 b.v9Lattice=function(...args){depth++;try{return lattice.apply(this,args);}finally{depth--;}};
 b.beam=function(...args){
  if(!depth)return beam.apply(this,args);
  if(args[2]!==.022||args[3]!=='#894537'||args[4]!==20||args[5]!==.86)throw Error('Office lattice183 diagonal signature changed');
  if(++calls>190)throw Error('Office lattice183 source count changed');
  const owner=this.e,send=owner.add,own=Object.hasOwn(owner,'add');let count=0;
  owner.add=function(k,g,m,c,p,uv){if(k!=='cyl8_1'||++count!==1)throw Error('Office lattice183 beam emission changed');return send.call(this,TAG,g,m,c,p,uv);};
  try{return beam.apply(this,args);}finally{if(own)owner.add=send;else delete owner.add;}
 };
 e.add=function(k,g,m,c,p,uv){
  if(k!=='v30-'+TAG)return emit.call(this,k,g,m,c,p,uv);
  if(++records>152||p[0]!==20||p[1]!==105||p[3]!==.86||c!=='#894537')throw Error('Office lattice183 final registration changed');
  const a=[Array.from(m.slice(0,3)),Array.from(m.slice(4,7)),Array.from(m.slice(8,11))],co=[cross(a[1],a[2]),cross(a[2],a[0]),cross(a[0],a[1])],det=dot(a[0],co[0]),d=a.map(x=>dot(x,x));
  if(!Number.isFinite(det)||Math.abs(det)<1e-12)throw Error('Office lattice183 singular matrix');
  const v=new Float32Array(g.v);
  for(let i=0;i<v.length;i+=8){const n=Array.from(v.slice(i+3,i+6)),target=[0,1,2].map(k=>co.reduce((s,c,j)=>s+c[k]*n[j],0)/det),q=co.map((c,j)=>d[j]*dot(c,target)/det),length=Math.hypot(...q),unit=q.map(x=>x/length),scale=projection(n)===0?.85/Math.abs(unit[1]):Math.abs(unit[1])>.3?.25/Math.abs(unit[1]):1,fixed=unit.map(x=>Math.fround(x*scale)),size=Math.hypot(...fixed);
   if(!fixed.every(Number.isFinite)||size<.001||size>32||projection(n)!==projection(fixed)||(projection(n)===0?Math.abs(fixed[1])<.8:Math.abs(fixed[1])>.3))throw Error('Office lattice183 projection changed');
   v.set(fixed,i+3);
  }
  const key='office105-lattice-normal183-'+a.flat().map(x=>Object.is(x,-0)?'-0':String(x)).join('_');
  return emit.call(this,key,{...g,v},m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(ownAdd)e.add=emit;else delete e.add;if(ownBeam)b.beam=beam;else delete b.beam;if(ownLattice)b.v9Lattice=lattice;else delete b.v9Lattice;}
 if(calls!==190||records!==152)throw Error('Office lattice183 incomplete assembly');
 return result;
};
})(YY);
