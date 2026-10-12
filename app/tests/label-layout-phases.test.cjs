// Production label selection/application with synthetic projection and DOM rectangles; not browser timing.
const test=require('node:test'),path=require('node:path'),fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.resolve(__dirname,'../src/app-v29.js'),'utf8');
const line=(s,n)=>{const l=s.split('\n').find(x=>x.startsWith('function '+n+'('));assert(l,n);return l};
function harness(){
 const events=[],nodes=[],clicks=[],panels={};let c;
 const record=(type,detail)=>events.push({type,detail});
 function node(){const n={attrs:{},_style:{},_hidden:false};Object.defineProperty(n,'hidden',{get:()=>n._hidden,set(v){n._hidden=v;record(v?'hide':'write','hidden')}});for(const k of ['className','textContent','onclick'])Object.defineProperty(n,k,{get:()=>n['_'+k],set(v){n['_'+k]=v;record('write',k)}});n.style=new Proxy(n._style,{set(o,k,v){o[k]=v;record('write','style.'+k);return true}});n.setAttribute=(k,v)=>{n.attrs[k]=v;record('write',k)};return n}
 for(const id of ['catalog','detail','environment','route-panel'])panels[id]={hidden:true,rect:{left:0,top:0,right:0,bottom:0},getBoundingClientRect(){record('read',id);return this.rect}};
 const container={append(n){record('write','append');nodes.push(n)}};
 c={ready:true,mode:'3d',selected:0,state:{labels:true,isolate:0},orbit:{distance:800,target:[0,0,0]},planView:{w:800},innerWidth:1440,innerHeight:1000,selectable:[],featured:['f2','f4'],labelNodes:new Map(),Math,root:{classList:{contains:()=>c.catalogHidden}},catalogHidden:false,$:id=>id==='labels'?container:panels[id],document:{createElement(){record('write','create');return node()}},select:(id,flag)=>clicks.push([id,flag]),Y:{Landscape42:{elevation(x,z){record('elevation',[x,z]);return c.elevation}},Dorm45Basement338:{hide(){record('dorm','hide')},draw3D(){record('dorm','draw3D')}}},elevation:0,people:[],engine:{people:{labelBoxes(){record('people',null);return c.people.map(x=>[...x])}},project(p){record('read','project');return{x:p[0],y:p[2]-p[1],visible:p[0]>=0}}}};
 vm.createContext(c);for(const n of ['labelCandidates','blocked','drawLabels'])vm.runInContext(line(src,n),c);
 function snap(){return{nodes:[...c.labelNodes].map(([id,n])=>({id,hidden:n.hidden,text:n.textContent,className:n.className,attrs:n.attrs,style:n._style})),appendOrder:nodes.map(n=>n.textContent),clicks:JSON.parse(JSON.stringify(clicks))}}
 return{c,events,panels,run(){events.length=0;c.drawLabels();return JSON.parse(JSON.stringify(snap()))},click(){for(const n of c.labelNodes.values())n.onclick();return snap().clicks}};
}
function feature(i,x,y){return{properties:{id:'f'+i,pickId:i,name:i===1?'未名湖':'name'+i,label:'Label'+i,displayName:'D'+i,height:10,centre:[x,y],precinct32:i%7===0}}}
function shown(h){return [...h.c.labelNodes].filter(([,n])=>!n.hidden).map(([id])=>id)}
function assertReadPhase(h){const firstWrite=h.events.findIndex(e=>e.type==='write'),lastRead=h.events.findLastIndex(e=>e.type==='read');assert(firstWrite>=0,'fixture must update labels');assert(lastRead>=0,'fixture must project/read layout');assert(lastRead<firstWrite,'all projection and blocker reads must precede chosen-label DOM writes')}

