/* First Gymnasium east arch: official 2017 oblique photograph. The existing
 * arch registration is retained; recess depth and stair proportions are fits.
 * Door leaves and the stone balustrade's fine relief are not established. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
const S={width:2.25,height:2.65,base:2.25,back:-1.2,steps:10};
function split(poly,n,c){const yes=[],no=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=M.dot(a.q,n)-c,db=M.dot(b.q,n)-c;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v={q:a.q.map((v,k)=>v+(b.q[k]-v)*t),v:a.v.map((v,k)=>v+(b.v[k]-v)*t)};yes.push(v);no.push(v);}}return{yes,no};}
function face(g,ps,n){if(M.dot(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0])),n)<0)ps.reverse();g.quad(...ps);}
A.render=function(b,f,add){if(f.properties.pickId!==115||f.properties.id!=='way/240832226')return previous.call(this,b,f,add);
 const emit=b.e.add,rows=[],gym=b.firstGymHistoric,ownGym=Object.prototype.hasOwnProperty.call(b,'firstGymHistoric'),ownAdd=Object.prototype.hasOwnProperty.call(b.e,'add');let depth;
 b.firstGymHistoric=function(p,w,d){depth=d;return gym.call(this,p,w,d);};
 b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p,uv});};let result;
 try{result=previous.call(this,b,f,add);}finally{if(ownAdd)b.e.add=emit;else delete b.e.add;if(ownGym)b.firstGymHistoric=gym;else delete b.firstGymHistoric;}
 const arch=rows.filter(r=>r.k==='v30-v18-arch-reveal');if(arch.length!==1||!depth)throw Error('firstgym161 registration changed');
 const frame=new Float32Array(arch[0].m);for(let j=0;j<3;j++){frame[j]/=S.width;frame[4+j]/=S.height;}const inv=M.inverse(frame);
 const ring=[[-S.width/2,0],[S.width/2,0]];for(let i=0;i<=24;i++){const a=i*Math.PI/24;ring.push([S.width/2*Math.cos(a),S.height*(.56+.44*Math.sin(a))]);}
 const planes=ring.map((p,i)=>{const q=ring[(i+1)%ring.length],n=[-(q[1]-p[1]),q[0]-p[0],0];return[n,n[0]*p[0]+n[1]*p[1]];});planes.push([[0,0,1],S.back],[[0,0,-1],-.26]);
 let changed=0,removedSteps=0,removedArchStones=0,jambs=0;
 for(const r of rows){if(r.k==='v30-v18-arch-stone'){removedArchStones++;continue;}if(['v30-v18-arch-reveal','v30-v18-arch-door','v30-v18-arch-door-bar'].includes(r.k))continue;
  // Adapter clips away nine stair slabs and may bake remaining slab fragments.
  // These parts are replaced by one continuous supported stair, outside the OSM
  // building ring, without broadening clipping for any other source component.
  if(r.p[3]===.04&&r.c==='#b8bcaf'){removedSteps++;continue;}
  const tr=M.multiply(inv,r.m),out=new G.Geometry();let touched=false;
  if(r.k==='v30-v18-arch-jamb'){
   const g=new G.Geometry(),back=M.inverse(tr);g.v=Array.from(r.g.v);
   for(let i=0;i<g.v.length;i+=8){const q=M.apply(tr,[...g.v.slice(i,i+3),1]);q[2]=-.07+(q[2]+.05)/.30*.10;const p=M.apply(back,q);for(let j=0;j<3;j++)g.v[i+j]=p[j];}
   emit.call(b.e,'firstgym-entry161-jamb-'+jambs++,g,r.m,r.c,r.p,r.uv);continue;
  }
  for(let i=0;i<r.g.v.length;i+=24){let rest=[0,8,16].map(j=>({v:Array.from(r.g.v.slice(i+j,i+j+8)),q:M.apply(tr,[...r.g.v.slice(i+j,i+j+3),1]).slice(0,3)})),parts=[];
   for(const[n,c]of planes){if(rest.length<3)break;const s=split(rest,n,c);if(s.no.length>=3)parts.push(s.no);rest=s.yes;}
   const intersects=rest.length>=3&&Math.hypot(...M.cross(M.sub(rest[1].q,rest[0].q),M.sub(rest[2].q,rest[0].q)))>1e-9;
   if(!intersects){out.v.push(...r.g.v.slice(i,i+24));continue;}touched=true;
   for(const p of parts)for(let j=1;j+1<p.length;j++){const vs=[p[0],p[j],p[j+1]];if(Math.hypot(...M.cross(M.sub(vs[1].v.slice(0,3),vs[0].v.slice(0,3)),M.sub(vs[2].v.slice(0,3),vs[0].v.slice(0,3))))>1e-10)out.v.push(...vs[0].v,...vs[1].v,...vs[2].v);}
  }
  if(touched){if(r.g.detailWidth!==undefined)out.detailWidth=r.g.detailWidth;emit.call(b.e,'firstgym-entry161-cut-'+changed++,out,r.m,r.c,r.p,r.uv);}else emit.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);
 }
 if(changed<1||removedSteps<1||removedArchStones!==19||jambs!==2)throw Error('firstgym161 wall/stair source changed');
 const cavity=new G.Geometry();for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];if(i===0)continue;face(cavity,[[...p,S.back],[...q,S.back],[...q,0],[...p,0]],[-(q[1]-p[1]),q[0]-p[0],0]);}
 for(let i=1;i+1<ring.length;i++)cavity.tri([...ring[0],S.back],[...ring[i],S.back],[...ring[i+1],S.back]);
 emit.call(b.e,'firstgym-entry161-recess',cavity,frame,'#70766e',[10,115,0,.51]);
 // Continuous dressed-stone arch, replacing the old stair-stepped boxes.
 // Nineteen fitted voussoir divisions are retained as shallow recessed joints;
 // their count/projection is not a stone-by-stone survey. Inner vertices share
 // the existing opening's 24 chord segments exactly, including all breakpoints.
 const stone=new G.Geometry(),angles=[0,Math.PI],jointHalf=.006;
 for(let i=1;i<76;i++)angles.push(i*Math.PI/76);
 for(let i=1;i<24;i++)angles.push(i*Math.PI/24);
 for(let i=1;i<19;i++){const a=i*Math.PI/19;angles.push(a-jointHalf,a,a+jointHalf);}
 const knots=angles.sort((a,b)=>a-b).filter((a,i,all)=>!i||a-all[i-1]>1e-10);
 function section(a){const t=a/Math.PI*24,j=Math.min(23,Math.floor(t)),f=t-j,p=ring[j+2],q=ring[j+3],inner=[p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f];
  const outer=[(S.width/2+.28)*Math.cos(a),S.height*.56+(S.height*.44+.28)*Math.sin(a)];let z=.03;
  for(let k=1;k<19;k++)z=Math.min(z,.03-.012*Math.max(0,1-Math.abs(a-k*Math.PI/19)/jointHalf));
  return{inner,outer,z};
 }
 for(let i=0;i+1<knots.length;i++){const p=section(knots[i]),q=section(knots[i+1]),a=(knots[i]+knots[i+1])/2;
  face(stone,[[...p.inner,p.z],[...p.outer,p.z],[...q.outer,q.z],[...q.inner,q.z]],[0,0,1]);
  face(stone,[[...p.inner,0],[...p.inner,p.z],[...q.inner,q.z],[...q.inner,0]],[-Math.cos(a),-Math.sin(a),0]);
  face(stone,[[...p.outer,-.07],[...q.outer,-.07],[...q.outer,q.z],[...p.outer,p.z]],[Math.cos(a),Math.sin(a),0]);
 }
 emit.call(b.e,'firstgym-entry161-arch-ring',stone,frame,'#bcbcaf',[10,115,0,.53]);
 const stair=new G.Geometry(),width=3.25,front=.03*depth+3.87,run=.33,landingFront=front-9*run,ground=-S.base;
 // Closed union boundary: no stacked boxes or coplanar internal tread faces.
 const profile=[[S.back,ground],[front,ground]];for(let i=0;i<10;i++){const z=front-i*run,y=ground+(i+1)*S.base/10;profile.push([z,y],[i===9?S.back:z-run,y]);}
 for(let i=0;i<profile.length;i++){const p=profile[i],q=profile[(i+1)%profile.length];face(stair,[[-width/2,p[1],p[0]],[width/2,p[1],p[0]],[width/2,q[1],q[0]],[-width/2,q[1],q[0]]],[0,p[0]-q[0],q[1]-p[1]]);}
 // Each side is triangulated as a fan from the rear ground point; the monotone
 // rising stair profile makes this fan interior and closes its full support.
 for(const s of[-1,1])for(let i=1;i+1<profile.length;i++){const pts=[profile[0],profile[i],profile[i+1]].map(p=>[s*width/2,p[1],p[0]]);if(s>0)pts.reverse();if(Math.hypot(...M.cross(M.sub(pts[1],pts[0]),M.sub(pts[2],pts[0])))>1e-10)stair.tri(...pts);}
 emit.call(b.e,'firstgym-entry161-stair',stair,frame,'#b8bcaf',[10,115,0,.04]);
 const wall=new G.Geometry(),x=-width/2-.16,thick=.32,topFront=ground+.65,topRear=.78,zRear=-.07;
 const cross=[[front,ground],[front,topFront],[landingFront,topRear],[zRear,topRear],[zRear,ground]];
 for(let i=0;i<cross.length;i++){const p=cross[i],q=cross[(i+1)%cross.length];face(wall,[[x-thick/2,p[1],p[0]],[x+thick/2,p[1],p[0]],[x+thick/2,q[1],q[0]],[x-thick/2,q[1],q[0]]],[0,p[0]-q[0],q[1]-p[1]]);}
 for(const s of[-1,1])for(let i=1;i+1<cross.length;i++){const pts=[cross[0],cross[i],cross[i+1]].map(p=>[x+s*thick/2,p[1],p[0]]);if(s>0)pts.reverse();wall.tri(...pts);}
 emit.call(b.e,'firstgym-entry161-stone-side',wall,frame,'#b6b9ac',[10,115,0,.53]);
 return result;
};Y.FirstGymEntry161=S;
})(YY);
