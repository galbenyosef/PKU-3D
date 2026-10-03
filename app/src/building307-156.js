/* Low northern Humanities court wing. Built aerial/satellite establish the
 * low grey tiled range and narrowed eastern connection. Dimensions and hidden
 * elevations remain a proportional fit, not a measured as-built survey. */
(function(Y){'use strict';
const A=Y.Architecture30,prior=A.render,G=Y.Geo,ID='way/986745061';
const O=[98.812,-500.621],R=Math.atan2(4.641,33.658),W=Math.hypot(33.658,4.641),D=8.54,S=W*.73;
const spec={id:ID,width:W,depth:D,splitFraction:.73,eave:4.10,ridge:6.00,connectionDepth:3.60,connectionRise:.42,base:.30,roofThickness:.12,fit:true,verifiedWindowAxes:false,verifiedDoor:false};
function render(b,f){
 b.id=f.properties.pickId;
 const mesh=(n,g,c,mat)=>b.mesh('building307-156-'+n,g,0,0,0,1,1,1,c,mat);
 const box=(n,x,y,z,w,h,d,c,mat)=>b.mesh('building307-156-'+n,G.box(),x,y,z,w,h,d,c,mat);
 const brick='#929993',tile='#69736b',edge='#969c90';
 b.local(O[0],0,O[1],R,()=>{
  // Retain the source outline as a low base only; the eastern southern recess
  // is not filled by the former tall rectangular modern building.
  const co=Math.cos(R),si=Math.sin(R),ring=f.geometry.coordinates[0].slice(0,-1).map(p=>[(p[0]-O[0])*co-(p[1]-O[1])*si,(p[0]-O[0])*si+(p[1]-O[1])*co]);
  const base=G.polygon(ring,.30),bottom=G.polygon(ring,0);
  for(let i=0;i<bottom.v.length;i+=24)base.tri(bottom.v.slice(i,i+3),bottom.v.slice(i+16,i+19),bottom.v.slice(i+8,i+11));
  // Source ring is clockwise in world x/z; choose exterior side winding.
  const area=ring.reduce((v,p,i)=>v+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0);
  for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],v=[[p[0],0,p[1]],[q[0],0,q[1]],[q[0],.3,q[1]],[p[0],.3,p[1]]];if(area>0)v.reverse();base.quad(...v);}
  mesh('base',base,'#bcbeba',24);
  box('west-body',S/2,2.20,D/2,S,3.80,D,brick,30);
  box('east-connection-body',(S+W)/2,2.20,1.8,W-S,3.80,3.60,brick,30);
  function roof(name,x0,x1,z0,z1,rise){
   const mid=(z0+z1)/2,half=(z1-z0)/2,roof=new G.Geometry(),soffit=new G.Geometry(),closure=new G.Geometry(),gable=new G.Geometry(),tiles=new G.Geometry();
   const point=(x,t,s)=>[x,4.10+rise*Math.pow(t,1.25),mid+s*half*(1-t)];
   for(const s of[-1,1])for(let j=0;j<16;j++){
    const a=point(x0,j/16,s),c=point(x1,j/16,s),d=point(x1,(j+1)/16,s),e=point(x0,(j+1)/16,s);
    const top=s>0?[a,c,d,e]:[c,a,e,d],low=top.map(p=>[p[0],p[1]-spec.roofThickness,p[2]]);
    roof.quad(...top);soffit.quad(...low.slice().reverse());
    // Close each exposed roof boundary with the same segmented curve.
    for(let k=0;k<4;k++){
     const next=(k+1)%4,p=top[k],q=top[next];
     const end=Math.abs(p[0]-q[0])<1e-9;
     const eave=j===0&&Math.abs(p[1]-4.1)<1e-9&&Math.abs(q[1]-4.1)<1e-9;
     if(end||eave)closure.quad(q,p,low[k],low[next]);
    }
    for(let x=x0+.06;x<x1-.07;x+=.235)for(let k=0;k<3;k++){
     const ps=[point(x+k*.025,j/16,s),point(Math.min(x+(k+1)*.025,x1),(j)/16,s),point(Math.min(x+(k+1)*.025,x1),(j+1)/16,s),point(x+k*.025,(j+1)/16,s)].map(p=>[p[0],p[1]+.012+.027*Math.sin((k+.5)*Math.PI/3),p[2]]);
     if(s>0)tiles.quad(...ps);else tiles.quad(ps[1],ps[0],ps[3],ps[2]);
    }
    // Gable infill reaches the wall top, with outward winding at both ends.
    for(const [x,sign]of[[x0+.35,-1],[x1-.35,1]]){
     const p=point(x,j/16,s),q=point(x,(j+1)/16,s);
     if(j===0){const v=[[x,4.1,p[2]],q,[x,4.1,q[2]]];if(sign*s>0)v.reverse();gable.tri(...v);}
     else{const v=[[x,4.1,p[2]],p,q,[x,4.1,q[2]]];if(sign*s>0)v.reverse();gable.quad(...v);}
    }
   }
   tiles.detailWidth=.025;mesh(name+'-roof',roof,tile,2);mesh(name+'-soffit',soffit,tile,2);mesh(name+'-roof-closures',closure,tile,2);mesh(name+'-tile-rolls',tiles,edge,2);mesh(name+'-gable',gable,brick,30);
   box(name+'-ridge',(x0+x1)/2,4.1+rise+.07,mid,x1-x0,.14,.24,edge,2);
   for(const z of[z0,z1])box(name+'-eave',(x0+x1)/2,4.04,z,x1-x0,.12,.17,edge,2);
  }
  roof('west',-.35,S+.35,-.35,D+.35,1.90);
  // The low connector terminates beneath the west range; no duplicate exposed
  // gable or invented large doorway is placed at that internal junction.
  roof('east',S-.05,W+.35,-.35,3.95,.42);
 });
 return{ id:ID,strategy:'building307-156',floors:1,height:6.14,roofSegments:2,limits:'Low traditional wing supported by built aerial and design; 0.73 split, heights and hidden faces fitted; window axes and doors unresolved.' };
}
A.render=function(b,f,add){return f.properties.id===ID&&f.properties.pickId===307?render(b,f):prior.call(this,b,f,add);};
Y.Building307156={...spec,render};
})(YY);
