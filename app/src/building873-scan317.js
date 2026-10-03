/* 873: local north facade and lift fitted to current mapped wall.
 * Tile 00010302 and east-neighbor 00010320 establish east-end to shaft axis
 * distance ~21.2m. No campus shift; absolute scan/map residual is ~3.5m.
 * Five rows apply only to the observed 17.2m segment; door/steps unresolved. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
function frame(f){const a=f.geometry.coordinates[0][0],c=f.geometry.coordinates[0][1],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(a[0]-c[0])/len,uz=(a[1]-c[1])/len,nx=-uz,nz=ux,origin=c;return {origin,r:Math.atan2(nx,nz),local:p=>[(p[0]-origin[0])*ux+(p[2]-origin[1])*uz,p[1],(p[0]-origin[0])*nx+(p[2]-origin[1])*nz]};}
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

// Generic dorm piers are emitted once per floor. The replaced facade removes
// their whole 0..15m profile; a 14.99m wall cut alone leaves 1cm top fragments.
// Match only the original narrow pale pier signature fully inside this segment.
function displacedPier(r,fr){
 if(r.k!=='box'||r.c!=='#e4e3d8'||r.p[0]!==24)return false;
 const ps=[];for(let i=0;i<r.g.v.length;i+=8)ps.push(fr.local(M.apply(r.m,[...r.g.v.slice(i,i+3),1])));
 const bb=[0,1,2].map(k=>[Math.min(...ps.map(p=>p[k])),Math.max(...ps.map(p=>p[k]))]);
 return bb[0][0]>9.25&&bb[0][1]<26.43&&Math.abs(bb[0][1]-bb[0][0]-.25)<.0001&&Math.abs(bb[1][0])<.0001&&Math.abs(bb[1][1]-15)<.0001&&Math.abs(bb[2][0]+.155)<.0001&&Math.abs(bb[2][1]-.185)<.0001;
}
function detail(b,fr){const old=b.e.add,id=b.id;b.id=873;b.e.add=function(k,...args){return old.call(this,'building873-scan317-'+k,...args);};try{b.local(fr.origin[0],0,fr.origin[1],fr.r,()=>{
 const lo=9.25,hi=26.43,H=15,shaft=21.2,depth=3.8;
 b.box((lo+hi)/2,H/2,-.06,hi-lo,H,.16,'#d1d0c7',24);
 // Brick spandrels between five visible window rows, fitted to retained height.
 for(let j=0;j<5;j++){const y=.35+j*2.93;b.box((lo+hi)/2,y+.43,.035,hi-lo,.86,.12,'#975d49',18);}
 // Observed pairs around the shaft. Widths are display fits to scan image.
 const wins=[[10.6,1.45],[12.35,.70],[14.35,1.35],[16.3,.72],[17.9,1.28],[24.05,1.3],[25.65,.66]];
 for(let j=0;j<5;j++)for(const[u,w]of wins){const y=1.92+j*2.93;b.window(u,y,.055,w,1.65,0,'#bcc4c0');}
 for(const s of[-1,1])b.box(shaft+s*1.43,7.71,depth/2,.64,15.42,depth,'#c4c4bf',24);
 b.box(shaft,7.71,depth-.07,2.22,15.26,.10,'#26373a',28);
 for(const x of[-1.11,1.11])b.box(shaft+x,7.71,depth+.01,.075,15.42,.10,'#8e9997',29);
 for(const y of[.7,1.65,3.05,4.55,6,7.5,9,10.5,12,13.5])b.box(shaft,y,depth+.025,2.22,.06,.11,'#8e9997',29);
 b.box(shaft,15.49,depth/2,3.66,.20,depth+.20,'#b1a59c',24);
 });}finally{b.id=id;b.e.add=old;}}
A.render=function(b,f,add){if(f.properties.pickId!==873||f.properties.id!=='way/849765896')return previous.call(this,b,f,add);const old=b.e.add,rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=old;}const fr=frame(f),cuts=[{min:[9.25,.001,-.5],max:[26.43,14.99,.8]}];let changed=0,removedPiers=0;for(let i=0;i<rows.length;i++){const r=rows[i];if(displacedPier(r,fr)){removedPiers++;continue;}const g=cutRecord(r,fr,cuts);if(g){changed++;if(g.v.length)old.call(b.e,'building873-scan317-cut-'+i,g,M.identity(),r.c,r.p,r.uv);}else old.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);}detail(b,fr);return {...result,scan873LocalFitted:true,scan873CutRecords:changed,scan873RemovedReplacedPiers:removedPiers,scan873WholeBuildingFloorsUnverified:true,scan873DoorUnverified:true};};
Y.Building873Scan317={frame,scope:{eastEndToAxis:21.2,depth:3.8,glassWidth:2.22,facadeRange:[9.25,26.43],rows:5,registration:'local wall and east-end display fit, not surveyed'}};
})(YY);
