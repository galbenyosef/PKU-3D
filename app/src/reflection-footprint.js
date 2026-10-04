/* Conservative reflection sampling footprint; never changes source geometry. */
(function(Y){'use strict';
 const EPS=2**-23;
 function hull(points){
  if(points.length<3||points.some(p=>p.length!==2||!p.every(Number.isFinite)))return null;
  const sorted=points.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]),lower=[],upper=[];
  for(const p of sorted){while(lower.length>=2&&cross(lower[lower.length-2],lower[lower.length-1],p)<=0)lower.pop();lower.push(p);}
  for(let i=sorted.length-1;i>=0;i--){const p=sorted[i];while(upper.length>=2&&cross(upper[upper.length-2],upper[upper.length-1],p)<=0)upper.pop();upper.push(p);}
  lower.pop();upper.pop();for(const p of upper)lower.push(p);return lower.length>=3?lower:null;
 }
 function prepare(vertices){
  if(!vertices||vertices.length%8||vertices.length<24)return null;
  const y=vertices[1],points=[];if(!Number.isFinite(y))return null;
  for(let i=0;i<vertices.length;i+=8){if(vertices[i+1]!==y||!Number.isFinite(vertices[i])||!Number.isFinite(vertices[i+2]))return null;points.push([vertices[i],vertices[i+2]]);}
  const polygon=hull(points);return polygon?{polygon,y}:null;
 }
 function expand(polygon,dx,dy){
  const points=[];
  for(let i=0;i<polygon.length;i++)if(i in polygon){const p=polygon[i];for(let x=-1;x<=1;x+=2)for(let y=-1;y<=1;y+=2)points.push([p[0]+x*dx,p[1]+y*dy]);}
  return hull(points);
 }
 function clipScreen(polygon,width,height){
  for(const [axis,sign,limit]of[[0,1,2/width],[0,-1,1+2/width],[1,1,2/height],[1,-1,1+2/height]]){
   const next=[];let prev=polygon[polygon.length-1];if(!prev)return[];
   let pd=sign*prev[axis]+limit;
   for(const p of polygon){const d=sign*p[axis]+limit;if((d>=0)!==(pd>=0)){const t=pd/(pd-d);next.push(prev.map((v,k)=>v+(p[k]-v)*t));}if(d>=0)next.push(p);prev=p;pd=d;}
   polygon=next;
  }return polygon;
 }
 function clampedHull(polygon){
  if(!polygon||polygon.length<3)return null;
  const points=polygon.slice(),low=.001,high=.999;
  for(let i=0;i<polygon.length;i++){
   const a=polygon[i],b=polygon[(i+1)%polygon.length];
   for(const axis of[0,1])for(const edge of[low,high]){const t=(edge-a[axis])/(b[axis]-a[axis]);if(t>0&&t<1)points.push(a.map((v,k)=>v+(b[k]-v)*t));}
  }
  // The clamp map is affine on each of nine regions. Region vertices are
  // original vertices, edge/fold intersections, and contained fold corners.
  for(const x of[low,high])for(const y of[low,high])if(polygon.every((a,i)=>{const b=polygon[(i+1)%polygon.length];return(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0])>=-1e-10;}))points.push([x,y]);
  return hull(points.map(p=>p.map(v=>Math.max(low,Math.min(high,v)))));
 }
 function matrixForPlane(vp,y){return[vp[0],vp[8],vp[4]*y+vp[12],vp[1],vp[9],vp[5]*y+vp[13],vp[3],vp[11],vp[7]*y+vp[15]];}
 function inverse3(m){
  const[a,b,c,d,e,f,g,h,i]=m,A=e*i-f*h,B=c*h-b*i,C=b*f-c*e,D=f*g-d*i,E=a*i-c*g,F=c*d-a*f,G=d*h-e*g,H=b*g-a*h,I=a*e-b*d;
  const det=a*A+b*D+c*G,scale=Math.max(...m.map(Math.abs));
  if(!Number.isFinite(det)||Math.abs(det)<=1e-12*Math.max(1,scale**3))return null;
  const result=[A/det,B/det,C/det,D/det,E/det,F/det,G/det,H/det,I/det];return result.every(Number.isFinite)?result:null;
 }
 const apply3=(m,p)=>[m[0]*p[0]+m[1]*p[1]+m[2]*p[2],m[3]*p[0]+m[4]*p[1]+m[5]*p[2],m[6]*p[0]+m[7]*p[1]+m[8]*p[2]];
 const apply4=(m,p)=>[m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[3]*p[0]+m[7]*p[1]+m[11]*p[2]+m[15]];
 function planes(visible,mainVP,refVP,canvas,target,state,worldCache){
  if(state.reflectionFootprint===false||!mainVP||!refVP||!Array.from(mainVP).every(Number.isFinite)||!Array.from(refVP).every(Number.isFinite))return null;
  const width=canvas.width,height=canvas.height,w=target.w,h=target.h,selected=state.selected??0,explode=state.explode??0;
  if(![width,height,w,h].every(x=>Number.isFinite(x)&&x>0)||!Number.isInteger(selected)||Math.fround(selected)!==selected||!Number.isFinite(explode)||!Number.isFinite(Math.fround(explode)))return null;
  const reflected=[];let waters=0;
  for(const{b}of visible.items){
   if(!b.materials.has(4))continue;waters++;
   const source=b.resource?.reflectionFootprint,m=b.data;
   if(b.uniformMaterial!==4||b.count!==1||!source||!m||m.length!==28||m[22]!==0||m[3]||m[7]||m[11]||m[15]!==1||m[1]||m[9]||!Number.isInteger(m[21])||!Array.from(m).every(Number.isFinite))return null;
   // Non-horizontal or animated water retains the original reflection volume.
   const lift=m[21]===selected&&selected>.5?Math.fround(explode)*m[23]:0;
   let cached=worldCache?(worldCache.get(b)||b.reflectionFootprintWorld):b.reflectionFootprintWorld;
   if(!cached||cached.source!==source||cached.matrix.some((value,k)=>value!==m[k])){
    const world=[],pad=[.05,.05,.05];
    for(const[x,z]of source.polygon){
     world.push([m[0]*x+m[8]*z+m[4]*source.y+m[12],m[2]*x+m[10]*z+m[6]*source.y+m[14]]);
     for(let k=0;k<3;k++)pad[k]=Math.max(pad[k],.05+32*EPS*(Math.abs(m[k]*x)+Math.abs(m[k+4]*source.y)+Math.abs(m[k+8]*z)+Math.abs(m[k+12])+1));
    }
    const footprint=expand(hull(world)||[],pad[0],pad[2]);if(!footprint)return null;
    cached={source,matrix:Array.from(m.slice(0,16)),footprint,y:m[5]*source.y+m[13],padY:pad[1]};
    if(worldCache)worldCache.set(b,cached);else b.reflectionFootprintWorld=cached;
   }
   const footprint=cached.footprint,y=cached.y+lift,padY=cached.padY+32*EPS*Math.abs(lift);
   const ys=[y-padY,y+padY],projected=[];
   for(const point of footprint)for(const py of ys){
    const p=[point[0],py,point[1]],q=apply4(mainVP,p),r=apply4(refVP,p);
    if(!(q[2]>1e-5&&r[2]>1e-5)||!q.every(Number.isFinite)||!r.every(Number.isFinite))return null;
    projected.push([q[0]/q[2]*.5+.5,q[1]/q[2]*.5+.5]);
   }
   const screen=hull(projected);if(!screen)return null;
   // A non-centroid MSAA fragment can interpolate at the pixel centre outside
   // its covered triangle. One main framebuffer pixel encloses that offset.
   const expanded=expand(screen,1/width,1/height);if(!expanded)return null;
   const clipped=clipScreen(expanded,width,height);if(clipped.length<3)continue;
   // For fixed main screen position, reflection projection as water height
   // varies is linear-fractional. Positive denominators give endpoint extrema.
   // This accounts for off-plane pools and avoids assuming a fixed UV Jacobian.
   for(const py of ys){
    const inverse=inverse3(matrixForPlane(mainVP,py)),reflection=matrixForPlane(refVP,py);if(!inverse)return null;
    for(const point of clipped){
     const q=apply3(inverse,[point[0]*2-1,point[1]*2-1,1]),r=apply3(reflection,q);
     if(!(q[2]>1e-10&&r[2]>1e-8)||!q.every(Number.isFinite)||!r.every(Number.isFinite))return null;
     reflected.push([r[0]/r[2]*.5+.5,r[1]/r[2]*.5+.5]);
    }
   }
  }
  if(!waters||reflected.length<3)return null;
  const raw=hull(reflected),clamped=clampedHull(raw);if(!clamped)return null;
  // Clamp is 1-Lipschitz. The original .003 ripple bound also covers the calm
  // pool (.002592). Three texels retain bilinear support and the crop guard.
  let maxReflected=1;for(const p of reflected)for(let k=0;k<p.length;k++)maxReflected=Math.max(maxReflected,Math.abs(p[k]));
  const numeric=32*EPS*maxReflected,padX=.003+3/w+numeric,padY=.003+3/h+numeric;
  let maxX=-Infinity,minX=Infinity,maxY=-Infinity,minY=Infinity;
  for(const p of clamped){maxX=Math.max(maxX,p[0]);minX=Math.min(minX,p[0]);maxY=Math.max(maxY,p[1]);minY=Math.min(minY,p[1]);}
  const sx=maxX-minX,sy=maxY-minY;
  if(!(sx>1e-10&&sy>1e-10))return null;
  const result=[],sides=8;
  // Support halfspaces circumscribe the exact dilated hull. A bounded number
  // reduces CPU culling work; dropping hull edges can only retain extra draws.
  for(let i=0;i<sides;i++){
   const angle=2*Math.PI*i/sides,nx=Math.cos(angle)/sx,ny=Math.sin(angle)/sy;
   const A=-nx,B=-ny;let support=-Infinity;for(const p of clamped)support=Math.max(support,nx*p[0]+ny*p[1]);
   const C=support+Math.abs(nx)*padX+Math.abs(ny)*padY;
   const p=[];for(let k=0;k<16;k+=4)p.push(A*.5*refVP[k]+B*.5*refVP[k+1]+(C+(A+B)*.5)*refVP[k+3]);
   const length=Math.hypot(p[0],p[1],p[2]);
   if(!(length>1e-12)||!p.every(Number.isFinite))return null;
   for(let k=0;k<p.length;k++)p[k]=p[k]/length;result.push(p);
  }
  return result;
 }
 Y.ReflectionFootprint={prepare,planes};
 if(typeof module!=='undefined')module.exports={prepare,planes,_test:{hull,expand,clampedHull,matrixForPlane,inverse3,apply3,apply4,clipScreen}};
})(typeof YY==='undefined'?{}:YY);
