// Only the two non-drawing 879 limits string tokens are excluded from this key.
// These byte positions bind the current generated sources; layout changes fail closed.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const slots={
 'src/data.js':{id:1075996,value:1077245},
 'src/architecture-data.js':{id:298322,value:299054}
};
const identity=Buffer.from('"id":"way/876533970"'),pick=Buffer.from('"pickId":879,'),field=Buffer.from('"limits":');
const omitted=Buffer.from('"__atlas_non_drawing_879_limits_v1__"');
function canonicalSource(file,bytes){
 const s=slots[file];if(!s)return bytes;
 if(!bytes.subarray(s.id,s.id+identity.length).equals(identity)||
    !bytes.subarray(s.value-field.length,s.value).equals(field)||bytes[s.value]!==34)return bytes;
 const record=bytes.subarray(s.id,s.value),p=record.indexOf(pick);
 if(p<0||record.indexOf(pick,p+pick.length)>=0)return bytes;
 for(let i=s.value+1;i<bytes.length;i++){
  const c=bytes[i];if(c<32)return bytes;
  if(c===34)return Buffer.concat([bytes.subarray(0,s.value),omitted,bytes.subarray(i+1)]);
  if(c===92){
   const e=bytes[++i];
   if(e===117){for(let k=0;k<4;k++){const h=bytes[++i];if(!((h>=48&&h<=57)||(h>=65&&h<=70)||(h>=97&&h<=102)))return bytes;}}
   else if(![34,92,47,98,102,110,114,116].includes(e))return bytes;
  }
 }
 return bytes;
}
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function atlasInputHash(root,scripts){
 const inputs=scripts.filter(file=>!file.endsWith('/visibility.js')).map(file=>[file,hash(canonicalSource(file,fs.readFileSync(path.join(root,file))))]);
 return hash(Buffer.from(JSON.stringify(['atlas-input879-v1',inputs])));
}
module.exports={canonicalSource,atlasInputHash};
