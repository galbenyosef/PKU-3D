/* The independently visible east wing has six window rows and a flat parapet.
 * Relative dimensions are fitted from the public campus photogrammetry tile.
 * OSM plan is retained: this is a display fit, not surveyed registration.
 * Source east wall differs from OSM by ~2.2m east / ~1.9m south.
 * Ground openings are obscured; no doors, canopies or steps are inferred. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo;
const fit={body:17.65,top:18.475,floors:6,sourceGround:26.4,sourceParapet:44.84,sourceNorth:-329.3,sourceWallEast:-542,sourceSouth:-311.0,sourceTile:'Tile_5_L20_00120112.b3dm',sourceRows:[28.546,31.461,34.530,37.292,40.361,43.123]};
A.render=function(b,f,add){if(f.properties.pickId!==865||f.properties.id!=='way/876533984')return prior.call(this,b,f,add);
 const saved=[b.origin,b.rotation,b.id,b.anim];
 try{const result=A.footprint(b,f,add,{height:fit.body,floors:6,roof:'flat',style:'dorm',key:'865-wing317',renderFacade(builder,e,{r}){
  // Only the observed east face receives source-derived facade details.
  if(e.nx<.95)return false;
  const start=e.a[1]<e.c[1]?e.a:e.c,end=e.a[1]<e.c[1]?e.c:e.a,dx=end[0]-start[0],dz=end[1]-start[1],len=Math.hypot(dx,dz);
  const box=(k,x,y,z,w,h,d,c,mat=24)=>builder.mesh('865-wing317-'+k,builder.geo('865-wing317-'+k,G.box),x,y,z,w,h,d,c,mat);
  const at=(distance,fn)=>{const t=distance/18.3;builder.local(start[0]+dx*t,0,start[1]+dz*t,r,fn);};
  // Along-face distances retain measured scan spacing; residual is documented.
  // The north bank and three central axes are fully present in the source tile.
  for(const distance of[6.105,9.102,12.099])at(distance,()=>{for(let row=1;row<6;row++){
   const y=fit.sourceRows[row]-fit.sourceGround,w=1.64*len/18.3,h=1.40;
   box('central-glass',0,y,.058,w,h,.07,'#526460',28);
   for(const x of[-w/2,0,w/2])box('central-jamb',x,y,.111,.065,h+.12,.065,'#cbd0c9',29);
   for(const yy of[y-h/2,y+h/2])box('central-rail',0,yy,.111,w+.06,.065,.065,'#cbd0c9',29);
  }});
  // Six-row north glazed balcony is visible, including its lower row.
  at(2.24,()=>{const w=4.05*len/18.3;for(let row=0;row<6;row++){
   const y=fit.sourceRows[row]-fit.sourceGround,h=1.28;
   box('north-bank-glass',0,y,.32,w,h,.075,'#546762',28);
   for(let j=0;j<=6;j++)box('north-bank-mullion',-w/2+w*j/6,y,.385,.06,h+.15,.085,'#e0e2d8',29);
   for(const yy of[y-h/2-.06,y+h/2+.06])box('north-bank-rail',0,yy,.37,w+.10,.13,.13,'#d4d8d0');
   box('north-bank-spandrel',0,y-1.04,.27,w+.12,.68,.44,'#bec5bf');
  }});
  // One precise south neighbor closes the outer edge at source S~-311m.
  // Its ground floor remains too distorted to infer a door or glazing.
  at(16.0,()=>{const w=4.60*len/18.3;for(let row=1;row<6;row++){
   const y=fit.sourceRows[row]-fit.sourceGround,h=1.28;
   box('south-bank-glass',0,y,.32,w,h,.075,'#546762',28);
   for(let j=0;j<=6;j++)box('south-bank-mullion',-w/2+w*j/6,y,.385,.06,h+.15,.085,'#e0e2d8',29);
   for(const yy of[y-h/2-.06,y+h/2+.06])box('south-bank-rail',0,yy,.37,w+.10,.13,.13,'#d4d8d0');
   box('south-bank-spandrel',0,y-1.04,.27,w+.12,.68,.44,'#bec5bf');
  }});
  return true;
 }});
 return{...result,strategy:'building865-wing317',visibleEastRows:6,sourceOutline:true,displayFit:true,surveyedRegistration:false,sourceHeightFit:fit.top,entranceVerified:false,southBankUpperExtentVerified:true,southBankGroundVerified:false,otherElevationsVerified:false,wholeBuildingAccepted:false};
 }finally{[b.origin,b.rotation,b.id,b.anim]=saved;}
};Y.Building865Wing317={fit};})(YY);
