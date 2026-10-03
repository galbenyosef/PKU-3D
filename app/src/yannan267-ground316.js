/* Retain the inherited doorway and sill top, while grounding the existing stone
 * sill. Remove the unrelated center-axis template approach fragment; a real
 * door-to-road approach remains unverified. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render;
A.render=function(b,f,add){if(f.properties.pickId!==267||f.properties.id!=='way/866277604')return previous.call(this,b,f,add);const emit=b.e.add,own=Object.hasOwn(b.e,'add'),rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 const sills=rows.filter(r=>r.k==='v30-box'&&r.c==='#b3b4a9'&&r.p[0]===10&&r.p[1]===267&&r.p[3]===.2),approaches=rows.filter(r=>r.k==='v30-clipped-267-villa-#b0aa99|21|0'&&r.p[0]===21&&r.p[1]===267);
 if(sills.length!==1||approaches.length!==1)throw Error('Yannan61 inherited sill/center-axis approach changed');const sill=sills[0],m=new Float32Array(sill.m);if(m[1]!==0||m[9]!==0||m[4]!==0||m[6]!==0||m[5]<=0)throw Error('Yannan61 sill vertical basis changed');
 const top=m[13]+m[5]/2,bottom=.035;m[5]=top-bottom;m[13]=(top+bottom)/2;
 for(const r of rows){if(r===approaches[0])continue;emit.call(b.e,r.k,r.g,r===sill?m:r.m,r.c,r.p,r.uv);}return result;
};})(YY);
