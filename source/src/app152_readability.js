/* Authored goals, exposition and narration remain readable over any scene. */
(function(){
 const style=document.createElement('style');style.id='story-text-readability152';
 const targets=[
  '#msgs .m-narr','#msgs .m-narr *',
  '#msgs .m-act:not(.me)','#msgs .m-act:not(.me) *',
  '#msgs .m-scene','#msgs .m-scene *',
  '#msgs .m-intro .mi-sec','#msgs .m-intro .mi-sec *',
  '#msgs .chapter124','#msgs .chapter124 *',
  '#msgs .entry98','#msgs .entry98 :is(p,h2,h3,h4,dt,dd,b,small,span,strong,em)',
  '#msgs .svf-chapter-goals','#msgs .svf-chapter-goals *',
  '#msgs .onlyme-chapter-goals','#msgs .onlyme-chapter-goals *',
  '#s-chat .g163','#s-chat .g163 b','#s-chat .g163 span'
 ];
 style.textContent=targets.join(',')+`{
  color:#000!important;-webkit-text-fill-color:#000!important;
  -webkit-text-stroke:.35px #fff;paint-order:stroke fill;
  text-shadow:-1px -1px 0 #fff,0 -1px 0 #fff,1px -1px 0 #fff,
    -1px 0 0 #fff,1px 0 0 #fff,-1px 1px 0 #fff,0 1px 0 #fff,1px 1px 0 #fff,
    0 0 3px #fff,0 0 5px rgba(255,255,255,.95)!important;
  opacity:1!important;
 }`;
 document.head.appendChild(style);
})();
