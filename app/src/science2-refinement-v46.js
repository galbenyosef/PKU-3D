/* Science Two only: close the existing fitted white stepped-eave end caps.
 * The laboratory photograph supports solid caps; dimensions remain fitted. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,ID='relation/14962081';
function closeCap(source){
 const v=source.v,g=new G.Geometry();
 // Existing rear quad faces inward. Reverse its winding with outward normals.
 const p=i=>Array.from(v.slice(i*8,i*8+3));
 g.quad(p(5),p(2),p(1),p(0));g.v.push(...Array.from(v).slice(48));
 const points=[];for(let i=0;i<v.length;i+=8)points.push(Array.from(v.slice(i,i+3)));
 const xs=points.map(p=>p[0]),zs=points.map(p=>p[2]),ys=points.map(p=>p[1]),l=Math.min(...xs),r=Math.max(...xs),back=Math.min(...zs),front=Math.max(...zs),base=Math.min(...ys),
  rearTop=Math.max(...points.filter(p=>p[2]===back).map(p=>p[1])),frontTop=Math.max(...points.filter(p=>p[2]===front).map(p=>p[1]));
 g.quad([l,frontTop,front],[r,frontTop,front],[r,rearTop,back],[l,rearTop,back]);
 g.quad([l,base,front],[r,base,front],[r,frontTop,front],[l,frontTop,front]);
 g.quad([l,base,back],[r,base,back],[r,base,front],[l,base,front]);
 return g;
}
A.render=function(b,f,add){if(f.properties.id!==ID)return prior(b,f,add);const original=b.e.add;b.e.add=function(key,g,...args){return original.call(this,key,key.startsWith('science2-step-cheek-')?closeCap(g):g,...args);};try{return prior(b,f,add);}finally{b.e.add=original;}};
Y.Science2Refinement46={closeCap,id:ID};
})(YY);
