/* Preserve the mapped lake and bridge channel union; remove only coplanar overlap. */
(function(Y){'use strict';
 const F=Y.Footprints,L=Y.Landscape42,original=L.ground,EPS=1e-8;
 function difference(channel,lake){
  const points=F.flat(channel.coordinates),xs=points.map(p=>p[0]),zs=points.map(p=>p[1]);
  const left=Math.min(...xs),right=Math.max(...xs),low=Math.min(...zs),high=Math.max(...zs);
  const edges=F.polygons(lake).flatMap(pg=>pg.flatMap(r=>r.slice(1).map((p,i)=>[r[i],p]))).filter(([a,b])=>Math.abs(a[1]-b[1])>EPS);
  const xAt=(e,z)=>e[0][0]+(e[1][0]-e[0][0])*(z-e[0][1])/(e[1][1]-e[0][1]);
  // Lake vertex levels match the native water tessellation. Add rectangle crossings
  // so no slab can swap an edge with either channel side within its interior.
  const cuts=[low,high];
  for(const [a,b] of edges){for(const p of [a,b])if(p[1]>low&&p[1]<high)cuts.push(p[1]);if(Math.abs(b[0]-a[0])>EPS)for(const x of [left,right]){const t=(x-a[0])/(b[0]-a[0]),z=a[1]+t*(b[1]-a[1]);if(t>0&&t<1&&z>low&&z<high)cuts.push(z);}}
  const levels=[...new Set(cuts)].sort((a,b)=>a-b),mesh=new Y.Geo.Geometry();
  for(let i=1;i<levels.length;i++){
   const lo=levels[i-1],hi=levels[i],mid=(lo+hi)/2;if(hi-lo<EPS)continue;
   const active=edges.filter(([a,b])=>Math.min(a[1],b[1])<mid&&Math.max(a[1],b[1])>mid).filter(e=>xAt(e,mid)>left&&xAt(e,mid)<right);
   active.push([[left,low],[left,high]],[[right,low],[right,high]]);active.sort((a,b)=>xAt(a,mid)-xAt(b,mid));
   for(let j=1;j<active.length;j++){
    const a=active[j-1],b=active[j],x=(xAt(a,mid)+xAt(b,mid))/2;if(F.inside([x,mid],lake))continue;
    const p=[[xAt(a,lo),lo],[xAt(b,lo),lo],[xAt(b,hi),hi],[xAt(a,hi),hi]];
    for(const t of [[p[0],p[2],p[1]],[p[0],p[3],p[2]]])if(Math.abs(F.area([...t,t[0]]))>EPS)mesh.tri(...t.map(q=>[q[0],.5,q[1]]));
   }
  }
  return mesh;
 }
 L.ground=function(b,add){
  const lake=Y.CAMPUS.features.find(f=>f.properties.pickId===252&&f.properties.id==='way/838526031');
  if(!lake)return original.call(this,b,add);
  return original.call(this,b,(key,g,color,mat,id)=>add(key,key==='island42-water-under-bridge'&&id===252&&mat===4?difference(L.channel,lake.geometry):g,color,mat,id));
 };
})(YY);
