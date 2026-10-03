/* Yannan52: south two-house porch/terrace documented in the Beijing historical
   building protection atlas. Dimensions are photo fits, not surveyed values. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/866277594',PICK=259,PREFIX='yannan259-',C={brick:'#a4a49b',stone:'#b7b6a9',wood:'#683b32',trim:'#9b5848',glass:'#5f716e',roof:'#947563'};let last;
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK||f.properties.architecture?.strategy!=='villa')return prior.call(this,b,f,add);const saved={door:b.heritageDoor,window:b.heritageWindow,roof:b.heritageRoof,own:['heritageDoor','heritageWindow','heritageRoof'].map(k=>Object.prototype.hasOwnProperty.call(b,k))};let result;const roof=[],engineAdd=b.e.add; b.e.add=function(k,g,m,c,p,uv){if(p[0]===19)for(let i=0;i<g.v.length;i+=24){const t=[0,8,16].map(j=>Y.M.apply(m,[...g.v.slice(i+j,i+j+3),1]).slice(0,3));if(Math.abs((t[1][0]-t[0][0])*(t[2][2]-t[0][2])-(t[1][2]-t[0][2])*(t[2][0]-t[0][0]))>1e-7)roof.push(t);}return engineAdd.call(this,k,g,m,c,p,uv);};
 // Replace the old generic centre door and its two overlapping ground-window
 // bays. Roof bounds still establish exactly the same Adapter transform.
 b.heritageDoor=function(){};
 b.heritageWindow=function(x,y,z,...rest){if(y<3&&z>0&&x>=-.1&&x<=3)return;return saved.window.call(this,x,y,z,...rest);};
 b.heritageRoof=function(...args){args[7]=C.roof;return saved.roof.apply(this,args);};
 try{result=prior.call(this,b,f,add);}finally{b.e.add=engineAdd;['heritageDoor','heritageWindow','heritageRoof'].forEach((k,i)=>{if(saved.own[i])b[k]=[saved.door,saved.window,saved.roof][i];else delete b[k];});}
 closeCutWalls(f,roof,add);
 const fr=result.frame,source=Y.ARCHIVE.legacy['852'],z=source.d*2.5/2*result.scale[2],x=2.15,w=5.6,front=z+2.15,landing=.36,deck=3.25;last={...fr,x,z,front,w,landing,deck};const id=b.id;b.id=PICK;
 const box=(name,x,y,z,w,h,d,col,mat)=>b.mesh(PREFIX+name,b.geo(PREFIX+'box',Y.Geo.box),x,y,z,w,h,d,col,mat);
 try{b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  // Three shallow granite risers meet the existing .36m stone foundation.
  for(let k=0;k<3;k++){const h=(k+1)*.12,back=z-.10,end=front+.98-k*.32;box('entry-step',x,h/2,(back+end)/2,w+.38,h,end-back,C.stone,10);}
  // Two clear porch bays, brick piers and simplified capitals support the
  // continuous concrete deck; the second-storey terrace has solid brick sides.
  for(const dx of[-w/2+.24,0,w/2-.24]){box('porch-pier',x+dx,(landing+3.08)/2,front-.18,.48,3.08-landing,.54,C.brick,18);box('porch-capital',x+dx,3.055,front-.18,.65,.21,.68,C.stone,10);}
  box('porch-deck',x,(3.045+deck)/2,(z+front)/2,w+.12,deck-3.045,front-z+.26,C.stone,10);
  box('terrace-front',x,(deck+4.06)/2,front-.05,w+.08,4.06-deck+.02,.28,C.brick,18);
  for(const dx of[-w/2+.10,w/2-.10])box('terrace-side',x+dx,(deck+4.06)/2,(z+front)/2,.28,4.06-deck+.02,front-z+.12,C.brick,18);
  box('terrace-front-coping',x,4.105,front-.05,w+.24,.13,.39,C.stone,10);for(const dx of[-w/2+.10,w/2-.10])box('terrace-side-coping',x+dx,4.105,(z+front)/2,.39,.13,front-z+.14,C.stone,10);
  // Separate single-leaf doors serve the documented two-house layout.
  for(const dx of[-1.28,1.28]){const cx=x+dx,face=z+.235;
   box('door-leaf',cx,1.57,face,1.15,2.42,.075,C.wood,20);
   for(const side of[-1,1])box('door-jamb',cx+side*.61,1.59,face+.065,.105,2.48,.15,C.trim,20);
   box('door-head',cx,2.795,face+.065,1.325,.115,.15,C.trim,20);box('door-threshold',cx,.385,face+.07,1.40,.09,.43,C.stone,10);
   box('door-glass',cx,2.015,face+.049,.87,1.04,.018,C.glass,5);
   for(const side of[-1,1]){box('glazing-stile',cx+side*.452,2.015,face+.079,.045,1.12,.045,C.trim,20);box('glazing-rail',cx,2.015+side*.543,face+.079,.94,.046,.045,C.trim,20);}
   for(const cy of[.735,1.245]){box('door-panel',cx,cy,face+.053,.85,.37,.025,'#56352f',20);for(const side of[-1,1]){box('panel-stile',cx+side*.445,cy,face+.08,.038,.415,.028,C.trim,20);box('panel-rail',cx,cy+side*.196,face+.08,.925,.038,.028,C.trim,20);}}
   box('door-handle',cx+.47,1.455,face+.13,.026,.17,.055,'#858675',9);
  }
 });}finally{b.id=id;}
 return result;};
// Adapter clips a rectangular native house into the mapped concave outline.
// Its four inward edges therefore need external walls, including the gable
// portions cut through the existing roof. No speculative windows are opened.
function closeCutWalls(f,roof,add){
 const ring=f.geometry.coordinates[0],mesh=new Y.Geo.Geometry(),cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
 const height=(t,p)=>{const a=t[0],u=[t[1][0]-a[0],t[1][2]-a[2]],v=[t[2][0]-a[0],t[2][2]-a[2]],q=[p[0]-a[0],p[1]-a[2]],det=cross(u,v),s=cross(q,v)/det,r=cross(u,q)/det;return {inside:s>=-1e-5&&r>=-1e-5&&s+r<=1.00001,y:a[1]+s*(t[1][1]-a[1])+r*(t[2][1]-a[1])};};
 for(const edge of[1,2,5,6]){const a=ring[edge],z=ring[edge+1],d=[z[0]-a[0],z[1]-a[1]],at=t=>[a[0]+d[0]*t,a[1]+d[1]*t],cuts=[0,1];
  for(const tri of roof)for(let k=0;k<3;k++){const p=tri[k],q=tri[(k+1)%3],v=[q[0]-p[0],q[2]-p[2]],det=cross(d,v);if(Math.abs(det)<1e-9)continue;const w=[p[0]-a[0],p[2]-a[1]],t=cross(w,v)/det,u=cross(w,d)/det;if(t>0&&t<1&&u>=-1e-6&&u<=1.000001)cuts.push(t);}
  cuts.sort((a,b)=>a-b);for(let k=1;k<cuts.length;k++){const lo=cuts[k-1],hi=cuts[k];if(hi-lo<1e-7)continue;const mid=at((lo+hi)/2),candidates=roof.filter(t=>height(t,mid).inside);if(!candidates.length){const distance=t=>Math.min(...t.map((p,i)=>{const q=t[(i+1)%3],dx=q[0]-p[0],dz=q[2]-p[2],u=Math.max(0,Math.min(1,((mid[0]-p[0])*dx+(mid[1]-p[2])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(mid[0]-p[0]-dx*u,mid[1]-p[2]-dz*u);}));candidates.push(roof.reduce((a,b)=>distance(a)<distance(b)?a:b));}const tri=candidates.sort((a,b)=>height(b,mid).y-height(a,mid).y)[0],p=at(lo),q=at(hi),hp=height(tri,p).y,hq=height(tri,q).y;
   const points=[[p[0],.03,p[1]],[q[0],.03,q[1]],[q[0],hq,q[1]],[p[0],hp,p[1]]],len=Math.hypot(...d);if(Y.Footprints.inside([mid[0]-d[1]/len*.003,mid[1]+d[0]/len*.003],f.geometry))points.reverse();mesh.quad(...points);
  }
 }
 if(mesh.v.length)add(PREFIX+'cut-wall-shell',mesh,C.brick,18,PICK);
}
Y.Yannan259Details={id:ID,pickId:PICK,prefix:PREFIX,frame:()=>last};
})(YY);
