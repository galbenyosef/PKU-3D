/* The two published western-front photographs support a recessed glazed top
 * and broad eaves, with south window axes fitted after vertical-vanishing correction.
 * Unknown far-end group count/rear fenestration are not extrapolated. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/444991872';
const L={brickTop:19.36,glassTop:22.75,roofTop:23.05,south:{start:4.20,end:46.87,slope:-.009664,column:4.07014151,front:1.92405849},north:{start:-24.33,end:-4.07,slope:.00051612,column:-24.33265,front:2.00650553},southFar:46.87,bays:[11.2, 15.5, 19.9, 24.3, 29.0, 34.2, 40.1],slit:7.3,southWindowEnd:41.50};
const cuts=[{min:[4.20,.16,.85],max:[41.50,19.36,2.50]},{min:[-24.50,19.36,-.65],max:[-4.00,23.2,3.20]},{min:[4.00,19.36,.15],max:[46.95,23.2,3.20]}];
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

function additions(b,fr){const old=b.id;b.id=183;
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  const box=(field,tag,u,y,offset,w,h,d,c,mat=29)=>{const v=field.front+field.slope*(u-field.column)+offset;b.mesh('science183-west259-'+tag,b.geo('science183-west259-box',G.box),u,y,v,w,h,d,c,mat,0,-Math.atan(field.slope));};
  const f=L.south,openings=[{x:L.slit,w:.63,lo:.75,hi:17.2,narrow:true},...L.bays.flatMap(x=>[{x,w:2.75,lo:.75,hi:11.8},{x,w:2.75,lo:13.7,hi:17.2}])];
  const xs=[f.start,L.southWindowEnd,...openings.flatMap(o=>[o.x-o.w/2,o.x+o.w/2])].sort((a,b)=>a-b).filter((x,i,a)=>!i||x-a[i-1]>1e-6),ys=[.16,.75,11.8,13.7,17.2,19.36];
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){const x=(xs[i]+xs[i+1])/2,y=(ys[j]+ys[j+1])/2;if(openings.some(o=>Math.abs(x-o.x)<o.w/2&&y>o.lo&&y<o.hi))continue;box(f,'south-wall',x,y,-.18,xs[i+1]-xs[i],ys[j+1]-ys[j],.50,'#969b98',18);}
  for(const o of openings){const h=o.hi-o.lo,y=(o.hi+o.lo)/2;box(f,'south-glass',o.x,y,-.345,o.w,h,.04,'#648b9b',28);for(const s of[-1,1]){box(f,'south-jamb',o.x+s*(o.w/2-.035),y,-.125,.07,h,.44,'#506166');box(f,'south-head-sill',o.x,y+s*(h/2-.035),-.125,o.w,.07,.44,'#506166');}
   if(!o.narrow){box(f,'south-mullion',o.x,y,-.28,.055,h,.12,'#506166');if(o.lo<1)for(const yy of[3.55,6.40,9.30])box(f,'south-transom',o.x,yy,-.28,o.w,.055,.12,'#506166');}
  }
  for(const side of['north','south']){const f=L[side],a=f.start,z=side==='south'?L.southFar:f.end,w=z-a,mid=(a+z)/2;
   // The visible front roof strip is closed at its plain rear. No hidden
   // side/back window rows or whole-building upper plan are invented.
   box(f,side+'-upper-floor',mid,19.445,-1.30,w,.17,3.0,'#c3c4b8',24);
   box(f,side+'-upper-glass',mid,21.055,-1.25,w-.50,3.39,.08,'#648b9b',28);
   box(f,side+'-upper-back',mid,21.055,-2.77,w,3.39,.16,'#a4aaa3',18);
   for(const x of[a+.13,z-.13])box(f,side+'-upper-end',x,21.055,-2.01,.26,3.39,1.52,'#b9bdb2',24);
   box(f,side+'-eave',mid,22.88,-.77,w+1.2,.26,4.10,'#d5d6c8',24);
   box(f,side+'-eave-edge',mid,23.005,1.24,w+1.24,.07,.10,'#79857e',29);
   // Front photograph confirms two northern six-light bays and the first
   // southern bay; tree-obscured southern grids remain unasserted.
   const supports=side==='north'?[a+.5,-15.50,-6.50,z-.18]:[4.70,13.034,21.368,29.702,38.036,46.37];
   for(const x of supports)box(f,side+'-upper-post',x,21.055,-1.02,.28,3.39,.44,'#d1d0bd',24);
   for(const y of[19.55,21.70,22.70])box(f,side+'-upper-transom',mid,y,-1.19,w-.50,.065,.10,'#506166',29);
   for(let span=0;span<(side==='north'?2:1);span++){const l=supports[span],r=supports[span+1];for(let j=1;j<6;j++)box(f,side+'-upper-six-light-mullion',l+(r-l)*j/6,21.12,-1.19,.052,3.22,.10,'#506166',29);}

  }
 });}finally{b.id=old;}
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const old=b.e.add,rows=[],fr=Y.ScienceTeaching183Details.frame();b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=old;}
 for(let i=0;i<rows.length;i++){const r=rows[i],entry=(r.k.startsWith('s183-')&&!r.k.startsWith('s183-cut-'))||(r.k.startsWith('science183-north258-')&&!r.k.startsWith('science183-north258-cut-'))||r.p[0]===29,fixture=r.p[0]===9&&((r.c==='#68706a'&&r.k.endsWith('cyl8_1'))||(r.c==='#7d847e'&&r.k.endsWith('box')));let lowStone=false;if(r.p[0]===10){let top=-Infinity;for(let j=0;j<r.g.v.length;j+=8)top=Math.max(top,M.apply(r.m,[r.g.v[j],r.g.v[j+1],r.g.v[j+2],1])[1]);lowStone=top<.75;}const g=entry||fixture||lowStone?null:cutRecord(r,fr,cuts);if(g){if(g.v.length)old.call(b.e,'science183-west259-cut-'+i,g,r.m,r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}
 additions(b,fr);return {...result,westUpper259:true};
};
const feature=Y.CAMPUS?.features.find(f=>f.properties.id===ID);if(feature){const p=feature.properties,fr=Y.ScienceTeaching183Details.frame(),points=[-25,48].flatMap(u=>[-1.5,6].map(v=>fr.world(u,0,v))),xs=points.map(p=>p[0]),zs=points.map(p=>p[2]),front=[Math.min(...xs),0,Math.min(...zs),Math.max(...xs),23.2,Math.max(...zs)];
 p.modelEnvelopeHeight=23.2;p.heightSource='西立面退进顶层与挑檐高度按公开照片比例拟合，未实测；原主体适配参数保留';p.displayBounds46=[Math.min(p.bounds[0]-.5,front[0]),0,Math.min(p.bounds[1]-.5,front[2]),Math.max(p.bounds[2]+.5,front[3]),23.2,Math.max(p.bounds[3]+.5,front[5])];
 p.architecture.summary='西侧竖窗、退进玻璃顶层、大挑檐与中央玻璃门廊。';p.scopeNote='西侧可见窗组、退进顶层和挑檐按公开照片比例拟合，未实测；长南翼末端窗组及未知侧背面仍待核。';
 p.frontObservation46={target:fr.world(11.5,11.5,1),bounds:front,yaw:fr.r,elevation:.15};
 // Keep p.height and ARCHIVE unchanged: both still govern original fitting.
}
Y.Science183West259={layout:L,cuts};
})(YY);
