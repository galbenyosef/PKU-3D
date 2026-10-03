/* East bridge parapet ends. The complete 2022 Archello photograph and 2025
 * PKU frontal photograph both show pale full-height end cladding below the
 * coping. Both ends are visible: photo-left is geographic south (+local v).
 * Retain 145/146 envelopes. The 70mm return and 8mm joint are conservative
 * fits, not measured construction details; do not widen the stair platform. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/445016209',spec={front:59.06,returnDepth:.07,joint:.008};
function half(poly,cut){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=a.u-cut,db=b.u-cut;if(da<=0)out.push(a);if((da<=0)!==(db<=0)){const t=da/(da-db);out.push({u:cut,v:a.v.map((x,j)=>x+t*(b.v[j]-x))});}}return out;}
function transform(m,v){const p=M.apply(m,[v[0],v[1],v[2],1]),q=Y.StudentCenterSouth46.local([p[0],p[2]]);return[q[0],p[1],q[1]];}
function skin(a,z,lo,hi,bottom,frontFace){const g=new G.Geometry(),top=u=>Y.StudentCenter195Profile146.top(u)-.11,world=p=>{const q=Y.StudentCenterSouth46.world([p[0],p[2]]);return[q[0],p[1],q[1]];},ring=[[a,bottom],[z,bottom],[z,top(z)],[a,top(a)]],face=v=>ring.map(p=>world([p[0],p[1],v]));g.quad(...face(lo).reverse());g.quad(...face(hi));for(let i=0;i<4;i++){if(i===3||(i===1&&!frontFace))continue;const j=(i+1)%4;g.quad(world([...ring[i],lo]),world([...ring[j],lo]),world([...ring[j],hi]),world([...ring[i],hi]));}return g;}
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==195)return previous.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b.e,'add'),original=b.e.add;let count=0;
 b.e.add=function(k,g,m,c,p,uv){
  if(!/^studentcenter195-profile146-wall-(north|south)$/.test(k))return original.call(this,k,g,m,c,p,uv);
  count++;const side=k.split('-').at(-1),cut=spec.front-spec.returnDepth,points=[];for(let i=0;i<g.v.length;i+=8)points.push(transform(m,g.v.slice(i,i+3)));
  const bottom=Math.min(...points.map(p=>p[1])),lo=Math.min(...points.map(p=>p[2])),hi=Math.max(...points.map(p=>p[2]));
  if(Math.abs(Math.max(...points.map(p=>p[0]))-spec.front)>.0001||Math.abs(hi-lo-.36)>.0001)throw Error('195 end cladding: upstream envelope changed');
  const brick=new G.Geometry();for(let i=0;i<g.v.length;i+=24){const tri=[0,8,16].map(j=>({v:Array.from(g.v.slice(i+j,i+j+8)),u:points[(i+j)/8][0]}));if(tri.every(p=>p.u<=cut)){brick.v.push(...g.v.slice(i,i+24));continue;}const pp=half(tri,cut);for(let j=1;j+1<pp.length;j++){const t=[pp[0],pp[j],pp[j+1]];if(Math.hypot(...M.cross(M.sub(t[1].v.slice(0,3),t[0].v.slice(0,3)),M.sub(t[2].v.slice(0,3),t[0].v.slice(0,3))))>1e-10)for(const p of t)brick.v.push(...p.v);}}
  if(g.detailWidth!==undefined)brick.detailWidth=g.detailWidth;
  original.call(this,'studentcenter195-endcaps181-brick-'+side,brick,m,c,p,uv);
  // One union exterior: omit buried material-interface faces. The four-sided
  // joint joins the clipped brick to a stone skin with only its front closed.
  original.call(this,'studentcenter195-endcaps181-joint-'+side,skin(cut,cut+spec.joint,lo,hi,bottom,false),M.identity(),'#979b96',[24,195,0,0]);
  original.call(this,'studentcenter195-endcaps181-stone-'+side,skin(cut+spec.joint,spec.front,lo,hi,bottom,true),M.identity(),'#c8cdc6',[24,195,0,0]);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=original;else delete b.e.add;}
 if(count!==2)throw Error('195 end cladding: expected two registered parapets');return result;
};Y.StudentCenter195Endcaps181={id:ID,...spec};
})(YY);
