/* Heritage models use independently anchored metre coordinates, never V28 campus x/z. */
(function(Y){'use strict';const P=Y.Builder.prototype,G=Y.Geo,M=Y.M;
P.singleHuabiao31=function(p){
 // Keep the complete original carving, but draw exactly one pillar at its mapped point.
 const local=this.local,origin=[...this.origin],rotation=this.rotation;let ordinal=0;
 this.local=function(x,y,z,r,fn){if(x===0&&y===0&&Math.abs(z)===18){if(ordinal++===0)return local.call(this,0,0,0,r,fn);return;}return local.call(this,x,y,z,r,fn)};
 try{this.historicHuabiao({...p,detailModel:{...p.detailModel,shaftRadii:p.detailModel?.shaftRadii||[.46,.52]}})}finally{this.local=local;this.origin=origin;this.rotation=rotation}
};
P.weimingStone31=function(){
 // Asymmetric upright natural rock, based on the archived ground photo; outline is approximate.
 const profile=[[-.73,0],[-.91,.6],[-.85,1.6],[-.42,2.45],[-.10,2.79],[.32,2.64],[.68,1.85],[.79,.55],[.96,.10]];
 const g=this.geo('heritage31-inscription-rock307',()=>{
  const a=new G.Geometry(),outline=[];for(let i=0;i<profile.length;i++)for(let j=0;j<7;j++){const t=j/7,ps=[-1,0,1,2].map(k=>profile[(i+k+profile.length)%profile.length]);outline.push([0,1].map(k=>.5*((2*ps[1][k])+(-ps[0][k]+ps[2][k])*t+(2*ps[0][k]-5*ps[1][k]+4*ps[2][k]-ps[3][k])*t*t+(-ps[0][k]+3*ps[1][k]-3*ps[2][k]+ps[3][k])*t*t*t)))}
  const rings=[[.84,.355],[1,.15],[.93,-.31],[.73,-.48]].map(([scale,depth],l)=>outline.map(([x,y],i)=>{const rough=(Math.sin(i*3.7+l*1.3)+Math.sin(i*1.31))* .014;const oldY=(y-1.35)*scale+1.35,foot=M.clamp((y-.12)/.33,0,1);return[x*scale+rough,-.07+(oldY+.07)*foot,depth+rough*.6]}));
  for(let i=0;i<outline.length;i++){const j=(i+1)%outline.length;a.tri([0,1.35,.36],rings[0][j],rings[0][i]);a.tri([0,1.35,-.48],rings[3][i],rings[3][j]);for(let k=0;k<3;k++)a.quad(rings[k][i],rings[k][j],rings[k+1][j],rings[k+1][i])}
  // Share area-weighted normals on the natural continuous stone surface. The
  // old per-triangle fan normals produced long radial lighting stripes.
  const sums=new Map(),key=p=>p.map(x=>x.toFixed(9)).join(',');
  for(let t=0;t<a.v.length;t+=24){const p=[0,8,16].map(k=>a.v.slice(t+k,t+k+3)),n=M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0]));for(const q of p){const k=key(q),v=sums.get(k)||[0,0,0];sums.set(k,M.add(v,n));}}
  for(let i=0;i<a.v.length;i+=8){const n=M.norm(sums.get(key(a.v.slice(i,i+3))));for(let j=0;j<3;j++)a.v[i+3+j]=n[j];a.v[i+6]=a.v[i];a.v[i+7]=a.v[i+1];}
  return a;});
 this.mesh('heritage31-inscription-rock307',g,0,-.04,0,1,1,1,'#74766b',22,.3);
 // A shallow, fitted patch of irregular paving, not a raised pedestal or a
 // reconstruction of the unphotographed shore. World top .055, buried bottom.
 const stones=[
  [[-1.10,-.69],[.96,-.72],[1.12,.57],[.38,.73],[-.62,.67],[-1.10,.20]],
  [[-1.48,-.70],[-1.12,-.68],[-1.12,.20],[-1.38,.48],[-1.61,.18]],
  [[-1.38,.51],[-1.09,.24],[-.64,.69],[-.76,1.14],[-1.49,1.04]],
  [[-.61,.70],[.37,.76],[.49,1.21],[-.72,1.13]],
  [[.40,.76],[1.13,.60],[1.53,.87],[1.34,1.24],[.52,1.21]],
  [[.99,-.73],[1.40,-.62],[1.59,.25],[1.15,.55]],
 ];
 stones.forEach((ring,i)=>{const key='heritage31-stone-paving307-'+i,slab=this.geo(key,()=>{
  const a=G.polygon(ring,-.045),bottom=-.14;
  for(let j=0;j<ring.length;j++){const q=ring[j],r=ring[(j+1)%ring.length];a.quad([q[0],bottom,q[1]],[r[0],bottom,r[1]],[r[0],-.045,r[1]],[q[0],-.045,q[1]]);}
  const low=G.polygon(ring,bottom);for(let j=0;j<low.v.length;j+=24)a.tri(low.v.slice(j,j+3),low.v.slice(j+16,j+19),low.v.slice(j+8,j+11));return a;
 });this.mesh(key,slab,0,0,0,1,1,1,['#9d9c8c','#9b9a88','#a6a392','#989989','#aaa796','#979889'][i],10);});
 // Lettering is a readable transcription, not a facsimile of the calligraphy.
 for(const [i,ch]of [...'未名湖'].entries()){
  const key='stone-red-'+ch;let uv=this.signs.get(key);
  if(!uv){const k=this.nSigns++,px=k%8*512,py=Math.floor(k/8)*128;this.ctx.clearRect(px,py,512,128);this.ctx.font='90px "Songti SC",serif';this.ctx.fillStyle='#a92725';this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.save();this.ctx.translate(px+256,py+64);this.ctx.scale(4,1);this.ctx.fillText(ch,0,0);this.ctx.restore();uv=[px/4096,1-(py+128)/4096,512/4096,128/4096];this.signs.set(key,uv)}
  this.mesh('plane',this.geo('plane',G.plane),.05,1.97-i*.58,.379,.42,.48,1,'#ffffff',8,.4,0,uv);
 }
};
P.snow31=function(){this.box(0,.16,0,3.8,.28,3.4,'#b7baae',10);this.box(0,.38,.3,2.5,.22,1.65,'#b8bcb1',10);this.box(0,.8,-.73,2.1,1.0,.24,'#d2d1c4',10);this.sign('埃德加·斯诺之墓',0,.87,-.59,1.86,.40,0,true)};
P.locationMarker31=function(){this.cyl(0,.10,0,.40,.12,'#ad815c',24,1,10);this.cyl(0,.22,0,.11,.30,'#6d7864',16,1,10)};
const rows=new Map(Y.HERITAGE31.map(a=>[a.id,a]));
function render(b,f){const a=rows.get(f.properties.id),old=[b.origin,b.rotation,b.id,b.anim];b.origin=[a.centre[0],(a.method==='lakeStoneFish'?.53:.10)+(a.supportOffset319||0),a.centre[1]];b.rotation=a.rotation;b.id=f.properties.pickId;b.anim=0;
 try{if(a.method==='lakeTempleGate')b[a.method](a.legacyModel,5.8,3.5);else b[a.method](a.legacyModel||{},a.size[0],a.size[1]);}finally{[b.origin,b.rotation,b.id,b.anim]=old}
}
Y.Heritage31={render};
})(YY);
