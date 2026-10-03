/* Courtyard 4: only the two first-floor groups beside the retained entrance.
 * Four leaves and rectangular muntin topology follow the official 2021 photo:
 * https://yenching.pku.edu.cn/info/1039/3883.htm . Dimensions are proportional
 * fits to the existing entrance, not surveyed; no porch extent is inferred. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo;
const S={width:33.2/9.5,height:3.4,bottom:.82,bay:33.2/7.9,frontOriginZ:-9.45,
 widths:[.20,.30,.30,.20],lower:1.15,head:.28,glassZ:.105,glassDepth:.035,
 scope:'courtyard-facing-first-floor-adjacent-two-groups',surveyed:false};
let cached;
function shapes(){if(cached)return cached;const out={red:new G.Geometry(),inset:new G.Geometry(),glass:new G.Geometry(),stone:new G.Geometry()},unit=G.box();
 function box(k,x,y,z,w,h,d){const g=out[k];for(let i=0;i<unit.v.length;i+=8)g.vertex([x+unit.v[i]*w,y+unit.v[i+1]*h,z+unit.v[i+2]*d],unit.v.slice(i+3,i+6),unit.v.slice(i+6,i+8));}
 let x=-S.width/2;const H=S.height,gy0=S.lower+.035,gy1=H-S.head-.035,gh=gy1-gy0;
 for(let i=0;i<4;i++){const w=S.width*S.widths[i],cx=x+w/2,gw=w-.14;
  box('red',cx,S.lower/2,.075,w-.02,S.lower,.13);
  box('inset',cx,.88,.145,w-.18,.20,.018);
  box('red',cx,H-S.head/2,.075,w-.02,S.head,.13);box('inset',cx,H-S.head/2,.145,w-.18,.12,.018);
  for(const side of[-1,1])box('red',cx+side*(w/2-.035),H/2,.12,.07,H,.12);
  for(const yy of[S.lower,H-S.head])box('red',cx,yy,.135,w,.09,.12);
  box('glass',cx,(gy0+gy1)/2,S.glassZ,gw,gh,S.glassDepth);
  const line=(a,b)=>{const dx=(b[0]-a[0])*gw,dy=(b[1]-a[1])*gh;box('red',cx+((a[0]+b[0])/2-.5)*gw,gy0+(a[1]+b[1])/2*gh,.15,Math.abs(dx)||.032,Math.abs(dy)||.032,.06);};
  // Two tall lights, separated by a shallow rectangular band, with short
  // top/bottom lights. Broad leaves have narrow subdivided side lights.
  for(const y of[.08,.46,.54,.92])line([0,y],[1,y]);
  if(i===0||i===3){for(const [a,b]of[[.08,.46],[.54,.92]])line([.5,a],[.5,b]);}
  else{for(const [a,b]of[[.08,.46],[.54,.92]])for(const xx of[.16,.84])line([xx,a],[xx,b]);for(const [a,b]of[[0,.08],[.46,.54],[.92,1]])line([.5,a],[.5,b]);for(const yy of[.27,.73]){line([0,yy],[.16,yy]);line([.84,yy],[1,yy]);}}
  x+=w;
 }
 box('red',0,H+.04,.10,S.width+.14,.08,.20);
 box('stone',0,-.06,.12,S.width+.24,.12,.37);
 return cached=out;
}
A.render=function(b,f,...args){if(f.properties.pickId!==168||f.properties.id!=='way/272364822')return prior.call(this,b,f,...args);
 const old=b.v9Lattice,own=Object.hasOwn(b,'v9Lattice');b.v9Lattice=function(x,y,z,w,h,r,diagonal){const match=this.id===168&&Math.abs(Math.abs(this.origin[0])-S.bay)<1e-7&&Math.abs(this.origin[2]-S.frontOriginZ)<1e-7&&Math.abs(this.rotation)<1e-7&&x===0&&y===2.77&&z===0&&Math.abs(w-S.width)<1e-7&&h===2.66&&r===0&&!diagonal;
 if(!match)return old.call(this,x,y,z,w,h,r,diagonal);const g=shapes();for(const [k,c,mat,part]of[['red','#873f39',20,.83],['inset','#713a34',20,.83],['glass','#425352',5,.80],['stone','#adada2',10,.83]])this.mesh('jingyuan-windows173-'+k,this.geo('jingyuan-windows173-'+k,()=>g[k]),0,S.bottom,0,1,1,1,c,mat,part);
 };try{return prior.call(this,b,f,...args);}finally{if(own)b.v9Lattice=old;else delete b.v9Lattice;}};
Y.JingyuanWindows173={...S,shapes};
})(YY);
