/* Caizhai / Hong No.2: official ruzang.pku.edu.cn/images/hongerlouzuhe.jpg.
 * Map envelope + south gable/west two-storey loggia; dimensions, column spacing
 * and hidden north/east elevations are fitted, not surveyed. Replaces the old
 * paired-L squeezed into this single wing. Neighbour 110 is a separate object. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M;
const S={id:'way/240832220',pick:109,width:16.529136,depth:53.27,gallery:2.4,base:.72,floor:5.17,eave:10.13598,ridge:14.64,doorWidth:2.36,doorTop:3.7362663,transom:3.1262663,steps:3,fit:true};
const C={wall:'#dedcd0',stone:'#b1b2a6',red:'#963f31',wood:'#853d2d',glass:'#54665e',blue:'#376b78',green:'#477468',gold:'#c5b17b',roof:'#67726c',tile:'#90978a',dark:'#343c36'};
const SW=[-211.494,-206.946],SE=[-194.968,-207.268],NW=[-212.775,-260.198],NE=[-196.027,-260.531],K=[-212.647,-248.229],KT=(SW[1]-K[1])/(SW[1]-NW[1]);
const lerp=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function world(p){const t=-p[2]/S.depth,l=t<KT?lerp(SW,K,t/KT):lerp(K,NW,(t-KT)/(1-KT)),r=lerp(SE,NE,t),u=p[0]/S.width+.5;return[l[0]+(r[0]-l[0])*u,p[1],l[1]+(r[1]-l[1])*u];}
function render(b,f){const groups={};function group(n,c,mat){return groups[n]||(groups[n]={g:new G.Geometry(),c,mat});}
 function tri(n,c,mat,a,d,e){const ps=[a,d,e].map(world);if(Math.hypot(...M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0])))<1e-9)return;const normAbs=M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0])).map(Math.abs),axis=normAbs.indexOf(Math.max(...normAbs)),uv=ps.map(p=>axis===1?[p[0],p[2]]:axis===0?[p[2],p[1]]:[p[0],p[1]]);group(n,c,mat).g.tri(...ps,uv);}
 function quad(n,c,mat,a,d,e,h){tri(n,c,mat,a,d,e);tri(n,c,mat,a,e,h);}
 function box(n,c,mat,x,y,z,w,h,d){const q=G.box();for(let i=0;i<q.v.length;i+=24)tri(n,c,mat,...[0,8,16].map(j=>[x+q.v[i+j]*w,y+q.v[i+j+1]*h,z+q.v[i+j+2]*d]));}
 function beam(n,c,mat,a,d,r){const v=M.sub(d,a),up=Math.abs(v[1])<.9*Math.hypot(...v)?[0,1,0]:[1,0,0],u=M.norm(M.cross(v,up)),w=M.norm(M.cross(v,u));const pts=p=>[[-1,-1],[1,-1],[1,1],[-1,1]].map(s=>M.add(p,M.add(M.mul(u,s[0]*r/2),M.mul(w,s[1]*r/2))));const p=pts(a),q=pts(d);quad(n,c,mat,...p.slice().reverse());quad(n,c,mat,...q);for(let i=0;i<4;i++)quad(n,c,mat,p[i],q[i],q[(i+1)%4],p[(i+1)%4]);}
 function cyl(n,c,mat,x,y,z,r,h){const N=16;for(let i=0;i<N;i++){const a=i*2*Math.PI/N,d=(i+1)*2*Math.PI/N,p=[x+r*Math.cos(a),y,z+r*Math.sin(a)],q=[x+r*Math.cos(d),y,z+r*Math.sin(d)],u=[p[0],y+h,p[2]],v=[q[0],y+h,q[2]];quad(n,c,mat,p,u,v,q);tri(n,c,mat,[x,y,z],p,q);tri(n,c,mat,[x,y+h,z],v,u);}}
 const W=S.width,D=S.depth,B=S.base,F=S.floor,E=S.eave,L=-W/2+S.gallery,R=W/2-.30,Z=-S.gallery;
 for(const [a,d] of [[0,-D*KT],[-D*KT,-D]])box('base',C.stone,10,0,B/2,(a+d)/2,W,B,a-d);
 box('upper-floor',C.wall,24,0,F-.13,-D/2,W,.26,D);
 box('ceiling',C.wall,24,0,E-.12,-D/2,W,.24,D);
 // Each wall is a collection of finite solid piers/lintels. No backing box lies
 // behind glass or entrance panes. x runs along face; local +z faces outside.
 function face(name,a,d,holes){const len=Math.hypot(d[0]-a[0],d[1]-a[1]),u=[(d[0]-a[0])/len,(d[1]-a[1])/len],n=[-u[1],u[0]],at=(x,y,z)=>[a[0]+u[0]*x+n[0]*z,y,a[1]+u[1]*x+n[1]*z];
  function fb(nm,col,mat,x,y,z,w,h,dep){const q=G.box();for(let i=0;i<q.v.length;i+=24)tri(name+'-'+nm,col,mat,...[0,8,16].map(j=>at(x+q.v[i+j]*w,y+q.v[i+j+1]*h,z+q.v[i+j+2]*dep)));}
  const ys=[B,E,...holes.flatMap(q=>[q.lo,q.hi])].sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>1e-7);for(let i=1;i<ys.length;i++){const lo=ys[i-1],hi=ys[i],cuts=holes.filter(q=>q.lo<=lo&&q.hi>=hi).sort((a,b)=>a.x-b.x);let cur=0;const wall=(a,d)=>{if(d>a)fb('wall',C.wall,24,(a+d)/2,(lo+hi)/2,-.17,d-a,hi-lo,.34);};for(const q of cuts){wall(cur,q.x-q.w/2);cur=q.x+q.w/2;}wall(cur,len);}
  for(const q of holes){if(q.entry)continue;const y=(q.lo+q.hi)/2,h=q.hi-q.lo;fb('glass',C.glass,28,q.x,y,-.08,q.w,h,.05);for(const s of[-1,1])fb('frames',C.red,20,q.x+s*q.w/2,y,.015,.09,h+.1,.18);for(const yy of[q.lo,q.hi,q.hi-.48])fb('frames',C.red,20,q.x,yy,.015,q.w,.09,.18);fb('frames',C.red,20,q.x,y,.04,.075,h,.13);for(const yy of[q.lo+.55,q.hi-.85])fb('lattice',C.red,20,q.x,yy,.065,q.w,.045,.07);for(const s of[-1,1]){fb('lattice',C.red,20,q.x+s*q.w*.3,y,.065,.045,h*.65,.07);fb('lattice',C.red,20,q.x+s*q.w*.28,q.hi-.24,.065,.035,.38,.07);}fb('sill',C.stone,10,q.x,q.lo-.08,.035,q.w+.18,.13,.32);}
 }
 const windows=(len,count)=>[0,1].flatMap(l=>Array.from({length:count},(_,i)=>({x:(i+.5)*len/count,w:Math.min(2.05,len/count*.57),lo:1.55+l*4.16,hi:4.10+l*4.16})));
 face('west',[L,-D],[L,Z],windows(D-S.gallery,9));face('east-fit',[R,Z],[R,-D],windows(D-S.gallery,9));face('north-fit',[R,-D],[L,-D],windows(R-L,3));
 const doorX=0, south=windows(R-L,3).filter(q=>!(q.lo<2&&Math.abs(q.x-(R-L)/2)<.01));
 // Door follows the whole south-face axis; adjacent windows adjusted to avoid
 // falsely shifting it with the asymmetrical west gallery setback.
 const southHoles=south.filter(q=>q.lo>2||Math.abs(L+q.x)>2.9);southHoles.push({x:doorX-L,w:S.doorWidth,lo:B,hi:S.doorTop,entry:true});face('south',[L,Z],[R,Z],southHoles);
 function column(x,z){cyl('columns',C.red,20,x,B,z,.25,E-B);cyl('column-feet',C.stone,10,x,B-.12,z,.38,.24);}
 const WX=-W/2+.32,SZ=-.32;for(let i=0;i<=10;i++)column(WX,-.32-i*(D-.64)/10);
 // Five south openings are a spacing fit; the central bay remains clear.
 for(let i=1;i<=5;i++)column(-W/2+.32+i*(W-.64)/5,SZ);
 function galleryLine(a,d,count){const len=Math.hypot(d[0]-a[0],d[2]-a[2]);for(const y of[F-.28,E-.42]){beam('painted-beams',C.blue,20,[a[0],y,a[2]],[d[0],y,d[2]],.53);for(let i=0;i<count;i++){const p=lerp(a,d,(i+.5)/count);beam('painted-inset',C.green,20,[p[0]-(d[0]-a[0])/count*.30,y-.05,p[2]-(d[2]-a[2])/count*.30],[p[0]+(d[0]-a[0])/count*.30,y-.05,p[2]+(d[2]-a[2])/count*.30],.15);}}
 beam('rail-top',C.red,20,[a[0],F+1,a[2]],[d[0],F+1,d[2]],.13);beam('rail-low',C.red,20,[a[0],F+.27,a[2]],[d[0],F+.27,d[2]],.20);for(let i=0;i<=count*4;i++){const p=lerp(a,d,i/(count*4));box('rail-balusters',C.red,20,p[0],F+.62,p[2],.065,.68,.065);}}
 galleryLine([WX,0,-D+.32],[WX,0,SZ],10);galleryLine([WX,0,SZ],[W/2-.32,0,SZ],5);
 // Visible south/west beam faces and compact column-head supports follow
 // the official oblique view. v9Bracket/v9PaintedBeam construction principles
 // are retained, without importing their unsupported gold diamonds/multi-jump stack.
 function eaveDetails(a,d,bays){const dx=d[0]-a[0],dz=d[2]-a[2],len=Math.hypot(dx,dz),u=[dx/len,dz/len],n=[-u[1],u[0]],at=(x,y,o)=>[a[0]+u[0]*x+n[0]*o,y,a[2]+u[1]*x+n[1]*o];
  function localBox(name,col,x,y,o,w,h,dep){const g=G.box();for(let i=0;i<g.v.length;i+=24)tri('eaves-'+name,col,20,...[0,8,16].map(j=>at(x+g.v[i+j]*w,y+g.v[i+j+1]*h,o+g.v[i+j+2]*dep)));}
  function line(name,col,pts,y,o,t){for(let i=1;i<pts.length;i++)beam('eaves-'+name,col,20,at(pts[i-1][0],y+pts[i-1][1],o),at(pts[i][0],y+pts[i][1],o),t);}
  for(const y of[F-.28,E-.42]){
   for(const v of[-1,1])localBox('red-edging',C.red,len/2,y+v*.235,.280,len,.055,.027);
   localBox('deep-frame','#273e3e',len/2,y,.277,len,.40,.018);
   for(let i=0;i<bays;i++){const x=(i+.5)*len/bays,w=len/bays-.62,h=.32;
    localBox('blue-field','#315e7a',x,y,.292,w,h,.016);
    const cut=Math.min(.23,w*.14),frame=(width,height)=>[[-width/2+cut,-height/2],[width/2-cut,-height/2],[width/2,0],[width/2-cut,height/2],[-width/2+cut,height/2],[-width/2,0],[-width/2+cut,-height/2]].map(p=>[p[0]+x,p[1]]);
    line('green-outline','#577b65',frame(w-.10,h-.055),y,.307,.031);
    line('pale-outline','#b8c2a9',frame(w*.63,h*.64),y,.321,.019);
    line('paint-center','#557b70',frame(w*.34,h*.40),y,.331,.024);
   }
   for(let i=0;i<=bays;i++){const x=i*len/bays;
    localBox('support-lower','#493d30',x,y-.47,.02,.38,.38,.54);
    localBox('support-cap','#40574b',x,y-.26,.08,.85,.17,.67);
    localBox('support-front','#526e60',x,y-.33,.427,.29,.17,.033);
    for(const side of[-1,1])beam('eaves-short-brace','#493d30',20,at(x+side*.17,y-.77,.09),at(x+side*.65,y-.28,.09),.105);
   }
  }
  // Two dark purlin lines and exposed rafters touch the retained soffit underside.
  for(const o of[.34,.82])localBox('purlin','#443c30',len/2,E-.205,o,len,.13,.17);
  const count=Math.ceil(len/.35);for(let i=1;i<count;i++)localBox('rafters','#514634',i*len/count,E-.13,.47,.095,.14,1.35);
 }
 eaveDetails([WX,0,-D+.32],[WX,0,SZ],10);
 eaveDetails([WX,0,SZ],[W/2-.32,0,SZ],5);
 // Closed leaves have real glass, independent lower panels, shallow transom,
 // and nested rectangular red grille visible in the official close photograph.
 const DZ=Z+.015,hw=S.doorWidth/2,glassLo=B+.91,glassHi=S.transom-.12;
 function db(n,c,m,x,y,z,w,h,d){box('door-'+n,c,m,x,y,DZ+z,w,h,d);}
 function rect(n,x,y,w,h,z,t){for(const s of[-1,1]){db(n,C.red,20,x+s*w/2,y,z,t,h,.095);db(n,C.red,20,x,y+s*h/2,z,w,t,.095);}}
 for(const s of[-1,1]){const x=s*hw/2;db('glass',C.glass,28,x,(glassLo+glassHi)/2,-.075,hw-.17,glassHi-glassLo,.045);db('panel',C.red,20,x,(B+glassLo)/2,-.015,hw-.12,glassLo-B,.13);rect('leaf-frame',x,(B+S.transom)/2,hw-.045,S.transom-B,.025,.10);rect('panel-relief',x,B+.40,hw-.31,.55,.09,.045);rect('grille',x,(glassLo+glassHi)/2,(hw-.17)*.82,(glassHi-glassLo)*.81,.07,.036);rect('grille',x,(glassLo+glassHi)/2,(hw-.17)*.60,(glassHi-glassLo)*.97,.075,.032);for(const yy of[glassLo+.14,glassHi-.14])db('grille',C.red,20,x,yy,.08,hw-.08,.042,.07);
 db('transom-glass',C.glass,28,x,(S.transom+S.doorTop)/2,-.075,hw-.14,S.doorTop-S.transom-.10,.045);rect('transom-grille',x,(S.transom+S.doorTop)/2,hw*.75,(S.doorTop-S.transom)*.59,.07,.035);
 db('jamb',C.red,20,s*hw,(B+S.doorTop)/2,.015,.12,S.doorTop-B,.24);}
 db('lock-plate',C.gold,29,.13,B+1.12,.13,.065,.25,.032);db('lever',C.gold,29,.235,B+1.17,.20,.24,.035,.040);db('closer-body','#aaa9a0',29,.78,S.transom-.035,.15,.32,.095,.10);beam('closer-arm','#aaa9a0',29,[.72,S.transom+.12,DZ+.16],[.96,S.transom+.24,DZ+.08],.028);
 for(const y of[B,S.transom,S.doorTop])db('frame',C.red,20,0,y,.035,S.doorWidth+.12,.12,.25);db('meeting',C.red,20,0,(B+S.transom)/2,.055,.085,S.transom-B,.17);
 db('plaque-board',C.wood,20,0,(S.transom+S.doorTop)/2,.13,.30,.58,.075);
 box('threshold',C.stone,10,0,B+.035,Z+.02,S.doorWidth+.26,.07,.48);
 // Finite vestibule: back and side returns are well behind every glazed pane.
 box('vestibule-back',C.dark,24,0,(B+4.2)/2,Z-2.6,3.8,4.2-B,.18);for(const s of[-1,1])box('vestibule-side',C.wall,24,s*1.9,(B+4.2)/2,Z-1.4,.18,4.2-B,2.4);
 // Three photographed main rises and a landing reaching the uninterrupted porch top.
 const run=.34,stairW=3.2;for(let i=0;i<S.steps;i++){const h=B*(i+1)/S.steps,z=(S.steps-i-.5)*run;box('steps',C.stone,10,0,h/2,z,stairW,h,run);}
 for(const s of[-1,1])for(let i=0;i<S.steps;i++){const h=B*(i+1)/S.steps+.16,z=(S.steps-i-.5)*run;box('step-cheeks',C.stone,10,s*(stairW/2+.14),h/2,z,.28,h,run);}
 // Curved hip-and-gable roof with dense physical curved ceramic tiles, south/north red
 // gable panels, soffit and ridge returns. All dimensions remain proportional.
 const hx=W/2+.85,hz=D/2+.9,zc=-D/2,inset=3.7,rise=S.ridge-E,yy=t=>E+rise*Math.pow(t,1.42),end=t=>hz-inset*Math.min(1,t/.52);
 const slope=(side,t,u,off=0)=>[side*hx*(1-t),yy(t)+.30*Math.pow(Math.abs(u),10)*(1-t)*(1-t)+off,zc+u*end(t)];
 for(const s of[-1,1]){for(let j=0;j<24;j++)for(let i=0;i<80;i++){const pts=[slope(s,j/24,-1+i/40),slope(s,j/24,-1+(i+1)/40),slope(s,(j+1)/24,-1+(i+1)/40),slope(s,(j+1)/24,-1+i/40)];quad('roof',C.roof,2,...(s>0?pts.reverse():pts));}

 for(let j=0;j<14;j++)for(let i=0;i<32;i++){const q=(t,u)=>[u*hx*(1-t),yy(t)+.30*Math.pow(Math.abs(u),10)*(1-t)*(1-t),zc+s*end(t)],a=j*.52/14,c=(j+1)*.52/14,u=-1+i/16,v=-1+(i+1)/16,pts=[q(a,u),q(a,v),q(c,v),q(c,u)];quad('roof',C.roof,2,...(s<0?pts.reverse():pts));}
 const z=zc+s*(hz-inset),p=[[-hx*.48,yy(.52),z],[hx*.48,yy(.52),z],[0,S.ridge,z]];tri('gable',C.red,20,...(s<0?p.reverse():p));for(const side of[-1,1])beam('gable-edge',C.tile,2,[side*hx*.48,yy(.52),z],[0,S.ridge,z],.15);
 beam('ridge-return',C.tile,2,[0,S.ridge,z],[0,S.ridge+.52,z+s*.30],.16);
 }
 // Real ceramic cover tiles: eight curved cross-section facets per course,
 // independent annular downhill lips, and curved pan tiles between columns.
 // Main courses run parallel down the slope; hip caps conceal their clipped ends.
 function tileStrip(center,maximum,sample){const rad=.075,N=Math.max(1,Math.ceil(maximum/.36));for(let j=0;j<N;j++){const a=j*maximum/N,d=(j+1)*maximum/N;for(let k=0;k<8;k++){const aa=k*Math.PI/8,bb=(k+1)*Math.PI/8;
  const point=(v,ang,r=rad)=>{const p=sample(v,center-r*Math.cos(ang));p[1]+=.016+r*Math.sin(ang)+.008*(1-(v-a)/(d-a));return p;};
  for(let h=0;h<2;h++){const lo=a+(d-a)*h/2,hi=a+(d-a)*(h+1)/2;const p=[point(lo,aa),point(lo,bb),point(hi,bb),point(hi,aa)]; // orient curved top upward independent of roof side
   if(M.cross(M.sub(p[1],p[0]),M.sub(p[2],p[0]))[1]<0)p.reverse();quad('ceramic-cover',C.tile,25,...p);}
  const lip=[point(a,aa),point(a,bb),point(a,bb,rad-.013),point(a,aa,rad-.013)];quad('ceramic-lips',C.tile,25,...lip);
 }
 for(let k=0;k<4;k++){const x=.075+.16*k/4,xx=.075+.16*(k+1)/4;const point=(v,u)=>{const p=sample(v,center+u);p[1]+=.008+.008*Math.pow((u-.155)/.08,2);return p;};const ps=[point(a,x),point(a,xx),point(d,xx),point(d,x)];if(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))[1]<0)ps.reverse();quad('ceramic-pans',C.roof,25,...ps);}
 }}
 for(const side of[-1,1]){
  for(let z=-hz+.24;z<hz-.24;z+=.31){const extent=Math.max(Math.abs(z-.075),Math.abs(z+.235)),tm=extent<=hz-inset?1:Math.max(0,.52*(hz-extent)/inset);if(tm<.02)continue;
   tileStrip(z,hx*tm,(v,zz)=>{const t=v/hx;return slope(side,t,zz/end(t));});}
  // Both short end hips have their own parallel downslope ceramic courses.
  for(let x=-hx+.24;x<hx-.24;x+=.31){const extent=Math.max(Math.abs(x-.075),Math.abs(x+.235)),tm=Math.min(.52,1-extent/hx);if(tm<.015)continue;
   tileStrip(x,inset*tm/.52,(v,xx)=>{const t=v*.52/inset,u=xx/(hx*(1-t));return[xx,yy(t)+.30*Math.pow(Math.abs(u),10)*(1-t)*(1-t),zc+side*end(t)];});}
  for(const sideX of[-1,1])for(let j=0;j<14;j++){const q=t=>[sideX*hx*(1-t),yy(t)+.30*(1-t)*(1-t)+.045,zc+side*end(t)];beam('hip-caps',C.tile,2,q(j*.52/14),q((j+1)*.52/14),.19);}
 }
 box('ridge',C.tile,2,0,S.ridge+.10,zc,.30,.22,2*(hz-inset));quad('soffit',C.wood,20,[-hx,E-.06,zc-hz],[hx,E-.06,zc-hz],[hx,E-.06,zc+hz],[-hx,E-.06,zc+hz]);
 for(const s of[-1,1]){for(let i=0;i<80;i++){const u=-1+i/40,v=-1+(i+1)/40,pts=[[s*hx,E-.06,zc+u*hz],[s*hx,E-.06,zc+v*hz],slope(s,0,v),slope(s,0,u)];quad('eave-edge',C.wood,20,...(s>0?pts.reverse():pts));}for(let i=0;i<32;i++){const u=-1+i/16,v=-1+(i+1)/16,pts=[[u*hx,E-.06,zc+s*hz],[v*hx,E-.06,zc+s*hz],[v*hx,E+.30*Math.pow(Math.abs(v),10),zc+s*hz],[u*hx,E+.30*Math.pow(Math.abs(u),10),zc+s*hz]];quad('eave-edge',C.wood,20,...(s<0?pts.reverse():pts));}}
 for(const[n,q]of Object.entries(groups)){b.e.add('caizhai109-body163-'+n,q.g,M.identity(),q.c,[q.mat,S.pick,0,0]);}
 if(b.lettering){const id=b.id;try{b.id=S.pick;const r=-Math.atan2(SE[1]-SW[1],SE[0]-SW[0]);for(const[i,ch]of [...'才斋'].entries()){const p=world([0,S.doorTop-.15-i*.24,DZ+.19]);b.lettering(ch,p[0],p[1],p[2],.20,.21,r,'#5c704f');}}finally{b.id=id;}}
 return{id:S.id,strategy:'caizhai109-single-long-wing',floors:2,southEntry:true,westLoggia:true,roofAxis:'north-south',measured:false,hiddenNorthEast:'map-fit'};
}
A.render=function(b,f,add){return f.properties.id===S.id&&f.properties.pickId===S.pick?render(b,f):prior.call(this,b,f,add);};Y.Caizhai109Body163={spec:S,world,render};
})(YY);
