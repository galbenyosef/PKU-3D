/* Kaiyuan pick102 east two-storey hall, fitted to the original official opening
 * photograph. Floor plan is the source polygon, not a measured building survey.
 * Three glazing bays/two piers are visible; leaf count and hardware unresolved. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,M=Y.M,G=Y.Geo,ID='way/240825569';
function frame(f){const ring=Y.Footprints.polygons(f.geometry)[0][0],ps=ring.slice(0,-1),east=ps.slice().sort((a,b)=>b[0]-a[0]).slice(0,2).sort((a,b)=>a[1]-b[1]);
 const n=east[1],s=east[0],dx=s[0]-n[0],dz=s[1]-n[1],length=Math.hypot(dx,dz),u=[dx/length,dz/length],out=[-u[1],u[0]],matrix=M.transform([n[0],0,n[1]],[1,1,1],Math.atan2(-u[1],u[0]));
 return{n,s,length,u,out,matrix,local:p=>[(p[0]-n[0])*u[0]+(p[2]-n[1])*u[1],p[1],(p[0]-n[0])*out[0]+(p[2]-n[1])*out[1]]};}
function clip(poly,axis,value,keepLow){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a.q[axis]-value)*(keepLow?1:-1),db=(b.q[axis]-value)*(keepLow?1:-1),ia=da<=0,ib=db<=0;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push({v:a.v.map((x,j)=>x+t*(b.v[j]-x)),q:a.q.map((x,j)=>x+t*(b.q[j]-x))});}}return out;}
function subtract(g,m,F,cut){const mesh=new G.Geometry();let changed=false;
 for(let i=0;i<g.v.length;i+=24){let inside=[0,8,16].map(j=>{const v=Array.from(g.v.slice(i+j,i+j+8));return{v,q:F.local(M.apply(m,[...v.slice(0,3),1]))};}),parts=[];
  if([0,1,2].some(a=>inside.every(p=>p.q[a]<cut[a])||inside.every(p=>p.q[a]>cut[a+3]))){mesh.v.push(...g.v.slice(i,i+24));continue;}
  for(const[axis,value,keepLow]of[[0,cut[0],true],[0,cut[3],false],[1,cut[1],true],[1,cut[4],false],[2,cut[2],true],[2,cut[5],false]]){if(!inside.length)break;const outside=clip(inside,axis,value,keepLow);if(outside.length>=3)parts.push(outside);inside=clip(inside,axis,value,!keepLow);}
  if(inside.length>=3)changed=true;
  for(const p of parts)for(let j=1;j<p.length-1;j++){const t=[p[0].v,p[j].v,p[j+1].v].map(v=>v.map((x,k)=>k<3?Math.fround(x):x)),n=M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0]));if(M.dot(n,n)>1e-18&&M.dot(n,t[0].slice(3,6))>0)for(const v of t)mesh.v.push(...v);}
 }return changed?mesh:g;
}
function box(g,x,y,z,w,h,d){const raw=G.box();for(let i=0;i<raw.v.length;i+=8)g.v.push(x+raw.v[i]*w,y+raw.v[i+1]*h,z+raw.v[i+2]*d,...raw.v.slice(i+3,i+8));}
function northFrame(f){const p=Y.Footprints.polygons(f.geometry)[0][0].slice(0,-1).sort((a,b)=>a[1]-b[1]).slice(0,2).sort((a,b)=>b[0]-a[0]),n=p[0],s=p[1],length=Math.hypot(s[0]-n[0],s[1]-n[1]),u=[(s[0]-n[0])/length,(s[1]-n[1])/length],out=[-u[1],u[0]],rotation=Math.atan2(-u[1],u[0]);return{n,s,length,u,out,rotation,matrix:M.transform([n[0],0,n[1]],[1,1,1],rotation),local:p=>[(p[0]-n[0])*u[0]+(p[2]-n[1])*u[1],p[1],(p[0]-n[0])*out[0]+(p[2]-n[1])*out[1]]};}
function northWall(f,N,base,top){let p=Y.Footprints.polygons(f.geometry)[0][0].slice(0,-1).map(v=>{const q=N.local([v[0],0,v[1]]);return{v:q,q};});for(const[a,k,low]of[[0,0,false],[0,N.length*.44,true],[2,-.35,false],[2,0,true]])p=clip(p,a,k,low);let points=p.map(v=>[v.q[0],v.q[2]]);points=points.filter((v,i)=>Math.hypot(v[0]-points[(i+1)%points.length][0],v[1]-points[(i+1)%points.length][1])>1e-7);if(Y.Footprints.area([...points,points[0]])>0)points.reverse();const g=new G.Geometry();for(let i=1;i<points.length-1;i++){g.tri(...[points[0],points[i],points[i+1]].map(p=>[p[0],top,p[1]]));g.tri(...[points[0],points[i+1],points[i]].map(p=>[p[0],base,p[1]]));}for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];g.quad([a[0],base,a[1]],[b[0],base,b[1]],[b[0],top,b[1]],[a[0],top,a[1]]);}return g;}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const F=frame(f),L=F.length,a=L*.420,bx=L*.773,base=.4397546947,top=8.40,back=-4.0,front=-.20,cut=[a-.65,0,-4.2,bx+.65,9.70,1];const N=northFrame(f),northCut=[0,base,-.35,N.length*.44,13.813,.015];const emit=b.e.add,own=Object.hasOwn(b.e,'add');const originals=[];let oldLabels=0,changed=0;
 b.e.add=function(k,g,m,c,p,uv){if(p[1]!==102)return emit.call(this,k,g,m,c,p,uv);originals.push({g,m,p});if(p[0]===8){oldLabels++;return;}
  // All old triangles, including clipped floor slabs, are cut in the actual
  // oblique east-wall frame. Kept fragments retain local matrix/UV/normals.
  const eg=subtract(g,m,F,cut),gg=subtract(eg,m,N,northCut);if(gg!==g){changed++;if(!gg.v.length)return;return emit.call(this,'law102-entry170-cut-'+k,gg,m,c,p,uv);}return emit.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=previous.call(this,b,f,add);}finally{if(own)b.e.add=emit;else delete b.e.add;}
 if(oldLabels!==2||!changed)throw Error('Kaiyuan170 upstream changed '+oldLabels+'/'+changed);
 const meshes={},mesh=(name,mat,c)=>meshes[name]||(meshes[name]={g:new G.Geometry(),mat,c}),put=(name,mat,c,...args)=>box(mesh(name,mat,c).g,...args),stone='#b6b7b1',metal='#475653',glass='#657c83',width=bx-a,cent=(a+bx)/2,pier=1.35,bay=width/3;
 // Solid returns/finite back closure meet the preserved footprint and floor.
 put('returns',24,stone,a-.325,(base+top)/2,(back+front)/2,.65,top-base,front-back);
 put('returns',24,stone,bx+.325,(base+top)/2,(back+front)/2,.65,top-base,front-back);
 put('back',24,'#b6bab3',cent,(base+top)/2,back-.10,width,top-base,.20);
 put('beam',24,'#c9cac3',cent,(top+9.70)/2,(back+front)/2,width+1.30,9.70-top,front-back);
 // Floor top equals the retained original base top; replace its footprint in
 // the cut volume rather than laying a coplanar duplicate over it.
 put('floor',24,'#babdb3',cent,base/2,(back+1)/2,width+1.30,base,1-back);
 for(let j=0;j<2;j++){const h=base*(2-j)/3;put('steps',24,'#c9cac3',a+bay/2,h/2,1.225+j*.45,bay*.90,h,.45);}
 for(let j=1;j<3;j++)put('piers',24,'#c9cac3',a+j*bay,(base+top)/2,-.48,pier,top-base,.68);
 const glaze=-1.12,bar=.075;
 for(let j=0;j<3;j++){const left=a+j*bay+(j?pier/2:0),right=a+(j+1)*bay-(j<2?pier/2:0),span=right-left,n=4;
  for(let i=0;i<=n;i++)put('frames',9,metal,left+i*span/n,(base+top)/2,glaze+.035,bar,top-base,.15);
  for(const y of[base+bar/2,3.15,5.22,7.18,top-bar/2])put('frames',9,metal,(left+right)/2,y,glaze+.035,span,bar,.15);
  const levels=[base+bar,3.15,5.22,7.18,top-bar];for(let i=0;i<n;i++)for(let q=1;q<levels.length;q++){const lo=left+i*span/n+bar/2-.001,hi=left+(i+1)*span/n-bar/2+.001,low=levels[q-1]+(q===1?0:bar/2)-.001,high=levels[q]-(q===levels.length-1?0:bar/2)+.001;put('glass',5,glass,(lo+hi)/2,(low+high)/2,glaze,hi-lo,high-low,.035);}
 }
 const wall=northWall(f,N,base,13.813);emit.call(b.e,'law102-entry170-north-end',wall,N.matrix,stone,[24,102,0,.49]);
 for(const[name,v]of Object.entries(meshes))emit.call(b.e,'law102-entry170-'+name,v.g,F.matrix,v.c,[v.mat,102,0,.86]);
 // Lettering belongs on the hall beam, not on glazing behind an unrelated slab.
 const origin=b.origin,rotation=b.rotation,id=b.id;b.id=102;
 try{b.origin=[F.n[0],0,F.n[1]];b.rotation=Math.atan2(-F.u[1],F.u[0]);b.lettering('法学院',cent,9.04,front+.012,4.2,.48,0,'#626c65');
  b.origin=[N.n[0],0,N.n[1]];b.rotation=N.rotation;
  b.lettering('凯原楼',N.length*.21,10.74,.016,7.2,1.2,0,'#626c65');b.lettering('LEO KOGUAN BUILDING',N.length*.21,9.60,.016,9.0,.45,0,'#626c65');
 }finally{b.origin=origin;b.rotation=rotation;b.id=id;}
 return result;
};
Y.Law102Entry170={frame,northFrame,registration:{northFraction:.227,southFraction:.580,base:.44,beamBottom:8.40,beamTop:9.70,back:-4},dimensionFitted:true,leafCountVerified:false};
})(YY);
