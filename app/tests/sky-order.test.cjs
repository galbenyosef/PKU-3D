const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function fixture(clearStart,count,pass=0,enabled=true){
 const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8'),c);
 const e=Object.create(c.YY.Engine.prototype),events=[];let current;
 const gl={useProgram(){},bindVertexArray(v){current=v;},drawArraysInstanced(){events.push(current);},enable(){},disable(){},depthMask(){},blendFunc(){}};
 const items=Array.from({length:count},(_,i)=>({b:{resource:{},vertexCount:3},record:{vao:'mesh-'+i,count:1}}));
 Object.assign(e,{gl,main:{p:{}},glass:{p:{}},state:{specializedFoliage:false,skyAfterOpaque:enabled},stats:{},shadowTarget:{},reflectTarget:{},
  stateUniforms(){},sampler(){},visibleScene(){return{drawItems:items,drawClearStart:clearStart};},people:{draw(){events.push('people');}},sky(vp,eye,behindOpaque){assert.equal(behindOpaque,true);events.push('sky');}});
 e.draw(e.main,[],[],pass);return events;
}
test('opaque geometry and people precede sky, which precedes every transparent pane',()=>{
 for(const pass of [0,3])assert.deepEqual(fixture(2,4,pass),['mesh-0','mesh-1','people','sky','mesh-2','mesh-3']);
});
test('empty, entirely opaque and entirely transparent scenes each receive one sky pass',()=>{
 assert.deepEqual(fixture(0,0),['people','sky']);
 assert.deepEqual(fixture(2,2),['mesh-0','mesh-1','people','sky']);
 assert.deepEqual(fixture(0,2),['people','sky','mesh-0','mesh-1']);
});
test('picking and shadow passes never draw sky; diagnostic legacy ordering remains available',()=>{
 for(const pass of [1,2])assert.deepEqual(fixture(1,2,pass),['mesh-0','mesh-1']);
 assert.deepEqual(fixture(1,2,0,false),['mesh-0','people','mesh-1']);
});
