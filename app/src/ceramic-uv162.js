/* Normalize unused UVs only after all modelling/clipping patches. Material25
 * derives surface coordinates from position/normal in every geometry pass. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
const targets=new Map([
 [96,'v30-clipped-96-pagoda-#b0aa95|25|0'],
 [400,'400-wing102-retained-math42-continuous-roof-400'],
 [401,'math42-continuous-roof-401'],
 [402,'math42-continuous-roof-402'],
 [403,'math42-continuous-roof-403']
]);
A.render=function(b,f,add){const key=targets.get(f.properties.pickId);if(!key)return prior.call(this,b,f,add);
 const emit=b.e.add,own=Object.prototype.hasOwnProperty.call(b.e,'add');let matches=0;
 b.e.add=function(k,g,m,c,p,uv){if(k!==key)return emit.call(this,k,g,m,c,p,uv);
  if(p[0]!==25)throw Error('Ceramic UV162 requires material25: '+k);
  const normalized=new Y.Geo.Geometry();normalized.v=Array.from(g.v);
  if(g.detailWidth!==undefined)normalized.detailWidth=g.detailWidth;
  for(let i=0;i<normalized.v.length;i+=8){normalized.v[i+6]=normalized.v[i];normalized.v[i+7]=normalized.v[i+2];}
  matches++;return emit.call(this,k,normalized,m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 if(matches!==1)throw Error('Ceramic UV162 final mesh registration changed: '+key+'/'+matches);
 return result;
};
})(YY);
