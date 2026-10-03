/* Mei stele1122: complete the photo-visible rectangular iron enclosure.
 * Original stone and fence records remain untouched; spacing is a display fit. */
(function(Y){'use strict';const P=Y.Builder.prototype,prior=P.meiStele33;
P.meiStele33=function(...args){const result=prior.apply(this,args);if(this.id!==1122)return result;
 for(const side of[-1,1]){for(let j=1;j<7;j++)this.box(side*1.22,.63,-.85+j*1.7/7,.033,1.06,.033,'#3e5a4c',29);this.box(side*1.22,1.13,0,.04,.04,1.74,'#3e5a4c',29);}return result;
};
})(YY);
