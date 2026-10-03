/* No.6 west gateway, identified by CMLR's captioned official photograph.
   The U-shaped footprint clips the old typological gateway away. Restore the
   photographed plain paired doors, masonry jambs and low stone threshold. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/272364824',prefix='jingyuan170-gate-';
function frame(){return {centre:[(-126.91-126.551)/2,(117.241+135.562)/2],r:4.730007344283843};}
function gate(b){const f=frame(),add=b.e.add;b.e.add=function(k,g,m,c,p,uv){return add.call(this,prefix+k,g,m,c,p,uv);};
 try{b.local(f.centre[0],0,f.centre[1],f.r,()=>{
  const stone='#aaa89e',red='#914c45',brick='#93958b';
  for(const s of[-1,1]){
   // Official CMLR captioned photo: three cap courses and lower shoulder.
   // Width .85/.68=1.25, front projection .08 and course heights are bounded
   // photo-proportion fits, not survey dimensions. Obscured left cap mirrors
   // the visible right; hidden rear plane retains the old pier at z=-.455.
   // Upper cap embeds into the unchanged roof support plate y3.93..4.15.
   b.box(s*1.39,1.75,0,.68,3.50,.91,brick,18,.7);
   const shoulder=new Y.Geo.Geometry(),raw=Y.Geo.box().v;
   // Closed ruled shoulder, .68 -> .78 wide, front .455 -> .505.
   for(let i=0;i<raw.length;i+=24){const pts=[0,8,16].map(j=>{const x=raw[i+j],y=raw[i+j+1],z=raw[i+j+2],t=y+.5;return[x*(.68+.10*t),3.50+.22*t,-.455+(z+.5)*(.91+.05*t)];});shoulder.tri(...pts);}
   b.mesh('brick-shoulder174',b.geo('brick-shoulder174',()=>shoulder),s*1.39,0,0,1,1,1,brick,18,.7);
   for(const [lo,hi,w,front]of[[3.72,3.84,.78,.505],[3.84,3.96,.85,.535],[3.96,4.12,.81,.515]])b.box(s*1.39,(lo+hi)/2,(front-.455)/2,w,hi-lo,front+.455,brick,18,.7);
   b.box(s*1.39,.13,0,.78,.26,1.03,stone,10,.72);
   b.box(s*1.055,1.86,.13,.15,3.08,.23,red,20,.85);
   b.box(s*1.055,.68,.28,.29,.72,.40,stone,10,.87);
   b.mesh('plain-door',b.geo('plain-door',Y.Geo.box),s*.489,1.82,.13,.969,3.0,.12,red,20,.88);
   b.box(s*.70,3.50,.17,.16,.15,.27,'#7e423b',20,.91);
   b.sphere(s*.70,3.50,.32,.11,.11,.035,'#76504b',20,.92,true);
  }
  b.box(0,3.42,.13,2.26,.22,.25,red,20,.89);
  b.box(0,3.78,.02,2.50,.52,.30,red,20,.89);
  // Central protruding low tread: .683 of rear platform width; depth retained
  // as a fit. Full rear platform remains a grounded solid, not a floating slab.
  b.box(0,.08,.73,1.42,.16,.92,stone,10,.2);
  b.box(0,.16,.38,2.08,.32,.68,'#b1afa3',10,.22);
  b.v9Roof(0,4.19,0,4.26,2.22,.90,'gable',1.8);
 });}finally{b.e.add=add;}
}
A.render=function(b,f,add){const result=prior.call(this,b,f,add);if(f.properties.id===ID){const old=b.id;b.id=f.properties.pickId;try{gate(b);}finally{b.id=old;}}return result;};
Y.Jingyuan170Details={id:ID,prefix,frame};
})(YY);
