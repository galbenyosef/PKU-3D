/* Private review candidate. One scan-supported north facade segment only.
 * Wall-relative attachment is conditional: scan vs source north wall differs 2.57 m.
 * No survey registration, ground doorway, repeated lifts or whole-building floor claim. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/637244943';
// Control: actual north/east corner in clipped L18, related continuously to the L20 shaft.
const scanCorner=[-791.6,-50.95],scanWall=[-826.1,-50.35],modelCorner=[-790.020,-53.863];
const scanCos=34.5/Math.hypot(34.5,.60),modelCos=53.428/Math.hypot(53.428,1.399);
const mapScanX=x=>modelCorner[0]-(scanCorner[0]-x)/scanCos*modelCos;
const observed={west:mapScanX(-830.65),east:mapScanX(-814.0),shaftX:mapScanX(-826.1),shaftWidth:3.5,projection:3.7,rows:[1.95,4.85,7.75,10.65,13.55]};
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const p=f.properties;
 const out=A.footprint(b,f,add,{renderFacade(builder,e,ctx){
  if(e.nz>-.9||e.len<40)return false;
  const {body,floors,fh,count,stride,ww,r}=ctx;
  const at=x=>e.a[1]+(x-e.a[0])*e.uz/e.ux;
  // Preserve original generic bays outside the actually imaged 17 m section.
  for(let floor=0;floor<floors;floor++)for(let k=0;k<count;k++){
   const t=(k+.5)*stride,x=e.a[0]+e.ux*t+e.nx*.045,z=e.a[1]+e.uz*t+e.nz*.045;
   if(x+ww/2>observed.west&&x-ww/2<observed.east)continue;
   builder.window(x,.55+fh*(floor+.52),z,ww,Math.min(2.65,fh*.63),r,'#596b66');
   builder.local(x,0,z,r,()=>{builder.box(-stride*.47,body/2,-.03,.25,body,.34,'#e4e3d8',24);if(floor>0){builder.box(0,.55+floor*fh-.17,.09,stride,.38,.42,'#e2e2d7',24);builder.box(0,.55+floor*fh+.22,.08,stride,.08,.29,'#bdc4b8',29);}});
  }
  // Existing north belts continue only outside the observed local section.
  for(const [lo,hi] of [[Math.min(e.a[0],e.c[0]),observed.west],[observed.east,Math.max(e.a[0],e.c[0])]]){
   const x=(lo+hi)/2;builder.local(x,0,at(x),r,()=>{for(let j=1;j<floors;j++)builder.box(0,.55+j*fh,.025,(hi-lo)/Math.abs(e.ux),.13,.11,'#c9cec0',24);});
  }
  // Five rows visible beside the lift; widths/row centres are visual fits, not surveys.
  for(const sourceX of [-829.25,-823.45,-820.3,-817.65,-815.3]){
   const x=mapScanX(sourceX),width=sourceX===-829.25?2.15:1.8;
   for(const y of observed.rows)builder.window(x,y,at(x)-.065,width,1.68,r,'#bbbeb5');
  }
  builder.local((observed.west+observed.east)/2,0,at((observed.west+observed.east)/2),r,()=>{
   for(const y of [3.22,6.12,9.02,11.92])builder.box(0,y,.07,observed.east-observed.west,.65,.13,'#9d6553',18);
  });
  builder.local(observed.shaftX,0,at(observed.shaftX),r,()=>{
   const box=(suffix,x,y,z,w,h,d,c,mat)=>builder.mesh('867-local-lift-'+suffix,builder.geo('867-local-lift-box',Y.Geo.box),x,y,z,w,h,d,c,mat,.8);
   const w=observed.shaftWidth,d=observed.projection;
   // Same-section supports extend 50 mm below the actual western ground plate (top -0.20 m); lower infill remains
   // unmodelled because cars hide its doorway. No footing, doorstep or door is inferred.
   // Extend only the upper support edges into the unchanged cap by 10 mm.
   for(const side of [-1,1])box('upright',side*(w/2-.19),7.35,d/2,.38,15.20,d,'#bdbeb7',24);
   box('dark-glazing',0,8.225,d-.075,w-.76,13.45,.12,'#293d45',28);
   for(const y of [2.15,3.6,5.05,6.5,7.95,9.4,10.85,12.3,13.75])box('crossbar',0,y,d+.015,w-.67,.075,.11,'#979e99',29);
   box('cap',0,15.06,d/2,w+.18,.24,d+.15,'#925d52',24);
  });
  return true;
 }});
 return {...out,strategy:'867-local-north-lift-review',observedRows:5,wholeBuildingFloorsUnchanged:p.floors,registration:'east-corner relative 34.505m control; absolute datum unresolved',entrance:'unresolved'};
};
Y.Building867LocalReview={observed};
})(YY);
