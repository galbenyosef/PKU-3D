/* East-entry motto stone: one observed panel joint, recessed into the stone face. */
(function(Y){'use strict';const original=Y.Heritage31.render;
function jointFace(source){const g=new Y.Geo.Geometry(),half=.012/7/2,back=.5-.005/.42;
 // Original unit box front is the first six vertices. All other faces stay exact.
 g.v=source.v.slice(6*8);
 const quad=(a,b,c,d)=>{const uv=p=>[p[0]+.5,p[1]+.5];g.tri(a,b,c,[uv(a),uv(b),uv(c)]);g.tri(a,c,d,[uv(a),uv(c),uv(d)]);};
 quad([-.5,-.5,.5],[-half,-.5,.5],[-half,.5,.5],[-.5,.5,.5]);
 quad([half,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[half,.5,.5]);
 quad([-half,-.5,back],[half,-.5,back],[half,.5,back],[-half,.5,back]);
 quad([-half,-.5,back],[-half,-.5,.5],[-half,.5,.5],[-half,.5,back]);
 quad([half,-.5,.5],[half,-.5,back],[half,.5,back],[half,.5,.5]);
 return g;
}
Y.Heritage31.render=function(b,f,...args){if(f.properties.pickId!==1132)return original.call(this,b,f,...args);const mesh=b.mesh,own=Object.prototype.hasOwnProperty.call(b,'mesh');
 b.mesh=function(key,geometry,x,y,z,sx,sy,sz,color,mat,...rest){if(key==='box'&&sx===7&&sy===1.52&&sz===.42&&mat===9){key='heritage1132-stone-joint';geometry=this.geo(key,()=>jointFace(geometry));}return mesh.call(this,key,geometry,x,y,z,sx,sy,sz,color,mat,...rest)};
 try{return original.call(this,b,f,...args)}finally{if(own)b.mesh=mesh;else delete b.mesh}
};
})(YY);
