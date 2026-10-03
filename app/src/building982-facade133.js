/* 982 south long elevation, registered 84.88 s native source frame.
 * Pale base, paired narrow slots, seven two-level recessed bays and seven
 * clerestory windows are proportional fits. Trees obscure the ground edge;
 * no entrance or other elevation is inferred. The roof stream stays intact. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,M=Y.M,G=Y.Geo,ID='way/1031892012';
function frame(f){const ring=f.geometry.coordinates[0],edges=ring.slice(1).map((b,i)=>({a:ring[i],b,z:(ring[i][1]+b[1])/2})),e=edges.sort((a,b)=>b.z-a.z)[0],a=e.a[0]<e.b[0]?e.a:e.b,b=e.a[0]<e.b[0]?e.b:e.a,L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L,uz=(b[1]-a[1])/L,nx=-uz,nz=ux;return{a,b,L,ux,uz,nx,nz,world:(u,y,z)=>[a[0]+ux*u+nx*z,y,a[1]+uz*u+nz*z],local:p=>[(p[0]-a[0])*ux+(p[2]-a[1])*uz,p[1],(p[0]-a[0])*nx+(p[2]-a[1])*nz]};}
function layout(fr){const H=13.6,L=fr.L,base=.39*H,panelBottom=.405*H,panelTop=.84*H,panelWidth=.066*L,windows=[],panels=[];
 for(let i=0;i<7;i++){const u=(.155+.126*i)*L;panels.push({u,w:panelWidth,lo:panelBottom,hi:panelTop});for(const y of[.5*H,.738*H])windows.push({kind:'main',u,y,w:.048*L,h:.16*H,front:-.12});windows.push({kind:'clerestory',u,y:.963*H,w:.084*L,h:.052*H,front:0});for(const side of[-1,1])windows.push({kind:'base',u:u+side*.014*L,y:.21*H,w:.014*L,h:.21*H,front:0});}
 windows.push({kind:'west-strip',u:.055*L,y:.52*H,w:.045*L,h:.90*H,front:0});return{H,base,panelBottom,panelTop,panelWidth,windows,panels};}
function bounds(r,fr){const p=[];for(let i=0;i<r.g.v.length;i+=8)p.push(fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1])));return[0,1,2].map(i=>[Math.min(...p.map(p=>p[i])),Math.max(...p.map(p=>p[i]))]);}
function southDetail(r,fr){if(r.k.startsWith('v30-')||r.k.startsWith('building982-roof130-'))return false;const b=bounds(r,fr);return b[0][0]>=-.4&&b[0][1]<=fr.L+.4&&b[2][0]>-.40&&b[2][1]<.65&&b[1][0]>.3&&b[1][0]<13.25&&b[1][1]<13.3;}
function stripSouthWall(r,fr){if(!r.k.startsWith('v30-walls-982-'))return null;const g=new G.Geometry();let changed=false;for(let i=0;i<r.g.v.length;i+=24){const p=[0,8,16].map(j=>fr.local(M.apply(r.m,[...r.g.v.slice(i+j,i+j+3),1])));if(p.every(p=>Math.abs(p[2])<.0002)){changed=true;continue;}g.v.push(...r.g.v.slice(i,i+24));}return changed?g:null;}
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

function facade(fr,q,emit){const groups=new Map(),get=(key,c,mat)=>{if(!groups.has(key))groups.set(key,{g:new G.Geometry(),c,mat});return groups.get(key).g;},paint={base:'#d8dbd0',main:'#9a9e90',band:'#d5d9cd',recess:'#818e88',frame:'#52675f',glass:'#688b83'};
 const box=(g,u,y,z,w,h,d)=>{const mesh=G.box();for(let i=0;i<mesh.v.length;i+=8){const v=mesh.v;g.vertex(fr.world(u+v[i]*w,y+v[i+1]*h,z+v[i+2]*d),[fr.ux*v[i+3]+fr.nx*v[i+5],v[i+4],fr.uz*v[i+3]+fr.nz*v[i+5]],v.slice(i+6,i+8));}};
 const opening=(u,lo,hi,w)=>({min:[u-w/2,lo,-1],max:[u+w/2,hi,1]}),windowCut=w=>opening(w.u,w.y-w.h/2,w.y+w.h/2,w.w),plane=(u,lo,hi,w,z)=>new G.Geometry().quad(fr.world(u-w/2,lo,z),fr.world(u+w/2,lo,z),fr.world(u+w/2,hi,z),fr.world(u-w/2,hi,z));
 function cutPlane(key,c,u,lo,hi,w,z,cuts){const g=plane(u,lo,hi,w,z),r={g,m:M.identity()},cut=cutRecord(r,fr,cuts);get(key,c,24).v.push(...(cut||g).v);}
 function reveal(key,c,u,lo,hi,w,z0,z1){const g=get(key,c,24),x0=u-w/2,x1=u+w/2,quad=(...p)=>g.quad(...p.reverse());quad(fr.world(x0,lo,z0),fr.world(x0,hi,z0),fr.world(x0,hi,z1),fr.world(x0,lo,z1));quad(fr.world(x1,hi,z0),fr.world(x1,lo,z0),fr.world(x1,lo,z1),fr.world(x1,hi,z1));quad(fr.world(x0,hi,z0),fr.world(x1,hi,z0),fr.world(x1,hi,z1),fr.world(x0,hi,z1));quad(fr.world(x1,lo,z0),fr.world(x0,lo,z0),fr.world(x0,lo,z1),fr.world(x1,lo,z1));}
 const cuts=[...q.panels.map(p=>opening(p.u,p.lo,p.hi,p.w)),...q.windows.filter(w=>w.kind!=='main').map(windowCut)];
 for(const [key,c,lo,hi]of[['base',paint.base,.30,q.base],['main',paint.main,q.base,12.45],['band',paint.band,12.45,q.H]])cutPlane(key,c,fr.L/2,lo,hi,fr.L,0,cuts);
 for(const p of q.panels){const ws=q.windows.filter(w=>w.kind==='main'&&w.u===p.u);cutPlane('recess',paint.recess,p.u,p.lo,p.hi,p.w,-.12,ws.map(windowCut));reveal('main-reveals',paint.main,p.u,p.lo,p.hi,p.w,0,-.12);}
 for(const w of q.windows){const lo=w.y-w.h/2,hi=w.y+w.h/2,c=w.kind==='base'?paint.base:w.kind==='clerestory'?paint.band:w.kind==='main'?paint.recess:paint.main;reveal('window-reveals-'+w.kind,c,w.u,lo,hi,w.w,w.front,-.25);box(get('glass',paint.glass,5),w.u,w.y,-.27,w.w,w.h,.035);const fg=get('frames',paint.frame,29),fw=.045;for(const side of[-1,1]){box(fg,w.u+side*(w.w/2-fw/2),w.y,-.225,fw,w.h,.085);box(fg,w.u,w.y+side*(w.h/2-fw/2),-.225,w.w,fw,.085);}
  if(w.kind==='main'){box(fg,w.u,w.y,-.225,.035,w.h,.085);box(fg,w.u,w.y+w.h*.14,-.225,w.w,.035,.085);}else if(w.kind==='clerestory'){box(fg,w.u,w.y,-.225,.035,w.h,.085);}else if(w.kind==='west-strip'){box(fg,w.u,w.y,-.225,.045,w.h,.085);for(const y of[q.base,8.35,11.65])box(fg,w.u,y,-.225,w.w,.055,.085);}
 }
 for(const[key,r]of groups)emit(key,r.g,r.c,r.mat);
}
A.render=function(b,f,add){if(f.properties.pickId!==982||f.properties.id!==ID)return prior.call(this,b,f,add);const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=prior.call(this,b,f,add);}finally{b.e.add=old;}const fr=frame(f),q=layout(fr);let removed=0;for(let i=0;i<rows.length;i++){const r=rows[i];if(southDetail(r,fr)){removed++;continue;}const g=stripSouthWall(r,fr);if(g){old.call(b.e,'building982-facade133-retained-wall',g,r.m,r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}facade(fr,q,(key,g,c,mat)=>{if(g.v.length)old.call(b.e,'building982-facade133-'+key,g,M.identity(),c,[mat,982,0,0]);});return{...result,southFacadeProportionalFit:true,southObservedMainBays:7,southGenericRecordsRemoved:removed,entranceVerified:false};};
Y.Building982Facade133={frame,layout,southDetail,facade};
})(YY);
