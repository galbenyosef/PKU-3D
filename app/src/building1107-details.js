/* North ornamental column: close only the existing cloud board's missing rear face. */
(function(Y){'use strict';const original=Y.Heritage31.render;
function closedCloud(source){
 const rear=Math.min(...source.v.filter((_,i)=>i%8===2)),points=[],seen=new Set();
 for(let i=0;i<source.v.length;i+=8)if(source.v[i+2]===rear){const x=source.v[i],y=source.v[i+1],key=x+','+y;if(!seen.has(key)){seen.add(key);points.push([x,y]);}}
 const face=Y.Geo.polygon(points,0),g=new Y.Geo.Geometry();g.v=source.v.slice();
 // Keep the source front and edge vertices exactly. Map planar triangulation
 // into the existing rear plane; use outward normals, without a new contour.
 for(let i=0;i<face.v.length;i+=24){const v=[0,8,16].map(j=>[face.v[i+j],face.v[i+j+2],rear]);
  const cross=(v[1][0]-v[0][0])*(v[2][1]-v[0][1])-(v[1][1]-v[0][1])*(v[2][0]-v[0][0]);
  if(cross>0)[v[1],v[2]]=[v[2],v[1]];
  g.tri(v[0],v[1],v[2],v.map(p=>[p[0],p[1]]),[[0,0,-1],[0,0,-1],[0,0,-1]]);
 }
 return g;
}
Y.Heritage31.render=function(b,f,...args){if(f.properties.pickId!==1107)return original.call(this,b,f,...args);const mesh=b.mesh,own=Object.prototype.hasOwnProperty.call(b,'mesh');
 b.mesh=function(key,geometry,...rest){if(key==='v9-huabiao-cloud'){key='heritage1107-cloud-closed';geometry=this.geo(key,()=>closedCloud(geometry));}return mesh.call(this,key,geometry,...rest)};
 try{return original.call(this,b,f,...args)}finally{if(own)b.mesh=mesh;else delete b.mesh}
};
})(YY);
