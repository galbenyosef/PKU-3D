/* Private model-consistency candidate: extend the already modelled top tread
 * inward until it meets the already modelled entry backing. Does not establish
 * actual landing dimensions, actual step count, door design or outer access. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render;
A.render=function(b,f,...args){if(f.properties.pickId!==119||f.properties.id!=='way/240832231')return previous.call(this,b,f,...args);
 const emit=b.e.add,own=Object.hasOwn(b.e,'add');let backing=null,changed=0;
 b.e.add=function(k,g,m,c,p,uv){
  if(k==='v30-box'&&c==='#263331'&&p[1]===119)backing=Array.from(m);
  if(k==='v30-box'&&c==='#bcbeba'&&p[1]===119&&Math.abs(m[13]+m[5]/2-.45040219)<1e-5){
   if(!backing||uv)throw Error('Entry datum changed');
   const depth=Math.hypot(m[8],m[9],m[10]),n=[m[8]/depth,m[9]/depth,m[10]/depth],bd=Math.hypot(backing[8],backing[9],backing[10]);
   if(Math.abs((backing[13]-backing[5]/2)-(m[13]+m[5]/2))>1e-5)throw Error('Entry and tread heights no longer coincide');
   const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),oldInner=dot(Array.from(m).slice(12,15),n)-depth/2,target=dot(backing.slice(12,15),n)+bd/2-.001,gap=oldInner-target;
   if(!(gap>.3&&gap<.5))throw Error('Unexpected entry gap');
   const next=new Float32Array(m),top=m[13]+m[5]/2,base=.045;next[5]=top-base;next[13]=(top+base)/2;for(let i=0;i<3;i++){next[8+i]*=(depth+gap)/depth;next[12+i]-=n[i]*gap/2;}
   for(const x of[-.5,.5])for(const z of[-.5,.5]){const q=Y.M.apply(next,[x,0,z,1]);if(!Y.Footprints.inside([q[0],q[2]],f.geometry))throw Error('Landing leaves existing footprint');}
   Y.Shaoyuan119Landing326={gap,depth,newDepth:depth+gap,base,top:m[13]+m[5]/2,backingBottom:backing[13]-backing[5]/2};m=next;changed++;
  }
  return emit.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,...args);}finally{if(own)b.e.add=emit;else delete b.e.add;}if(changed!==1)throw Error('Expected one existing top tread');return result;
};})(YY);
