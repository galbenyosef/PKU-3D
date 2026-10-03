/* Geometry study for the photographed northwest entrance of pick 57.
 * Not registered: upper-floor datum and ground profile must be resolved together.
 * Every dimension and division below is a photo fit, not a measured value. */
(function(Y){'use strict';
 const fit=Object.freeze({rise:3.10,run:12,steps:20,width:3,landingWidth:8,landingDepth:4,parapet:.58,wall:.22,doorWidth:2.4,doorTop:2.40,threshold:.12});
 function sideWall(){
  const f=fit,g=new Y.Geo.Geometry(),a=4,b=a+f.run,z=f.landingDepth,th=f.wall;
  // Both long faces, end faces, bottom and sloping cap form a closed prism.
  const p=[[a,0,z],[b,0,z],[b,f.parapet,z],[a,f.rise+f.parapet,z]],q=p.map(v=>[v[0],v[1],v[2]-th]);
  g.quad(...p);g.quad(...q.slice().reverse());for(let i=0;i<4;i++){let j=(i+1)%4;g.quad(p[i],q[i],q[j],p[j]);}return g;
 }
 function stoneJoints(){
  const g=new Y.Geo.Geometry(),f=fit,z=4.008,t=.014;
  const strip=(a,b,c,d)=>g.quad([a,b,z],[c,b,z],[c,d,z],[a,d,z]);
  // Thin mortar courses follow the photographed stone cladding; divisions are fitted.
  for(const y of[.72,1.48,2.24,3.0]){
   const end=Math.min(16,4+(f.rise+f.parapet-y)*f.run/f.rise);
   if(y<f.doorTop){strip(-4,y-t/2,-1.27,y+t/2);strip(1.27,y-t/2,end,y+t/2);}
   else strip(-4,y-t/2,end,y+t/2);
  }
  for(let x=-3.4;x<15.9;x+=1.85){
   const top=x<4?f.rise+f.parapet:f.parapet+f.rise*(16-x)/f.run;
   if(Math.abs(x)<1.27)strip(x-t/2,f.doorTop+.07,x+t/2,top-.12);
   else strip(x-t/2,.02,x+t/2,top-.12);
  }
  return g;
 }
 function coping(){
  const g=new Y.Geo.Geometry(),f=fit;
  // A closed sloping stone cap covers both faces of the stair parapet.
  const a=4,b=16,z=4.07,back=3.71,y0=f.rise+f.parapet,y1=f.parapet;
  const p=[[a,y0-.10,z],[b,y1-.10,z],[b,y1+.04,z],[a,y0+.04,z]],q=p.map(v=>[v[0],v[1],back]);
  g.quad(...p);g.quad(...q.slice().reverse());for(let i=0;i<4;i++){const j=(i+1)%4;g.quad(p[i],q[i],q[j],p[j]);}return g;
 }
 function build(b){
  const f=fit,stone='#c3c2b5',metal='#9ca7a4',glass='#425856',prefix='history240-',emit=b.e.add;
  b.e.add=function(k,...args){return emit.call(this,prefix+k,...args);};
  try{
   // Platform over the lower vestibule; the door is cut through its front wall.
   b.box(0,f.rise-.12,2,f.landingWidth,.24,f.landingDepth,stone,10);
   const jamb=(f.landingWidth-f.doorWidth)/2;
   for(const s of[-1,1])b.box(s*(f.doorWidth/2+jamb/2),f.rise/2,3.89,jamb,f.rise,.22,stone,10);
   b.box(0,(f.rise-.24+f.doorTop)/2,3.89,f.doorWidth,f.rise-.24-f.doorTop,.22,stone,10);
   b.box(0,.06,3.68,f.doorWidth,.12,.64,stone,10);
   // The recessed reflective door plane does not claim a visible interior.
   b.box(0,(f.doorTop+f.threshold)/2,3.45,f.doorWidth,f.doorTop-f.threshold,.07,glass,5);
   for(const x of[-f.doorWidth/2,0,f.doorWidth/2])b.box(x,(f.doorTop+f.threshold)/2,3.51,.075,f.doorTop-f.threshold,.10,metal,9);
   for(const y of[f.threshold,f.doorTop])b.box(0,y,3.51,f.doorWidth,.075,.10,metal,9);
   for(const s of[-1,1])b.box(s*(f.doorWidth/2+.05),(f.doorTop+f.threshold)/2,3.68,.10,f.doorTop-f.threshold,.64,stone,10);
   // Closed treads descend along the facade; their solid depth supports each riser.
   const dx=f.run/f.steps,dy=f.rise/f.steps;
   for(let i=0;i<f.steps;i++){const h=f.rise-i*dy;b.box(4+(i+.5)*dx,h/2,2.5,dx,h,f.width,stone,10);}
   const key='stair-parapet';b.mesh(key,b.geo(key,sideWall),0,0,0,1,1,1,stone,10);
   // A separate shallow cap at the landing has the same top as the stair wall.
   b.box(0,f.rise+f.parapet/2,3.89,8,f.parapet,.22,stone,10);
   b.box(0,f.rise+f.parapet-.03,3.89,8,.14,.36,'#d6d5c9',10);
   b.mesh('coping',b.geo('history240-coping',coping),0,0,0,1,1,1,'#d6d5c9',10);
   b.mesh('joints',b.geo('history240-joints',stoneJoints),0,0,0,1,1,1,'#97988e',10);
   for(const x of[-.13,.13]){b.beam([x,.86,3.61],[x,1.49,3.61],.018,metal,9);for(const y of[.86,1.49])b.beam([x,y,3.56],[x,y,3.61],.016,metal,9);}
  }finally{b.e.add=emit;}
 }
 Y.HistoryEntry240={fit,sideWall,stoneJoints,coping,build,registered:false};
})(YY);
