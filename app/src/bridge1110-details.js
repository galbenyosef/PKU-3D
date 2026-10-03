/* Lake island flat bridge: retain dressed treads and support their existing bank approaches. */
(function(Y){'use strict';const L=Y.Landscape42,base=L.bridge;
 L.bridge=function(b,f){
  if(f.properties.pickId!==1110||f.properties.id!=='heritage/lake-flat-bridge')return base.call(this,b,f);
  const emit=b.e.add,steps=[];
  b.e.add=function(key,geo,m,color,p,uv){
   if(key.startsWith('landscape42-stone-slab-')&&color==='#b5bcb0'&&p[0]===10)steps.push(new Float32Array(m));
   return emit.call(this,key,geo,m,color,p,uv);
  };
  let result;try{result=base.call(this,b,f);}finally{b.e.add=emit;}
  if(!result)return result;
  for(const step of steps){
   const bottom=step[13]-Math.abs(step[5])*.5,ground=L.elevation(step[12],step[14]);
   // Island ground includes a 4 cm surface; do not add a visible stone under a buried tread.
   if(bottom<=ground+.04)continue;
   const m=new Float32Array(step);m[5]=bottom-ground;m[13]=(bottom+ground)*.5;
   b.e.add('bridge1110-bank-step-support',Y.Geo.box(),m,'#b5bcb0',[10,1110,0,0]);
  }
  return result;
 };
})(YY);
