/* 124: close the underside of the existing shallow tiled eave.
 * Derive the outer edge and elevation from the installed 170 fascia; keep
 * the original T wall ring, every roof vertex, all windows and materials. */
(function(Y){'use strict';const previous=Y.Architecture30.render,G=Y.Geo,M=Y.M;
Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==895||f.properties.id!=='way/916931883')return previous.call(this,b,f,add);
 const original=b.e.add;let fascia;
 b.e.add=function(k,g,m,c,p,uv){if(k==='170-shallow-eave-fascia'&&p[1]===895)fascia={g,m:Array.from(m),c,p};return original.call(this,k,g,m,c,p,uv);};
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 if(!fascia)return result;
 const wall=f.geometry.coordinates[0],soffit=new G.Geometry();
 // Footprints.walls emits two triangles per original edge, in original order.
 // Face order is reversed here to expose the downward-facing soffit.
 for(let k=0;k<wall.length-1;k++){const j=k*48,outer=[0,8].map(i=>M.apply(fascia.m,[...fascia.g.v.slice(j+i,j+i+3),1]).slice(0,3)),y=outer[0][1],a=[wall[k][0],y,wall[k][1]],c=[wall[k+1][0],y,wall[k+1][1]],q=[outer[0],a,c,outer[1]],uv=q.map(p=>[p[0]-wall[0][0],p[2]-wall[0][1]]);soffit.tri(q[0],q[1],q[2],uv.slice(0,3));soffit.tri(q[0],q[2],q[3],[uv[0],uv[2],uv[3]]);}
 add('chengze895-original-eave-soffit',soffit,fascia.c,fascia.p[0],895);
 return{...result,eaveUndersideClosed:true,entranceVerified:false,facadeBaysVerified:false};
};})(YY);
