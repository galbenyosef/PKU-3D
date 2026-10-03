/* Stone offerings: the two outer vases have recessed openings, not pointed lids. */
(function(Y){'use strict';const original=Y.Heritage31.render;
function openVase(source){const g=new Y.Geo.Geometry(),n=40;
 // Preserve every original outer-wall vertex up to the established upper rim.
 // The final old interval converged to a solid tip; replace only that closure.
 g.v=source.v.slice(0,source.v.length-n*6*8);
 const profile=[[1.21,.29],[1.23,.285],[1.23,.235],[1.08,.205],[1.08,0]];
 for(let j=1;j<profile.length;j++)for(let i=0;i<n;i++){
  const a=2*Math.PI*i/n,c=2*Math.PI*(i+1)/n,p=profile[j-1],q=profile[j];
  g.quad([p[1]*Math.cos(a),p[0],p[1]*Math.sin(a)],[q[1]*Math.cos(a),q[0],q[1]*Math.sin(a)],[q[1]*Math.cos(c),q[0],q[1]*Math.sin(c)],[p[1]*Math.cos(c),p[0],p[1]*Math.sin(c)]);
 }return g;
}
Y.Heritage31.render=function(b,f,...args){if(f.properties.pickId!==1124)return original.call(this,b,f,...args);const mesh=b.mesh,own=Object.prototype.hasOwnProperty.call(b,'mesh');
 b.mesh=function(key,geometry,...rest){if(key==='offering33-vase'){key='heritage1124-vase-open';geometry=this.geo(key,()=>openVase(geometry));}return mesh.call(this,key,geometry,...rest)};
 try{return original.call(this,b,f,...args)}finally{if(own)b.mesh=mesh;else delete b.mesh}
};
})(YY);
