/* Photo-fit wall profile: rising front segment followed by a near-level rear
 * segment. Gray mortar-course perspective does not establish a rear descent.
 * Preserve the accepted front coping/steel junction; heights are not surveyed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/445016209';
const spec={front:59.06,knot:55.95,rear:47.08,frontTop:2.56,rearTop:3.14,capThickness:.14};
const top=u=>u<=spec.knot?spec.rearTop:spec.rearTop+(spec.frontTop-spec.rearTop)*(u-spec.knot)/(spec.front-spec.knot);
A.render=function(b,f,add){
 if(f.properties.id!==ID||f.properties.pickId!==195)return previous.call(this,b,f,add);
 const original=b.e.add;let count=0;
 b.e.add=function(k,g,m,c,p,uv){
  if(!/^studentcenter195-rails145-(wall|cap)-(north|south)$/.test(k))return original.call(this,k,g,m,c,p,uv);
  count++;const wall=k.includes('-wall-'),inv=M.inverse(m),out=new G.Geometry(),vertices=[];
  for(let i=0;i<g.v.length;i+=8){const q=M.apply(m,[...g.v.slice(i,i+3),1]),l=Y.StudentCenterSouth46.local([q[0],q[2]]);vertices.push([l[0],q[1],l[1],...g.v.slice(i+3,i+8)]);}
  const lo=Math.min(...vertices.map(p=>p[0])),hi=Math.max(...vertices.map(p=>p[0])),bottom=Math.min(...vertices.map(p=>p[1]));
  if(Math.abs(lo-spec.rear)>.002||Math.abs(hi-spec.front)>.002)throw Error('studentcenter195 profile: upstream wall registration changed');
  const endpointTop=u=>Math.max(...vertices.filter(p=>Math.abs(p[0]-u)<.001).map(p=>p[1])),oldRear=endpointTop(lo),oldFront=endpointTop(hi),oldTop=u=>oldRear+(oldFront-oldRear)*(u-lo)/(hi-lo);
  function clip(poly,side){const result=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[0]-spec.knot)*side,db=(b[0]-spec.knot)*side;if(da>=0)result.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);result.push(a.map((v,k)=>v+(b[k]-v)*t));}}return result;}
  function deform(p){const old=oldTop(p[0]),y=wall?bottom+(p[1]-bottom)*(top(p[0])-.11-bottom)/(old-bottom):p[1]+top(p[0])-old,w=Y.StudentCenterSouth46.world([p[0],p[2]]);return M.apply(inv,[w[0],y,w[1],1]).slice(0,3);}
  for(let i=0;i<vertices.length;i+=3)for(const side of[-1,1]){const poly=clip(vertices.slice(i,i+3),side);for(let j=1;j+1<poly.length;j++){const ps=[poly[0],poly[j],poly[j+1]],q=ps.map(deform),area=Math.hypot(...M.cross(M.sub(q[1],q[0]),M.sub(q[2],q[0])));if(area>1e-9)out.tri(...q,ps.map(p=>p.slice(6,8)));}}
  if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;
  return original.call(this,k.replace('rails145','profile146'),out,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 if(count!==4)throw Error('studentcenter195 profile: expected two walls and two caps');return result;
};
Y.StudentCenter195Profile146={...spec,top};
})(YY);
