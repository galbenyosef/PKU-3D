/* Mu Building (pick 104) registered south door: visible upper leaf framing.
 * SFL 2023-07-06 / 2025-05-14 original photographs show separate thick red
 * leaf stiles/header, not just a thin shared grid. 2025 image: leaf header
 * y~44..73, right pane x~645..768, stile x~769..794. Perspective and people
 * prevent metrical recovery: .13 stiles/.17 header are fitted local sizes.
 * Keep existing opening, lower panels, sill, cavity, stairs and approach.
 * No conjectural handles or concealed lower decorations are introduced. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
const layout=[
 {i:0,j:0,x0:-1.6695,x1:-1.3005,y0:1.618,y1:3.862},
 {i:1,j:0,x0:-.9995,x1:-.1805,y0:1.618,y1:3.782},
 {i:2,j:0,x0:.1805,x1:.9995,y0:1.618,y1:3.782},
 {i:3,j:0,x0:1.3005,x1:1.6695,y0:1.618,y1:3.862},
 ...[[-1.7375,-1.2325],[-1.1275,-.0525],[.0525,1.1275],[1.2325,1.7375]].map(([a,b],i)=>({i,j:1,x0:a-.002,x1:b+.002,y0:4.048,y1:4.902}))
];
Y.Foreign104Joints167={layout};
A.render=function(b,f,add){if(f.properties.pickId!==104||f.properties.id!=='way/240832215')return prior.call(this,b,f,add);
 const engine=b.e,own=Object.hasOwn(engine,'add'),old=engine.add;let reference,central,frameIndex=0;
 engine.add=function(k,g,m,c,p,uv){if(k.includes('foreign104-entry-glass-1-0-'))reference=Array.from(m);
  if(k.includes('foreign104-entry-frame-')&&++frameIndex===3){central=[k,g,Array.from(m),c,p,uv];return;}
  if(k.includes('foreign104-entry-glass-')||k.includes('foreign104-entry-diamond-'))return;
  return old.call(this,k,g,m,c,p,uv);
 };
 let result;try{result=prior.call(this,b,f,add);}finally{if(own)engine.add=old;else delete engine.add;}
 if(!reference)throw new Error('foreign104-joints167: registered door basis missing');
 const M=Y.M,root=reference.slice();for(let k=0;k<3;k++){root[k]/=1.08;root[4+k]/=2.33;root[8+k]/=.035;root[12+k]=reference[12+k]+root[k]*.59-root[4+k]*2.785+root[8+k]*.022;}
 // Preserve exact old central lower/upper pieces; only its visible door segment is split.
 if(!central)throw new Error('foreign104-joints167: central frame missing');
 for(const [lo,hi]of[[1.05,1.62],[3.95,4.96]]){const [k,g,m,c,p,uv]=central,n=m.slice(),cy=(lo+hi)/2;for(let j=0;j<3;j++){n[4+j]=m[4+j]*(hi-lo)/3.91;n[12+j]=m[12+j]+m[4+j]*(cy-3.005)/3.91;}old.call(engine,k,g,new Float32Array(n),c,p,uv);}
 const local=new Y.Builder({add(k,g,m,c,p,uv){return old.call(engine,'foreign104-joints167-'+k,g,M.multiply(root,m),c,p,uv);}});local.id=104;
 const red='#78382d',box=(name,x,y,w,h,d=.12,z=0)=>{const prev=local.e.add;local.e.add=(k,...args)=>prev(name+'-'+k,...args);try{local.box(x,y,z,w,h,d,red,6);}finally{local.e.add=prev;}};
 // Two independent leaf frames; concealed lower panels remain unchanged.
 for(const s of[-1,1]){for(const x of[.1175,1.0625])box('leaf-stile',s*x,2.779,.13,2.318,.12,-.018);box('leaf-header',s*.59,3.859,1.075,.158,.12,-.018);box('meeting-stile',s*.02925,2.779,.0465,2.318,.12,-.018);}
 // Closed meeting/top clearance: real recess with a back stop, no black decal.
 box('meeting-stop',0,2.785,.04,2.33,.09,-.095);
 box('head-stop',0,3.944,2.27,.052,.09,-.095);
 // Fixed lights have their own fine inner bead, supported by the old outer frame.
 for(const s of[-1,1]){for(const x of[1.2675,1.7025])box('fixed-bead',s*x,2.785,.07,2.33);box('fixed-header',s*1.485,3.905,.505,.09);}
 for(const p of layout){const {x0,x1,y0,y1}=p,xc=(x0+x1)/2,yc=(y0+y1)/2,name='pane-'+p.i+'-'+p.j;
  const prev=local.e.add;local.e.add=(k,...args)=>prev(name+'-'+k,...args);
  const dz=p.j===0&&(p.i===1||p.i===2)?-.018:0;
  try{local.box(xc,yc,-.022+dz,x1-x0,y1-y0,.035,'#66817b',5);
   for(const slope of[-1,1])for(let q=-12;q<=12;q++){const intercept=yc+q*.43,pts=[];for(const x of[x0,x1]){const y=slope*(x-xc)+intercept;if(y>=y0&&y<=y1)pts.push([x,y,.065+dz]);}for(const y of[y0,y1]){const x=xc+(y-intercept)/slope;if(x>x0&&x<x1)pts.push([x,y,.065+dz]);}if(pts.length===2)local.beam(pts[0],pts[1],.028,red,6);}
  }finally{local.e.add=prev;}
 }
 return result;
};})(YY);
