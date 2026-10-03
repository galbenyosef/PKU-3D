/* Shaoyuan 5: source-ring registered straight hip roof, Esri imagery.
 * Roof type is observed; elevations, overhang and slope are fitted, not surveyed.
 * Existing facades and unverified entrance remain unchanged. */
(function(Y){'use strict';
 const A=Y.Architecture30,previous=A.render,key='shaoyuan119-hip-shell';
 function spec(f){const fr=Y.ArchitectureAdapter.frameAt(f.geometry,.05541065724658244);return{frame:fr,w:fr.w+.60,d:fr.d+.60,eave:16.25,ridge:18.60,underside:16.10,overhang:.30};}
 function roof(s){const g=new Y.Geo.Geometry(),w=s.w/2,d=s.d/2,r=w-d,c=Math.cos(s.frame.r),sn=Math.sin(s.frame.r);
  const world=p=>[s.frame.centre[0]+c*p[0]+sn*p[2],p[1],s.frame.centre[1]-sn*p[0]+c*p[2]],P=[[-w,s.eave,-d],[w,s.eave,-d],[w,s.eave,d],[-w,s.eave,d]],R=[[-r,s.ridge,0],[r,s.ridge,0]];
  // Explicit positive-Y winding on all four planar slopes.
  g.quad(...[P[0],R[0],R[1],P[1]].map(world));g.quad(...[P[3],P[2],R[1],R[0]].map(world));
  g.tri(...[P[0],P[3],R[0]].map(world));g.tri(...[P[1],R[1],P[2]].map(world));
  const B=P.map(p=>[p[0],s.underside,p[2]]);
  for(let i=0;i<4;i++){const j=(i+1)%4;g.quad(...[B[i],P[i],P[j],B[j]].map(world));}
  g.quad(...[B[0],B[1],B[2],B[3]].map(world));return g;
 }
 A.render=function(b,f,...args){const result=previous.call(this,b,f,...args);if(f.properties.pickId!==119||f.properties.id!=='way/240832231')return result;
  const s=spec(f);b.e.add(key,roof(s),Y.M.identity(),'#777b73',[19,119,0,0]);
  return{...result,roofRefinement119:{type:'straight-hip',source:'Esri World Imagery registered to exact way/240832231 ring',...s,dimensionsStatus:'fitted-not-surveyed',entryRegistered:false}};
 };
 Y.Shaoyuan119Roof={key,spec,roof};
})(YY);
