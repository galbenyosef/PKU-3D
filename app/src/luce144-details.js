/* Luce Pavilion only. The official photograph shows a tall stone finial with
 * a lower neck and rounded shoulder. Profile dimensions are fitted, not surveyed.
 * Replace after the legacy adapter so its fitted scale and every roof tile stay
 * unchanged. The entrance face still needs independent compass registration. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,key='luce144-stone-finial';
const profile=[[.61,-.035],[.61,.045],[.34,.115],[.265,.19],[.32,.27],[.365,.43],[.37,.66],[.33,.90],[.25,1.055],[.125,1.115],[.065,1.12],[.065,1.20],[0,1.24]];
function geometry(){const g=new Y.Geo.Geometry(),N=64;
 const at=(i,j)=>{const[r,y]=profile[i],a=j*Math.PI*2/N;return[r*Math.cos(a)/.22,(y-.37)/.22,r*Math.sin(a)/.22];};
 for(let i=0;i<profile.length-1;i++)for(let j=0;j<N;j++){
  if(i===profile.length-2)g.tri(at(i,j+1),at(i,j),at(i+1,j));
  else g.quad(at(i,j+1),at(i,j),at(i+1,j),at(i+1,j+1));
 }
 return g;
}
A.render=function(b,f,...args){
 if(f.properties.id!=='way/272349096'||f.properties.pickId!==144)return previous.call(this,b,f,...args);
 const add=b.e.add;
 b.e.add=function(k,g,m,c,p,uv){
  if(p[1]===144&&k==='v30-cyl12_0.75'&&c==='#777b6f'&&Math.abs(p[3]-2.18)<1e-8)return;
  if(p[1]===144&&k==='v30-sphereSmooth'&&c==='#9a9684'&&Math.abs(p[3]-2.19)<1e-8)return add.call(this,key,b.geo(key,geometry),m,'#aaa48f',p,uv);
  return add.call(this,k,g,m,c,p,uv);
 };
 try{return previous.call(this,b,f,...args);}finally{b.e.add=add;}
};
})(YY);
