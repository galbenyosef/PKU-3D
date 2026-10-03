/* Tencent wing north masonry; heights and brick module remain display fits. */
(function(Y){'use strict';
const previous=Y.Architecture30.render,ID='way/1031892011',COLOR='#666660';
function clip(poly,y,above){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ia=above?a[1]>=y:a[1]<=y,ib=above?b[1]>=y:b[1]<=y;if(ia)out.push(a);if(ia!==ib){const t=(y-a[1])/(b[1]-a[1]);out.push(a.map((v,j)=>v+(b[j]-v)*t));}}return out;}
function append(g,poly){for(let i=1;i+1<poly.length;i++)g.v.push(...poly[0],...poly[i],...poly[i+1]);}
Y.Architecture30.render=function(b,f,add){
 if(f.properties.id!==ID)return previous(b,f,add);
 const ring=f.geometry.coordinates[0],a=ring[0],c=ring[1],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),onNorth=v=>Math.abs((v[0]-a[0])*dz-(v[2]-a[1])*dx)/len<.001;
 const emit=b.e.add;let splitY=null,removedNorthBelts=0;
 b.e.add=function(k,g,m,color,p,uv){
  // Only the two generic intermediate belts on the north brick wall.
  // The first-floor boundary and the separate eave trim stay in the stream.
  if(splitY!==null&&k==='box'&&p[1]===981&&p[0]===24&&color==='#c9cec0'){
   const h=Math.hypot(m[4],m[5],m[6]),w=Math.hypot(m[0],m[1],m[2]),d=Math.hypot(m[8],m[9],m[10]);
   const mx=(a[0]+c[0])/2+dz/len*.025,mz=(a[1]+c[1])/2-dx/len*.025,fh=splitY-.55;
   if(Math.abs(h-.13)<.0001&&Math.abs(d-.11)<.0001&&Math.abs(w-len)<.001&&Math.hypot(m[12]-mx,m[14]-mz)<.001&&[2,3].some(j=>Math.abs(m[13]-(.55+j*fh))<.0001)){removedNorthBelts++;return;}
  }
  if(k!=='v30-walls-981-building192-v46')return emit.call(this,k,g,m,color,p,uv);
  const top=Math.max(...g.v.filter((_,i)=>i%8===1));splitY=.55+(top-.55)/4;
  const stone=new Y.Geo.Geometry(),brick=new Y.Geo.Geometry();
  for(let t=0;t<g.v.length;t+=24){const poly=[0,8,16].map(i=>g.v.slice(t+i,t+i+8));
   if(poly.every(onNorth)){append(stone,clip(poly,splitY,false));append(brick,clip(poly,splitY,true));}
   else stone.v.push(...g.v.slice(t,t+24));
  }
  emit.call(this,k,stone,m,color,p,uv);
  return emit.call(this,'tencent981-north-masonry',brick,m,COLOR,[30,p[1],p[2],p[3]],uv);
 };
 try{const fitted={...f,properties:{...f.properties,height:16}};const result=previous(b,fitted,add);return {...result,northMasonryCorrected:true,removedNorthBelts,displayHeightRetained:false,scope:"four-storey-proportion-fit-and-north-masonry; original-plan",displayHeightFitted:16,heightMeasured:false,masonrySplitHeight:splitY,masonrySplitMeasured:false,entranceVerified:false};}finally{b.e.add=emit;}
};
})(YY);
