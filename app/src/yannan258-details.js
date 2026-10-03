/* Yannan 51: fitted double wooden leaves from the numbered 2025 entrance
 * photograph. Two columns/four rows of glazing above one recessed lower panel.
 * The photograph establishes the pattern, not surveyed dimensions. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,ID='way/866277593';
A.render=function(b,f,add){
 if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const own=Object.hasOwn(b,'heritageDoor'),door=b.heritageDoor;
 const ownWindow=Object.hasOwn(b,'heritageWindow'),window=b.heritageWindow;
 b.heritageWindow=function(x,y,z,...a){
  // The numbered entry photo shows solid brick beside the doors. These two
  // approximate source windows otherwise intrude into the new porch rear wall.
  if(z>0&&Math.abs(y-2)<1e-6&&Math.abs(x)<1.8)return;
  return window.call(this,x,y,z,...a);
 };
 const originalAdd=b.e.add;let doorway,plaque;
 b.e.add=function(k,g,m,...args){if(k==='v30-plane'&&args[1][0]===8){plaque={k,g,args};return;}if(k==='v30-yannan258-door-reveal')doorway=new Float32Array(m);
  // The numbered roof close-up shows weathered red machine tiles, reddish
  // exposed timber and green metal drainage, rather than grey-green tiles.
  if(args[1][0]===19)args[0]='#966c51';
  if(args[0]==='#81634f')args[0]='#795047';
  if(args[0]==='#596253')args[0]='#466554';
  return originalAdd.call(this,k,g,m,...args);};
 b.heritageDoor=function(x,y,z,w=1.3,h=2.5,r=0){this.local(x,y,z,r,()=>{
  const put=(key,x,y,z,w,h,d,c,mat=20)=>this.heritageBox('yannan258-'+key,x,y,z,w,h,d,c,mat,.92),wood='#49312b',trim='#563d31';
  put('door-reveal',0,h/2,0,w+.17,h+.18,.22,'#4a4e46',18);
  for(const s of[-1,1]){
   const cx=s*w*.25,lw=w*.5,low=h*.235,top=h*.93,bottom=h*.065,glassLow=h*.235,glassHigh=h*.93;
   // Glazing sits in front of the retained solid wall/reveal, as do the
   // original heritage windows. The opaque lower panel never backs the glass.
   put('leaf-glass',cx,(glassLow+glassHigh)/2,.16,lw*.72,glassHigh-glassLow,.028,'#64716b',5);
   put('lower-panel',cx,(bottom+low)/2,.13,lw*.76,low-bottom,.05,wood);
   for(const q of[-1,1])put('leaf-stile',cx+q*lw*.455,h/2,.17,lw*.09,h,.12,wood);
   for(const yy of[h*.025,h*.235,h*.965])put('leaf-rail',cx,yy,.17,lw,.07*h,.12,wood);
   put('glazing-mullion',cx,(glassLow+glassHigh)/2,.205,.025,glassHigh-glassLow,.07,trim);
   for(let j=1;j<4;j++)put('glazing-crossbar',cx,glassLow+(glassHigh-glassLow)*j/4,.205,lw*.78,.025,.07,trim);
   for(const q of[-1,1])put('panel-border',cx+q*lw*.36,(bottom+low)/2,.17,.025,low-bottom,.045,trim);
   for(const yy of[bottom,low])put('panel-border',cx,yy,.17,lw*.76,.025,.045,trim);
  }
  // Right leaf has a dark lock plate; both visible handles are levers, not rings.
  put('lock-plate',w*.055,h*.405,.245,.055,h*.15,.025,'#252829',9);
  for(const s of[-1,1])put('lever',s*w*.075,h*.407,.265,w*.13,.023,.045,'#92866b',9);
  // Match the original threshold exactly so its landing contact is retained.
  this.box(0,-.045,.1,w+.4,.16,.47,'#b3b4a9',10,.2);
 });};
 let result;
 try{result=prior.call(this,b,f,add);}finally{if(own)b.heritageDoor=door;else delete b.heritageDoor;if(ownWindow)b.heritageWindow=window;else delete b.heritageWindow;b.e.add=originalAdd;}
 if(doorway){
  // Recover the exact already-fitted door frame. New porch geometry does not
  // change the Adapter bounds, target roof height or any existing submission.
  const root=new Float32Array(doorway),M=Y.M,G=Y.Geo;
  for(let i=0;i<3;i++){root[i]/=1.49;root[4+i]/=2.68;root[8+i]/=.22;root[12+i]-=root[4+i]*1.25;}
  const emit=(key,g,x,y,z,w,h,d,color,mat=18,r=0)=>originalAdd.call(b.e,'v30-yannan258-'+key,g,M.multiply(root,M.transform([x,y,z],[w,h,d],r)),color,[mat,f.properties.pickId,0,.9]);
  const box=(key,x,y,z,w,h,d,color,mat=18)=>emit(key,b.geo('yannan258-porch-box',G.box),x,y,z,w,h,d,color,mat);
  const brick='#a4a49b',stone='#b3b4a9';
  // Reuse the original numbered atlas tile on the photographed right pier.
  if(plaque)originalAdd.call(b.e,plaque.k,plaque.g,M.multiply(root,M.transform([1.49,2.0,2.025],[.39,.30,1],0)),...plaque.args);
  // Photo: stone plinths support grey-brick piers; all three passageways remain
  // genuine voids. Platform top equals the original threshold top (+.035).
  box('porch-floor',0,-.2075,1.03,3.60,.485,2.24,stone,10);
  for(const x of[-1.49,1.49])for(const z of[.12,1.80]){
   box('porch-stone-base',x,.305,z,.47,.54,.47,stone,10);
   box('porch-base-cap',x,.60,z,.50,.10,.50,stone,10);
   box('porch-brick-pier',x,1.70,z,.42,2.10,.42,brick);
  }
  const arch=b.geo('yannan258-shallow-arch',()=>{
   const g=new G.Geometry(),top=1.28;
   for(let i=0;i<32;i++){
    const x=-.5+i/32,u=-.5+(i+1)/32,a=1-4*x*x,c=1-4*u*u;
    g.quad([x,a,.5],[u,c,.5],[u,top,.5],[x,top,.5]);
    g.quad([u,c,-.5],[x,a,-.5],[x,top,-.5],[u,top,-.5]);
    g.quad([x,a,-.5],[u,c,-.5],[u,c,.5],[x,a,.5]);
   }
   g.quad([-.5,top,.5],[.5,top,.5],[.5,top,-.5],[-.5,top,-.5]);
   g.quad([-.5,0,-.5],[-.5,0,.5],[-.5,top,.5],[-.5,top,-.5]);
   g.quad([.5,0,.5],[.5,0,-.5],[.5,top,-.5],[.5,top,.5]);return g;
  });
  emit('porch-front-arch',arch,0,2.75,1.80,2.56,.25,.42,brick);
  for(const x of[-1.49,1.49])emit('porch-side-arch',arch,x,2.75,.96,1.26,.25,.42,brick,18,Math.PI/2);
  box('porch-flat-roof',0,3.15,1.0,3.80,.16,2.30,brick);
  box('porch-coping',0,3.26,1.0,3.90,.06,2.40,stone,10);
  // Low approach tread meets the existing ground and the new landing edge.
  box('porch-approach-step',0,-.3475,2.29,2.68,.205,.34,stone,10);
 }
 return result;
};
Y.Yannan258Details={id:ID};
})(YY);
