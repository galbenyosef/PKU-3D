/* The 2018 ladder photograph shows timber ends beyond both hanger lines.
 * End allowance is a proportional fit; keep the existing layout and heights. */
(function(Y){'use strict';const previous=Y.Refinements41.sport;
 Y.Refinements41.sport=function(b,f){if(f.properties.pickId!==768||f.properties.id!=='manual/outdoor-zone')return previous.call(this,b,f);const beam=b.beam;
  b.beam=function(a,c,r,color,mat,part){if(color==='#9d8b6c'&&r===.14&&a[0]===-4&&c[0]===4&&a[1]===c[1]&&a[2]===0&&c[2]===0){const d=Y.M.mul(Y.M.norm(Y.M.sub(c,a)),.35);return beam.call(this,Y.M.sub(a,d),Y.M.add(c,d),r,color,mat,part);}return beam.call(this,a,c,r,color,mat,part);};
  try{return previous.call(this,b,f);}finally{b.beam=beam;}
 };
})(YY);
