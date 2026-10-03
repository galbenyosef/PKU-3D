/* Boya Pagoda: only the five finial submissions above the retained top roof.
 * The silhouette follows the tower's video close-up; dimensions remain fitted. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/240825562',eq=(a,b)=>Math.abs(a-b)<1e-8;
const original=[
 ['cyl12_0.84',34.60,.38,.40,'#a7a18c',24,2.30],
 ['sphereSmooth',35.06,.47,.40,'#999480',10,2.33],
 ['cyl12_0.3',35.29,.27,1.28,'#a29b87',24,2.37],
 ['sphereSmooth',36.63,.20,.20,'#a9a18b',10,2.40],
 ['cyl10_0.05',36.76,.06,.24,'#6c7265',9,2.42]
];
// Closed surfaces of revolution. Segment normals preserve each moulding edge;
// radial normals are shared around each ring, avoiding a faceted silhouette.
function turned(profile,n=96){
 const g=new Y.Geo.Geometry(),pt=(p,j)=>{const a=j*2*Math.PI/n;return[p[0]*Math.cos(a),p[1],p[0]*Math.sin(a)];};
 for(let k=0;k<profile.length-1;k++){
  const lo=profile[k],hi=profile[k+1],dr=hi[0]-lo[0],dy=hi[1]-lo[1],normal=j=>{const a=j*2*Math.PI/n;return Y.M.norm([dy*Math.cos(a),-dr,dy*Math.sin(a)]);};
  for(let j=0;j<n;j++){const a=pt(lo,j),b=pt(hi,j),c=pt(hi,j+1),d=pt(lo,j+1),u=normal(j),v=normal(j+1);g.tri(a,b,c,undefined,[u,u,v]);g.tri(a,c,d,undefined,[u,v,v]);}
 }
 for(let j=0;j<n;j++){const lo=profile[0],hi=profile.at(-1);g.tri([0,lo[1],0],pt(lo,j),pt(lo,j+1));g.tri([0,hi[1],0],pt(hi,j+1),pt(hi,j));}
 return g;
}
function finial(b){
 const put=(name,profile,color,part)=>{const key='boya-finial-'+name;b.mesh(key,b.geo(key,()=>turned(profile)),0,0,0,1,1,1,color,24,part);};
 put('foot',[[.32,34.60],[.40,34.64],[.47,34.70],[.49,34.77]],'#a7a18c',2.30);
 put('waist',[[.475,34.75],[.49,34.79],[.485,34.84],[.46,34.92],[.41,35.02],[.35,35.12],[.295,35.20],[.29,35.28]],'#a29b87',2.33);
 put('collar',[[.29,35.25],[.40,35.28],[.46,35.30],[.46,35.33],[.32,35.35]],'#999480',2.37);
 const key='boya-finial-main-bead';b.mesh(key,b.geo(key,()=>Y.Geo.sphere(96,48,0)),0,35.76,0,.47,.48,.47,'#a9a18b',24,2.40);
 // Keep the original highest transform and local y=1 cap exactly: the adapter
 // uses this extremum to fit every part of the entire tower to 37 metres.
 const rod='boya-finial-rod';b.mesh(rod,b.geo(rod,()=>turned([[.30,-3.2],[.23,-1],[.05,1]],64)),0,36.76,0,.06,.24,.06,'#6c7265',9,2.42);
}
A.render=function(b,f,add){
 if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const had=Object.prototype.hasOwnProperty.call(b,'lakePagoda'),old=b.lakePagoda;
 b.lakePagoda=function(...args){
  const ownMesh=Object.prototype.hasOwnProperty.call(this,'mesh'),mesh=this.mesh;
  this.mesh=function(k,g,x,y,z,sx,sy,sz,color,mat,part,...rest){
   if(eq(x,0)&&eq(z,0)&&eq(sx,sz)&&original.some(q=>k===q[0]&&eq(y,q[1])&&eq(sx,q[2])&&eq(sy,q[3])&&color===q[4]&&mat===q[5]&&eq(part,q[6])))return;
   return mesh.call(this,k,g,x,y,z,sx,sy,sz,color,mat,part,...rest);
  };
  let result;try{result=old.apply(this,args);}finally{if(ownMesh)this.mesh=mesh;else delete this.mesh;}
  finial(this);return result;
 };
 try{return previous.call(this,b,f,add);}finally{if(had)b.lakePagoda=old;else delete b.lakePagoda;}
};
Y.BoyaPagodaDetails={id:ID};
})(YY);
