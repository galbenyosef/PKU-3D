/* Release-only data preload for the synchronous live builder. Cached scenes do not call it. */
(function(Y){'use strict';
 const base=document.currentScript?.src||document.baseURI;
 let pending;
 const ready=()=>Y.BUILDER_DATA318.every(item=>Boolean(Y[item.key]));
 Y.loadBuilderData318=function(){
  if(ready())return Promise.resolve();
  if(pending)return pending;
  pending=(async()=>{
   for(const item of Y.BUILDER_DATA318){
    if(Y[item.key])continue;
    await new Promise((resolve,reject)=>{
     const script=document.createElement('script');script.src=new URL(item.file,base).href;
     script.onload=()=>{script.remove();Y[item.key]?resolve():reject(Error('Builder data incomplete: '+item.key));};
     script.onerror=()=>{script.remove();reject(Error('Builder data unavailable: '+item.key));};
     document.head.append(script);
    });
   }
   if(!ready())throw Error('Builder data incomplete');
  })().catch(error=>{pending=undefined;throw error;});
  return pending;
 };
})(YY);
