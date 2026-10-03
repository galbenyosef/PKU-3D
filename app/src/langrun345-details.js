/* Wanzhong Building: the eastern, west-facing two-storey Langrun courtyard hall.
 * Five front bays and the entrance follow PKU photographs; dimensions are fits. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,ID='way/1009052006',G=Y.Geo;
 const C={red:'#984334',green:'#46756b',stone:'#aca99d',wall:'#c9c6b9',glass:'#405954'};
 function render(b,f){
  const fr=Y.ArchitectureAdapter.frame(f.geometry,-Math.PI/2),w=fr.w-.15,d=fr.d-.15;
  const eave=8.25,rise=2.55,front=d/2-2.55,col=front+1.25,bay=(w-2.7)/5;
  const box=(key,x,y,z,ww,hh,dd,c=C.red,mat=6)=>b.mesh('langrun345-'+key,b.geo('langrun345-box',G.box),x,y,z,ww,hh,dd,c,mat,.2);
  // Separate joinery rhythms: stacked lights, broad balcony returns, and
  // small repeating hanging frets. Bars remain real opaque geometry.
  function stroke(key,x,y,z,ww,hh,points,t=.024){
   for(let i=1;i<points.length;i++){
    const a=points[i-1],c=points[i];
    box(key,x+(a[0]+c[0])*ww/2,y+(a[1]+c[1])*hh/2,z+.055,
     Math.max(t,Math.abs(a[0]-c[0])*ww),Math.max(t,Math.abs(a[1]-c[1])*hh),.038,C.green);
   }
  }
  function outline(key,x,y,z,ww,hh,t=.028){stroke(key,x,y,z,ww,hh,[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5],[-.5,-.5]],t);}
  function windowLight(x,y,z,ww,hh){
   box('glass',x,y,z,ww,hh,.035,C.glass,5);
   outline('window-lattice-border',x,y,z,ww,hh);
   // Two stacked rectangular fields, each surrounded by short corner returns.
   for(const sy of[-1,1]){
    const cy=y+sy*hh*.245,ch=hh*.45;
    outline('window-lattice-field',x,cy,z,ww*.55,ch*.66,.022);
    for(const sx of[-1,1])for(const dy of[-1,1]){
     const pts=[[.48,.13],[.36,.13],[.36,.44],[.12,.44],[.12,.33],[.27,.33],[.27,.23]];
     stroke('window-lattice-return',x,cy,z,ww,ch,pts.map(p=>[p[0]*sx,p[1]*dy]),.020);
    }
   }
   for(const dy of[-.045,.045])stroke('window-lattice-divider',x,y+dy*hh,z,ww,hh,[[-.5,0],[.5,0]],.024);
  }
  function transomLight(x,y,z,ww,hh){
   box('glass',x,y,z,ww,hh,.035,C.glass,5);
   outline('transom-lattice-border',x,y,z,ww,hh,.023);
   const n=Math.max(2,Math.round(ww/.34));
   for(let i=0;i<n;i++){
    const cx=x-ww/2+(i+.5)*ww/n;
    stroke('transom-lattice-fret',cx,y,z,ww/n,hh,[[-.5,-.32],[.30,-.32],[.30,.27],[-.25,.27],[-.25,-.08],[.08,-.08]],.019);
   }
  }
  function balconyRail(x,y,z,ww,hh){
   outline('balcony-border',x,y,z,ww,hh,.038);
   // Three broad interlocking horizontal fields per bay, not vertical lights.
   for(const dy of[-.38,.38])stroke('balcony-running-rail',x,y+hh*dy,z,ww,hh,[[-.5,0],[.5,0]],.025);
   for(let i=0;i<3;i++){
    const cw=ww/3,cx=x+(i-1)*cw;
    outline('balcony-field',cx,y,z,cw*.61,hh*.35,.026);
    for(const sg of[-1,1]){
     stroke('balcony-return',cx,y,z,cw,hh,[[-.49*sg,-.50],[-.49*sg,.26],[-.36*sg,.26],[-.36*sg,-.27],[.19*sg,-.27],[.19*sg,-.12]],.025);
     stroke('balcony-return',cx,y,z,cw,hh,[[-.22*sg,.50],[-.22*sg,.28],[.46*sg,.28],[.46*sg,-.38]],.025);
    }
   }
  }
  function hangingFret(x,y,z,ww,hh){
   outline('hanging-border',x,y,z,ww,hh,.025);
   const n=8,cw=ww/n;
   for(let i=0;i<n;i++){
    const cx=x-ww/2+(i+.5)*cw;
    for(const sg of[-1,1])stroke('hanging-fret',cx,y,z,cw,hh,[[-.5*sg,-.38],[.30*sg,-.38],[.30*sg,.10],[-.18*sg,.10],[-.18*sg,.38],[.50*sg,.38]],.018);
   }
   // Small stepped corner drops are visible below the two ends of each frieze.
   for(const sg of[-1,1])stroke('hanging-corner',x+sg*(ww/2-.20),y-hh*.64,z,.40,.18,[[-.5*sg,.5],[.5*sg,.5],[.5*sg,-.5],[.15*sg,-.5],[.15*sg,0],[-.15*sg,0]],.023);
  }
  function panels(x,base,door){
   const width=bay-.35,z=front+.085;
   const high=base+2.70,pw=width/4;
   if(door){
    // The photograph separates two operable middle leaves from the fixed
    // sidelights. Only the middle pair has its own low horizontal transom.
    for(let j=0;j<4;j++){
     const leaf=j===1||j===2,px=x-width/2+(j+.5)*pw;
     const top=leaf?2.30:2.70,skirt=leaf?.76:.64,key=leaf?'door-leaf':'fixed-sidelight';
     const clear=pw-.14;
     for(const sg of[-1,1])box(key+'-stile',px+sg*(pw/2-.045),base+top/2,z,.09,top,.14);
     for(const y of[.045,skirt,top-.045])box(key+'-rail',px,base+y,z,pw-.07,.09,.14);
     // Solid red timber below the glazing, with the inset rectangular frame
     // visible in the full-facade reference. No glazing reaches the floor.
     box(key+'-wood-skirt',px,base+skirt/2,z-.015,clear,skirt-.09,.095);
     for(const sg of[-1,1]){
      box(key+'-panel-trim',px+sg*(clear/2-.06),base+skirt/2,z+.051,.026,skirt-.22,.025,'#ad5140');
      box(key+'-panel-trim',px,base+skirt/2+sg*(skirt/2-.11),z+.051,clear-.12,.026,.025,'#ad5140');
     }
     windowLight(px,base+(skirt+top)/2,z+.08,clear,top-skirt-.12);
    }
    const airWidth=pw*2-.11,airBase=base+2.35,airTop=base+2.70;
    for(const sg of[-1,1]){
     box('door-air-frame',x+sg*(airWidth/2+.035),(airBase+airTop)/2,z,.07,airTop-airBase+.10,.14);
     box('door-air-frame',x,sg<0?airBase:airTop,z,airWidth+.14,.07,.14);
    }
    transomLight(x,(airBase+airTop)/2,z+.085,airWidth-.06,airTop-airBase-.08);
   }else{
    const low=base+.65,ph=high-low;
    for(let j=0;j<4;j++){const px=x-width/2+(j+.5)*pw;
     box('panel-frame',px,(low+high)/2,z,pw-.025,ph,.09);
     windowLight(px,(low+high)/2+.10,z+.06,pw-.14,ph-.30);
    }
   }
   for(const s of[-1,1])box('jamb',x+s*(width/2+.06),base+1.82,z,.12,3.64,.15);
   box('crossbar',x,high+.09,z,width+.12,.16,.15);
   // Three short transoms above each main bay are visible on both storeys.
   for(let j=0;j<3;j++){
    const tx=x+(j-1)*width/3;box('transom-frame',tx,base+3.15,z,width/3-.035,.60,.12);
    transomLight(tx,base+3.15,z+.08,width/3-.18,.40);
   }
   if(!door)box('stone-skirt',x,base+.30,front,width,.60,.18,C.stone,10);
   if(door)for(const s of[-1,1])box('door-handle',x+s*.10,base+1.12,z+.18,.035,.22,.04,'#b4a174',9);
  }
  const state=[b.origin,b.rotation,b.id,b.anim];
  b.origin=[fr.centre[0],0,fr.centre[1]];b.rotation=fr.r;b.id=345;b.anim=0;
  try{
   // Mapped rectangle and original high-resolution coiled-roof profile retained.
   // Rear and end walls stay plain where current photographs do not establish openings.
   box('platform',0,.34,-.30,w-1,.68,d-1.1,C.stone,10);
   box('rear-wall',0,4.43,-d/2+.65,w-1.1,7.50,.24,C.wall,24);
   for(const s of[-1,1])box('end-wall',s*(w/2-.67),4.43,-.95,.24,7.50,d-3.2,C.wall,24);
   // Front has a real opening rather than a solid backing across the doors.
   for(const base of[.68,4.48])for(let i=-2;i<=2;i++)panels(i*bay,base,i===0);
   for(const y of[.68,4.48])box('gallery-slab',0,y-.10,front+.77,w-1,.20,2.20,C.stone,10);
   for(let i=0;i<6;i++){
    const x=(i-2.5)*bay;
    b.mesh('langrun345-column',b.geo('langrun345-column',()=>G.cylinder(16)),x,.68,col,.20,7.47,.20,C.red,6,.2);
   }
   for(const y of[4.20,8.04])box('gallery-beam',0,y,col,w-.9,.38,.34);
   for(let i=-2;i<=2;i++){
    balconyRail(i*bay,4.98,col+.14,bay-.40,.82);
    for(const y of[3.91,7.77])hangingFret(i*bay,y,col+.08,bay-.40,.30);
   }
   // Three ground-supported treads meet the .68 m terrace. Width fits the photo.
   for(let i=0;i<3;i++){const top=(3-i)*.17;box('entry-step',0,top/2,front+1.87+(i+.5)*.32,3.65,top,.32,C.stone,10);}
   const slope=b.geo('langrun345-stair-side',()=>{const g=new G.Geometry();const a=[-.12,0,0],bb=[.12,0,0],c=[.12,.68,0],dd=[-.12,.68,0],e=[-.12,0,.96],ff=[.12,0,.96];g.quad(a,bb,c,dd);g.quad(dd,c,ff,e);g.tri(a,dd,e);g.tri(bb,ff,c);g.quad(a,e,ff,bb);return g;});
   for(const s of[-1,1])b.mesh('langrun345-stair-side',slope,s*1.95,0,front+1.87,1,1,1,C.stone,10,.1);
   Y.Refinements44.coiledRoof.call(b,0,eave,0,w,d,rise);
   // The retained end/rear walls ended at 8.18 m, below the lifted hip roof.
   // Close the shell against its actual triangle surface; do not change the roof.
   const rv=b.cache['langrun44-coiled-hip'].v;
   function roofAt(x,z){
    let top=eave;
    for(let i=0;i<rv.length;i+=24){
     const ax=rv[i]*w,az=rv[i+2]*d,bx=rv[i+8]*w,bz=rv[i+10]*d,cx=rv[i+16]*w,cz=rv[i+18]*d;
     const den=(bz-cz)*(ax-cx)+(cx-bx)*(az-cz);if(Math.abs(den)<1e-9)continue;
     const u=((bz-cz)*(x-cx)+(cx-bx)*(z-cz))/den,v=((cz-az)*(x-cx)+(ax-cx)*(z-cz))/den;
     if(u>=-1e-7&&v>=-1e-7&&u+v<=1+1e-7)top=Math.max(top,eave+rise*(u*rv[i+1]+v*rv[i+9]+(1-u-v)*rv[i+17]));
    }return top-.020;
   }
   box('roof-soffit',0,8.20,0,w-1,.10,d-1,'#6c4135');
   // Original tiles are a zero-thickness surface. Add their inner skin and
   // boundary returns below them, so the wall enters roof thickness rather
   // than protruding through the visible tiles. No duplicate top surface.
   const lining=new G.Geometry(),edges=new Map(),thickness=.045;
   const edgeKey=p=>p.map(v=>v.toFixed(6)).join(',');
   for(let i=0;i<rv.length;i+=24){
    const ps=[0,8,16].map(j=>[rv[i+j]*w,eave+rv[i+j+1]*rise,rv[i+j+2]*d]);
    const lower=ps.map(p=>[p[0],p[1]-thickness,p[2]]);
    lining.tri(lower[2],lower[1],lower[0]);
    for(let j=0;j<3;j++){
     const a=ps[j],c=ps[(j+1)%3],ka=edgeKey(a),kc=edgeKey(c),key=[ka,kc].sort().join('|');
     if(edges.has(key))edges.delete(key);else edges.set(key,[a,c]);
    }
   }
   for(const [a,c]of edges.values())lining.quad(c,a,[a[0],a[1]-thickness,a[2]],[c[0],c[1]-thickness,c[2]]);
   b.mesh('langrun345-roof-inner-skin',lining,0,0,0,1,1,1,'#6c4135',6,.2);
   // Close the uplifted outer perimeter to the retained green fascia. The
   // upper edge overlaps only the inner skin's boundary return, below tiles.
   const eaveSeal=new G.Geometry(),perimeter=new Set();
   for(let i=0;i<rv.length;i+=24)for(let j=0;j<3;j++){
    const a=rv.slice(i+j*8,i+j*8+3),c=rv.slice(i+((j+1)%3)*8,i+((j+1)%3)*8+3);
    if(![0,2].some(axis=>Math.abs(Math.abs(a[axis])-.5)<1e-7&&Math.abs(a[axis]-c[axis])<1e-7))continue;
    const key=[edgeKey(a),edgeKey(c)].sort().join('|');if(perimeter.has(key))continue;perimeter.add(key);
    const bottom=eave-.030,top=p=>[p[0]*w,Math.max(bottom,eave+p[1]*rise-.040),p[2]*d];
    const aa=top(a),cc=top(c);if(aa[1]===bottom&&cc[1]===bottom)continue;
    const ps=[aa,cc,[cc[0],bottom,cc[2]],[aa[0],bottom,aa[2]]];
    const normal=Y.M.cross(Y.M.sub(ps[1],ps[0]),Y.M.sub(ps[2],ps[0]));
    if(normal[0]*(aa[0]+cc[0])+normal[2]*(aa[2]+cc[2])<0)ps.reverse();
    const unique=ps.filter((p,i)=>!ps.slice(0,i).some(q=>p.every((v,j)=>v===q[j])));
    if(unique.length===3)eaveSeal.tri(...unique);else eaveSeal.quad(...unique);
   }
   b.mesh('langrun345-eave-perimeter-seal',eaveSeal,0,0,0,1,1,1,'#4c706b',6,1.9);
   const cap=new G.Geometry();
   function closeWall(x0,z0,x1,z1,dx,dz,reverse){
    const quad=(...ps)=>cap.quad(...(reverse?ps.reverse():ps));
    for(let i=0;i<48;i++){
     const u=i/48,v=(i+1)/48,ax=x0+(x1-x0)*u,az=z0+(z1-z0)*u,bx=x0+(x1-x0)*v,bz=z0+(z1-z0)*v;
     const a=[ax,8.17,az],bb=[bx,8.17,bz],c=[bx,roofAt(bx,bz),bz],dd=[ax,roofAt(ax,az),az];
     const e=[ax+dx,8.17,az+dz],f=[bx+dx,8.17,bz+dz],g=[bx+dx,roofAt(bx+dx,bz+dz),bz+dz],h=[ax+dx,roofAt(ax+dx,az+dz),az+dz];
     quad(a,bb,c,dd);quad(f,e,h,g);quad(dd,c,g,h);quad(e,f,bb,a);
     if(!i)quad(e,a,dd,h);if(i===47)quad(bb,f,g,c);
    }
   }
   for(const sg of[-1,1])closeWall(sg*(w/2-.79),-.95-(d-3.2)/2,sg*(w/2-.79),-.95+(d-3.2)/2,sg*.24,0,sg>0);
   closeWall(-(w-1.1)/2,-d/2+.53,(w-1.1)/2,-d/2+.53,0,.24,true);
   b.mesh('langrun345-wall-roof-closure',cap,0,0,0,1,1,1,C.wall,24,.2);

   box('plaque',0,7.85,col+.27,2.40,.62,.10,'#273c39',6);
   b.lettering('萬眾樓',0,7.85,col+.335,2.08,.43,0,'#cfb77c');
  }finally{[b.origin,b.rotation,b.id,b.anim]=state;}
  return {id:ID,strategy:'langrun345-wanzhong',front:'west',floors:2,bays:5,height:10.8,heightEvidence:'photograph fit, not measured',frame:fr};
 }
 A.render=function(b,f,add){return f.properties.id===ID&&f.properties.pickId===345?render(b,f):previous.call(this,b,f,add);};
 Y.Langrun345={render};
})(YY);
