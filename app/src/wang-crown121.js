/* South crown-band photo fit only: twelve panes, grouped 3+6+3.
 * Unknown side/back divisions and both shoulder caps are retained. */
(function(Y){'use strict';const P=Y.Builder.prototype,previous=P.wangTower30,G=Y.Geo;
const low=72.42,high=73.985,z=14.65,half=13.15,depth=.12,openLow=low+.14,openHigh=high-.12;
const apertures=[],cols=[];let cursor=-half;cols.push([cursor,cursor+1.8]);cursor+=1.8;const width=(26.3-3.6-1.5-9*.17)/12;
for(let i=0;i<12;i++){apertures.push([cursor,cursor+width]);cursor+=width;if(i<11){const w=i===2||i===8?.75:.17;cols.push([cursor,cursor+w]);cursor+=w;}}cols.push([cursor,half]);
P.wangTower30=function(){const box=this.v16box,emit=this.e.add;this.v16box=function(k,x,y,zz,w,h,d,c,mat,part){
 if(k==='v16-wang-shoulder-cap'&&x===0)return box.call(this,k+'-central121',x,(72.325+low)/2,zz,w,low-72.325,d,c,mat,part);
 if(k==='v16-wang-clerestory'){const old=this.e.add;this.e.add=function(key,g,m,col,p,uv){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){if([0,8,16].every(j=>g.v[i+j+5]>.99))continue;let poly=[0,8,16].map(j=>g.v.slice(i+j,i+j+8));if(poly.every(v=>v[4]>.99)){const limit=.5-.15/29.3,q=[];for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length],da=limit-a[2],db=limit-b[2];if(da>=0)q.push(a);if((da>=0)!==(db>=0)){const t=da/(da-db);q.push(a.map((v,j)=>v+(b[j]-v)*t));}}poly=q;}for(let j=1;j<poly.length-1;j++)out.v.push(...poly[0],...poly[j],...poly[j+1]);}return old.call(this,'wang-crown121-retained-clerestory',out,m,col,p,uv);};try{return box.call(this,k,x,y,zz,w,h,d,c,mat,part);}finally{this.e.add=old;}}
 return box.call(this,k,x,y,zz,w,h,d,c,mat,part);
};try{previous.call(this);}finally{this.v16box=box;this.e.add=emit;}
 const g=new G.Geometry(),front=(a,b,c,d)=>g.quad([a,c,z],[b,c,z],[b,d,z],[a,d,z]);
 for(const[a,b]of cols)front(a,b,low,high);for(const[a,b]of apertures){front(a,b,low,openLow);front(a,b,openHigh,high);
 g.quad([a,openLow,z],[a,openLow,z-depth],[a,openHigh,z-depth],[a,openHigh,z]);
 g.quad([b,openLow,z-depth],[b,openLow,z],[b,openHigh,z],[b,openHigh,z-depth]);
 g.quad([a,openLow,z],[b,openLow,z],[b,openLow,z-depth],[a,openLow,z-depth]);
 g.quad([a,openHigh,z-depth],[b,openHigh,z-depth],[b,openHigh,z],[a,openHigh,z]);}
 // Join new end piers to the retained side faces only above/below their old height.
 for(const[a,b]of[[low,72.45],[73.55,high]]){g.quad([-half,a,z-depth],[-half,a,z],[-half,b,z],[-half,b,z-depth]);g.quad([half,a,z],[half,a,z-depth],[half,b,z-depth],[half,b,z]);}
 this.mesh('wang-crown121-stone',g,0,0,0,1,1,1,'#c7c7bc',24,1.7);
 const glass=this.geo('wang-crown121-glass-plane',G.plane),bar=this.geo('wang-crown121-bar-box',()=>{const b=G.box(),g=new G.Geometry();for(let i=0;i<b.v.length;i+=24)if(Math.abs(b.v[i+3])<.99)g.v.push(...b.v.slice(i,i+24));return g;});
 for(const[a,b]of apertures){const mid=(a+b)/2;this.mesh('wang-crown121-glass',glass,mid,(openLow+openHigh)/2,z-depth,b-a,openHigh-openLow,1,'#54656c',28,1.7);
 this.mesh('wang-crown121-low-transom',bar,mid,openLow+(openHigh-openLow)*.29,z-.085,b-a,.055,.055,'#a9b1a8',29,1.7);}
};Y.WangCrown121={low,high,z,half,depth,openLow,openHigh,apertures,columns:cols,scope:'south-only-3+6+3-photo-fit'};
})(YY);
