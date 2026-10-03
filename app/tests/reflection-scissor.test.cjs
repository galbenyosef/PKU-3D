const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync('app/src/engine.js','utf8'),c);
const e=Object.create(c.YY.Engine.prototype);e.state={selected:0,explode:0};e.reflectTarget={w:896,h:620};
const vp=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function bucket(){return{materials:new Set([4]),uniformMaterial:4,count:1,data:new Float32Array(28),waterRanges:[[0,6,0,0,0,.2,.1,.3]]};}
function scene(b){return{items:[{b}]};}
test('water sampling remains inside scissor including maximum ripple and filter footprint',()=>{
 const b=bucket();
 // Sample a volume rather than only the extrema used by the implementation.
 for(const shift of[-2,-.6,0,.6,2])for(const tilt of[-.4,0,.4]){
  const m=vp.slice();m[12]=shift;m[7]=tilt;m[11]=tilt;
  const rect=e.reflectionScissor(scene(b),m);assert.ok(rect);
  for(let i=0;i<100;i++){
   const x=Math.sin(i*1.7)*.2,y=Math.sin(i*2.9)*.1,z=Math.cos(i*.7)*.3,w=m[7]*y+m[11]*z+1;
   for(const sign of[-1,1]){
    const u=Math.max(.001,Math.min(.999,((x+shift)/w*.5+.5)+sign*.002592));
    const v=Math.max(.001,Math.min(.999,(y/w*.5+.5)+sign*.002592));
    assert.ok(Math.max(0,u*896-1)>=rect[0]&&Math.min(896,u*896+1)<=rect[0]+rect[2]);
    assert.ok(Math.max(0,v*620-1)>=rect[1]&&Math.min(620,v*620+1)<=rect[1]+rect[3]);
   }
  }
 }
});
test('eye-plane crossing, mixed materials, missing bounds and diagnostic switch use full reflection',()=>{
 const b=bucket(),m=vp.slice();m[15]=.01;m[11]=1;assert.equal(e.reflectionScissor(scene(b),m),null);
 b.uniformMaterial=null;assert.equal(e.reflectionScissor(scene(b),vp),null);b.uniformMaterial=4;
 delete b.waterRanges;assert.equal(e.reflectionScissor(scene(b),vp),null);
 e.state.reflectionScissor=false;assert.equal(e.reflectionScissor(scene(bucket()),vp),null);delete e.state.reflectionScissor;
});
test('selected exploded water expands in its shifted projection without mutating bounds',()=>{
 const b=bucket();b.data[21]=9;b.data[23]=.2;e.state={selected:9,explode:2};
 const before=JSON.stringify(b.waterRanges),r=e.reflectionScissor(scene(b),vp);assert.ok(r[1]>360);assert.equal(JSON.stringify(b.waterRanges),before);e.state={selected:0,explode:0};
});
test('prepared water bounds include affine rotation, mirrored scale and safety padding',()=>{
 const b=bucket();b.data.set([0,0,-2,0,0,1,0,0,-3,0,0,0,10,-3,20,1]);
 b.resource={waterBounds:[-1,0,-2,1,0,2]};b.vertexCount=6;e.prepareRanges(b);
 const r=b.waterRanges[0];assert.deepEqual(Array.from(r.slice(2,5)),[10,-3,20]);
 assert.ok(Math.abs(r[5]-6.05)<1e-8&&Math.abs(r[6]-.05)<1e-8&&Math.abs(r[7]-2.05)<1e-8);
 assert.equal(b.worldRanges,undefined);
});
test('cropped reflection frustum retains every pixel within the scissor and clips outside geometry',()=>{
 const ctx=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync('app/src/math.js','utf8'),ctx);vm.runInContext(fs.readFileSync('app/src/engine.js','utf8'),ctx);
 const engine=Object.create(ctx.YY.Engine.prototype);engine.state={};engine.reflectTarget={w:100,h:100};
 const rect=[30,20,40,30],planes=engine.reflectionPlanes(vp,rect),visible=(x,y,z)=>ctx.YY.M.sphereVisible(planes,[x,y,z],0);
 for(let x=-.4;x<=.4;x+=.02)for(let y=-.6;y<=0;y+=.02)assert.ok(visible(x,y,0));
 assert.equal(visible(.8,0,0),false);assert.equal(visible(0,.7,0),false);assert.equal(visible(0,-.3,2),false);
 assert.deepEqual(Array.from(vp),[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
 engine.state.reflectionFrustum=false;assert.equal(ctx.YY.M.sphereVisible(engine.reflectionPlanes(vp,rect),[.8,0,0],0),true);
});
test('off-centre perspective crop preserves scissor-interior points across depth',()=>{
 const ctx=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync('app/src/math.js','utf8'),ctx);vm.runInContext(fs.readFileSync('app/src/engine.js','utf8'),ctx);
 const {M}=ctx.YY,engine=Object.create(ctx.YY.Engine.prototype);engine.state={};engine.reflectTarget={w:896,h:620};
 const projection=M.perspective(.8,896/620,.15,6500);projection[8]=.22;projection[9]=-.34;
 const matrix=M.multiply(projection,M.lookAt([300,-160,440],[20,0,-100],[0,-1,0])),inverse=M.inverse(matrix),planes=engine.reflectionPlanes(matrix,[110,90,510,310]);
 for(const u of [110/896,.4,620/896])for(const v of [90/620,.4,400/620])for(const depth of [-.9,0,.9,.999]){
  const q=[u*2-1,v*2-1,depth,1],world=[0,1,2,3].map(i=>q.reduce((s,a,j)=>s+a*inverse[j*4+i],0));
  assert.ok(M.sphereVisible(planes,world.slice(0,3).map(a=>a/world[3]),.0001));
 }
});
