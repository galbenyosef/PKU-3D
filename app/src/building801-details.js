/* Yannan 66 side-arcade stone stair: published front/right photograph, fitted dimensions. */
(function(Y){'use strict';
 const A=Y.Architecture30,base=A.render;
 A.render=function(b,f,add){
  const result=base.call(this,b,f,add);
  if(f.properties.pickId!==801||f.properties.id!=='manual/yannan-66'||result.source!==866)return result;
  const p=Y.ARCHIVE.legacy['866'],w=(p.modelSize?.[0]||p.w*2.5)*p.heritageModel.bodyScale[0],d=(p.modelSize?.[1]||p.d*2.5)*p.heritageModel.bodyScale[1];
  // The symmetric source roof is centred at (0,0). Reuse the exact fitted source
  // frame; steps may extend outside the building outline, without moving it.
  const root=Y.M.transform([result.frame.centre[0],0,result.frame.centre[1]],result.scale,result.frame.r);
  const geo=Y.Geo.box(),count=3,run=1.08,width=2.10,edge=w/2+.175,z=d/2-1.30;
  for(let i=0;i<count;i++){
   const length=run*(count-i)/count,height=.46*(i+1)/count;
   const m=Y.M.multiply(root,Y.M.transform([edge+length/2,height/2,z],[length,height,width],0));
   b.e.add('building801-side-arcade-step',geo,m,'#b3b4a9',[10,801,0,.20]);
  }
  // Adapter clips the original solid room boxes to the mapped polygon, but
  // triangle clipping does not create the newly exposed vertical cut faces.
  // Close only those exact body cuts, keeping the ground-floor loggia open.
  const inverse=Y.M.inverse(root),rings=Y.Footprints.polygons(f.geometry).flatMap(poly=>poly);
  const walls=[{z0:-d/2,z1:d/2-2.6,y0:.46,y1:4.21,part:.6},{z0:-d/2,z1:d/2,y0:4.21,y1:8.26,part:1.15}];
  walls.forEach((wall,level)=>{
   const cap=new Y.Geo.Geometry();
   for(const ring of rings)for(let i=1;i<ring.length;i++){
    const a=Y.M.apply(inverse,[ring[i-1][0],0,ring[i-1][1],1]),q=Y.M.apply(inverse,[ring[i][0],0,ring[i][1],1]);
    let lo=0,hi=1;const dx=q[0]-a[0],dz=q[2]-a[2];
    for(const [start,delta,min,max]of[[a[0],dx,-w/2,w/2],[a[2],dz,wall.z0,wall.z1]]){
     if(Math.abs(delta)<1e-9){if(start<=min+1e-6||start>=max-1e-6){lo=1;hi=0;break;}}
     else{const t0=(min-start)/delta,t1=(max-start)/delta;lo=Math.max(lo,Math.min(t0,t1));hi=Math.min(hi,Math.max(t0,t1));}
    }
    if(hi-lo<1e-6)continue;
    const at=(t,y)=>Y.M.apply(root,[a[0]+dx*t,y,a[2]+dz*t,1]).slice(0,3);
    const p0=at(lo,wall.y0),p1=at(hi,wall.y0),p2=at(hi,wall.y1),p3=at(lo,wall.y1);
    const ex=p1[0]-p0[0],ez=p1[2]-p0[2],length=Math.hypot(ex,ez);
    // Initial winding faces [-ez,0,ex]. Reverse when that points indoors.
    const face=[p0,p1,p2,p3];if(Y.Footprints.inside([(p0[0]+p1[0])/2-ez/length*.003,(p0[2]+p1[2])/2+ex/length*.003],f.geometry))face.reverse();
    cap.quad(...face);
   }
   if(cap.v.length)b.e.add('building801-room-cut-wall-'+level,cap,Y.M.identity(),'#a4a49b',[18,801,0,wall.part]);
  });
  return result;
 };
})(YY);
