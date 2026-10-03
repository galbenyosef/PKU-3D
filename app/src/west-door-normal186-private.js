/* PRIVATE 186: six complete West Gate leaves. Requires scoped shader decoder.
 * Metadata, geometry and original metric projection are unchanged;
 * encode a compensated final normal for the existing vertex shader. */
(function(Y){'use strict';
if(Y.Engine?.normalProjectionFormat54!==1)throw Error('West door normal projection format54 version 1 required');
const A=Y.Architecture30,prior=A.render,TAG='west-door-normal186-source';
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],projection=n=>Math.abs(n[1])>.55?0:Math.abs(n[2])>Math.abs(n[0])?1:2;
A.render=function(b,f,add){
 if(f.properties.pickId!==54)return prior.call(this,b,f,add);
 const e=b.e,emit=e.add,door=b.westGateDoor,ownAdd=Object.hasOwn(e,'add'),ownDoor=Object.hasOwn(b,'westGateDoor');let calls=0,records=0;
 b.westGateDoor=function(...args){
  if(++calls>6)throw Error('West door186 source count changed');
  const owner=this.e,send=owner.add,own=Object.hasOwn(owner,'add');let count=0;
  owner.add=function(k,g,m,c,p,uv){count++;return send.call(this,TAG+'-'+k,g,m,c,p,uv);};
  let result;try{result=door.apply(this,args);}finally{if(own)owner.add=send;else delete owner.add;}
  if(count!==48)throw Error('West door186 leaf incomplete');return result;
 };
 e.add=function(k,g,m,c,p,uv){
  if(!k.startsWith('v30-'+TAG+'-')){if(p[1]===54&&(p[0]===9||p[0]===20))for(let i=0;i<g.v.length;i+=8)if(Math.hypot(g.v[i+3],g.v[i+4],g.v[i+5])>32)throw Error('West door186 non-target encoding collision');return emit.call(this,k,g,m,c,p,uv);}
  if(++records>288||![9,20].includes(p[0])||p[1]!==54||p[2]!==0)throw Error('West door186 final registration changed');
  const a=[Array.from(m.slice(0,3)),Array.from(m.slice(4,7)),Array.from(m.slice(8,11))],co=[cross(a[1],a[2]),cross(a[2],a[0]),cross(a[0],a[1])],det=dot(a[0],co[0]),d=a.map(x=>dot(x,x));
  if(!Number.isFinite(det)||Math.abs(det)<1e-12)throw Error('West door186 singular matrix');
  const v=new Float32Array(g.v);
  for(let i=0;i<v.length;i+=8){const n=Array.from(v.slice(i+3,i+6)),target=[0,1,2].map(k=>co.reduce((s,c,j)=>s+c[k]*n[j],0)/det),q=co.map((c,j)=>d[j]*dot(c,target)/det),length=Math.hypot(...q),unit=q.map(x=>x/length),scale=[64,128,256][projection(n)],fixed=unit.map(x=>Math.fround(x*scale)),size=Math.hypot(...fixed);
   if(!fixed.every(Number.isFinite)||Math.abs(size-scale)>.001)throw Error('West door186 projection changed');
   v.set(fixed,i+3);
  }
  const key='west-door-normal186-'+k.slice(('v30-'+TAG+'-').length)+'-'+a.flat().map(x=>Object.is(x,-0)?'-0':String(x)).join('_');
  return emit.call(this,key,{...g,v},m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(ownAdd)e.add=emit;else delete e.add;if(ownDoor)b.westGateDoor=door;else delete b.westGateDoor;}
 if(calls!==6||records!==288)throw Error('West door186 incomplete assembly');
 return result;
};
})(YY);
