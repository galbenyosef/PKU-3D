/* West rectangular blue-grey building way/1031892007: the registered
 * 84.88s aerial shows pale frames on its east elevation. Keep every geometry
 * record, fitted opening and independent eastern neighbor intact. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.id!=='way/1031892007'||f.properties.pickId!==977)return prior.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'window'),window=b.window;
 b.window=function(x,y,z,w,h,r,col){return window.call(this,x,y,z,w,h,r,Math.sin(r)>.95?'#d9ded5':col);};
 try{return {...prior.call(this,b,f,add),eastFrameTone:'pale-photo-fit',entryStillUnverified:true};}
 finally{if(own)b.window=window;else delete b.window;}
};
})(YY);
