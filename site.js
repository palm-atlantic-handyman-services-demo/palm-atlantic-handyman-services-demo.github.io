(function(){
var HOOK='https://website-leads-hq.base44.app/api/quote';
var hdr=document.getElementById('hdr'),bar=document.getElementById('mbar'),cta=document.getElementById('heroCta');
function onScroll(){hdr.classList.toggle('scrolled',window.scrollY>8);var r=cta.getBoundingClientRect();bar.classList.toggle('show',r.bottom<0);}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
var rv=[].slice.call(document.querySelectorAll('.rv'));
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px'});rv.forEach(function(e){io.observe(e);});setTimeout(function(){rv.forEach(function(e){e.classList.add('in');});},3000);}else rv.forEach(function(e){e.classList.add('in');});

/* lightbox (home page only) */
var lb=document.getElementById('lb');
if(lb){var im=null,cap=document.getElementById('lbCap');
var items=[].slice.call(document.querySelectorAll('#gallery button')),i=0,last=null,tx=null;
function show(n){i=(n+items.length)%items.length;var b=items[i];if(!im){im=document.createElement('img');im.id='lbImg';document.getElementById('lbFig').insertBefore(im,cap);}im.src=b.dataset.src;im.alt=b.querySelector('img').alt;cap.textContent=b.dataset.cap;}
function open(n){last=document.activeElement;show(n);lb.classList.add('on');document.body.style.overflow='hidden';lb.querySelector('.x').focus();}
function close(){lb.classList.remove('on');document.body.style.overflow='';if(last)last.focus();}
items.forEach(function(b,n){b.addEventListener('click',function(){open(n);});});
lb.querySelector('.x').onclick=close;lb.querySelector('.pv').onclick=function(){show(i-1);};lb.querySelector('.nx').onclick=function(){show(i+1);};
lb.addEventListener('click',function(e){if(e.target===lb)close();});
document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1);});
lb.addEventListener('touchstart',function(e){tx=e.changedTouches[0].clientX;},{passive:true});
lb.addEventListener('touchend',function(e){if(tx===null)return;var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(i+(d<0?1:-1));tx=null;},{passive:true});}

/* quote pop-up */
var qm=document.getElementById('quoteModal'),seen=false;
try{seen=sessionStorage.getItem('qmSeen')==='1';}catch(e){}
function openQ(svc){if(!qm)return;if(svc){var s=qm.querySelector('select[name=service]');if(s)s.value=svc;}
  try{sessionStorage.setItem('qmSeen','1');}catch(e){}seen=true;
  if(typeof qm.showModal==='function'){if(!qm.open)qm.showModal();}else{var f=document.getElementById('quoteform');if(f)f.scrollIntoView({behavior:'smooth'});return;}
  var first=qm.querySelector('input[name=name]');if(first)setTimeout(function(){first.focus();},50);}
[].forEach.call(document.querySelectorAll('[data-quote]'),function(b){b.addEventListener('click',function(e){e.preventDefault();openQ(b.getAttribute('data-service'));});});
if(qm){qm.querySelector('[data-close]').addEventListener('click',function(){qm.close();});
  qm.addEventListener('click',function(e){if(e.target===qm)qm.close();});}
function auto(){if(seen||!qm||qm.open||(lb&&lb.classList.contains('on')))return;openQ();}
setTimeout(auto,35000);
window.addEventListener('scroll',function(){var h=document.documentElement;if((h.scrollTop+h.clientHeight)/h.scrollHeight>0.6)auto();},{passive:true});

/* quote forms */
function fmt(d){return '('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6);}
function post(body){return fetch(HOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){if(!r.ok)throw new Error('http '+r.status);return r.json();}).then(function(j){if(!j||!j.ok)throw new Error('bad');return j;});}
[].forEach.call(document.querySelectorAll('form.q'),function(f){
  var ok=f.querySelector('.form-ok'),btn=f.querySelector('button[type=submit]');
  function say(t,c){ok.textContent=t;ok.className='form-ok'+(c?' '+c:'');}
  var ph=f.querySelector('input[name=phone]');
  ph.addEventListener('blur',function(){var d=ph.value.replace(/\D/g,'');if(d.length===11&&d[0]==='1')d=d.slice(1);if(d.length===10)ph.value=fmt(d);});
  f.addEventListener('submit',function(e){e.preventDefault();
    var name=f.name.value.trim(),d=ph.value.replace(/\D/g,'');if(d.length===11&&d[0]==='1')d=d.slice(1);
    if(!name){say('Please add your name so Zach knows who to text.','err');f.name.focus();return;}
    if(d.length!==10){say('Please enter a 10-digit phone number so Zach can text you back.','err');ph.focus();return;}
    ph.value=fmt(d);
    var rec={site:f.dataset.site,business:f.dataset.biz,name:name,phone:fmt(d),service:f.service.value,city:f.city.value,details:f.details.value.trim(),page:location.href,website:f.website.value};
    btn.disabled=true;say('Sending...');
    post(rec).catch(function(){return new Promise(function(r){setTimeout(r,1500);}).then(function(){return post(rec);});})
    .then(function(){say('Got it, '+name.split(' ')[0]+'. Zach will text you a price at '+fmt(d)+'.','good');f.reset();ph.value='';})
    .catch(function(){say('That did not go through. Please call or text Zach at (954) 607-0846 and he will get you a price.','err');})
    .then(function(){btn.disabled=false;});
  });
});
})();
