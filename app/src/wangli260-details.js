/* Yannan60 / Wang Li residence. The university's dated 2003 south photograph
 * shows a continuous hipped roof and two paired sets of upper windows.
 * Preserve the inherited adapter fit and unseen elevations. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/866277595',PICK=260,omitPart=9.260;
A.render=function(b,f,add){if(f.properties.id!==ID||f.properties.pickId!==PICK)return previous.call(this,b,f,add);
 const priorAdd=b.e.add,methods=['heritage66','heritageDormer','heritageWindow'],saved=methods.map(k=>[k,Object.hasOwn(b,k),b[k]]);let width=0;
 b.e.add=function(k,g,m,c,p,uv){if(p[3]!==omitPart)return priorAdd.call(this,k,g,m,c,p,uv);};
 b.heritage66=function(p,w,d){width=w;return saved[0][2].call(this,p,w,d);};
 // Keep these records in the adapter's measured source bounds, then remove only
 // their final output. Removing them before fitting would rescale the whole house.
 b.heritageDormer=function(...args){const emit=this.e.add;this.e.add=function(k,g,m,c,p,uv){return emit.call(this,k,g,m,c,[...p.slice(0,3),omitPart],uv);};try{return saved[1][2].apply(this,args);}finally{this.e.add=emit;}};
 b.heritageWindow=function(x,y,z,w,h,r=0,...tail){if(Math.abs(y-6.22)<1e-8&&r===0&&z>0&&w===1&&h===2.07){const offsets=[-.34,-.12,.12,.34],paired=[-.30,-.17,.17,.30],i=offsets.findIndex(v=>Math.abs(x-width*v)<1e-6);if(i>=0)x=width*paired[i];}return saved[2][2].call(this,x,y,z,w,h,r,...tail);};
 try{return previous.call(this,b,f,add);}finally{b.e.add=priorAdd;for(const[k,own,value]of saved){if(own)b[k]=value;else delete b[k];}}
};
})(YY);
