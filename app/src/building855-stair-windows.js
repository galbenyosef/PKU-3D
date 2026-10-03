/* Three observed north stair-window columns; diameters/stations remain aerial fits.
 * Keep building132's six floors, original ring, flat roof and east wall correction. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/849765888';
function columns(f){const ring=f.geometry.coordinates[0],sign=Y.Footprints.area(ring)>0?1:-1;return [[5,1],[8,2],[8,7]].map(([i,k])=>{const a=ring[i],c=ring[i+1],l=Math.hypot(c[0]-a[0],c[1]-a[1]),ux=(c[0]-a[0])/l,uz=(c[1]-a[1])/l,nx=uz*sign,nz=-ux*sign,count=Math.floor(l/3.6),t=(k+.5)*l/count;return [a[0]+ux*t+nx*.045,a[1]+uz*t+nz*.045];});}
function circular(b,x,y,z,r){b.local(x,y,z,r,()=>{const ringKey='building855-round-stair-surround',glassKey='building855-round-stair-glass',N=64;
 const g=b.geo(ringKey,()=>{const g=new Y.Geo.Geometry(),pt=(a,R,z)=>[Math.cos(a)*R,Math.sin(a)*R,z];for(let i=0;i<N;i++){const a=i*2*Math.PI/N,c=(i+1)*2*Math.PI/N;g.quad(pt(a,.34,.065),pt(c,.34,.065),pt(c,.26,.065),pt(a,.26,.065));g.quad(pt(a,.26,.004),pt(c,.26,.004),pt(c,.34,.004),pt(a,.34,.004));g.quad(pt(a,.34,.004),pt(c,.34,.004),pt(c,.34,.065),pt(a,.34,.065));g.quad(pt(a,.26,.065),pt(c,.26,.065),pt(c,.26,.004),pt(a,.26,.004));}return g;});
 b.mesh(ringKey,g,0,0,0,1,1,1,'#dedfd7',24,.7);
 const glass=b.geo(glassKey,()=>{const g=new Y.Geo.Geometry();for(let i=0;i<N;i++){const a=i*2*Math.PI/N,c=(i+1)*2*Math.PI/N;g.tri([0,0,.012],[Math.cos(a)*.261,Math.sin(a)*.261,.012],[Math.cos(c)*.261,Math.sin(c)*.261,.012]);}return g;});b.mesh(glassKey,glass,0,0,0,1,1,1,'#546f71',5,.7);
 });}
A.render=function(b,f,add){if(f.properties.id!==ID)return previous(b,f,add);const points=columns(f),window=b.window,lowestTop=.55+(f.properties.height-.55)/6;let replaced=0;
 b.window=function(x,y,z,w,h,r,...rest){if(y>lowestTop&&points.some(p=>Math.hypot(x-p[0],z-p[1])<.001)){replaced++;return circular(this,x,y,z,r);}return window.call(this,x,y,z,w,h,r,...rest);};
 try{const result=previous(b,f,add);return {...result,observedNorthCircularWindows:replaced,entranceVerified:false};}finally{b.window=window;}
};
})(YY);
