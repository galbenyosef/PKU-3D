/* Photographed brick west face of the short north wing only. The paired
 * narrow openings have separate upper lights; the broad centre is continuous.
 * Heights/widths are facade-photo fits, not a survey. Roof above the brick face is untouched. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/444991872';
const region={min:[-24.12,.16,1.30],max:[-4.20,19.36,2.50]},left=-24.12,width=19.92;
const groups=[{t:.23,w:.70},{t:.31,w:.70},{t:.47,w:2.10,broad:true},{t:.66,w:.70},{t:.74,w:.70}];
function split(poly,axis,value,sign){const inside=[],outside=[],d=v=>sign*(v.q[axis]-value);for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);(da>=0?inside:outside).push(a);if((da>0&&db<0)||(da<0&&db>0)){const t=da/(da-db),mix=k=>a[k].map((v,j)=>v+(b[k][j]-v)*t),v={q:mix('q'),p:mix('p'),n:mix('n'),uv:mix('uv')};inside.push(v);outside.push(v);}}return{inside,outside};}
function difference(poly,box){if([0,1,2].some(i=>Math.max(...poly.map(v=>v.q[i]))<=box.min[i]||Math.min(...poly.map(v=>v.q[i]))>=box.max[i]))return{parts:[poly],changed:false};let rest=poly,parts=[];for(let i=0;i<3;i++)for(const[v,sign]of[[box.min[i],1],[box.max[i],-1]]){const q=split(rest,i,v,sign);if(q.outside.length>=3)parts.push(q.outside);rest=q.inside;if(rest.length<3)return{parts:[poly],changed:false};}return{parts,changed:true};}
function cutRecord(r,fr,cuts){const v=r.g.v,triangles=[],g=new G.Geometry();let changed=false;
 for(let i=0;i<v.length;i+=24){let polys=[[]];for(let j=0;j<3;j++){const k=i+j*8,p=[v[k],v[k+1],v[k+2]],world=M.apply(r.m,[...p,1]).slice(0,3),n=[v[k+3],v[k+4],v[k+5]];polys[0].push({p,n,q:fr.local(world),uv:[v[k+6],v[k+7]]});}
  for(const box of cuts){const next=[];for(const p of polys){const q=difference(p,box);changed ||= q.changed;next.push(...q.parts);}polys=next;}
  triangles.push(...polys);
 }
 if(!changed)return null;
 for(const p of triangles)for(let j=1;j+1<p.length;j++){const t=[p[0],p[j],p[j+1]],a=M.sub(t[1].p,t[0].p),b=M.sub(t[2].p,t[0].p);if(Math.hypot(...M.cross(a,b))<1e-9)continue;for(const v of t)g.vertex(v.p,v.n,v.uv);}
 if(r.g.detailWidth)g.detailWidth=r.g.detailWidth;return g;
}

function facade(b,fr){const old=b.id;b.id=183;const key='science183-north258-box';
 const box=(tag,x,y,z,w,h,d,color,mat)=>b.mesh('science183-north258-'+tag,b.geo(key,G.box),x,y,z,w,h,d,color,mat);
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  const openings=groups.flatMap(a=>{const x=left+width*a.t;return(a.broad?[[.75,17.20]]:[[.75,11.80],[13.70,17.20]]).map(([lo,hi])=>({x,w:a.w,lo,hi,broad:a.broad}));});
  const xs=[region.min[0],region.max[0],...openings.flatMap(o=>[o.x-o.w/2,o.x+o.w/2])].sort((a,b)=>a-b).filter((x,i,a)=>!i||x-a[i-1]>1e-6);
  const ys=[.16,.75,11.80,13.70,17.20,19.36];
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){const x=(xs[i]+xs[i+1])/2,y=(ys[j]+ys[j+1])/2;if(openings.some(o=>Math.abs(x-o.x)<o.w/2&&y>o.lo&&y<o.hi))continue;box('masonry',x,y,1.82,xs[i+1]-xs[i],ys[j+1]-ys[j],.50,'#969b98',18);}
  for(const o of openings){const h=o.hi-o.lo,y=(o.lo+o.hi)/2;box('glass',o.x,y,1.655,o.w,h,.04,'#648b9b',28);
   for(const s of[-1,1]){box('jamb',o.x+s*(o.w/2-.035),y,1.875,.07,h,.44,'#506166',29);box('sill-head',o.x,y+s*(h/2-.035),1.875,o.w,.07,.44,'#506166',29);}
   // Only broad-strip horizontal divisions visible in the unobscured reference.
   if(o.broad){box('central-mullion',o.x,y,1.72,.05,h,.12,'#506166',29);for(const yy of[3.55,6.40,9.30,12.20])box('broad-transom',o.x,yy,1.72,o.w,.055,.12,'#506166',29);}
  }
 });}finally{b.id=old;}
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const old=b.e.add,records=[],fr=Y.ScienceTeaching183Details.frame();b.e.add=function(k,g,m,c,p,uv){records.push({k,g,m,c,p,uv});};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=old;}
 for(let i=0;i<records.length;i++){const r=records[i];
  // Existing entry beams use generic cylinder keys; preserve them as well as
  // named entry parts. Low stone slabs are support, not facade window targets.
  const entry=(r.k.startsWith('s183-')&&!r.k.startsWith('s183-cut-'))||r.p[0]===29;
  let lowStone=false;if(r.p[0]===10){let top=-Infinity;for(let j=0;j<r.g.v.length;j+=8)top=Math.max(top,M.apply(r.m,[r.g.v[j],r.g.v[j+1],r.g.v[j+2],1])[1]);lowStone=top<.75;}
  const fixture=r.p[0]===9&&!r.k.includes('recessFrame');
  const g=entry||lowStone||fixture?null:cutRecord(r,fr,[region]);if(g){if(g.v.length)old.call(b.e,'science183-north258-cut-'+i,g,r.m,r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
 facade(b,fr);return result;
};
Y.Science183North258={region,groups,left,width};
})(YY);
