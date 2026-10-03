/* Chengzeyuan northwest teaching cross-wing: only the visible eastern part of
 * the south elevation is fitted from the 91s aerial. The repost is not an
 * official source and its filming date is unknown. Door/grade remain unresolved. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1031892009';
function frame(f){const ring=f.geometry.coordinates[0],a=ring[3],c=ring[2],length=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/length,uz=(c[1]-a[1])/length;return{a,c,length,ux,uz,nx:-uz,nz:ux,r:Math.atan2(-uz,ux)};}
function layout(fr,body){return [.35,.49,.63,.77,.91].flatMap(t=>[{u:t*fr.length,w:fr.length*.112,lo:body-.98,hi:body-.30,upper:true},{u:t*fr.length,w:fr.length*.044,lo:body*.24,hi:body*.56,upper:false}]);}
function render(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const fr=frame(f),start=fr.length*.27,stop=fr.length*.985,local=(x,z)=>[(x-fr.a[0])*fr.ux+(z-fr.a[1])*fr.uz,(x-fr.a[0])*fr.nx+(z-fr.a[1])*fr.nz],point=(u,y,v=0)=>[fr.a[0]+fr.ux*u+fr.nx*v,y,fr.a[1]+fr.uz*u+fr.nz*v];
 const window=b.window,box=b.box;let wall,result;
 // The west connection masks that end in the aerial: leave its inherited
 // windows untouched. Suppress only generic windows in the observed region.
 b.window=function(x,y,z,w,h,r){const [u,v]=local(x,z);if(u>start&&u<stop&&Math.abs(v)<.10&&Math.cos(r-fr.r)>.9999)return;return window.apply(this,arguments);};
 // The inherited floor belt crosses the lower apertures; retain only its
 // unobserved west and end fragments rather than drawing through glass.
 b.box=function(...v){const p=this.world(v.slice(0,3)),u=local(p[0],p[2])[0];if(Math.cos(this.rotation-fr.r)>.9999&&Math.abs(local(p[0],p[2])[1])<.10&&v[3]>fr.length*.99&&Math.abs(v[4]-.13)<1e-7&&Math.abs(v[5]-.11)<1e-7){const old=this.e.add;this.e.add=function(k,...args){return old.call(this,'190-retained-belt-'+k,...args);};try{for(const [a,c]of[[v[0]-v[3]/2,start-u+v[0]],[stop-u+v[0],v[0]+v[3]/2]])if(c>a)box.call(this,(a+c)/2,v[1],v[2],c-a,...v.slice(4));}finally{this.e.add=old;}return;}return box.apply(this,v);};
 try{result=previous.call(this,b,f,(key,g,c,m,id)=>{if(key.startsWith('v30-walls-'+f.properties.pickId+'-'))wall={g,c,m,id};else add(key,g,c,m,id);});}finally{b.window=window;b.box=box;}
 const holes=layout(fr,result.bodyHeight),mesh=new G.Geometry(),white=new G.Geometry(),bandLo=result.bodyHeight-1.10,bandHi=result.bodyHeight-.18;
 // Keep all non-south triangles exactly. The new south wall is partitioned
 // around real empty rectangles; recessed panes have no opaque backing face.
 for(let i=0;i<wall.g.v.length;i+=24){const tri=wall.g.v.slice(i,i+24);if([0,8,16].every(k=>Math.abs(local(tri[k],tri[k+2])[1])<1e-7))continue;mesh.v.push(...tri);}
 const xs=[0,start,stop,fr.length,...holes.flatMap(q=>[q.u-q.w/2,q.u+q.w/2])].sort((a,b)=>a-b),ys=[.30,bandLo,bandHi,result.bodyHeight,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b),observed=new G.Geometry();
 for(let i=1;i<xs.length;i++)for(let j=1;j<ys.length;j++){const a=xs[i-1],c=xs[i],lo=ys[j-1],hi=ys[j],u=(a+c)/2,y=(lo+hi)/2;if(c-a<1e-8||hi-lo<1e-8||holes.some(q=>u>q.u-q.w/2&&u<q.u+q.w/2&&y>q.lo&&y<q.hi))continue;const g=u>start&&u<stop?(y>bandLo&&y<bandHi?white:observed):mesh;g.quad(point(a,lo),point(c,lo),point(c,hi),point(a,hi));}
 add('190-retained-walls-with-south-apertures',mesh,wall.c,wall.m,wall.id);add('190-observed-south-grey-wall',observed,'#7e8985',24,wall.id);add('190-observed-south-eave-band',white,'#d6d9ca',24,wall.id);
 const state=[b.origin,b.rotation,b.id,b.anim];b.origin=[0,0,0];b.rotation=0;b.id=f.properties.pickId;b.anim=0;
 try{for(const q of holes){const p=point(q.u,0),tag='190-south-'+(q.upper?'upper':'lower')+'-';b.local(p[0],0,p[2],fr.r,()=>{const add0=b.e.add;b.e.add=function(k,...args){return add0.call(this,tag+k,...args);};try{const h=q.hi-q.lo,y=(q.hi+q.lo)/2;
  // Pane extends 10 mm under each jamb's inner edge; no open reveal slit.
  b.box(0,y,-.19,q.w-.05,h-.07,.035,'#718b83',5);
  for(const x of[-q.w/2,q.w/2])b.box(x,y,-.09,.07,h+.07,.24,q.upper?'#d5d9cc':'#9aa8a0',24);
  for(const yy of[q.lo,q.hi])b.box(0,yy,-.09,q.w+.07,.07,.24,q.upper?'#d5d9cc':'#9aa8a0',24);
  const mullions=q.upper?[-q.w/6,q.w/6]:[0];for(const x of mullions)b.box(x,y,-.15,.045,h,.06,'#a5b3a9',29);
 }finally{b.e.add=add0;}});}}finally{[b.origin,b.rotation,b.id,b.anim]=state;}
 return{...result,strategy:'building190-v46',southVisibleWindowGroupsFitted:5,southWindowApertures:true,entranceVerified:false,northElevationVerified:false,gradeVerified:false,sourceOutline:true,sourceRoofUnchanged:true};
}
Y.Building190={id:ID,frame,layout,render};A.render=render;
})(YY);
