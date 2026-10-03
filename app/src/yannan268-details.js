/* Yannan 55, independently numbered entrance/eave photographs in the Beijing
 * historical-building atlas (2025). Fitted dimensions, not a measured survey. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/866277606';
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const names=['heritageDoor','heritageRoof','box'],saved=names.map(n=>b[n]),own=names.map(n=>Object.hasOwn(b,n)),G=Y.Geo,M=Y.M,roofFaces=[],engineAdd=b.e.add;
 b.e.add=function(k,g,m,c,p,uv){if(p[0]===19)for(let i=0;i<g.v.length;i+=24){const t=[0,8,16].map(j=>M.apply(m,[...g.v.slice(i+j,i+j+3),1]).slice(0,3));if(Math.abs((t[1][0]-t[0][0])*(t[2][2]-t[0][2])-(t[1][2]-t[0][2])*(t[2][0]-t[0][0]))>1e-7)roofFaces.push(t);}return engineAdd.call(this,k,g,m,c,p,uv);};
 // The numbered entrance photo has support posts beside the doorway, never
 // across its leaf. Remove only the erroneous central post of the five-post
 // schematic veranda; the other four posts and continuous header remain.
 b.box=function(x,y,z,w,h,d,...args){
  if(Math.abs(x)<.25&&Math.abs(y-1.93)<1e-6&&Math.abs(w-.11)<1e-6&&Math.abs(h-3.12)<1e-6&&Math.abs(d-.11)<1e-6)return;
  return saved[2].call(this,x,y,z,w,h,d,...args);
 };
 b.heritageDoor=function(x,y,z,w=1.3,h=2.5,r=0){this.local(x,y,z,r,()=>{
  const box=(key,x,y,z,w,h,d,c,mat=20)=>this.heritageBox('yannan268-'+key,x,y,z,w,h,d,c,mat,.92),wood='#8d3928',edge='#733327',glass='#617572';
  box('door-reveal',0,h/2,0,w+.17,h+.18,.22,'#4a4e46',18);
  box('single-lower-panel',0,h*.19,.14,w*.91,h*.38,.09,wood);
  box('single-glass',0,h*.625,.16,w*.77,h*.49,.028,glass,5);
  for(const s of[-1,1])box('door-stile',s*w*.465,h/2,.18,w*.07,h,.13,wood);
  for(const y of[h*.025,h*.375,h*.89,h*.98])box('door-rail',0,y,.18,w,.07,.13,wood);
  // The leaf's glazing has a long nested rectangular lattice, not two leaves.
  const rect=(key,cx,cy,w,h)=>{for(const s of[-1,1]){box(key,cx+s*w/2,cy,.23,.026,h,.04,edge);box(key,cx,cy+s*h/2,.23,w,.026,.04,edge);}};
  rect('leaf-lattice',0,h*.63,w*.52,h*.46);rect('leaf-inner-lattice',0,h*.63,w*.35,h*.40);
  box('upper-transom-glass',0,h*1.045,.13,w*.88,h*.16,.035,glass,5);
  for(const s of[-1,1])box('transom-frame',s*w*.475,h*1.045,.19,.07,h*.23,.12,wood);
  for(const y of[h*.94,h*1.15])box('transom-frame',0,y,.19,w,.085,.12,wood);
  rect('transom-lattice',0,h*1.045,w*.68,h*.095);
  box('lever-plate',-w*.40,h*.36,.255,.055,.13,.035,'#b2aa88',9);
  box('lever',-w*.355,h*.36,.28,.15,.025,.055,'#b2aa88',9);
  this.box(0,-.045,.1,w+.4,.16,.47,'#b3b4a9',10,.2);
  // Three shallow stone risers connect the source threshold to ground.
  for(let i=0;i<3;i++){const top=-y+(i+1)*y/3,front=.32+(2-i)*.30;box('entry-step',0,(-y+top)/2,front-.15,w+.55,top+y,.30,'#b3b4a9',10);}
 });};
 b.heritageRoof=function(x,y,z,w,d,h,kind,col,detailed,part){
  const oldMesh=this.mesh,oldBeam=this.beam,meshOwn=Object.hasOwn(this,'mesh'),beamOwn=Object.hasOwn(this,'beam');
  const profile=t=>(1+Math.cos(2*Math.PI*t))/2;
  this.mesh=function(k,g,x,y,z,sx,sy,sz,...args){
   if(k==='heritage-roof-gable'){
    k='yannan268-roll-roof';g=this.geo(k,()=>{const q=new G.Geometry();for(let i=0;i<48;i++){const a=-.5+i/48,c=-.5+(i+1)/48;q.quad([-.5,profile(a),a],[-.5,profile(c),c],[.5,profile(c),c],[.5,profile(a),a]);}return q;});
   }else if(k==='heritage-gable-wall'){
    const right=x>0;k='yannan268-roll-gable-'+(right?'right':'left')+'-'+d.toFixed(4);g=this.geo(k,()=>{const q=new G.Geometry();for(let i=0;i<48;i++){const a=-.5+i/48,c=-.5+(i+1)/48,points=[[0,0,a],[0,0,c],[0,profile(c*sz/d),c],[0,profile(a*sz/d),a]];if(right)points.reverse();q.quad(...points);}return q;});y+=.09;
   }else if(k==='heritage-eave-tile')y=profile(z/d)*h;
   return oldMesh.call(this,k,g,x,y,z,sx,sy,sz,...args);
  };
  // A rolled roof has no straight raised ridge bar. All eave tiles/rafters and
  // the original roof generators' remaining details are retained.
  this.beam=function(a,c,...args){if(Math.abs(a[1]-h-.03)<1e-5&&Math.abs(c[1]-h-.03)<1e-5)return;return oldBeam.call(this,a,c,...args);};
  try{return saved[1].call(this,x,y,z,w,d,h,kind,col,detailed,part);}finally{if(meshOwn)this.mesh=oldMesh;else delete this.mesh;if(beamOwn)this.beam=oldBeam;else delete this.beam;}
 };
 let result;try{result=prior.call(this,b,f,add);}finally{names.forEach((n,i)=>{if(own[i])b[n]=saved[i];else delete b[n];});b.e.add=engineAdd;}
 closeCuts(f,roofFaces,add);return result;
};
function closeCuts(f,roof,add){
 const ring=f.geometry.coordinates[0],mesh=new Y.Geo.Geometry(),cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
 const height=(t,p)=>{const a=t[0],u=[t[1][0]-a[0],t[1][2]-a[2]],v=[t[2][0]-a[0],t[2][2]-a[2]],q=[p[0]-a[0],p[1]-a[2]],det=cross(u,v),s=cross(q,v)/det,r=cross(u,q)/det;return {inside:s>=-1e-5&&r>=-1e-5&&s+r<=1.00001,y:a[1]+s*(t[1][1]-a[1])+r*(t[2][1]-a[1])};};
 for(let edge=0;edge<ring.length-1;edge++){const a=ring[edge],z=ring[edge+1],d=[z[0]-a[0],z[1]-a[1]],at=t=>[a[0]+d[0]*t,a[1]+d[1]*t],cuts=[0,1];
  for(const tri of roof)for(let k=0;k<3;k++){const p=tri[k],q=tri[(k+1)%3],v=[q[0]-p[0],q[2]-p[2]],det=cross(d,v);if(Math.abs(det)<1e-9)continue;const w=[p[0]-a[0],p[2]-a[1]],t=cross(w,v)/det,u=cross(w,d)/det;if(t>0&&t<1&&u>=-1e-6&&u<=1.000001)cuts.push(t);}
  cuts.sort((a,b)=>a-b);for(let k=1;k<cuts.length;k++){const lo=cuts[k-1],hi=cuts[k];if(hi-lo<1e-7)continue;const mid=at((lo+hi)/2),candidates=roof.filter(t=>height(t,mid).inside);if(!candidates.length)continue;const tri=candidates.sort((a,b)=>height(b,mid).y-height(a,mid).y)[0],p=at(lo),q=at(hi),hp=height(tri,p).y,hq=height(tri,q).y;
   const points=[[p[0],.03,p[1]],[q[0],.03,q[1]],[q[0],hq,q[1]],[p[0],hp,p[1]]],len=Math.hypot(...d);if(Y.Footprints.inside([mid[0]-d[1]/len*.003,mid[1]+d[0]/len*.003],f.geometry))points.reverse();mesh.quad(...points);
  }
 }
 if(mesh.v.length)add('yannan268-cut-wall-shell',mesh,'#a4a49b',18,268);
}
Y.Yannan268Details={id:ID};
})(YY);
