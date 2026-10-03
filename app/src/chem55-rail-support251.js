/* Daya Hall's 2017 oblique reference shows stone cheeks beneath the stair rails.
 * Fill the missing side supports without moving rails or narrowing the stair.
 * Cheek width/profile are fitted; the photograph is not a dimensional survey. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render;
A.render=function(b,f,add){
 const result=previous.call(this,b,f,add);
 if(f.properties.id!==Y.Building016.id)return result;
 const B=Y.Building016,mid=B.entrance.u;
 for(const side of[-1,1]){
  const g=new Y.Geo.Geometry(),us=[mid+side*1.775,mid+side*1.97].sort((a,c)=>a-c);
  const profile=[[-.62,.75],[.14,.75],[2.08,.15],[2.195,.15]],base=0;
  const vertex=(u,y,z)=>{const p=B.world(u,-z);return[p[0],y,p[1]];};
  function quad(points,normal){const n=Y.M.cross(Y.M.sub(points[1],points[0]),Y.M.sub(points[2],points[0]));if(Y.M.dot(n,normal)<0)points.reverse();g.quad(...points);}
  const origin=B.world(0,0),axis=B.world(1,0),out=[axis[0]-origin[0],0,axis[1]-origin[1]];
  for(let i=0;i<profile.length-1;i++){
   const[z0,y0]=profile[i],[z1,y1]=profile[i+1];
   quad([vertex(us[0],y0,z0),vertex(us[1],y0,z0),vertex(us[1],y1,z1),vertex(us[0],y1,z1)],[0,1,0]);
   for(let k=0;k<2;k++)quad([vertex(us[k],base,z0),vertex(us[k],base,z1),vertex(us[k],y1,z1),vertex(us[k],y0,z0)],out.map(v=>v*(k?1:-1)));
  }
  const zaxis=B.world(0,-1),forward=[zaxis[0]-origin[0],0,zaxis[1]-origin[1]];
  for(const k of[0,profile.length-1]){const[z,y]=profile[k];quad([vertex(us[0],base,z),vertex(us[1],base,z),vertex(us[1],y,z),vertex(us[0],y,z)],forward.map(v=>v*(k?1:-1)));}
  for(let i=0;i<profile.length-1;i++)quad([vertex(us[0],base,profile[i][0]),vertex(us[1],base,profile[i][0]),vertex(us[1],base,profile[i+1][0]),vertex(us[0],base,profile[i+1][0])],[0,-1,0]);
  add('chem55-rail-support251-'+side,g,'#aeb7b1',24,f.properties.pickId);
 }
 return result;
};
})(YY);
