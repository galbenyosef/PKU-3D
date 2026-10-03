/* Close the inherited wall-to-flat-roof seam of the mapped annex.
 * Keep all original wall, roof, window and metal edge records untouched.
 * The opening-day images identify the main Teacher House, not an annex door;
 * no entrance, sign or main-building facade is transplanted onto this parcel. */
(function(Y){'use strict';
 const previous=Y.Refinements41.teacher;
 Y.Refinements41.teacher=function(b,f,add){
  const result=previous.call(this,b,f,add);
  if(result&&f.properties.pickId===406&&f.properties.id==='way/1075644761'){
   // Original walls stop at h; roof is at h+.18. The edge beam is an
   // eight-sided cylinder of radius .19 centered at h+.22: its lowest
   // surface is h+.03, leaving a real exposed slit below that trim.
   // Continue the same wall up to the unchanged roof, behind the trim.
   add('teacher406-roof-wall-joint',Y.Footprints.walls(f.geometry,result.height-.005,result.height+.18),'#d2cec1',24,406);
  }
  return result;
 };
})(YY);
