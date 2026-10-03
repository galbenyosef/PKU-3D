/* North Chemistry / Daya Hall: two floors, continuous red columns, northern candidate entrance. */
(function(Y){'use strict';
const F=Y.Footprints,G=Y.Geo,A=Y.Architecture30,previous=A.render,ID='way/226704221';
const O=[-385.445,-110.479],R=Math.atan2(-.244,59.775),CO=Math.cos(R),SI=Math.sin(R),W=59.776,D=23.828,mid=W/2;
const C={wall:'#e0e1d5',stone:'#aeb7b1',red:'#77382f',frame:'#714132',glass:'#779291',roof:'#737d79',tile:'#96a19a',green:'#287368',blue:'#357292',gold:'#c3b773'};
const H={wall:8.70,eave:9.85,ridge:14.2,top:15.2},entrance={side:'north',inferred:true,u:mid,v:0};
const world=(u,v)=>[O[0]+u*CO+v*SI,O[1]-u*SI+v*CO],local=p=>[(p[0]-O[0])*CO-(p[1]-O[1])*SI,(p[0]-O[0])*SI+(p[1]-O[1])*CO];
function clip(p,a,k,greater){const out=[];for(let i=0;i<p.length;i++){const s=p[i],e=p[(i+1)%p.length],si=greater?s[a]>=k:s[a]<=k,ei=greater?e[a]>=k:e[a]<=k;if(si)out.push(s);if(si!==ei){const t=(k-s[a])/(e[a]-s[a]);out.push(s.map((x,j)=>x+t*(e[j]-x)));}}return out;}
function pieces(f,box){const out=[];for(const pg of F.polygons(f.geometry))for(const tri of F.capTriangles(pg)){let p=tri.map(local);for(const [a,k,g] of [[0,box[0],true],[0,box[2],false],[1,box[1],true],[1,box[3],false]])if(p.length)p=clip(p,a,k,g);if(p.length>=3&&Math.abs(F.area([...p,p[0]]))>1e-8)out.push(p);}return out;}
// Ridge-end silhouette fitted to the 2017 front photograph; fine carving unresolved.
function ridgeEnd(){
 const outline=[[-.36,0]],curve=(a,b,c)=>{const p=outline.at(-1);for(let i=1;i<=16;i++){const t=i/16,u=1-t;outline.push([0,1].map(k=>u*u*u*p[k]+3*u*u*t*a[k]+3*u*t*t*b[k]+t*t*t*c[k]));}};
 const line=p=>outline.push(p);
 line([.36,0]);line([.39,.13]);line([.31,.24]);
 curve([.31,.45],[.49,.67],[.48,.80]);curve([.49,1.01],[.20,1.01],[.17,.82]);
 curve([.12,.78],[.08,.78],[.02,.75]);line([-.10,.67]);line([-.11,.92]);line([-.31,.92]);line([-.31,.63]);
 curve([-.37,.52],[-.35,.37],[-.38,.28]);line([-.49,.24]);line([-.36,.15]);line([-.36,0]);
 const g=new G.Geometry(),back=-.20,front=.20;
 for(const t of F.capTriangles([outline])){g.tri(...[...t].reverse().map(([x,y])=>[x,y,front]));g.tri(...t.map(([x,y])=>[x,y,back]));}
 for(let i=1;i<outline.length;i++){const a=outline[i-1],b=outline[i];g.quad([a[0],a[1],back],[b[0],b[1],back],[b[0],b[1],front],[a[0],a[1],front]);}
 return g;
}
// Shared geometric transom panel fitted to the clear rectangular-and-ring pattern.
function windowLattice(){const g=new G.Geometry();
 function box(x,y,w,h){const l=x-w/2,r=x+w/2,b=y-h/2,t=y+h/2,z=.024;
  g.quad([l,b,z],[r,b,z],[r,t,z],[l,t,z]);g.quad([r,b,0],[l,b,0],[l,t,0],[r,t,0]);
  g.quad([l,b,0],[r,b,0],[r,b,z],[l,b,z]);g.quad([l,t,z],[r,t,z],[r,t,0],[l,t,0]);
  g.quad([l,b,0],[l,b,z],[l,t,z],[l,t,0]);g.quad([r,b,z],[r,b,0],[r,t,0],[r,t,z]);
 }
 for(const r of [.33,.20]){for(const y of [-r,r])box(0,y,2*r+.025,.025);for(const x of [-r,r])box(x,0,.025,2*r-.025);}
 for(const side of [-1,1]){for(const x of [-.16,.16])box(x,side*.415,.025,.17);for(const y of [-.12,.12])box(side*.415,y,.17,.025);}
 for(const [x,y]of [[0,.265],[0,-.265],[.265,0],[-.265,0]]){
  const n=16,outer=.065,inner=.042,z=.024;
  for(let j=0;j<n;j++){const a=j*2*Math.PI/n,b=(j+1)*2*Math.PI/n,p=(r,t,d)=>[x+r*Math.cos(t),y+r*Math.sin(t),d];
   g.quad(p(outer,a,z),p(outer,b,z),p(inner,b,z),p(inner,a,z));g.quad(p(inner,a,0),p(inner,b,0),p(outer,b,0),p(outer,a,0));
   g.quad(p(outer,a,0),p(outer,b,0),p(outer,b,z),p(outer,a,z));g.quad(p(inner,b,0),p(inner,a,0),p(inner,a,z),p(inner,b,z));
  }
 }
 return g;
}
function render(b,f,add){const id=f.properties.pickId;b.id=id;const vertex=(u,y,v)=>{const p=world(u,v);return[p[0],y,p[1]];};
 function group(name,fn){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'016-'+name+'-'+k,...args);};try{fn();}finally{b.e.add=old;}}
 function block(name,box,base,top,color=C.wall){const g=new G.Geometry();for(const p of pieces(f,box)){for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];g.quad(vertex(a[0],base,a[1]),vertex(c[0],base,c[1]),vertex(c[0],top,c[1]),vertex(a[0],top,a[1]));}for(let i=1;i<p.length-1;i++){g.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],top,p[1])));if(base>0)g.tri(...[p[0],p[i+1],p[i]].map(p=>vertex(p[0],base,p[1])));}}add('016-'+name,g,color,24,id);}
 block('body-west',[-1,-1,mid-1.7,25],0,H.wall);block('body-east',[mid+1.7,-1,61,25],0,H.wall);block('door-back-body',[mid-1.7,1.2,mid+1.7,25],0,H.wall);block('door-lintel',[mid-1.7,-1,mid+1.7,1.2],3.95,H.wall);
 // A single continuous four-slope hipped roof, without upper gable walls.
 const x0=-1.4,x1=W+1.4,z0=-1.4,z1=D+1.4,zm=D/2,g0=7,g1=W-7;
 const roofY=v=>{const t=Math.max(0,1-Math.abs(v-zm)/(zm-z0));return 9.63+4.57*Math.pow(t,1.25)+.22*Math.pow(1-t,10);};
 const faces=[{name:'north',p:[[x0,z0],[x1,z0],[g1,zm],[g0,zm]],axis:1,y:p=>roofY(p[1])},{name:'south',p:[[g0,zm],[g1,zm],[x1,z1],[x0,z1]],axis:1,y:p=>roofY(p[1])},{name:'west',p:[[x0,z0],[g0,zm],[x0,z1]],axis:0,y:p=>roofY(z0+(p[0]-x0)/(g0-x0)*(zm-z0))},{name:'east',p:[[g1,zm],[x1,z0],[x1,z1]],axis:0,y:p=>roofY(z0+(x1-p[0])/(x1-g1)*(zm-z0))}];
 for(const q of faces){const mesh=new G.Geometry(),axis=q.axis,lo=Math.min(...q.p.map(p=>p[axis])),hi=Math.max(...q.p.map(p=>p[axis]));for(let j=0;j<32;j++){const p=clip(clip(q.p,axis,lo+(hi-lo)*j/32,true),axis,lo+(hi-lo)*(j+1)/32,false);for(let i=1;i<p.length-1;i++)mesh.tri(...[p[0],p[i],p[i+1]].map(p=>vertex(p[0],q.y(p),p[1])));}add('016-hip-roof-'+q.name,mesh,C.roof,25,id);
  Y.RoofTiles.render(b,q,{origin:O,rotation:R,key:'016',color:C.tile,eaveHigh:q.name==='south'||q.name==='east',offset:.1});
 }
 b.local(O[0],0,O[1],R,()=>{
  group('ridge-and-end-ornaments',()=>{b.box(mid,14.27,zm,g1-g0+.3,.22,.38,C.tile,25);for(const [x,side]of [[g0,1],[g1,-1]])b.mesh('016-ridge-end',b.geo('016-ridge-end',ridgeEnd),x,14.27,zm,1,.93,1,C.tile,25,0,side<0?Math.PI:0);for(const east of [false,true])for(const south of [false,true])for(let j=0;j<24;j++){const t=j/24,tt=(j+1)/24,x=east?x1-(x1-g1)*t:x0+(g0-x0)*t,xx=east?x1-(x1-g1)*tt:x0+(g0-x0)*tt,v=south?z1-(z1-zm)*t:z0+(zm-z0)*t,vv=south?z1-(z1-zm)*tt:z0+(zm-z0)*tt;b.beam([x,roofY(v)+.06,v],[xx,roofY(vv)+.06,vv],.13,C.tile,25);}});
  function lattice(x,y,z,w,h,detailed=false){
   if(detailed){
    const count=w<2.5?2:w>3.2?4:3,span=w/count,top=y+h/2,transom=top-.78;
    b.box(x,y,z,w,h,.07,C.glass,5);
    for(let i=0;i<=count;i++)b.box(x-w/2+i*span,y,z+.07,.065,h+.08,.11,C.frame,20);
    for(const yy of [y-h/2,y+.10,transom,top])b.box(x,yy,z+.07,w+.10,.065,.11,C.frame,20);
    for(let i=0;i<count;i++)b.mesh('016-window-transom-grid',b.geo('016-window-transom-grid',windowLattice),x-w/2+(i+.5)*span,(transom+top)/2,z+.095,span-.065,.715,1,C.frame,20);
    return;
   }
   b.box(x,y,z,w,h,.07,C.glass,5);for(const xx of [x-w/2,x,x+w/2])b.box(xx,y,z+.07,.065,h+.08,.11,C.frame,20);for(const yy of [y-h/2,y+.10,y+h/2-.65,y+h/2])b.box(x,yy,z+.07,w+.10,.065,.11,C.frame,20);for(let xx=x-w/2+.12;xx<x+w/2;xx+=.28){b.box(xx,y+h/2-.32,z+.09,.035,.59,.06,C.frame,20);for(const yy of [y+h/2-.49,y+h/2-.18])b.box(xx+.09,yy,z+.09,.19,.025,.06,C.frame,20);}}
  const breaks=[.35,8.55,16.75,24.95,34.83,43.03,51.23,W-.35];
  for(const north of [true,false])b.local(north?W:0,0,north?0:D,north?Math.PI:0,()=>{
   group((north?'north':'south')+'-two-storey-windows',()=>{for(let i=1;i<breaks.length;i++){const a=breaks[i-1],c=breaks[i],span=c-a;if(i===4){for(const y of [2.40,6.52]){for(const x of [a+1.65,c-1.65])lattice(x,y,.02,2.35,3.03,north);if(!north||y>3)lattice((a+c)/2,y,.02,3.35,3.03,north);}}else for(const x of [a+span*.265,a+span*.735])for(const y of [2.40,6.52])lattice(x,y,.02,span*.36,3.03,north);}});
   group((north?'north':'south')+'-continuous-red-columns',()=>{for(const x of breaks)b.cyl(x,.70,.18,.30,8.57,C.red,20,1,20);});
   group('white-waist-plinth',()=>{b.box(mid,4.48,.065,W,.94,.17,C.wall,24);for(const y of [4.0,4.96])b.box(mid,y,.13,W,.09,.22,'#c8d2c9',24);if(north){for(const [a,c] of [[0,mid-1.7],[mid+1.7,W]])b.box((a+c)/2,.36,.035,c-a,.72,.11,C.stone,24);}else b.box(mid,.36,.035,W,.72,.11,C.stone,24);});
   group('painted-eave',()=>{b.box(mid,8.59,.2,W+.6,1.00,.7,C.green,20);b.box(mid,9.26,.28,W+.9,.24,.9,C.red,20);for(let i=1;i<breaks.length;i++){const a=breaks[i-1],c=breaks[i],x=(a+c)/2,w=c-a-.55;for(const cy of [8.34,8.84]){
     b.box(x,cy,.58,w,.40,.08,C.blue,20);
     for(const yy of [cy-.20,cy+.20])b.box(x,yy,.64,w,.038,.055,C.gold,9);
     b.box(x,cy,.65,w*.56,.19,.06,'#c9d6be',24);
     for(const side of [-1,1]){const sx=x+side*w*.36;
      b.box(sx,cy,.65,.60,.28,.055,C.green,20);
      for(const yy of [cy-.115,cy+.115])b.box(sx,yy,.69,.47,.03,.045,C.gold,9);
      for(const xx of [sx-.235,sx+.235])b.box(xx,cy,.69,.03,.23,.045,C.gold,9);
      b.box(sx,cy,.70,.18,.10,.045,C.gold,9);
     }
    }}for(const x of breaks){b.box(x,9.05,.48,.61,.32,.64,C.green,20);b.box(x,9.30,.57,.92,.18,.85,C.blue,20);b.box(x,9.04,.81,.27,.18,.05,C.gold,9);}for(let x=.2;x<W;x+=.40){b.box(x,9.57,.67,.15,.15,1.37,C.red,20);b.box(x,9.57,1.37,.16,.14,.09,C.gold,9);}});
  });
  // North is a spatial inference from the west-gate axis, not from the building's name.
  b.local(W,0,0,Math.PI,()=>{
   group('north-daya-door',()=>{
    // The 2017 photographs show solid lower panels, glazed leaves and a separate
    // four-light transom, all with diamond grilles. Dimensions remain fitted.
    const plane=-1.04,paint=20;
    function pane(left,right,bottom,top){
     b.box((left+right)/2,(bottom+top)/2,plane-.025,right-left,top-bottom,.035,C.glass,5);
     // Clip both diagonal families to the clear opening; no rods cross the frame.
     for(const slope of [-.58,.58]){
      const h=top-bottom,lo=Math.min(left,left-slope*h),hi=Math.max(right,right-slope*h);
      for(let x=Math.ceil(lo/.23)*.23;x<hi;x+=.23){
       const ya=(left-x)/slope,yb=(right-x)/slope,low=Math.max(0,Math.min(ya,yb)),high=Math.min(h,Math.max(ya,yb));
       if(high-low>.018)b.beam([x+slope*low,bottom+low,plane+.012],[x+slope*high,bottom+high,plane+.012],.011,C.frame,37);
      }
     }
    }
    // Narrow fixed side lights flank the paired central leaves.
    for(const [left,right]of [[mid-1.60,mid-.99],[mid-.98,mid-.01],[mid+.01,mid+.98],[mid+.99,mid+1.60]]){
     const x=(left+right)/2,w=right-left;
     for(const edge of [left+.045,right-.045])b.box(edge,1.94,plane+.04,.09,2.32,.13,C.red,paint);
     b.box(x,1.12,plane+.015,w-.09,.68,.10,C.red,paint);
     // Recessed lower field and projecting rails retain depth in an oblique view.
     b.box(x,1.13,plane+.07,w-.25,.43,.025,C.frame,paint);
     for(const [y,h]of [[.825,.09],[1.50,.12],[3.025,.15]])b.box(x,y,plane+.04,w,h,.13,C.red,paint);
     pane(left+.09,right-.09,1.56,2.95);
     pane(left+.055,right-.055,3.19,3.79);
    }
    for(const x of [mid-1.65,mid+1.65])b.box(x,2.33,plane+.04,.10,3.13,.16,C.red,paint);
    for(const y of [3.13,3.86])b.box(mid,y,plane+.04,3.38,.12,.16,C.red,paint);
    for(const x of [mid-.99,mid,mid+.99])b.box(x,3.49,plane+.04,.08,.65,.13,C.red,paint);
    // Paired pull handles are visible; their exact profile is not established.
    for(const x of [mid-.12,mid+.12]){
     b.box(x,1.66,plane+.17,.035,.38,.055,'#b7afa0',29);
     for(const y of [1.50,1.82])b.box(x,y,plane+.11,.035,.035,.12,'#b7afa0',29);
    }
    b.box(mid,.375,-.91,3.38,.75,.58,C.stone,24);
   });
   group('daya-signs',()=>{b.box(mid,4.49,.19,2.70,.64,.10,'#252e2b',6);if(b.lettering)b.lettering('堂雅大',mid,4.49,.25,2.42,.45,0,C.gold);for(const x of [mid-1.94,mid+1.94]){b.box(x,2.41,.15,.35,3.0,.08,'#252e2b',6);for(let y=1.2;y<3.8;y+=.27)b.box(x,y,.20,.105,.055,.025,C.gold,9);}});
   group('small-stairs',()=>{for(let i=0;i<5;i++){const z=2.0-i*.38,top=.15*(i+1);b.box(mid,top/2,z,3.55,top,.39,C.stone,24);}b.box(mid,.375,-.1675,3.55,.75,.905,C.stone,24);for(const side of [-1,1]){const x=mid+side*1.91;for(const [z,y] of [[.1,.75],[2.12,.15]])b.cyl(x,y,z,.028,.86,'#45514c',8,1,37);b.beam([x,1.61,.1],[x,1.01,2.12],.034,'#45514c',37);group('stair-rail-infill',()=>{
      const top=z=>1.61-.6*(z-.1)/2.02,bar=(za,da,zb,db)=>b.beam([x,top(za)-da,za],[x,top(zb)-db,zb],.018,'#45514c',37);
      bar(.12,.72,2.10,.72);
      // Closed inner rectangle and connecting crossbars, not disconnected stubs.
      for(const d of [.19,.54])bar(.68,d,1.54,d);
      for(const z of [.68,1.54])bar(z,.19,z,.54);
      bar(.12,.365,.68,.365);bar(1.54,.365,2.10,.365);
      for(const z of [.68,1.54]){bar(z,0,z,.19);bar(z,.54,z,.72);}
     });}});
  });
 });
 // Short ends retain two restrained rows and no invented secondary door or extra storey.
 const ring=F.polygons(f.geometry)[0][0],positive=F.area(ring)>0;for(let i=1;i<ring.length;i++){let a=ring[i-1],c=ring[i];if(positive)[a,c]=[c,a];const aa=local(a),cc=local(c);if(Math.abs(aa[1]-cc[1])<1)continue;const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);b.local(a[0],0,a[1],Math.atan2(-dz,dx),()=>group('short-ends',()=>{for(let j=0;j<4;j++)for(const y of [2.4,6.52]){const x=(j+.5)*len/4;b.box(x,y,.04,3.25,3.03,.09,C.glass,5);for(const xx of [x-1.63,x,x+1.63])b.box(xx,y,.11,.08,3.14,.10,C.frame,20);for(const yy of [y-1.515,y+.85,y+1.515])b.box(x,yy,.11,3.35,.08,.10,C.frame,20);}b.box(len/2,4.48,.06,len,.94,.17,C.wall,24);b.box(len/2,.36,.03,len,.72,.11,C.stone,24);b.box(len/2,8.84,.20,len,.56,.70,C.green,20);b.box(len/2,9.26,.28,len,.24,.9,C.red,20);for(let x=.2;x<len;x+=.4)b.box(x,9.57,.67,.15,.15,1.37,C.red,20);}));}
 return{strategy:'building016-v46',floors:2,sourceOutline:true,hipRoof:true,continuousColumns:true,entranceInferred:true,dimensionFitted:true};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Building016={id:ID,render,world,local,pieces,heights:H,entrance,windowLattice,ridgeEnd};
})(YY);
