/* Southwest gate display-fit returns: dated registered street views establish
 * a stone wall in front of the booth and the dogleg entry. Dimensions fitted. */
(function(Y){'use strict';
 const P=Y.Perimeter335,previous=P.renderConnections;
 function plan(D,runs){
  const gate=D.features.find(f=>f.properties.id==='node/2485149510');if(!gate)return [];
  const p=gate.geometry.coordinates,r=Y.Gate763Details.frame(gate),at=(x,z)=>[p[0]+x*Math.cos(r)+z*Math.sin(r),p[1]-x*Math.sin(r)+z*Math.cos(r)];
  const ends=runs.filter(s=>s.campus).flatMap(s=>[s.a,s.c]);
  const nearest=(q,accept)=>ends.filter(accept).sort((a,b)=>Math.hypot(a[0]-q[0],a[1]-q[1])-Math.hypot(b[0]-q[0],b[1]-q[1]))[0];
  const west=nearest([-386,611],q=>q[0]<-383&&q[1]<611.1&&q[1]>605),east=nearest([-377.6,622.8],q=>q[0]>-378&&q[0]<-370&&q[1]>620&&q[1]<624);
  if(!west||!east)return [];
  // Keep the front wall outside the existing booth and north of the mapped
  // west-turning approach; no straight diagonal across the public side lane.
  const paths=[['southwest-street-return',[west,[-387.10,615.75],[-386.45,620.90],[-384.65,621.50],at(-1.63,1.92)]],['southwest-east-return',[east,[-380.05,622.80],at(1.64,2.325)]]];
  return paths.flatMap(([name,pts])=>pts.slice(1).map((c,i)=>({name:name+'-'+i,a:pts[i],c,style:'rubble'})));
 }
 P.renderConnections=function(b,D,runs){previous.call(this,b,D,runs);const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[0,0,0];b.rotation=0;b.id=0;b.anim=0;
  try{for(const s of plan(D,runs)){
   const dx=s.c[0]-s.a[0],dz=s.c[1]-s.a[1],len=Math.hypot(dx,dz),r=Math.atan2(-dz,dx),n=Math.ceil(len/2.4);
   // Preserve the neighbouring 2.4m relief scale along longer return paths.
   for(let i=0;i<n;i++){const a=[s.a[0]+dx*i/n,s.a[1]+dz*i/n],c=[s.a[0]+dx*(i+1)/n,s.a[1]+dz*(i+1)/n];
    b.local((a[0]+c[0])/2,.16,(a[1]+c[1])/2,r,()=>P.rubble(b,len/n,{...s,a,c}));}
  }}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 };
 Y.Perimeter337Southwest={plan};
})(YY);
