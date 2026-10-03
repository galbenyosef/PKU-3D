/* Laozi: visible front robe folds, crossed lapels and tied sash, fitted to 2006 PKU photo. */
(function(Y){'use strict';const old=Y.Heritage31.render,rows=[[0,.57,.45],[.12,.59,.45],[.30,.49,.37],[.62,.43,.31],[1.10,.40,.28],[1.43,.40,.28],[1.72,.30,.23],[1.81,.17,.15],[1.86,.05,.05]],white='#d1d3c7';
 function profile(y){let i=1;while(i<rows.length-1&&rows[i][0]<y)i++;const p=rows[i-1],q=rows[i],t=(y-p[0])/(q[0]-p[0]);return[p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t];}
 function depth(a,y){const phase=.17+.022*Math.sin((y-.08)/.078*.4),front=Math.max(0,Math.sin(a)),fade=Math.min(1,y/.05)*Math.max(0,Math.min(1,(1.22-y)/.14));return (.035+.035*(1-y/1.22))*front*fade*(1-Math.cos(9*(a-phase)))/2;}
 function point(a,y){const [x,z]=profile(y),r=depth(a,y);return[(x-r)*Math.cos(a),y,(z-r)*Math.sin(a)];}
 function front(x,y){const [rx,rz]=profile(y),a=Math.acos(Math.max(-.999,Math.min(.999,x/rx)));return point(a,y)[2];}
 function ribbon(b,key,path,width){const geo=b.geo(key,()=>{const g=new Y.Geo.Geometry(),pts=[];for(let i=0;i<path.length;i++){const [x,y]=path[i],lo=path[Math.max(0,i-1)],hi=path[Math.min(path.length-1,i+1)],dx=hi[0]-lo[0],dy=hi[1]-lo[1],len=Math.hypot(dx,dy),nx=-dy/len*width/2,ny=dx/len*width/2;pts.push([[-1,1].map(s=>{const X=x+s*nx,H=y+s*ny;return[X,H,front(X,H)+.020];}),[-1,1].map(s=>{const X=x+s*nx,H=y+s*ny;return[X,H,front(X,H)-.012];})]);}
  for(let i=1;i<pts.length;i++){const [a,b]=pts[i-1],[c,d]=pts[i];g.quad(a[0],c[0],c[1],a[1]);g.quad(b[1],d[1],d[0],b[0]);g.quad(a[1],c[1],d[1],b[1]);g.quad(b[0],d[0],c[0],a[0]);}let [a,b]=pts[0];g.quad(a[1],b[1],b[0],a[0]);[a,b]=pts.at(-1);g.quad(a[0],b[0],b[1],a[1]);return g;});b.mesh(key,geo,0,.39,0,1,1,1,white,10);}
 Y.Heritage31.render=function(b,f){if(f.properties.pickId!==1116||f.properties.id!=='node/8190814095')return old.call(this,b,f);
  const prior=b.laozi33,own=Object.prototype.hasOwnProperty.call(b,'laozi33');b.laozi33=function(){
   const emit=this.e.add,box=this.box,ownBox=Object.prototype.hasOwnProperty.call(this,'box'),self=this;
   this.box=function(x,y,z,w,h,d){if(x===0&&y===1.17&&z===.40&&w===.62&&h===.055&&d===.025)return;return box.apply(this,arguments);};
   this.e.add=function(k,g,m,c,p,uv){if(k==='lao34-robe'){
    const key='lao1116-folded-robe';g=self.geo(key,()=>{const g=new Y.Geo.Geometry(),heights=[...new Set([...rows.map(r=>r[0]),...Array.from({length:89},(_,i)=>i*1.86/88)])].sort((a,b)=>a-b),N=96;
     const normal=(a,y)=>{const da=1e-4,dy=1e-5,t=Y.M.sub(point(a+da,y),point(a-da,y)),up=Y.M.sub(point(a,Math.min(1.86,y+dy)),point(a,Math.max(0,y-dy)));return Y.M.norm(Y.M.cross(up,t));};
     for(let j=1;j<heights.length;j++)for(let i=0;i<N;i++){const a=i*Math.PI*2/N,c=(i+1)*Math.PI*2/N,y=heights[j-1],h=heights[j],A=point(a,y),B=point(a,h),C=point(c,h),D=point(c,y);g.tri(A,B,C,[[a,y],[a,h],[c,h]],[normal(a,y),normal(a,h),normal(c,h)]);g.tri(A,C,D,[[a,y],[c,h],[c,y]],[normal(a,y),normal(c,h),normal(c,y)]);}return g;});k=key;
   }return emit.call(this,k,g,m,c,p,uv);};
   let result;try{result=prior.apply(this,arguments);}finally{this.e.add=emit;if(ownBox)this.box=box;else delete this.box;}
   const line=(a,b,n=30)=>Array.from({length:n+1},(_,i)=>a.map((v,k)=>v+(b[k]-v)*i/n));
   ribbon(this,'lao1116-left-cross-lapel',line([-.235,1.68],[.225,1.19]),.060);
   ribbon(this,'lao1116-right-cross-lapel',line([.225,1.66],[-.21,1.20]),.065);
   const curve=knots=>{const pts=[];for(let j=1;j<knots.length;j++)pts.push(...line(knots[j-1],knots[j],14).slice(j===1?0:1));return pts;};
   ribbon(this,'lao1116-front-left-drape',curve([[-.43,.18],[-.33,.30],[-.27,.55],[-.14,.82],[-.045,1.08]]),.075);
   ribbon(this,'lao1116-front-right-drape',curve([[.40,.21],[.32,.27],[.22,.49],[.18,.75],[.055,1.075]]),.070);
   ribbon(this,'lao1116-curved-sash',line([-.35,1.17],[.35,1.17],42),.058);
   this.local(0,.39,0,0,()=>{
    const chain=(pts,r)=>{for(let j=1;j<pts.length;j++)this.beam(pts[j-1],pts[j],r,white,10);};
    for(const side of[-1,1]){const pts=[];for(let i=0;i<=24;i++){const a=Math.PI*2*i/24,x=side*(.041+.043*Math.sin(a)),y=1.11+.057*Math.cos(a);pts.push([x,y,front(x,y)+.033]);}chain(pts,.014);const tail=[];for(let j=0;j<=16;j++){const t=j/16,x=side*(.025+.027*t+.008*Math.sin(t*5)),y=1.075-.25*t;tail.push([x,y,front(x,y)+.025]);}chain(tail,.014);}
    this.sphere(0,1.158,front(0,1.158)+.032,.035,.027,.025,white,10,0,true);
   });return result;
  };try{return old.call(this,b,f);}finally{if(own)b.laozi33=prior;else delete b.laozi33;}
 };
})(YY);
