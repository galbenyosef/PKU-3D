/* Weili volume correction: NZ Centre 'Our Work' named Weili image and
 * opposite oblique exterior show two storeys. Wall height 7.5m is a photo fit,
 * not a survey. Existing roof profile/detail is translated upward intact.
 * South entrance registered by named photograph and east-side link geometry.
 * Door dimensions and five modeled risers are photographic fits, not measured counts. */
(function(Y){'use strict';const A=Y.Architecture30,F=Y.Footprints,G=Y.Geo,previous=A.render,ID='way/568727714';
function shouren(b,f,add){const p=f.properties,g=f.geometry,id=p.pickId,fr=Y.ArchitectureAdapter.frame(g),cs=Math.cos(fr.r),sn=Math.sin(fr.r),across=fr.w>=fr.d?1:0,width=Math.min(fr.w,fr.d),body=7.5;
 const ring=g.coordinates[0],ea=ring[2],eb=ring[3],el=Math.hypot(eb[0]-ea[0],eb[1]-ea[1]),ux=(eb[0]-ea[0])/el,uz=(eb[1]-ea[1])/el,origin=[ea[0]+ux*12.2,ea[1]+uz*12.2],angle=Math.atan2(-uz,ux),frontAngle=angle+Math.PI;
 const profile=q=>{const v=[cs*(q[0]-fr.centre[0])-sn*(q[1]-fr.centre[1]),sn*(q[0]-fr.centre[0])+cs*(q[1]-fr.centre[1])][across],t=Math.max(0,1-Math.abs(v)/(width/2));return body+2.85*Math.sin(Math.PI/2*Math.pow(t,1.3));};
 function entranceWall(){const mesh=F.walls(g,.55,body),out=new G.Geometry();for(let i=0;i<mesh.v.length;i+=24){const south=[0,8,16].every(j=>Math.abs((mesh.v[i+j]-ea[0])*uz-(mesh.v[i+j+2]-ea[1])*ux)<.002);if(!south)out.v.push(...mesh.v.slice(i,i+24));}const pt=(t,y)=>[ea[0]+ux*t,y,ea[1]+uz*t],quad=(a,b,lo,hi)=>out.quad(pt(b,lo),pt(a,lo),pt(a,hi),pt(b,hi));quad(0,11.02,.55,body);quad(13.38,el,.55,body);quad(11.02,13.38,.55,.82);quad(11.02,13.38,3.35,body);return out;}
 add('shouren43-plinth-'+id,F.walls(g,.04,.55),'#989e92',10,id);add('shouren43-grey-brick-'+id,entranceWall(),'#969b91',18,id);add('shouren43-coiled-roof-'+id,F.profiledSurface(g,profile,.5),'#70766d',19,id);
 const ends=new G.Geometry();b.id=id;
 for(const pg of F.polygons(g))for(const ring of pg){const sign=F.area(ring)>0?1:-1;for(let i=1;i<ring.length;i++){const a=ring[i-1],c=ring[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,nx=uz*sign,nz=-ux*sign,steps=Math.max(1,Math.ceil(len/.5));
  for(let j=0;j<steps;j++){const q=[a[0]+ux*len*j/steps,a[1]+uz*len*j/steps],r=[a[0]+ux*len*(j+1)/steps,a[1]+uz*len*(j+1)/steps];ends.quad([q[0],body,q[1]],[r[0],body,r[1]],[r[0],profile(r),r[1]],[q[0],profile(q),q[1]]);if(len<width*1.4)b.beam([q[0],profile(q)+.015,q[1]],[r[0],profile(r)+.015,r[1]],.06,'#bbc0b3',10);}
  if(len>width*1.4){b.beam([a[0],body-.12,a[1]],[c[0],body-.12,c[1]],.20,'#565e53',10);b.beam([a[0],body-.38,a[1]],[c[0],body-.38,c[1]],.16,'#744837',6);}if(len>width*1.4)for(let t=2;t<len-1;t+=3.4){const x=a[0]+ux*t+nx*.09,z=a[1]+uz*t+nz*.09;for(const y of[2.15,5.45])if(!(a===ring[2]&&Math.abs(t-12.2)<.01&&y<3))b.v9Lattice(x,y,z,2.1,2.35,Math.atan2(nx,nz),false);}
 }}add('shouren43-hard-gable-'+id,ends,'#9a9d91',18,id);
 const box=(key,x,y,z,w,h,d,c,m)=>b.mesh('weili199-'+key,b.geo('weili199-'+key,G.box),x,y,z,w,h,d,c,m);
 b.local(origin[0],0,origin[1],frontAngle,()=>{
  box('landing',0,.42,.25,3.0,.8,.9,'#a6aca0',10);
  // Five shallow fitted risers; the small reference does not establish a measured count.
  for(let i=0;i<5;i++){const top=.02+.16*(5-i);box('step',0,(top+.01)/2,.86+i*.32,3.0,top-.01,.32,'#adb2a6',10);}
  box('paved-apron',0,.035,2.90,3.4,.05,1.2,'#b2b7ab',10);
  box('door-threshold',0,.79,-.10,2.36,.06,.4,'#a4aa9d',10);
  for(const x of[-.57,.57]){box('door-leaf',x,2.03,-.18,1.10,2.42,.065,'#39453b',28);box('door-panel',x,1.17,-.13,1.02,.66,.075,'#743b2c',6);for(const d of[-.535,.535])box('door-stile',x+d,2.03,-.11,.06,2.42,.075,'#793c2c',6);for(const y of[.87,1.53,3.22])box('door-rail',x,y,-.105,1.12,.065,.08,'#793c2c',6);}
  for(const x of[-1.18,1.18])box('door-jamb',x,2.085,-.13,.09,2.53,.36,'#929a8d',10);
  box('door-meeting-stile',0,2.03,-.105,.035,2.42,.08,'#793c2c',6);
  box('door-upper-light',0,3.295,-.18,2.30,.11,.065,'#39453b',28);
  box('door-head',0,3.35,-.13,2.45,.10,.36,'#929a8d',10);
  box('canopy',0,3.71,.68,3.5,.20,1.65,'#a8aea1',10);
  for(const x of[-1.22,1.22]){const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'weili199-brace-'+k,...args);};try{b.beam([x,3.05,.06],[x,3.61,1.18],.10,'#949d8c',10);}finally{b.e.add=old;}}
 });
 return{strategy:'weili199-two-storey-volume',sourceOutline:true,floors:2,entranceRegistered:true};}
A.render=function(b,f,add){return f.properties.id===ID?shouren(b,f,add):previous(b,f,add);};
const f=Y.CAMPUS.features.find(f=>f.properties.id===ID);if(f){f.properties.height=10.35;f.properties.floors=2;f.properties.heightSource='具名外观照片两层比例拟合，非实测';f.properties.frontAngle46=.06522232487687138;}
Y.Weili199Volume={id:ID,body:7.5,roofRise:2.85,windowRows:[2.15,5.45],entranceRegistered:true,doorOrigin:[32.876939907591336, -20.645851670175443],doorAngle:0.06522232487687138};
})(YY);
