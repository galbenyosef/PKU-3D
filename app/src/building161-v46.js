/* Weixiu kindergarten, target source ring only. The official 2025/2026 south
 * photographs show three upper glazed projections, white frames and red bands.
 * Registration/dimensions are fitted; ground-floor entrances and adjacent
 * 160/135 structural identities are not inferred from the obscured photos. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/876533977',C={frame:'#e5e5da',glass:'#718985',band:'#874439',soffit:'#d4d3c4'};
const levels=[{bottom:3.95,top:7.05},{bottom:7.65,top:10.85}],depth=1.20;
function galleries(f){const p=f.geometry.coordinates[0],segments=[{a:p[6],c:p[5],ranges:[[1.2,14.5]]},{a:p[4],c:p[3],ranges:[[2.0,13.6],[17.1,28.7]]}];
 return segments.map((s,i)=>{const len=Math.hypot(s.c[0]-s.a[0],s.c[1]-s.a[1]),t=[(s.c[0]-s.a[0])/len,(s.c[1]-s.a[1])/len],n=[-t[1],t[0]];return{...s,i,len,t,n,r:Math.atan2(n[0],n[1])};});}
// Subtract open rectangles, retaining all positive-area wall/frame remainders.
function subtract(rect,holes){let pieces=[rect];for(const h of holes)pieces=pieces.flatMap(q=>{const x0=Math.max(q[0],h[0]),x1=Math.min(q[1],h[1]),y0=Math.max(q[2],h[2]),y1=Math.min(q[3],h[3]);return x1<=x0||y1<=y0?[q]:[[q[0],x0,q[2],q[3]],[x1,q[1],q[2],q[3]],[x0,x1,q[2],y0],[x0,x1,y1,q[3]]].filter(p=>p[1]-p[0]>1e-8&&p[3]-p[2]>1e-8);});return pieces;}
function render(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);
 const ss=galleries(f),holes=s=>s.ranges.flatMap(([a,c])=>levels.map(l=>[a,c,l.bottom,l.top])),loc=(s,p)=>[(p[0]-s.a[0])*s.t[0]+(p[1]-s.a[1])*s.t[1],(p[0]-s.a[0])*s.n[0]+(p[1]-s.a[1])*s.n[1]];
 const oldBox=b.box,oldWindow=b.window;
 b.window=function(x,y,z,w,h,r,...rest){const s=ss.find(s=>Math.abs(Math.sin(r-s.r))<1e-7&&Math.cos(r-s.r)>.99&&Math.abs(loc(s,[x,z])[1])<.12);if(s){const u=loc(s,[x,z])[0];if(holes(s).some(q=>u+w/2>q[0]&&u-w/2<q[1]&&y+h/2>q[2]&&y-h/2<q[3]))return;}return oldWindow.call(this,x,y,z,w,h,r,...rest);};
 b.box=function(...a){const w=this.world([a[0],a[1],a[2]]),s=ss.find(s=>Math.abs(Math.sin(this.rotation-s.r))<1e-7&&Math.cos(this.rotation-s.r)>.99&&Math.abs(loc(s,[w[0],w[2]])[1])<.65);if(!s)return oldBox.apply(this,a);
  // Only the original dorm decorations on these two south planes are replaced.
  // Full-height generic piers retain their exact ground-floor volume below 3.55.
  const eq=(x,y)=>Math.abs(x-y)<1e-7;
  const pier=a[6]==='#e4e3d8'&&a[7]===24&&eq(a[3],.25)&&eq(a[4],f.properties.height)&&eq(a[5],.34)&&eq(a[1],f.properties.height/2)&&eq(a[2],-.03);
  const belt=(a[6]==='#e2e2d7'&&a[7]===24&&eq(a[4],.38)&&eq(a[5],.42)&&eq(a[2],.09))||
   (a[6]==='#bdc4b8'&&a[7]===29&&eq(a[4],.08)&&eq(a[5],.29)&&eq(a[2],.08))||
   (a[6]==='#c9cec0'&&a[7]===24&&eq(a[4],.13)&&eq(a[5],.11)&&eq(a[2],.025));
  if(pier)return oldBox.call(this,a[0],3.55/2,a[2],a[3],3.55,...a.slice(5));
  if(belt&&w[1]-a[4]/2>=3.55)return;
  const u=loc(s,[w[0],w[2]])[0],rect=[a[0]-a[3]/2,a[0]+a[3]/2,a[1]-a[4]/2,a[1]+a[4]/2],cut=holes(s).map(q=>[q[0]-u+a[0],q[1]-u+a[0],q[2]-this.origin[1],q[3]-this.origin[1]]),pieces=subtract(rect,cut);
  if(pieces.length===1&&pieces[0]===rect)return oldBox.apply(this,a);
  for(const q of pieces)oldBox.call(this,(q[0]+q[1])/2,(q[2]+q[3])/2,a[2],q[1]-q[0],q[3]-q[2],...a.slice(5));
 };
 let result;
 try{result=previous.call(this,b,f,(key,g,color,mat,id)=>{
  if(key!=='v30-walls-'+f.properties.pickId+'-undefined'){add(key,g,color,mat,id);return;}
  const out=new Y.Geo.Geometry(),south=new Y.Geo.Geometry(),ring=f.geometry.coordinates[0];
  // Keep the original triangles for every non-target source edge byte-for-byte.
  for(let edge=0;edge<ring.length-1;edge++){
   const s=ss.find(s=>Math.hypot(ring[edge][0]-s.c[0],ring[edge][1]-s.c[1])<1e-7&&Math.hypot(ring[edge+1][0]-s.a[0],ring[edge+1][1]-s.a[1])<1e-7);
   if(!s){out.v.push(...g.v.slice(edge*48,(edge+1)*48));continue;}
   const point=(u,y)=>[s.a[0]+s.t[0]*u,y,s.a[1]+s.t[1]*u];
   for(const q of subtract([0,s.len,.30,f.properties.height],holes(s)))south.quad(point(q[0],q[2]),point(q[1],q[2]),point(q[1],q[3]),point(q[0],q[3]));
  }add('161-retained-other-walls',out,color,mat,id);add('161-aperture-south-walls',south,'#a4a39a',24,id);
 });}finally{b.box=oldBox;b.window=oldWindow;}
 let index=0;
 for(const s of ss)for(const [a,c]of s.ranges){const width=c-a,mid=(a+c)/2,tag='161-south-gallery-'+index++,original=b.e.add;
  b.local(s.a[0]+s.t[0]*mid,0,s.a[1]+s.t[1]*mid,s.r,()=>{b.e.add=function(k,...args){return original.call(this,tag+'-'+k,...args);};try{
   // Slabs run back through the original wall plane; no invented ground columns.
   for(const q of[{bottom:3.55,top:3.95,slab:3.65},{bottom:7.05,top:7.65,slab:7.15},{bottom:10.85,top:11.35,slab:11.15}]){
    const y=(q.bottom+q.top)/2,h=q.top-q.bottom;
    b.box(0,q.slab,(depth-.32)/2,width+.16,.20,depth+.32,C.soffit,24);
    b.box(0,y,depth+.025,width+.16,h,.15,C.band,24);
    for(const x of[-width/2,width/2])b.box(x,y,depth/2,.15,h,depth+.15,C.band,24);
   }
   for(const l of levels){const h=l.top-l.bottom,y=(l.top+l.bottom)/2;
    b.box(0,y,depth-.055,width-.10,h-.07,.032,C.glass,5);
    for(const yy of[l.bottom,l.bottom+.87,l.top-.62,l.top])b.box(0,yy,depth+.005,width+.04,.075,.12,C.frame,9);
    const bays=Math.round(width/1.30);for(let k=0;k<=bays;k++)b.box(-width/2+k*width/bays,y,depth+.005,.075,h,.12,C.frame,9);
    for(const side of[-1,1]){
     const x=side*width/2;
     // Extend each side pane 12.5 mm into both end stiles; the rear wall is open.
     b.box(x-side*.045,y,depth/2,.032,h-.07,depth-.05,C.glass,5);
     for(const z of[0,depth/2,depth])b.box(x,y,z,.12,h,.075,C.frame,9);
     for(const yy of[l.bottom,l.bottom+.87,l.top-.62,l.top])b.box(x,yy,depth/2,.12,.075,depth+.04,C.frame,9);
    }
   }
  }finally{b.e.add=original;}});
 }
 return{...result,strategy:'building161-v46',southGlazedProjections:3,entranceVerified:false,facadeRegistrationFitted:true,sourceOutline:true};
}
Y.Building161={id:ID,render,galleries,levels,depth,subtract};A.render=render;
})(YY);
