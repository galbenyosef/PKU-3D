/* Own three0 photograph: white corner canopy and metal/glass doors beneath
 * Liuqing's two glazed staircase faces. Unseen steps and ramps remain open. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,F=Y.Footprints,ID='way/240825556';
function frame(f){const q=Y.ArchitectureAdapter.frame(f.geometry),c=Math.cos(q.r),s=Math.sin(q.r);return{...q,local:p=>[(p[0]-q.centre[0])*c-(p[2]-q.centre[1])*s,p[1],(p[0]-q.centre[0])*s+(p[2]-q.centre[1])*c]};}
function points(r,fr){const a=[];for(let i=0;i<r.g.v.length;i+=8)a.push(fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1])));return a;}
function bounds(ps){return[0,1,2].map(i=>[Math.min(...ps.map(p=>p[i])),Math.max(...ps.map(p=>p[i]))]);}
function layout(rows,fr){const panes=rows.filter(r=>r.c==='#8aaba5'&&r.p[0]===5).map(r=>bounds(points(r,fr))),east=panes.find(b=>b[0][1]-b[0][0]<.3),north=panes.find(b=>b[2][1]-b[2][0]<.3);if(!east||!north)return null;
 const ex=(east[0][0]+east[0][1])/2,nz=(north[2][0]+north[2][1])/2,lo=.12,hi=2.98;
 return{ex,nz,lo,hi,east,north,cuts:[{min:[ex-4.2,.08,nz-.35],max:[ex-.18,3.0,nz+.70]},{min:[ex-.70,.08,nz+.18],max:[ex+.35,3.0,nz+4.2]}]};
}
// Generic masonry sills must end at the curtain-wall footprint. Remove only
// their projected overlap, including the sill depth in front of the glazing.
function sillCuts(r,fr,q){if(r.c!=='#c3c6bb'||r.p[0]!==10)return[];const b=bounds(points(r,fr));if(b[1][1]-b[1][0]>.15)return[];const cuts=[];
 for(const [pane,along,depth]of[[q.north,0,2],[q.east,2,0]]){if(b[depth][1]-b[depth][0]>.5||b[depth][1]<pane[depth][0]||b[depth][0]>pane[depth][1])continue;const min=b.map(v=>v[0]-.001),max=b.map(v=>v[1]+.001);min[along]=pane[along][0];max[along]=pane[along][1];min[1]=pane[1][0];max[1]=pane[1][1];cuts.push({min,max});}return cuts;
}
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
function entry(b,fr,q){const{ex:x,nz:z,lo,hi}=q,C={white:'#deded3',frame:'#576560',glass:'#607a77',stone:'#b5b9ac'},old=b.e.add,id=b.id;b.id=91;b.e.add=function(k,...a){return old.call(this,'teaching91-corner-'+k,...a);};
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  const w=3.65,h=hi-lo,y=(lo+hi)/2;
  for(const face of['north','east']){const north=face==='north',along=north?x-2.175:z+2.175,depth=north?z-.08:x+.08;
   const box=(u,yy,d,ww,hh,dd,c,m)=>north?b.box(u,yy,d,ww,hh,dd,c,m):b.box(d,yy,u,dd,hh,ww,c,m);
   box(along,y,depth,w,h,.045,C.glass,5);
   for(const u of[-w/2,-w*.32,0,w*.32,w/2])box(along+u,y,depth+(north?-.04:.04),.065,h+.065,.11,C.frame,9);
   for(const yy of[lo,2.52,hi])box(along,yy,depth+(north?-.04:.04),w+.065,.065,.11,C.frame,9);
   for(const u of[-w*.16,w*.16])box(along+u,1.18,depth+(north?-.11:.11),.025,.38,.045,C.frame,9);
   for(const u of[-w/2-.12,w/2+.12])box(along+u,1.60,north?z+.20:x-.20,.24,3.0,.66,C.white,10);
   box(along,3.04,north?z+.20:x-.20,w,.16,.66,C.white,10);
  }
  b.box(x,1.60,z,.34,3.0,.34,C.white,10);
  b.box(x-1.865,3.29,z+1.865,5.17,.42,5.17,C.white,10);
  // A low connected threshold follows the two faces; no unverified stair flight.
  const p=[[x-4.35,z-.40],[x+.40,z-.40],[x+.40,z+4.35],[x-.55,z+4.35],[x-.55,z+.55],[x-4.35,z+.55],[x-4.35,z-.40]],g={type:'Polygon',coordinates:[p]};
  b.mesh('threshold-top',F.surface(g,.12),0,0,0,1,1,1,C.stone,10);b.mesh('threshold-edge',F.walls(g,0,.12),0,0,0,1,1,1,C.stone,10);
 });}finally{b.e.add=old;b.id=id;}
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=previous(b,f,add);}finally{b.e.add=old;}const fr=frame(f),q=layout(rows,fr);if(!q){for(const r of rows)old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);return result;}
 let changed=0,sillRecords=0;for(let i=0;i<rows.length;i++){const r=rows[i],sc=sillCuts(r,fr,q),g=cutRecord(r,fr,[...q.cuts,...sc]);if(sc.length&&g)sillRecords++;if(g){changed++;if(g.v.length)old.call(b.e,'teaching91-cut-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
 entry(b,fr,q);return{...result,cornerEntranceFitted:true,cornerCutRecords:changed,curtainSillRecords:sillRecords,unseenStairsUnverified:true};
};
Y.Teaching3Entrance91={id:ID,frame,layout,sillCuts};
})(YY);
