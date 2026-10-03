/* Zhifuxuan: the mapped south-projecting hall, not the neighbouring Wanzhong Lou.
 * Five-bay main hall / three-bay pavilion follow PKU's heritage description.
 * The 2024 repaired front supplies the timber door/window pattern; dimensions,
 * rear elevations and roof heights remain fitted, not a measured reconstruction. */
(function(Y){'use strict';const previous=Y.Architecture30.render,F=Y.Footprints,C={red:'#934032',green:'#4b8271',glass:'#536c65',wall:'#d6d5c7',stone:'#a9afa5'};
function panel(b,x,w,door){const bottom=door?.48:1.08,top=3.42,mid=(bottom+top)/2,h=top-bottom;
 // Open wall aperture behind all leaves; lower solid panels, upper lattice glass.
 b.box(x,bottom+.29,-.012,w,.58,.12,C.red,6,.9);
 const low=bottom+.60;b.box(x,(low+top)/2,-.045,w-.12,top-low,.055,C.glass,5,.75);
 for(const side of[-1,1]){b.box(x+side*w/2,mid,.04,.085,h,.15,C.red,6,.9);b.box(x,bottom+(.04+(h-.08)*(side+1)/2),.04,w,.085,.15,C.red,6,.9);}
 b.box(x,low,.055,w,.09,.13,C.red,6,.92);
 // A broad lower light and dense geometric upper light, visible in both photos.
 const split=door?2.32:2.22;b.box(x,split,.07,w,.075,.12,C.red,6,.95);
 const upper=top-split,uy=(top+split)/2;
 for(const side of[-1,1]){const xx=x+side*w*.24;for(const sy of[-1,1]){b.box(xx+sy*w*.16,uy,.095,.038,upper*.72,.07,C.red,6,1);b.box(xx,uy+sy*upper*.36,.095,w*.32,.038,.07,C.red,6,1);}b.box(xx,uy,.10,.034,upper*.94,.07,C.red,6,1);}
 b.box(x,uy,.10,.045,upper,.07,C.red,6,1);
 if(door)b.box(x+w*.24,1.25,.16,.025,.19,.025,'#b4a078',9,1.1);
 else {for(const side of[-1,1])b.box(x+side*w*.25,(low+split)/2,.075,.028,split-low,.07,C.green,6,.96);b.box(x,(low+split)/2,.07,w,.03,.06,C.green,6,.97);}
}
function facade(b,a,c,height,openings){const len=Math.hypot(c[0]-a[0],c[1]-a[1]),r=-Math.atan2(c[1]-a[1],c[0]-a[0]);b.local(a[0],0,a[1],r,()=>{
 const cuts=[0,len,...openings.flatMap(o=>[o.x-o.w/2,o.x+o.w/2])].sort((a,b)=>a-b);
 for(let i=1;i<cuts.length;i++){const lo=cuts[i-1],hi=cuts[i],mid=(lo+hi)/2,o=openings.find(o=>mid>o.x-o.w/2&&mid<o.x+o.w/2);if(o){const low=o.door?.48:1.02;b.box(mid,(.48+low)/2,-.12,hi-lo,Math.max(.01,low-.48),.24,C.wall,24,.6);b.box(mid,(3.42+height)/2,-.12,hi-lo,height-3.42,.24,C.wall,24,.6);}else b.box(mid,(.48+height)/2,-.12,hi-lo,height-.48,.24,C.wall,24,.6);}
 for(const o of openings){const n=o.door?4:2,pitch=o.w/n;for(let j=0;j<n;j++)panel(b,o.x-o.w/2+(j+.5)*pitch,pitch-.035,!!o.door);if(!o.door)b.box(o.x,1.035,.005,o.w+.20,.13,.30,C.stone,10,.6);}
 b.box(len/2,height-.12,.06,len,.24,.24,C.red,6,1.5);
 });}
function hall(b,ring){const front=(ring[3][1]+ring[4][1])/2,px=(ring[3][0]+ring[4][0])/2,pw=ring[4][0]-ring[3][0];
 // Exact mapped shell closes the re-entrant edges that rectangular clipping lost.
 const shape={type:'Polygon',coordinates:[ring]};b.mesh('langrun355-plinth',F.walls(shape,.045,.48),0,0,0,1,1,1,C.stone,10,.15);b.mesh('langrun355-floor',F.surface(shape,.48),0,0,0,1,1,1,C.stone,10,.2);
 for(let i=0;i<8;i++){const a=ring[i],c=ring[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]),small=[2,3,4].includes(i),ops=[];
  if(i===3)for(let j=0;j<3;j++)ops.push({x:(j+.5)*len/3,w:len/3-.44,door:j===1});
  else if(i===7)for(let j=0;j<5;j++)ops.push({x:(j+.5)*len/5,w:2.65});
  else if([0,6].includes(i))for(let j=0;j<2;j++)ops.push({x:(j+.5)*len/2,w:2.45});
  else ops.push({x:len/2,w:small?2.15:2.8});
  const aa=[...a],cc=[...c];if(i===3){aa[1]-=.34;cc[1]-=.34;}facade(b,aa,cc,small?4.25:4.90,ops);
 }
 // Four front columns, narrow decorated transom and brackets form three bays.
 for(let j=0;j<=3;j++){const x=ring[3][0]+j*pw/3;b.cyl(x,.48,front-.04,.125,3.67,C.red,20,1,6,1.3);b.cyl(x,.24,front-.04,.19,.24,C.stone,20,1,10,.3);}
 for(let j=0;j<3;j++){const x=ring[3][0]+(j+.5)*pw/3,w=pw/3-.26;b.box(x,3.77,front-.04,w,.09,.13,C.red,6,1.5);for(let k=0;k<6;k++){const xx=x+(k-2.5)*w/6;b.box(xx,3.91,front-.04,w/6-.04,.035,.09,C.red,6,1.5);b.box(xx-w/12,3.84,front-.04,.028,.18,.09,C.red,6,1.5);}for(const side of[-1,1]){b.beam([x+side*w/2,3.64,front],[x+side*(w/2-.4),3.77,front],.065,C.green,6,1.55);b.box(x+side*(w/2-.28),3.73,front,.56,.05,.10,C.green,6,1.55);}}
 // The plaque sits in front of the hanging transom; its timber back overlaps
 // that existing beam by 5 cm, so the visible sign is supported, not floating.
 b.mesh('langrun355-sign-backing',b.geo('langrun355-sign-backing',Y.Geo.box),px,3.74,front+.065,1.7,.44,.18,'#51483a',6,1.65);
 b.sign('致福轩',px,3.74,front+.16,1.7,.44,0,false);
 for(let j=0;j<3;j++){const h=.16*(j+1);b.box(px,h/2,front+1.18-j*.35,2.75,h,.70,C.stone,10,.25);}
 b.box(px,.24,front+.05,2.75,.48,.85,C.stone,10,.25);
 // Keep the existing high-resolution rolled roof generator and material 2.
 // Intersecting full roofs replace the cropped single rectangular roof; neither
 // source is simplified. Their overlap lies inside the combined hall envelope.
 const mainZ=(ring[0][1]+(ring[1][1]+ring[6][1])/2)/2,mainW=ring[6][0]-ring[0][0],mainD=(ring[1][1]+ring[6][1])/2-ring[0][1];
 // Thin timber soffits close the underside of the eaves and the roof junction.
 b.box(0,4.855,mainZ,mainW+1.35,.09,mainD+1.4,C.red,6,1.8);
 b.box(px,4.205,(front+2.1)/2,pw+1.2,.09,front-2.1+1.2,C.red,6,1.8);
 Y.Refinements44.coiledRoof.call(b,0,4.90,mainZ,mainW+1.4,mainD+1.45,2.60);
 Y.Refinements44.coiledRoof.call(b,px,4.25,(front+2.1)/2,pw+1.25,front-2.1+1.25,1.8);
}
Y.Architecture30.render=function(b,f,add){if(f.properties.pickId!==355||f.properties.id!=='way/1009052017')return previous.call(this,b,f,add);
 const fr=Y.ArchitectureAdapter.frame(f.geometry),cs=Math.cos(fr.r),sn=Math.sin(fr.r),ring=f.geometry.coordinates[0].map(([x,z])=>[cs*(x-fr.centre[0])-sn*(z-fr.centre[1]),sn*(x-fr.centre[0])+cs*(z-fr.centre[1])]);
 add('v30-footprint-base-355',F.surface(f.geometry,.045),'#b5bbae',10,355);
 return Y.ArchitectureAdapter.render(b,f,b=>hall(b,ring),Y.ARCHIVE.legacy['26'],{name:'langrun355-zhifuxuan',frame:fr,sourceFrame:{w:fr.w-.15,d:fr.d-.15,centre:[0,0]},keepHeight:true,preserveOuterParts:true});
};
})(YY);
