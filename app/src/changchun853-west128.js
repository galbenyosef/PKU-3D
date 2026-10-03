/* Changchunyuan 65 west exit: official first-floor plan establishes the
 * corridor-end aperture and outward stair/landing. Local proportions and all
 * vertical sizes are fitted; no door leaves or unseen furnishings are claimed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/849765886';
function frame(f){
 const ring=f.geometry.coordinates[0],edges=ring.slice(1).map((b,i)=>{const a=ring[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);return{a,b,len,cx:(a[0]+b[0])/2};});
 const e=edges.sort((a,b)=>a.cx-b.cx)[0],ux=(e.b[0]-e.a[0])/e.len,uz=(e.b[1]-e.a[1])/e.len;
 const centre=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],nx=-uz,nz=ux,r=Math.atan2(nx,nz);
 return{centre,r,len:e.len,local:p=>[(p[0]-centre[0])*ux+(p[2]-centre[1])*uz,p[1],(p[0]-centre[0])*nx+(p[2]-centre[1])*nz]};
}
function layout(fr){const w=fr.len*.132,platformWidth=fr.len*.22,reach=fr.len*.185,flight=fr.len*.085;return{w,platformWidth,reach,flight,deck:.24,head:2.50,depth:.36,cuts:[{min:[-w/2,.24,-.40],max:[w/2,2.50,.75]}]};}
function bounds(r,fr){const ps=[];for(let i=0;i<r.g.v.length;i+=8)ps.push(fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1])));return[0,1,2].map(a=>[Math.min(...ps.map(p=>p[a])),Math.max(...ps.map(p=>p[a]))]);}
// The original central window is wider than the corridor aperture. Remove its
// entire small record group, not narrow leftover glass/frame strips at the jambs.
function displacedWindow(r,fr,q){const b=bounds(r,fr);return b[0][0]>-q.w/2-.5&&b[0][1]<q.w/2+.5&&b[1][0]>.7&&b[1][1]<2.70&&b[2][0]>-.6&&b[2][1]<.75;}
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
// The plan shows a continuous east-west corridor. Clip its fitted width to
// the existing outline; do not add a short dark backboard behind the doorway.
function corridor(f,fr,q){const local={type:'Polygon',coordinates:f.geometry.coordinates.map(r=>r.map(p=>{const v=fr.local([p[0],0,p[1]]);return[v[0],v[2]];}))};return A.clipGeometry(local,[-q.w/2,-1000,q.w/2,-q.depth]);}
function reverse(g){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24)for(const j of[0,16,8]){const k=i+j;out.vertex(g.v.slice(k,k+3),g.v.slice(k+3,k+6).map(v=>-v),g.v.slice(k+6,k+8));}return out;}
function corridorShell(b,g,q){const F=Y.Footprints,slab=F.surface(g,q.deck),edge=F.walls(g,0,q.deck);slab.v.push(...edge.v);
 b.mesh('corridor-floor',slab,0,0,0,1,1,1,'#c3c1b5',10);
 b.mesh('corridor-ceiling',reverse(F.surface(g,q.head)),0,0,0,1,1,1,'#d9d8d0',24);
 const walls=new G.Geometry();for(const pg of F.polygons(g))for(const ring of pg){const sign=F.area(ring)>0?1:-1;for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i];if(Math.abs(a[1]+q.depth)<1e-5&&Math.abs(c[1]+q.depth)<1e-5)continue;const ps=[[a[0],q.deck,a[1]],[c[0],q.deck,c[1]],[c[0],q.head,c[1]],[a[0],q.head,a[1]]];if(sign<0)ps.reverse();walls.quad(...ps);}}
 b.mesh('corridor-walls',walls,0,0,0,1,1,1,'#d9d8d0',24);
}
function entry(b,fr,q,corridorGeometry){const old=b.e.add,id=b.id;b.id=853;b.e.add=function(k,...args){return old.call(this,'changchun853-west128-'+k,...args);};
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  const wall='#dad9ca',stone='#afb5a9',landing=q.reach-q.flight;
  // Shallow masonry reveals join the fitted plain corridor shell.
  for(const side of[-1,1])b.box(side*(q.w/2+.06),(q.deck+q.head)/2,-q.depth/2,.12,q.head-q.deck,q.depth,wall,24);
  b.box(0,q.head+.055,-q.depth/2,q.w+.24,.11,q.depth,wall,24);
  // A low landing and single shallow outer tread preserve the plan adjacency.
  // Their vertical fit does not claim the real rise or count of stair risers.
  b.box(0,q.deck/2,(landing-q.depth)/2,q.platformWidth,q.deck,landing+q.depth,stone,10);
  b.box(0,q.deck/4,landing+q.flight/2,q.platformWidth,q.deck/2,q.flight+.002,stone,10);
  corridorShell(b,corridorGeometry,q);
 });}finally{b.e.add=old;b.id=id;}
}
A.render=function(b,f,add){if(f.properties.pickId!==853||f.properties.id!==ID)return previous.call(this,b,f,add);
 const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;
 try{result=previous.call(this,b,f,add);}finally{b.e.add=old;}
 const fr=frame(f),q=layout(fr);let changed=0,removedWindows=0;
 for(let i=0;i<rows.length;i++){const r=rows[i];if(displacedWindow(r,fr,q)){removedWindows++;continue;}const g=cutRecord(r,fr,q.cuts);if(g){changed++;if(g.v.length)old.call(b.e,'changchun853-west128-cut-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
 entry(b,fr,q,corridor(f,fr,q));return{...result,westExitCorridorShellFitted:true,westExitStructureFitted:true,westExitDoorStyleUnverified:true,westExitCutRecords:changed,westExitDisplacedWindowRecords:removedWindows};
};
Y.Changchun853West128={frame,layout,displacedWindow,corridor};
})(YY);
