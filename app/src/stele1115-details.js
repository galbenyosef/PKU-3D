/* Close only the unintended 5mm body-to-cap joint; retain the fitted stele. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.southwestStele33;
 P.southwestStele33=function(...args){const value=prior.apply(this,args);if(this.id!==1115)return value;
  // Original cap: y=.48 + .15/2=.555; original stele starts at y=.56.
  // The reference shows the tablet seated directly on the cap. Keep all
  // original geometry and bridge only its existing 1.08m x .38m section.
  const key='southwest1115-seated-joint',g=this.geo(key,()=>{const q=new Y.Geo.Geometry(),ring=[[-.54,-.19],[.54,-.19],[.54,.19],[-.54,.19]];
   for(let i=0;i<4;i++){const a=ring[i],b=ring[(i+1)%4];q.quad([a[0],.555,a[1]],[a[0],.56,a[1]],[b[0],.56,b[1]],[b[0],.555,b[1]]);}return q;});
  this.mesh(key,g,0,0,0,1,1,1,'#b5bdb7',10);return value;
 };
})(YY);
