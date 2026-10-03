/* Own exterior photo: https://static.bjd.com.cn/dams-res/editing/image/202606/05/6a223b78d5de2b4209021e32.jpg
 * Replaces only the east wooden entrance's two lower flat canopy boxes.
 * Footprint retained. Eave 3.68, wall-side high line 4.00, 2.74 m high-line
 * width and hidden closure are image fits, not surveyed dimensions.
 * The independent upper flat slab and every other existing record stay intact. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/628032103';
function solid(points,faces,convert){const g=new Y.Geo.Geometry(),p=points.map(convert),c=[0,1,2].map(k=>p.reduce((s,v)=>s+v[k],0)/p.length);
 for(const face of faces)for(let j=1;j<face.length-1;j++){let a=p[face[0]],b=p[face[j]],d=p[face[j+1]],u=b.map((x,k)=>x-a[k]),v=d.map((x,k)=>x-a[k]),n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
  if(n.reduce((s,x,k)=>s+x*((a[k]+b[k]+d[k])/3-c[k]),0)<0)[b,d]=[d,b];g.tri(a,b,d);
 }return g;}
const faces=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];
let eave,roof;
function meshes(){if(eave)return;
 // 20 micrometres of hidden overlap removes Float32 butt-contact ambiguity.
 eave=solid([[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5],[-.5,.0001,-.5],[.5,.0001,-.5],[.5,.0001,.5],[-.5,.0001,.5]],faces,p=>p);
 roof=solid([[-1.925,3.68,-.17],[1.925,3.68,-.17],[1.925,3.68,1.33],[-1.925,3.68,1.33],[-1.37,4.00,-.17],[1.37,4.00,-.17]],[[0,1,2,3],[3,2,5,4],[0,3,4],[2,1,5],[1,0,4,5]],p=>[p[0]/3.48,(p[1]-3.83)/.10,(p[2]-.48)/1.16]);
}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);meshes();const old=b.e.add;
 b.e.add=function(k,g,m,col,p,uv){if(k==='065-east-return-entry-box'&&p[1]===f.properties.pickId){const dims=[0,4,8].map(i=>Math.hypot(m[i],m[i+1],m[i+2])),matches=a=>a.every((v,i)=>Math.abs(dims[i]-v)<1e-4);
  if(matches([3.85,.20,1.50]))return old.call(this,'museum226-canopy265-eave',eave,m,col,p,uv);
  if(matches([3.48,.10,1.16]))return old.call(this,'museum226-canopy265-slopes',roof,m,col,p,uv);
 }return old.call(this,k,g,m,col,p,uv);};
 try{return previous(b,f,add);}finally{b.e.add=old;}
};
})(YY);
