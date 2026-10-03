/* Static exterior of Jingyuan Courtyard 4's courtyard-facing main entrance.
 * The 2021 Yenching opening photograph identifies this courtyard explicitly.
 * Bay dimensions and three low approach treads are fitted, not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render;
function entry(b,x,y,z){const W=33.2/9.5,H=3.4,leaf=1.04,red='#873f39',dark='#642e2b',glass='#425352';
 b.local(x,y,z,0,()=>{
  const box=(name,x,y,z,w,h,d,c,mat=20)=>b.mesh('jingyuan168-entry-box',b.geo('jingyuan168-entry-box',Y.Geo.box),x,y,z,w,h,d,c,mat,.93);
  // Two door leaves between narrower fixed lights; the high short panels and
  // the lower solid panels are distinct from the glazed upper sections.
  for(const s of[-1,1]){
   const cx=s*leaf/2;
   box('door-lower',cx,.55,.075,leaf-.035,1.10,.13,red);
   box('door-inset',cx,.56,.15,leaf-.22,.76,.035,dark);
   box('door-glass',cx,2.115,.075,leaf-.14,1.92,.04,glass,5);
   box('door-head-panel',cx,3.255,.07,leaf-.035,.29,.13,red);
   for(const side of[-1,1])box('door-stile',cx+side*(leaf/2-.045),H/2,.115,.09,H,.12,red);
   for(const yy of[1.11,3.10])box('door-glazing-rail',cx,yy,.13,leaf,.09,.11,red);
   const sw=(W-2*leaf)/2,sc=s*(leaf+sw/2);
   box('sidelight-lower',sc,.55,.065,sw-.025,1.10,.13,red);
   box('sidelight-inset',sc,.55,.145,sw-.18,.76,.035,dark);
   box('sidelight-glass',sc,2.115,.075,sw-.12,1.92,.04,glass,5);
   box('sidelight-head-panel',sc,3.255,.07,sw-.025,.29,.13,red);
   for(const side of[-1,1])box('sidelight-stile',sc+side*(sw/2-.04),H/2,.115,.08,H,.12,red);
   for(const yy of[1.11,3.10])box('sidelight-rail',sc,yy,.13,sw,.09,.11,red);
   // Rectangular light subdivisions, without inventing a diagonal lattice.
   for(const yy of[1.45,2.75])box('sidelight-muntin-h',sc,yy,.15,sw-.14,.04,.065,red);
   box('sidelight-muntin-v',sc,2.10,.15,.035,1.30,.065,red);
   for(const yy of[1.45,2.75])box('door-muntin-h',cx,yy,.15,leaf-.16,.04,.065,red);
   box('door-muntin-v',cx,2.10,.15,.035,1.30,.065,red);
  }
  box('head',0,H+.045,.09,W+.14,.09,.20,red);
  box('threshold',0,-.06,.10,W+.14,.12,.24,'#adada2',10);
 });
 // Treads meet the inherited .81-high main stone base and the .82 threshold.
 // Kept inside the mapped rear wing; the adapter still clips at its boundary.
 for(let i=0;i<3;i++){
  const h=.82*(3-i)/3,key='jingyuan168-entry-box';
  b.mesh(key,b.geo(key,Y.Geo.box),0,h/2,5.35+i*.30,W+.14,h,.302,'#adada2',10,.22);
 }
}
A.render=function(b,f,...args){
 if(f.properties.id!=='way/272364822'||f.properties.pickId!==168)return previous.call(this,b,f,...args);
 const box=b.box,ownB=Object.hasOwn(b,'box'),lattice=b.v9Lattice,door=b.heritageDoor,ownL=Object.hasOwn(b,'v9Lattice'),ownD=Object.hasOwn(b,'heritageDoor');
 // The legacy centre approach strip is clipped to a short, raised rectangle
 // here. It projects beyond the replacement's bottom tread like an extra step.
 b.box=function(x,y,z,w,h,d,c,mat,part,...rest){
  if(this.id===168&&x===0&&y===.235&&w===1.55&&h===.07&&c==='#bcb9a5'&&mat===21&&part===.1&&this.origin.every(v=>v===0)&&this.rotation===0)return;
  return box.call(this,x,y,z,w,h,d,c,mat,part,...rest);
 };
 b.v9Lattice=function(x,y,z,...rest){
  if(this.id===168&&Math.abs(this.origin[0])<1e-6&&Math.abs(this.origin[2]+9.45)<1e-6&&Math.abs(this.rotation)<1e-6&&x===0&&y===2.77&&z===0)return;
  return lattice.call(this,x,y,z,...rest);
 };
 b.heritageDoor=function(x,y,z,w,h,...rest){
  if(this.id===168&&x===0&&y===.82&&z===5.09&&w===1.8&&h===2.7){entry(this,x,y,z);return;}
  return door.call(this,x,y,z,w,h,...rest);
 };
 try{return previous.call(this,b,f,...args);}finally{
  if(ownB)b.box=box;else delete b.box;
  if(ownL)b.v9Lattice=lattice;else delete b.v9Lattice;
  if(ownD)b.heritageDoor=door;else delete b.heritageDoor;
 }
};
})(YY);
