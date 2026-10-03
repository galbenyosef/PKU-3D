/* Campus Scenery Pavilion: square green shafts and open rectangular hanging fretwork.
 * Profile and dimensions are fits to the official close photograph, not a survey. */
(function(Y){'use strict';
 const R=Y.Refinements42,prior=R.render,ID='way/1056350630',G=Y.Geo;
 R.render=function(b,f,add){
  if(f.properties.id!==ID||f.properties.pickId!==390)return prior.call(this,b,f,add);
  const old=b.e.add;
  b.e.add=function(k,g,m,c,p,uv){
   if(k==='cyl16_1'&&p[1]===390&&p[0]===6&&c==='#477660'){
    // Same width envelope, base, height and transform; a unique key cannot alias cylinders.
    const square=b.geo('pavilion390-square-column',()=>{const g=G.box();for(let i=0;i<g.v.length;i+=8){g.v[i]*=2;g.v[i+1]+=.5;g.v[i+2]*=2;}return g;});
    return old.call(this,'pavilion390-square-column',square,m,c,p,uv);
   }
   const emitted=old.call(this,k,g,m,c,p,uv);
   if(k==='roof0.02'&&p[1]===390&&p[0]===2){
    // Close the exact existing tile perimeter down into its original flat wooden fascia.
    // The roof plus its retained underside slab and these sides form the closed volume.
    // No extra top plane, analytic approximation or altered tile vertex is introduced.
    const key='pavilion390-eave-seal-'+m[5],seal=b.geo(key,()=>{
     const out=new G.Geometry(),bottom=-.095/m[5],seen=new Set();
     for(let i=0;i<g.v.length;i+=24)for(let j=0;j<3;j++){
      const a=g.v.slice(i+j*8,i+j*8+3),q=g.v.slice(i+((j+1)%3)*8,i+((j+1)%3)*8+3);
      const edge=[0,2].some(axis=>Math.abs(Math.abs(a[axis])-.5)<1e-7&&Math.abs(a[axis]-q[axis])<1e-7);
      if(!edge)continue;
      const id=[a.join(','),q.join(',')].sort().join('|');if(seen.has(id))continue;seen.add(id);
      const ps=[a,q,[q[0],bottom,q[2]],[a[0],bottom,a[2]]];
      const n=Y.M.cross(Y.M.sub(ps[1],ps[0]),Y.M.sub(ps[2],ps[0]));
      if(n[0]*(a[0]+q[0])+n[2]*(a[2]+q[2])<0)ps.reverse();
      out.quad(...ps);
     }
     return out;
    });
    old.call(this,key,seal,m,'#704c38',[6,p[1],p[2],p[3]],uv);
   }
   return emitted;
  };
  try{
   const result=prior.call(this,b,f,add),saved=b.id;b.id=390;
   try{b.local(f.properties.centre[0],0,f.properties.centre[1],.02,()=>{
    for(let side=0;side<4;side++)b.local(0,0,0,side*Math.PI/2,()=>{
     const box=(x,y,w,h)=>b.mesh('pavilion390-frieze',b.geo('pavilion390-frieze-box',G.box),x,y,2.64,w,h,.055,'#97b2a0',6);
     // Fitted repeated open fret. No flat opaque insert behind the lattice.
     for(const y of[3.17,3.40,3.685])box(0,y,4.74,.045);
     const step=4.70/8;
     for(let i=0;i<=8;i++)box(-2.35+i*step,3.425,.035,.56);
     for(let i=0;i<8;i++){const x=-2.35+(i+.5)*step;box(x,3.515,.035,.225);box(x+step*.20,3.285,.035,.225);}
    });
   });}finally{b.id=saved;}
   return {...result,detail390:'square-shafts-open-frieze',detailDimensions:'photo fit; repeated pattern and hidden faces approximate'};
  }finally{b.e.add=old;}
 };
 Y.Pavilion390={id:ID};
})(YY);
