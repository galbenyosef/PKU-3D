/* North stair entrance from registered 2013 views. All dimensions are photo fits.
 * Upper two open stair bays remain unresolved; west entrance is untouched. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/1009052052';
const fit={center:[212,-554.1837046897399],angle:-Math.PI+Math.atan2(2.376,19.532),width:6.2,level:2.5,head:5.3,landing:[-.5,2,0,1.8],steps:12,foot:-5.2};
function frame(){const centre=fit.center,r=fit.angle,c=Math.cos(r),s=Math.sin(r);return{centre,r,local:p=>[(p[0]-centre[0])*c-(p[2]-centre[1])*s,p[1],(p[0]-centre[0])*s+(p[2]-centre[1])*c],world:(u,y,v)=>[centre[0]+c*u+s*v,y,centre[1]-s*u+c*v]};}
const cuts=[{min:[-3.1,.02,-2.45],max:[3.1,5.3,.3]}];
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

function replaceMethod(o,k,v){const d=Object.getOwnPropertyDescriptor(o,k);Object.defineProperty(o,k,d&&'value'in d?{...d,value:v}:{value:v,writable:true,configurable:true,enumerable:d?d.enumerable:true});return()=>{if(d)Object.defineProperty(o,k,d);else delete o[k];};}
function entry(b,fr){const old=b.id;b.id=389;const box=(key,x,y,z,w,h,d,c='#a4a69e',mat=24)=>b.mesh('f389-n133-'+key,b.geo('f389-n133-box',G.box),x,y,z,w,h,d,c,mat);
try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
 const metal='#adb8b5',glass='#496b75';
 box('inside-floor',0,1.25,-1.175,6.2,2.5,2.35);
 box('inside-back',0,3.9,-2.4,6.2,2.8,.1,'#424b49',20);
 box('inside-ceiling',0,5.36,-1.175,6.44,.12,2.59);
 for(const s of[-1,1])box('reveal-'+s,s*3.16,3.9,-1.175,.12,2.8,2.59);
 // The platform supports only the central operable pair, not all side glazing.
 box('landing',.75,1.25,.9,2.5,2.5,1.8);
 const step=( -.5-fit.foot)/fit.steps;
 for(let i=0;i<fit.steps;i++){const height=(i+1)*fit.level/fit.steps;box('step-'+i,fit.foot+(i+.5)*step,height/2,.9,step,height,1.8);}
 // Two fitted leaves, fixed side lights and one transom; unknown hardware omitted.
 for(const [key,lo,hi]of[['east-fixed',-3.1,-.5],['leaf-east',-.5,.75],['leaf-west',.75,2],['west-fixed',2,3.1]])box(key,(lo+hi)/2,3.65,-.12,hi-lo,2.3,.045,glass,5);
 box('transom-glass',0,5.05,-.12,6.2,.5,.045,glass,5);
 for(const x of[-3.1,-.5,.75,2,3.1])box('frame-v-'+x,x,3.9,-.055,.065,2.8,.11,metal,29);
 for(const y of[2.47,4.8,5.27])box('frame-h-'+y,0,y,-.055,6.2,.06,.11,metal,29);
 // Front rail, west return, and outer stair rail. No cross-rail at the east stair/landing join.
 for(const x of[-.5,.75,2])box('platform-post-'+x,x,3.025,1.76,.045,1.05,.045,metal,29);
 box('west-rear-post',2,3.025,.08,.045,1.05,.045,metal,29);
 for(const h of[.24,.49,.74,1.05]){b.beam([-.5,2.5+h,1.76],[2,2.5+h,1.76],.04,metal,29);b.beam([2,2.5+h,1.76],[2,2.5+h,.08],.04,metal,29);b.beam([fit.foot,fit.level/fit.steps+h,1.76],[-.5,2.5+h,1.76],.04,metal,29);}
 for(let i=0;i<fit.steps;i+=3){const x=fit.foot+(i+.5)*step,y=(i+1)*fit.level/fit.steps;const top=fit.level/fit.steps+1.05+(x-fit.foot)/(-.5-fit.foot)*(fit.level-fit.level/fit.steps);box('stair-post-'+i,x,(y+top)/2,1.76,.045,top-y,.045,metal,29);}
 });}finally{b.id=old;}}
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==389)return previous.call(this,b,f,add);const ring=f.geometry.coordinates[0];if(JSON.stringify(ring[5])!==JSON.stringify([225.056,-555.772])||JSON.stringify(ring[6])!==JSON.stringify([205.524,-553.396]))throw Error('389 north source edge changed; re-register');
const old=b.e.add,oldWindow=b.window,rows=[],fr=frame();let removedWindowGroups=0;
const restoreWindow=replaceMethod(b,'window',function(...args){const emit=this.e.add,group=[],restoreEmit=replaceMethod(this.e,'add',function(k,g,m,c,p,uv){group.push({k,g,m:new Float32Array(m),c,p:[...p],uv});});try{oldWindow.apply(this,args);}finally{restoreEmit();}
const bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(const r of group)for(let i=0;i<r.g.v.length;i+=8){const q=fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1]));for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j]);}}
const c=cuts[0],overlap=[0,1,2].every(j=>bb[j]<c.max[j]&&bb[j+3]>c.min[j]);if(overlap){removedWindowGroups++;return;}for(const r of group)emit.call(this.e,r.k,r.g,r.m,r.c,r.p,r.uv);});
let result,restoreAdd;try{restoreAdd=replaceMethod(b.e,'add',function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p:[...p],uv});});result=previous.call(this,b,f,add);}finally{if(restoreAdd)restoreAdd();restoreWindow();}
let changed=0;for(let i=0;i<rows.length;i++){const r=rows[i],g=cutRecord(r,fr,cuts);if(g){changed++;if(g.v.length)old.call(b.e,'f389-n133-retained-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}entry(b,fr);return{...result,north133:{cutRecords:changed,removedWindowGroups,fit,upperOpenStairBaysImplemented:false,dimensionsMeasured:false,doorHardwareVerified:false}};};Y.Foreign389North133={frame,fit,cuts};})(YY);
