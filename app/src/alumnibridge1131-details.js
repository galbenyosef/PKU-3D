/* Alumni Bridge: fitted bridge/pond levels, not a measured reconstruction. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.alumniBridge,M=Y.M,G=Y.Geo;
const H={road:.12,deck:1.33,water:-.55,bed:-1.05,archDrop:1.20,half:11.25,shoulder:6.7,thickness:.22};
const top=x=>H.deck-(H.deck-H.road)*Math.max(0,Math.min(1,(Math.abs(x)-H.shoulder)/(H.half-H.shoulder)));
const gradient=x=>Math.abs(x)>H.shoulder&&Math.abs(x)<H.half?-Math.sign(x)*(H.deck-H.road)/(H.half-H.shoulder):0;
P.alumniBridge=function(...args){if(this.id!==1131)return previous.apply(this,args);const b=this,emit=b.e.add,root=M.transform(b.origin,[1,1,1],b.rotation),inverse=M.inverse(root),baseY=b.origin[1];let serial=0;
 function points(g,lm){const inv=M.inverse(lm),out=new G.Geometry();for(let i=0;i<g.v.length;i+=8){const p=M.apply(lm,[...g.v.slice(i,i+3),1]),n=g.v.slice(i+3,i+6),nn=M.norm([0,1,2].map(j=>inv[j*4]*n[0]+inv[j*4+1]*n[1]+inv[j*4+2]*n[2]));out.v.push(...p.slice(0,3),...nn,...g.v.slice(i+6,i+8));}return out;}

 function rail(g){let polys=[];for(let i=0;i<g.v.length;i+=24)polys.push([g.v.slice(i,i+8),g.v.slice(i+8,i+16),g.v.slice(i+16,i+24)]);
  for(const edge of[-H.shoulder,H.shoulder]){const next=[];for(const poly of polys){if(poly.every(p=>p[0]<=edge)||poly.every(p=>p[0]>=edge)){next.push(poly);continue;}for(const sign of[-1,1]){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],z=poly[(i+1)%poly.length],da=(a[0]-edge)*sign,dz=(z[0]-edge)*sign;if(da>=0)out.push(a);if((da>=0)!==(dz>=0)){const t=da/(da-dz);out.push(a.map((v,j)=>v+(z[j]-v)*t));}}if(out.length>=3)next.push(out);}}polys=next;}
  const out=new G.Geometry();for(const poly of polys){const slope=gradient(poly.reduce((s,p)=>s+p[0],0)/poly.length),p=poly.map(a=>{const q=a.slice(),n=M.norm([q[3]-slope*q[4],q[4],q[5]]);q[1]+=top(q[0])-2.43;q.splice(3,3,...n);return q;});for(let i=1;i+1<p.length;i++)out.v.push(...p[0],...p[i],...p[i+1]);}return out;
 }
 function slab(a,z){const g=new G.Geometry(),halfDepth=(args[2]+.35)/2;for(let i=0;i<32;i++){const x=a+(z-a)*i/32,xx=a+(z-a)*(i+1)/32,y=top(x)-baseY,yy=top(xx)-baseY,t=H.thickness;
  g.quad([x,y,-halfDepth],[x,y,halfDepth],[xx,yy,halfDepth],[xx,yy,-halfDepth]);
  g.quad([x,y-t,-halfDepth],[xx,yy-t,-halfDepth],[xx,yy-t,halfDepth],[x,y-t,halfDepth]);
  g.quad([x,y-t,-halfDepth],[x,y,-halfDepth],[xx,yy,-halfDepth],[xx,yy-t,-halfDepth]);
  g.quad([x,y-t,halfDepth],[xx,yy-t,halfDepth],[xx,yy,halfDepth],[x,y,halfDepth]);
 }for(const [x,s]of[[a,-1],[z,1]]){const y=top(x)-baseY,t=H.thickness,ps=[[x,y-t,-halfDepth],[x,y-t,halfDepth],[x,y,halfDepth],[x,y,-halfDepth]];g.quad(...(s<0?ps:ps.reverse()));}for(let i=0;i<g.v.length;i+=8){const x=g.v[i],y=g.v[i+1],z=g.v[i+2],vertical=(y-(top(x)-baseY-H.thickness))/H.thickness;g.v[i+6]=Math.abs(g.v[i+3])>.9?(z+halfDepth)/(2*halfDepth):(x+H.half)/(2*H.half);g.v[i+7]=Math.abs(g.v[i+4])>.9?(z+halfDepth)/(2*halfDepth):vertical;}return g;}
 b.e.add=function(k,g,m,c,p,uv){const lm=M.multiply(inverse,m),x=lm[12],part=p[3];let mesh=null,key=k,mm=m;
  if(k==='v9-bridge-arch'){
   mesh=points(g,lm);for(let i=0;i<mesh.v.length;i+=8){mesh.v[i+1]-=H.archDrop;if(Math.abs(g.v[i+1]-1.26)<1e-5)mesh.v[i+1]=top(mesh.v[i])-H.thickness-baseY;}
   key='alumnibridge1131-arch-'+x;
  }else if(k==='box'&&Math.abs(part-.4)<1e-6){
   mesh=points(g,lm);for(let i=0;i<mesh.v.length;i+=8)mesh.v[i+1]=g.v[i+1]>0?top(mesh.v[i])-H.thickness-baseY:H.bed-baseY;
   // The original box top becomes an inclined cap; outward normal follows it.
   for(let i=0;i<mesh.v.length;i+=8)if(mesh.v[i+4]>.9){const n=M.norm([-gradient(mesh.v[i]),1,0]);mesh.v.splice(i+3,3,...n);}key='alumnibridge1131-pier-'+x;
  }else if(k==='box'&&Math.abs(part-.65)<1e-6){mesh=slab(-H.shoulder,H.shoulder);key='alumnibridge1131-deck';
  }else if(k.startsWith('v9-bridge-slope-')){const s=k.endsWith('--1')?-1:1;mesh=slab(s<0?-H.half:H.shoulder,s<0?-H.shoulder:H.half);key='alumnibridge1131-slope-'+s;
  }else if(k==='cyl8_1'&&Math.abs(part-.54)<1e-6){mm=new Float32Array(m);mm[13]-=H.archDrop;
  }else if(k==='cyl8_1'&&Math.abs(part-.85)<1e-6){
   // Reconnect the original 8-sided end handrails to the existing final posts.
   const side=Math.sign(lm[14]),s=Math.sign(x),a=[s*10,top(10)-baseY+1.31,side*(args[2]/2+.22)],z=[s*H.half,H.road-baseY+1.31,a[2]],up=M.norm(M.sub(z,a)),edge=M.norm(M.cross(up,[0,0,1])),f=M.cross(edge,up),len=Math.hypot(...M.sub(z,a));mm=M.multiply(root,new Float32Array([...M.mul(edge,.12),0,...M.mul(up,len),0,...M.mul(f,.12),0,...a,1]));
  }else if(part>=.85){
   if(k==='box'&&Math.abs(lm[0])>.5&&Math.abs(x)+Math.abs(lm[0])/2>H.shoulder){mesh=rail(points(g,lm));key='alumnibridge1131-rail-'+serial;
   }else{mm=new Float32Array(m);mm[13]+=top(x)-2.43;}
  }
  serial++;return emit.call(this,key,mesh||g,mesh?root:mm,c,p,uv);
 };try{return previous.apply(b,args);}finally{b.e.add=emit;}
};Y.AlumniBridge1131={H,top,gradient};
})(YY);