test('label planning finishes layout reads before updates on both creation and retained nodes',()=>{
 const h=harness();h.c.featured=[];h.c.selectable=[feature(10,150,230),feature(11,420,340),feature(12,690,450)];
 h.panels.detail.hidden=false;h.panels.detail.rect={left:1100,top:100,right:1400,bottom:800};
 h.run();assertReadPhase(h);assert.deepEqual(shown(h),[10,11,12]);assert(h.events.some(e=>e.type==='read'&&e.detail==='detail'));
 const original=h.c.labelNodes.get(10);h.c.selectable[0].properties.centre=[200,240];h.run();assertReadPhase(h);assert.equal(h.c.labelNodes.get(10),original);
 const firstRead=h.events.findIndex(e=>e.type==='read');assert.equal(h.events.slice(0,firstRead).filter(e=>e.type==='hide').length,3);
});

test('feature and panel changes between calls remain live while retained labels keep their handlers',()=>{
 const h=harness();h.c.featured=[];h.c.selectable=[feature(10,150,230),feature(11,420,340)];h.run();const retained=h.c.labelNodes.get(10),handler=retained.onclick;
 h.c.selectable[0].properties.centre=[210,270];h.c.selectable[0].properties.height=20;h.c.elevation=3;h.c.selected=10;
 h.panels.detail.hidden=false;h.panels.detail.rect={left:380,top:290,right:470,bottom:360};h.c.selectable.push(feature(12,690,450));h.run();
 assert.deepEqual(shown(h),[10,12]);assert.equal(retained.style.left,'210px');assert.equal(retained.style.top,'243px');assert.equal(retained.attrs['aria-current'],'true');assert.equal(retained.onclick,handler);
 const fresh=h.c.labelNodes.get(12);assert.equal(fresh.textContent,'Label12');assert.equal(fresh.attrs['aria-label'],'查看Label12');assert.deepEqual(h.click(),[[10,true],[11,true],[12,true]]);
 h.panels.detail.hidden=true;h.c.selectable=h.c.selectable.filter(f=>f.properties.pickId!==12);h.c.state.isolate=11;h.run();assert.deepEqual(shown(h),[11]);assert.equal(fresh.hidden,true);
});

test('priority, collision occupancy, and mobile or desktop label budgets preserve chosen order',()=>{
 for(const [width,height,limit]of[[390,1000,8],[1440,1400,18]]){
  const h=harness();h.c.featured=[];h.c.innerWidth=width;h.c.innerHeight=height;h.c.selectable=Array.from({length:24},(_,i)=>feature(100+i,80+(i%2)*190,200+Math.floor(i/2)*60));h.c.selected=105;h.run();
  const expected=[105,...Array.from({length:24},(_,i)=>100+i).filter(id=>id!==105)].slice(0,limit);assert.deepEqual(shown(h),expected);assert.equal(h.c.labelNodes.get(105).attrs['aria-current'],'true');
 }
 const h=harness();h.c.featured=[];h.c.selectable=[feature(10,150,230),feature(11,150,230),feature(12,420,340)];h.c.people=[[100,200,100,40]];h.run();assert.deepEqual(shown(h),[12],'people occupancy blocks overlapping label candidates');
 h.c.people=[];h.run();assert.deepEqual(shown(h).sort((a,b)=>a-b),[10,12],'first chosen label blocks its overlapping successor');
});

test('plan, not-ready and disabled-label paths preserve their original hide and projection behavior',()=>{
 const h=harness();h.c.selectable=[feature(10,150,230)];h.run();const retained=h.c.labelNodes.get(10);
 h.c.mode='plan';h.run();assert.equal(retained.hidden,false);assert.deepEqual(h.events,[{type:'dorm',detail:'hide'}]);
 h.c.mode='3d';h.c.ready=false;h.run();assert.equal(retained.hidden,false);assert.deepEqual(h.events,[{type:'dorm',detail:'hide'}]);
 h.c.ready=true;h.c.state.labels=false;h.run();assert.equal(retained.hidden,true);assert.deepEqual(h.events.map(e=>e.type),['dorm','hide']);
});
