/* Wang photo-fit pale hip/top flashings. Front/side public photographs establish
 * visible trim; four-edge continuity is supported by native overhead imagery.
 * Width/thickness are proportional fits, not surveyed. No corner finials inferred. */
(function(Y){'use strict';const R=Y.Architecture30,previous=R.render,M=Y.M;
const fit={horizontalScale:.76,hipHalfWidth:.17,slopeTopWidth:.24,platformWidth:.18,thickness:.09};
function geometry(){
 const g=new Y.Geo.Geometry(),s=fit.horizontalScale,B=[14*s,16*s],T=[3.15*s,3.7*s],bottom=[[-B[0],74.75,-B[1]],[-B[0],74.75,B[1]],[B[0],74.75,B[1]],[B[0],74.75,-B[1]]],top=[[-T[0],81.15,-T[1]],[-T[0],81.15,T[1]],[T[0],81.15,T[1]],[T[0],81.15,-T[1]]];
 const add=(a,b,c,n)=>{if(M.dot(M.cross(M.sub(b,a),M.sub(c,a)),n)<0)g.tri(c,b,a);else g.tri(a,b,c);},lift=p=>[p[0],p[1]+fit.thickness,p[2]],mix=(a,b,t)=>a.map((v,k)=>v+(b[k]-v)*t);
 // Each U-shaped face strip meets its neighbours exactly at the hip and top.
 // Internal joins have no duplicate walls; exposed perimeter gets side closures.
 function patch(p,tris,n,closedEdges){for(const[a,b,c]of tris){add(lift(p[a]),lift(p[b]),lift(p[c]),n);add(p[c],p[b],p[a],M.mul(n,-1));}
  for(const[a,b]of closedEdges){const q=p[a],r=p[b],v=lift(q),w=lift(r);g.quad(q,r,w,v);}}
 for(let i=0;i<4;i++){const j=(i+1)%4,A=bottom[i],B=bottom[j],C=top[j],D=top[i],u=M.norm(M.sub(B,A)),n=M.norm(M.cross(M.sub(B,A),M.sub(D,A))),middleLow=mix(A,B,.5),middleHigh=mix(D,C,.5),t=1-fit.slopeTopWidth/Math.hypot(...M.sub(middleHigh,middleLow)),L=mix(A,D,t),H=mix(B,C,t),inside=(p,sign)=>M.add(p,M.mul(u,sign*fit.hipHalfWidth));
  const p=[A,inside(A,1),inside(L,1),inside(H,-1),inside(B,-1),B,C,D];
  // Polygon order is CCW when viewed from outside the roof.
  patch(p,[[0,1,2],[0,2,7],[4,5,6],[4,6,3],[2,3,6],[2,6,7]],n,[[0,1],[1,2],[2,3],[3,4],[4,5]]);
 }
 const inner=top.map(p=>[p[0]-Math.sign(p[0])*fit.platformWidth,p[1],p[2]-Math.sign(p[2])*fit.platformWidth]);
 for(let i=0;i<4;i++){const j=(i+1)%4;patch([top[i],top[j],inner[j],inner[i]],[[0,1,2],[0,2,3]],[0,1,0],[[2,3]]);}
 return g;
}
R.render=function(b,f,add){const result=previous.call(this,b,f,add);if(f.properties.id!=='way/240825554'||f.properties.pickId!==89)return result;
 // Final metric vertices + orthonormal yaw only: no anisotropic normal error.
 const g=b.geo('wang-roofcaps132-closed-network',geometry);
 b.e.add('wang-roofcaps132-closed-network',g,M.transform([415.15,0,681.7],[1,1,1],.0447),'#c8cfcb',[29,89,0,2.0]);return result;
};const originalRoofTopY=Y.WangRoof120.baseY+Y.WangRoof120.rise;Y.WangRoof120.topY=Number((originalRoofTopY+fit.thickness).toFixed(6));Y.WangRoofcaps132={...fit,originalRoofTopY,topY:Y.WangRoof120.topY,source:'https://www.huitu.com/photo/show/20191217/200525503032.html',rearEvidence:'native-overhead-hip-and-platform-continuity',dimensions:'photo-fit-not-surveyed',finials:false};
})(YY);
