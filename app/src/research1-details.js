/* Photographed northern low wing of Research Building 1. Registration and
 * dimensions are fitted; see docs/development/research1-entrance.md. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,G=Y.Geo,F=Y.Footprints,ID='relation/11823277';
const H={floor:.54,wall:3.92,eave:4.12,ridge:5.55};
const doors=[{u:6.1,w:1.05,type:'panel'},{u:17.0,w:2.20,type:'double-panel'},{u:25.0,w:1.05,type:'glazed'}];
const windows=[1.8,3.9,8.4,11.6,13.9,20.4,22.7,27.0];
function frame(f){const ring=f.geometry.coordinates[1][0],a=ring[3],c=ring[2],w=Math.hypot(c[0]-a[0],c[1]-a[1]),r=Math.atan2(a[1]-c[1],c[0]-a[0]);return{ring,a,c,w,r,point:(u,z)=>[a[0]+u*Math.cos(r)+z*Math.sin(r),a[1]-u*Math.sin(r)+z*Math.cos(r)]};}
function mainFacade(b,e,q){
 // Only the two inward-facing edges appear in the 2022 courtyard photographs.
 const north=e.a[0]===-292.843&&e.a[1]===355.786&&e.c[0]===-246.879;
 const west=e.a[0]===-246.879&&e.a[1]===353.049&&e.c[0]===-247.628;
 if(!north&&!west)return false;
 const {body,floors,fh,count,stride,ww,r}=q,old=b.e.add;
 b.e.add=function(k,...args){return old.call(this,'research1-main-courtyard-'+k,...args);};
 try{
  for(let k=0;k<=count;k++){
   const t=Math.max(.18,Math.min(e.len-.18,k*stride)),x=e.a[0]+e.ux*t,z=e.a[1]+e.uz*t;
   b.local(x,0,z,r,()=>b.box(0,(body+.30)/2,.11,.36,body-.30,.22,'#9a9c92',30));
  }
  for(let floor=0;floor<floors;floor++)for(let k=0;k<count;k++){
   const t=(k+.5)*stride,x=e.a[0]+e.ux*t+e.nx*.045,z=e.a[1]+e.uz*t+e.nz*.045;
   const h=Math.min(2.75,fh*.72),y=.55+fh*(floor+.52),top=h/2,bottom=-h/2,trans=top-.48;
   b.local(x,y,z,r,()=>{
    b.box(0,0,.028,ww-.10,h-.10,.035,'#587479',5);
    for(const u of[-ww/2,ww/2])b.box(u,0,.075,.065,h,.13,'#465653',9);
    for(const v of[bottom,top,trans])b.box(0,v,.075,ww,.065,.13,'#465653',9);
    b.box(0,(bottom+trans)/2,.075,.055,trans-bottom,.13,'#465653',9);
    b.box(0,(trans+top)/2,.075,.055,top-trans,.13,'#465653',9);
    b.box(0,top+.10,.08,ww+.16,.20,.22,'#d3d3c7',24);
    b.box(0,bottom-.055,.075,ww+.10,.11,.24,'#929b93',24);
   });
  }
 }finally{b.e.add=old;}
 return true;
}
function render(b,f,add){
 const fr=frame(f),ring=fr.ring,low={type:'Polygon',coordinates:[ring]};
 // Retain its mass/roof; photographed courtyard faces replace the generic bands.
 A.footprint(b,{...f,geometry:{type:'MultiPolygon',coordinates:[f.geometry.coordinates[0]]}},add,{palette:{wall:'#9a9c92',mat:30,frame:'#465653'},renderFacade:mainFacade});
 b.id=f.properties.pickId;const old=b.e.add;b.e.add=function(k,...args){return old.call(this,'research1-north-'+k,...args);};
 const col={brick:'#9a9c92',trim:'#d3d3c7',frame:'#465653',glass:'#557276',door:'#69736e',step:'#b4b7ac',roof:'#aaa28d'};
 try{
  // Three unphotographed elevations retain plain fitted walls; the photographed
  // courtyard face is constructed around actual apertures below.
  for(const [i,j]of[[0,1],[1,2],[3,0]]){const a=ring[i],c=ring[j],len=Math.hypot(c[0]-a[0],c[1]-a[1]),r=Math.atan2(a[1]-c[1],c[0]-a[0]);b.local(a[0],0,a[1],r,()=>b.box(len/2,H.wall/2,0,len,H.wall,.22,col.brick,30));}
  const roofY=p=>H.eave+(H.ridge-H.eave)*Math.min(1,Math.min(...ring.slice(1).map((q,i)=>F.distSegment(p,ring[i],q)))/4.25);
  const roof=F.profiledSurface(low,p=>roofY(p),.65);b.mesh('hip-roof',roof,0,0,0,1,1,1,col.roof,19);
  for(let i=0;i<4;i++){const a=ring[i],c=ring[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]),r=Math.atan2(a[1]-c[1],c[0]-a[0]);b.local(a[0],0,a[1],r,()=>b.box(len/2,H.eave-.10,0,len+.18,.20,.60,col.trim,24));}
  b.local(fr.a[0],0,fr.a[1],fr.r,()=>{
   const openings=[...windows.map(u=>({u,w:.98,bottom:1.02,top:3.46,type:'window'})),...doors.map(d=>({...d,bottom:H.floor,top:3.46}))].sort((a,c)=>a.u-c.u);
   const wall=(a,c,lo,hi)=>{if(c>a&&hi>lo)b.box((a+c)/2,(lo+hi)/2,-.11,c-a,hi-lo,.22,col.brick,30);};
   let cursor=0;
   for(const q of openings){const left=q.u-q.w/2,right=q.u+q.w/2;wall(cursor,left,0,H.wall);wall(left,right,0,q.bottom);wall(left,right,q.top,H.wall);cursor=right;
    const mid=(q.bottom+q.top)/2,height=q.top-q.bottom;
    // Deep jambs, recessed infill and projecting pale lintels.
    for(const x of[left+.025,right-.025])b.box(x,mid,-.025,.05,height,.21,col.frame,9);
    b.box(q.u,q.top-.025,-.025,q.w,.05,.21,col.frame,9);
    b.box(q.u,q.top+.085,.035,q.w+.12,.17,.30,col.trim,24);
    if(q.type==='window'){
     b.box(q.u,mid,-.13,q.w-.10,height-.10,.025,col.glass,5);b.box(q.u,mid,-.065,.045,height-.10,.06,col.frame,9);
     b.box(q.u,q.bottom+.025,-.025,q.w,.05,.21,col.frame,9);b.box(q.u,q.bottom-.04,.02,q.w+.10,.08,.27,col.trim,24);
    }else{
     const leafTop=2.98,leafHeight=leafTop-H.floor,leafCount=q.type==='double-panel'?2:1,leafWidth=q.w/leafCount;
     b.box(q.u,(leafTop+q.top)/2,-.105,q.w-.08,q.top-leafTop-.045,.07,col.door,24);
     b.box(q.u,leafTop,-.035,q.w,.06,.17,col.frame,9);
     for(let n=0;n<leafCount;n++){const x=left+(n+.5)*leafWidth,w=leafWidth-.065;
      if(q.type==='glazed'){
       b.box(x,(H.floor+leafTop)/2,-.105,w,leafHeight,.035,col.glass,5);
       for(const dx of[-w/2,w/2])b.box(x+dx,(H.floor+leafTop)/2,-.065,.05,leafHeight,.07,col.frame,9);
       for(const y of[H.floor+.04,1.50,leafTop-.04])b.box(x,y,-.065,w,.06,.07,col.frame,9);
      }else{
       b.box(x,(H.floor+leafTop)/2,-.16,w,leafHeight,.08,col.door,24);
       for(const dx of[-w/2+.025,0,w/2-.025])b.box(x+dx,(H.floor+leafTop)/2,-.075,.05,leafHeight,.09,col.door,24);
       for(let row=0;row<=4;row++)b.box(x,H.floor+.03+row*.54,-.075,w,.10,.09,col.door,24);
       b.box(x,leafTop-.07,-.075,w,.14,.09,col.door,24);
       // Inset rectangular fields leave the continuous rails and stiles visible.
       for(const dx of[-w*.23,w*.23])for(let row=0;row<4;row++){
        const yy=H.floor+.30+row*.54;b.box(x+dx,yy,-.105,w*.35,.41,.024,'#59655f',24);
        for(const dy of[-.207,.207])b.box(x+dx,yy+dy,-.065,w*.36,.023,.035,'#808a81',24);
        for(const side of[-1,1])b.box(x+dx+side*w*.18,yy,-.065,.023,.41,.035,'#808a81',24);
       }
      }
      const hx=leafCount===2?x+(n===0?1:-1)*(w/2-.13):x+w/2-.13;
      b.beam([hx,1.36,.015],[hx,1.62,.015],.018,'#c3cac0',9);for(const y of[1.38,1.60])b.beam([hx,y,-.07],[hx,y,.015],.014,'#c3cac0',9);
     }
     // Closed leaves sit inside the masonry aperture, above the stone landing.
     for(let step=0;step<3;step++){const height=.18*(step+1),depth=1.82-step*.32;b.box(q.u,height/2,depth/2-.18,q.w+.96,height,depth,col.step,21);}
     for(const side of[-1,1])b.box(q.u+side*(q.w/2+.55),.32,.60,.20,.64,1.56,col.trim,24);
    }
   }
   wall(cursor,fr.w,0,H.wall);
   // Small paved apron, limited to the photographed side of the low wing.
   b.box(fr.w/2,.075,1.25,fr.w,.09,2.72,'#aaa99b',7);
   for(const x of[5.15,23.95]){b.beam([x,.18,.20],[x,3.78,.20],.038,col.trim,24);b.beam([x,3.78,.20],[x,4.01,-.05],.038,col.trim,24);}
  });
 }finally{b.e.add=old;}
 return{strategy:'research1-north-refined',sourceOutline:true,northWingFloors:1,mainWingMassPreserved:true,mainCourtyardFacade:'photo-fitted',mainEntrancesVerified:false,entranceVerified:false,registration:'photo-and-plan-fit',unseenElevationsVerified:false,dimensionsMeasured:false};
}
A.render=function(b,f,add){return f.properties.id===ID?render(b,f,add):previous(b,f,add);};
Y.Research1Details={id:ID,render,frame,H,doors,windows,mainFacade};
})(YY);
