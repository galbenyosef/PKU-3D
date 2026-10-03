/* Photographed east low-wing grouping; existing arch/map/roof remain anchors.
 * Recess .32 source units and wall thickness are conditional fits, not survey.
 * Three lower lights stop behind retained stonework; no claimed hidden sill. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo;
function split(p,axis,value,sign){const yes=[],no=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=(a.q[axis]-value)*sign,db=(b.q[axis]-value)*sign;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v={q:a.q.map((v,k)=>v+(b.q[k]-v)*t),v:a.v.map((v,k)=>v+(b.v[k]-v)*t)};yes.push(v);no.push(v);}}return{yes,no};}
function cut(g,tr,lo,hi){const out=new G.Geometry();let changed=false;for(let i=0;i<g.v.length;i+=24){let rest=[0,8,16].map(j=>({v:Array.from(g.v.slice(i+j,i+j+8)),q:M.apply(tr,[...g.v.slice(i+j,i+j+3),1]).slice(0,3)})),parts=[];
 for(let axis=0;axis<3;axis++)for(const[v,s]of[[lo[axis],1],[hi[axis],-1]]){if(rest.length<3)continue;const q=split(rest,axis,v,s);if(q.no.length>=3)parts.push(q.no);rest=q.yes;}
 const hit=rest.length>=3&&Math.hypot(...M.cross(M.sub(rest[1].q,rest[0].q),M.sub(rest[2].q,rest[0].q)))>1e-9;
 if(!hit){out.v.push(...g.v.slice(i,i+24));continue;}changed=true;
 for(const p of parts)for(let j=1;j+1<p.length;j++){const vs=[p[0],p[j],p[j+1]];if(Math.hypot(...M.cross(M.sub(vs[1].v.slice(0,3),vs[0].v.slice(0,3)),M.sub(vs[2].v.slice(0,3),vs[0].v.slice(0,3))))>1e-10)out.v.push(...vs[0].v,...vs[1].v,...vs[2].v);}
 }if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return{g:changed?out:g,changed};}
function face(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p.reverse();if(p.length===3)g.tri(...p);else g.quad(...p);}
function box(g,x,y,z,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8)g.v.push(x+raw.v[i]*w,y+raw.v[i+1]*h,z+raw.v[i+2]*d,...raw.v.slice(i+3,i+8));}


const X0=27.1,X1=40.4,Y0=5.05,Y1=10.1;
const windows=[{x:29.25,w:.92,y0:7.45,y1:9.35,z:-.07,n:1},{x:33.75,w:3.3,y0:7.45,y1:9.35,z:-.39,n:5},{x:38.25,w:.92,y0:7.45,y1:9.35,z:-.07,n:1},...[32.55,33.65,34.75].map(x=>({x,w:.74,y0:5.0,y1:6.41,z:-.39,n:1,hiddenBottom:true}))];
function geometry(){const wall=new G.Geometry(),frame=new G.Geometry(),glass=new G.Geometry();
 const zones=[[X0,31.5,-.07],[31.5,36.15,-.39],[36.15,X1,-.07]],back=-.82;
 for(const[l,r,z]of zones){const holes=windows.filter(h=>h.x>=l&&h.x<r),xs=[l,r,...holes.flatMap(h=>[h.x-h.w/2,h.x+h.w/2])].sort((a,b)=>a-b),ys=[Y0,Y1,...holes.flatMap(h=>[Math.max(Y0,h.y0),h.y1])].sort((a,b)=>a-b);
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){const a=xs[i],b=xs[i+1],c=ys[j],d=ys[j+1],cx=(a+b)/2,cy=(c+d)/2;if(b-a<1e-8||d-c<1e-8||holes.some(h=>cx>h.x-h.w/2&&cx<h.x+h.w/2&&cy>h.y0&&cy<h.y1))continue;
   face(wall,[[a,c,z],[b,c,z],[b,d,z],[a,d,z]],[0,0,1]);face(wall,[[a,c,back],[b,c,back],[b,d,back],[a,d,back]],[0,0,-1]);
  }
  // Real reveal surfaces, joining front plaster to finite backing plane.
  for(const h of holes){const a=h.x-h.w/2,b=h.x+h.w/2,c=Math.max(Y0,h.y0),d=h.y1;for(const[x,n]of[[a,1],[b,-1]])face(wall,[[x,c,z],[x,d,z],[x,d,back],[x,c,back]],[n,0,0]);face(wall,[[a,d,z],[b,d,z],[b,d,back],[a,d,back]],[0,-1,0]);if(!h.hiddenBottom)face(wall,[[a,c,z],[b,c,z],[b,c,back],[a,c,back]],[0,1,0]);}
  for(const[y,n]of[[Y0,-1],[Y1,1]])face(wall,[[l,y,z],[r,y,z],[r,y,back],[l,y,back]],[0,n,0]);
 }
 // Only outer ends and the two photographed step returns, no duplicate
 // full internal zone walls and no alteration of the retained stone base.
 for(const[x,a,b,n]of[[X0,-.07,back,-1],[X1,-.07,back,1],[31.5,-.07,-.39,1],[36.15,-.39,-.07,-1]])face(wall,[[x,Y0,a],[x,Y1,a],[x,Y1,b],[x,Y0,b]],[n,0,0]);
 for(const h of windows){const t=.065,depth=.10,z=h.z-.06,wide=h.w/h.n;for(let i=0;i<h.n;i++){const l=h.x-h.w/2+i*wide,r=l+wide,c=(l+r)/2,bot=h.y0,top=h.y1;
   for(const x of[l+t/2,r-t/2])box(frame,x,(bot+top)/2,z,t,top-bot,depth);
   box(frame,c,top-t/2,z,wide-2*t,t,depth);if(!h.hiddenBottom)box(frame,c,bot+t/2,z,wide-2*t,t,depth);
   box(glass,c,(bot+top)/2,z-.055,wide-2*t,top-bot-(h.hiddenBottom?t:2*t),.02);
   // Visible nested rectangles are proportional, not invented carving.
   const w=wide-2*t-.075,a=bot+.24*(top-bot),b=top-.20*(top-bot);if(w>0){for(const x of[c-w/2,c+w/2])box(frame,x,(a+b)/2,z+.015,.025,b-a,.045);for(const y of[a,b])box(frame,c,y,z+.015,w,.025,.045);}
  }}return{wall,frame,glass};
}
A.render=function(b,f,add){if(f.properties.pickId!==115||f.properties.id!=='way/240832226')return previous.call(this,b,f,add);const emit=b.e.add,own=Object.hasOwn(b.e,'add'),rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m,c,p,uv});};let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 const arch=rows.find(r=>r.k==='firstgym-entry161-recess');if(!arch)throw Error('gym301 requires retained entry161');const frame=new Float32Array(arch.m);for(let j=0;j<3;j++)frame[12+j]-=frame[j]*29.4+frame[j+4]*2.25;const inv=M.inverse(frame);let walls=0,removed=0;const changed=[];
 for(let i=0;i<rows.length;i++){const r=rows[i];if(!/^v30-v18-(wing-(upper-)?window|window-(frame|mullion|sill)|engaged-column)$/.test(r.k)&&r.k!=='v30-clipped-115-firstgym-#e1ddd0|24|0'){emit.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);continue;}const tr=M.multiply(inv,r.m),lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(let j=0;j<r.g.v.length;j+=8){const p=M.apply(tr,[...r.g.v.slice(j,j+3),1]);for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],p[k]);hi[k]=Math.max(hi[k],p[k]);}}const cx=(lo[0]+hi[0])/2;
  if(r.k==='v30-clipped-115-firstgym-#e1ddd0|24|0'){const q=cut(r.g,tr,[X0,Y0,-.821],[X1,Y1,.5]);if(!q.changed)throw Error('missing white-wall cut');emit.call(b.e,'firstgym-wing301-retained-wall',q.g,r.m,r.c,r.p,r.uv);walls++;changed.push(i);continue;}
  const oldWindow=/^v30-v18-(wing-(upper-)?window|window-(frame|mullion|sill))$/.test(r.k),column=r.k==='v30-v18-engaged-column'&&Math.abs(cx-36)<.01;
  if((oldWindow||column)&&cx>X0&&cx<X1&&lo[1]>4.8&&hi[1]<9.95&&lo[2]>-.3&&hi[2]<.5){removed++;changed.push(i);continue;}
  emit.call(b.e,r.k,r.g,r.m,r.c,r.p,r.uv);
 }
 if(walls!==1||removed<30)throw Error('gym301 source window topology changed');const q=geometry();for(const[name,c,mat]of[['wall','#e1ddd0',24],['frame','#914435',20],['glass','#46575a',5]])emit.call(b.e,'firstgym-wing301-'+name,q[name],frame,c,[mat,115,0,.6]);Y.FirstgymWing301.last={changed,removed,frame:Array.from(frame)};return result;
};Y.FirstgymWing301={windows,zones:[[X0,31.5,-.07],[31.5,36.15,-.39],[36.15,X1,-.07]],geometry,limits:{recessSourceUnits:.32,hiddenLowerSillUnknown:true,wholeWingVerified:false}};
})(YY);
