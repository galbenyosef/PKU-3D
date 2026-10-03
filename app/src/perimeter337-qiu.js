/* North Qiu entrance, node/380742837. Registered January 2023 street views
   establish silver scissor metalwork, not exact endpoints or motor location.
   The extended display pose follows those photographs. Span is fitted to the
   existing fence opening, not triangulated or surveyed gate endpoints. */
(function(Y){'use strict';
const id='node/380742837',previous=Y.Gates33.render;
const source='https://mapsv0.bdimg.com/?qt=pr3d&fovy=85&quality=100&width=1024&height=768&panoid=0900220012230110133626981AP&heading=292.6149367025832&pitch=0';
// Existing Fences35.plan endpoints, not claimed real gate endpoints.
const fit={south:[471.4224,460.4978],north:[471.771,444.715],source:[470.028,452.521]};
const a=fit.source[1]-fit.south[1],c=fit.source[1]-fit.north[1],n=32,step=(c-a)/n;
const depth=x=>fit.south[0]-fit.source[0]+(x-a)/(c-a)*(fit.north[0]-fit.south[0]);
// At this fitted gate line, mapped 4m service road718 crosses near local x=.09.
// Raise only wheels that sit on its .12m road surface; frame stays continuous.
const wheelGround=x=>Math.abs(x-.09)<2?.10:0;
// Bake unchanged primitive surfaces into one mesh per material. Orthogonal
// primitive transforms permit inverse-transpose normals without a matrix inverse.
function geometry(wheels){
 const g=new Y.Geo.Geometry(),b=new Y.Builder({add(key,mesh,m){
  const lengths=[0,4,8].map(j=>m[j]**2+m[j+1]**2+m[j+2]**2);
  for(let i=0;i<mesh.v.length;i+=8){const v=mesh.v;
   const p=Y.M.apply(m,[v[i],v[i+1],v[i+2],1]).slice(0,3);
   const q=[0,1,2].map(k=>m[k]*v[i+3]/lengths[0]+m[k+4]*v[i+4]/lengths[1]+m[k+8]*v[i+5]/lengths[2]);
   g.vertex(p,Y.M.norm(q),v.slice(i+6,i+8));
  }
 }});
 for(let i=0;i<=n;i++){
  const x=a+i*step,d=depth(x);
  if(wheels){if(i%2===0)for(const z of[-.18,.18])b.beam([x,.095+wheelGround(x),d+z-.035],[x,.095+wheelGround(x),d+z+.035],.095,'#303733',29);continue;}
  for(const z of[-.18,.18]){
   b.box(x,.98,d+z,.033,1.58,.036,'#aeb8b8',29);
   for(const y of[.67,1.28])b.beam([x,y,d+z-.024],[x,y,d+z+.024],.043,'#aeb8b8',29);
   if(i<n)for(const [low,high]of[[.24,1.10],[.86,1.72]]){
    b.beam([x,low,d+z],[x+step,high,depth(x+step)+z],.017,'#aeb8b8',29);
    b.beam([x,high,d+z],[x+step,low,depth(x+step)+z],.017,'#aeb8b8',29);
   }
  }
  b.beam([x,.23,d-.18],[x,.23,d+.18],.018,'#aeb8b8',29);
 }
 return g;
}
Y.Gates33.render=function(b,f){
 if(f.properties.id!==id||f.properties.pickId!==761)return previous.call(this,b,f);
 const old=[b.origin,b.rotation,b.id,b.anim],q=f.geometry.coordinates;
 // Source anchor unchanged; mesh spans existing fence endpoints separately.
 // .02 campus ground and .12 road surface are model levels, not site elevations.
 b.origin=[q[0],.02,q[1]];b.rotation=Math.PI/2;b.id=761;b.anim=0;
 try{for(const wheels of[false,true]){const key='perimeter337-qiu-'+(wheels?'wheels':'scissors');b.mesh(key,b.geo(key,()=>geometry(wheels)),0,0,0,1,1,1,wheels?'#303733':'#aeb8b8',29);}}
 finally{[b.origin,b.rotation,b.id,b.anim]=old;}
 return {profile:'north-qiu-silver-scissor-extended-photo2023',evidenceEpoch:2023,currentAccessVerified:false,fullWidthVerified:false,pose:'extended-photo2023-display-fit',widthSource:'existing-fence-opening-fit'};
};
const f=Y.CAMPUS.features.find(f=>f.properties.id===id&&f.properties.pickId===761);
if(f){const p=f.properties;p.height=1.79;p.heightSource='2023 年历史街景形态拟合，非实测';
 p.architecture={...p.architecture,summary:'银灰交叉剪式伸缩门按历史照片展开显示，横跨现有围栏开口。'};
 p.scopeNote='源地图点位保留；按2023年照片作展开显示。跨度拟合现有模型围栏开口，并非三角配准实测门宽；高度为显示拟合，不表示当前关闭或通行状态。机头位置和两端回墙未确认。';
 p.references=[...(p.references||[]),{title:'北邱门银灰伸缩门 · 注册街景 · 2023-01',url:source}];
}
Y.Perimeter337Qiu={geometry,fit};
})(YY);
