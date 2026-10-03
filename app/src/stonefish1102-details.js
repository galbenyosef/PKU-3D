/* Roll-tailed stone fish: terminal fan, folded shoulder fins, high eyes and
 * a continuous descending head/shoulder profile fitted to PKU's public scan
 * montage: https://news.pku.edu.cn/info/7921/2928451.htm.
 * Mouth, rolled tail, lower/rear body and shore rocks are retained. The fitted
 * relief is not a measured reconstruction or an imported scan mesh. */
(function(Y){'use strict';
const P=Y.Builder.prototype,prior=P.lakeStoneFish,G=Y.Geo,M=Y.M,TAU=Math.PI*2;
P.lakeStoneFish=function(p){
 if(this.id!==1102)return prior.call(this,p);
 const beam=this.beam,mesh=this.mesh,sphere=this.sphere;
 const sections0=[[-.60,.30,.30,.23],[-.42,.29,.41,.21],[-.18,.27,.45,.18],[.05,.27,.39,.16],[.26,.30,.28,.15],[.44,.37,.19,.16],[.59,.46,.14,.16]];
 function shoulder(p){const[x,y,z]=p;if(x<-.60||x>=-.20)return p;let i=0;while(i<sections0.length-2&&x>sections0[i+1][0])i++;const l=sections0[i],u=sections0[i+1],t=(x-l[0])/(u[0]-l[0]),cy=l[1]*(1-t)+u[1]*t,ry=l[3]*(1-t)+u[3]*t,h=Math.max(0,(y-cy)/ry),fall=M.clamp((x+.42)/.22,0,1),rise=(x<-.42?.15-.01*(x+.60)/.18:.14*(1-fall*fall*(3-2*fall)))*Math.min(1,h*h);// Preserve the existing vertical mouth aperture while the shoulder meets its outer rear wall.
 if(Math.pow((x+.676)/.68,2)+z*z<.167*.167)return p;return[x,y+rise,z];}
 const supportMeshes=[];
 this.mesh=function(key,g,...args){if(key==='v10-fish-sculpted-body'||key==='v10-fish-scale-relief'){const newKey=key==='v10-fish-sculpted-body'?'v48-stonefish1102-shoulder-body':'v48-stonefish1102-shoulder-scales';g=this.geo(newKey,()=>{const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const pts=[0,8,16].map(o=>shoulder(g.v.slice(i+o,i+o+3)));if(pts.every((p,j)=>p.every((v,k)=>v===g.v[i+j*8+k])))out.v.push(...g.v.slice(i,i+24));else{const offset=out.v.length;out.tri(...pts);for(let j=0;j<3;j++)for(let k=6;k<8;k++)out.v[offset+j*8+k]=g.v[i+j*8+k];}}return out;});key=newKey;}
 if(key==='v48-stonefish1102-shoulder-body'||key==='v10-fish-open-mouth')supportMeshes.push(g);if(key==='v10-fish-gill--1'||key==='v10-fish-gill-1')return;return mesh.call(this,key,g,...args);};
 this.sphere=function(x,y,z,rx,ry,rz,...args){if(x===-.648&&y===.565&&rx===.034&&ry===.037&&rz===.014)return;return sphere.call(this,x,y,z,rx,ry,rz,...args);};
 // The five former unsupported terminal lines are replaced with lines attached
 // to the new solid. Preserve the other original beam marks; head meshes are fitted separately.
 this.beam=function(a,b,...rest){if(a[0]===.064&&a[1]===.55&&b[0]===.02&&b[1]===.46&&rest[0]===.006)return;return beam.call(this,a,b,...rest);};
 try{prior.call(this,p);}finally{this.beam=beam;this.mesh=mesh;this.sphere=sphere;}
 // Side surface queries use the actual original triangle stream, so the new
 // carved relief follows the existing head/body union rather than an offset
 // guessed from the bounding box. It is computed only in the cached geometry.
 const facets=supportMeshes.flatMap(g=>{const a=[];for(let i=0;i<g.v.length;i+=24)a.push([g.v.slice(i,i+3),g.v.slice(i+8,i+11),g.v.slice(i+16,i+19)]);return a;}),cache=new Map();
 function sideSurface(x,y,side){const key=x.toFixed(7)+','+y.toFixed(7);let z=cache.get(key);if(z===undefined){z=-Infinity;for(const [a,b,c] of facets){const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<1e-12)continue;const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den;if(u>=-1e-7&&v>=-1e-7&&u+v<=1+1e-7)z=Math.max(z,u*a[2]+v*b[2]+(1-u-v)*c[2]);}if(!Number.isFinite(z))throw Error('Stone fish relief left supported surface');cache.set(key,z);}return[x,y,z*side];}
 const sections=[[-.60,.30,.30,.23],[-.42,.29,.41,.21],[-.18,.27,.45,.18],[.05,.27,.39,.16],[.26,.30,.28,.15],[.44,.37,.19,.16],[.59,.46,.14,.16]];
 function bodyAt(x,a,offset=0){let i=0;while(i<sections.length-2&&x>sections[i+1][0])i++;const l=sections[i],u=sections[i+1],t=M.clamp((x-l[0])/(u[0]-l[0]),0,1),cy=l[1]*(1-t)+u[1]*t,rz=l[2]*(1-t)+u[2]*t,ry=l[3]*(1-t)+u[3]*t;return shoulder([x,cy+Math.cos(a)*(ry+offset),Math.sin(a)*(rz+offset)]);}
 const finAt=(t,v,side,back=false)=>{const a=side*(.63+.20*t+(v-.5)*(.44*(1-t)+.025)),offset=back?-.008:.002+.010*Math.sin(Math.PI*t)*Math.sin(Math.PI*v);return bodyAt(-.355+.215*t,a,offset);};
 function outward(g,a,b,c,d,n){const u=M.sub(b,a),v=M.sub(c,a);if(M.dot(M.cross(u,v),n)>0)g.quad(a,b,c,d);else g.quad(d,c,b,a);}
 const cheekKey='v48-stonefish1102-folded-fins-eyes',cheeks=this.geo(cheekKey,()=>{const g=new G.Geometry();for(const side of[-1,1]){
  const K=24,N=18;for(let i=0;i<K;i++)for(let j=0;j<N;j++)for(const back of[false,true]){const ps=[finAt(i/K,j/N,side,back),finAt((i+1)/K,j/N,side,back),finAt((i+1)/K,(j+1)/N,side,back),finAt(i/K,(j+1)/N,side,back)];outward(g,...ps,[0,back?-1:1,(back?-1:1)*side]);}
  for(let i=0;i<K;i++)for(const v of[0,1])outward(g,finAt(i/K,v,side),finAt((i+1)/K,v,side),finAt((i+1)/K,v,side,true),finAt(i/K,v,side,true),[0,v===0?1:-1,side*(v===0?-1:1)]);
  for(let j=0;j<N;j++)for(const t of[0,1])outward(g,finAt(t,j/N,side),finAt(t,(j+1)/N,side),finAt(t,(j+1)/N,side,true),finAt(t,j/N,side,true),[t===0?-1:1,0,0]);
  // Eye boss follows the scanned high circular eye behind the raised mouth.
  const eye=(r,a)=>{const p=sideSurface(-.412+.028*r*Math.cos(a),.600+.026*r*Math.sin(a),side);p[2]+=side*(-.002+.012*Math.pow(1-r*r,1.2));return p;};
  for(let j=0;j<64;j++){const a=j*TAU/64,b=(j+1)*TAU/64,c=eye(0,0),p=eye(1/8,a),q=eye(1/8,b);if(side>0)g.tri(c,p,q);else g.tri(c,q,p);}
  for(let i=1;i<8;i++)for(let j=0;j<64;j++)outward(g,eye(i/8,j*TAU/64),eye((i+1)/8,j*TAU/64),eye((i+1)/8,(j+1)*TAU/64),eye(i/8,(j+1)*TAU/64),[0,0,side]);
 }return g;});this.mesh(cheekKey,cheeks,0,0,0,1,1,1,'#aea180',22,.74);
 function tube(g,pts,r){for(let i=0;i<pts.length-1;i++){const p=pts[i],q=pts[i+1],v=M.norm(M.sub(q,p)),u=M.norm(M.cross(v,Math.abs(v[2])>.9?[0,1,0]:[0,0,1])),w=M.cross(v,u),at=(p,a)=>p.map((x,k)=>x+r*(u[k]*Math.cos(a)+w[k]*Math.sin(a)));for(let j=0;j<7;j++)outward(g,at(p,j*TAU/7),at(q,j*TAU/7),at(q,(j+1)*TAU/7),at(p,(j+1)*TAU/7),M.sub(at(p,(j+.5)*TAU/7),p));}}
 const detailKey='v48-stonefish1102-cheek-carving',detail=this.geo(detailKey,()=>{const g=new G.Geometry();for(const side of[-1,1]){
  // Folded fin rays are constrained to the solid fin surface.
  for(let j=1;j<5;j++){const pts=[];for(let i=2;i<=22;i++)pts.push(finAt(i/24,j/5,side));tube(g,pts,.0022);}
  for(const rr of[.76]){const pts=[];for(let i=0;i<=64;i++){const a=i*TAU/64,p=sideSurface(-.412+.028*rr*Math.cos(a),.600+.026*rr*Math.sin(a),side);p[2]+=side*(-.002+.012*Math.pow(1-rr*rr,1.2));pts.push(p);}tube(g,pts,.0028);}
  // Three shallow swept cheek folds visible below the mouth rim in the scan.
  for(let k=0;k<3;k++){const pts=[];for(let i=0;i<=32;i++){const t=i/32,x=-.765+.205*t,y=.585+k*.034-.043*Math.sin(Math.PI*t),p=sideSurface(x,y,side);pts.push(p);}tube(g,pts,.0036);}
 }return g;});this.mesh(detailKey,detail,0,0,0,1,1,1,'#a49b7e',22,.76);
 const path=M.catmull([[.44,.32],[.61,.47],[.59,.68],[.40,.80],[.16,.72],[.065,.54]],9,false),q=path[path.length-1],prev=path[path.length-2],d=M.norm([q[0]-prev[0],q[1]-prev[1]]),nx=-d[1],ny=d[0],r=.17*(1-.61);
 const at=(t,a)=>{const s=t*t*(3-2*t),rz=r*1.25*(1-s)+.23*s;return[q[0]*(1-s)+.01*s+Math.cos(a)*(nx*r*(1-s)+.085*s),q[1]*(1-s)+.398*s+Math.cos(a)*(ny*r*(1-s)-.015*s),Math.sin(a)*rz];};
 const key='v48-stonefish1102-terminal-fan',N=48,K=24;
 const fan=this.geo(key,()=>{const g=new G.Geometry();for(let i=0;i<K;i++)for(let j=0;j<N;j++)g.quad(at(i/K,(j+1)*TAU/N),at((i+1)/K,(j+1)*TAU/N),at((i+1)/K,j*TAU/N),at(i/K,j*TAU/N));const c=[.01,.398,0];for(let j=0;j<N;j++)g.tri(c,at(1,(j+1)*TAU/N),at(1,j*TAU/N));return g;});
 this.mesh(key,fan,0,0,0,1,1,1,'#aea180',22,.805);
 // Narrow raised traces follow the fitted fan, instead of floating in space.
 const lineKey='v48-stonefish1102-terminal-relief';
 const relief=this.geo(lineKey,()=>{const g=new G.Geometry();for(let j=0;j<9;j++){const a=Math.PI*.57+j*Math.PI*.86/8;for(let i=1;i<16;i++){const p0=at(i/24,a),p1=at((i+1)/24,a);p0[1]+=.0015;p1[1]+=.0015;const v=M.norm(M.sub(p1,p0)),u=M.norm(M.cross(v,[0,0,1])),w=M.cross(v,u),point=(p,k)=>p.map((x,n)=>x+.0015*(u[n]*Math.cos(k*TAU/7)+w[n]*Math.sin(k*TAU/7)));for(let k=0;k<7;k++)g.quad(point(p0,k+1),point(p1,k+1),point(p1,k),point(p0,k));}}return g;});
 this.mesh(lineKey,relief,0,0,0,1,1,1,'#a49b7e',22,.87);
};
})(YY);
