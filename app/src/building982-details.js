/* Independent southwest L wing way/1031892012: south elevation in registered
 * aerial91s shows pale base + two main rows + clerestory. Dimensions are fits.
 * Roof topology remains provisional; this fixes vertical scale, not solar gear. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/1031892012',BODY=13.6,RISE=2.8;
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==982)return prior.call(this,b,f,add);
 const fr=Y.ArchitectureAdapter.frame(f.geometry),oldRise=Math.min(5.4,Math.max(1.1,Math.min(fr.w,fr.d)*.17));
 const emit=(key,g,color,mat,id)=>{if(key.startsWith('v30-roof-')){const next=new Y.Geo.Geometry();for(let i=0;i<g.v.length;i+=24){const points=[0,8,16].map(j=>[g.v[i+j],BODY+(g.v[i+j+1]-BODY)*RISE/oldRise,g.v[i+j+2]]);next.tri(...points);for(let j=0;j<3;j++){next.v[i+j*8+6]=g.v[i+j*8+6];next.v[i+j*8+7]=g.v[i+j*8+7];}}g=next;}return add(key,g,color,mat,id);};
 const r=A.footprint(b,f,emit,{height:BODY+oldRise,floors:4,roof:'hip',style:'modern',key:'building982-height-fit'});
 return {...r,strategy:'building982-four-level-scale-fit',bodyHeight:BODY,roofRise:RISE,totalHeight:BODY+RISE,heightMeasured:false,observedSouthBands:4,roofTopologyVerified:false,entranceVerified:false};
};
})(YY);
