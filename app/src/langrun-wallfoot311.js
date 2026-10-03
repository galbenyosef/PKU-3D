/* Close only the inherited solid wall/plinth vertical interval on 354/356/357/359/360/361/362.
 * No change to mapped outline, windows, fitted source scale, roof or entrances. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,targets=new Map([[354,'way/1009052016'],[356,'way/1009052018'],[357,'way/1009052019'],[359,'way/1009052021'],[360,'way/1009052022'],[361,'way/1009052023'],[362,'way/1009052024']]);
 A.render=function(b,f,add){
  const pick=f.properties.pickId;
  if(targets.get(pick)!==f.properties.id)return previous.call(this,b,f,add);
  const e=b.e,own=Object.getOwnPropertyDescriptor(e,'add'),saved=e.add;
  let plinthTop=null;
  e.add=function(key,g,m,color,meta,uv){
   if(key===`v30-clipped-${pick}-historic-segment-#a3a599|10|0`){
    plinthTop=-Infinity;for(let i=1;i<g.v.length;i+=8)plinthTop=Math.max(plinthTop,g.v[i]);
   }
   if(key===`v30-clipped-${pick}-historic-segment-#d9d7c9|24|0`&&plinthTop!==null){
    let low=Infinity;for(let i=1;i<g.v.length;i+=8)low=Math.min(low,g.v[i]);
    // Restrict to the documented inherited gap; future changed solids fail closed.
    if(low>plinthTop&&low-plinthTop<.06){
     const patched=new Y.Geo.Geometry();patched.v=Array.from(g.v);
     for(let i=1;i<patched.v.length;i+=8)if(Math.abs(patched.v[i]-low)<1e-6)patched.v[i]=plinthTop;
     if(g.detailWidth!==undefined)patched.detailWidth=g.detailWidth;
     g=patched;
    }
   }
   return saved.call(this,key,g,m,color,meta,uv);
  };
  try{return previous.call(this,b,f,add);}finally{if(own)Object.defineProperty(e,'add',own);else delete e.add;}
 };
})(YY);
