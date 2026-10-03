/* Wang Ko Chiang: open the existing tall south glazing through its stone
 * backing. The named reference establishes the portal, not the hidden door
 * operation or steps. Retain existing glazing, tower and source outline. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/240825554',r=.0447,c=Math.cos(r),s=Math.sin(r),origin=[415.6,702.5];
const local=p=>[(p[0]-origin[0])*c-(p[2]-origin[1])*s,p[1],(p[0]-origin[0])*s+(p[2]-origin[1])*c];
const world=(x,y,z)=>[origin[0]+x*c+z*s,y,origin[1]-x*s+z*c];
function cut(g,m){
 const out=new Y.Geo.Geometry(),planes=[[0,-3.2,1],[0,3.2,-1],[1,1.15,1],[1,9.85,-1]];
 function split(poly,axis,value,sign,inside){const q=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a.p[axis]-value)*sign,db=(b.p[axis]-value)*sign,ia=inside?da>=0:da<=0,ib=inside?db>=0:db<=0;if(ia)q.push(a);if(ia!==ib){const t=da/(da-db);q.push({v:a.v.map((v,k)=>v+t*(b.v[k]-v)),p:a.p.map((v,k)=>v+t*(b.p[k]-v))});}}return q;}
 function emit(poly){for(let j=1;j+1<poly.length;j++)for(const v of[poly[0],poly[j],poly[j+1]])out.v.push(...v.v);}
 for(let i=0;i<g.v.length;i+=24){let poly=[];for(let j=0;j<3;j++){const v=Array.from(g.v.slice(i+j*8,i+j*8+8));poly.push({v,p:local(Y.M.apply(m,[...v.slice(0,3),1]))});}
  if(!poly.every(v=>v.p[2]>-.1&&v.p[2]<.19)){emit(poly);continue;}
  for(const[axis,value,sign]of planes){if(!poly.length)break;emit(split(poly,axis,value,sign,false));poly=split(poly,axis,value,sign,true);}
 }
 return out;
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const original=b.e.add;
 b.e.add=function(k,g,m,color,p,uv){const slab=k==='box'&&color==='#805d4c'&&Math.abs(m[13]-5.55)<.0001;
  if(k==='wang30-podium'||slab)return original.call(this,'wang46-open-'+(slab?'portal':'podium'),cut(g,m),m,color,p,uv);
  return original.call(this,k,g,m,color,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{b.e.add=original;}
 // Thin reveal closes all four cut edges; its rear overlaps the source plane
 // slightly, without claiming an unseen interior room or adding a black backboard.
 const g=new Y.Geo.Geometry(),p=(x,y,z)=>world(x,y,z),back=-.065,front=.18;
 g.quad(p(-3.2,9.85,back),p(-3.2,9.85,front),p(-3.2,1.15,front),p(-3.2,1.15,back));
 g.quad(p(3.2,1.15,back),p(3.2,1.15,front),p(3.2,9.85,front),p(3.2,9.85,back));
 g.quad(p(-3.2,1.15,front),p(3.2,1.15,front),p(3.2,1.15,back),p(-3.2,1.15,back));
 g.quad(p(-3.2,9.85,back),p(3.2,9.85,back),p(3.2,9.85,front),p(-3.2,9.85,front));
 add('wang46-portal-reveal',g,'#805d4c',24,f.properties.pickId);
 return{...result,southGlazingOpening:true,doorOperationVerified:false};
};
Y.WangDetails46={id:ID,local,world,opening:[-3.2,1.15,3.2,9.85]};
})(YY);
