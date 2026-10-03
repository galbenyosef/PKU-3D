/* Yannan 56 / way/866277600: the photographed entrance has steps and an
 * unobstructed doorway between veranda posts. Positions remain display fits. */
(function(Y){'use strict';
 const P=Y.Builder.prototype,court=P.heritageCourt,A=Y.ArchitectureAdapter,adapt=A.render;
 const ID='way/866277600',STEP='yannan265-entry-step';
 P.heritageCourt=function(p,w,d){
  if(this.id!==265||p.id!==856||p.houseNumber!==56)return court.call(this,p,w,d);
  const box=this.box,front=-d/2+d*.36+.68+.715;
  this.box=function(x,y,z,bw,bh,bd,...rest){
   // Keep the existing doorway and windows. Its centre post was in front
   // of the door; move only that post just beyond the left jamb.
   if(Math.abs(x+w*.01)<1e-8&&Math.abs(y-1.93)<1e-8&&bw===.11&&bh===3.12&&bd===.11)x=-.875;
   return box.call(this,x,y,z,bw,bh,bd,...rest);
  };
  try{
   const result=court.call(this,p,w,d);
   // Three fitted treads meet the original .455-high veranda slab. The
   // shallow source depth becomes about .25 m after its retained Z fit.
   for(let i=0;i<3;i++){const top=.34-i*.115;this.heritageBox(STEP,0,top/2,front+(i+.5)*.155,2.70,top,.155,'#b3b4a9',10,.1);}
   return result;
  }finally{this.box=box;}
 };
 A.render=function(b,f,method,source,options={}){
  if(f.properties.id===ID&&f.properties.pickId===265)options={...options,retainLowKeys:[...(options.retainLowKeys||[]),STEP]};
  return adapt.call(this,b,f,method,source,options);
 };
})(YY);
