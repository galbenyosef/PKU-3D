/* Built west entrance: Baidu September 2013 continuous streetviews.
 * Coordinates and dimensions photograph-fitted; other entrances unchanged. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/1009052052';
function frame(){const centre=[205.484,-487.5],r=-Math.PI/2+Math.atan2(9.3,75.926),c=Math.cos(r),s=Math.sin(r);return{centre,r,local:p=>[(p[0]-centre[0])*c-(p[2]-centre[1])*s,p[1],(p[0]-centre[0])*s+(p[2]-centre[1])*c],world:(u,y,v)=>[centre[0]+c*u+s*v,y,centre[1]-s*u+c*v]};}
const cuts=[{min:[-3.65,.14,-2.6],max:[3.65,15.3,.7]}];
function split(poly,axis,value,sign){const inside=[],outside=[],d=v=>sign*(v.q[axis]-value);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);(da>=0?inside:outside).push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db),mix=k=>a[k].map((v,j)=>v+(b[k][j]-v)*t),v={q:mix('q'),p:mix('p'),n:mix('n'),uv:mix('uv')};inside.push(v);outside.push(v);}}return{inside,outside};}
function difference(poly,box){if([0,1,2].some(i=>Math.max(...poly.map(v=>v.q[i]))<=box.min[i]||Math.min(...poly.map(v=>v.q[i]))>=box.max[i]))return{parts:[poly],changed:false};let rest=poly,parts=[];for(let i=0;i<3;i++)for(const[v,sign]of[[box.min[i],1],[box.max[i],-1]]){const q=split(rest,i,v,sign);if(q.outside.length>=3)parts.push(q.outside);rest=q.inside;if(rest.length<3)return{parts:[poly],changed:false};}return{parts,changed:true};}
function cutRecord(r,fr,cuts){const v=r.g.v,inv=M.inverse(r.m),triangles=[],g=new G.Geometry();let changed=false;
 for(let i=0;i<v.length;i+=24){let polys=[[]];for(let j=0;j<3;j++){const k=i+j*8,p=M.apply(r.m,[v[k],v[k+1],v[k+2],1]).slice(0,3),n=M.norm([inv[0]*v[k+3]+inv[1]*v[k+4]+inv[2]*v[k+5],inv[4]*v[k+3]+inv[5]*v[k+4]+inv[6]*v[k+5],inv[8]*v[k+3]+inv[9]*v[k+4]+inv[10]*v[k+5]]);polys[0].push({p,n,q:fr.local(p),uv:[v[k+6],v[k+7]]});}
  for(const box of cuts){const next=[];for(const p of polys){const q=difference(p,box);changed ||= q.changed;next.push(...q.parts);}polys=next;}
  triangles.push(...polys);
 }
 if(!changed)return null;
 for(const p of triangles)for(let j=1;j+1<p.length;j++){const t=[p[0],p[j],p[j+1]],a=M.sub(t[1].p,t[0].p),b=M.sub(t[2].p,t[0].p);if(Math.hypot(...M.cross(a,b))<1e-9)continue;for(const v of t)g.vertex(v.p,M.norm(v.n),v.uv);}
 if(r.g.detailWidth)g.detailWidth=r.g.detailWidth;return g;
}

function entry(b,fr){const old=b.id;b.id=389;const box=(key,x,y,z,w,h,d,c='#a8aaa3',mat=24)=>b.mesh('f389-'+key,b.geo('f389-box',G.box),x,y,z,w,h,d,c,mat);
try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
 const metal='#aebbb8',glass='#496b75',dark='#344443';
 box('landing',0,.825,.75,7.3,1.65,2.0);
 for(let i=0;i<10;i++){const h=1.65-i*.165;box('step-'+i,0,h/2,1.92+i*.34,7.3,h,.36);}
 box('recess-floor',0,.825,-1.3,7.3,1.65,2.6);
 box('recess-back',0,8.4,-2.54,7.3,13.5,.10,dark,20);
 box('recess-ceiling',0,15.36,-1.25,7.5,.12,2.7);
 for(const sign of[-1,1])box('reveal-'+sign,sign*3.71,7.73,-1.25,.12,15.18,2.7);
 box('upper-glass',0,10.1,-.11,7.3,10.4,.06,glass,28);
 box('door-glass',0,3.27,-.18,7.3,3.24,.05,glass,5);
 for(const x of[-3.6,-2.4,-1.2,0,1.2,2.4,3.6]){
 box('door-upright-'+x,x,3.27,-.115,.065,3.24,.11,metal,29);
 box('upper-upright-'+x,x,10.1,-.055,.055,10.4,.10,metal,29);}
 for(const y of[1.68,4.15,4.88,7.5,10.15,12.8,15.24])box('transom-'+y,0,y,-.04,7.3,.07,.12,metal,29);
 // Fine handle hardware remains unverified and is omitted.
 // Broad clear canopy supported by projecting metal ribs, visible from both sides.
 const pane=b.geo('f389-clear-canopy-pane',()=>{const g=new G.Geometry();g.quad([-3.825,0,-.145],[-3.825,0,2.305],[3.825,0,2.305],[3.825,0,-.145]);return g;});
 b.mesh('f389-canopy-glass',pane,0,5.05,0,1,1,1,'#819c9d',44);
 for(let i=0;i<7;i++)box('canopy-rib-'+i,-3.75+i*1.25,4.94,1.08,.11,.20,2.5,metal,29);
 for(const z of[-.13,1.08,2.29])box('canopy-cross-'+z,0,4.94,z,7.65,.13,.11,metal,29);
 for(const sign of[-1,1]){
  for(let i=0;i<6;i++){const z=1.6+i*.68,y=1.65-Math.max(0,z-1.75)*1.65/3.4;box('rail-post-'+sign+'-'+i,sign*3.53,y+.47,z,.045,.94,.045,metal,29);}
  b.beam([sign*3.53,2.59,1.6],[sign*3.53,.99,5.0],.055,metal,29);
  b.beam([sign*3.53,2.16,1.6],[sign*3.53,.56,5.0],.035,metal,29);
 }
 });}finally{b.id=old;}}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const old=b.e.add,oldWindow=b.window,rows=[],fr=frame();let removedWindowGroups=0;
 // Inspect every actual emitted vertex of a complete window call, including
 // its glass and outer frame. Remove the group if any of its bounds overlap.
 b.window=function(...args){const emit=this.e.add,group=[];this.e.add=function(k,g,m,c,p,uv){group.push({k,g,m:new Float32Array(m),c,p:[...p],uv});};try{oldWindow.apply(this,args);}finally{this.e.add=emit;}
 const bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(const r of group)for(let i=0;i<r.g.v.length;i+=8){const q=fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1]));for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j]);}}
 const overlap=bb[0]<3.65&&bb[3]>-3.65&&bb[1]<15.3&&bb[4]>.14&&bb[2]<.7&&bb[5]>-.7;if(overlap){removedWindowGroups++;return;}for(const r of group)emit.call(this.e,r.k,r.g,r.m,r.c,r.p,r.uv);};b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p:[...p],uv});};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=old;b.window=oldWindow;}
let changed=0;for(let i=0;i<rows.length;i++){const r=rows[i],g=cutRecord(r,fr,cuts);if(g){changed++;if(g.v.length)old.call(b.e,'f389-cut-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}entry(b,fr);return{...result,westEntryPhotoFitted:true,cutRecords:changed,removedWindowGroups,wholeBuildingComplete:false};};Y.Foreign389Entry={id:ID,frame,cuts};
})(YY);
