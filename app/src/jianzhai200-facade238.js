/* Photo-fitted south elevation candidate. Rear elevation remains unverified.
 * The upper stair opening is a recess only: its obscured door leaves are unknown. */
(function(Y){'use strict';
 const P=Y.Builder.prototype,old=P.northJian,A=Y.ArchitectureAdapter,adapt=A.render,M=Y.M;
 const H={lowX:7.43,upperX:26,halfDoor:1.40,ground:.12/1.0068476066617453,lowTop:2.68,landing:3.16/1.0068476066617453,upperTop:5.55};
 let options=null;
 A.render=function(b,f,method,source,opts={}){
  if(f.properties.pickId!==200)return adapt.call(this,b,f,method,source,opts);
  const previous=options,copy={...opts};options=copy;
  try{return adapt.call(this,b,f,method,source,copy);}finally{options=previous;}
 };
 P.northJian=function(p,w,d){
  if(this.id!==200)return old.call(this,p,w,d);
  const b=this,emit=b.e.add,records=[];
  b.e.add=function(k,g,m,c,params,uv){records.push({k,g,m:new Float32Array(m),c,params:Array.from(params),uv});};
  try{old.call(b,p,w,d);}finally{b.e.add=emit;}
  const bounds=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];
  for(const r of records){const q=[Infinity,Infinity,Infinity,-Infinity,-Infinity,-Infinity];for(let i=0;i<r.g.v.length;i+=8){const v=M.apply(r.m,[...r.g.v.slice(i,i+3),1]);for(let j=0;j<3;j++){q[j]=Math.min(q[j],v[j]);q[j+3]=Math.max(q[j+3],v[j]);}}if(q[4]<1.3)continue;for(let j=0;j<3;j++){bounds[j]=Math.min(bounds[j],q[j]);bounds[j+3]=Math.max(bounds[j+3],q[j+3]);}}
  if(!options)throw Error('Jian facade requires original Adapter frame');
  options.sourceFrame={w:bounds[3]-bounds[0],d:bounds[5]-bounds[2],centre:[(bounds[0]+bounds[3])/2,(bounds[2]+bounds[5])/2]};
  const gallery=new Set(['v17-gallery-slab','v17-gallery-rail','v17-red-column','v17-painted-gold']);
  // Capture the lower canopy by its generating call, rather than matching a
  // shared roof key that also belongs to the unchanged main roof.
  const lowerRoof=[];const saved=b.e.add;b.e.add=(k,g,m,c,params,uv)=>lowerRoof.push(JSON.stringify([k,Array.from(m),c,Array.from(params)]));
  try{b.n17Roof(0,5.18,d/2+2,w-2,4.6,1.5);}finally{b.e.add=saved;}
  const canopy=new Set(lowerRoof);
  const openings=[[H.lowX-H.halfDoor,H.lowX+H.halfDoor,H.ground,H.lowTop],[H.upperX-H.halfDoor,H.upperX+H.halfDoor,H.landing,H.upperTop]];
  function openedBox(k,x,y,z,width,height,depth,c,mat,part){
   const bottom=y-height/2,top=y+height/2,front=z+depth/2,skin=Math.min(1.20,depth),cuts=[-width/2+x,width/2+x];
   for(const h of openings)cuts.push(Math.max(cuts[0],Math.min(x+width/2,h[0])),Math.max(cuts[0],Math.min(x+width/2,h[1])));
   const xs=[...new Set(cuts)].sort((a,b)=>a-b);
   if(depth>skin)b.n17Box(k+'-core',x,y,z-skin/2,width,height,depth-skin,c,mat,part);
   for(let i=1;i<xs.length;i++){const lo=xs[i-1],hi=xs[i],mid=(lo+hi)/2,hole=openings.find(h=>mid>h[0]&&mid<h[1]);const spans=hole?[[bottom,Math.min(top,hole[2])],[Math.max(bottom,hole[3]),top]]:[[bottom,top]];for(const [a,z1]of spans)if(z1-a>1e-6)b.n17Box(k+'-front',mid,(a+z1)/2,front-skin/2,hi-lo,z1-a,skin,c,mat,part);}
  }
  for(const r of records){
   if(r.k==='v17-plaster-wall'||r.k==='v17-stone-plinth'||r.k==='v17-floor-belt'){openedBox('jian238-'+r.k,r.m[12],r.m[13],r.m[14],r.m[0],r.m[5],r.m[10],r.c,r.params[0],r.params[3]);continue;}
   if(r.m[12]>w/2&&['v17-glass','v17-window-frame','v17-lattice'].includes(r.k))continue;
   if(gallery.has(r.k)||canopy.has(JSON.stringify([r.k,Array.from(r.m),r.c,r.params])))continue;
   if(r.m[14]>d/2&&(['v17-glass','v17-window-frame','v17-lattice','v17-painted-frieze'].includes(r.k)||(r.k==='cyl12_1'&&r.params[0]===10)||(r.k==='cyl8_1'&&r.params[0]===6)))continue;
   emit.call(b.e,r.k,r.g,r.m,r.c,r.params,r.uv);
  }
  openedBox('jian238-stone-facing',0,1.575,d/2+.10,w,3.15,.20,'#b8b5a2',10,.56);
  b.n17Box('jian238-east-stone',w/2+.10,1.575,0,.20,3.15,d+.20,'#b8b5a2',10,.56);
  // Captioned SE-corner photograph: the exposed east wall has a narrow
  // middle south-side window, a taller north-side red opening with a lower
  // sill, and one offset lower window. Fit only their visible rectangles;
  // the tall opening's use and the tree-hidden entrance remain unknown.
  // u runs from the south corner (photo left, +z) to the north corner (-z).
  // Ratios use the wall edges and stone-facing top; they are not a survey.
  for(const [u,y,width,height] of[
   [.38,5.82,.10,1.20],
   [.86,5.28,.18,2.30],
   [.66,2.15,.15,1.20]
  ]){
   // The captioned southeast photograph shows red infill in the taller north
   // opening and lower offset window. Their fine internal pattern is unresolved;
   // keep the fitted outer geometry, and do not label the tall opening a door.
   const redInfill=y===5.28?'#a34d39':y===2.15?'#b56b58':null,box=b.n17Box,ownsBox=Object.prototype.hasOwnProperty.call(b,'n17Box');
   if(redInfill)b.n17Box=function(k,...args){
    if(k==='v17-glass'){args[6]=redInfill;args[7]=20;}
    return box.call(this,k,...args);
   };
   try{b.n17Lattice(w/2+.24,y,(.5-u)*d,d*width,height,Math.PI/2);}
   finally{if(redInfill){if(ownsBox)b.n17Box=box;else delete b.n17Box;}}
  }
  // Keep the separately reviewed R2 top window unchanged.
  b.n17Lattice(w/2+.24,8.05,0,d*.33,1.20,Math.PI/2);
  const bays=Math.max(3,Math.round(w/4.6)),bay=w/bays;
  for(let i=0;i<=bays;i++)b.n17Box('jian238-red-pilaster',-w/2+i*bay,6.59,d/2+.15,.16,6.88,.10,'#934838',6,.8);
  for(const y of[1.56,4.73,8.05])for(let i=0;i<bays;i++){
   const x=-w/2+(i+.5)*bay;
   if(openings.some(h=>x+1.45>h[0]&&x-1.45<h[1]&&y+1.10>h[2]&&y-1.10<h[3]))continue;
   b.n17Lattice(x,y,d/2+.24,Math.min(2.9,bay*.59),2.10,0);
  }
  for(const h of openings){const x=(h[0]+h[1])/2,y=(h[2]+h[3])/2,height=h[3]-h[2];
   for(const side of[-1,1])b.n17Box('jian238-door-reveal',x+side*(H.halfDoor+.07),y,d/2-.42,.14,height,1.04,'#b8b5a2',10,.6);
   b.n17Box('jian238-door-lintel',x,h[3]+.07,d/2-.42,2*H.halfDoor+.28,.14,1.04,'#b8b5a2',10,.6);
   b.n17Box('jian238-door-threshold',x,h[2]-.045,d/2-.05,2*H.halfDoor,.09,1.50,'#b8b5a2',10,.6);
   if(x===H.upperX){b.n17Box('jian238-unverified-upper-recess',x,y,d/2-.95,2*H.halfDoor,height,.08,'#343a35',24,.65);continue;}
   for(const side of[-1,1]){b.n17Box('jian238-low-red-leaf',x+side*.68,y-.20,d/2-.65,1.32,height-.40,.10,'#843f31',6,.8);b.n17Box('jian238-low-inset-panel',x+side*.68,y-.20,d/2-.585,.98,height-.77,.04,'#74352c',6,.81);}
   b.n17Box('jian238-low-transom',x,h[3]-.18,d/2-.62,2.66,.31,.08,'#465750',5,.8);
   for(const xx of[h[0]+.04,x,h[1]-.04])b.n17Box('jian238-low-stile',xx,y,d/2-.55,.08,height,.15,'#934838',6,.82);
  }
 };
 Y.JianFacade238={H};
})(YY);
