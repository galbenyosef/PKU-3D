const test=require('node:test');
const assert=require('node:assert/strict');
const {prepare,planes}=require('../src/reflection-footprint.js');
const M=require('../src/math.js');

const canvas={width:1440,height:1000},target={w:896,h:622};
function water(points=[[-35,-25],[40,-20],[-20,45]],height=0,id=1){
 const vertices=new Float32Array(points.flatMap(([x,z])=>[x,height,z,0,1,0,0,0]));
 const data=new Float32Array(28);data.set(M.identity());data[20]=4;data[21]=id;data[23]=1.5;
 return{vertices,data,resource:{reflectionFootprint:prepare(vertices)},uniformMaterial:4,count:1,materials:new Set([4])};
}
const scene=buckets=>({items:buckets.map(b=>({b}))});
const query=(buckets,main,reflection,state={})=>planes(scene(buckets),main,reflection,canvas,target,state);
function project(matrix,point){const q=M.apply(matrix,[...point,1]);return[q[0]/q[3]*.5+.5,q[1]/q[3]*.5+.5];}
function cameras(eye,look,level){
 const p=M.perspective(.8,canvas.width/canvas.height,.15,6500);p[8]=.12;p[9]=-.08;
 return{main:M.multiply(p,M.lookAt(eye,look)),reflection:M.multiply(p,M.lookAt([eye[0],2*level-eye[1],eye[2]],[look[0],2*level-look[1],look[2]],[0,-1,0]))};
}
// Independent 2x2 ray/plane solve. No footprint inverse/hull helpers are used.
function worldAtScreen(m,y,[u,v]){
 const x=2*u-1,z=2*v-1,a=m[0]-x*m[3],b=m[8]-x*m[11],c=x*(m[7]*y+m[15])-m[4]*y-m[12];
 const d=m[1]-z*m[3],e=m[9]-z*m[11],f=z*(m[7]*y+m[15])-m[5]*y-m[13],det=a*e-b*d;
 assert.ok(Math.abs(det)>1e-12);return[(c*e-b*f)/det,y,(a*f-c*d)/det];
}
// Double-precision elimination keeps the sample-point oracle independent.
function inverse4(m){
 const rows=Array.from({length:4},(_,r)=>Array.from({length:8},(_,c)=>c<4?m[c*4+r]:+(c-4===r)));
 for(let c=0;c<4;c++){
  let pivot=c;for(let r=c+1;r<4;r++)if(Math.abs(rows[r][c])>Math.abs(rows[pivot][c]))pivot=r;
  [rows[c],rows[pivot]]=[rows[pivot],rows[c]];const scale=rows[c][c];assert.ok(Math.abs(scale)>1e-12);
  for(let k=0;k<8;k++)rows[c][k]/=scale;
  for(let r=0;r<4;r++)if(r!==c){const factor=rows[r][c];for(let k=0;k<8;k++)rows[r][k]-=factor*rows[c][k];}
 }
 return Array.from({length:16},(_,i)=>rows[i%4][4+Math.floor(i/4)]);
}
function assertTextureTaps(accepted,inverse,uv){
 for(const dx of[-.002592,.002592])for(const dy of[-.002592,.002592]){
  const x=Math.max(.001,Math.min(.999,uv[0]+dx))*target.w-.5,y=Math.max(.001,Math.min(.999,uv[1]+dy))*target.h-.5;
  for(let ix of[Math.floor(x),Math.ceil(x)])for(let iy of[Math.floor(y),Math.ceil(y)]){
   ix=Math.max(0,Math.min(target.w-1,ix));iy=Math.max(0,Math.min(target.h-1,iy));
   const q=M.apply(inverse,[(ix+.5)/target.w*2-1,(iy+.5)/target.h*2-1,0,1]),point=q.slice(0,3).map(v=>v/q[3]);
   for(const p of accepted)assert.ok(M.dot(p.slice(0,3),point)+p[3]>=-1e-7,'required ripple/bilinear texel was rejected');
  }
 }
}

test('planar source metadata preserves uploaded vertices and rejects uncertain geometry',()=>{
 const b=water(),before=Array.from(b.vertices);assert.ok(b.resource.reflectionFootprint);assert.deepEqual(Array.from(b.vertices),before);
 const nonplanar=b.vertices.slice();nonplanar[9]=1;assert.equal(prepare(nonplanar),null);
 const invalid=b.vertices.slice();invalid[0]=NaN;assert.equal(prepare(invalid),null);
 assert.equal(prepare(water([[0,0],[1,1],[2,2]]).vertices),null);
});

