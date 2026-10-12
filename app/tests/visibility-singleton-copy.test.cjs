const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function fixture(){
 const c=vm.createContext({YY:{}});
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/visibility.js'),'utf8'),c);
 const b=vm.runInContext(`(()=>{
  const data=new Float32Array(28),words=new Uint32Array(data.buffer);
  for(let i=0;i<28;i++)words[i]=[0x80000000,0x7fc12345,0x7f812345,1][i%4];
  data[20]=29;data[21]=188;data[23]=2;
  return {data,spatial:new Float32Array([0,0,0,1,10]),count:1,detailWidth:0};
 })()`,c);
 c.YY.Visibility.compile(b);
 return{c,b,V:c.YY.Visibility};
}
const bytes=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
const state={selected:0,isolate:0,explode:0,detailLOD:false,vegetation:true};

for(const transfer of [true,false])test('singleton append preserves raw float bits and existing prefix during growth; transfer='+transfer,()=>{
 const{c,b,V}=fixture();if(!transfer)vm.runInContext('ArrayBuffer.prototype.transfer=undefined',c);
 const stream=vm.runInContext('({data:new Float32Array(28),used:28})',c);
 stream.data.fill(-17);const prefix=Buffer.from(bytes(stream.data)),source=Buffer.from(bytes(b.data));
 const result={count:99,culled:99};assert.equal(V.select(b,[],[0,0,100],1000,state,stream,true,true,result),result);
 assert.equal(result.count,1);assert.equal(result.culled,0);assert.equal(stream.used,28);
 assert.deepEqual(bytes(stream.data.subarray(0,28)),prefix);
 assert.deepEqual(bytes(stream.data.subarray(28,56)),source);assert.deepEqual(bytes(b.data),source);
});

test('singleton rejection clears the result without writing the stream',()=>{
 const{b,V}=fixture(),stream={data:new Float32Array(56).fill(-17),used:28},before=Buffer.from(bytes(stream.data));
 for(const mode of [{isolate:99},{selected:188,explode:5}]){
  const result={count:99,culled:99};V.select(b,[[0,-1,0,2]],[0,0,100],1000,{...state,...mode},stream,false,true,result);
  assert.equal(result.count,0);assert.equal(result.culled,0);assert.equal(stream.used,28);assert.deepEqual(bytes(stream.data),before);
 }
 const result=V.select(b,[],[0,0,1000],1,{...state,detailLOD:true},stream,false,true);
 assert.equal(result.count,0);assert.equal(result.culled,1);assert.deepEqual(bytes(stream.data),before);
});

test('singleton source/output alias retains safe generic growth and source bytes',()=>{
 const{b,V}=fixture(),source=Buffer.from(bytes(b.data)),stream={data:b.data,used:28};
 const result=V.select(b,[],[0,0,100],1000,state,stream,false,true);
 assert.equal(result.count,1);assert.equal(stream.used,28);
 assert.deepEqual(bytes(stream.data.subarray(0,28)),source);assert.deepEqual(bytes(stream.data.subarray(28,56)),source);
 assert.deepEqual(bytes(b.data),source);
});
