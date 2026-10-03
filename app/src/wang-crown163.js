/* Upper south clerestory height fitted to two public frontal photographs.
 * 2.0 m is a bounded proportion candidate, not a surveyed dimension. The
 * existing apron and lower pavilion stay fixed; the complete roof translates.
 * Unseen side/back portions remain opaque, with their upper closure extended. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo;
const S={openLow:72.56,originalOpenHigh:73.865,openHigh:74.56,netHeight:2,fitRange:[1.8,2.2],delta:.695,high:74.68,roofBaseY:75.445,roofTopY:84.445,topY:84.535,scope:'south-twelve-and-east-front-three-clerestory-with-connected-roof'};
const glass=new Set(['wang-crown121-glass','wang-side-crown138-glass']),bar=new Set(['wang-crown121-low-transom','wang-side-crown138-transom']),stone=new Set(['wang-crown121-stone','wang-side-crown138-stone']);
function height(y){return y<=S.openLow?y:y>=S.originalOpenHigh?y+S.delta:S.openLow+(y-S.openLow)*S.netHeight/(S.originalOpenHigh-S.openLow);}
function raised(k){return k==='v16-wang-crown'||k.startsWith('wang-roof153-');}
A.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add,hadOwn=Object.prototype.hasOwnProperty.call(b.e,'add');
b.e.add=function(k,g,m,c,p,uv){
 if(raised(k)){const next=m.slice();next[13]+=S.delta;return emit.call(this,k,g,next,c,p,uv);}
 if(glass.has(k)){const next=m.slice();next[5]*=S.netHeight/(S.originalOpenHigh-S.openLow);next[13]=S.openLow+S.netHeight/2;return emit.call(this,k,g,next,c,p,uv);}
 if(bar.has(k)){const next=m.slice();next[13]+=S.delta*.29;return emit.call(this,k,g,next,c,p,uv);}
 if(stone.has(k)){const shape=new G.Geometry();shape.v=Array.from(g.v);for(let i=0;i<shape.v.length;i+=8){const y=shape.v[i+1]*m[5]+m[13];shape.v[i+1]=(height(y)-m[13])/m[5];}return emit.call(this,k.replace(/121|138/,'163'),shape,m,c,p,uv);}
 if(k==='wang-side-crown138-retained'){
  // Keep the old opaque side/back lower edge. Extend its top to the new
  // clerestory top so the unseen rear has real support under the moved lip.
  const next=m.slice(),oldLow=m[13]-m[5]/2;next[5]=S.high-oldLow;next[13]=(S.high+oldLow)/2;return emit.call(this,k,g,next,c,p,uv);
 }
 return emit.call(this,k,g,m,c,p,uv);
};try{return previous.call(this,b,f,add);}finally{if(hadOwn)b.e.add=emit;else delete b.e.add;}};
Y.WangCrown163=S;
// Do not overwrite WangRoof120.baseY: the retained seam generator reads it.
// This effective envelope includes the translated roof; old generators retain
// their original parameters and the ordered output is translated exactly once.
Y.WangRoof120.topY=S.topY;
})(YY);
