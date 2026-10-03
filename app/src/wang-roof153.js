/* Candidate nearly-square roof plan, constrained by native imagery and the
 * adjacent low-wing scale. Clerestory/core depth is retained, so the reduced
 * north/south projection remains a visual-review condition, not surveyed fact. */
(function(Y){'use strict';const R=Y.Architecture30,previous=R.render,P=Y.Builder.prototype,oldTower=P.wangTower30,M=Y.M,G=Y.Geo;
const S={baseY:74.75,rise:9,roofTopY:83.75,topY:83.84,base:[28,28.5],plateau:[6.3,6.3],mainEave:[34.8,35],lowerLip:[35.8,36],outerZ:17.1,braceEndZ:16,braceStartZ:14.60,innerZ:14.65,planFitRange:[28,30],scope:'roof-eave-outer-supports-only-core-retained',reviewCandidate:true};
const fit={horizontalScale:.76,hipHalfWidth:.17,slopeTopWidth:.24,platformWidth:.18,thickness:.09};
function hip(){const g=new G.Geometry(),B=[14,14.25],T=[3.15,3.15],bottom=[[-B[0],0,-B[1]],[-B[0],0,B[1]],[B[0],0,B[1]],[B[0],0,-B[1]]],top=[[-T[0],S.rise,-T[1]],[-T[0],S.rise,T[1]],[T[0],S.rise,T[1]],[T[0],S.rise,-T[1]]];for(let i=0;i<4;i++){const j=(i+1)%4;g.quad(bottom[i],bottom[j],top[j],top[i]);}g.quad(top[0],top[1],top[2],top[3]);return g;}
function caps(){
 const g=new Y.Geo.Geometry(),s=fit.horizontalScale,B=[14*s,14.25*s],T=[3.15*s,3.15*s],bottom=[[-B[0],74.75,-B[1]],[-B[0],74.75,B[1]],[B[0],74.75,B[1]],[B[0],74.75,-B[1]]],top=[[-T[0],S.roofTopY,-T[1]],[-T[0],S.roofTopY,T[1]],[T[0],S.roofTopY,T[1]],[T[0],S.roofTopY,-T[1]]];
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

P.wangTower30=function(){const box=this.v16box,emit=this.e.add,beam=this.beam;
this.v16box=function(k,x,y,z,w,h,d,c,mat,part){if(k==='v16-wang-crown')d=h>.2?S.mainEave[1]:S.lowerLip[1];return box.call(this,k,x,y,z,w,h,d,c,mat,part);};
this.e.add=function(k,...args){if(k==='wang-soffit122-ribs')return;return emit.call(this,k,...args);};
this.beam=function(a,b,r,c,mat,part){if(a[1]===70.9&&b[1]===74&&Math.abs(a[0])===10.5&&Math.abs(b[2])===18.1){a=[a[0],a[1],Math.sign(a[2])*S.braceStartZ];const end=[b[0],b[1],Math.sign(b[2])*S.braceEndZ],up=M.norm(M.sub(end,a)),side=M.norm(M.cross(up,[0,0,1])),front=M.cross(side,up),len=Math.hypot(...M.sub(end,a)),g=new G.Geometry(),unit=G.cylinder(8,1);for(let i=0;i<unit.v.length;i+=8){const p=a.map((v,j)=>v+side[j]*r*unit.v[i]+up[j]*len*unit.v[i+1]+front[j]*r*unit.v[i+2]),n=M.norm([0,1,2].map(j=>side[j]*unit.v[i+3]/r+up[j]*unit.v[i+4]/len+front[j]*unit.v[i+5]/r));g.vertex(p,n,unit.v.slice(i+6,i+8));}return this.mesh('wang-roof153-brace-'+Math.sign(a[0])+'-'+Math.sign(a[2]),g,0,0,0,1,1,1,c,mat,part);}return beam.call(this,a,b,r,c,mat,part);};
try{oldTower.call(this);}finally{this.v16box=box;this.e.add=emit;this.beam=beam;}
const rib=this.geo('wang-roof153-rib-shape',()=>{const g=new G.Geometry(),b=G.box(),point=v=>[v[0],v[1]>0?.75:.71*(.5-v[2]),v[2]+.5];for(let i=0;i<b.v.length;i+=24)g.tri(point(b.v.slice(i,i+3)),point(b.v.slice(i+8,i+11)),point(b.v.slice(i+16,i+19)));return g;});
const put=(x,z,r,len)=>this.mesh('wang-roof153-ribs',rib,x,73.275,z,.15,1,len,'#8d9b9b',29,1.93,r);
for(const sign of[-1,1]){for(let x=-12.75;x<=12.25;x+=1.25)put(x,sign*14.65,sign>0?0:Math.PI,S.outerZ-14.65);for(let z=-13.75;z<=13.75;z+=1.25)put(sign*13.15,z,sign*Math.PI/2,16.5-13.15);}
for(const x of[-1,1])for(const z of[-1,1]){const dx=x*(16.5-13.15),dz=z*(S.outerZ-14.65);put(x*13.15,z*14.65,Math.atan2(dx,dz),Math.hypot(dx,dz));}
};
R.render=function(b,f,add){if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return previous.call(this,b,f,add);const emit=b.e.add;b.e.add=function(k,g,m,c,p,uv){
if(k==='wang-roof147-hip')return emit.call(this,'wang-roof153-hip',b.geo('wang-roof153-hip',hip),m,c,p,uv);
if(k==='wang-roof147-caps')return emit.call(this,'wang-roof153-caps',b.geo('wang-roof153-caps',caps),m,c,p,uv);
if(k.startsWith('wang-roof147-seams-')){const face=Number(k.slice(-1));return emit.call(this,'wang-roof153-seams-'+face,b.geo('wang-roof153-seam-shape-'+face%2,()=>Y.WangRoofSeams144.geometry(face%2)),m,c,p,uv);}return emit.call(this,k,g,m,c,p,uv);
};try{return previous.call(this,b,f,add);}finally{b.e.add=emit;}};
Y.WangRoof120.base=S.base;Y.WangRoof120.plateau=S.plateau;Y.WangRoof120.topY=S.topY;
Y.WangRoof153={...S,hip,caps,capSection:fit};
})(YY);
