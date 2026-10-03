/* Shaoyuan 9: route-photo red/gray L facade and east lane entry; storeys and height remain fitted. */
(function(Y){'use strict';const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/240832239';
const O=[-410.792,337.078],R=Math.atan2(1.443,45.819),CO=Math.cos(R),SI=Math.sin(R),H={floor:3.1,body:18.6,total:18.9};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}


function render(b,f,add){const id=f.properties.pickId;b.id=id;const group=(key,fn)=>{const old=b.e.add;b.e.add=function(k,...v){return old.call(this,'034-'+key+'-'+k,...v);};try{fn();}finally{b.e.add=old;}};
add('034-L-flat-roof',F.surface(f.geometry,H.body),'#93998b',24,id);
const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;
for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),la=local(a),lc=local(c),east=(la[0]+lc[0])/2>45,south=(la[1]+lc[1])/2>14&&Math.abs(dx)>20,count=Math.max(1,Math.round(len/3.6)),stride=len/count;
b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('facade-'+i,()=>{const panel=(s,e,lo,hi,col)=>{if(e>s&&hi>lo)b.box((s+e)/2,(lo+hi)/2,-.045,e-s,hi-lo,.09,col,24);};
const facadeOpenings=[];for(let fl=0;fl<6;fl++){const base=fl*H.floor,col=fl<2?'#b9bcb5':'#975e51',holes=[];for(let k=0;k<count;k++){const x=(k+.5)*stride,w=Math.min(2.05,stride*.61);if(east&&fl===0&&x>len-6)continue;holes.push({s:x-w/2,e:x+w/2,lo:base+.8,hi:base+2.5});}if(east&&fl===0)holes.push({s:len-3.5,e:len-1.2,lo:0,hi:2.9,door:true});holes.sort((a,b)=>a.s-b.s);if(fl<2)facadeOpenings.push(...holes);let cursor=0;for(const h of holes){panel(cursor,h.s,base,base+H.floor,col);panel(h.s,h.e,base,h.lo,col);panel(h.s,h.e,h.hi,base+H.floor,col);const x=(h.s+h.e)/2,w=h.e-h.s;for(const xx of[h.s,h.e])b.box(xx,(h.lo+h.hi)/2,-.15,.065,h.hi-h.lo,.30,'#424a49',24);for(const yy of[h.lo,h.hi])b.box(x,Math.max(.03,yy),-.15,w,.06,.3,'#424a49',24);if(!h.door){b.box(x,(h.lo+h.hi)/2,-.34,w-.1,h.hi-h.lo-.1,.05,'#6f8990',5);b.box(x,(h.lo+h.hi)/2,-.29,.06,h.hi-h.lo,.07,'#d0d7d2',24);}cursor=h.e;}panel(cursor,len,base,base+H.floor,col);}
group('gray-joints',()=>{for(let y=.65;y<6.2;y+=.8){let spans=[[0,len]];for(const h of facadeOpenings.filter(h=>y+.013>h.lo&&y-.013<h.hi))spans=spans.flatMap(([s,e])=>[[s,Math.min(e,h.s)],[Math.max(s,h.e),e]]).filter(([s,e])=>e>s);for(const [s,e] of spans)b.box((s+e)/2,y,.009,e-s,.026,.025,'#989f98',24);}});b.box(len/2,6.2,.03,len,.13,.17,'#d6d7ca',24);b.box(len/2,18.72,.13,len,.28,.45,'#dedcc8',24);
if(south)for(let k=1;k<count;k++){const x=k*stride;b.box(x,11.8,.16,.07,13,.08,'#d6d9cd',24);for(let fl=2;fl<6;fl++){b.box(x,fl*3.1+.55,.27,.64,.43,.48,'#d1d7cb',24);b.box(x,fl*3.1+.55,.52,.44,.27,.02,'#85938a',24);}}
if(east)group('east-entry',()=>{const eb=(x,...v)=>b.box(len-x,...v);
// Route PDF pp.12–13: raised glass vestibule, narrow sidelight, pale pier,
// upper transoms and a framed glazed return. Dimensions remain photograph-fitted.
const sill=.60,head=3.12,transom=2.55,front=2.25;
eb(2.35,.30,1.35,2.9,.6,2.8,'#afb4aa',24);
eb(2.35,3.28,1.12,3.25,.28,2.7,'#454c49',24);
// Display-only recessed interior, bounded by the established wall opening.
// Its fitted depth prevents sky showing through; no room plan is asserted.
group('doorway-pocket',()=>{
 eb(2.35,1.75,-.83,2.30,2.30,.06,'#737b74',24);
 for(const x of[1.23,3.47])eb(x,1.75,-.40,.06,2.30,.80,'#b9bcb5',24);
 eb(2.35,2.87,-.40,2.30,.06,.80,'#b9bcb5',24);
 eb(2.35,.57,-.40,2.30,.06,.80,'#afb4aa',24);
});
group('vestibule-frame',()=>{
 for(const x of[.95,3.75])eb(x,(sill+head)/2,front,.10,head-sill,.12,'#424a49',24);
 // Solid pale pier separates the narrow fixed pane from the wider door bay.
 eb(1.99,(sill+head)/2,front,.30,head-sill,.18,'#b9bcb5',24);
 for(const [x,w] of[[1.43,.86],[2.92,1.56]]){
  for(const y of[sill,transom,head])eb(x,y,front,w,.075,.12,'#424a49',24);
  for(const [lo,hi] of[[sill+.04,transom-.04],[transom+.04,head-.04]])
   eb(x,(lo+hi)/2,front-.035,w-.06,hi-lo,.035,'#809594',5);
 }
 eb(2.92,(sill+transom)/2,front,.055,transom-sill,.10,'#424a49',24);
 for(const x of[2.84,3.00])eb(x,1.59,front+.09,.028,.55,.04,'#313d38',24);
 // Glazed outer return closes the formerly open side of the porch.
 for(const y of[sill,transom,head])eb(3.75,y,1.10,.10,.075,2.30,'#424a49',24);
 for(const z of[0,1.10])eb(3.75,(sill+head)/2,z,.10,head-sill,.075,'#424a49',24);
 for(const [lo,hi] of[[sill+.04,transom-.04],[transom+.04,head-.04]])
  for(const z of(lo>transom?[.55,1.65]:[.55]))eb(3.75,(lo+hi)/2,z,.035,hi-lo,1.025,'#809594',5);
 // The photographed side door is open inward, leaving the ramp arrival clear.
 group('open-side-door',()=>{
  for(const x of[3.75,2.70])eb(x,(sill+transom)/2,1.10,.06,transom-sill,.08,'#424a49',24);
  for(const y of[sill,transom])eb(3.225,y,1.10,1.05,.075,.08,'#424a49',24);
  eb(3.225,(sill+transom)/2,1.10,.97,transom-sill-.08,.035,'#809594',5);
  eb(2.80,1.59,1.17,.028,.55,.04,'#313d38',24);
 });
});
// Ramp runs from the south along the east lane to the door landing.
const g=new G.Geometry();g.quad(...[[3.8,.6,1.4],[9.8,0,1.4],[9.8,0,2.7],[3.8,.6,2.7]].map(p=>b.world([len-p[0],p[1],p[2]])));b.e.add('ramp-surface',g,Y.M.identity(),'#b4b8ad',[24,id,0,0]);for(let k=0;k<=6;k++){const x=3.8+k,y=.6-k*.1;for(const z of[1.4,2.7])eb(x,y+.52,z,.06,1.04,.06,'#303c36',24);}group('ramp-rail',()=>{for(const z of[1.4,2.7])for(const h of[1.05,.53])b.beam([len-3.8,.6+h,z],[len-9.8,h,z],.035,'#303c36',24);});group('short-stairs',()=>{
 // Three 0.20 m rises include the landing; only two exposed treads remain.
 // Exact adjoining intervals avoid coplanar overlap with the enlarged platform.
 for(const [start,end,height] of[[2.75,3.005,.40],[3.005,3.34,.20]])
  eb(2.9,height/2,(start+end)/2,1.5,height,end-start,'#aeb4aa',24);
});});
}));}
return{strategy:'building034-v46',visualRows:6,officialFloorCount:null,sourceOutline:true,eastEntrance:true,heightMeasured:false,upperSetbackVerified:false};}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};Y.Building034={id:ID,render,world,local,pieces,heights:H};
})(YY);
