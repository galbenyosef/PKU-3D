const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=process.env.PKU_APP_ROOT||path.resolve(__dirname,'..');
const engineSource=fs.readFileSync(path.join(root,'src/engine.js'),'utf8');

// Execute the maintained Engine; only driver completion and scheduling are fake.
function fixture({extension=true,failure=null}={}){
 let now=0,timerId=0,lost=false;
 const timers=new Map(),shaders=[],programs=[],queries=[];
 const context=vm.createContext({YY:{M:require(path.join(root,'src/math.js'))},
  performance:{now:()=>now},
  setTimeout(fn,delay){const id=++timerId;timers.set(id,{fn,at:now+delay});return id;},
  clearTimeout(id){timers.delete(id);}});
 vm.runInContext(engineSource,context);
 const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,
  getExtension(name){assert.equal(name,'KHR_parallel_shader_compile');return extension?{COMPLETION_STATUS_KHR:5}:null;},
  isContextLost:()=>lost,
  createShader(){const s={deleted:0};shaders.push(s);return s;},shaderSource(){},compileShader(){},
  getShaderParameter(){queries.push('compile');if(extension)assert(programs.every(p=>p.complete));return failure!=='compile';},
  getShaderInfoLog:()=> 'compile failure',deleteShader(s){s.deleted++;},
  createProgram(){const p={complete:false,deleted:0};programs.push(p);return p;},attachShader(){},detachShader(){},linkProgram(){},
  getProgramParameter(p,key){if(key===5){queries.push('completion');return p.complete;}queries.push('link');if(extension)assert(programs.every(p=>p.complete));return failure!=='link';},
  getProgramInfoLog:()=> 'link failure',deleteProgram(p){p.deleted++;},
  deleteVertexArray(){},deleteBuffer(){},deleteSync(){},deleteTexture(){}};
 const e=Object.assign(Object.create(context.YY.Engine.prototype),{gl,buckets:new Map(),visibilityCaches:new Map(),meshResources:[]});
 e.compilePrograms(true);
 return{e,shaders,programs,queries,timers,lose(){lost=true;},
  complete(){for(const p of programs)p.complete=true;},
  step(){assert.equal(timers.size,1,'one outstanding readiness timer');const [id,t]=[...timers][0];timers.delete(id);now=t.at;t.fn();},
  released(){assert.equal(timers.size,0);assert(shaders.every(s=>s.deleted===1),'stages released exactly once');assert(programs.every(p=>p.deleted===1),'programs released exactly once');}};
}

test('KHR wait is shared and yields until every program completes before checking status',async()=>{
 const f=fixture(),ready=f.e.waitForPrograms();let settled=false;ready.then(()=>settled=true);
 assert.equal(f.e.waitForPrograms(),ready);assert.deepEqual(f.queries,[]);
 f.step();await Promise.resolve();assert.equal(settled,false);assert(f.queries.every(q=>q==='completion'));
 for(const p of f.programs.slice(0,-1))p.complete=true;
 f.step();await Promise.resolve();assert.equal(settled,false);assert(f.queries.every(q=>q==='completion'));
 f.complete();f.step();await ready;
 assert.equal(f.queries.filter(q=>q==='compile').length,f.shaders.length);
 assert.equal(f.queries.filter(q=>q==='link').length,f.programs.length);
 const count=f.queries.length;await f.e.waitForPrograms();assert.equal(f.queries.length,count);
 f.e.dispose();f.e.dispose();f.released();
});

test('extension-free fallback still validates all shaders and programs',async()=>{
 const f=fixture({extension:false}),ready=f.e.waitForPrograms();f.step();await ready;
 assert(!f.queries.includes('completion'));assert.equal(f.queries.filter(q=>q==='compile').length,f.shaders.length);
 assert.equal(f.queries.filter(q=>q==='link').length,f.programs.length);f.e.dispose();f.released();
});

test('compile/link failure remains rejected on later waits and releases failed handles once',async()=>{
 for(const failure of ['compile','link']){
  const f=fixture({failure});f.complete();
  const rejected=assert.rejects(f.e.waitForPrograms(),new RegExp(failure+' failure'));f.step();await rejected;
  await assert.rejects(f.e.waitForPrograms(),new RegExp(failure+' failure'));
  f.e.dispose();f.e.dispose();f.released();
 }
});

test('timeout persists until a fresh batch, which can validate successfully',async()=>{
 const f=fixture();const rejected=assert.rejects(f.e.waitForPrograms({timeoutMs:1,pollMs:1}),/timed out/);
 f.step();f.step();await rejected;await assert.rejects(f.e.waitForPrograms(),/timed out/);
 assert(f.queries.every(q=>q==='completion'),'timeout never forces blocking validation');
 f.e.compilePrograms(true);f.complete();const ready=f.e.waitForPrograms();f.step();await ready;
 f.e.dispose();f.released();
});

test('disposal, context loss and stage cancellation terminate waits without duplicate releases',async()=>{
 for(const cause of ['dispose','context loss','stage release']){
  const f=fixture(),rejected=assert.rejects(f.e.waitForPrograms(),{name:'AbortError'});
  if(cause==='dispose')f.e.dispose();
  else if(cause==='stage release')f.e.releaseProgramStages();
  else{f.lose();f.step();}
  await rejected;await assert.rejects(f.e.waitForPrograms(),{name:'AbortError'});
  assert.deepEqual(f.queries,[],'cancel before driver status queries');
  f.e.dispose();f.e.dispose();f.released();
 }
});
