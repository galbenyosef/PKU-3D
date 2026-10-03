/* Correct the complete Wang hip rise using facade-plane perspective fits.
 * Base, plateau and eave remain fixed; cap and seam sections are rebuilt at
 * their original physical width/thickness, never vertically stretched. */
(function(Y){'use strict';const R=Y.Architecture30,previous=R.render,M=Y.M,G=Y.Geo;
const S={baseY:74.75,rise:9,roofTopY:83.75,topY:83.84,previousRise:6.4,fitRange:[8.5,10],dimensions:'two-photo-perspective-fit-not-surveyed'};
const fit={horizontalScale:.76,hipHalfWidth:.17,slopeTopWidth:.24,platformWidth:.18,thickness:.09};
function hip(){const g=new G.Geometry(),B=[14,16],T=[3.15,3.7],bottom=[[-B[0],0,-B[1]],[-B[0],0,B[1]],[B[0],0,B[1]],[B[0],0,-B[1]]],top=[[-T[0],S.rise,-T[1]],[-T[0],S.rise,T[1]],[T[0],S.rise,T[1]],[T[0],S.rise,-T[1]]];for(let i=0;i<4;i++){const j=(i+1)%4;g.quad(bottom[i],bottom[j],top[j],top[i]);}g.quad(top[0],top[1],top[2],top[3]);return g;}
function caps(){
 const g=new Y.Geo.Geometry(),s=fit.horizontalScale,B=[14*s,16*s],T=[3.15*s,3.7*s],bottom=[[-B[0],74.75,-B[1]],[-B[0],74.75,B[1]],[B[0],74.75,B[1]],[B[0],74.75,-B[1]]],top=[[-T[0],S.roofTopY,-T[1]],[-T[0],S.roofTopY,T[1]],[T[0],S.roofTopY,T[1]],[T[0],S.roofTopY,-T[1]]];
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
R.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add;b.e.add=function(k,g,m,c,p,uv){
 if(k==='wang-roof120-hip')return emit.call(this,'wang-roof147-hip',b.geo('wang-roof147-hip',hip),m,c,p,uv);
 if(k==='wang-roofcaps132-closed-network')return emit.call(this,'wang-roof147-caps',b.geo('wang-roof147-caps',caps),m,c,p,uv);
 if(k.startsWith('wang-roof-seams144-face-')){const face=Number(k.slice(-1)),shape=b.geo('wang-roof147-seam-shape-'+face%2,()=>Y.WangRoofSeams144.geometry(face%2));return emit.call(this,'wang-roof147-seams-'+face,shape,m,c,p,uv);}
 return emit.call(this,k,g,m,c,p,uv);
};try{return previous.call(this,b,f,add);}finally{b.e.add=emit;}};
Y.WangRoof120.rise=S.rise;Y.WangRoof120.topY=S.topY;
Y.WangRoofcaps132.originalRoofTopY=S.roofTopY;Y.WangRoofcaps132.topY=S.topY;
Y.WangRoof147={...S,capSection:fit,hip,caps,scope:'hip-rise-with-rebuilt-caps-and-parallel-seams'};
})(YY);
