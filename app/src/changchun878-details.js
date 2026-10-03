/* 56 own winter north elevation: pale window frames, not the generic dark-green tone.
 * Six floors are already implemented; all geometry and unseen elevations remain intact. */
(function(Y){'use strict';const A=Y.Architecture30,previous=A.render,ID='way/849765901';
A.render=function(b,f,add){if(f.properties.id!==ID)return previous.call(this,b,f,add);const window=b.window;let frames=0;
 b.window=function(x,y,z,w,h,r=0,tone,mullion){const north=Math.cos(r)<-.99;if(north){tone='#d0d2cb';frames++;}return window.call(this,x,y,z,w,h,r,tone,mullion);};
 let result;try{result=previous.call(this,b,f,add);}finally{b.window=window;}
 return{...result,northFrameTone:'photo-fit-pale-aluminium',northFramesRetoned:frames,frameDimensionsMeasured:false,entranceVerified:false};
};})(YY);
