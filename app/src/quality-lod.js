/* Lower-tier geometry selection. High and unknown geometry use the original path. */
(function(Y){'use strict';
 function level(pixels,preset,previous=0,role='tree'){
  const a=role==='roof'?(preset==='low'?3:2):(preset==='low'?90:55),b=preset==='low'?(role==='roof'?1.1:32):0;
  if(previous===0&&pixels>=a*.9)return 0;
  if(previous>0&&pixels>a*1.1)return 0;
  if(b&&(previous===2?pixels<b*1.1:pixels<b*.9))return 2;
  return 1;
 }
 function attach(bucket,resources){
  bucket.lodViews=[bucket,...resources.map(resource=>Object.assign(Object.create(bucket),{resource,vertexCount:resource.vertexCount,passes:new Map(),rangeBounds:null,lodViews:null}))];
 }
 function partition(engine,b,context,stream,count){
  const size=count*28,offset=stream.used;
  if(!engine.qualityScratch||engine.qualityScratch.length<size)engine.qualityScratch=new Float32Array(size);
  if(!engine.qualityLevels||engine.qualityLevels.length<count)engine.qualityLevels=new Uint8Array(count);
  const source=engine.qualityScratch,levels=engine.qualityLevels,state=context.state,preset=engine.qualityPreset;
  source.set(stream.data.subarray(offset,offset+size));
  engine.qualityHistory ||= new Map();let history=engine.qualityHistory.get(context.slot);
  if(!history){history=new Map();engine.qualityHistory.set(context.slot,history);}
  const totals=[0,0,0],eye=context.lodEye,vp=context.vp;
  for(let k=0,i=0;k<count;k++,i+=28){
   const id=source[i+21],height=Math.hypot(source[i+4],source[i+5],source[i+6])*(b.qualityMetric||1),historyKey=b.qualityRole==='roof'?b.qualityKey+':'+id:id;let value=0;
   if(!state.isolate&&id!==state.selected&&state.detailLOD!==false){
    let pixels;
    if(context.slot===2)pixels=height*(b.qualityRole==='roof'?Math.max(Math.hypot(vp[0],vp[1]),Math.hypot(vp[4],vp[5]),Math.hypot(vp[8],vp[9])):Math.hypot(vp[4],vp[5]))*engine.shadowSize*.5;
    else{const distance=Math.max(1,Math.hypot(source[i+12]-eye[0],source[i+13]+height*.5-(context.slot===3?2*context.waterLevel-eye[1]:eye[1]),source[i+14]-eye[2]));pixels=height*context.focal/distance;if(context.slot===3)pixels*=Math.min(1,engine.reflectTarget.h/engine.canvas.clientHeight);}
    value=level(pixels,preset,history.get(historyKey)||0,b.qualityRole);history.set(historyKey,value);
   }
   levels[k]=value;totals[value]++;
  }
  let write=offset;const parts=[];
  for(let lod=0;lod<3;lod++){
   if(!totals[lod])continue;
   for(let k=0;k<count;k++)if(levels[k]===lod){stream.data.set(source.subarray(k*28,k*28+28),write);write+=28;}
   parts.push({b:b.lodViews[lod],count:totals[lod]});
  }
  return parts;
 }
 Y.QualityLOD={level,attach,partition};
})(YY);
