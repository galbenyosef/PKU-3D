/* International Studies A–B west entry, registered to the retained five steel
 * bays and three canopies in official photographs. Door/sidelight proportions
 * and finite interior depth are photographic fits, not measured construction. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/240832232';
function split(p,axis,value,sign){const yes=[],no=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=(a.q[axis]-value)*sign,db=(b.q[axis]-value)*sign;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),v={q:a.q.map((v,k)=>v+(b.q[k]-v)*t),v:a.v.map((v,k)=>v+(b.v[k]-v)*t)};yes.push(v);no.push(v);}}return{yes,no};}
function cut(g,tr,lo,hi){const out=new G.Geometry();let changed=false;for(let i=0;i<g.v.length;i+=24){let rest=[0,8,16].map(j=>({v:Array.from(g.v.slice(i+j,i+j+8)),q:M.apply(tr,[...g.v.slice(i+j,i+j+3),1]).slice(0,3)})),parts=[];
 for(let axis=0;axis<3;axis++)for(const[v,s]of[[lo[axis],1],[hi[axis],-1]]){if(rest.length<3)continue;const q=split(rest,axis,v,s);if(q.no.length>=3)parts.push(q.no);rest=q.yes;}
 const hit=rest.length>=3&&Math.hypot(...M.cross(M.sub(rest[1].q,rest[0].q),M.sub(rest[2].q,rest[0].q)))>1e-9;
 if(!hit){out.v.push(...g.v.slice(i,i+24));continue;}changed=true;
 for(const p of parts)for(let j=1;j+1<p.length;j++){const vs=[p[0],p[j],p[j+1]];if(Math.hypot(...M.cross(M.sub(vs[1].v.slice(0,3),vs[0].v.slice(0,3)),M.sub(vs[2].v.slice(0,3),vs[0].v.slice(0,3))))>1e-10)out.v.push(...vs[0].v,...vs[1].v,...vs[2].v);}
 }if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return{g:changed?out:g,changed};}
function face(g,p,n){if(M.dot(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0])),n)<0)p.reverse();g.quad(...p);}
function box(g,x,y,z,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8)g.v.push(x+raw.v[i]*w,y+raw.v[i+1]*h,z+raw.v[i+2]*d,...raw.v.slice(i+3,i+8));}
A.render=function(b,f,add){if(f.properties.pickId!==120||f.properties.id!==ID)return previous.call(this,b,f,add);
 const emit=b.e.add,own=Object.prototype.hasOwnProperty.call(b.e,'add'),rows=[];b.e.add=function(k,g,m,c,p,uv){rows.push({k,g,m:new Float32Array(m),c,p,uv});};let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 const registration=Y.Sis120Details.frame(),bay=registration.length/5,frame=M.transform([registration.centre[0],0,registration.centre[1]],[1,1,1],registration.r),inv=M.inverse(frame),centres=[-bay,0,bay],half=(bay-.60)/2;
 if(rows.filter(r=>r.k==='sis120-entrance-steel-box').length!==19||rows.filter(r=>r.k==='sis43-glass-link-walls').length!==1)throw Error('sis120 entry162 registration changed');
 let cuts=0;
 for(const r of rows){let g=r.g;if(r.k==='sis43-glass-link-walls'||(r.k==='box'&&r.c==='#a9b7b2'&&r.p[0]===29)){const tr=M.multiply(inv,r.m);for(const x of centres)g=cut(g,tr,[x-half,.03,-.30],[x+half,3.324,.12]).g;}
  emit.call(b.e,g===r.g?r.k:'sis120-entry162-cut-'+cuts++,g,r.m,r.c,r.p,r.uv);
 }
 if(cuts<4)throw Error('sis120 entry162 expected obstructing curtain and mullions');
 const frames=new G.Geometry(),glass=new G.Geometry(),handles=new G.Geometry(),bottom=.03,head=2.55,top=3.324,z=-.18,bar=.075,leafHalf=1.14;
 for(const cx of centres){const left=cx-half,right=cx+half;
  // Fixed sidelights flank a central pair; the upper light is a separate frame.
  for(const x of[left+bar/2,cx-leafHalf,cx+leafHalf,right-bar/2])box(frames,x,(bottom+top)/2,z,bar,top-bottom,.12);
  for(const y of[head,top-bar/2])box(frames,cx,y,z,2*half-2*bar,bar,.12);
  for(const [a,b]of[[left+bar,cx-leafHalf-bar/2],[cx+leafHalf+bar/2,right-bar]]){
   box(glass,(a+b)/2,(bottom+bar+head-bar/2)/2,z-.015,b-a,head-bottom-1.5*bar,.035);
   box(frames,(a+b)/2,bottom+bar/2,z,b-a,bar,.12);
   box(frames,(a+b)/2,1.05,z,b-a,.045,.12);
  }
  for(const s of[-1,1]){const a=cx+(s<0?-leafHalf:0)+bar/2+.008,c=a+leafHalf-bar-.016;
   const leafFrame=new G.Geometry(),leafGlass=new G.Geometry(),leafPull=new G.Geometry();
   for(const x of[a+bar/2,c-bar/2])box(leafFrame,x,(bottom+head)/2,z,bar,head-bottom,.12);
   for(const y of[bottom+bar/2,head-bar/2])box(leafFrame,(a+c)/2,y,z,c-a-2*bar,bar,.12);
   box(leafGlass,(a+c)/2,(bottom+head)/2,z-.015,c-a-2*bar,head-bottom-2*bar,.035);
   box(leafFrame,(a+c)/2,1.05,z,c-a-2*bar,.045,.12);
   const hx=cx+s*.12;box(leafPull,hx,1.26,z+.125,.025,.55,.025);for(const y of[1.02,1.50])box(leafPull,hx,y,z+.083,.025,.025,.084);
   // Foundation photograph registers the visible open pair to the middle of
   // the three canopies. The cropped first and closed third groups stay shut.
   const hinge=s<0?a:c,angle=cx===0?s*Math.PI/3:0,rotation=M.multiply(M.transform([hinge,0,z],[1,1,1],angle),M.transform([-hinge,0,-z],[1,1,1],0));
   for(const [src,dst]of[[leafFrame,frames],[leafGlass,glass],[leafPull,handles]])for(let i=0;i<src.v.length;i+=8){const p=M.apply(rotation,[...src.v.slice(i,i+3),1]),n=M.apply(rotation,[...src.v.slice(i+3,i+6),0]);dst.v.push(...p.slice(0,3),...n.slice(0,3),...src.v.slice(i+6,i+8));}
  }
  for(const[a,b]of[[left+bar,cx-leafHalf-bar/2],[cx-leafHalf+bar/2,cx+leafHalf-bar/2],[cx+leafHalf+bar/2,right-bar]])box(glass,(a+b)/2,(head+bar/2+top-bar)/2,z-.015,b-a,top-head-1.5*bar,.035);
 }
 emit.call(b.e,'sis120-entry162-frames',frames,frame,'#344c50',[29,120,0,.72]);emit.call(b.e,'sis120-entry162-glass',glass,frame,'#536d70',[5,120,0,.73]);emit.call(b.e,'sis120-entry162-pulls',handles,frame,'#aab5af',[29,120,0,.74]);
 const room=new G.Geometry(),wide=bay+half,back=-1.4;
 face(room,[[-wide,bottom,back],[wide,bottom,back],[wide,top,back],[-wide,top,back]],[0,0,1]);
 for(const s of[-1,1])face(room,[[s*wide,bottom,back],[s*wide,top,back],[s*wide,top,0],[s*wide,bottom,0]],[-s,0,0]);
 face(room,[[-wide,top,back],[-wide,top,-.011],[wide,top,-.011],[wide,top,back]],[0,-1,0]);
 emit.call(b.e,'sis120-entry162-finite-return',room,frame,'#b2b5a5',[18,120,0,.75]);
 const floor=new G.Geometry();box(floor,0,.015,(back+1.84)/2,wide*2,.03,1.84-back);emit.call(b.e,'sis120-entry162-threshold-floor',floor,frame,'#b5b9ae',[10,120,0,.76]);
 return result;
};Y.Sis120Entry162={id:ID,bottom:.03,head:2.55,top:3.324,back:-1.4,doorPlane:-.18,leafHalf:1.14,openGroup:1,openAngleFit:Math.PI/3};
})(YY);
