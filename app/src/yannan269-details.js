/* Yannan 50, restored courtyard photo: a recessed entry between hipped wings.
 * Plan is the mapped footprint; heights and hidden elevations remain fitted. */
(function(Y){'use strict';const original=Y.Architecture30.render,F=Y.Footprints,G=Y.Geo,C={brick:'#aaa99f',red:'#b63c20',glass:'#526d66',stone:'#c0beb0',roof:'#7a827e'},eave=2.83;
 function glazing(b,x,y,w,h){b.box(x,y,-.035,w-.13,h-.13,.035,C.glass,5,.75);for(const side of[-1,1]){b.box(x+side*(w/2-.045),y,.02,.09,h,.10,C.red,20,.9);b.box(x,y+side*(h/2-.045),.02,w,.09,.10,C.red,20,.9);}b.box(x,y+h*.28,.055,w,.06,.095,C.red,20,.95);b.box(x,y-h*.12,.055,.045,h*.72,.095,C.red,20,.95);for(const side of[-1,1])b.box(x+side*w*.24,y-h*.12,.06,.025,h*.68,.08,C.red,20,.95);b.box(x,y-h/2-.06,.02,w+.20,.10,.22,C.stone,10,.92);}
 function entry(b,x){
  // One central leaf with fixed sidelights and a shared transom, no portico.
  const w=2.18,bottom=.25,top=2.52;
  for(const dx of[-w/2,-.48,.48,w/2]){const low=Math.abs(dx)>.5?.85:bottom;b.box(x+dx,(low+top)/2,.025,.10,top-low,.13,C.red,20,.9);}
  for(const y of[top-.04,2.18])b.box(x,y,.025,w,.09,.13,C.red,20,.9);b.box(x,bottom+.04,.025,.96,.09,.13,C.red,20,.9);
  b.box(x,.68,.025,.88,.82,.10,C.red,20,.9);b.box(x,1.57,.015,.87,1.09,.04,C.glass,5,.75);
  for(const side of[-1,1])glazing(b,x+side*.79,1.54,.52,1.34);
  for(const dx of[-.78,0,.78])b.box(x+dx,2.35,.015,dx===0?.86:.52,.24,.04,C.glass,5,.75);
  b.box(x-.32,1.20,.12,.028,.24,.035,'#ad9d79',9,.98);
  b.box(x,.20,.05,2.55,.12,.55,C.stone,10,.2);b.box(x,.13,.46,2.55,.26,.42,C.stone,10,.2);b.box(x,.065,.84,2.75,.13,.38,C.stone,10,.2);
 }
 function wall(b,a,c,openings){const length=Math.hypot(c[0]-a[0],c[1]-a[1]),r=-Math.atan2(c[1]-a[1],c[0]-a[0]);b.local(a[0],0,a[1],r,()=>{
  const cuts=[0,length,...openings.flatMap(o=>[o.x-o.w/2,o.x+o.w/2])].sort((a,b)=>a-b);
  for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2,holes=openings.filter(o=>mid>o.x-o.w/2&&mid<o.x+o.w/2).sort((a,b)=>a.low-b.low);let low=.025;for(const o of[...holes,{low:eave,high:eave}]){if(o.low>low)b.box(mid,(low+o.low)/2,-.11,hi-lo,o.low-low,.22,C.brick,18,.6);low=Math.max(low,o.high);}}
  for(const o of openings)if(o.silent)continue;else if(o.door)entry(b,o.x);else glazing(b,o.x,(o.low+o.high)/2,o.w,o.high-o.low);
  b.box(length/2,eave-.06,.07,length,.16,.22,C.red,20,2);
 });}
 function roof(b,ring){
  // Distance to the actual boundary gives continuous hipped wings and valleys.
  // In particular, the short western setback also meets the wall at the eave;
  // a rectangular roof cropped to the plan would leave that edge open.
  const profile=(x,z)=>eave+.20332*Math.min(...ring.slice(1).map((c,i)=>{
   const a=ring[i],dx=c[0]-a[0],dz=c[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));
   return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);
  }));
  const geom={type:'Polygon',coordinates:[ring]},mesh=F.profiledSurface(geom,p=>profile(...p),.65);b.mesh('yannan269-hip-roof',mesh,0,0,0,1,1,1,C.roof,19,2);
  const tile=b.geo('yannan269-eave-tile',()=>{const g=new G.Geometry();for(let i=0;i<8;i++){const a=i*Math.PI/8,c=(i+1)*Math.PI/8;g.quad([Math.cos(a)*.5,Math.sin(a),-.5],[Math.cos(c)*.5,Math.sin(c),-.5],[Math.cos(c)*.5,Math.sin(c),.5],[Math.cos(a)*.5,Math.sin(a),.5]);}return g;});
  for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,r=-Math.atan2(uz,ux);for(let u=.14;u<len-.10;u+=.245)for(const offset of[.14,.42]){const x=a[0]+ux*u+uz*offset,z=a[1]+uz*u-ux*offset;if(F.inside([x,z],geom))b.mesh('yannan269-eave-tile',tile,x,profile(x,z),z,.18,.055,.34,C.roof,19,2.06,r);}}
 }
 function house(b,ring){const length=i=>Math.hypot(ring[i+1][0]-ring[i][0],ring[i+1][1]-ring[i][1]),open=ring.slice(1).map(()=>[]),win=(i,x,w=1.55)=>open[i].push({x,w,low:.77,high:2.47});
  // Clockwise edge order after normalising the source ring: front wing faces 1/7,
  // courtyard returns 0/8, and the recessed entry wall 9.
  for(const i of[1,7])win(i,length(i)/2,1.70);
  for(const i of[0,8])win(i,length(i)*.55,1.42);
  const n=length(9);win(9,n*.18,1.28);win(9,n*.82,1.28);open[9].push({x:n/2,w:1.06,low:.20,high:2.56,door:true},...[-1,1].map(side=>({x:n/2+side*.81,w:.62,low:.85,high:2.56,silent:true})));
  // Unseen exterior windows retain a restrained fitted pattern, not photo claims.
  for(const i of[2,3,4,5,6])if(length(i)>4)for(let j=0,count=Math.max(1,Math.round(length(i)/5));j<count;j++)win(i,length(i)*(j+.5)/count,1.35);
  for(let i=0;i<ring.length-1;i++)wall(b,ring[i],ring[i+1],open[i]);roof(b,ring);
 }
 Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==269||f.properties.id!=='way/866277607')return original.call(this,b,f,add);
  const fr=Y.ArchitectureAdapter.frame(f.geometry),cs=Math.cos(fr.r),sn=Math.sin(fr.r);let ring=f.geometry.coordinates[0].map(([x,z])=>[cs*(x-fr.centre[0])-sn*(z-fr.centre[1]),sn*(x-fr.centre[0])+cs*(z-fr.centre[1])]);if(F.area(ring)>0){ring=ring.slice(0,-1).reverse();ring.push(ring[0]);}
  add('v30-footprint-base-269',F.surface(f.geometry,.045),'#b5bbae',10,269);
  return Y.ArchitectureAdapter.render(b,f,(builder)=>house(builder,ring),Y.ARCHIVE.legacy['850'],{name:'yannan269-restored-house',frame:fr,sourceFrame:{w:fr.w-.15,d:fr.d-.15,centre:[0,0]},keepHeight:true,preserveOuterParts:true});
 };
})(YY);
