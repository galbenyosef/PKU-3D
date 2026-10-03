/* Daya Hall: join the existing fitted transom and upper pull fixings to their frames.
 * Same 2017 official photographs; no new door arrangement or measured dimensions. */
(function(Y){'use strict';
const A=Y.Architecture30,previous=A.render,near=(a,b)=>Math.abs(a-b)<1e-7;
A.render=function(b,f,add){
 if(f.properties.id!==Y.Building016.id)return previous.call(this,b,f,add);
 const mid=Y.Building016.entrance.u,plane=-1.04,box=b.box,beam=b.beam,ownsBox=Object.hasOwn(b,'box'),ownsBeam=Object.hasOwn(b,'beam');
 const openings=[[-1.60,-1.03],[-.95,-.04],[.04,.95],[1.03,1.60]],oldCentres=[-1.295,-.495,.495,1.295];let panes=0,feet=0,removedRods=0;
 b.box=function(x,y,z,w,h,d,c,mat,...rest){
  if(mat===5&&near(y,3.49)&&near(z,plane-.025)&&near(h,.60)&&near(d,.035)){
   const i=oldCentres.findIndex(a=>near(x,mid+a));if(i<0)throw Error('Chem55 transom registration changed');
   const [a,v]=openings[i],left=mid+a-.001,right=mid+v+.001,bottom=3.189,top=3.801;panes++;
   const result=box.call(this,(left+right)/2,(bottom+top)/2,z,right-left,top-bottom,d,c,mat,...rest);
   // Keep the existing two diagonal families and spacing; clip to the actual frame opening.
   for(const slope of[-.58,.58]){const height=top-bottom,lo=Math.min(left,left-slope*height),hi=Math.max(right,right-slope*height);
    for(let q=Math.ceil(lo/.23)*.23;q<hi;q+=.23){const ya=(left-q)/slope,yb=(right-q)/slope,low=Math.max(0,Math.min(ya,yb)),high=Math.min(height,Math.max(ya,yb));
     if(high-low>.018)beam.call(this,[q+slope*low,bottom+low,plane+.012],[q+slope*high,bottom+high,plane+.012],.011,'#714132',37);
    }
   }return result;
  }
  if(mat===29&&near(Math.abs(x-mid),.12)&&near(y,1.82)&&near(z,plane+.11)&&near(w,.035)&&near(h,.035)&&near(d,.12)){
   feet++;return box.call(this,x,y,plane+.07875,w,h,.1825,c,mat,...rest);
  }
  return box.call(this,x,y,z,w,h,d,c,mat,...rest);
 };
 b.beam=function(a,c,r,color,mat,...rest){
  if(mat===37&&near(r,.011)&&near(a[2],plane+.012)&&near(c[2],plane+.012)&&Math.min(a[1],c[1])>=3.19-1e-8&&Math.max(a[1],c[1])<=3.79+1e-8){removedRods++;return;}
  return beam.call(this,a,c,r,color,mat,...rest);
 };
 try{const result=previous.call(this,b,f,add);if(panes!==4||feet!==2||removedRods!==35)throw Error('Chem55 upstream joints changed: '+[panes,feet,removedRods]);return result;}
 finally{if(ownsBox)b.box=box;else delete b.box;if(ownsBeam)b.beam=beam;else delete b.beam;}
};
Y.Chem55Joints168={openings:[[-1.60,-1.03],[-.95,-.04],[.04,.95],[1.03,1.60]],dimensionFitted:true};
})(YY);
