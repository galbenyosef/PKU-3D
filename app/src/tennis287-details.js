/* Wusi east tennis courts: ITF Rule 1 distinguishes the net from court paint.
 * Retain the mapped layout, physical nets and fences; correct only linework. */
(function(Y){'use strict';const S=Y.Sports32,prior=S.render,ID='way/880624092';
S.render=function(b,f){if(f.properties.id!==ID)return prior.call(this,b,f);
 const mesh=b.mesh,own=Object.hasOwn(b,'mesh');
 b.mesh=function(k,g,...args){
  // Only the two inset playing surfaces used the brick-paving atlas cell.
  // Reuse the existing athletic fine-grain cell; keep their colour and mesh.
  if(k==='box'&&args[1]===.215&&args[4]===.024&&args[6]==='#a88473'&&args[7]===7)args[7]=11;
  if(k==='court32-lines-287'){
   const out=new Y.Geo.Geometry();
   // Four perimeter ribbons precede the erroneous transverse net-position
   // stripe. All service lines and sidelines following it remain unchanged.
   out.v.push(...g.v.slice(0,192),...g.v.slice(240));
   for(const side of[-1,1]){
    const offset=side<0?0:96,a=g.v.slice(offset,offset+3),c=g.v.slice(offset+8,offset+11);
    const edge=x=>a[2]+(c[2]-a[2])*(x-a[0])/(c[0]-a[0]);
    const left=[-.025,.245,edge(-.025)],right=[.025,.245,edge(.025)];
    const points=[left,right,[.025,.245,right[2]-side*.10],[-.025,.245,left[2]-side*.10]];
    if(side<0)points.reverse();out.quad(...points,[0,1,0]);
   }
   return mesh.call(this,'tennis287-corrected-lines',out,...args);
  }
  return mesh.call(this,k,g,...args);
 };
 try{return prior.call(this,b,f);}finally{if(own)b.mesh=mesh;else delete b.mesh;}
};Y.Tennis287Details={id:ID};
})(YY);
