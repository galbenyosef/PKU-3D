/* East-library doorway only. Existing photographed panes/bronze divisions stay
 * fixed. The finite vestibule depth is a display fit, not an interior survey. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo;
const S={half:6.46,bottom:.6,top:6.455,back:12.8,front:15.09};
function half(poly,axis,value,sign){const yes=[],no=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=(a[axis]-value)*sign,db=(b[axis]-value)*sign;(da>=0?yes:no).push(a);if(da*db<0){const t=da/(da-db),p=a.map((v,k)=>v+(b[k]-v)*t);yes.push(p);no.push(p);}}return{yes,no};}
function cut(g,lo,hi){const out=new G.Geometry();for(let i=0;i<g.v.length;i+=24){let rest=[0,8,16].map(j=>Array.from(g.v.slice(i+j,i+j+8))),parts=[];for(let k=0;k<3;k++)for(const[v,s]of[[lo[k],1],[hi[k],-1]]){if(rest.length<3)continue;const q=half(rest,k,v,s);if(q.no.length>=3)parts.push(q.no);rest=q.yes;}for(const p of parts)for(let j=1;j+1<p.length;j++)out.v.push(...p[0],...p[j],...p[j+1]);}if(g.detailWidth!==undefined)out.detailWidth=g.detailWidth;return out;}
function face(g,ps,n){const cross=Y.M.cross(Y.M.sub(ps[1],ps[0]),Y.M.sub(ps[2],ps[0]));if(Y.M.dot(cross,n)<0)ps.reverse();g.quad(...ps);}
function cavity(g,lo,hi,back=true,floor=true){const[x,y,z]=lo,[X,H,Z]=hi;
 if(floor)face(g,[[x,y,z],[X,y,z],[X,y,Z],[x,y,Z]],[0,1,0]);
 face(g,[[x,H,z],[x,H,Z],[X,H,Z],[X,H,z]],[0,-1,0]);
 face(g,[[x,y,z],[x,y,Z],[x,H,Z],[x,H,z]],[1,0,0]);
 face(g,[[X,y,z],[X,H,z],[X,H,Z],[X,y,Z]],[-1,0,0]);
 if(back)face(g,[[x,y,z],[x,H,z],[X,H,z],[X,y,z]],[0,0,1]);
}
A.render=function(b,f,add){if(f.properties.pickId!==1||f.properties.id!=='relation/3249649')return prior.call(this,b,f,add);
 const old=b.libraryEast;let bodies=0,rings=0,neighbours=0,thresholds=0;
 b.libraryEast=function(...args){const emit=this.e.add,window=this.libWindow;let sideWindow=0;this.libWindow=function(x,y,z,...args){const saved=sideWindow;sideWindow=Math.abs(x)===10&&y===3.73&&z===15.10?Math.sign(x):0;try{return window.call(this,x,y,z,...args);}finally{sideWindow=saved;}};this.e.add=function(k,g,m,c,p,uv){
  const at=(x,y,z,w,h,d)=>Math.abs(m[12]-x)<1e-5&&Math.abs(m[13]-y)<1e-5&&Math.abs(m[14]-z)<1e-5&&Math.abs(m[0]-w)<1e-5&&Math.abs(m[5]-h)<1e-5&&Math.abs(m[10]-d)<1e-5;
  if(k==='box'&&c==='#b3b2a8'&&p[0]===10&&p[3]===.5&&at(0,13.22,-5,50,25.44,40)){
   // The retained ground57 central plinth already supplies y=.6 throughout
   // the recess. Do not overlay a second upward floor on that exact plane.
   bodies++;const local=q=>q.map((v,i)=>(v-m[12+i])/m[i*5]),lo=local([-S.half,S.bottom,S.back]),hi=local([S.half,S.top,S.front]);const out=cut(g,lo,hi);cavity(out,lo,hi,true,false);return emit.call(this,'library-east-door160-body',out,m,c,p,uv);
  }
  if(k==='box'&&c==='#675344'&&p[0]===20&&(p[3]===.64||p[3]===.67)&&Math.abs(m[14]-15.18)<1e-5){
   const lower=p[3]===.64,width=m[0]-(lower?.225:.235),bottom=lower?1.6:5.04,top=lower?4.66:6.235;
   const lo=[-width/(2*m[0]),(bottom-m[13])/m[5],-.5],hi=[width/(2*m[0]),(top-m[13])/m[5],.5],out=cut(g,lo,hi);cavity(out,lo,hi,false);
   return emit.call(this,'library-east-door160-ring-'+rings++,out,m,c,p,uv);
  }
  if(k==='box'&&c==='#a49c8c'&&p[0]===9&&p[3]===.70&&Math.abs(m[14]-15.32)<1e-5){
   const out=new G.Geometry(),low=(S.bottom-m[13])/m[5];out.v=Array.from(g.v);for(let i=0;i<out.v.length;i+=8)if(out.v[i+1]<0)out.v[i+1]=low;
   return emit.call(this,'library-east-door160-threshold-'+thresholds++,out,m,c,p,uv);
  }
  if(sideWindow&&k==='box'){
   const sign=sideWindow,edge=(sign*S.half-m[12])/m[0],low=m[12]-m[0]/2,high=m[12]+m[0]/2;
   if(sign>0?low<S.half:high>-S.half){neighbours++;if(sign>0?high<=S.half:low>=-S.half)return;
    const lo=[sign>0?-2:edge,-2,-2],hi=[sign>0?edge:2,2,2],out=cut(g,lo,hi);
    face(out,[[edge,-.5,-.5],[edge,.5,-.5],[edge,.5,.5],[edge,-.5,.5]],[-sign,0,0]);
    return emit.call(this,'library-east-door160-neighbour-'+neighbours,out,m,c,p,uv);
   }
  }
  return emit.call(this,k,g,m,c,p,uv);
 };try{return old.apply(this,args);}finally{this.e.add=emit;this.libWindow=window;}};
 let result;try{result=prior.call(this,b,f,add);}finally{b.libraryEast=old;}
 if(bodies!==1||rings!==16||thresholds!==8)throw Error('Library east door160 source changed: '+bodies+'/'+rings);
 return result;
};Y.LibraryEastDoor160=S;
})(YY);
