/* Gate points remain geographic anchors. Dimensions are photo estimates, not surveys. */
(function(Y){'use strict';
function pillar(b,x,h,w){
 b.box(x,.19,0,w+.30,.38,w+.30,'#c9cac0',10);
 b.box(x,h/2,0,w,h-.38,w,'#a8a99f',18);
 for(const s of[-1,1]){b.box(x+s*(w/2-.10),h*.49,w/2+.035,.14,h*.78,.12,'#c0c2b8',10);}
 b.box(x,h-.15,0,w+.26,.26,w+.26,'#c5c8be',10);
 b.box(x,h+.10,0,w+.46,.22,w+.46,'#d4d4c8',10);
 // Four-sided cap without the unrelated long tiled ridge used on buildings.
 b.mesh('gate40-cap',b.geo('gate40-cap',()=>{
  const g=new Y.Geo.Geometry(),levels=[[0,.50],[.12,.46],[.30,.33],[.57,.23],[.82,.18],[1,.17]];
  for(let j=1;j<levels.length;j++){const[y0,a]=levels[j-1],[y1,c]=levels[j];for(let k=0;k<4;k++){const ring=r=>[[-r,-r],[r,-r],[r,r],[-r,r]],p=ring(a),q=ring(c),n=(k+1)%4;g.quad([p[k][0],y0,p[k][1]],[q[k][0],y1,q[k][1]],[q[n][0],y1,q[n][1]],[p[n][0],y0,p[n][1]]);}}
  return g;
 }),x,h+.20,0,w+.74,.65,w+.74,'#d0d1c6',10);
 b.cyl(x,h+.82,0,.16,.20,'#cecec1',12,1,10);
 b.sphere(x,h+1.04,0,.19,.25,.19,'#d4d4ca',10,0,true);
}
function rail(b,a,c,y=1.4){
 for(let x=a;x<=c;x+=.29)b.box(x,y/2+.15,0,.045,y,.045,'#384b45',29);
 for(const h of[.30,y])b.box((a+c)/2,h,0,c-a,.065,.06,'#384b45',29);
}
// A shared leaf preserves full ironwork geometry across all four hinged leaves.
function ironLeaf(b){return b.geo('east-iron-leaf',()=>{
 const g=new Y.Geo.Geometry(),M=Y.M;
 const q=new Y.Builder({add(key,mesh,m){
  const axes=[0,4,8].map(k=>m[k]*m[k]+m[k+1]*m[k+1]+m[k+2]*m[k+2]);
  for(let i=0;i<mesh.v.length;i+=8){const v=mesh.v,n=v.slice(i+3,i+6),normal=[0,1,2].map(k=>m[k]*n[0]/axes[0]+m[k+4]*n[1]/axes[1]+m[k+8]*n[2]/axes[2]);
   g.vertex(M.apply(m,[v[i],v[i+1],v[i+2],1]).slice(0,3),M.norm(normal),v.slice(i+6,i+8));
  }
 }}),w=1.43,color='#34443e',top=x=>3.70+.65*Math.sin(x/2.95*Math.PI);
 for(const x of[0,w])q.box(x,(.18+top(x))/2,0,.075,top(x)-.18,.10,color,29);
 for(const y of[.22,.52,.77,2.28,2.53])q.box(w/2,y,0,w,.055,.085,color,29);
 for(let i=1;i<10;i++){const x=w*i/10;q.box(x,(.24+top(x))/2,0,.027,top(x)-.24,.035,color,29);}
 for(let i=0;i<24;i++){const a=w*i/24,c=w*(i+1)/24;q.beam([a,top(a),0],[c,top(c),0],.036,color,29);}
 // Paired curling iron straps, left open rather than filled black panels.
 for(const cy of[.645,2.405])for(let j=0;j<5;j++)for(const side of[-1,1]){
  const cx=.145+j*.285,pts=[];
  for(let k=0;k<=20;k++){const a=-Math.PI*.65+k/20*Math.PI*1.7,r=.115-k/20*.055;pts.push([cx+side*r*Math.cos(a),cy+r*Math.sin(a),.012]);}
  for(let k=1;k<pts.length;k++)q.beam(pts[k-1],pts[k],.012,color,29);
 }
 for(const z of[-.075,.075]){q.beam([w-.11,1.05,z],[w-.11,1.39,z],.019,color,29);for(const y of[1.05,1.39])q.beam([w-.11,y,0],[w-.11,y,z],.014,color,29);}
 return g;
});}
function pedestrianLeaves(b,a,c){
 const g=ironLeaf(b),angle=.34*Math.PI;
 for(const [x,r]of[[a,angle],[c,Math.PI-angle]]){
  b.mesh('east-iron-leaf',g,x,0,0,1,1,1,'#34443e',29,0,r);
  for(const y of[.45,1.85,3.25]){b.cyl(x,y,0,.065,.22,'#384b45',16,1,29);b.box(x,y+.11,-.065,.15,.11,.17,'#384b45',29);}
 }
}
function retractableBarrier(b,a,c){
 const n=6,step=(c-a)/n,color='#394b45';
 for(const z of[-.17,.17]){
  for(let i=0;i<n;i++){const x=a+i*step;for(const reverse of[false,true])b.beam([x,reverse?1.18:.32,z],[x+step,reverse?.32:1.18,z],.022,color,29);}
  for(let i=0;i<=n;i++){const x=a+i*step;b.box(x,.76,z,.035,1.17,.045,color,29);b.sphere(x,.75,z,.045,.045,.035,'#a9b3ac',29,0,true);}
 }
 for(const x of[a,c]){b.box(x,.81,0,.22,1.38,.48,color,29);b.box(x,1.53,0,.28,.08,.54,'#65766e',29);for(const z of[-.21,.21])b.sphere(x,.15,z,.11,.11,.045,'#293832',29,0,true);}
}
function east(b){
 for(const s of[-1,1]){
  pillar(b,s*6.4,6.1,1.8);pillar(b,s*11.1,4.75,1.45);pillar(b,s*18.1,4.75,1.45);
  b.box(s*14.6,1.88,0,5.6,3.75,.72,'#a7aaa0',18);
  b.box(s*14.6,3.85,0,5.85,.17,.87,'#c7c9bf',10);
  b.box(s*14.6,2.18,.385,2.8,1.4,.09,'#d0d1c8',10);
  // Curved openwork pedestrian arch, independent of the central vehicle passage.
  for(let j=0;j<20;j++){
   const x0=7.4+j*2.95/20,x1=7.4+(j+1)*2.95/20;
   const h=x=>4.08+.72*Math.sin((x-7.4)/2.95*Math.PI);
   b.beam([s*x0,h(x0),0],[s*x1,h(x1),0],.08,'#34443e',29);
   b.beam([s*x0,h(x0)-.22,0],[s*x1,h(x1)-.22,0],.045,'#34443e',29);
  }
  // Small open rings fill the arch band seen in the 2025 frontal photo.
  for(let j=0;j<8;j++){const cx=7.56+j*2.60/7,cy=4.08+.72*Math.sin((cx-7.4)/2.95*Math.PI)-.11;
   for(let k=0;k<16;k++){const a=k*Math.PI/8,c=(k+1)*Math.PI/8;b.beam([s*(cx+.115*Math.cos(a)),cy+.115*Math.sin(a),0],[s*(cx+.115*Math.cos(c)),cy+.115*Math.sin(c),0],.018,'#34443e',29);}
  }
  pedestrianLeaves(b,Math.min(s*7.4,s*10.35),Math.max(s*7.4,s*10.35));
  b.eastGateLion(s*12.1,2);
 }
 // Individual vertical characters follow the photo's tall plaque.
 b.box(6.4,3.32,.94,.83,3.9,.08,'#deded3',10);
 for(const[i,ch]of [...'北京大学'].entries())b.lettering(ch,6.4,4.5-i*.76,1.0,.58,.58,0,'#33362f');
 // Partially retracted display state; do not imply current access restrictions.
 retractableBarrier(b,-5.4,-3.2);retractableBarrier(b,3.2,5.4);
 for(let x=-5;x<=5;x+=2.5)b.sphere(x,.31,2.5,.26,.28,.26,'#c4c6b9',10,0,true);
}

function south(b){
 const stone='#bcc0b8',trim='#c9cdc3',joint='#8a958b',metal='#778783';
 for(const x of[-7,-4,4,7]){
  b.box(x,3.3,0,1.05,6.6,1.28,stone,10);b.box(x,.16,0,1.3,.32,1.55,'#a6afa5',10);
  for(const y of[1.55,3.12,4.70])b.box(x,y,.649,1.04,.015,.018,joint,10);
  // Dark recessed grille with substantial vertical fins beneath the flat canopy.
  b.box(x,6.42,.63,1.14,.46,.10,'#46534c',29);
  for(let i=-3;i<=3;i++)b.box(x+i*.145,6.42,.724,.070,.45,.11,metal,29);
  b.box(x,6.13,.68,1.21,.08,.16,trim,10);
 }
 b.box(0,6.99,0,17.2,.66,2.65,stone,10);
 for(const y of[6.63,7.35])b.box(0,y,0,17.42,.095,2.79,trim,10);
 // Flat stone fascia joints and recessed underside light housings visible in 2017.
 for(let x=-7.8;x<=7.8;x+=1.3)b.box(x,6.99,1.332,.017,.60,.018,joint,10);
 for(const x of[-6,-2,2,6]){
  b.box(x,6.642,.66,.66,.035,.40,'#4d5750',29);
  b.box(x,6.619,.66,.49,.012,.25,'#cbd0c2',10);
 }
 b.box(0,5.88,.15,7.15,1.06,.65,'#28332e',10);
 b.lettering('北京大学',0,5.90,.492,5.8,.73,0,'#c0a764');
 for(const side of[-1,1]){
  // The photographed inner wing has a window beside the outer relief panel.
  b.box(side*11.3,1.61,0,7.6,3.22,1.05,stone,10);
  b.box(side*11.3,3.31,0,7.9,.18,2.1,trim,10);
  for(const y of[.35,2.78])b.box(side*8.70,y,.59,2.03,.13,.16,trim,10);
  for(const x of[7.68,9.72])b.box(side*x,1.56,.59,.13,2.55,.16,trim,10);
  b.box(side*8.70,1.57,.555,1.91,2.30,.05,'#354a46',28);
  for(const y of[.93,1.67,2.65])b.box(side*8.70,y,.625,1.91,.055,.055,metal,29);
  b.box(side*8.70,1.57,.625,.05,2.30,.055,metal,29);
  b.box(side*12.48,1.63,.57,4.30,2.18,.12,'#d1d6c9',10);
  for(const y of[.49,2.77])b.box(side*12.48,y,.665,4.46,.10,.13,trim,10);
  for(const x of[10.20,14.76])b.box(side*x,1.63,.665,.10,2.37,.13,trim,10);
 }
 // Historical right-hand pedestrian leaf: rectilinear silver bars and open square motif.
 // The left leaf is obscured in this reference and is not invented by mirroring.
 b.local(6.43,0,-.10,Math.PI*.68,()=>{
  const w=1.76,h=2.53;
  for(const x of[0,w])b.box(x,h/2+.12,0,.055,h,.075,metal,29);
  for(const y of[.13,1.0,1.34,2.65])b.box(w/2,y,0,w,.050,.07,metal,29);
  for(let i=1;i<=7;i++){const x=w*i/8;b.box(x,1.38,0,.026,2.46,.035,metal,29);}
  for(const [cx,cy,ww,hh]of[[.88,1.18,.40,.65],[.66,1.18,.23,.37],[1.10,1.18,.23,.37]]){
   for(const x of[cx-ww/2,cx+ww/2])b.box(x,cy,.028,.026,hh,.035,metal,29);
   for(const y of[cy-hh/2,cy+hh/2])b.box(cx,y,.028,ww,.026,.035,metal,29);
  }
  b.beam([w-.12,1.07,.07],[w-.12,1.38,.07],.016,metal,29);
 });
 for(const y of[.35,1.35,2.35])b.cyl(6.43,y,-.10,.048,.18,metal,16,1,29);
 for(const x of[-3.25,3.25]){b.box(x,.75,.9,.25,1.5,.32,'#c0c7c0',29);b.box(x,1.08,.98,.13,.17,.10,'#283f38',29);}
}

function southeastGroup(b){
 const w=5.8,d=5.2,base=2.95,rise=.83;
 const g=b.geo('southeast33-blue-canopy',()=>{const a=new Y.Geo.Geometry();for(let j=0;j<36;j++){const x=-w/2+j*w/36,xx=-w/2+(j+1)*w/36,h=q=>base+rise*Math.sqrt(Math.max(0,1-(q/(w/2))**2));a.quad([x,h(x),-d/2],[x,h(x),d/2],[xx,h(xx),d/2],[xx,h(xx),-d/2]);a.quad([xx,h(xx),-d/2],[xx,h(xx),d/2],[x,h(x),d/2],[x,h(x),-d/2]);}return a;});
 b.mesh('southeast33-blue-canopy',g,0,0,0,1,1,1,'#458e9c',28);
 for(const side of[-1,1])for(const z of[-d/2,0,d/2])b.box(side*w/2,base/2,z,.13,base,.13,'#a3b4af',29);
 for(const z of[-d/2,0,d/2])for(let j=0;j<24;j++){const x=-w/2+j*w/24,xx=-w/2+(j+1)*w/24,h=q=>base+rise*Math.sqrt(Math.max(0,1-(q/(w/2))**2));b.beam([x,h(x)+.015,z],[xx,h(xx)+.015,z],.045,'#c1ccc5',29);}
 for(const side of[-1,1])b.box(side*w/2,base-.08,0,.13,.18,d,'#a3b4af',29);
 for(const x of[-1.92,-.64,.64,1.92]){b.box(x,.53,.30,.21,1.06,1.10,'#a7b7b1',29);b.box(x,1.12,.60,.18,.22,.14,'#233c37',29);}
 for(const x of[-1.28,0,1.28])for(const side of[-1,1])b.box(x+side*.31,.66,.30,.50,.65,.035,'#bdd7d0',28);
 for(const side of[-1,1])b.local(side*3.45,0,0,Math.PI/2,()=>rail(b,-2.6,2.6,1.2));
}
function southeast(b){
 // North and south groups: three clear lanes between four reader cabinets each.
 for(const x of[-8.2,8.2])b.local(x,0,0,0,()=>southeastGroup(b));
}
function qiuUnverified(b,p){
 // The mapped opening is retained without invented masonry gateposts.
 for(const side of[-1,1])b.box(side*4.2,1.05,0,.10,2.1,.10,'#71867c',29);
}
function provisional(b,p){
 const width=p.tags.motor_vehicle==='no'?4.6:p.id==='node/380722026'?13:8;
 for(const s of[-1,1]){b.box(s*(width/2+.35),1.15,0,.7,2.3,.7,'#adb1a6',18);b.box(s*(width/2+.35),2.36,0,.85,.16,.85,'#c7cbbf',10);rail(b,s<0?-width/2-3:-(-width/2-.8),s<0?-width/2-.8:width/2+3);}
 if(p.tags.access==='no')rail(b,-width/2,width/2);else{rail(b,-width/2,-width/2+1.1);rail(b,width/2-1.1,width/2);}
}
function render(b,f){const p=f.properties;if(p.id==='node/1422005424')return {profile:'existing-west-gate-building'};
 const q=f.geometry.coordinates,r=p.id==='node/380722026'?0:p.id==='node/2485149510'?-Math.PI/2:Math.PI/2;
 const old=[b.origin,b.rotation,b.id,b.anim];b.origin=[q[0],.12,q[1]];b.rotation=r;b.id=p.pickId;b.anim=0;
 try{if(p.id==='node/2748949454')east(b);else if(p.id==='node/380722026')south(b);else if(p.id==='node/6018578781')southeast(b);else if(['node/380742837','node/10729924621'].includes(p.id))qiuUnverified(b,p);else provisional(b,p);}finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {profile:({'node/2748949454':'east-paired-quepillars-photo2025','node/380722026':'south-flat-canopy-photo2020','node/6018578781':'southeast-pedestrian-canopy-photo2023'})[p.id]||'entrance-layout-provisional'};
}
for(const f of Y.CAMPUS.features.filter(f=>f.properties.kind==='gate')){
 const p=f.properties;p.gate33=true;p.displayRadius=p.id==='node/2748949454'?39:p.id==='node/380722026'?33:18;
 p.rotation=p.id==='node/380722026'?0:p.id==='node/2485149510'?-Math.PI/2:Math.PI/2;
 if(p.id==='node/2748949454'){
 p.height=7.4;p.architecture={summary:'按 2025 年正面照片重建高低门柱、翼墙与拱形步行入口。'};
 p.scopeNote='平面沿用公开地图点位；门柱尺寸、跨度及背面细部为照片拟合，未实测。';
 p.references=[{title:'东门正面照片 · N509FZ · 2025 · CC BY-SA 4.0',url:'https://commons.wikimedia.org/wiki/File:East_gate_of_Peking_University_(20250605110404).jpg'},...(p.references||[])];
 }else if(p.id==='node/380722026'){p.height=7.6;p.architecture={summary:'按 2020 年正面照片重建四柱平顶门、中央匾额和低翼墙。'};p.scopeNote='点位沿用公开地图；跨度、高度和门后设施为照片拟合，临时迎新布置未计入。';p.references=[{title:'南门正面 · 新京报 · 2020-09-01',url:'https://m.bjnews.com.cn/detail/159892572315716.html'}];}else if(p.id==='node/6018578781'){p.height=3.8;p.displayRadius=23;p.architecture={summary:'南北两组蓝色弧形雨棚，每组设三条闸机通道。'};p.scopeNote='南北通道有校方文字记录；每组三条通道按使用者现场反馈，间距和尺寸为拟合。照片仅覆盖单组。';p.references=[{title:'东南门步行入口 · 新京报图 / 半岛都市报转载 · 2023-12-23',url:'https://www.sohu.com/a/746480932_355158'}];}else if(p.id!=='node/1422005424'){p.height=2.5;p.scopeNote='入口点位来自公开地图；外形仍待清晰实拍核对。';if(['node/380742837','node/10729924621'].includes(p.id)){p.architecture={summary:'已撤下无依据的石墩和门扇；暂保留入口位置。'};p.scopeNote='未取得能对应此点位的清晰邱门实拍，当前仅表示开口，尚未完成外观复原。';}}
}
Y.Gates33={render};
})(YY);
