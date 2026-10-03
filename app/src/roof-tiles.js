/* Shared curved ceramic tiles; full columns reuse geometry and hips are clipped. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo;
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function render(b,q,{origin:O,rotation:R,key,color,eaveHigh=false,offset=.13}){
 const axis=q.axis,lo=Math.min(...q.p.map(p=>p[axis])),hi=Math.max(...q.p.map(p=>p[axis]));
  const across=1-axis,a=Math.min(...q.p.map(p=>p[across])),c=Math.max(...q.p.map(p=>p[across]));
  const eave=eaveHigh?hi:lo,direction=eave===lo?1:-1;
  const courses=Math.ceil((hi-lo)/.36),course=(hi-lo)/courses,radius=.075;
  const height=t=>{const p=[0,0];p[axis]=t;return q.y(p);};
  const derivative=t=>(height(t+.0001)-height(t-.0001))/.0002;
  const roofPolygon={type:'Polygon',coordinates:[[...q.p,q.p[0]]]};
  const inRoof=p=>F.inside(p,roofPolygon)||q.p.some((a,i)=>F.distSegment(p,a,q.p[(i+1)%q.p.length])<1e-7);
  function column(s,clipped){const g=new G.Geometry();let rowStart,rowEnd;
   function patch(x0,x1,t0,t1,profile,normal){
    let poly=clipped?q.p:[[s+x0,t0],[s+x1,t0],[s+x1,t1],[s+x0,t1]].map(p=>axis===1?p:[p[1],p[0]]);
    if(clipped)for(const [ax,k,greater]of [[across,s+x0,true],[across,s+x1,false],[axis,Math.min(t0,t1),true],[axis,Math.max(t0,t1),false]])if(poly.length)poly=clip(poly,ax,k,greater);
    if(poly.length<3)return;
    // The course lip stands slightly proud downhill and tapers beneath the next tile.
    const point=p=>{const x=p[across]-s,t=p[axis],f=(t-rowStart)/(rowEnd-rowStart),v=[...p];return {p:axis===1?[x,height(t)+profile(x)+.008*(1-f),t]:[t,height(t)+profile(x)+.008*(1-f),x],n:normal(x,derivative(t)-.008/(rowEnd-rowStart))};};
    // Keep normals smooth across the curved section, including cropped hip edges.
    if(F.area([...poly,poly[0]])>0)poly.reverse();
    const v=poly.map(point);for(let i=1;i<v.length-1;i++)g.tri(v[0].p,v[i].p,v[i+1].p,undefined,[v[0].n,v[i].n,v[i+1].n]);
   }
   const norm=(dx,dt)=>Y.M.norm(axis===1?[-dx,1,-dt]:[-dt,1,-dx]);
   for(let j=0;j<courses;j++){
    const t0=eave+direction*j*course,t1=eave+direction*(j+1)*course;rowStart=t0;rowEnd=t1;
    for(let k=0;k<8;k++){
     const x0=-radius*Math.cos(k*Math.PI/8),x1=-radius*Math.cos((k+1)*Math.PI/8);
     const shape=x=>.016+Math.sqrt(Math.max(0,radius*radius-x*x));
     const normal=(x,dt)=>norm(-x/Math.sqrt(Math.max(.0000001,radius*radius-x*x)),dt);
     // Two longitudinal subdivisions retain the underlying curved roof profile.
     for(let h=0;h<2;h++)patch(x0,x1,t0+(t1-t0)*h/2,t0+(t1-t0)*(h+1)/2,shape,normal);
     // A real semicircular ceramic lip, rather than a painted line at the eave.
     const rim=[];for(const [r,ang]of [[radius,k*Math.PI/8],[radius,(k+1)*Math.PI/8],[radius-.013,(k+1)*Math.PI/8],[radius-.013,k*Math.PI/8]]){
      const x=-r*Math.cos(ang),p=axis===1?[s+x,t0]:[t0,s+x];rim.push({p,x,y:height(t0)+.024+r*Math.sin(ang)});
     }
     if(!clipped||rim.every(v=>inRoof(v.p))){
      const v=rim.map(v=>axis===1?[v.x,v.y,t0]:[t0,v.y,v.x]);g.quad(...((axis===1?direction>0:direction<0)?v:v.reverse()));
     }
    }
    // Shallow concave pan tiles carry runoff between the rounded cover tiles.
    for(let k=0;k<4;k++){
     const x0=radius+(.31-2*radius)*k/4,x1=radius+(.31-2*radius)*(k+1)/4;
     const shape=x=>.008+.008*Math.pow((x-.155)/.08,2),normal=(x,dt)=>norm(.016*(x-.155)/(.08*.08),dt);
     patch(x0,x1,t0,t1,shape,normal);
    }
   }
   // Ceramic shading uses metric surface coordinates; coherent unused UVs let
   // the lossless cache share identical vertices without changing any triangles.
   for(let i=0;i<g.v.length;i+=8){g.v[i+6]=g.v[i];g.v[i+7]=g.v[i+2];}
   return g;
  }
  const edgeTiles=new G.Geometry();let shared=null;
  b.local(O[0],0,O[1],R,()=>{
   for(let s=a+offset;s<c;s+=.31){
    const full=[lo,hi].every(t=>[-radius,.31-radius].every(x=>{const p=axis===1?[s+x,t]:[t,s+x];return inRoof(p);}));
    if(full){if(!shared)shared=column(s,false);b.mesh(key+'-tile-column-'+q.name,shared,axis===1?s:0,0,axis===0?s:0,1,1,1,color,25);}
    else{const g=column(s,true);for(let i=0;i<g.v.length;i+=8){const v=g.v.slice(i,i+8);v[axis===1?0:2]+=s;edgeTiles.v.push(...v);}}
   }
   b.mesh(key+'-tile-hip-cuts-'+q.name,edgeTiles,0,0,0,1,1,1,color,25);
  });
}
Y.RoofTiles={render};
})(YY);
