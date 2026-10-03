/* Private photo-fit: exposed soffit ribs normal to each eave.
 * North/rear arrangement is symmetric inference, not directly photographed.
 * Inner uplift is a photo-fit clearance, not a measured structural section. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo;
const spec={innerX:13.15,innerZ:14.65,outerX:16.5,outerZ:19.2,width:.15,outerBottom:73.275,top:74.025,innerBottom:73.985,pitch:1.25};
P.wangTower30=function(){const box=this.v16box;this.v16box=function(k,...args){if(k==='v16-wang-crown-rib')return;return box.call(this,k,...args);};try{previous.call(this);}finally{this.v16box=box;}
 const rib=this.geo('wang-soffit122-unit',()=>{const g=new G.Geometry(),b=G.box(),point=v=>[v[0],v[1]>0?.75:.71*(.5-v[2]),v[2]+.5];for(let i=0;i<b.v.length;i+=24){const a=point(b.v.slice(i,i+3)),c=point(b.v.slice(i+8,i+11)),d=point(b.v.slice(i+16,i+19));g.tri(a,c,d);}return g;});
 const emit=(x,z,r,len)=>this.mesh('wang-soffit122-ribs',rib,x,spec.outerBottom,z,spec.width,1,len,'#8d9b9b',29,1.93,r);
 for(const sign of[-1,1]){
  // Retain the original 1.25 m rhythm within the clerestory frontage.
  for(let x=-12.75;x<=12.25;x+=spec.pitch)emit(x,sign*spec.innerZ,sign>0?0:Math.PI,spec.outerZ-spec.innerZ);
  for(let z=-13.75;z<=13.75;z+=spec.pitch)emit(sign*spec.innerX,z,sign*Math.PI/2,spec.outerX-spec.innerX);
 }
 // Corner rafters follow the diagonal of the overhang, preserving the edge depth.
 for(const x of[-1,1])for(const z of[-1,1]){const dx=x*(spec.outerX-spec.innerX),dz=z*(spec.outerZ-spec.innerZ);emit(x*spec.innerX,z*spec.innerZ,Math.atan2(dx,dz),Math.hypot(dx,dz));}
};Y.WangSoffit122=spec;
})(YY);
