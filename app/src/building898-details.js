/* 127: make the existing dark entrance backing conform to its own 24-segment
 * round-arch opening. No door-leaf layout is inferred through the photo's board.
 * Existing arch, jambs, walls, windows and roof are retained byte-for-byte. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,ID='way/916931886';
A.render=function(b,f,add){if(f.properties.id!==ID)return prior.call(this,b,f,add);
 const old=b.box,had=Object.hasOwn(b,'box');let changed=0;
 b.box=function(x,y,z,w,h,d,col,mat,...rest){
 if(Math.abs(x-9.65)>1e-8||Math.abs(y-1.17)>1e-8||Math.abs(z+.075)>1e-8||Math.abs(w-1.72)>1e-8||Math.abs(h-2.28)>1e-8||Math.abs(d-.07)>1e-8||mat!==6)return old.call(this,x,y,z,w,h,d,col,mat,...rest);
 const p=[[x-w/2,y-h/2],[x+w/2,y-h/2]];for(let i=0;i<=24;i++){const a=Math.PI*i/24;p.push([x+.86*Math.cos(a),1.72+.86*Math.sin(a)]);}
 const g=new Y.Geo.Geometry(),uv=q=>[(q[0]-(x-w/2))/w,(q[1]-(y-h/2))/h];
 const tri=(a,c,e)=>g.tri(a,c,e,[uv(a),uv(c),uv(e)]);
 const at=(q,z)=>[q[0],q[1],z],front=z-d/2,back=z+d/2;
 for(let i=0;i<p.length;i++){const a=p[i],c=p[(i+1)%p.length];tri([x,y,front],at(c,front),at(a,front));tri([x,y,back],at(a,back),at(c,back));g.quad(at(a,front),at(c,front),at(c,back),at(a,back));}
 this.mesh('898-arched-entry-backing',g,0,0,0,1,1,1,col,mat);changed++;};
 let r;try{r=prior.call(this,b,f,add);}finally{if(had)b.box=old;else delete b.box;}return{...r,archedBackingCorrected:changed,doorLeafLayoutVerified:false};};
})(YY);
