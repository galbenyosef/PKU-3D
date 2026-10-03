/* 393: only the registered southeast facade strip visible in September 2013.
 * Material28 remains opaque: this is a frame/band correction, not a membrane
 * simulation. Roof, end meshes, base and unknown entrances are retained.
 */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/1075644736';
function render(b,f,add){let patched=0;const result=A.footprint(b,f,add,{renderFacade(b,e,v){
 // Match the registered southeast edge by both endpoints, never by ring index.
 if(Math.hypot(e.a[0]+170.364,e.a[1]+522.084)>.02||Math.hypot(e.c[0]+190.365,e.c[1]+496.890)>.02)return false;
 patched++;const lo=8,hi=26; // central visible strip; fitted limits, not surveyed.
 // Preserve the original generic posts outside the photograph-supported strip.
 for(let k=0;k<v.count;k++){const t=(k+.5)*v.stride;if(t>=lo&&t<=hi)continue;const y=.55+v.fh*.52;b.local(e.a[0]+e.ux*t+e.nx*.045,y,e.a[1]+e.uz*t+e.nz*.045,v.r,()=>b.box(0,0,0,.075,v.body,.10,'#879791',29));}
 const at=(t,y,offset=.115)=>[e.a[0]+e.ux*t+e.nx*offset,y,e.a[1]+e.uz*t+e.nz*offset];
 // Repeated fine uprights and one photograph-visible crossed brace panel.
 // Spacing, diameters and strip limits are proportional fits, not exact counts.
 for(let t=lo;t<=hi+.001;t+=2)b.beam(at(t,.30),at(t,v.body-.27),.045,'#adb6ae',29);
 b.beam(at(20,.34),at(24,v.body-.34),.036,'#96a398',29);
 b.beam(at(24,.34,.14),at(20,v.body-.34,.14),.036,'#96a398',29);
 const c=at((lo+hi)/2,v.body-.34,.185);b.local(c[0],c[1],c[2],v.r,()=>b.box(0,0,0,hi-lo,.27,.10,'#d0d0be',29));
 return true;
 }});if(patched!==1)throw Error('393 southeast reference edge changed; re-register facade');return{...result,facade393:'2013-southeast-partial',opaqueEnvelopeRetained:true};}
Y.Building393={id:ID,render};A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
})(YY);
