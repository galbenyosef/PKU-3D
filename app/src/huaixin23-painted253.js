/* Candidate: four photo-fitted Huaixin bracket plates and the narrow red header.
 * Huang Yizhi IMG_7765-1. Broad scroll/leaf silhouettes only, not fine floral detail.
 * Normalized motifs are mirrored; inner/outer widths follow ~104:90 photo pixels. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='relation/14320160',prefix='huaixin253-bracket-';
const outline=[[0,0],[1.14,0],[1.10,-.10],[1.04,-.285],[.94,-.245],[.83,-.225],[.71,-.24],[.57,-.295],[.40,-.335],[.20,-.345],[0,-.345]];
function meshes(dir){
 const q=outline.map(([x,y])=>[dir*x,y]),g=new G.Geometry(),front=.425,back=.245,center=[dir*.48,-.075];
 for(let i=0;i<q.length;i++){let a=q[i],b=q[(i+1)%q.length];if(dir>0)[a,b]=[b,a];g.tri([center[0],center[1],front],[a[0],a[1],front],[b[0],b[1],front]);g.tri([center[0],center[1],back],[b[0],b[1],back],[a[0],a[1],back]);g.quad([a[0],a[1],back],[b[0],b[1],back],[b[0],b[1],front],[a[0],a[1],front]);}
 const border=new G.Geometry();for(let i=0;i<q.length;i++){const a=q[i],b=q[(i+1)%q.length],aa=[a[0]*.95+center[0]*.05,a[1]*.90+center[1]*.10],bb=[b[0]*.95+center[0]*.05,b[1]*.90+center[1]*.10],p=[[a[0],a[1],front+.003],[b[0],b[1],front+.003],[bb[0],bb[1],front+.003],[aa[0],aa[1],front+.003]];if(dir>0)p.reverse();border.quad(...p);}
 const cream=new G.Geometry(),green=new G.Geometry(),blue=new G.Geometry();
 // Fit the painted field to each local plate depth, retaining an inset border.
 const bottom=outline.slice(1).reverse();
 const mapped=(p,z)=>{const x=p[0]*1.14;let depth=.345;for(let i=1;i<bottom.length;i++){const a=bottom[i-1],b=bottom[i];if(x>=a[0]&&x<=b[0])depth=-(a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]));}return[dir*x,-(.08+.82*p[1])*depth,z];};
 const quad=(mesh,pts,z)=>{const p=pts.map(v=>mapped(v,z));if(dir<0)p.reverse();mesh.quad(...p);};
 function line(mesh,pts,width,z){for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=(b[1]-a[1])*.345/1.14,l=Math.hypot(dx,dy);if(l<1e-8)continue;const nx=-dy/l*width,ny=dx/l*width*1.14/.345;quad(mesh,[[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],z);}}
 function curve(start,segments){const p=[start];for(const [a,b,c]of segments){const s=p[p.length-1];for(let j=1;j<=12;j++){const t=j/12,u=1-t;p.push([u*u*u*s[0]+3*u*u*t*a[0]+3*u*t*t*b[0]+t*t*t*c[0],u*u*u*s[1]+3*u*u*t*a[1]+3*u*t*t*b[1]+t*t*t*c[1]]);}}return p;}
 // Large light-colour scrolling stems, traced as broad loops from the visible
 // panels; no invented petals, bird/dragon figures or micro ornament.
 const paths=[
 curve([.20,.80],[[[.38,.96],[.46,.55],[.34,.30]],[[.23,.07],[.19,.45],[.28,.54]],[[.36,.57],[.36,.36],[.30,.37]]]),
 curve([.39,.70],[[[.49,.84],[.57,.49],[.50,.23]],[[.43,.00],[.37,.22],[.40,.41]],[[.43,.51],[.48,.39],[.46,.31]]]),
 curve([.55,.63],[[[.64,.81],[.74,.42],[.67,.23]],[[.62,.07],[.54,.13],[.57,.31]],[[.59,.43],[.65,.36],[.63,.25]]]),
 curve([.72,.53],[[[.82,.67],[.88,.38],[.82,.19]],[[.77,.07],[.72,.13],[.73,.27]],[[.75,.37],[.80,.33],[.78,.25]]])];
 for(const p of paths){line(blue,p,.020,front+.004);line(cream,p,.009,front+.006);}
 // Broad turquoise leaf curls between the pale stems. These colour regions
 // follow the photo's readable sweep, not a conjectural detailed floral stamp.
 for(const p of[
 curve([.20,.85],[[[.22,.58],[.34,.75],[.35,.91]]]),
 curve([.33,.18],[[[.38,.01],[.47,.06],[.49,.18]]]),
 curve([.49,.73],[[[.57,.89],[.65,.72],[.65,.59]]]),
 curve([.66,.10],[[[.75,.00],[.78,.09],[.78,.17]]]),
 curve([.82,.49],[[[.87,.56],[.90,.38],[.91,.24]]])]){line(green,p,.025,front+.005);line(cream,p,.004,front+.007);}
 // Readable near-pillar upright fan and its pale border.
 line(green,[[.08,.87],[.095,.18]],.042,front+.004);
 line(cream,[[.035,.07],[.16,.07],[.16,.91],[.035,.91],[.035,.07]],.006,front+.008);
 for(const x of[.05,.075,.10,.125,.15])line(cream,[[.095,.83],[x,.16]],.0035,front+.008);
 return{body:g,border,cream,green,blue};
}
// Four visible upright painted panels, registered to IMG_7765-1's pillar axes.
// The .18 m depth follows the existing bracket display fit, not a measured board.
// Outer panels attach at the bracket foot only; hidden upper fixing is unknown.
const vertical291={prefix:'huaixin291-vertical-',centres:[-3.16,-2.10,2.10,3.16],width:.28,bottom:3.315,top:4.16,back:.245,front:.425};
let verticalCache291;
function verticalMeshes291(){
 if(verticalCache291)return verticalCache291;
 const body=new G.Geometry(),cream=new G.Geometry(),green=new G.Geometry(),edge=new G.Geometry(),v=vertical291;
 const quad=(g,x0,y0,x1,y1,z)=>g.quad([x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]);
 for(const cx of v.centres){
  const l=cx-v.width/2,r=cx+v.width/2,b=v.bottom,t=v.top,f=v.front,k=v.back;
  quad(body,l,b,r,t,f);body.quad([r,b,k],[l,b,k],[l,t,k],[r,t,k]);
  body.quad([l,b,k],[l,b,f],[l,t,f],[l,t,k]);body.quad([r,b,f],[r,b,k],[r,t,k],[r,t,f]);
  body.quad([l,t,f],[r,t,f],[r,t,k],[l,t,k]);body.quad([l,b,k],[r,b,k],[r,b,f],[l,b,f]);
  // Narrow pale perimeter; no invented flowers in the upper shadowed field.
  const inset=.010,w=.010;quad(edge,l+inset,b+inset,l+inset+w,t-inset,f+.002);quad(edge,r-inset-w,b+inset,r-inset,t-inset,f+.002);
  quad(edge,l+inset+w,b+inset,r-inset-w,b+inset+w,f+.002);quad(edge,l+inset+w,t-inset-w,r-inset-w,t-inset,f+.002);
  // Broad squared returning strokes visible in the four blue upright fields.
  // Piecewise orthogonal path; ratios are photo fits, not micro-ornament tracing.
  const path=[[.18,.06],[.18,.22],[.78,.22],[.78,.07],[.39,.07],[.39,.15],[.58,.15],
   [.58,.29],[.18,.29],[.18,.45],[.78,.45],[.78,.30],[.39,.30],[.39,.38],[.58,.38],
   [.58,.52],[.18,.52],[.18,.68],[.78,.68],[.78,.53],[.39,.53],[.39,.61],[.58,.61],
   [.58,.75],[.18,.75],[.18,.92],[.78,.92],[.78,.76],[.39,.76],[.39,.85],[.58,.85]];
  // Union orthogonal stroke rectangles on a partition grid: joins do not stack
  // coplanar faces, and the narrow cream halo/green core have disjoint regions.
  const rects=width=>path.slice(1).map((q,i)=>{const a=path[i],x0=l+a[0]*v.width,x1=l+q[0]*v.width,y0=t-a[1]*(t-b),y1=t-q[1]*(t-b);return[Math.min(x0,x1)-width/2,Math.min(y0,y1)-width/2,Math.max(x0,x1)+width/2,Math.max(y0,y1)+width/2];});
  const outer=rects(.029),inner=rects(.016),all=outer.concat(inner),xs=[...new Set(all.flatMap(q=>[q[0],q[2]]))].sort((a,b)=>a-b),ys=[...new Set(all.flatMap(q=>[q[1],q[3]]))].sort((a,b)=>a-b);
  const inside=(list,x,y)=>list.some(q=>x>q[0]&&x<q[2]&&y>q[1]&&y<q[3]);
  for(let j=1;j<ys.length;j++){let start=null,last=null;const flush=x=>{if(start!==null)quad(last===2?green:cream,start,ys[j-1],x,ys[j],f+.003);start=null;};for(let i=1;i<xs.length;i++){const x=(xs[i-1]+xs[i])/2,y=(ys[j-1]+ys[j])/2,kind=inside(inner,x,y)?2:inside(outer,x,y)?1:0;if(kind!==last){flush(xs[i-1]);if(kind)start=xs[i-1];last=kind;}}flush(xs[xs.length-1]);}
 }
 return verticalCache291={body,edge,cream,green};
}

const cache={};
A.render=function(b,f,add){const result=previous(b,f,add);if(f.properties.id!==ID)return result;const entry=Y.CourtyardVisualFix46.parts.entry;
 b.local(entry.point[0],0,entry.point[1],entry.rotation,()=>{
  // The photo's narrow red horizontal header lies just behind the plate tops.
  // Its rear overlaps the existing 3.215 m header; its front meets the plates.
  b.mesh(prefix+'header',G.box(),0,3.305,-.025,7.70,.04,.84,'#984437',6);
  for(const side of[-1,1])for(const toward of[-1,1]){
   const dir=side*toward,m=cache[dir]||(cache[dir]=meshes(dir)),x=side*2.62+dir*.10,sx=toward<0?1:.865;
   for(const[name,color]of[['body','#9e4540'],['border','#d9bd64'],['blue','#254e6b'],['green','#4b9680'],['cream','#e3d8a4']])b.mesh(prefix+dir+'-'+name,m[name],x,3.32,0,sx,1,1,color,6);
  }
  for(const[name,color]of[['body','#254e6b'],['edge','#d9cf9d'],['cream','#c9d5b6'],['green','#579887']])b.mesh(vertical291.prefix+name,verticalMeshes291()[name],0,0,0,1,1,1,color,6);
 });return result;
};
Y.Huaixin253={id:ID,prefix,outline,meshes};
Y.Huaixin291={...vertical291,meshes:verticalMeshes291};
})(YY);
