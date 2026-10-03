/* 305: registered east and south exterior window bands only.
 * Six photographed bands are not a verified floor count. All dimensions are fits;
 * existing approximate courtyard and north/rear elevations remain unverified. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,ID='way/978626937',HEIGHT=18.55;
const C={wall:'#deddd1',pink:'#b88e82',frame:'#e1e2d8',glass:'#617d82',dark:'#576763',roof:'#969e94'};
const near=(a,c)=>Math.hypot(a[0]-c[0],a[1]-c[1])<.03;
function render(b,f,add){
 b.id=305;const ring=f.geometry.coordinates[0],faces=[];
 function facade(builder,e,context){
  const name=(near(e.a,ring[2])&&near(e.c,ring[3]))?'east':(near(e.a,ring[3])&&near(e.c,ring[4]))?'south':null;
  if(!name)return false;
  const length=e.len,origin=e.c,r=context.r;
  const stacks=name==='east'?Array.from({length:6},(_,i)=>({x:length*(i+.5)/6,w:length/6*.56})): [{x:length*.256,w:length*.255},{x:length*.653,w:length*.153},{x:length*.896,w:length*.168}];
  const face={name,length,origin:origin.slice(),rotation:r,stacks:stacks.map(x=>({...x})),holes:[]};faces.push(face);
  const group=(kind,fn)=>{const old=b.e.add;b.e.add=function(k,...a){return old.call(this,'305-'+name+'-'+kind+'-'+k,...a);};try{fn();}finally{b.e.add=old;}};
  b.local(origin[0],0,origin[1],r,()=>{
   function window(x,lo,hi,w,z,kind,panes){
    if(kind!=='top-local')face.holes.push({x,lo,hi,w});
    group(kind+'-glazing',()=>b.box(x,(lo+hi)/2,z,w,hi-lo,.04,C.glass,5));
    group(kind+'-frame',()=>{
     for(let i=0;i<=panes;i++)b.box(x-w/2+w*i/panes,(lo+hi)/2,z+.055,.06,hi-lo+.08,.10,C.frame,29);
     for(const y of[lo,hi])b.box(x,y,z+.055,w+.08,.065,.10,C.frame,29);
    });
   }
   for(let level=0;level<6;level++){
    const base=.3+level*3.0,lo=base+.65,hi=base+2.48;
    for(const [si,q]of stacks.entries()){
     const depth=level===0?.07:1.08;
     window(q.x,lo,hi,q.w-.22,depth,'balcony',Math.max(3,Math.round(q.w/1.15)));
     if(level>0){
      group('balcony-body',()=>{
       b.box(q.x,base+.325,depth/2,q.w,.65,depth,C.wall,24);
       b.box(q.x,base+2.74,depth/2,q.w,.52,depth,C.wall,24);
       for(const x of[q.x-q.w/2+.06,q.x+q.w/2-.06]){
        for(const z of[.06,depth-.06])b.box(x,(lo+hi)/2,z,.12,hi-lo,.12,C.wall,24);
        for(const y of[lo+.035,hi-.035])b.box(x,y,depth/2,.12,.07,depth,C.frame,29);
       }
       b.box(q.x,base+.04,depth/2,q.w+.12,.12,depth+.10,C.frame,24);
       b.box(q.x,base+.19,depth+.015,q.w,.065,.05,C.pink,24);
      });
     }
     if(level>0)group('balcony-side-glazing',()=>{
      for(const sign of[-1,1])b.box(q.x+sign*(q.w/2-.04),(lo+hi)/2,depth/2,.035,hi-lo-.14,depth-.24,C.glass,5);
     });
     // Protective wire grids vary by photographed local patch; do not copy
     // resident fittings, air conditioners or repeated mesh onto every opening.
     if((name==='east'&&si===2&&level===1)||(name==='south'&&si===0&&level===2))group('local-guard',()=>{
      for(let x=q.x-q.w/2+.19;x<q.x+q.w/2-.12;x+=.23)b.box(x,(lo+hi)/2,depth+.17,.023,hi-lo+.20,.035,C.dark,29);
      for(const y of[lo-.07,lo+(hi-lo)*.55,hi+.07])b.box(q.x,y,depth+.17,q.w,.027,.035,C.dark,29);
     });
    }
    // Recessed wall windows fill only gaps between the photographed projecting groups.
    const gaps=[],ends=[0,...stacks.flatMap(q=>[q.x-q.w/2,q.x+q.w/2]),length];
    for(let i=0;i<ends.length-1;i+=2)if(ends[i+1]-ends[i]>1.3)gaps.push([ends[i],ends[i+1]]);
    for(const[a,c]of gaps){const n=Math.max(1,Math.floor((c-a)/2.7));for(let j=0;j<n;j++)window(a+(c-a)*(j+.5)/n,lo,hi,Math.min(1.72,(c-a)/n*.68),.065,'recess',2);}
    group('pink-belt',()=>{
     // Horizontal bands are below glazing, never through the pane apertures.
     b.box(length/2,base+.30,.025,length,.085,.05,C.pink,24);
     b.box(length/2,base+.13,.025,length,.055,.05,C.pink,24);
    });
   }
   group('pink-vertical',()=>{for(const q of stacks)for(const x of[q.x-q.w/2-.10,q.x+q.w/2+.10])b.box(x,HEIGHT/2,.025,.065,HEIGHT,.05,C.pink,24);});
   // Only the visible, shallow south roof enclosures are represented. Their
   // rear extent is not known: this is a fitted strip, not a seventh full storey.
   if(name==='south')for(const[a,c]of[[length*.385,length*.575],[length*.735,length*.98]]){
    const x=(a+c)/2,w=c-a;
    group('top-local-enclosure',()=>{
     b.box(x,19.08,-.62,w,.66,1.18,C.wall,24);
     b.box(x,19.925,-.62,w,.13,1.18,C.wall,24);
     for(const edge of[x-w/2+.07,x+w/2-.07])b.box(edge,19.63,-.62,.14,.46,1.18,C.wall,24);
     b.box(x,19.63,-1.15,w,.46,.12,C.wall,24);
     b.box(x,20.02,-.59,w+.18,.13,1.34,C.frame,24);
     b.box(x,19.93,.105,w+.18,.09,.08,C.pink,24);
    });
    window(x,19.43,19.86,w-.28,.045,'top-local',Math.max(3,Math.round(w/1.1)));
   }
  });
  return true;
 }
 const shellKey='v30-walls-305-305-v74';
 const filteredAdd=(k,...args)=>{if(k!==shellKey)add(k,...args);};
 const result=A.footprint(b,f,filteredAdd,{key:'305-v74',height:HEIGHT,floors:5,roof:'flat',style:'modern',palette:{wall:C.wall,roof:C.roof,frame:C.frame},renderFacade:facade});
 // Replace only the two registered shell planes with real window apertures.
 const wall=new Y.Geo.Geometry();
 for(let i=0;i<ring.length-1;i++){
  const a=ring[i],c=ring[i+1],face=faces.find(q=>near(q.origin,c));
  if(!face){wall.quad([c[0],.30,c[1]],[a[0],.30,a[1]],[a[0],HEIGHT,a[1]],[c[0],HEIGHT,c[1]]);continue;}
  const cs=Math.cos(face.rotation),sn=Math.sin(face.rotation),point=(x,y)=>[face.origin[0]+x*cs,y,face.origin[1]-x*sn];
  const cuts=[.30,HEIGHT,...face.holes.flatMap(q=>[q.lo,q.hi])].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
  for(let j=1;j<cuts.length;j++){
   const lo=cuts[j-1],hi=cuts[j],holes=face.holes.filter(q=>q.lo<=lo+1e-7&&q.hi>=hi-1e-7).sort((a,b)=>a.x-b.x);let at=0;
   const part=(a,c)=>{if(c-a>1e-7)wall.quad(point(a,lo),point(c,lo),point(c,hi),point(a,hi));};
   for(const q of holes){part(at,q.x-q.w/2);at=q.x+q.w/2;}part(at,face.length);
  }
 }
 add('305-opened-source-walls',wall,C.wall,24,305);
 return{...result,strategy:'building305-v74',visibleWindowTiers:6,totalFloorsVerified:false,entranceVerified:false,registeredFacades:faces.map(({holes,...info})=>info),sourceOutline:true,heightMeasured:false,limits:'East/south exterior balcony bands fitted to registered panoramas; six bands are visible, total floor count unknown. Courtyard and north/rear openings retain an older five-row approximation. Local south roof enclosure depth, dimensions, height and colors are fitted, not surveyed.'};
}
A.render=function(b,f,add){return f.properties.id===ID&&f.properties.pickId===305?render(b,f,add):previous.call(this,b,f,add);};
Y.Building305={id:ID,render,height:HEIGHT};
})(YY);
