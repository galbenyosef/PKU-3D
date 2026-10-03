/* Guanghua #2 east entrance: retain the existing surveyed-map anchor and fitted
 * curved glazing. The official 2019 photograph supports tall door leaves over
 * a continuous stone platform; exact dimensions and present-day state remain fitted. */
(function(Y){'use strict';
const P=Y.Builder.prototype,previous=P.gsmEntry32,KEY='guanghua2-101-platform-joints';
const front=x=>1+1.45*Math.cos(x/14*Math.PI);
function joints(){const out=[];for(let i=8;i<=10;i++){const x=-7+i*.875,z=front(x),a=x-.875,c=x+.875,ra=-Math.atan2(z-front(a),.875),rb=-Math.atan2(front(c)-z,.875);out.push([[x,z],[x+Math.sin(ra)*1.47,z+Math.cos(ra)*1.47],[x+Math.sin(rb)*1.47,z+Math.cos(rb)*1.47]]);}return out;}
P.gsmEntry32=function(){
 const box=this.box,local=this.local;let segment=-1;
 this.local=function(...args){segment++;return local.apply(this,args);};
 this.box=function(...args){if(segment>=7&&segment<=10){
  // Existing door bay only: a high transom, not a mid-leaf curtain-wall rail.
  if(args[1]===2.6&&args[2]===.075&&args[4]===.065)args[1]=4.25;
  // Preserve the complete original slab footprint and .32 top; extend its
  // unsupported .22 underside down to the common y=0 ground plane.
  if(args[1]===.27&&args[2]===.72&&args[4]===.1&&args[5]===1.5){args[1]=.16;args[4]=.32;}
 }return box.apply(this,args);};
 try{previous.call(this);}finally{this.box=box;this.local=local;}
 const g=this.geo(KEY,()=>{const g=new Y.Geo.Geometry();for(const tri of joints()){
  const b=tri.map(p=>[p[0],0,p[1]]),t=tri.map(p=>[p[0],.32,p[1]]);
  g.tri(t[0],t[1],t[2]);g.tri(b[2],b[1],b[0]);for(let i=0;i<3;i++)g.quad(b[i],b[(i+1)%3],t[(i+1)%3],t[i]);
 }return g;});
 this.mesh(KEY,g,0,0,0,1,1,1,'#b8bcae',24);
};
Y.Guanghua2101Details={key:KEY,joints};
})(YY);
