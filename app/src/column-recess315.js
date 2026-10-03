/* Private helper. Recess envelopes come from checked native scan surfaces. */
(function(Y){'use strict';Y.WillowColumnRecess315=function(cx,patches){const g=new Y.Geo.Geometry(),xmin=cx-.195,xmax=cx+.195,d=.21;
 const xs=[xmin,xmax,...patches.flatMap(p=>[p.left,p.right])].sort((a,b)=>a-b).filter((x,i,a)=>!i||x-a[i-1]>1e-8),ys=[0,3.3,...patches.flatMap(p=>[p.bottom,p.top])].sort((a,b)=>a-b).filter((x,i,a)=>!i||x-a[i-1]>1e-8);
 const quad=(a,b,c,e,n)=>{if(Y.M.dot(Y.M.cross(Y.M.sub(b,a),Y.M.sub(c,a)),n)<0)g.quad(e,c,b,a);else g.quad(a,b,c,e);};
 for(const p of patches)if(!(p.left>xmin&&p.right<xmax&&p.bottom>0&&p.top<3.3&&p.left<p.right&&p.bottom<p.top&&Math.abs(p.back)<d))throw Error('Invalid Willow recess envelope');
 for(let j=1;j<ys.length;j++)for(const x of [xmin,xmax])quad([x,ys[j-1],-d],[x,ys[j],-d],[x,ys[j],d],[x,ys[j-1],d],[x===xmin?-1:1,0,0]);
 for(let i=1;i<xs.length;i++)for(const y of [0,3.3])quad([xs[i-1],y,-d],[xs[i],y,-d],[xs[i],y,d],[xs[i-1],y,d],[0,y===0?-1:1,0]);
 for(const side of [-1,1]){const p=patches.find(p=>p.side===side),z=side*d,n=[0,0,side];
  for(let i=1;i<xs.length;i++)for(let j=1;j<ys.length;j++){const l=xs[i-1],r=xs[i],b=ys[j-1],t=ys[j],inside=p&&(l+r)/2>p.left&&(l+r)/2<p.right&&(b+t)/2>p.bottom&&(b+t)/2<p.top,zz=inside?p.back:z;quad([l,b,zz],[r,b,zz],[r,t,zz],[l,t,zz],n);}
  if(!p)continue;
  for(let j=1;j<ys.length;j++)if(ys[j-1]>=p.bottom-1e-8&&ys[j]<=p.top+1e-8)for(const x of [p.left,p.right])quad([x,ys[j-1],z],[x,ys[j],z],[x,ys[j],p.back],[x,ys[j-1],p.back],[x===p.left?1:-1,0,0]);
  for(let i=1;i<xs.length;i++)if(xs[i-1]>=p.left-1e-8&&xs[i]<=p.right+1e-8)for(const y of [p.bottom,p.top])quad([xs[i-1],y,z],[xs[i],y,z],[xs[i],y,p.back],[xs[i-1],y,p.back],[0,y===p.bottom?1:-1,0]);
 }return g;};})(YY);
