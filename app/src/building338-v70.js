/* 338: west-facing low courtyard portal between 337 and 336.
 * Street-view registration supports this frontage, not an enclosed room across
 * the full OSM depth. Heights and wall-foot positions are constrained fits. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,ID='way/1009051999';
const C={wall:'#e6e3d9',base:'#818478',red:'#933f30',blue:'#34585b',gold:'#bca475',roof:'#687168',tile:'#919989'};
const X=-316.62,Z0=-365.53,Z1=-362.19,END=-360.32,H=3.55;
function render(b,f){b.id=f.properties.pickId;
 const mesh=(name,g,c,mat=24)=>b.mesh('338-'+name,g,0,0,0,1,1,1,c,mat);
 const group=(name,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'338-'+name+'-'+k,...a)};try{fn()}finally{b.e.add=old}};
 // Extruded planar polygons; both sides and all reveals are actual geometry.
 function slab(name,ring,x0,x1,color){const g=new G.Geometry(),flat=G.polygon(ring,0);for(let i=0;i<flat.v.length;i+=24){const ps=[0,8,16].map(k=>[flat.v[i+k],flat.v[i+k+2]]);g.tri(...ps.map(p=>[x1,p[1],p[0]]));g.tri(...ps.reverse().map(p=>[x0,p[1],p[0]]));}for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];g.quad([x0,p[1],p[0]],[x1,p[1],p[0]],[x1,q[1],q[0]],[x0,q[1],q[0]]);}mesh(name,g,color);}
 // Six radial strips reach a rectangle but never fill the central aperture.
 const cz=(Z1+END)/2,cy=1.65,r=.40;
 const hex=Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return[cz+Math.cos(a)*r,cy+Math.sin(a)*r]});
 const outer=hex.map(p=>{const dz=p[0]-cz,dy=p[1]-cy,t=Math.min((dz>0?END-cz:cz-Z1)/Math.abs(dz||1e-20),(dy>0?3.02-cy:cy-.64)/Math.abs(dy||1e-20));return[cz+dz*t,cy+dy*t]});
 // Add rectangle corners to each annular sector, preserving its perimeter.
 const corners=[[END,3.02],[Z1,3.02],[Z1,.64],[END,.64]],angle=p=>(Math.atan2(p[1]-cy,p[0]-cz)+Math.PI*2)%(Math.PI*2);
 for(let i=0;i<6;i++){const j=(i+1)%6,a=i*Math.PI/3,end=(i+1)*Math.PI/3;const between=corners.filter(p=>{let t=angle(p);return t>a+1e-8&&t<end-1e-8}).sort((p,q)=>angle(p)-angle(q));slab('pierced-wall-'+i,[hex[i],outer[i],...between,outer[j],hex[j]],X-.12,X+.18,C.wall);}
 group('wall-base',()=>b.box(X+.03,.345,cz,.30,.59,END-Z1,C.base,24));
 group('portal',()=>{for(const z of[Z0+.20,Z1-.20]){b.box(X,.20,z,.45,.40,.45,C.base,24);b.cyl(X,.40,z,.15,2.72,C.red,16,1,6);}for(const[y,h,d,color]of[[3.12,.24,.29,C.red],[3.38,.22,.43,C.blue],[3.57,.16,.53,C.red]])b.box(X,y,(Z0+Z1)/2,d,h,Z1-Z0,color,6);
 // Restrained painted beam framing; tiny source motifs and unreadable text omitted.
 for(const z of[Z0+.25,Z1-.25])b.box(X-.29,3.38,z,.035,.18,.24,C.gold,6);
 b.box(X-.28,3.38,(Z0+Z1)/2,.025,.035,2.60,C.gold,6);
 });
 function roof(name,xa,xb,za,zb,eave,rise){const surface=new G.Geometry(),rolls=new G.Geometry(),ends=new G.Geometry(),mid=(xa+xb)/2,half=(xb-xa)/2;
 const height=(x,z)=>eave+rise*Math.pow(Math.max(0,1-Math.abs((x-mid)/half)),1.38)+.10*Math.pow(Math.abs((z-(za+zb)/2)/((zb-za)/2)),10)*Math.pow(Math.abs((x-mid)/half),3);
 const p=(x,z,offset=0)=>[x,height(x,z)+offset,z];
 for(let side=0;side<2;side++)for(let i=0;i<18;i++)for(let j=0;j<24;j++){const a=xa+side*half+i*half/18,c=a+half/18,v=za+(zb-za)*j/24,w=za+(zb-za)*(j+1)/24;surface.quad(p(a,v),p(a,w),p(c,w),p(c,v));}
 for(let z=za+.03;z<zb-.03;z+=.105)for(let side=0;side<2;side++)for(let i=0;i<18;i++)for(let k=0;k<3;k++){const a=xa+side*half+i*half/18,c=a+half/18,v=z+k*.012,w=v+.012,off=.009+Math.sin((k+.5)*Math.PI/3)*.022;rolls.quad(p(a,v,off),p(a,w,off),p(c,w,off),p(c,v,off));}
 for(const z of[za,zb])for(let i=0;i<36;i++){const a=xa+i*(xb-xa)/36,c=xa+(i+1)*(xb-xa)/36,ps=[[a,eave-.12,z],[c,eave-.12,z],p(c,z),p(a,z)];if(z===za)ps.reverse();ends.quad(...ps);}
 for(const x of[xa,xb])for(let j=0;j<24;j++){const v=za+(zb-za)*j/24,w=za+(zb-za)*(j+1)/24,ps=[[x,eave-.12,v],[x,eave-.12,w],p(x,w),p(x,v)];if(x===xb)ps.reverse();ends.quad(...ps);}
 mesh(name+'-roof',surface,C.roof,19);rolls.detailWidth=.024;mesh(name+'-tile-rolls',rolls,C.tile,19);mesh(name+'-gable',ends,C.roof,19);
 // Keep the underside's vertical faces inside the exterior fascia: coincident
 // box sides and sampled gable skirts caused depth fighting from below.
 group(name+'-soffit',()=>b.box((xa+xb)/2,eave-.045,(za+zb)/2,xb-xa-.03,.09,zb-za-.03,C.blue,6));
 group(name+'-ridge',()=>b.box(mid,eave+rise+.035,(za+zb)/2,.13,.11,zb-za,C.tile,19));
 }
 roof('portal',X-.65,X+1.12,Z0-.10,Z1+.08,3.67,.78);
 roof('wall-cap',X-.23,X+.28,Z1,END,3.02,.22);
 return{id:ID,strategy:'building338-west-portal-v70',bodyHeight:H,roofRise:.90,hiddenInteriorModelled:false,sourceOutline:true,heightMeasured:false,limits:'Only visible west portal and pierced wall reconstructed; full source footprint depth and east interior are unverified and unfilled. Heights and wall alignment are constrained photographic fits.'};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add)};Y.Building338={id:ID,render,aperture:{x:X,z:(Z1+END)/2,y:1.65},portal:{x:X,z:(Z0+Z1)/2,y:1.6}};
})(YY);
