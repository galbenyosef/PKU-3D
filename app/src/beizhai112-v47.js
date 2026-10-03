/* Beizhai, way/240832223 only. Registered single rectangular hall, south open
 * two-storey porch and west central entrance. Dimensions are photographic fits.
 * Photographs: blog_bdbef0ce0102yy64, named west/south/east views; official 2020
 * completion image 20240427163030335825. Northern face remains unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/240832223';
const O=[-94.051,-238.7355],R=.00792,W=19.15,D=51.75,SW=W/2,S=D/2,N=-D/2,porch=3.7,E=10.65,F=5.48,B=.86;
const P={wall:'#e1dfd3',base:'#aaa99d',red:'#963e30',wood:'#8b4937',roof:'#65716f',tile:'#929b8c',blue:'#456d72',gold:'#c4aa73'};
function render(b,f){b.id=f.properties.pickId;
 const box=(key,x,y,z,w,h,d,c=P.wall,mat=24)=>b.n17Box('bei112-'+key,x,y,z,w,h,d,c,mat);
 const mesh=(key,g,c,mat=24)=>b.mesh('bei112-'+key,g,0,0,0,1,1,1,c,mat);
 b.local(O[0],0,O[1],R,()=>{
  b.solid(0,-porch/2,W,D-porch);b.noPlant(0,0,W+2,D+2);
  box('stone-platform',0,B/2,0,W+.45,B,D+.45,P.base,10);
  // One single hall replaces the compressed two-wing L. South 3.7 m remains open.
  const wallS=S-porch,span=D-porch,bay=span/9;
  // Four perimeter walls, with actual 3 m wide entrance openings down to the
  // platform. Recessed door leaves sit behind the wall plane, never on a solid box.
  function wall(key,width,hole=false){
   if(!hole){box(key,0,(B+E)/2,-.19,width,E-B,.38);return;}
   for(const side of[-1,1])box(key+'-pier',side*(width/2+1.5)/2,(B+E)/2,-.19,width/2-1.5,E-B,.38);
   box(key+'-lintel',0,(3.78+E)/2,-.19,3,E-3.78,.38);
  }
  b.local(0,0,wallS,0,()=>wall('south-wall',W,true));
  b.local(0,0,N,Math.PI,()=>wall('north-wall-unverified',W));
  for(const side of[-1,1])b.local(side*SW,0,-porch/2,side*Math.PI/2,()=>wall(side<0?'west-wall':'east-wall',span,side<0));
  box('interior-floor',0,F-.18,-porch/2,W-.76,.26,span-.76,'#c2bfb1',10);
  box('interior-ceiling',0,E-.11,-porch/2,W-.76,.18,span-.76,P.wall);

  for(const side of[-1,1])b.local(side*SW,0,-porch/2,side*Math.PI/2,()=>{
   for(let j=0;j<=9;j++){const x=-span/2+j*bay;
    // bei112-west-shafts225: the photographed west shafts are round.
    // Diameter and shallow wall embed are proportional fits, not measurements.
    if(side<0)b.mesh('bei112-west-round-shaft225',b.geo('bei112-west-round-shaft225',()=>G.cylinder(24)),x,B,.03,.28,E-B,.28,P.red,6,.7);
    else box('long-red-pilaster',x,(B+E)/2,.10,.43,E-B,.30,P.red,6);
    // end bei112-west-shafts225
   }
   box('long-storey-belt',0,F-.16,.16,span,.23,.28,'#d7d6ca');
   box('long-painted-eave',0,E-.26,.12,span,.55,.36,P.blue,6);
   for(let j=0;j<9;j++){
    const x=-span/2+(j+.5)*bay;
    for(const y of[2.65,7.64])for(const q of[-1,0,1]){
     if(side===-1&&j===4&&y<3)continue;
     b.n17Lattice(x+q*bay*.245,y,.17,bay*.185,2.65);
    }
    box('long-frieze-gold',x,E-.23,.32,bay*.60,.055,.065,P.gold,29);
    for(const k of[-1,1])b.beam([x+k*bay*.45,E-.55,.17],[x+k*bay*.31,E-1.0,.17],.105,P.red,6);
   }
   for(let x=-span/2;x<span/2;x+=.40)box('long-rafter-ends',x,E+.06,.60,.16,.12,.42,'#c2b99a',6);
  });
  // South facade: six full-height columns, five bays, recessed room wall.
  box('porch-upper-slab',0,F,wallS+porch/2,W,.28,porch+.12,'#c2bfb1',10);
  for(let j=0;j<=5;j++){
   const x=-SW+j*W/5;b.n17Column(x,S-.12,E-B,B);
   for(const h of[F-.1,E-.25]){box('south-column-painted',x,h,S-.12,.64,.44,.57,P.blue,6);box('south-column-gold',x,h+.13,S+.18,.46,.06,.035,P.gold,29);}
  }
  for(let j=0;j<5;j++){
   const x=-SW+(j+.5)*W/5;
   for(const y of[2.65,7.65]){if(j===2&&y<3)continue;b.n17Lattice(x,y,wallS+.07,1.65,2.6);}
   for(const h of[F-.20,E-.25]){box('south-painted-beam',x,h,S-.12,W/5,.48,.46,P.blue,6);box('south-beam-gold',x,h,S+.12,W/5*.61,.055,.04,P.gold,29);}
   for(const y of[F+.18,F+1.12])box('south-rail-horizontal',x,y,S-.1,W/5,.14,.18,P.red,6);
   for(let k=0;k<4;k++)box('south-rail-baluster',x+(k-1.5)*W/20,F+.64,S-.1,.10,.85,.13,P.red,6);
   for(const side of[-1,1])b.beam([x+side*W/10*.93,E-.47,S-.12],[x+side*W/10*.65,E-1.0,S-.12],.12,P.red,6);
  }
  for(const side of[-1,1]){
   for(const h of[F-.20,E-.25])box('porch-side-painted',side*SW,h,wallS+porch/2,.44,.48,porch,P.blue,6);
   for(const y of[F+.18,F+1.12])box('porch-side-rail',side*SW,y,wallS+porch/2,.17,.14,porch,P.red,6);
   for(let k=1;k<7;k++)box('porch-side-baluster',side*SW,F+.64,wallS+k*porch/7,.13,.85,.10,P.red,6);
  }
  // South entrance is recessed behind the porch, with open approach at centre.
  box('south-door',0,2.20,wallS-.55,2.5,2.68,.12,'#62352b',6);
  for(const x of[-1.3,1.3])box('south-door-frame',x,2.20,wallS-.22,.13,2.9,.78,P.red,6);
  for(let j=0;j<4;j++)box('south-step',0,(j+1)*B/8,S+.45+(3-j)*.37,3.5,(j+1)*B/4,.75,P.base,10);
  // Visible small tiled hood over the central west-side doorway.
  b.local(-SW,0,-porch/2,-Math.PI/2,()=>{
   box('west-door',0,2.17,-.55,2.45,2.64,.13,'#573a30',6);
   for(const x of[-1.32,1.32])box('west-door-frame',x,2.20,-.22,.14,2.9,.78,P.wood,6);
   b.n17Roof(0,3.80,.67,3.65,1.55,.80);
   for(let j=0;j<3;j++){
    const centre=1.12+(2-j)*.38;
    // Join only the top tread to the existing platform edge, retaining its front.
    const back=j===2?.225:centre-.41,front=centre+.41;
    box('west-step',0,(j+1)*B/6,(back+front)/2,3.50,(j+1)*B/3,front-back,P.base,10);
   }
  });
  // North is closed; no speculative door or connection to the independent red-six hall.
  // Curved hip-and-gable roof with a fixed 3.4 m end inset (not 14% of length).
  const half=SW+1.12,cut=.38,roof=new G.Geometry(),tiles=new G.Geometry(),gable=new G.Geometry();
  const inset=t=>-1.05+4.45*Math.min(1,t/cut),height=t=>E+.30+4.15*Math.pow(t,1.48),pt=(side,t,u)=>[side*half*(1-t),height(t),N+inset(t)+(D-2*inset(t))*u];
  const patch=(g,side,t0,t1,u0,u1,dy=0)=>{const v=[pt(side,t0,u0),pt(side,t0,u1),pt(side,t1,u1),pt(side,t1,u0)].map(q=>[q[0],q[1]+dy,q[2]]);if(side>0)v.reverse();g.quad(...v);};
  for(const side of[-1,1])for(let j=0;j<18;j++){let a=j/18,c=(j+1)/18;patch(roof,side,a,c,0,1);for(let z=.10;z<D;z+=.32)patch(tiles,side,a,c,z/D,Math.min(1,(z+.062)/D),.035);}
  for(const south of[false,true]){
   for(let j=0;j<10;j++){let a=cut*j/10,c=cut*(j+1)/10,z=t=>south?S-inset(t):N+inset(t);const v=[[-half*(1-a),height(a),z(a)],[half*(1-a),height(a),z(a)],[half*(1-c),height(c),z(c)],[-half*(1-c),height(c),z(c)]];if(!south)v.reverse();roof.quad(...v);}
   const z=south?S-3.4:N+3.4,a=[-half*(1-cut),height(cut),z],c=[half*(1-cut),height(cut),z],top=[0,height(1),z];if(south)gable.tri(a,c,top);else gable.tri(c,a,top);
   b.beam(a,top,.18,P.tile,2);b.beam(top,c,.18,P.tile,2);
   // Framed rectangular gable vent and raised ridge ornaments are fitted abstractions.
   b.local(0,12.75,z,south?0:Math.PI,()=>b.n17Lattice(0,0,.08,1.65,1.05));
  }
  mesh('roof',roof,P.roof,2);tiles.detailWidth=.062;mesh('roof-tile-ribs',tiles,P.tile,2);mesh('gable-panels',gable,P.red,6);
  box('ridge',0,15.16,0,.30,.23,D-6.6,P.tile,2);
  for(const z of[N+3.4,S-3.4])b.beam([0,15.16,z],[0,15.62,z+(z>0?.38:-.38)],.16,P.tile,2);
  for(const side of[-1,1])for(let z=N-.8;z<S+.8;z+=.42)b.cyl(side*half,E+.14,z,.13,.20,P.tile,8,1,2);
 });
 return{id:ID,strategy:'beizhai112-v47',singleMainHall:true,southOpenPorch:true,westEntrance:true,allFacadesVerified:false,dimensionsFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f):previous(b,f,add);};
Y.Beizhai112={id:ID,render,frame:{centre:O,r:R,w:W,d:D},porchDepth:porch};
})(YY);
