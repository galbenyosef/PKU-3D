/* Geology Building narrow entry, own September 2017 photo:
 * https://jjgcb.pku.edu.cn/images/content/2017-09/20240427163043545597.jpg
 * A dark-red horizontal member is visible against the wall between the curved
 * knees. Preserve the broad entry, provisional compass assignment and all
 * original components. Width 3.35 m, height .40 m and depth .28 m are fitted;
 * hidden penetration connects the visible member to the existing masonry. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,ID='way/445012603';
 A.render=function(b,f,add){const result=previous(b,f,add);if(f.properties.id!==ID)return result;
  const B=Y.Building056,p=B.world(B.W/2,B.I),r=Math.atan2(3.453,62.874)+Math.PI;
  b.local(p[0],0,p[1],r,()=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'geology185-narrow-backbeam272-'+k,...v);};
   try{b.box(0,4.50,.11,3.35,.40,.28,'#97443d',24);}finally{b.e.add=old;}
  });return result;
 };
})(YY);
