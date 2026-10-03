/* Jiayuan east circulation frontage, fitted to PKU's 2020 opening photographs.
 * The south-to-east corner photograph registers the two pale balcony bands and
 * crossing escalator flights. Dimensions, bays and leaf subdivisions are fitted;
 * no interior machinery, lift shaft or unseen back-of-house is reconstructed. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M,ID='way/444894329';
// Freeze the pre-edit source fitting envelope: removing the obsolete east
// canopy must not rescale or translate the preserved south/north/west geometry.
const adapter=Y.ArchitectureAdapter,adapterRender=adapter.render;
adapter.render=function(b,f,method,source,options={}){if(f.properties.id===ID)options={...options,sourceFrame:{centre:[0,3.33750000037253],w:96.5,d:85.92500000074506}};return adapterRender.call(this,b,f,method,source,options);};
function subtract(a,c){const l=a.slice(0,3).map((v,i)=>Math.max(v,c[i])),h=a.slice(3).map((v,i)=>Math.min(v,c[i+3]));if(l.some((v,i)=>v>=h[i]))return[a];const out=[];let b=[...a];for(let k=0;k<3;k++){if(b[k]<l[k]){const q=[...b];q[k+3]=l[k];out.push(q);b[k]=l[k];}if(b[k+3]>h[k]){const q=[...b];q[k]=h[k];out.push(q);b[k+3]=h[k];}}return out;}
function cutBoxes(geo,cut){const mesh=new G.Geometry(),unit=G.box();if(geo.v.length%288)throw new Error('Jiayuan east expects existing box-union body');for(let j=0;j<geo.v.length;j+=288){const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];for(let i=j;i<j+288;i+=8)for(let k=0;k<3;k++){lo[k]=Math.min(lo[k],geo.v[i+k]);hi[k]=Math.max(hi[k],geo.v[i+k]);}for(const b of subtract([...lo,...hi],cut)){const m=M.transform([0,1,2].map(k=>(b[k]+b[k+3])/2),[0,1,2].map(k=>b[k+3]-b[k]),0);for(let i=0;i<unit.v.length;i+=8){const p=M.apply(m,[...unit.v.slice(i,i+3),1]);mesh.vertex(p.slice(0,3),unit.v.slice(i+3,i+6),unit.v.slice(i+6,i+8));}}}return mesh;}
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);const owned=Object.hasOwn(b,'jiayuan'),original=b.jiayuan;
 b.jiayuan=function(w=87.5,d=77.5){const saved=['mesh','window','box'].map(k=>[k,Object.hasOwn(this,k),this[k]]),mesh=this.mesh,win=this.window,box=this.box,edge=w/2,half=d*.36,back=edge-5.7,ground=.12,levels=[ground,6.0,11.4],head=17.1,east=()=>Math.abs(this.origin[0]-edge)<1e-5&&Math.abs(this.rotation-Math.PI/2)<1e-5;
 this.mesh=function(key,g,...args){if(/^jiayuan181-portal-(wall|base)/.test(key))return mesh.call(this,key+'-east223',cutBoxes(g,[back,0,-half,edge+1,head,half]),...args);return mesh.call(this,key,g,...args);};
 this.window=function(...args){if(east())return;return win.apply(this,args);};
 this.box=function(x,y,z,ww,h,dd,...args){if(east()&&x===0&&y===4.2&&z===2&&h===.23&&dd===5)return;return box.call(this,x,y,z,ww,h,dd,...args);};
 try{original.call(this,w,d);}finally{for(const[k,own,fn]of saved)if(own)this[k]=fn;else delete this[k];}
 // Work in the same legacy metre frame; the existing adapter retains the
 // registered footprint/scale and clips projecting source geometry as before.
 const old=this.e.add;this.e.add=function(k,...args){return old.call(this,'jiayuan181-east223-'+k,...args);};
 try{const pale='#c7c8bf',dark='#3b4847',stone='#b2b7ad',bay=half/2,depth=edge-back;
 // The south landing stays unchanged. This floor is only the east recess.
 for(const y of [...levels,head]){const slab=[back,y===ground?0:y-.24,-half,edge,y,half],parts=y===ground||y===head?[slab]:subtract(slab,[edge-4.3,y-.25,-7.6,edge-.9,y+.01,7.6]);for(const q of parts)this.box((q[0]+q[3])/2,(q[1]+q[4])/2,(q[2]+q[5])/2,q[3]-q[0],q[4]-q[1],q[5]-q[2],stone,24);}
 // Five piers establish four bays, fitted to the visible repeated divisions.
 for(let i=0;i<=4;i++){const z=-half+i*bay;this.box(edge-.28,head/2,z,.56,head,.72,'#a8aaa4',1);this.box(edge-.285,.85,z,.58,1.7,.76,pale,24);}
 for(const y of levels.slice(1)){
  this.box(edge-.30,y+.67,0,.20,1.34,half*2,pale,24);
  this.box(edge-.29,y+1.39,0,.28,.10,half*2,'#717d77',9);
 }
 // Recessed panes are separated from the retained back wall; fitted paired
 // leaves occupy each ground bay. Upper panes remain fixed glazing.
 const plane=back+.22;
 for(let i=0;i<4;i++){const z=-half+(i+.5)*bay,wz=bay-.84;
  for(let floor=0;floor<3;floor++){const y0=levels[floor]+.08,y1=levels[floor]+4.0,h=y1-y0;
   if(floor===0){const leaf=1.25,doorTop=levels[0]+3.15,sideWidth=wz/2-leaf;
    for(const sign of[-1,1]){
     this.box(plane,(y0+doorTop)/2,z+sign*leaf/2,.07,doorTop-y0-.10,leaf-.10,'#546c76',5);
     this.box(plane,(y0+doorTop)/2,z+sign*(leaf+sideWidth/2),.07,doorTop-y0-.10,sideWidth-.10,'#546c76',5);
     for(const zz of[z+sign*leaf,z+sign*wz/2,z+sign*(leaf+sideWidth/2)])this.box(plane+.06,(y0+doorTop)/2,zz,.10,doorTop-y0,.08,dark,9);
     for(const yy of[y0,doorTop])this.box(plane+.06,yy,z+sign*leaf/2,.12,.10,leaf,dark,9);
    }
    this.box(plane+.06,(y0+doorTop)/2,z,.12,doorTop-y0,.08,dark,9);
    this.box(plane,(doorTop+y1)/2,z,.07,y1-doorTop-.10,wz-.08,'#546c76',5);
    for(const yy of[doorTop,y1])this.box(plane+.06,yy,z,.10,.08,wz,dark,9);
    this.box(plane+.09,(ground+y0)/2,z,.32,y0-ground,wz,stone,24);
   }else{
    this.box(plane,(y0+y1)/2,z,.07,h,wz,'#546c76',5);
    for(const zz of[z-wz/2,z,z+wz/2])this.box(plane+.06,(y0+y1)/2,zz,.10,h,.08,dark,9);
    for(const yy of[y0,y1,y1-.85])this.box(plane+.06,yy,z,.10,.08,wz,dark,9);
   }
  }
 }
 // Two depth-separated visible flights per storey. Their crossing appearance
 // is an exterior fit; enclosed machinery and interiors are intentionally absent.
 const prism=(run,rise,lo,hi,thick)=>{const g=new G.Geometry(),p=[[-thick/2,lo,0],[thick/2,lo,0],[thick/2,hi,0],[-thick/2,hi,0],[-thick/2,rise+lo,run],[thick/2,rise+lo,run],[thick/2,rise+hi,run],[-thick/2,rise+hi,run]],centre=[0,rise/2+(lo+hi)/2,run/2];for(const indices of[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]]){const q=indices.map(i=>p[i]),n=M.cross(M.sub(q[1],q[0]),M.sub(q[2],q[0])),fc=[0,1,2].map(k=>q.reduce((s,v)=>s+v[k],0)/4);if(M.dot(n,M.sub(fc,centre))<0)q.reverse();g.quad(...q);}return g;};
 const flight=(x,z0,z1,y0,y1)=>{const n=24,width=1.15,run=Math.abs(z1-z0),step=run/n,sign=Math.sign(z1-z0),rise=y1-y0;for(let k=0;k<n;k++){const t=(k+.5)/n,y=y0+rise*(k+1)/n,bottom=Math.max(y0-.02,y0+rise*k/n-.30);this.box(x,(y+bottom)/2,z0+(z1-z0)*t,width,y-bottom,step+.008,'#89928d',9);}
  for(const end of[[z0-sign*.35,y0],[z1+sign*.35,y1]])this.box(x,end[1]-.035,end[0],width,.07,.70,'#89928d',9);
  for(const side of[-1,1]){const xx=x+side*(width/2+.04),key=rise+'-'+(z1-z0);
   this.mesh('escalator-skirt-'+key,prism(z1-z0,rise,-.22,.43,.08),xx,y0,z0,1,1,1,'#a7afaa',9);
   this.mesh('escalator-balustrade-'+key,prism(z1-z0,rise,.43,.93,.045),xx,y0,z0,1,1,1,'#718580',5);
   this.beam([xx,y0+.98,z0],[xx,y1+.98,z1],.085,'#303a38',9);
   this.beam([xx,y0+.98,z0-sign*.7],[xx,y0+.98,z0],.085,'#303a38',9);
   this.beam([xx,y1+.98,z1],[xx,y1+.98,z1+sign*.7],.085,'#303a38',9);
  }
 };
 for(let floor=0;floor<2;floor++){flight(edge-1.55,-7,7,levels[floor],levels[floor+1]);flight(edge-3.55,7,-7,levels[floor],levels[floor+1]);}
 }finally{this.e.add=old;}
 };
 try{return prior.call(this,b,f,add);}finally{if(owned)b.jiayuan=original;else delete b.jiayuan;}
};Y.Jiayuan181East223={id:ID,subtract,cutBoxes};})(YY);
