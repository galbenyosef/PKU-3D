/* Shaoyuan 7 east portico: official photograph distinguishes a front stone
 * screen and the northern rear EAST-facing pair of doors. All dimensions are
 * proportional fits; the inherited four front steps remain unverified. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/240832237';
function split(p,axis,value,sign){const yes=[],no=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=(a.q[axis]-value)*sign,db=(b.q[axis]-value)*sign;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v={q:a.q.map((v,k)=>v+(b.q[k]-v)*t),v:a.v.map((v,k)=>v+(b.v[k]-v)*t)};yes.push(v);no.push(v);}}return{yes,no};}
function cut(g,tr,lo,hi){const out=new G.Geometry();let changed=false;for(let i=0;i<g.v.length;i+=24){let rest=[0,8,16].map(j=>({v:Array.from(g.v.slice(i+j,i+j+8)),q:M.apply(tr,[...g.v.slice(i+j,i+j+3),1]).slice(0,3)})),parts=[];
 for(let axis=0;axis<3;axis++)for(const[v,s]of[[lo[axis],1],[hi[axis],-1]]){if(rest.length<3)continue;const q=split(rest,axis,v,s);if(q.no.length>=3)parts.push(q.no);rest=q.yes;}
 const hit=rest.length>=3&&Math.hypot(...M.cross(M.sub(rest[1].q,rest[0].q),M.sub(rest[2].q,rest[0].q)))>1e-9;
 if(!hit){out.v.push(...g.v.slice(i,i+24));continue;}changed=true;
 for(const p of parts)for(let j=1;j+1<p.length;j++){const vs=[p[0],p[j],p[j+1]];if(Math.hypot(...M.cross(M.sub(vs[1].v.slice(0,3),vs[0].v.slice(0,3)),M.sub(vs[2].v.slice(0,3),vs[0].v.slice(0,3))))>1e-10)out.v.push(...vs[0].v,...vs[1].v,...vs[2].v);}
 }if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return{g:changed?out:g,changed};}
function face(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p.reverse();if(p.length===3)g.tri(...p);else g.quad(...p);}
function box(g,x,y,z,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8)g.v.push(x+raw.v[i]*w,y+raw.v[i+1]*h,z+raw.v[i+2]*d,...raw.v.slice(i+3,i+8));}

const frame=new Float32Array([0,0,-1,0,0,1,0,0,1,0,0,0,-320.2,0,324,1]),inv=M.inverse(frame);
const lo=[3.89,.475,-.6],hi=[7.71,4.05,2.02];
A.render=function(b,f,add){if(f.properties.pickId!==125||f.properties.id!==ID)return previous.call(this,b,f,add);
 const emit=b.e.add,own=Object.hasOwn(b.e,'add'),rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p,uv});};let result;
 try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 const fret=rows.find(r=>r.k==='shaoyuan7-125-fretwork');if(!fret)throw Error('shaoyuan125 entry164 requires verified fretwork');let plate=0,bars=0,cuts=0,topStep=0;
 for(const r of rows){const t=M.multiply(inv,r.m),c=[t[12],t[13],t[14]],near=(a,b)=>Math.abs(a-b)<.0002;
  if(r.k==='box'&&near(c[0],0)&&near(c[1],.395)&&near(c[2],3.91)&&r.p[0]===10){const ps=[];for(let i=0;i<r.g.v.length;i+=8)ps.push(M.apply(t,[...r.g.v.slice(i,i+3),1]));if(near(Math.max(...ps.map(p=>p[1])),.475)&&near(Math.min(...ps.map(p=>p[2])),3.41))topStep++;}
  if(r.k==='box'&&near(c[0],0)&&near(c[1],2.1)&&near(c[2],1.8)&&r.p[0]===28){plate++;continue;}
  if(r.k==='box'&&near(c[1],2.1)&&near(c[2],1.87)&&r.c==='#705647'){bars++;continue;}
  const q=cut(r.g,t,lo,hi);if(q.changed)cuts++;if(!q.g.v.length)continue;emit.call(b.e,q.changed?'shaoyuan125-entry164-cut-'+cuts:r.k,q.g,r.m,r.c,r.p,r.uv);
 }
 if(plate!==1||bars!==6||cuts<1||topStep!==1)throw Error('shaoyuan125 entry164 upstream changed '+[plate,bars,cuts,topStep]);
 const stone=new G.Geometry(),grille=new G.Geometry(),frames=new G.Geometry(),glass=new G.Geometry(),pulls=new G.Geometry(),room=new G.Geometry(),floor=new G.Geometry();
 const a=-3.31,slot=.52,panel=(6.62-3*slot)/3;
 for(let i=0;i<3;i++){const x=a+i*(slot+panel);box(stone,x+slot+panel/2,2.3,3.1,panel,4.6,.65);
  for(let j=0;j<fret.g.v.length;j+=24){let p=[0,8,16].map(k=>({q:Array.from(fret.g.v.slice(j+k,j+k+3)),v:Array.from(fret.g.v.slice(j+k,j+k+8))}));for(const [v,sgn]of[[-slot/2,1],[slot/2,-1]])p=split(p,0,v,sgn).yes;
   for(let k=1;k+1<p.length;k++){const vs=[p[0],p[k],p[k+1]].map(v=>{const q=v.v.slice();q[0]+=x+slot/2;q[2]+=3.05;return q;});if(Math.hypot(...M.cross(M.sub(vs[1].slice(0,3),vs[0].slice(0,3)),M.sub(vs[2].slice(0,3),vs[0].slice(0,3))))>1e-10)grille.v.push(...vs[0],...vs[1],...vs[2]);}
  }
 }
 const edges=[3.89,4.47,5.8,7.13,7.71],bottom=.475,top=4.05,z=1.8,t=.065;
 for(let i=0;i<4;i++){const l=edges[i]+t/2+(i? .008:0),r=edges[i+1]-t/2-(i===3?0:.008),x=(l+r)/2;
  for(const q of[l,r])box(frames,q,(bottom+top)/2,z,t,top-bottom,.13);
  for(const y of[bottom+t/2,top-t/2])box(frames,x,y,z,r-l,t,.13);
  box(glass,x,(bottom+top)/2,1.765,r-l-t,top-bottom-2*t,.027);
 }
 box(frames,5.8,(4.05+4.6)/2,1.8,3.82,4.6-4.05,.13);
 for(const x of[5.76,5.84]){box(pulls,x,2.275,1.985,.035,1.75,.045);for(const y of[1.44,3.11])box(pulls,x,y,1.91,.032,.04,.17);}
 // Pale finite enclosure, not an infinite tunnel or unverified complete room.
 face(room,[[lo[0],bottom,lo[2]],[hi[0],bottom,lo[2]],[hi[0],top,lo[2]],[lo[0],top,lo[2]]],[0,0,1]);
 for(const [x,n]of[[lo[0],1],[hi[0],-1]])face(room,[[x,bottom,lo[2]],[x,top,lo[2]],[x,top,1.8],[x,bottom,1.8]],[n,0,0]);
 face(room,[[lo[0],top,lo[2]],[lo[0],top,1.8],[hi[0],top,1.8],[hi[0],top,lo[2]]],[0,-1,0]);
 // Exact rear edge and top of the retained highest tread: z3.41, y.475.
 box(floor,(3.89+9.9)/2,bottom/2,(-.6+3.41)/2,9.9-3.89,bottom,3.41+.6);
 // North bypass ramp meets the platform, outside the inherited stair width.
 const ramp=new G.Geometry(),x0=8.5,x1=9.9,z0=3.41,z1=6.5;
 face(ramp,[[x0,bottom,z0],[x1,bottom,z0],[x1,0,z1],[x0,0,z1]],[0,1,0]);
 face(ramp,[[x0,0,z0],[x1,0,z0],[x1,bottom,z0],[x0,bottom,z0]],[0,0,-1]);
 face(ramp,[[x0,0,z0],[x0,0,z1],[x1,0,z1],[x1,0,z0]],[0,-1,0]);
 for(const[x,n]of[[x0,-1],[x1,1]])face(ramp,[[x,0,z0],[x,bottom,z0],[x,0,z1]],[n,0,0]);
 function send(k,g,c,mat){emit.call(b.e,'shaoyuan125-entry164-'+k,g,frame,c,[mat,125,0,.8]);}
 send('stone-screen',stone,'#d8d1bc',24);send('screen-grille',grille,'#646c63',29);send('door-frame',frames,'#705647',29);send('glass',glass,'#4c615d',28);send('pulls',pulls,'#a98354',29);send('return',room,'#c9c6b6',24);send('floor',floor,'#b9bdaf',10);send('north-ramp',ramp,'#b9bdaf',10);
 return result;
};Y.Shaoyuan125Entry164={frame,opening:[lo,hi],floor:.475,doorFacing:'east',northernBypass:true,frontStepsVerified:false};
})(YY);
