/* Museum of University History, way/226704254 (pick57), not the Archive.
 * Official museum photographs support a pale round-column west waterside gallery.
 * Only a visible middle/south run is fitted here; column spacing, depth and heights
 * are not surveyed, and no complete column count or entrance position is claimed. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,M=Y.M,ID='way/226704254';
function frame(f){const q=Y.ArchitectureAdapter.frame(f.geometry,0),c=Math.cos(q.r),s=Math.sin(q.r);return{...q,local:p=>[(p[0]-q.centre[0])*c-(p[2]-q.centre[1])*s,p[1],(p[0]-q.centre[0])*s+(p[2]-q.centre[1])*c],world:p=>[q.centre[0]+p[0]*c+p[2]*s,p[1],q.centre[1]-p[0]*s+p[2]*c]};}
const gallery={x0:-8.0,x1:-5.50,z0:-16,z1:16,bottom:.6130156,top:4.87,columnX:-7.50,columns:[-14.5,-9.75,-5,-.25,4.5,9.25,14]};
function clip(poly,axis,k,greater){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ai=greater?a[axis]>=k:a[axis]<=k,bi=greater?b[axis]>=k:b[axis]<=k;if(ai)out.push(a);if(ai!==bi){const t=(k-a[axis])/(b[axis]-a[axis]);out.push(a.map((v,j)=>v+t*(b[j]-v)));}}return out;}
function subtract(poly){const q=gallery,planes=[[0,q.x0,true],[0,q.x1,false],[1,q.bottom,true],[1,q.top,false],[2,q.z0,true],[2,q.z1,false]],out=[];let inside=poly;for(const[a,k,g]of planes){if(!inside.length)break;const outside=clip(inside,a,k,!g);if(outside.length>=3)out.push(outside);inside=clip(inside,a,k,g);}return{out,cut:inside.length>=3};}
function render(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const fr=frame(f),saved=b.e.add,stats={retained:0,replaced:0,removed:0};let sequence=0,result;
 b.e.add=function(key,geo,m,color,params,uv){
  // Clip only opaque geometry crossing the fitted gallery void; retain all other
  // records, matrices, keys and UVs exactly, including the complete roof stream.
  const vertices=[];for(let i=0;i<geo.v.length;i+=8)vertices.push([...fr.local(M.apply(m,[...geo.v.slice(i,i+3),1])),...geo.v.slice(i+6,i+8)]);
  const q=gallery,min=a=>Math.min(...vertices.map(p=>p[a])),max=a=>Math.max(...vertices.map(p=>p[a]));
  if(max(0)<=q.x0||min(0)>=q.x1||max(1)<=q.bottom||min(1)>=q.top||max(2)<=q.z0||min(2)>=q.z1){stats.retained++;return saved.call(this,key,geo,m,color,params,uv);}
  const mesh=new G.Geometry();let changed=false;
  for(let i=0;i<vertices.length;i+=3){const tri=vertices.slice(i,i+3),pieces=subtract(tri);changed||=pieces.cut;for(const p of pieces.out)for(let j=1;j<p.length-1;j++){
   const a=fr.world(p[0]),c=fr.world(p[j]),d=fr.world(p[j+1]);if(Math.hypot(...M.cross(M.sub(c,a),M.sub(d,a)))<1e-10)continue;mesh.tri(a,c,d,[p[0].slice(3),p[j].slice(3),p[j+1].slice(3)]);
  }}
  if(!changed){stats.retained++;return saved.call(this,key,geo,m,color,params,uv);}stats.replaced++;if(!mesh.v.length){stats.removed++;return;}
  return saved.call(this,'historymuseum-cut-'+sequence++,mesh,M.identity(),color,params,uv);
 };
 try{result=previous.call(this,b,f,add);}finally{b.e.add=saved;}
 const q=gallery,oldId=b.id;b.id=f.properties.pickId;
 b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
  b.e.add=function(k,...args){return saved.call(this,'historymuseum-gallery-'+k,...args);};try{
   const mid=(q.z0+q.z1)/2,len=q.z1-q.z0,h=q.top-q.bottom;
   // Floor and soffit close the real cut, meeting the unchanged plinth/eave.
   b.box((q.x0+q.x1)/2,q.bottom-.05,mid,q.x1-q.x0,.10,len,'#bfc2b7',10);
   b.box((q.x0+q.x1)/2,q.top+.035,mid,q.x1-q.x0,.07,len,'#d7d6cc',10);
   // Recessed opaque reflective glazing; no old opaque wall remains in front.
   b.box(q.x1+.025,(q.bottom+q.top)/2,mid,.05,h,len,'#4e6569',5);
   for(const z of[q.z0,q.z1])b.box((q.x0+q.x1)/2,(q.bottom+q.top)/2,z,q.x1-q.x0,h,.10,'#bbbbae',13);
   for(const z of q.columns){b.box(q.columnX,q.bottom+.13,z,.68,.26,.68,'#bec1b6',10);b.cyl(q.columnX,q.bottom+.26,z,.235,h-.26,'#dadbd0',24,1,10);}
   // Fitted mullions belong behind the column line, not in the open gallery.
   for(let z=q.z0;z<=q.z1;z+=1.5)b.box(q.x1-.035,(q.bottom+q.top)/2,z,.09,h,.05,'#78847f',9);
   for(const y of[q.bottom+.035,q.top-.035])b.box(q.x1-.035,y,mid,.09,.07,len,'#78847f',9);
  }finally{b.e.add=saved;}
 });b.id=oldId;
 return{...result,westGallery:stats,galleryScope:'fitted visible run; unseen ends and entrance retained'};
}
Y.HistoryMuseum46={frame,gallery,subtract};A.render=render;
})(YY);
