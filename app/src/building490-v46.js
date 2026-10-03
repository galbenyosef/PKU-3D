/* 33/34 courtyard bicycle shelter: connect existing posts to the unchanged sampled roof. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/1101754968',F=Y.Footprints,M=Y.M,G=Y.Geo;
 function roofEnds(roof,geometry,base){
  const out=new G.Geometry(),edges=F.polygons(geometry).flat().flatMap(r=>r.slice(1).map((q,k)=>{const p=r[k],dx=q[0]-p[0],dz=q[1]-p[1],ll=dx*dx+dz*dz;return {p,q,dx,dz,ll,count:Math.max(1,Math.ceil(Math.sqrt(ll)/1.5))};})),seen=new Set();
  for(let i=0;i<roof.v.length;i+=24)for(let j=0;j<3;j++){
   let a=roof.v.slice(i+j*8,i+j*8+3),b=roof.v.slice(i+(j+1)%3*8,i+(j+1)%3*8+3);
   const e=edges.find(e=>F.distSegment([a[0],a[2]],e.p,e.q)<1e-7&&F.distSegment([b[0],b[2]],e.p,e.q)<1e-7);if(!e)continue;
   const key=[a,b].map(p=>p.map(x=>x.toFixed(7)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);
   const at=p=>((p[0]-e.p[0])*e.dx+(p[2]-e.p[1])*e.dz)/e.ll;
   if(at(a)>at(b))[a,b]=[b,a];const lo=at(a),hi=at(b);if(hi-lo<1e-10||Math.max(a[1],b[1])<=base+1e-7)continue;
   // Retain the original per-1.5m-segment UV repeats. Split at both original
   // UV seams and actual roof edges; this never subdivides or moves the roof.
   const cuts=[lo];for(let k=1;k<e.count;k++){const t=k/e.count;if(t>lo+1e-10&&t<hi-1e-10)cuts.push(t);}cuts.push(hi);
   for(let k=1;k<cuts.length;k++){
    const l=cuts[k-1],h=cuts[k],tile=Math.min(e.count-1,Math.floor((l+h)*.5*e.count));
    const top=t=>[e.p[0]+e.dx*t,a[1]+(b[1]-a[1])*(t-lo)/(hi-lo),e.p[1]+e.dz*t],aa=top(l),bb=top(h);
    const ps=[[aa[0],base,aa[2]],[bb[0],base,bb[2]],bb,aa],u=t=>Math.max(0,Math.min(1,t*e.count-tile)),uv=[[u(l),0],[u(h),0],[u(h),1],[u(l),1]];
    const n=M.norm(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))),mid=[(aa[0]+bb[0])/2,(aa[2]+bb[2])/2];
    if(F.inside([mid[0]+n[0]*.003,mid[1]+n[2]*.003],geometry)){ps.reverse();uv.reverse();}
    for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(k=>ps[k]);if(Math.hypot(...M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0])))>1e-9)out.tri(...t,ids.map(k=>uv[k]));}
   }
  }return out;
 }
function bary(t,x,z){const[a,b,c]=t,d=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);if(Math.abs(d)<1e-14)return null;const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/d,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/d;return[u,v,1-u-v];}
function height(t,p){const w=bary(t,...p);return w.reduce((y,v,i)=>y+v*t[i][1],0);}
function segment(t,a,b){const u=bary(t,...a),v=bary(t,...b);if(!u)return null;let lo=0,hi=1;for(let k=0;k<3;k++){if(u[k]<0&&v[k]<0)return null;if(u[k]<0)lo=Math.max(lo,u[k]/(u[k]-v[k]));else if(v[k]<0)hi=Math.min(hi,u[k]/(u[k]-v[k]));}return hi-lo>1e-9?[lo,hi]:null;}
function connections(posts,roof){const meshes=[];for(const p of posts){const out=new Y.Geo.Geometry();const x0=Math.fround(p.x-p.w/2),x1=Math.fround(p.x+p.w/2),z0=Math.fround(p.z-p.d/2),z1=Math.fround(p.z+p.d/2),ring=[[x0,z0],[x0,z1],[x1,z1],[x1,z0]],base=p.top-.004;
 for(let edge=0;edge<4;edge++){const a=ring[edge],b=ring[(edge+1)%4],at=t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],spans=[];for(const tri of roof){const s=segment(tri,a,b);if(s)spans.push({lo:s[0],hi:s[1],tri});}const cuts=[0,1,...spans.flatMap(s=>[s.lo,s.hi])].sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>1e-8),len=Math.hypot(b[0]-a[0],b[1]-a[1]);
 for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2,s=spans.find(s=>mid>=s.lo-1e-9&&mid<=s.hi+1e-9);if(!s)throw Error('490 support extends beyond retained roof');const q=at(lo).map(Math.fround),r=at(hi).map(Math.fround);if(q[0]===r[0]&&q[1]===r[1])continue;const yq=height(s.tri,q),yr=height(s.tri,r);if(Math.min(yq,yr)<p.top-1e-5)throw Error('490 roof below retained post');const pa=[q[0],base,q[1]],pb=[r[0],base,r[1]],pc=[r[0],yr,r[1]],pd=[q[0],yq,q[1]],u0=lo*len,u1=hi*len;out.tri(pa,pb,pc,[[u0,0],[u1,0],[u1,yr-base]]);out.tri(pa,pc,pd,[[u0,0],[u1,yr-base],[u0,yq-base]]);}
 }
 // Material29 uses position-derived metricUV; retain the original post centre
 // so the added metal shares its grain phase instead of world-coordinate noise.
 for(let i=0;i<out.v.length;i+=8){out.v[i]-=p.x;out.v[i+1]-=p.centerY;out.v[i+2]-=p.z;}meshes.push({mesh:out,center:[p.x,p.centerY,p.z]});}return meshes;}
function render(b,f,add){const posts=[],roof=[],old=b.e.add;let result,roofGeometry;b.e.add=function(key,g,m,color,params,uv){if(params[1]===490&&key==='box'&&params[0]===29&&Math.abs(m[0]-.18)<1e-6&&Math.abs(m[10]-.18)<1e-6&&m[5]>2){posts.push({x:m[12],z:m[14],w:m[0],d:m[10],top:m[13]+m[5]/2,centerY:m[13]});}return old.call(this,key,g,m,color,params,uv)};
 try{result=A.footprint(b,f,(key,g,color,mat,id)=>{if(key.startsWith('v30-arched-roof-490-')){roofGeometry=g;const v=new Float32Array(g.v);for(let i=0;i<v.length;i+=24)roof.push([0,8,16].map(k=>Array.from(v.subarray(i+k,i+k+3))));}if(key.startsWith('v30-roof-ends-490-')&&roofGeometry){let base=Infinity;for(let i=1;i<g.v.length;i+=8)base=Math.min(base,g.v[i]);g=roofEnds(roofGeometry,f.geometry,base);}return add(key,g,color,mat,id)});}finally{b.e.add=old;}
 if(posts.length!==18||!roof.length)throw Error('490 retained canopy inputs changed; review support contacts');const meshes=connections(posts,roof);for(let i=0;i<meshes.length;i++){const {mesh,center}=meshes[i];b.e.add('490-post-roof-continuation-'+i,mesh,Y.M.transform(center,[1,1,1],0),'#788e86',[29,f.properties.pickId,0,0]);}return{...result,postRoofConnections:posts.length};}
Y.Building490={id:ID,render,connections,roofEnds};A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add)};
})(YY);
