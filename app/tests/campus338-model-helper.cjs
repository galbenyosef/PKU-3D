// CPU model checks: load the maintained index in its real order, stopping before UI startup.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const APP=path.resolve(__dirname,'..');
function load({skip=[],transform}={}){
 const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*30})},{get:(o,k)=>o[k]||(()=>{})})})},window:{},location:{},navigator:{}});
 vm.runInContext('var YY={};',ctx);
 const scripts=[...fs.readFileSync(path.join(APP,'index.html'),'utf8').matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(scripts.includes('src/scene-v29.js'),'real model chain boundary exists');
 const loaded=[];
 for(const file of scripts){
  if(file==='src/scene-v29.js')break;
  if(skip.includes(file))continue;
  let code=fs.readFileSync(path.join(APP,file),'utf8');
  if(transform)code=transform(file,code);
  vm.runInContext(code,ctx,{filename:file});loaded.push(file);
 }
 return{Y:ctx.YY,scripts,loaded};
}
function capture(state,pick){
 const {Y}=state,f=Y.CAMPUS.features.find(f=>f.properties.pickId===pick);assert.ok(f,`pick ${pick} exists`);
 const before=JSON.stringify(Y.CAMPUS.features),out=[];
 const b=new Y.Builder({add(k,g,m,c,p,uv){out.push({k,v:Array.from(g.v),m:Array.from(m),c,p:Array.from(p),uv:uv&&Array.from(uv)});}});
 const result=Y.Architecture30.render(b,f,(k,g,c,mat,id)=>b.e.add(k,g,Y.M.identity(),c,[mat,id,0,0]));
 assert.equal(JSON.stringify(Y.CAMPUS.features),before,'render does not mutate features');
 return{out,result,f,b};
}
module.exports={APP,load,capture};
