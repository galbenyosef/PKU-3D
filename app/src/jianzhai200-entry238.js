/* East stair registration candidate. Photo proportions are not survey dimensions.
 * Keep this draft out of delivery until the adjoining facade is replaced. */
(function(Y){'use strict';
 const previous=Y.Architecture30.render,M=Y.M;
 const registration=Object.freeze({pickId:200,sourceX:26,sourceZ:9,base:.12});
 function pavement(points,width){
  const g=Y.Geo.ribbon(points,width,.122),top=g.v.slice(),edges=new Map();
  const tag=p=>p.map(x=>x.toFixed(7)).join(',');
  for(let i=0;i<top.length;i+=24){const tri=[0,8,16].map(k=>top.slice(i+k,i+k+3));g.tri(...tri.map(p=>[p[0],0,p[2]]).reverse());for(let j=0;j<3;j++){const a=tri[j],z=tri[(j+1)%3],key=[tag(a),tag(z)].sort().join('|');if(edges.has(key))edges.delete(key);else edges.set(key,[a,z]);}}
  for(const [a,z]of edges.values())g.quad(z,a,[a[0],0,a[2]],[z[0],0,z[2]]);
  return g;
 }
 function approaches(root,door,n){
  const S=Y.JianStair238.fit,foot=[door[0]+n[0]*(S.landing+S.run),door[2]+n[1]*(S.landing+S.run)];
  const road=Y.CAMPUS.features.find(f=>f.properties.id==='way/240832225');if(!road)throw Error('Jian approach road missing');
  let nearest=null;const pts=road.geometry.coordinates;
  for(let i=1;i<pts.length;i++){const a=pts[i-1],z=pts[i],v=[z[0]-a[0],z[1]-a[1]],t=Math.max(0,Math.min(1,((foot[0]-a[0])*v[0]+(foot[1]-a[1])*v[1])/(v[0]*v[0]+v[1]*v[1]))),q=[a[0]+t*v[0],a[1]+t*v[1]],dist=Math.hypot(q[0]-foot[0],q[1]-foot[1]);if(!nearest||dist<nearest.dist)nearest={q,dist};}
  const unit=nearest.q.map((v,i)=>(foot[i]-v)/nearest.dist),end=nearest.q.map((v,i)=>v+unit[i]*road.properties.width/2);
  const low=M.apply(root,[Y.JianFacade238.H.lowX,0,registration.sourceZ,1]);
  // Only topology is established by the photograph. The short approach curves
  // and widths are explicit display fits tied to the unchanged mapped road.
  return {main:[foot,[(foot[0]+end[0])/2+.5,(foot[1]+end[1])/2],end],low:[[low[0]+n[0]*.18,low[2]+n[1]*.18],[low[0]+n[0]*2.2,low[2]+n[1]*2.2],[foot[0],foot[1]+.5]],roadId:road.properties.id};
 }
 Y.Architecture30.render=function(b,f,add){
  const result=previous.call(this,b,f,add);
  if(f.properties.pickId!==registration.pickId)return result;
  // The unchanged source frame was measured from the actual original adapter
  // stream. New exterior geometry is emitted afterwards, so it cannot alter
  // the adapter bounds, roof scale or footprint clipping of the old building.
  if(result.strategy!=='jian'||!result.frame||!result.scale)throw Error('Jian stair source frame changed');
  const observed=[result.frame.r,...result.frame.centre,...result.scale],expected=[.09927785542711298,-52.848,-278.8075,.6212800346295095,1.0068476066617453,.34012399434419577];
  if(observed.some((v,i)=>Math.abs(v-expected[i])>1e-8))throw Error('Jian stair registration requires review after source-frame drift');
  const root=new Float32Array([.618220865726471,0,-.06157808005809784,0,0,1.006847620010376,0,0,.03371134027838707,0,.3384492099285126,0,-52.88318634033203,0,-279.1607666015625,1]);
  const door=M.apply(root,[registration.sourceX,0,registration.sourceZ,1]);
  const angle=result.frame.r,n=[Math.sin(angle),Math.cos(angle)],landing=Y.JianStair238.fit.landing;
  const id=b.id;b.id=registration.pickId;
  try{const paths=approaches(root,door,n);for(const key of['main','low'])b.e.add('jian238-approach-'+key,pavement(paths[key],key==='main'?1.65:1.40),M.identity(),'#c3bfaf',[7,registration.pickId,0,.1]);b.local(door[0]+n[0]*landing,registration.base,door[2]+n[1]*landing,angle,()=>Y.JianStair238.build(b));}finally{b.id=id;}
  return {...result,entry238:'draft-awaiting-facade-and-route-review'};
 };
 Y.JianEntry238={registration,approaches,pavement};
})(YY);
