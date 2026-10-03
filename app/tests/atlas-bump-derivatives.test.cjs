const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8');
function block(start){const open=source.indexOf('{',start);let depth=1,end=open+1;for(;depth;end++){if(source[end]==='{')depth++;if(source[end]==='}')depth--;assert.ok(end<source.length,'balanced shader braces');}return source.slice(open+1,end-1);}
const atlas=block(source.indexOf('if(mat<18.'));
const functions=new Map();for(const m of source.matchAll(/\b(?:vec[234]|float|bool|void)\s+(\w+)\([^{};]*\)\s*\{/g))functions.set(m[1],block(m.index));
const calls=s=>[...s.matchAll(/\b(\w+)\s*\(/g)].map(m=>m[1]);
function reachable(body,seen=new Set()){for(const name of calls(body)){if(seen.has(name))continue;seen.add(name);if(functions.has(name))reachable(functions.get(name),seen);}return seen;}
const branch=atlas.match(/if\(dist<260\.\)([^;]+);/);
test('distance-controlled atlas normal path has no direct or transitive derivative calls',()=>{
 assert.ok(branch,'preserve the existing distant bump-work cutoff');
 const invoked=reachable(branch[1]);for(const name of['dFdx','dFdy','fwidth','texture','textureGrad'])assert.ok(!invoked.has(name),`${name} executes under the nonuniform distance branch`);
 const prior=atlas.slice(0,branch.index);assert.ok(prior.includes('dFdx(vWorld)')&&prior.includes('dFdy(vWorld)'),'world derivatives dominate distance branch');
 assert.ok(prior.includes('dFdx(height)')&&prior.includes('dFdy(height)'),'height derivatives dominate distance branch');
});
test('far atlas pixels still skip cross products and normalization, with no extra texture lookup',()=>{
 assert.ok(branch);const invoked=reachable(branch[1]);assert.ok(invoked.has('cross'));assert.ok(invoked.has('normalize'));
 assert.equal(calls(atlas).filter(n=>n==='material').length,1);
 const outside=atlas.slice(0,branch.index)+atlas.slice(branch.index+branch[0].length),outsideCalls=reachable(outside);
 assert.ok(!outsideCalls.has('cross'));assert.ok(!outsideCalls.has('normalize'));
});
test('near atlas perturbation retains the original bump equation and relief amplitude',()=>{
 const helper=functions.get('bumpWithDerivatives'),original=functions.get('bump');assert.ok(helper);
 const equation=s=>s.match(/return\s+([^;]+);/)[1].replace(/\s+/g,'');
 assert.equal(equation(helper),equation(original).replaceAll('dFdx(height)','dh.x').replaceAll('dFdy(height)','dh.y'));
 assert.match(atlas,/float height=t\.a\*relief/);assert.match(atlas,/if\(mat==13\.\|\|mat==9\.\|\|mat==0\.\)relief=\.006/);
 assert.match(branch[1],/n=bumpWithDerivatives\(n,surfaceDx,surfaceDy,heightGradient\)/);
});
