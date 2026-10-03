/* 102 中水站: a bounded correction, not completed facade reconstruction.
 * PKU Power Center documents one above-ground storey and a 5.3 m building.
 * The source ring is 155.698 m², consistent with its documented 156 m².
 * The native aerial shows a flat roof. Existing neutral window/frame treatment
 * remains fitted: no ground photograph yet fixes the full elevations or entry.
 */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/1009051995';
const TOTAL=5.3,PARAPET_TOP_OFFSET=.825;
function render(b,f,add){
 // footprint()'s existing cap reaches body + .825. Account for that explicitly
 // so the parapet does not raise the documented 5.3 m building to 6.125 m.
 const result=A.footprint(b,f,add,{key:'building102-v46',style:'modern',roof:'flat',height:TOTAL-PARAPET_TOP_OFFSET,floors:1});
 // The generic facade loop skips edges shorter than 3.4 m, including roof
 // coping. Continue the existing fitted roof edge across the source's short
 // returns; do not invent facade openings or merge the separate pump house.
 const ring=f.geometry.coordinates[0],sgn=Y.Footprints.area(ring)>0?1:-1;
 const inwardCorner=i=>{const n=ring.length-1,a=ring[(i+n-1)%n],p=ring[i%n],c=ring[(i+1)%n];return((p[0]-a[0])*(c[1]-p[1])-(p[1]-a[1])*(c[0]-p[0]))*sgn< -1e-6;};
 for(let i=0;i<ring.length-1;i++){
  const a=ring[i],c=ring[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len>=3.4||len<1e-7)continue;
  const nx=(c[1]-a[1])/len*sgn,nz=-(c[0]-a[0])/len*sgn;
  b.local((a[0]+c[0])/2,0,(a[1]+c[1])/2,Math.atan2(nx,nz),()=>{
   b.box(0,result.bodyHeight-.18,.01,len,.24,.30,'#c7cbbf',24);
   b.box(0,result.bodyHeight+.35,-.16,len,.75,.29,'#b1b8ac',24);
   b.box(0,result.bodyHeight+.76,-.16,len+.06,.13,.42,'#cbd0c2',24);
  });
 }
 // A small solid joint beneath the already-overlapping copings closes the
 // 15 mm wall-offset gap at each concave corner; no unsupported long overhang.
 for(let i=0;i<ring.length-1;i++)if(inwardCorner(i))b.box(ring[i][0],result.bodyHeight+.35,ring[i][1],.08,.75,.08,'#b1b8ac',24);
 return {...result,strategy:'building102-v46',floors:1,documentedHeight:TOTAL,basementFloors:2,sourceOutline:true,facadesVerified:false,entranceVerified:false,scope:'documented-massing-correction; retained-fitted-facades'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building102={id:ID,render,totalHeight:TOTAL,bodyHeight:TOTAL-PARAPET_TOP_OFFSET};
})(YY);
