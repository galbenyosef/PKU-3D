/* Two visible south hip top terminals and two broad foot terminals, fitted
 * to the 2019 named front/corner previews. Simple stone silhouettes only:
 * no animal carving or unobserved rear counterparts. Dimensions below are
 * WORLD metres (the older roof's horizontal builder scale is .76).
 * https://www.huitu.com/photo/show/20191217/200525503032.html */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
const S={scale:.76,center:[415.15,681.7],yaw:.0447,roofBase:75.445,capTop:84.535,
 top:{width:.45,depth:.40,height:.60},foot:{width:.925,depth:.50,height:.80},
 scope:'south-two-top-and-two-foot-terminals-only',dimensions:'photo-proportion-fit-not-surveyed'};
function pieces(){const out=[];for(const sign of[-1,1]){
 const top=[sign*3.15*S.scale,S.capTop,3.15*S.scale],foot=[sign*14*S.scale,S.roofBase,14.25*S.scale];
 const put=(kind,anchor,w,d,lo,hi)=>out.push({kind,sign,center:[anchor[0],anchor[1]+(lo+hi)/2,anchor[2]],size:[w,hi-lo,d],anchor});
 // Shallow bearing pads penetrate the existing cap/eave by 2 cm. Their
 // uncarved cap overhangs are intentional, supported by the smaller stem.
 put('top-seat',top,.53,.48,-.02,.10);put('top-stem',top,.35,.30,.10,.49);put('top-cap',top,.45,.40,.49,.60);
 put('foot-seat',foot,1.005,.58,-.02,.12);put('foot-stem',foot,.845,.42,.12,.67);put('foot-cap',foot,.925,.50,.67,.80);
 }return out;}
A.render=function(b,f,add){const result=previous.call(this,b,f,add);if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return result;
 const unit=b.geo('wang-roof-detail165-unit',G.box),root=M.transform([S.center[0],0,S.center[1]],[1,1,1],S.yaw);
 for(const p of pieces()){const matrix=M.multiply(root,M.transform(p.center,p.size,0));b.e.add('wang-roof-detail165-'+p.kind,unit,matrix,'#bfc4bd',[24,89,0,2.08]);}
 return result;};Y.WangRoofDetail165={...S,pieces};
})(YY);
