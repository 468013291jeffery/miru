/* Subtle contrast for chapter objectives and character dialogue only.
   Narration and exposition retain their original theme styles. */
(function(){
 const style=document.createElement('style');style.id='story-text-readability152';
 const goals=['#msgs .svf-chapter-goals','#msgs .svf-chapter-goals *',
  '#msgs .onlyme-chapter-goals','#msgs .onlyme-chapter-goals *',
  '#s-chat .g163','#s-chat .g163 b','#s-chat .g163 span'];
 const dialogue=['#msgs .m-row:not(.me) .bac',
  '#msgs .m-row:not(.me) .bac :is(span,strong,em)',
  '#msgs .m-row:not(.me) .bub > p'];
 style.textContent=goals.concat(dialogue).join(',')+`{
  -webkit-text-stroke:.18px rgba(255,255,255,.38);
  paint-order:stroke fill;
  text-shadow:0 0 1px rgba(255,255,255,.28),
    0 0 2px rgba(255,255,255,.12)!important;
 }`;
 document.head.appendChild(style);
})();
