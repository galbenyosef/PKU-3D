/* Courtyard Two's separately photographed east gateway, PKU autumn 2016.
 * Solid paired red leaves, north vertical plaque and three outer steps.
 * Position/scale are fitted; the foliage-obscured roof is not reconstructed.
 * Append after the normal C-ring Adapter; never revive its old generic gate. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/272364820',prefix='jingyuan166-gate159-';
const L={centre:[-202.9625,180.7607],r:Math.atan2(18.932,-.402),width:1.80,doorBottom:.48,doorTop:3.10,step:.16,
 pathEnd:[-205.15,179.8866],pathTop:.12,ground:.12};
function gate(b){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,prefix+k,...args);};
 const box=(name,x,y,z,w,h,d,c,mat=10)=>b.mesh(name,b.geo(name,Y.Geo.box),x,y,z,w,h,d,c,mat,.88);
 try{
 b.local(L.centre[0],L.ground,L.centre[1],L.r,()=>{
  const stone='#aca99f',brick='#94968e',red='#a02f2b';
  for(const s of[-1,1]){
   box('pier',s*1.26,1.77,0,.68,3.54,.74,brick,18);
   box('pier-foot',s*1.26,.14,0,.76,.28,.84,stone);
   box('jamb',s*.92,1.80,.16,.10,2.64,.15,'#752d28',20);
   box('collar',s*.955,.83,.23,.20,.70,.28,'#c1c0b4');
   box('leaf',s*.4525,1.79,.17,.895,2.62,.12,red,20);
   box('lower-rail',s*.4525,.66,.239,.895,.10,.024,'#862723',20);
  }
  // Only the shallow visible horizontal head, not an invented tiled roof.
  box('head',0,3.14,.10,2.06,.14,.34,'#793d30',20);
  for(const s of[-1,1])box('pier-cap',s*1.26,3.57,0,.76,.10,.82,brick,18);
  // Positive local x points north; positive z points east/outside.
  box('north-plaque',1.26,2.65,.388,.27,.67,.045,'#795535',20);
  if(b.lettering)for(const [i,ch]of[...'二院'].entries())b.lettering(ch,1.26,2.80-i*.27,.418,.18,.23,0,'#d6b675');
  box('south-metal-plaque',-1.26,2.53,.388,.40,.34,.043,'#b4a877',29);
  // Three equal rises, built as grounded solids; the last joins the landing.
  for(let i=0;i<3;i++)box('step-'+i,0,(i+1)*L.step/2,1.35-i*.34,2.54-i*.18,(i+1)*L.step,.36,stone);
  box('landing',0,.24,-.12,2.20,.48,1.26,'#b7b3a7');
  // Only short, photograph-visible flanks; their remote wing junctions unknown.
  for(const s of[-1,1]){
   box('wall',s*2.35,.74,0,1.5,1.48,.48,'#a6a18b',11);
   box('wall-cap',s*2.35,1.50,0,1.58,.10,.55,stone);
   // Flat irregular masonry, not rows of rounded stones. Five closed reusable
   // cut-stone meshes carry shallow bevels; exposed backing is the mortar.
   const colors=['#a49b85','#929385','#b0a38d','#888d84','#b1aa96'];
   let base=.025;
   for(let row=0;row<4;row++){
    const h=[.35,.30,.39,.35][row],weights=[[1,.8,1.2,.9],[.65,1.1,.8,1.15,.7],[1.2,.75,1,.85],[.8,1.15,.85,1.1]][row],total=weights.reduce((a,c)=>a+c,0);let x=1.62;
    for(let col=0;col<weights.length;col++){
     const w=weights[col]/total*1.46,k=(row*3+col+(s>0?0:2))%5,key='stone-chip-'+k;
     const geom=b.geo(key,()=>{
      const shapes=[[[0,.15],[.12,0],[.81,0],[1,.21],[.93,.86],[.69,1],[.09,.92]],[[0,.25],[.2,0],[.86,.07],[1,.42],[.84,1],[.13,.91]],[[0,.08],[.68,0],[1,.19],[.9,.77],[.66,1],[.07,.86]],[[0,.19],[.16,0],[.91,.11],[1,.77],[.76,1],[.08,.91]],[[0,.31],[.28,0],[.88,.05],[1,.35],[.88,.93],[.31,1],[.03,.79]]],ring=shapes[k].map(p=>[p[0]-.5,p[1]-.5]),g=new Y.Geo.Geometry(),p=(i,z,scale=1)=>[ring[i][0]*scale,ring[i][1]*scale,z];
      for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length;g.tri([0,0,.5],p(i,.5,.91),p(j,.5,.91));g.tri([0,0,-.5],p(j,-.5),p(i,-.5));g.quad(p(i,-.5),p(j,-.5),p(j,.20),p(i,.20));g.quad(p(i,.20),p(j,.20),p(j,.5,.91),p(i,.5,.91));}return g;
     });
     b.mesh(key,geom,s*(x+w/2),base+h/2,.251,w-.019,h-.02,.038,colors[(row+col*2+(s>0?0:1))%5],10,.89);x+=w;
    }base+=h+.016;
   }
   for(let i=0;i<8;i++)box('fence',s*(1.68+i*.19),1.94,0,.028,.80,.035,'#514e43',20);
   box('fence-head',s*2.35,2.34,0,1.5,.036,.045,'#514e43',20);
  }
 });
 // Campus road 745 already supplies the long courtyard axis at y=.12.
 // Add only a short fitted ramp to it; do not duplicate the 27m existing path.
 const n=[Math.sin(L.r),Math.cos(L.r)],end=L.centre.map((v,i)=>v-.73*n[i]),a=L.pathEnd,
 dx=end[0]-a[0],dz=end[1]-a[1],len=Math.hypot(dx,dz),side=[-dz/len*.79,dx/len*.79],g=new Y.Geo.Geometry();
 const p=(q,y,s)=>[q[0]+side[0]*s,y,q[1]+side[1]*s],al=p(a,L.pathTop,-1),ar=p(a,L.pathTop,1);
 // The upper edge shares the landing's actual local z=-.75 boundary.
 // A perpendicular cross-section of the diagonal ramp would miss one corner.
 const high=u=>[L.centre[0]+Math.cos(L.r)*u-n[0]*.75,.60,L.centre[1]-Math.sin(L.r)*u-n[1]*.75],el=high(.79),er=high(-.79),bottom=q=>[q[0],.02,q[2]];
 g.quad(al,ar,er,el);g.quad(el,er,bottom(er),bottom(el));g.quad(ar,bottom(ar),bottom(er),er);g.quad(el,bottom(el),bottom(al),al);g.quad(ar,al,bottom(al),bottom(ar));
 b.mesh('court-walk',g,0,0,0,1,1,1,'#bcb9a5',21,.10);
 }finally{b.e.add=old;}
}
A.render=function(b,f,add){const result=prior.call(this,b,f,add);if(f.properties.id===ID){const id=b.id;b.id=f.properties.pickId;try{gate(b);}finally{b.id=id;}}return result;};
Y.Jingyuan166Gate159={id:ID,prefix,layout:L};
})(YY);
