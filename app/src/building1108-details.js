/* Ciji Temple gate, not the university West Gate. Official photographs show
 * chamfered red facade fields within pale stone bands and closed dark eaves.
 * Preserve the original open arch, roof/tile tessellation and inferred anchor. */
(function(Y){'use strict';const previous=Y.Heritage31.render,M=Y.M,G=Y.Geo;
 function soffitClosure(roof,slab,root){const inv=M.inverse(root),rm=M.multiply(inv,roof.m),sm=M.multiply(inv,slab.m),x=sm[12],z=sm[14],hx=Math.hypot(sm[0],sm[1],sm[2])/2,hz=Math.hypot(sm[8],sm[9],sm[10])/2,base=sm[13]+Math.hypot(sm[4],sm[5],sm[6])/2-.002,geo=new G.Geometry(),seen=new Set(),ring=[[x-hx,z-hz],[x+hx,z-hz],[x+hx,z+hz],[x-hx,z+hz],[x-hx,z-hz]];
  for(let i=0;i<roof.g.v.length;i+=24){const vs=[0,8,16].map(k=>M.apply(rm,[...roof.g.v.slice(i+k,i+k+3),1]).slice(0,3));for(let j=1;j<ring.length;j++){const a=ring[j-1],b=ring[j],dx=b[0]-a[0],dz=b[1]-a[1],ll=dx*dx+dz*dz,side=p=>dx*(p[2]-a[1])-dz*(p[0]-a[0]),hits=[];for(let k=0;k<3;k++){const p=vs[k],q=vs[(k+1)%3],dp=side(p),dq=side(q);if(Math.abs(dp)<1e-7)hits.push(p);if(dp*dq<-1e-14){const t=dp/(dp-dq);hits.push(p.map((v,n)=>v+(q[n]-v)*t));}}const ordered=hits.map(p=>({p,t:((p[0]-a[0])*dx+(p[2]-a[1])*dz)/ll})).sort((a,b)=>a.t-b.t);if(ordered.length<2)continue;const lo=ordered[0],hi=ordered.at(-1),s=Math.max(0,lo.t),e=Math.min(1,hi.t);if(e-s<1e-8)continue;const at=t=>[a[0]+dx*t,lo.p[1]+(hi.p[1]-lo.p[1])*(t-lo.t)/(hi.t-lo.t),a[1]+dz*t],p=at(s),q=at(e),key=[p,q].map(p=>p.map(v=>v.toFixed(6)).join(',')).sort().join('|');if(seen.has(key))continue;seen.add(key);if(Math.min(p[1],q[1])<=base)continue;
   // Positive plan ring: reverse to make each vertical strip face outwards.
   const ps=[[q[0],base,q[2]],[p[0],base,p[2]],p,q];for(const ids of[[0,1,2],[0,2,3]]){const t=ids.map(k=>ps[k].map((v,n)=>Math.fround(v-sm[12+n])));if(Math.hypot(...M.cross(M.sub(t[1],t[0]),M.sub(t[2],t[0])))<1e-9)continue;geo.tri(...t,t.map(v=>[Math.abs(dx)>Math.abs(dz)?v[0]:v[2],v[1]]));}
  }}return {geo,centre:[sm[12],sm[13],sm[14]],ring,base};
 }
 function panels(b,w,d){const rim='#c7c5b5',g=new G.Geometry(),edge=w/2-.205,lower=1.15,upper=4.425,cut=.36;
  for(const face of[1])for(const side of[-1,1])for(const upperCorner of[false,true]){const y=upperCorner?upper:lower,dy=upperCorner?-cut:cut,ps=[[side*edge,y,face*(d/2+.071)],[side*(edge-cut),y,face*(d/2+.071)],[side*edge,y+dy,face*(d/2+.071)]];if(M.cross(M.sub(ps[1],ps[0]),M.sub(ps[2],ps[0]))[2]*face<0)ps.reverse();g.tri(...ps,ps.map(p=>[p[0],p[1]]));}
  b.mesh('1108-pale-chamfer-corners',g,0,0,0,1,1,1,rim,10,.67);
  // Join the photographed front strips to the existing base and frieze.
  for(const side of[-1,1])for(const face of[1])for(const [lo,hi]of[[1.14,1.575],[4.225,4.425]])b.box(side*(w/2-.115),(lo+hi)/2,face*(d/2+.02),.18,hi-lo,.10,rim,10,.66);
  // The photographed side panel also has pale vertical boundary bands.
  for(const side of[1])for(const edge of[-1,1])b.box(side*(w/2+.012),2.7825,edge*(d/2-.10),.10,3.285,.20,rim,10,.66);
 }
 Y.Heritage31.render=function(b,f){if(f.properties.pickId!==1108||f.properties.id!=='heritage/temple-gate')return previous.call(this,b,f);const method=b.lakeTempleGate,owned=Object.prototype.hasOwnProperty.call(b,'lakeTempleGate');
  b.lakeTempleGate=function(p,w,d){const add=this.e.add,root=M.transform([...this.origin],[1,1,1],this.rotation);let roof,slab;this.e.add=function(k,g,m,c,a,uv){if(k==='v9-roof-hipgable')roof={g,m:Array.from(m)};if(k==='box'&&c==='#464b46'&&a[0]===20)slab={g,m:Array.from(m),c};return add.call(this,k,g,m,c,a,uv);};try{method.call(this,p,w,d);}finally{this.e.add=add;}
   if(roof&&slab){const seal=soffitClosure(roof,slab,root);if(seal.geo.v.length)this.mesh('1108-original-roof-soffit-contact',seal.geo,...seal.centre,1,1,1,slab.c,20,1.92);}panels(this,w,d);
  };try{return previous.call(this,b,f);}finally{if(owned)b.lakeTempleGate=method;else delete b.lakeTempleGate;}
 };
 Y.Building1108Details={soffitClosure};
})(YY);
