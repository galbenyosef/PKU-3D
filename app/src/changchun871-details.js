/* 63 north vestibule and west/east corridor exits from its official first-floor plan.
 * Door-leaf material/elevation and roof remain unverified; no borrowed door type. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/849765893';
const LO=.60,HI=3.10;
function entry(key,a,z,fraction,width,platformWidth,platformOffset=0){const length=Math.hypot(z[0]-a[0],z[1]-a[1]),u=[(z[0]-a[0])/length,(z[1]-a[1])/length],n=[u[1],-u[0]],center=[a[0]+(z[0]-a[0])*fraction,a[1]+(z[1]-a[1])*fraction];return{key,a,z,u,n,center,fraction,width,platformWidth,platformOffset,bottom:LO,top:HI};}
// Plan north/east arrows fix orientation. End-exit corridor axis y743 lies
// between the plan's north/south wall lines y602/y881, independently of north door.
const corridorFraction=(743-602)/(881-602),entries=[
 entry('north',[-672.726,47.811],[-611.141,41.072],(816-173)/(1584-173),3.45,5.30),
 entry('west',[-670.95,63.923],[-672.726,47.811],1-corridorFraction,2.60,6.30,1.16),
 entry('east',[-611.141,41.072],[-609.365,57.194],corridorFraction,2.60,6.30,-1.16)
];
function local(p,e){return[(p[0]-e.center[0])*e.u[0]+(p[2]-e.center[1])*e.u[1],p[1],(p[0]-e.center[0])*e.n[0]+(p[2]-e.center[1])*e.n[1]];}
function clip(poly,fn){const out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],s=fn(p),t=fn(q);if(s>=0)out.push(p);if((s>=0)!==(t>=0)){const k=s/(s-t);out.push(p.map((v,j)=>v+(q[j]-v)*k));}}return out;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const emit=b.e.add,window=b.window;let serial=0,cutRecords=0,removedWindows=0;
 // An entrance replaces intersecting first-floor window groups completely;
 // clipping only their lower panes leaves hanging frame/glass remnants.
 b.window=function(x,y,z,w,h,r,...args){const point=[x,y,z];if(entries.some(e=>{const p=local(point,e);return Math.abs(p[2])<.3&&Math.abs(p[0])<e.width/2+w/2&&y-h/2<HI&&y+h/2>LO;})){removedWindows++;return;}return window.call(this,x,y,z,w,h,r,...args);};
 b.e.add=function(key,g,m,c,p,uv){if(p[1]!==871)return emit.call(this,key,g,m,c,p,uv);let current=g,changedAny=false;for(const e of entries){const W=e.width,world=v=>local(M.apply(m,[v[0],v[1],v[2],1]),e),out=new G.Geometry();let changed=false;
  for(let i=0;i<current.v.length;i+=24){const tri=[0,8,16].map(k=>current.v.slice(i+k,i+k+8)),ps=tri.map(world);if(ps.some(v=>Math.abs(v[2])>.55)||Math.min(...ps.map(v=>v[0]))>=W/2||Math.max(...ps.map(v=>v[0]))<=-W/2||Math.min(...ps.map(v=>v[1]))>=HI||Math.max(...ps.map(v=>v[1]))<=LO){out.v.push(...tri.flat());continue;}
   const x=v=>world(v)[0],y=v=>world(v)[1];let remain=tri,parts=[];for(const fn of[v=>-W/2-x(v),v=>x(v)-W/2,v=>LO-y(v),v=>y(v)-HI]){parts.push(clip(remain,fn));remain=clip(remain,v=>-fn(v));if(!remain.length)break;}if(remain.length>=3)changed=true;
   for(const poly of parts)for(let j=1;j<poly.length-1;j++){const vs=[poly[0],poly[j],poly[j+1]],pa=vs.map(v=>v.slice(0,3));if(Math.hypot(...M.cross(M.sub(pa[1],pa[0]),M.sub(pa[2],pa[0])))>1e-10)out.v.push(...vs.flat());}
  }
  if(changed){current=out;changedAny=true;}}
  if(!changedAny)return emit.call(this,key,g,m,c,p,uv);cutRecords++;if(current.v.length)return emit.call(this,'changchun871-cut-'+serial+++'-'+key,current,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=emit;b.window=window;}
 const old=b.id;b.id=871;try{for(const e of entries){const {center,n,width:W,platformWidth:PW,platformOffset:PX}=e;b.local(center[0],0,center[1],Math.atan2(n[0],n[1]),()=>{
 const box=(k,x,y,z,w,h,d)=>b.mesh('changchun871-'+e.key+'-'+k,b.geo('changchun871-unit-box',G.box),x,y,z,w,h,d,'#b8b9af',10);
 // Five plan-drawn treads; fitted rise, not a surveyed ground elevation.
 box('landing',-PX,.30,.40,PW,.60,.80);
 for(let j=0;j<5;j++){const h=(5-j)*.12;box('step-'+j,-PX,h/2,.80+(j+.5)*.35,PW,h,.35);}
 box('threshold',0,.30,-.10,W,.60,.20);
 if(e.key==='north')box('vestibule-floor',0,.30,-4.10,5.30,.60,8.20);
 // Short reveals keep the actual cut readable without inventing door leaves.
 box('reveal-left',-W/2-.06,(LO+HI)/2,-.10,.12,HI-LO,.20);
 box('reveal-right',W/2+.06,(LO+HI)/2,-.10,.12,HI-LO,.20);
 box('reveal-head',0,HI+.06,-.10,W+.24,.12,.20);
 });}
 const west=entries[1].center,east=entries[2].center,dx=east[0]-west[0],dz=east[1]-west[1],len=Math.hypot(dx,dz);b.local((west[0]+east[0])/2,0,(west[1]+east[1])/2,Math.atan2(dz,-dx),()=>b.mesh('changchun871-corridor-floor',b.geo('changchun871-unit-box',G.box),0,.30,0,len,.60,2.60,'#b8b9af',10));
 // Enclose only the plan-supported circulation footprint. Room interiors and
 // door-leaf finishes remain unmodelled; no wall crosses the E-W corridor.
 const north=entries[0],origin=north.a,northLen=Math.hypot(north.z[0]-origin[0],north.z[1]-origin[1]),hx=northLen*north.fraction;
 const cv=entries.slice(1).reduce((sum,e)=>sum-((e.center[0]-origin[0])*north.n[0]+(e.center[1]-origin[1])*north.n[1]),0)/2;
 b.local(origin[0],0,origin[1],Math.atan2(north.n[0],north.n[1]),()=>{
  const box=(k,x,y,v,w,h,d)=>b.mesh('changchun871-interior-'+k,b.geo('changchun871-unit-box',G.box),-x,y,-v,w,h,d,'#d4d2c8',24);
  const wall=(k,x,v,w,d)=>box(k,x,(LO+HI)/2,v,w,HI-LO,d),ceil=(k,x,v,w,d)=>box(k,x,HI+.07,v,w,.14,d);
  const hn=cv-1.30,hs=cv+1.30,left=hx-2.65,right=hx+2.65;
  wall('hall-west',left-.10,hn/2,.20,hn+.20);wall('hall-east',right+.10,hn/2,.20,hn+.20);
  wall('corridor-north-west',left/2,hn-.10,left,.20);wall('corridor-north-east',(right+northLen)/2,hn-.10,northLen-right,.20);
  // The plan shows the south-side central stairwell joining the corridor.
  const sx=hx+1.30,sw=2.60,sl=sx-sw/2,sr=sx+sw/2,back=15.95;
  wall('corridor-south-west',sl/2,hs+.10,sl,.20);wall('corridor-south-east',(sr+northLen)/2,hs+.10,northLen-sr,.20);
  wall('stair-west',sl-.10,(hs+back)/2,.20,back-hs);wall('stair-east',sr+.10,(hs+back)/2,.20,back-hs);wall('stair-back',sx,back,sw+.40,.20);
  ceil('hall-ceiling',hx,hn/2,5.70,hn+.40);ceil('corridor-ceiling',northLen/2,cv,northLen+.40,3.00);ceil('stair-ceiling',sx,(hs+back)/2,sw+.40,back-hs+.40);
  box('stair-floor',sx,LO/2,(hs+back)/2,sw+.40,LO,back-hs+.40);
 });

 }finally{b.id=old;}
 return{...result,detail:'changchun871-plan-three-entrances',entrancePlanVerified:true,entranceElevationMeasured:false,doorLeafStyleVerified:false,roofVerified:false,interiorBoundariesPlanVerified:true,removedWindows,cutRecords};
};Y.Changchun871={...entries[0],entries,corridorFraction};})(YY);
