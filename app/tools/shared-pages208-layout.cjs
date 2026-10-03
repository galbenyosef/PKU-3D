'use strict';
// Keep only multi-resource pages; isolated leftovers stay on the original path.
module.exports=function splitUint16(chain,size){const pages=[];let page=[],total=0;for(const item of chain){const n=size(item);if(!Number.isInteger(n)||n<1||n>65535){if(page.length>1)pages.push(page);page=[];total=0;continue;}if(total+n>65535){if(page.length>1)pages.push(page);page=[];total=0;}page.push(item);total+=n;}if(page.length>1)pages.push(page);return pages;};
