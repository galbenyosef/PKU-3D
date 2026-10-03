/* PKU property office: stone body height .77 m, width .50 m, depth .19 m.
 * Preserve the existing rounded silhouette and every facet/border primitive.
 * Worn inscription remains unresolved. Install 1 cm into the local grass surface. */
(function(Y){'use strict';const previous=Y.Builder.prototype.plantingStele33,S=[.5/1.24,.77/1.82,.19/.23];
Y.Builder.prototype.plantingStele33=function(...args){if(this.id!==1129)return previous.apply(this,args);const mesh=this.mesh,had=Object.hasOwn(this,'mesh');this.mesh=function(...p){for(let k=0;k<3;k++){p[2+k]*=S[k];p[5+k]*=S[k];}p[3]-=.075;return mesh.apply(this,p);};
try{return previous.apply(this,args);}finally{if(had)this.mesh=mesh;else delete this.mesh;}};
Y.Planting1129={scale:S,bodyDimensions:[.5,.77,.19],installationOffset:-.075,groundSurface:.035,embeddedDepth:.01};
})(YY);
