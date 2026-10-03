/* Yannan 63: support the existing front veranda and join its roof to the hall. */
(function(Y){'use strict';const A=Y.Architecture30,base=A.render;
 A.render=function(b,f,add){
  if(f.properties.pickId!==804||f.properties.id!=='way/866277605')return base.call(this,b,f,add);
  const p=Y.ARCHIVE.legacy['863'],w=(p.modelSize?.[0]||p.w*2.5)*p.heritageModel.bodyScale[0],d=(p.modelSize?.[1]||p.d*2.5)*p.heritageModel.bodyScale[1];
  const front=-d*.14,vz=front+.68,sourceSlab=Y.M.transform([-w*.07,.35,vz],[w*.61,.21,1.43],0);
  // Read the actual emitted veranda slab transform; source fitting is otherwise untouched.
  const previous=b.e.add,observed=[];
  b.e.add=function(k,g,m,c,p,uv){if(c==='#b3b4a9'&&p[0]===10&&p[3]===.25)observed.push(new Float32Array(m));
   if(k==='v30-plane'&&p[0]===8&&p[3]===.95&&observed.length===1){
    const root=Y.M.multiply(observed[0],Y.M.inverse(sourceSlab)),delta=front-.50;m=new Float32Array(m);m[12]+=root[8]*delta;m[13]+=root[9]*delta;m[14]+=root[10]*delta;
   }
   return previous.call(this,k,g,m,c,p,uv);};
  const ownWindow=Object.prototype.hasOwnProperty.call(b,'heritageWindow'),window=b.heritageWindow;
  b.heritageWindow=function(x,y,z,ww,hh,r=0,...rest){
   // Only the original centre front window occupies this model's existing door.
   if(Math.abs(x)>1e-8||Math.abs(y-2)>1e-8||r!==0||Math.abs(z-(d*.36/2+.022))>1e-6)return window.call(this,x,y,z,ww,hh,r,...rest);
   const ownBox=Object.prototype.hasOwnProperty.call(this,'box'),box=this.box;
   this.box=function(cx,cy,cz,sx,sy,sz,...args){
    const x0=cx-sx/2,x1=cx+sx/2,y0=cy-sy/2,y1=cy+sy/2;
    // Existing door backing: 1.32+.17 wide, .45+2.5/2 centre, 2.5+.18 high.
    const left=-.745,right=.745,bottom=.36-y,top=3.04-y;
    if(x1<=left||x0>=right||y1<=bottom||y0>=top)return box.call(this,cx,cy,cz,sx,sy,sz,...args);
    const part=(a,b,c,e)=>{if(b-a>1e-7&&e-c>1e-7)box.call(this,(a+b)/2,(c+e)/2,cz,b-a,e-c,sz,...args);};
    part(x0,Math.min(x1,left),y0,y1);part(Math.max(x0,right),x1,y0,y1);
    const a=Math.max(x0,left),e=Math.min(x1,right);part(a,e,y0,Math.min(y1,bottom));part(a,e,Math.max(y0,top),y1);
   };
   try{return window.call(this,x,y,z,ww,hh,r,...rest);}finally{if(ownBox)this.box=box;else delete this.box;}
  };
  let result;try{result=base.call(this,b,f,add);}finally{b.e.add=previous;if(ownWindow)b.heritageWindow=window;else delete b.heritageWindow;}

  if(result.source!==863||observed.length!==1)return result;
  const root=Y.M.multiply(observed[0],Y.M.inverse(sourceSlab));
  const emit=(key,g,m,color,mat,part)=>b.e.add(key,g,Y.M.multiply(root,m),color,[mat,804,0,part]);
  const box=(key,x,y,z,sx,sy,sz,color,mat,part)=>emit(key,Y.Geo.box(),Y.M.transform([x,y,z],[sx,sy,sz],0),color,mat,part);
  // Original slab is suspended .245 source metres above ground; support it in stone.
  box('building804-veranda-plinth',-w*.07,.245/2,vz,w*.61,.245,1.43,'#b3b4a9',10,.25);
  // The last existing post lies beyond that slab. Continue its same-height stone base.
  const left=w*.235,right=w*.31+.20;
  box('building804-veranda-plinth', (left+right)/2,.455/2,vz,right-left,.455,1.43,'#b3b4a9',10,.25);
  // A shallow tiled continuation ties the existing hall eave to the existing veranda beam.
  // Dimensions are fitted to those members, not claimed as measured construction.
  const half=w*.38+.18,z0=front+.485,z1=front+1.32,y0=3.81,y1=3.45,thick=.045;
  const roof=new Y.Geo.Geometry();roof.quad([-half,y0,z0],[-half,y1,z1],[half,y1,z1],[half,y0,z0]);
  emit('building804-veranda-roof',roof,Y.M.identity(),'#666c64',19,1.8);
  const edge=new Y.Geo.Geometry();edge.quad([-half,y0-thick,z0],[half,y0-thick,z0],[half,y1-thick,z1],[-half,y1-thick,z1]);
  for(const x of[-half,half]){const face=[[x,y0,z0],[x,y1,z1],[x,y1-thick,z1],[x,y0-thick,z0]];if(x<0)face.reverse();edge.quad(...face);}
  edge.quad([-half,y1-thick,z1],[half,y1-thick,z1],[half,y1,z1],[-half,y1,z1]);
  emit('building804-veranda-roof-edge',edge,Y.M.identity(),'#596253',20,1.65);
  const tile=new Y.Geo.Geometry();for(let j=0;j<8;j++){const a=Math.PI*j/8,c=Math.PI*(j+1)/8;tile.quad([Math.cos(a)*.5,Math.sin(a),-.5],[Math.cos(c)*.5,Math.sin(c),-.5],[Math.cos(c)*.5,Math.sin(c),.5],[Math.cos(a)*.5,Math.sin(a),.5]);}
  const slope=(y1-y0)/(z1-z0);
  for(let x=-half+.15;x<half-.1;x+=.245)for(let row=0;row<2;row++){
   const z=z1-.15-row*.28,y=y0+slope*(z-z0);
   const m=Y.M.transform([x,y,z],[.18,.055,.35],0);
   // Shear tile length to follow the same shallow roof plane without flattening its arch.
   m[9]=slope*.35;emit('building804-veranda-eave-tile',tile,m,'#666c64',19,1.86);
  }
  return result;
 };
})(YY);
