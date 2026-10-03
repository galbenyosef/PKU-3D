/* Add the observed asymmetric roof-end glazing after fashu983-skylights.
 * West triangle and east short quadrilateral are separate photo fits.
 * Follow the inherited roof surface; no invented raised endwall or roof rise.
 * This changes only the remaining gray roof and preserves both frozen central
 * glass units byte-for-byte. End frame/rib spacing remains a display fit. */
(function(Y){'use strict';const A=Y.Architecture30,prior=A.render,G=Y.Geo.Geometry;
// Independent end shapes from the same reviewed eave/ridge image registration.
const diamonds=[[[.157,.266],[.304,.5],[.156,.765]],[[.883,.5],[.934,.239],[.990,.5],[.921,.737]]];
function clip(poly,fn,positive){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=fn(a),db=fn(b),ia=positive?da>=0:da<=0,ib=positive?db>=0:db<=0;if(ia)out.push(a);if(ia!==ib){const t=da/(da-db);out.push(a.map((q,j)=>q+(b[j]-q)*t));}}return out;}
function split(poly,shape){let inside=poly;const outside=[];for(let i=0;i<shape.length&&inside.length;i++){const a=shape[i],b=shape[(i+1)%shape.length],fn=p=>(b[0]-a[0])*(p[9]-a[1])-(b[1]-a[1])*(p[8]-a[0]);const off=clip(inside,fn,false);if(off.length>=3)outside.push(off);inside=clip(inside,fn,true);}return{inside,outside};}
function emit(g,poly){for(let i=1;i+1<poly.length;i++){const vs=[poly[0],poly[i],poly[i+1]],a=vs[0],b=vs[1],c=vs[2];if(Math.hypot(...Y.M.cross(Y.M.sub(b.slice(0,3),a.slice(0,3)),Y.M.sub(c.slice(0,3),a.slice(0,3))))<1e-9)continue;for(const v of vs)g.v.push(...v.slice(0,8));}}
A.render=function(b,f,add){if(f.properties.pickId!==983||f.properties.id!=='way/1031892013')return prior.call(this,b,f,add);
 const ring=Y.Footprints.polygons(f.geometry)[0][0],o=ring[0],east=ring[2],south=ring[4],ux=east[0]-o[0],uz=east[1]-o[1],vx=south[0]-o[0],vz=south[1]-o[1],det=ux*vz-uz*vx;
 let touched=false;
 const result=prior.call(this,b,f,(key,g,col,mat,id)=>{
  if(!key.startsWith('v30-roof-983-')||!key.endsWith('-two-skylight-cuts'))return add(key,g,col,mat,id);
  touched=true;const solid=new G(),glass=[new G(),new G()],frames=[new G(),new G()];
  for(let i=0;i<g.v.length;i+=24){let polys=[[]];for(let j=0;j<3;j++){const a=g.v.slice(i+j*8,i+j*8+8),dx=a[0]-o[0],dz=a[2]-o[1];a.push((dx*vz-dz*vx)/det,(ux*dz-uz*dx)/det);polys[0].push(a);}
   for(let k=0;k<diamonds.length;k++){const next=[];for(const poly of polys){const q=split(poly,diamonds[k]);next.push(...q.outside);if(q.inside.length<3)continue;
     const shape=diamonds[k],center=shape.reduce((a,p)=>[a[0]+p[0]/shape.length,a[1]+p[1]/shape.length],[0,0]),inset=shape.map(p=>[center[0]+(p[0]-center[0])*.965,center[1]+(p[1]-center[1])*.965]),inner=split(q.inside,inset);for(const border of inner.outside)emit(frames[k],border);
     let panes=inner.inside.length>=3?[inner.inside]:[];
     const lo=Math.min(...shape.map(p=>p[0])),hi=Math.max(...shape.map(p=>p[0])),bays=k===0?4:3;
     for(let rib=1;rib<bays;rib++){const u=lo+(hi-lo)*rib/bays,half=.0007,newPanes=[];
      for(const pane of panes){const s=split(pane,[[u-half,0],[u+half,0],[u+half,1],[u-half,1]]);newPanes.push(...s.outside);emit(frames[k],s.inside);}panes=newPanes;
     }
     for(const pane of panes)emit(glass[k],pane);
    }polys=next;
   }for(const poly of polys)emit(solid,poly);
  }
  add(key+'-end-skylight-cuts',solid,col,mat,id);
  for(let k=0;k<2;k++){add('fashu983-end-skylight-glass-'+k,glass[k],'#91b3b4',28,id);add('fashu983-end-skylight-frames-'+k,frames[k],'#8b9b96',29,id);}
 });
 return{...result,endSkylightRegions:touched?2:0,skylightsFollowInheritedRoof:true,roofReconstructed:false,roofEndGlazingOutlineFit:touched,roofEndStructureMeasured:false};
};
})(YY);
