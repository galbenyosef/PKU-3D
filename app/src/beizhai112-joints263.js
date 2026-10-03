/* Beizhai existing doorway joints only, r5. Official west oblique photograph:
 * https://jjgcb.pku.edu.cn/images/content/2020-12/20240427163030335825.jpg
 * White masonry meets recessed timber opening. Existing modeled dimensions
 * govern this closure; the south header/profile remains a construction fit,
 * not newly verified photographic door detail. Original parts stay intact. */
(function(Y){'use strict';
 const previous=Y.Architecture30.render,ID='way/240832223';
 function joints(b){const frame=Y.Beizhai112.frame;
  b.local(frame.centre[0],0,frame.centre[1],frame.r,()=>{
   function opening(halfFrame,leafTop,timber,west){
    const box=(part,x,y,z,w,h,d,c,mat)=>b.mesh('bei112-joint263-'+part,b.geo('bei112-joint263-'+part,Y.Geo.box),x,y,z,w,h,d,c,mat);
    // Close the existing wall's 3 m aperture to the outer frame sides.
    // Same exterior z=0 and rear z=-.38 as the wall; no slab over the leaf.
    for(const s of[-1,1])box('masonry',s*(1.5+halfFrame)/2,(.86+3.65)/2,-.19,1.5-halfFrame,3.65-.86,.38,'#e1dfd3',24);
    // Wall-to-frame strip above the existing jamb top; separate timber head
    // spans only the gap between leaf top and jamb top. Depth matches jambs.
    if(!west)box('masonry',0,(3.65+3.78)/2,-.19,3,3.78-3.65,.38,'#e1dfd3',24);
    if(!west)box('header',0,(leafTop+3.65)/2,-.22,2.60,3.65-leafTop,.78,timber,6);
    // West hood already provides a rear fascia across its opening; retain it.
    if(west){
     // Existing fascia top3.77 to original lintel bottom3.78. Retain original
     // wall depth/face; 20 micrometre embed into lintel/side piers and
     // 1 micrometre into fascia top avoids a one-ULP boundary gap.
     box('masonry',0,(3.769999+3.78002)/2,-.19,3.00004,3.78002-3.769999,.38,'#e1dfd3',24);
     // Existing leaf top3.49 to hood rear fascia bottom3.51: a thin backing
     // at leaf depth, with leaf color. Dimensions derive only from that gap.
     box('leaf-joint',0,3.50,-.55,2.45,.02,.13,'#573a30',6);
     // Return only the 20 mm top joint to the existing fascia rear z=-.245.
     // 20 micrometre embed on rear/front/top and frame sides accommodates
     // actual Float32 placement; this is a hidden closure, not another hood.
     const rear=-.48502,front=-.24498,lo=3.49,hi=3.51002;
     box('leaf-joint',0,(lo+hi)/2,(rear+front)/2,2.50004,hi-lo,front-rear,'#573a30',6);
    }
    if(west)for(const s of[-1,1]){
     // Existing west leaf half-width1.225 vs jamb inner edge1.25: discreet
     // matching backing in that seam, behind the existing jamb front.
     box('leaf-joint',s*1.2375,(.86+3.51)/2,-.55,.027,3.51-.86,.13,timber,6);
    }
   }
   b.local(0,0,22.175,0,()=>opening(1.365,3.54,'#963e30',false));
   b.local(-9.575,0,-1.85,-Math.PI/2,()=>opening(1.39,3.49,'#8b4937',true));
  });
 }
 Y.Architecture30.render=function(b,f,add){const r=previous.call(this,b,f,add);if(f.properties.id===ID){const old=b.id;b.id=f.properties.pickId;try{joints(b);}finally{b.id=old;}}return r;};
})(YY);
