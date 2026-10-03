/* 389 north: two photograph-registered open stair bays, not five template windows.
 * Visible stair/landing portions only; no invented rear wall or complete circulation. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/1009052052';
const fit={bays:[[6.4,9.35],[10.1,13.35]],width:6.2,depth:3.3,upperEastEdge:-3.6,dimensionsMeasured:false};
const frame=()=>Y.Foreign389North133.frame();
const cuts=fit.bays.map(([lo,hi])=>({min:[lo>10?-3.6:-3.1,lo,-3.35],max:[3.1,hi,.3]}));
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

function details(b,fr){const old=b.id;b.id=389;const box=(key,x,y,z,w,h,d,c='#9fa39d',mat=24)=>b.mesh('f389-u135-'+key,b.geo('f389-u135-box',G.box),x,y,z,w,h,d,c,mat);
try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
 const metal='#aebbb8';
 for(let bay=0;bay<2;bay++){const [lo,hi]=fit.bays[bay],prefix='bay'+bay;
  const left=bay?fit.upperEastEdge:-3.1,right=3.1,mid=(left+right)/2,width=right-left;box(prefix+'-front-platform',mid,lo-.12,-.48,width,.24,.96);
  for(const s of[-1,1])box(prefix+'-jamb-'+s,s<0?left-.06:right+.06,(lo+hi)/2,-.13,.12,hi-lo,.46);
  box(prefix+'-head',mid,hi+.07,-.13,width+.24,.14,.46);
  const railZ=bay?-.45:-.08;for(const x of[left+.1,mid,right-.1])box(prefix+'-rail-post-'+x,x,lo+.47,railZ,.04,.94,.04,metal,29);
  for(const h of[.45,.94])b.beam([left+.1,lo+h,railZ],[right-.1,lo+h,railZ],.04,metal,29);
 }
 // Middle opening: the photograph shows a diagonal concrete underside.
 // Fit this visible run only; hidden return flights are deliberately not asserted.
 const low=6.4,high=8.6,x0=2.35,x1=-2.35,z=-1.7,w=1.35,n=11;
 const slab=new G.Geometry(),a=[x0,low-.18,z-w/2],c=[x1,high-.18,z-w/2],d=[x1,high-.18,z+w/2],e=[x0,low-.18,z+w/2];
 slab.quad(a,e,d,c);slab.quad([x0,low,z-w/2],[x1,high,z-w/2],[x1,high,z+w/2],[x0,low,z+w/2]);
 for(const side of[-1,1]){const q=z+side*w/2,P=[x0,low-.18,q],Q=[x1,high-.18,q],R=[x1,high,q],S=[x0,low,q];if(side>0)slab.quad(P,S,R,Q);else slab.quad(P,Q,R,S);}
 for(const [x,y,s]of[[x0,low,1],[x1,high,-1]]){const ps=[[x,y-.18,z-w/2],[x,y-.18,z+w/2],[x,y,z+w/2],[x,y,z-w/2]];if(s<0)slab.quad(...ps);else slab.quad(...ps.reverse());}
 b.mesh('f389-u135-visible-diagonal',slab,0,0,0,1,1,1,'#9fa39d',24);
 // Tread wedges have the same inclined underside as their support slab.
 const stair=new G.Geometry();for(let i=0;i<n;i++){const xa=x0+(x1-x0)*i/n,xb=x0+(x1-x0)*(i+1)/n,ya=low+(high-low)*i/n,yb=low+(high-low)*(i+1)/n;
  const p=[xa,ya,z-w/2],q=[xb,yb,z-w/2],r=[xa,yb,z-w/2],P=[xa,ya,z+w/2],Q=[xb,yb,z+w/2],R=[xa,yb,z+w/2];
  stair.tri(p,q,r);stair.tri(P,R,Q);stair.quad(r,q,Q,R);stair.quad(p,r,R,P);stair.quad(p,P,Q,q);
 }b.mesh('f389-u135-visible-treads',stair,0,0,0,1,1,1,'#a5aaa2',24);
 box('middle-run-low-return',2.725,low-.12,-1.665,.75,.24,3.33);
 box('middle-run-high-platform',-2.725,high-.12,-1.665,.75,.24,3.33);
 // Top photograph: west/right platform soffit, east/left sector remains open.
 box('upper-west-soffit',1.55,13.05,-1.6,3.1,.24,3.2);
 });}finally{b.id=old;}}
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==389)return previous.call(this,b,f,add);if(!Y.Foreign389North133)throw Error('389 upper requires accepted north entrance');const fr=frame(),old=b.e.add,oldWindow=b.window,rows=[];let removedWindowGroups=0;
b.window=function(...args){const emit=this.e.add,group=[];this.e.add=function(k,g,m,c,p,uv){group.push({k,g,m:new Float32Array(m),c,p:[...p],uv});};try{oldWindow.apply(this,args);}finally{this.e.add=emit;}
const bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(const r of group)for(let i=0;i<r.g.v.length;i+=8){const q=fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1]));for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],q[j]);bb[j+3]=Math.max(bb[j+3],q[j]);}}
if(cuts.some(c=>[0,1,2].every(j=>bb[j]<c.max[j]&&bb[j+3]>c.min[j]))){removedWindowGroups++;return;}for(const r of group)emit.call(this.e,r.k,r.g,r.m,r.c,r.p,r.uv);};
b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p:[...p],uv});};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=old;b.window=oldWindow;}
let changed=0;for(let i=0;i<rows.length;i++){const r=rows[i],g=cutRecord(r,fr,cuts);if(g){changed++;if(g.v.length)old.call(b.e,'f389-u135-retained-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}details(b,fr);return{...result,upper135:{cutRecords:changed,removedWindowGroups,openBays:2,fit,completeStairCirculation:false,hiddenRearWallAdded:false,roofTopologyPending:true,roofVoidComplete:false}};};Y.Foreign389Upper135={fit,cuts,frame};})(YY);