test('eight support planes retain clamp-fold intersections and maximum ripple/filter taps',()=>{
 // Main coordinates are x/z, making the reference points directly observable.
 const main=new Float32Array([.01,0,0,0,0,0,.01,0,0,.01,0,0,0,0,0,1]);
 const b=water([[-90,-90],[90,-90],[-90,90]]);
 for(const sx of[-1,1])for(const sy of[-1,1]){
  const reflection=main.slice();reflection[12]=sx*.8;reflection[13]=sy*.8;
  const accepted=query([b],main,reflection);assert.ok(accepted);assert.equal(accepted.length,8);
  const inverse=inverse4(reflection);
  // These include points along edges crossing UV clamp folds, not just vertices.
  for(let i=0;i<=12;i++)for(let j=0;j<=12-i;j++)assertTextureTaps(accepted,inverse,project(reflection,[-90+180*i/12,0,-90+180*j/12]));
 }
});

test('non-centroid MSAA positions remain covered across heights, transforms and explosion',()=>{
 const {main,reflection}=cameras([120,150,200],[-10,0,-40],3),state={selected:2,explode:4};
 const buckets=[water(undefined,-3,1),water(undefined,12,2),water(undefined,0,3)];
 buckets[2].data.set(M.transform([20,-4,-30],[-1.2,1,1.4],.65));
 const accepted=query(buckets,main,reflection,state);assert.ok(accepted);assert.equal(accepted.length,8);
 const inverse=inverse4(reflection);
 for(const b of buckets){
  const world=[];for(let i=0;i<b.vertices.length;i+=8){const p=M.apply(b.data,[...b.vertices.slice(i,i+3),1]);if(b.data[21]===state.selected)p[1]+=state.explode*b.data[23];world.push(p.slice(0,3));}
  for(let i=0;i<world.length;i++)for(const t of[0,.25,.5,.75,1]){
   const point=world[i].map((v,k)=>v+(world[(i+1)%world.length][k]-v)*t),covered=project(main,point);
   assert.ok(covered.every(v=>v>0&&v<1));
   // An edge-covered subsample may shade at a centre outside the triangle.
   for(const dx of[-.5,.5])for(const dy of[-.5,.5]){
    const center=[covered[0]+dx/canvas.width,covered[1]+dy/canvas.height];
    assertTextureTaps(accepted,inverse,project(reflection,worldAtScreen(main,point[1],center)));
   }
  }
 }
});

test('near-horizon, different-height MSAA counterexample fails open',()=>{
 const eye=[0,.1,0],look=[0,.1,-1],p=M.perspective(.8,canvas.width/canvas.height,.15,6500);
 const main=M.multiply(p,M.lookAt(eye,look)),reflection=M.multiply(p,M.lookAt([0,5.9,0],[0,5.9,-1],[0,-1,0]));
 const covered=[720.375/canvas.width,499.875/canvas.height];
 const triangle=[[-.02,-.02],[.02,-.02],[0,.03]].map(([dx,dy])=>worldAtScreen(main,0,[covered[0]+dx/canvas.width,covered[1]+dy/canvas.height]));
 assert.equal(query([water(triangle.map(v=>[v[0],v[2]]))],main,reflection),null);
 assert.equal(query([water(undefined,1e20)],main,reflection),null);
 const level=cameras([0,0,100],[0,0,0],0);assert.equal(query([water()],level.main,level.reflection),null);
});

test('mixed, animated, tilted or missing water metadata retains original culling',()=>{
 const {main,reflection}=cameras([120,150,200],[-10,0,-40],3);
 for(const mutate of[b=>{b.uniformMaterial=null;b.materials.add(8);},b=>b.count=2,b=>b.data[22]=1,b=>b.data[1]=.01,b=>b.data[9]=.01,b=>b.resource.reflectionFootprint=null]){
  const b=water();mutate(b);assert.equal(query([b],main,reflection),null);
 }
 for(const state of[{reflectionFootprint:false},{selected:1.05},{selected:16777217,explode:1},{explode:Infinity}])assert.equal(query([water()],main,reflection,state),null);
 assert.equal(query([water()],new Float32Array(16),reflection),null);
});

test('static metadata reuse agrees with fresh queries after transform and selection changes',()=>{
 const {main,reflection}=cameras([120,150,200],[-10,0,-40],3),cached=water();assert.ok(query([cached],main,reflection));
 cached.data[12]=22;
 for(const state of[{}, {selected:1,explode:3}]){
  const fresh=water();fresh.data.set(cached.data);
  assert.deepEqual(query([cached],main,reflection,state),query([fresh],main,reflection,state));
 }
 const replacement=water([[-50,-20],[25,-30],[0,65]]);cached.resource.reflectionFootprint=replacement.resource.reflectionFootprint;replacement.data.set(cached.data);
 assert.deepEqual(query([cached],main,reflection),query([replacement],main,reflection));
});
