/* Source-geometry repair for Yannan64's existing row-house fit.
 * Actual entrance style, precise footprint and facade remain unresolved. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,G=Y.Geo;
 function gable(original,roofDepth,wallDepth,rise,left){
  const out=new G.Geometry();
  // Preserve the original face and UVs; renderer already draws both sides.
  out.v.push(...original.v);
  for(const [lo,hi]of[[-.5,0],[0,.5]]){
   const lower=z=>[0,1-2*Math.abs(z),z],upper=z=>[0,.09/rise+1-2*Math.abs(z)*wallDepth/roofDepth,z];
   const points=[lower(lo),lower(hi),upper(hi),upper(lo)],uv=points.map(p=>[p[2]+.5,p[1]]);
   // The strip above is wound toward -X before reversal.
   if(!left){points.reverse();uv.reverse();}
   out.tri(points[0],points[1],points[2],[uv[0],uv[1],uv[2]]);out.tri(points[0],points[2],points[3],[uv[0],uv[2],uv[3]]);
  }return out;
 }
 A.render=function(b,f,add){
  if(f.properties.pickId!==803||f.properties.id!=='manual/yannan-64')return previous.call(this,b,f,add);
  const oldRoof=b.heritageRoof,own=Object.hasOwn(b,'heritageRoof');
  b.heritageRoof=function(x,y,z,w,d,h,...rest){
   const oldMesh=this.mesh,meshOwn=Object.hasOwn(this,'mesh');
   this.mesh=function(k,g,xx,yy,zz,sx,sy,sz,...args){
    if(k==='heritage-gable-wall'){const left=xx<0;g=gable(g,d,sz,h,left);k='yannan803-gable-joint-'+(left?'west':'east')+'-'+d+'-'+h;}
    return oldMesh.call(this,k,g,xx,yy,zz,sx,sy,sz,...args);
   };
   try{return oldRoof.call(this,x,y,z,w,d,h,...rest);}finally{if(meshOwn)this.mesh=oldMesh;else delete this.mesh;}
  };
  const oldWindow=b.heritageWindow,windowOwn=Object.hasOwn(b,'heritageWindow');
  b.heritageWindow=function(x,y,z,w,h,r=0,...rest){
   if(r!==0||z<0||Math.abs(x)>2)return oldWindow.call(this,x,y,z,w,h,r,...rest);
   const oldMesh=this.mesh,meshOwn=Object.hasOwn(this,'mesh');
   this.mesh=function(k,g,xx,yy,zz,sx,sy,sz,...args){
    const centre=this.world([xx,yy,zz]),side=x<0?-1:1,cut=(side*.745-centre[0])/sx;
    if(k==='box'&&side*(centre[0]-side*sx/2)<.745){g=trimBox(g,cut,side);if(!g.v.length)return;k='yannan803-window-trim-'+side+'-'+cut;}
    return oldMesh.call(this,k,g,xx,yy,zz,sx,sy,sz,...args);
   };
   try{return oldWindow.call(this,x,y,z,w,h,r,...rest);}finally{if(meshOwn)this.mesh=oldMesh;else delete this.mesh;}
  };
  const adapter=Y.ArchitectureAdapter,oldRender=adapter.render,records=[];
  adapter.render=function(builder,feature,method,source,options){
   const wrapped=(bb,p,w,d)=>{const emit=bb.e.add;bb.e.add=function(k,g,m,c,params,uv){records.push({k,g,m:Array.from(m),c,p:Array.from(params),uv});return emit.call(this,k,g,m,c,params,uv);};
    try{return typeof method==='function'?method(bb,p,w,d):bb[method](p,w,d);}finally{bb.e.add=emit;}};
   return oldRender.call(this,builder,feature,wrapped,source,options);
  };
  try{const result=previous.call(this,b,f,add);closeBodyCuts(b,f,result,records);return result;}finally{adapter.render=oldRender;if(windowOwn)b.heritageWindow=oldWindow;else delete b.heritageWindow;if(own)b.heritageRoof=oldRoof;else delete b.heritageRoof;}
 };
 function trimBox(original,cut,side){
  const out=new G.Geometry();
  for(let i=0;i<original.v.length;i+=24){const input=[0,8,16].map(k=>original.v.slice(i+k,i+k+8)),poly=[];
   for(let j=0;j<3;j++){const p=input[j],q=input[(j+1)%3],dp=side*(p[0]-cut),dq=side*(q[0]-cut);if(dp>=0)poly.push(p);if((dp>=0)!==(dq>=0)){const t=dp/(dp-dq);poly.push(p.map((v,k)=>v+(q[k]-v)*t));}}
   for(let j=1;j<poly.length-1;j++)for(const v of[poly[0],poly[j],poly[j+1]])out.v.push(...v);
  }
  if(cut>-.5&&cut<.5){const points=[[cut,-.5,-.5],[cut,-.5,.5],[cut,.5,.5],[cut,.5,-.5]];if(side<0)points.reverse();const uv=points.map(p=>[p[2]+.5,p[1]+.5]);out.tri(...points.slice(0,3),uv.slice(0,3));out.tri(points[0],points[2],points[3],[uv[0],uv[2],uv[3]]);}
  return out;
 }
 function closeBodyCuts(b,f,result,records){
  const M=Y.M,F=Y.Footprints,bb=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
  // Recover Adapter's exact source bounds, including transformed AABB corners.
  for(const rec of records){const local=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
   for(let i=0;i<rec.g.v.length;i+=8)for(let j=0;j<3;j++){local[j]=Math.min(local[j],rec.g.v[i+j]);local[j+3]=Math.max(local[j+3],rec.g.v[i+j]);}
   const corners=[];for(const x of[local[0],local[3]])for(const y of[local[1],local[4]])for(const z of[local[2],local[5]])corners.push(M.apply(rec.m,[x,y,z,1]));
   if(Math.max(...corners.map(v=>v[1]))<Math.min(4,Math.max(1.3,f.properties.height*.08)))continue;
   for(const v of corners)for(let j=0;j<3;j++){bb[j]=Math.min(bb[j],v[j]);bb[j+3]=Math.max(bb[j+3],v[j]);}
  }
  const root=M.multiply(M.transform([result.frame.centre[0],0,result.frame.centre[1]],result.scale,result.frame.r),M.transform([-(bb[0]+bb[3])/2,0,-(bb[2]+bb[5])/2],[1,1,1],0));
  // Only the existing opaque primary room box. Door, plinth and porch pieces
  // are not rooms and never produce new closures.
  const bodies=records.filter(r=>r.k==='box'&&r.p[0]===18&&r.p[3]===.6);
  for(const [index,rec]of bodies.entries()){
   const m=M.multiply(root,rec.m),inverse=M.inverse(m),cap=new G.Geometry();
   for(const ring of F.polygons(f.geometry).flatMap(p=>p))for(let i=1;i<ring.length;i++){
    const a=M.apply(inverse,[ring[i-1][0],0,ring[i-1][1],1]),q=M.apply(inverse,[ring[i][0],0,ring[i][1],1]);let lo=0,hi=1;
    const dx=q[0]-a[0],dz=q[2]-a[2];
    for(const [start,delta]of[[a[0],dx],[a[2],dz]]){
     if(Math.abs(delta)<1e-9){if(start<=-.5+1e-6||start>=.5-1e-6){lo=1;hi=0;break;}}
     else{const t0=(-.5-start)/delta,t1=(.5-start)/delta;lo=Math.max(lo,Math.min(t0,t1));hi=Math.min(hi,Math.max(t0,t1));}
    }
    if(hi-lo<1e-6)continue;
    const at=(t,y)=>M.apply(m,[a[0]+dx*t,y,a[2]+dz*t,1]).slice(0,3),p0=at(lo,-.5),p1=at(hi,-.5),p2=at(hi,.5),p3=at(lo,.5),ex=p1[0]-p0[0],ez=p1[2]-p0[2],len=Math.hypot(ex,ez);
    const points=[p0,p1,p2,p3],span=Math.hypot(dx*(hi-lo),dz*(hi-lo)),uv=[[0,0],[span,0],[span,1],[0,1]];
    if(F.inside([(p0[0]+p1[0])/2-ez/len*.003,(p0[2]+p1[2])/2+ex/len*.003],f.geometry)){points.reverse();uv.reverse();}
    cap.tri(points[0],points[1],points[2],uv.slice(0,3));cap.tri(points[0],points[2],points[3],[uv[0],uv[2],uv[3]]);
   }
   if(cap.v.length){
    // mat18 uses position-derived metric coordinates, not aUV. Keep Y in
    // world metres so courses meet the clipped room wall, but remove the
    // large absolute horizontal coordinate from its procedural brick hash.
    // An integral 240mm course period keeps the existing mortar phase.
    const origin=[Math.fround(result.frame.centre[0]),0,Math.fround(Math.floor(result.frame.centre[1]/.24)*.24)];
    for(let i=0;i<cap.v.length;i+=8){cap.v[i]-=origin[0];cap.v[i+2]-=origin[2];}
    b.e.add('yannan803-room-cut-'+index,cap,M.transform(origin,[1,1,1],0),rec.c,[rec.p[0],803,0,rec.p[3]],rec.uv);
   }
  }
 }
 Y.Yannan803Details={gable};
})(YY);
