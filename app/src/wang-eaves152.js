/* Public 2015/2019 photos show a dark metal main eave ring, including lit
 * fascia. Preserve pale hip/platform flashings and all stonework. Colours are
 * cross-photo appearance fits, not calibrated albedo measurements. */
(function(Y){'use strict';const R=Y.Architecture30,previous=R.render;
const S={main:'#626761',lowerLip:'#414b48',scope:'two-main-eave-boxes-only',source:'https://www.huitu.com/photo/show/20191217/200525503032.html',dimensions:'unchanged',appearance:'photo-fit-not-colour-calibrated'};
R.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add;b.e.add=function(k,g,m,c,p,uv){if(k==='v16-wang-crown'){if(Math.abs(m[5]-.7)<1e-5)c=S.main;else if(Math.abs(m[5]-.13)<1e-5)c=S.lowerLip;}return emit.call(this,k,g,m,c,p,uv);};try{return previous.call(this,b,f,add);}finally{b.e.add=emit;}};Y.WangEaves152=S;
})(YY);
