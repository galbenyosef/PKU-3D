/* Wang's northern low wing: visible north/east perimeter roof bands only.
 * Official 2025 opening-ceremony photo + public satellite perimeter support
 * the scope. Heights, 5 m band and clerestory pitch are proportional fits;
 * existing 12.5 m podium datum is not a surveyed roof level. No west extrapolation. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M;
const S={baseY:12.5,eaveY:14,ridgeY:16,thickness:.16,width:5,pitch:2.4,
 fit:{width:[4,6],eaveAboveBase:[1.1,1.8],rise:[1.5,2.5]},
 outer:[[408.623,623.681],[464.212,621.193],[442.383,677.133]],
 scope:'north-and-east-low-wing-perimeter-only',surveyed:false};
const sub=(a,b)=>a.map((v,i)=>v-b[i]),add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,s)=>a.map(v=>v*s),cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
function plan(){const o=S.outer.map(p=>p.slice()),u=[0,1].map(i=>{const d=sub(o[i+1],o[i]);return mul(d,1/Math.hypot(...d));}),n=u.map(d=>[-d[1],d[0]]),a=add(o[1],mul(n[0],S.width)),b=add(o[1],mul(n[1],S.width)),t=cross(sub(b,a),u[1])/cross(u[0],u[1]);const west=sub([410.374,662.487],o[0]),westT=S.width/(west[0]*n[0][0]+west[1]*n[0][1]);return{o,u,n,inner:[add(o[0],mul(west,westT)),add(a,mul(u[0],t)),add(o[2],mul(n[1],S.width))]};}
const v=(p,y)=>[p[0],y,p[1]];
function quad(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p=p.slice().reverse();for(let i=1;i+1<p.length;i++)if(Math.hypot(...M.cross(M.sub(p[i],p[0]),M.sub(p[i+1],p[0])))>1e-9)g.tri(p[0],p[i],p[i+1]);}
function clipped(p){for(const [a,b,sign]of[[S.outer[0],S.outer[1],1],[S.outer[1],S.outer[2],1],[S.outer[0],[410.374,662.487],-1]]){const d=sub(b,a),out=[];for(let i=0;i<p.length;i++){const q=p[i],r=p[(i+1)%p.length],dq=cross(d,sub(q,a))*sign,dr=cross(d,sub(r,a))*sign;if(dq>=0)out.push(q);if((dq>=0)!==(dr>=0))out.push(add(q,mul(sub(r,q),dq/(dq-dr))));}p=out;}return p.filter((q,i)=>Math.hypot(...sub(q,p[(i+p.length-1)%p.length]))>.0001);}
function prism(g,p,lo,hi){p=clipped(p);if(p.length<3)return;const h=p.map(q=>typeof hi==='function'?hi(q):hi),area=p.reduce((s,a,i)=>s+cross(a,p[(i+1)%p.length]),0);quad(g,p.map((q,i)=>v(q,h[i])),[0,1,0]);quad(g,p.map(q=>v(q,lo)),[0,-1,0]);for(let i=0;i<p.length;i++){const j=(i+1)%p.length,a=p[i],b=p[j],d=sub(b,a),n=mul([d[1],0,-d[0]],Math.sign(area));quad(g,[v(a,lo),v(b,lo),v(b,h[j]),v(a,h[i])],n);}}
function bar(g,a,b,n,depth,lo,hi){prism(g,[a,b,add(b,mul(n,depth)),add(a,mul(n,depth))],lo,hi);}
function geometry(){const {o,u,n,inner:I}=plan(),roof=new G.Geometry(),stone=new G.Geometry(),glass=new G.Geometry();
 for(let i=0;i<2;i++){const p=[v(o[i],S.eaveY),v(o[i+1],S.eaveY),v(I[i+1],S.ridgeY),v(I[i],S.ridgeY)];quad(roof,p,[0,1,0]);quad(roof,p.map(q=>[q[0],q[1]-S.thickness,q[2]]),[0,-1,0]);}
 const ring=[...o,I[2],I[1],I[0]],ys=[S.eaveY,S.eaveY,S.eaveY,S.ridgeY,S.ridgeY,S.ridgeY];
 for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length,d=sub(ring[j],ring[i]);quad(roof,[v(ring[i],ys[i]-S.thickness),v(ring[j],ys[j]-S.thickness),v(ring[j],ys[j]),v(ring[i],ys[i])],[d[1],0,-d[0]]);}
 function distance(q,i){const d=sub(q,o[i]);return d[0]*n[i][0]+d[1]*n[i][1];}
 const underside=q=>S.eaveY-S.thickness+Math.min(distance(q,0),distance(q,1))*(S.ridgeY-S.eaveY)/S.width;
 // Split at the roof miter before triangulation; each bearing top is planar.
 function bearing(a,b,inward,depth,lo){const p=clipped([a,b,add(b,mul(inward,depth)),add(a,mul(inward,depth))]);for(const sign of[-1,1]){const out=[];for(let i=0;i<p.length;i++){const q=p[i],r=p[(i+1)%p.length],dq=(distance(q,0)-distance(q,1))*sign,dr=(distance(r,0)-distance(r,1))*sign;if(dq>=0)out.push(q);if((dq>=0)!==(dr>=0))out.push(add(q,mul(sub(r,q),dq/(dq-dr))));}prism(stone,out,lo,underside);}}
 for(let i=0;i<2;i++){const a=add(o[i],mul(u[i],.003)),b=o[i+1],len=Math.hypot(...sub(b,a)),count=Math.ceil(len/S.pitch),step=len/count;
  // Outer lintel and sill bear on the retained podium. Glass is recessed.
  bearing(a,b,n[i],.30,S.eaveY-S.thickness-.22);
  bar(stone,a,b,n[i],.30,S.baseY,S.baseY+.16);
  for(let j=0;j<=count;j++){const t=j*step,lo=Math.max(0,t-.09),hi=Math.min(len,t+.09);bar(stone,add(a,mul(u[i],lo)),add(a,mul(u[i],hi)),n[i],.30,S.baseY+.16,S.eaveY-S.thickness-.22);}
  for(let j=0;j<count;j++){const q=add(add(a,mul(u[i],j*step+.09)),mul(n[i],.17)),r=add(add(a,mul(u[i],(j+1)*step-.09)),mul(n[i],.17));bar(glass,q,r,n[i],.05,S.baseY+.16,S.eaveY-S.thickness-.22);}
  // Inner load-bearing curb; retain the broad equipment platform beyond it.
  bearing(I[i],I[i+1],mul(n[i],-1),.22,S.baseY);
 }
 // Terminal tops use the same two roof planes, including displaced inner edges.
 bearing(o[0],I[0],u[0],.22,S.baseY);bearing(o[2],I[2],mul(u[1],-1),.22,S.baseY);
 return{roof,stone,glass};}
let cachedShapes;
A.render=function(b,f,add){const r=prior.call(this,b,f,add);if(f.properties.pickId!==89||f.properties.id!=='way/240825554')return r;
 const shapes=cachedShapes||(cachedShapes=geometry());for(const [name,color,mat]of[['roof','#777f7c',22],['stone','#c4bdac',24],['glass','#53666b',28]])b.e.add('wang-podium-roof172-'+name,b.geo('wang-podium-roof172-'+name,()=>shapes[name]),M.identity(),color,[mat,89,0,1]);return r;};
Y.WangPodiumRoof172={...S,plan,geometry};
})(YY);
