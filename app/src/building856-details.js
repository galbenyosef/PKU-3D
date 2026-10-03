/* Match the existing north arched entries to their already registered arches.
 * Retain fitted door positions/style; unseen leaves and rear openings unknown. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo,M=Y.M;
 function solid(outline,z0,z1){const out=new G.Geometry(),flat=G.polygon(outline);
  for(let i=0;i<flat.v.length;i+=24){const p=[0,8,16].map(k=>[flat.v[i+k],flat.v[i+k+2]]);for(const z of[z0,z1]){const q=p.map(v=>[v[0],v[1],z]);if(z===z1)q.reverse();out.tri(...q,q.map(v=>[v[0]+.5,v[1]+.5]));}}
  const area=outline.reduce((s,p,i)=>s+p[0]*outline[(i+1)%outline.length][1]-outline[(i+1)%outline.length][0]*p[1],0);
  for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length],q=[[a[0],a[1],z1],[a[0],a[1],z0],[b[0],b[1],z0],[b[0],b[1],z1]];if(area<0)q.reverse();out.quad(...q);}return out;
 }
 A.render=function(b,f,add){if(f.properties.pickId!==856||f.properties.id!=='way/849765889')return prior.call(this,b,f,add);
  const emit=b.e.add,entries=new Map();b.e.add=function(k,g,m,c,p,uv){let match;
   if((match=/^133-north-entry-(\d+)-glass-box$/.exec(k))){entries.set(match[1],Array.from(m));const shape=[[-.5,-.5],[.5,-.5]];for(let i=0;i<=40;i++){const x=.81-1.62*i/40,y=1.6+Math.sqrt(.85*.85-x*x);shape.push([x/1.62,(y-1.08)/2.04]);}g=b.geo('856-arched-door-glass',()=>solid(shape,-.5,.5));k='856-entry-'+match[1]+'-arched-glass';}
   else if((match=/^133-north-entry-(\d+)-horizontal-box$/.exec(k))&&m[13]>2){
    const src=entries.get(match[1]);if(src){const shape=[],lo=Math.acos(.81/.85),hi=Math.PI-lo;
     for(let i=0;i<=40;i++){const a=lo+(hi-lo)*i/40;shape.push([.8775*Math.cos(a)/1.72,(1.6+.8775*Math.sin(a)-2.10)/.055]);}
     for(let i=40;i>=0;i--){const a=lo+(hi-lo)*i/40;shape.push([.8225*Math.cos(a)/1.72,(1.6+.8225*Math.sin(a)-2.10)/.055]);}
     g=b.geo('856-arched-door-head',()=>solid(shape,-.5,.5));k='856-entry-'+match[1]+'-arched-head';}
   }else if((match=/^133-north-entry-(\d+)-vertical-box$/.exec(k))){const src=entries.get(match[1]);if(src){const ux=src[0]/1.62,uz=src[2]/1.62,dx=(m[12]-src[12])*ux+(m[14]-src[14])*uz,top=1.6+Math.sqrt(Math.max(0,.85*.85-dx*dx)),bottom=.01;m=new Float32Array(m);m[5]=top-bottom;m[13]=(top+bottom)/2;k='856-entry-'+match[1]+'-fitted-jamb';}}
   return emit.call(this,k,g,m,c,p,uv);
  };try{return prior.call(this,b,f,add);}finally{b.e.add=emit;}
 };
})(YY);
