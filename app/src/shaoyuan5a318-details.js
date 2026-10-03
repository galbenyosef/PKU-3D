/* Shaoyuan 5 A: resolve conflicts in the existing fitted entrance.
 * Door style, upper windows, canopy, facade and roof are retained. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/988601892';
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const names=['entry','window','steps'],saved=names.map(n=>b[n]),own=names.map(n=>Object.hasOwn(b,n)),engineAdd=b.e.add;
 let landingMatrix,stairArgs;
 b.e.add=function(k,g,m,...args){if(k==='v30-shaoyuan5a318-landing')landingMatrix=Array.from(m);return engineAdd.call(this,k,g,m,...args);};
 let inEntry=false;
 b.window=function(x,y,z,w,h,...rest){
  // The ground-floor stair window's frame protruded through the retained door
  // glazing. Upper stair windows and every door frame remain untouched.
  if(!inEntry&&x===0&&y===2.35&&w===1.45&&h===1.7&&z>0)return;
  return saved[1].call(this,x,y,z,w,h,...rest);
 };
 b.steps=function(x,z,w,n,top){
  if(!inEntry)return saved[2].call(this,x,z,w,n,top);
  stairArgs={x,z,w,n,top};
 };
 b.entry=function(w,z,h,title,stair){
  inEntry=true;let result;try{result=saved[0].call(this,w,z,h,title,stair);}finally{inEntry=false;}
  const rear=.49,front=.785;
  this.mesh('shaoyuan5a318-landing',this.geo('box',Y.Geo.box),0,stair/2,z+(rear+front)/2,w+.4,stair,front-rear,Y.COLORS.stone,10,.05);
  return result;
 };
 try{const result=prior.call(this,b,f,add);
  if(stairArgs&&landingMatrix)closedSteps(f,add,landingMatrix,stairArgs);
  return result;
 }finally{b.e.add=engineAdd;names.forEach((n,i)=>{if(own[i])b[n]=saved[i];else delete b[n];});}
};
function closedSteps(f,add,m,{w,n,top}){
 const ring=f.geometry.coordinates[0],sign=Y.Footprints.area(ring)>=0?1:-1;
 const world=(x,y,z)=>Y.M.apply(m,[x/5.2,y/.5-.5,(z-.6375)/.295,1]).slice(0,3);
 for(let i=0;i<n;i++){
  const z=3.3-i*.42,d=(n-i)*.43+.4,h=top*(i+1)/n;
  let poly=[[-w/2,z-d/2],[w/2,z-d/2],[w/2,z+d/2],[-w/2,z+d/2]].map(([x,z])=>{const p=world(x,0,z);return[p[0],p[2]];});
  // Clip the whole plan before extrusion, so every mapped cut gets a wall.
  for(let j=1;j<ring.length;j++){
   const a=ring[j-1],b=ring[j],side=p=>sign*((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])),input=poly;poly=[];
   for(let k=0;k<input.length;k++){const p=input[k],q=input[(k+1)%input.length],sp=side(p),sq=side(q);if(sp>=-1e-8)poly.push(p);if((sp>=0)!==(sq>=0)){const t=sp/(sp-sq);poly.push(p.map((v,l)=>v+(q[l]-v)*t));}}
  }
  if(poly.length<3)continue;
  if(Y.Footprints.area([...poly,poly[0]])<0)poly.reverse();
  const g=new Y.Geo.Geometry(),height=world(0,h,0)[1],point=(p,y)=>[p[0],y,p[1]];
  for(let j=1;j<poly.length-1;j++){g.tri(point(poly[0],height),point(poly[j+1],height),point(poly[j],height));g.tri(point(poly[0],0),point(poly[j],0),point(poly[j+1],0));}
  for(let j=0;j<poly.length;j++){const a=poly[j],b=poly[(j+1)%poly.length];g.quad(point(a,0),point(a,height),point(b,height),point(b,0));}
  add('shaoyuan5a318-closed-step-'+i,g,Y.COLORS.stone,10,f.properties.pickId);
 }
}
Y.Shaoyuan5a318Details={id:ID};
})(YY);
