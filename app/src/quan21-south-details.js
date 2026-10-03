/* Quanzhai south entry, matched to the named post-restoration frontal and
 * east-to-west photographs in 西子, 镜春园新貌（二）. Dimensions remain fitted.
 * The north passage, all existing roofs, and the courtyard stay intact. */
(function(Y){'use strict';
const ID='relation/13281267',previous=Y.Architecture30.render;
function entry(b,z){
 const box=(name,x,y,d,w,h,t,c,mat=38)=>b.n17Box('quan21-south-'+name,x,y,z+d,w,h,t,c,mat,.6);
 const red='#913d30',stone='#aaa99d';
 // Three bays: central solid door cheeks, two double-screen side bays, four
 // round painted columns. The old front wall is cut away behind these screens.
 for(const side of[-1,1]){
  box('jamb',side*1.55,2.26,-.02,.20,4.20,.32,red);
  box('door-cheek',side*2.25,2.26,-.14,1.20,4.20,.24,red);
  for(const y of[.95,1.32,3.48])box('door-recess',side*2.25,y,.002,.92,.075,.05,'#a0523c');
  box('stone-jamb-foot',side*1.61,.55,.10,.28,.78,.43,stone,10);
  box('brick-base',side*5.2,.60,-.15,4.50,.88,.60,'#858d87',30);
  box('stone-sill',side*5.2,1.06,-.11,4.52,.10,.64,stone,10);
  for(const x of[4.08,6.32]){
   box('screen-frame',side*x,2.70,-.10,2.22,3.24,.22,red);
   box('screen-glass',side*x,1.97,.022,1.89,1.22,.035,'#819c8a',28);
   box('screen-upper',side*x,3.48,.022,1.89,1.05,.035,'#566d57',28);
   for(const dx of[-.70,-.47,-.24,0,.24,.47,.70])box('screen-lattice',side*x+dx,3.48,.05,.044,1.05,.05,red);
   for(const yy of[1.46,2.48]){box('screen-inset',side*x,yy,.055,1.61,.065,.065,red);for(const dx of[-.80,.80])box('screen-inset',side*x+dx,1.97,.055,.065,1.07,.065,red);}
   box('screen-rail',side*x,2.75,.05,2.14,.13,.08,red);
  }
 }
 for(const x of[-7.5,-3,3,7.5]){box('column-foot',x,.20,.29,.42,.40,.44,stone,10);b.mesh('quan21-south-column',b.geo('quan21-south-column',()=>Y.Geo.cylinder(20)),x,.40,z+.29,.20,4.69,.20,red,38,.6);}
 box('door-head',0,4.32,-.04,3.30,.26,.32,red);
 box('lintel',0,4.83,-.06,15.1,.42,.45,red);
 box('frieze',0,5.10,.015,15.15,.23,.48,'#3a6862');
 for(const x of[-7.5,-3,3,7.5]){box('column-cap',x,4.75,.34,.45,.52,.48,'#31545c');for(const yy of[4.52,4.97])box('cap-gold',x,yy,.59,.44,.035,.025,'#bdad72');}
 for(const x of[-5.25,0,5.25]){box('beam-inlay',x,4.77,.19,3.7,.045,.055,'#bb9c60');}
 box('threshold',0,.28,-.05,2.78,.24,.34,red);
 // The photographed south plaque names BICMR; 全斋 is the north gate plaque.
 const key='quan21-south-bicmr',text='北京国际数学研究中心';let uv=b.signs.get(key);
 if(!uv){const k=b.nSigns++,px=k%8*512,py=Math.floor(k/8)*128,c=b.ctx;c.fillStyle='#264f62';c.fillRect(px,py,512,128);c.strokeStyle='#c6a553';c.lineWidth=8;c.strokeRect(px+7,py+7,498,114);c.textAlign='center';c.textBaseline='middle';c.font='600 40px "Noto Serif CJK SC","Songti SC",serif';c.fillStyle='#e0c17a';c.fillText(text,px+256,py+65);uv=[(px+.5)/4096,1-(py+127.5)/4096,511/4096,127/4096];b.signs.set(key,uv);}
 b.mesh('plane',b.geo('plane',Y.Geo.plane),0,4.68,z+.27,4.3,.86,1,'#ffffff',8,1,0,uv);
}
function approach(result,road){
 if(!road||road.geometry.type!=='LineString'||!result.southEntry)return null;
 const origin=result.southEntry,r=result.frame.r,c=Math.cos(r),s=Math.sin(r),[sx,sy,sz]=result.scale,half=road.properties.width/2;
 const local=p=>[(p[0]-origin[0])*c-(p[1]-origin[2])*s,(p[0]-origin[0])*s+(p[1]-origin[2])*c],world=(u,v)=>[origin[0]+u*c+v*s,origin[2]-u*s+v*c];
 const line=road.geometry.coordinates,tread=1.5*sz,us=[-2*sx,2*sx];let best=null;
 // Match Geometry.ribbon's endpoint tangents, including the next road segment.
 for(const side of[-1,1]){const edge=line.map((p,i)=>{const a=line[Math.max(0,i-1)],b=line[Math.min(line.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);return local([p[0]-side*dz/len*half,p[1]+side*dx/len*half]);});
  for(let i=1;i<edge.length;i++){const a=edge[i-1],b=edge[i],du=b[0]-a[0];if(Math.abs(du)<1e-8)continue;const ts=us.map(u=>(u-a[0])/du);if(ts.some(t=>t<0||t>1))continue;const vs=ts.map(t=>a[1]+t*(b[1]-a[1]));if(vs.some(v=>v<tread+.1||v>tread+30))continue;const distance=(vs[0]+vs[1])/2-tread;if(!best||distance<best.distance)best={distance,vs};}
 }
 if(!best)return null;const front=us.map(u=>world(u,tread)),roadEdge=us.map((u,i)=>world(u,best.vs[i]));return{front,roadEdge,outline:[front[0],front[1],roadEdge[1],roadEdge[0]],stepY:.12*sy,roadY:.12,roadId:road.properties.id,width:4*sx};
}
Y.Architecture30.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);const sign=b.sign,emit=b.e.add,box=b.n17Box,lattice=b.n17Lattice,roof=b.n17Roof,adapter=Y.ArchitectureAdapter.render;let gate;
 const source=Y.ARCHIVE.legacy[String(f.properties.legacyId)],sourceW=source.modelSize?.[0]||source.w*2.5,sourceD=source.modelSize?.[1]||source.d*2.5;
 Y.ArchitectureAdapter.render=function(bb,ff,method,ss,opts){return adapter.call(this,bb,ff,method,ss,ff===f?{...opts,sourceFrame:{w:sourceW+2.78,d:sourceD+2.78,centre:[0,0]}}:opts);};
 b.n17Box=function(k,x,y,z,w,h,d,...rest){const p=this.world([x,y,z]);
  if(k==='v17-plaster-wall'&&Math.abs(p[2]-(sourceD/2-2.85))<.001&&Math.abs(this.rotation)<.001){
   const side=Math.sign(p[0]),inner=3,cut=7.5,end=Math.abs(p[0])+w/2,outerW=end-cut,innerW=cut-inner;
   // Remove the front .70 m of the inner wall segment. Keep its room-side
   // mass and the outer wall, instead of covering the old window with a patch.
   box.call(this,k,side*(cut+outerW/2)-this.origin[0],y,z,outerW,h,d,...rest);
   box.call(this,'quan21-south-room-backing',side*(inner+innerW/2)-this.origin[0],y,z-.35,innerW,h,d-.70,...rest);return;
  }
  if(k==='v17-quan-gateway')return;
  return box.call(this,k,x,y,z,w,h,d,...rest);
 };
 b.n17Lattice=function(x,y,z,w,h,r){const p=this.world([x,y,z]);if(p[2]>sourceD/2&&Math.abs(p[0])-w/2<7.5)return;return lattice.call(this,x,y,z,w,h,r);};
 b.n17Roof=function(x,y,z,w,d,h,r){if(!(Math.abs(x)<.001&&Math.abs(y-5)<.001&&Math.abs(z-(sourceD/2-2.8))<.001&&Math.abs(w-7.6)<.001))return roof.call(this,x,y,z,w,d,h,r);
  const mesh=this.mesh;this.mesh=function(k,g,...args){if(k==='v17-hip-gable'){g=this.geo('quan21-south-roof-up',()=>{const out=new Y.Geo.Geometry();for(let i=0;i<g.v.length;i+=24){let tri=[0,8,16].map(j=>g.v.slice(i+j,i+j+8));const a=tri[0],bb=tri[1],cc=tri[2],ny=(bb[2]-a[2])*(cc[0]-a[0])-(bb[0]-a[0])*(cc[2]-a[2]);if(ny<0){tri=[tri[0],tri[2],tri[1]];for(const v of tri){v[3]*=-1;v[4]*=-1;v[5]*=-1;}}for(const v of tri)out.vertex(v.slice(0,3),v.slice(3,6),v.slice(6,8));}return out;});}if(k==='v17-gable-panel'||k==='v17-eave-fascia')args[7]=38;return mesh.call(this,'quan21-south-central-'+k,g,...args);};
  try{return roof.call(this,x,5.35,z,16.2,7.6,2.7,r);}finally{this.mesh=mesh;}
 };
 b.sign=function(text,x,y,z,...args){if(text==='全斋'&&z>0){entry(this,z);return;}return sign.call(this,text,x,y,z,...args);};
 b.e.add=function(k,g,m,...args){if(k==='v30-plane'&&args[2]===b.signs.get('quan21-south-bicmr'))gate=[m[12],0,m[14]];return emit.call(this,k,g,m,...args);};
 let result;try{result=previous(b,f,add);}finally{b.sign=sign;b.e.add=emit;b.n17Box=box;b.n17Lattice=lattice;b.n17Roof=roof;Y.ArchitectureAdapter.render=adapter;}
 if(gate){const [sx,sy,sz]=result.scale;gate=[gate[0]-.235*sz*Math.sin(result.frame.r),0,gate[2]-.235*sz*Math.cos(result.frame.r)];const prior=b.id;b.id=f.properties.pickId;try{b.local(gate[0],0,gate[2],result.frame.r,()=>{for(let i=0;i<3;i++){const depth=1.6-i*.45,h=.12+i*.14;b.n17Box('quan21-south-step-'+i,0,h*sy/2,(depth/2-.10)*sz,4*sx,h*sy,depth*sz,'#aaa99d',10,.6);}});}finally{b.id=prior;}result={...result,southEntry:gate,southNormal:[Math.sin(result.frame.r),0,Math.cos(result.frame.r)],southEntryEvidence:'Meipian named east-to-west open-door photograph; no unconfirmed door leaves'};}
 const apron=approach(result,Y.CAMPUS?.features.find(q=>q.properties.id==='way/33278333'));
 if(apron){const g=new Y.Geo.Geometry(),p=apron.outline.map((q,i)=>[q[0],i<2?apron.stepY:apron.roadY,q[1]]);g.quad(p[0],p[3],p[2],p[1]);for(let i=0;i<4;i++){const a=p[i],q=p[(i+1)%4];g.quad([a[0],.04,a[2]],a,q,[q[0],.04,q[2]]);}add('quan21-south-stone-approach',g,'#bcbeb1',7,f.properties.pickId);}
 return result;
};
Y.Quan21SouthDetails={id:ID,entry,approach,clearWidth:2.7,scope:'south three-bay facade and its central roof; fitted dimensions, unchanged other roofs and north passage'};
})(YY);
