/* Sunny elevated views retain cartographic clarity. Low-angle clear views
 * receive more aerial perspective; weather values are artistic, not forecasts. */
(function(Y){'use strict';
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 Y.Atmosphere={fog(s,c){
  if(s.isolate)return 0;
  if(s.weather===2)return .002;
  if(s.weather===1)return .00078;
  // Snow and unspecified weather keep their previous density.
  if(s.weather!==0)return .00021;
  const base=.00027;
  if(s.mapClarity===false||!c?.eye||!c?.target)return base;
  const dx=c.eye[0]-c.target[0],dy=c.eye[1]-c.target[1],dz=c.eye[2]-c.target[2];
  const dist=Math.hypot(dx,dy,dz);
  if(!Number.isFinite(dist)||dist<1)return base;
  const high=smooth((dy/dist-.40)/.28),far=smooth((dist-280)/440);
  return base-(base-.000085)*high*far;
 }};
})(YY);
