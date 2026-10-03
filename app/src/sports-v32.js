/* Court subdivisions stay within the mapped compound; dimensions are display fits. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo;
const layouts={
 'way/880624094':{type:'basketball',cols:8,rows:1},
 'way/226703020':{type:'basketball',cols:4,rows:1},
 'way/226702940':{type:'tennis',cols:5,rows:1},
 'way/531129100':{type:'volleyball',cols:4,rows:2},
 'way/880624092':{type:'tennis',cols:2,rows:1},
 'way/880624093':{type:'football',cols:1,rows:3}
};

// Fit smooth lane geometry inside the mapped parcel, not its irregular service apron.
function runningTrack(b,f){
 const fr=Y.ArchitectureAdapter.frame(f.geometry),long=Math.max(fr.w,fr.d),short=Math.min(fr.w,fr.d),rot=fr.r+(fr.w>fr.d?Math.PI/2:0);
 const radius=short*.41,straight=Math.max(0,long*.48-radius);
 const capsule=(r,c)=>{const p=[];for(let i=0;i<=64;i++){const a=i*Math.PI/64;p.push([Math.cos(a)*r,c+Math.sin(a)*r]);}for(let i=0;i<=64;i++){const a=Math.PI+i*Math.PI/64;p.push([Math.cos(a)*r,-c+Math.sin(a)*r]);}p.push(p[0]);return p;};
 b.id=f.properties.pickId;b.local(fr.centre[0],0,fr.centre[1],rot,()=>{
  let scale=1;for(let n=0;n<30;n++){if(capsule(radius*scale,straight*scale).every(p=>{const q=b.world([p[0],0,p[1]]);return F.inside([q[0],q[2]],f.geometry);}))break;scale*=.985;}
  const outer=radius*scale,c=straight*scale,lane=Math.min(1.22,outer*.028),inner=outer-8*lane;
  const ring=capsule(inner,c),surface=F.surface({type:'Polygon',coordinates:[ring]},.18);
  b.mesh('track40-infield',surface,0,0,0,1,1,1,'#88a58a',7);
  const lines=new G.Geometry();for(let i=0;i<=8;i++)for(const v of G.ribbon(capsule(inner+i*lane,c),.10,.235,false).v)lines.v.push(v);
  // Short finish stripe stays inside the straight running lanes.
  for(const v of G.ribbon([[inner,c*.55],[outer,c*.55]],.12,.237,false).v)lines.v.push(v);
  b.mesh('track40-lanes',lines,0,0,0,1,1,1,'#ece9d9',10);
 });return true;
}
// Pick50: 2026-03-27/28 official photographs establish black fine mesh, a
// flat white headband and a centre strap. Existing five court/post positions
// stay fitted; .045 mesh, .003 twine, .055 band and .12 sag are photo-scale
// fits, not surveyed/competition-certified dimensions. Shared across five nets.
function tennisNet177(b,w){
 const half=(w+1)/2,bottom=.247,top=x=>1.12+.12*(x/half)**2;
 const make=(key,fn)=>b.geo(key+'-'+w.toFixed(4),fn);
 const wire=(g,a,c,width,depth)=>{const dy=c[1]-a[1],dx=c[0]-a[0],len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,raw=G.box().v;for(let j=0;j<raw.length;j+=8){const x=raw[j]*width,y=raw[j+1]*len,z=raw[j+2]*depth,nx=raw[j+3],ny=raw[j+4];g.v.push((a[0]+c[0])/2+x*uy+y*ux,(a[1]+c[1])/2-x*ux+y*uy,z,nx*uy+ny*ux,-nx*ux+ny*uy,raw[j+5],raw[j+6],raw[j+7]);}};
 const grid=make('tennis50-net177-grid',()=>{const g=new G.Geometry(),n=Math.ceil(2*half/.045);for(let j=0;j<=n;j++){const x=-half+2*half*j/n;wire(g,[x,bottom],[x,top(x)-.024],.003,.003);}for(let y=bottom;y<1.24-.0275;y+=.045){const min=1.12-.0275;if(y<=min)wire(g,[-half,y],[half,y],.003,.003);else{const x=half*Math.sqrt((y-min)/.12);if(half-x>.001){wire(g,[-half,y],[-x,y],.003,.003);wire(g,[x,y],[half,y],.003,.003);}}}return g;});
 const band=make('tennis50-net177-band',()=>{const g=new G.Geometry(),N=48;for(let j=0;j<N;j++){const a=-half+2*half*j/N,c=-half+2*half*(j+1)/N,ya=top(a),yc=top(c),h=.0275,z=.008;
  const A=[a,ya-h,-z],B=[c,yc-h,-z],C=[c,yc+h,-z],D=[a,ya+h,-z],E=[a,ya-h,z],F=[c,yc-h,z],H=[a,ya+h,z],I=[c,yc+h,z];
  g.quad(A,D,C,B);g.quad(E,F,I,H);g.quad(D,H,I,C);g.quad(A,B,F,E);if(!j)g.quad(A,E,H,D);if(j===N-1)g.quad(B,C,I,F);
 }return g;});
 const strap=make('tennis50-net177-strap',()=>{const g=new G.Geometry();
  // Two fabric faces straddle the net and headband, joined over its crown.
  for(const z of[-.011,.011]){const raw=G.box().v;for(let j=0;j<raw.length;j+=8)g.v.push(raw[j]*.045,.6875+raw[j+1]*.921, z+raw[j+2]*.006,...raw.slice(j+3,j+8));}
  const raw=G.box().v;for(let j=0;j<raw.length;j+=8)g.v.push(raw[j]*.045,1.148+raw[j+1]*.006,raw[j+2]*.028,...raw.slice(j+3,j+8));return g;});
 // Posts sit outside the red court on scene-v29's green sport surface y=.20.
 // Keep old top1.26/section/XZ; embed feet .002 instead of old bottom .24.
 for(const s of[-1,1])b.box(s*half,(1.26+.198)/2,0,.08,1.26-.198,.08,'#6b8177',29);
 b.mesh('tennis50-net177-grid',grid,0,0,0,1,1,1,'#343c37',29);
 b.mesh('tennis50-net177-band',band,0,0,0,1,1,1,'#e2e0d2',22);
 b.mesh('tennis50-net177-strap',strap,0,0,0,1,1,1,'#e2e0d2',22);
}

function render(b,f){if(Y.Refinements41?.sport(b,f))return true;if(f.properties.id==='way/783033430')return runningTrack(b,f);const cfg=layouts[f.properties.id];if(!cfg)return false;const fr=Y.ArchitectureAdapter.frame(f.geometry),cw=(fr.w-2)/cfg.cols,cd=(fr.d-2)/cfg.rows,id=f.properties.pickId;
 b.id=id;b.local(fr.centre[0],0,fr.centre[1],fr.r,()=>{
 for(let row=0;row<cfg.rows;row++)for(let col=0;col<cfg.cols;col++){
  const x=(col-(cfg.cols-1)/2)*cw,z=(row-(cfg.rows-1)/2)*cd;
  b.local(x,0,z,0,()=>{
   const basketball=cfg.type==='basketball',volley=cfg.type==='volleyball',tennis=cfg.type==='tennis';
   const w=Math.min(cw-2,basketball?15:volley?9:tennis?10.97:34),d=Math.min(cd-3,basketball?28:volley?18:tennis?23.77:20);
   // Pick50 official hard-court photos show fine matte grain, not paving joints.
   b.box(0,.215,0,w,.024,d,basketball?'#bc8b78':volley?'#c69b87':tennis?'#a88473':'#799b75',f.properties.id==='way/226702940'?21:7);
   const lineGeometry=new G.Geometry();const line=points=>{for(const v of G.ribbon(points,.095,.245,false).v)lineGeometry.v.push(v);};
   const circle=(cx,cz,r,a0=0,a1=Math.PI*2)=>line(Array.from({length:41},(_,i)=>[cx+Math.cos(a0+(a1-a0)*i/40)*r,cz+Math.sin(a0+(a1-a0)*i/40)*r]));
   line([[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2],[-w/2,-d/2]]);if(f.properties.id!=='way/226702940')line(cfg.type==='football'?[[0,-d/2],[0,d/2]]:[[-w/2,0],[w/2,0]]);
   // Court 50 uses tennis markings: the net is not a painted mid-court line.
   // ITF centre marks extend 0.10 m inward from each baseline inner edge, 0.05 m wide.
   if(f.properties.id==='way/226702940')for(const side of[-1,1]){
    // Retain the existing ribbon corners: interpolate its actual inner edge.
    const offset=side<0?0:96,a=lineGeometry.v.slice(offset,offset+3),c=lineGeometry.v.slice(offset+8,offset+11);
    const edge=x=>a[2]+(c[2]-a[2])*(x-a[0])/(c[0]-a[0]);
    const left=[-.025,.245,edge(-.025)],right=[.025,.245,edge(.025)];
    const corners=[left,right,[.025,.245,right[2]-side*.10],[-.025,.245,left[2]-side*.10]];
    if(side<0)corners.reverse();lineGeometry.quad(...corners,[0,1,0]);
   }
   if(basketball){circle(0,0,1.8);for(const s of[-1,1]){const end=s*d/2,free=end-s*5.8;line([[-2.45,end],[-2.45,free],[2.45,free],[2.45,end]]);circle(0,free,1.8);const arc=[];for(let j=0;j<=32;j++){const a=j/32*Math.PI;arc.push([Math.cos(a)*6.2,end-s*(1.6+Math.sin(a)*6.2)]);}line(arc);b.box(0,1.45,end-s*.15,.17,2.9,.17,'#587e73',29);b.beam([0,2.8,end-s*.15],[0,3.2,end-s*1.3],.065,'#779289',29);b.box(0,3.47,end-s*1.3,1.8,1.05,.07,'#d9e0d5',29);const hoop=[];for(let j=0;j<=16;j++)hoop.push([Math.cos(j*Math.PI/8)*.23,3.05,end-s*1.7+Math.sin(j*Math.PI/8)*.23]);for(let j=1;j<hoop.length;j++)b.beam(hoop[j-1],hoop[j],.025,'#be785a',29);}}
   else if(volley||tennis){if(volley)for(const s of[-1,1])line([[-w/2,s*3],[w/2,s*3]]);else{for(const s of[-1,1]){line([[-4.115,s*6.4],[4.115,s*6.4]]);line([[s*4.115,-d/2],[s*4.115,d/2]]);}line([[0,-6.4],[0,6.4]]);}if(f.properties.id==='way/226702940'){tennisNet177(b,w);}else{const h=volley?2.43:1.02,nw=w+1;// Pick198 posts stand outside the red court on the green y=.20 surface.
   // Extend only their feet 4cm plus 2mm embed; preserve top, net and layout.
   for(const s of[-1,1]){if(id===198)b.box(s*nw/2,(h+.24+.198)/2,0,.08,h+.24-.198,.08,'#6b8177',29);else b.box(s*nw/2,h/2+.24,0,.08,h,.08,'#6b8177',29);}for(let y=volley?h-.9:.2;y<=h+.01;y+=.18)b.beam([-nw/2,y+.24,0],[nw/2,y+.24,0],.013,'#69776e',29);for(let q=-nw/2;q<=nw/2;q+=.35)b.beam([q,volley?h-.66:.44,0],[q,h+.24,0],.009,'#728078',29);b.beam([-nw/2,h+.24,0],[nw/2,h+.24,0],.035,'#e2e0d2',29);}}
   else{circle(0,0,2.2);for(const s of[-1,1]){const end=s*w/2;line([[end,-5],[end-s*5,-5],[end-s*5,5],[end,5]]);for(const zz of[-1.5,1.5])b.beam([end,.25,zz],[end,2.15,zz],.045,'#e2e2d5',29);b.beam([end,2.15,-1.5],[end,2.15,1.5],.045,'#e2e2d5',29);}}
   b.mesh('court32-lines-'+id,lineGeometry,0,0,0,1,1,1,'#f0eedb',10);
  });
 }
 });return true;
}
Y.Sports32={render,layouts};
})(YY);
