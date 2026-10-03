const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
test('discard only transient multisample attachments after resolve, preserving post-process inputs',()=>{
 const c=vm.createContext({YY:{}});vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8'),c);
 const e=Object.create(c.YY.Engine.prototype),events=[],bindings={},ms={},resolved={},color={},depth={};
 const gl={READ_FRAMEBUFFER:1,DRAW_FRAMEBUFFER:2,FRAMEBUFFER:3,COLOR_BUFFER_BIT:4,DEPTH_BUFFER_BIT:8,COLOR_ATTACHMENT0:9,DEPTH_ATTACHMENT:10,NEAREST:11,
  bindFramebuffer(t,f){if(t===this.FRAMEBUFFER){bindings[1]=bindings[2]=f;}else bindings[t]=f;},
  blitFramebuffer(...a){assert.equal(bindings[1],ms);assert.equal(bindings[2],resolved);assert.equal(a[8],12);events.push('resolved');},
  invalidateFramebuffer(t,a){assert.equal(events[0],'resolved');assert.equal(t,this.READ_FRAMEBUFFER);assert.equal(bindings[t],ms);assert.deepEqual(Array.from(a),[9,10]);events.push('discarded');},
  viewport(){},disable(){},depthMask(){},useProgram(){},bindVertexArray(){},drawArrays(){events.push('presented');},enable(){}};
 Object.assign(e,{gl,post:{p:{}},sceneTarget:{msF:ms,f:resolved,tex:color,depth,w:20,h:20},canvas:{width:20,height:20},projection:new Float32Array(16).fill(1),state:{},sampler(p,n,u,t){assert.equal(t,n==='uSceneColor'?color:depth);},uniform(){}});
 e.present();assert.deepEqual(events,['resolved','discarded','presented']);
});
test('reflection pass discards only depth after drawing and clears it before reuse',()=>{
 const c=vm.createContext({YY:{Atmosphere:{fog:()=>0},DATA:{toWorld:()=>[0,0]}}});
 for(const file of ['math.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../src',file),'utf8'),c);
 const e=Object.create(c.YY.Engine.prototype),events=[],reflection={},main={},shadow={};let bound;
 const gl={FRAMEBUFFER:1,DEPTH_ATTACHMENT:2,DEPTH_BUFFER_BIT:4,bindFramebuffer(t,f){bound=f;},viewport(){},enable(){},disable(){},depthFunc(){},
  clear(mask){if(bound===reflection){assert.equal(mask,4);events.push('clear');}},
  invalidateFramebuffer(t,a){assert.equal(bound,reflection);assert.equal(t,1);assert.deepEqual(Array.from(a),[2]);assert.equal(events.at(-1),'draw');events.push('discard-depth');},fenceSync(){return{};},flush(){}};
 Object.assign(e,{gl,aspect:1,canvas:{width:100,height:100},shadowSize:2048,shadowTarget:{f:shadow},reflectTarget:{f:reflection,w:80,h:80},sceneTarget:{msF:main},frameFences:[],frame:0,lastReflection:-1,
  visibleScene(){return{hasWater:true,water:[],items:[]};},sky(){},draw(p,v,eye,pass){if(pass===3)events.push('draw');},present(){},frameAvailable(){}});
 const camera={eye:[0,20,50],target:[0,0,0]},state={hour:10.5,weather:0,time:0};
 e.render(camera,state);e.render({...camera,eye:[1,20,50]},state);
 assert.deepEqual(events,['clear','draw','discard-depth','clear','draw','discard-depth']);
});
