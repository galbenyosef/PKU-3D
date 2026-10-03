/* Two-photo registered plateau-edge fit. Keep the 166 eave/base and the
 * 4.788 m square platform; rebuild slope-dependent flashings and standing
 * seams at their original physical section sizes. Dimensions are photo fits. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
const S={rise:11.6,previousRise:9,fitRange:[11.1,12.1],fitNote:'bounded-photo-fit-not-confidence-interval',baseY:74.75,roofTopY:86.35,worldBaseY:76.495,worldPlatformY:88.095,capTopY:88.185,topY:88.785,delta:2.6,plateau:[4.788,4.788],scope:'registered-plateau-rise-only',dimensions:'photo-fit-not-surveyed'};
const fit={horizontalScale:.76,hipHalfWidth:.17,slopeTopWidth:.24,platformWidth:.18,thickness:.09};
function hip(){const g=new G.Geometry(),B=[14,14.25],T=[3.15,3.15],bottom=[[-B[0],0,-B[1]],[-B[0],0,B[1]],[B[0],0,B[1]],[B[0],0,-B[1]]],top=[[-T[0],S.rise,-T[1]],[-T[0],S.rise,T[1]],[T[0],S.rise,T[1]],[T[0],S.rise,-T[1]]];for(let i=0;i<4;i++){const j=(i+1)%4;g.quad(bottom[i],bottom[j],top[j],top[i]);}g.quad(top[0],top[1],top[2],top[3]);return g;}
function caps(options){
 const section=options?{...fit,transitionHeight:.30,...options}:fit;
 const g=new Y.Geo.Geometry(),s=fit.horizontalScale,B=[14*s,14.25*s],T=[3.15*s,3.15*s],bottom=[[-B[0],74.75,-B[1]],[-B[0],74.75,B[1]],[B[0],74.75,B[1]],[B[0],74.75,-B[1]]],top=[[-T[0],S.roofTopY,-T[1]],[-T[0],S.roofTopY,T[1]],[T[0],S.roofTopY,T[1]],[T[0],S.roofTopY,-T[1]]];
 const add=(a,b,c,n)=>{if(M.dot(M.cross(M.sub(b,a),M.sub(c,a)),n)<0)g.tri(c,b,a);else g.tri(a,b,c);},lift=p=>[p[0],p[1]+(options?section.hipThickness+(fit.thickness-section.hipThickness)*Math.max(0,(p[1]-(S.roofTopY-section.transitionHeight))/section.transitionHeight):fit.thickness),p[2]],mix=(a,b,t)=>a.map((v,k)=>v+(b[k]-v)*t);
 // Each U-shaped face strip meets its neighbours exactly at the hip and top.
 // Internal joins have no duplicate walls; exposed perimeter gets side closures.
 function patch(p,tris,n,closedEdges){
  if(options){
   const cut=S.roofTopY-section.transitionHeight,clip=(points,above)=>{const out=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],ia=above?a[1]>=cut:a[1]<=cut,ib=above?b[1]>=cut:b[1]<=cut;if(ia)out.push(a);if(ia!==ib)out.push(mix(a,b,(cut-a[1])/(b[1]-a[1])));}return out;};
   for(const ids of tris)for(const above of[false,true]){const q=clip(ids.map(i=>p[i]),above);for(let j=1;j+1<q.length;j++){if(Math.hypot(...M.cross(M.sub(q[j],q[0]),M.sub(q[j+1],q[0])))<1e-10)continue;add(lift(q[0]),lift(q[j]),lift(q[j+1]),n);add(q[j+1],q[j],q[0],M.mul(n,-1));}}
   for(const[a,b]of closedEdges){const q=p[a],r=p[b],points=[q];if((q[1]-cut)*(r[1]-cut)<0)points.push(mix(q,r,(cut-q[1])/(r[1]-q[1])));points.push(r);for(let j=0;j+1<points.length;j++)g.quad(points[j],points[j+1],lift(points[j+1]),lift(points[j]));}return;
  }
  for(const[a,b,c]of tris){add(lift(p[a]),lift(p[b]),lift(p[c]),n);add(p[c],p[b],p[a],M.mul(n,-1));}
  for(const[a,b]of closedEdges){const q=p[a],r=p[b],v=lift(q),w=lift(r);g.quad(q,r,w,v);}}
 for(let i=0;i<4;i++){const j=(i+1)%4,A=bottom[i],B=bottom[j],C=top[j],D=top[i],u=M.norm(M.sub(B,A)),n=M.norm(M.cross(M.sub(B,A),M.sub(D,A))),middleLow=mix(A,B,.5),middleHigh=mix(D,C,.5),t=1-fit.slopeTopWidth/Math.hypot(...M.sub(middleHigh,middleLow)),L=mix(A,D,t),H=mix(B,C,t),inside=(p,sign)=>M.add(p,M.mul(u,sign*section.hipHalfWidth));
  const p=[A,inside(A,1),inside(L,1),inside(H,-1),inside(B,-1),B,C,D];
  // Polygon order is CCW when viewed from outside the roof.
  patch(p,[[0,1,2],[0,2,7],[4,5,6],[4,6,3],[2,3,6],[2,6,7]],n,[[0,1],[1,2],[2,3],[3,4],[4,5]]);
 }
 const inner=top.map(p=>[p[0]-Math.sign(p[0])*fit.platformWidth,p[1],p[2]-Math.sign(p[2])*fit.platformWidth]);
 for(let i=0;i<4;i++){const j=(i+1)%4;patch([top[i],top[j],inner[j],inner[i]],[[0,1,2],[0,2,3]],[0,1,0],[[2,3]]);}
 return g;
}

function seam(face,options){const old=Y.WangRoof120;Y.WangRoof120={...old,rise:S.rise};try{return Y.WangRoofSeams144.geometry(face,options);}finally{Y.WangRoof120=old;}}

A.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add,own=Object.prototype.hasOwnProperty.call(b.e,'add');b.e.add=function(k,g,m,c,p,uv){
 if(k==='wang-roof153-hip')return emit.call(this,'wang-roof-rise167-hip',b.geo('wang-roof-rise167-hip',hip),m,c,p,uv);
 if(k==='wang-roof153-caps')return emit.call(this,'wang-roof-rise167-caps',b.geo('wang-roof-rise167-caps',caps),m,c,p,uv);
 if(k.startsWith('wang-roof153-seams-')){const face=Number(k.slice(-1));return emit.call(this,'wang-roof-rise167-seams-'+face,b.geo('wang-roof-rise167-seam-shape-'+face%2,()=>seam(face%2)),m,c,p,uv);}
 if(k.startsWith('wang-roof-detail165-top-')){const n=m.slice();n[13]+=S.delta;return emit.call(this,k,g,n,c,p,uv);}
 return emit.call(this,k,g,m,c,p,uv);
};try{return previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}};
Y.WangRoofRise167={...S,capSection:fit,hip,caps,seam};Y.WangRoof120.topY=S.topY;
})(YY);
