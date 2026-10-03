/* Chengzeyuan122: June2017 northeast river panorama shows pale window
 * frames on the north bar and its east end. Geometry remains an approximation.
 * Load after building172-v46; no inference about tree-hidden doors. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render;
A.render=function(b,f,add){if(f.properties.id!=='way/916931885'||f.properties.pickId!==897)return prior.call(this,b,f,add);
 const own=Object.prototype.hasOwnProperty.call(b,'window'),window=b.window;
 b.window=function(x,y,z,w,h,r,col){const north=z < -88.3, east=x > -875.6 && z < -81;
  return window.call(this,x,y,z,w,h,r,(y>3 && (north||east))?'#d8d9d3':col);
 };
 try{return {...prior.call(this,b,f,add),frameReference:'2017-northeast-river-pale-frames',frameToneFitted:true};}
 finally{if(own)b.window=window;else delete b.window;}
};
})(YY);
