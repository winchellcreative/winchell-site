/* Winchell Creative · shared scripts */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function(s,c){ return (c||document).querySelector(s); }, $$ = function(s,c){ return [].slice.call((c||document).querySelectorAll(s)); };

  /* sky by scroll */
  var K=[[0,[86,98,150],[150,140,178],[214,172,164]],[.25,[74,78,142],[190,130,140],[236,160,124]],[.45,[54,56,120],[150,92,128],[222,122,100]],[.62,[30,36,86],[80,60,110],[150,84,96]],[.76,[14,20,52],[26,32,76],[44,46,94]],[1,[8,13,38],[12,20,52],[20,30,70]]];
  var root=document.documentElement, sky=$('.skybg');
  function mix(a,b,t){ return a.map(function(v,i){ return Math.round(v+(b[i]-v)*t); }); }
  function rgb(c){ return 'rgb('+c.join(',')+')'; }
  function upd(){
    var max=Math.max(1,root.scrollHeight-innerHeight), p=Math.min(1,Math.max(0,scrollY/max));
    var i=0; while(i<K.length-2 && p>K[i+1][0]) i++;
    var a=K[i], b=K[i+1], t=(p-a[0])/(b[0]-a[0]);
    if (sky){ sky.style.setProperty('--s1',rgb(mix(a[1],b[1],t))); sky.style.setProperty('--s2',rgb(mix(a[2],b[2],t))); sky.style.setProperty('--s3',rgb(mix(a[3],b[3],t))); }
    root.style.setProperty('--sun-y',(52+p*110)+'vh');
    root.style.setProperty('--sun-o',p<.4?1:Math.max(0,1-(p-.4)/.14));
    root.style.setProperty('--star-o',Math.max(0,Math.min(1,(p-.56)/.16)));
    root.style.setProperty('--cloud-o',Math.max(0,1-p*1.6));
    var ink=Math.max(0,Math.min(1,(p-.2)/.04));
    root.style.setProperty('--ink',rgb(mix([20,27,46],[255,255,255],ink)));
    root.style.setProperty('--ink2',rgb(mix([42,51,80],[214,220,236],ink)));
  }
  var raf=0; addEventListener('scroll',function(){ if(!raf) raf=requestAnimationFrame(function(){ raf=0; upd(); }); },{passive:true});
  addEventListener('resize',upd); addEventListener('load',upd); upd();

  /* mobile menu */
  var bg=$('#burger'), mn=$('#mnav');
  if (bg && mn){ bg.addEventListener('click',function(){ var o=mn.classList.toggle('open'); bg.setAttribute('aria-expanded',o); });
    $$('a',mn).forEach(function(a){ a.addEventListener('click',function(){ mn.classList.remove('open'); bg.setAttribute('aria-expanded',false); }); }); }

  /* reveal */
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{threshold:.12});
  $$('.reveal').forEach(function(el){ io.observe(el); });

  /* rotating hero word */
  var rot=$('.rot');
  if (rot && !reduce){
    var words=['websites','systems','brands','stories','films'], k=0;
    var meas=document.createElement('span'); meas.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;'; rot.parentNode.appendChild(meas);
    var w=function(t){ meas.textContent=t; return meas.getBoundingClientRect().width+2; };
    rot.style.width=w(words[0])+'px';
    setInterval(function(){ var cur=$('.rw',rot); k=(k+1)%words.length; cur.classList.add('out');
      setTimeout(function(){ rot.style.width=w(words[k])+'px'; cur.textContent=words[k]; cur.classList.remove('out','in'); void cur.offsetWidth; cur.classList.add('in'); },320); },2400);
    addEventListener('resize',function(){ rot.style.width=w(words[k])+'px'; });
    if(document.fonts) document.fonts.ready.then(function(){ rot.style.width=w(words[k])+'px'; });
  }

  /* easier flips */
  $$('.ez').forEach(function(z){ var auto=!z.dataset.noauto,t;
    function set(a){ z.classList.toggle('is-a',a); $$('.ez-sw button',z).forEach(function(b){ var on=(b.dataset.v==='a')===a; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); }); }
    $$('.ez-sw button',z).forEach(function(b){ b.addEventListener('click',function(){ auto=false; clearTimeout(t); set(b.dataset.v==='a'); }); });
    var x0=null; z.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; },{passive:true});
    z.addEventListener('touchend',function(e){ if(x0===null)return; var dx=e.changedTouches[0].clientX-x0; x0=null; if(Math.abs(dx)>40){ auto=false; clearTimeout(t); set(dx<0); } },{passive:true});
    new IntersectionObserver(function(es){ es.forEach(function(en){ if(!auto) return; if(en.isIntersecting){ clearTimeout(t); t=setTimeout(function(){ set(true); auto=false; },2200); } else clearTimeout(t); }); },{threshold:.5}).observe(z);
  });

  /* mobile reviews: auto-scroll + swipe */
  var rs=$('#revs');
  if (rs && matchMedia('(max-width:760px)').matches && !reduce){
    var hold=false, rt; var half=function(){ return rs.querySelector('.rg').offsetWidth; };
    ['touchstart','pointerdown'].forEach(function(ev){ rs.addEventListener(ev,function(){ hold=true; clearTimeout(rt); },{passive:true}); });
    ['touchend','pointerup'].forEach(function(ev){ rs.addEventListener(ev,function(){ clearTimeout(rt); rt=setTimeout(function(){ hold=false; },2500); },{passive:true}); });
    (function step(){ if(!hold){ rs.scrollLeft+=0.6; if(rs.scrollLeft>=half()) rs.scrollLeft-=half(); } requestAnimationFrame(step); })();
  }

  /* stat bar */
  var sb=$('.sbar2');
  if (sb){ var cs=$$('.cnt',sb);
    function show(el,v){ var t=+el.dataset.to, s; if(el.dataset.fmt==='k') s=(v>=1000?Math.round(v/1000)+'k':Math.round(v)); else s=Math.round(v); el.textContent=(el.dataset.pre||'')+s+(el.dataset.suf||''); }
    if (reduce){ sb.classList.add('live'); }
    else { cs.forEach(function(el){ show(el,0); });
      new IntersectionObserver(function(es,o){ es.forEach(function(e){ if(!e.isIntersecting) return; o.disconnect(); sb.classList.add('live'); var t0=null;
        function tick(t){ if(!t0)t0=t; var p=Math.min((t-t0)/1700,1), k=1-Math.pow(1-p,3); cs.forEach(function(el){ show(el,+el.dataset.to*k); }); if(p<1) requestAnimationFrame(tick); else cs.forEach(function(el){ show(el,+el.dataset.to); }); }
        setTimeout(function(){ requestAnimationFrame(tick); },300); }); },{threshold:.4}).observe(sb); }
  }

  /* view more */
  var mw=$('#moreWork'); if(mw) mw.addEventListener('click',function(){ $('#wgrid').classList.add('all'); $$('#wgrid .reveal').forEach(function(r){ r.classList.add('in'); }); });

  /* tabs */
  $$('.tabs').forEach(function(tl){ var bs=$$('button',tl);
    bs.forEach(function(b){ b.addEventListener('click',function(){ bs.forEach(function(x){ var on=x===b; x.setAttribute('aria-selected',on); var p=document.getElementById(x.getAttribute('aria-controls')); if(p){ p.hidden=!on; if(on) $$('.reveal',p).forEach(function(r){ r.classList.add('in'); }); } }); }); }); });

  /* film modal */
  var fm=$('#filmModal');
  if (fm){ var fr=$('.vbox .frame',fm);
    function close(){ fm.hidden=true; fr.innerHTML=''; }
    $$('[data-yt]').forEach(function(b){ b.addEventListener('click',function(){ fr.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+b.dataset.yt+'?autoplay=1&rel=0" title="Film" allow="autoplay; fullscreen; encrypted-media" allowfullscreen></iframe>'; fm.hidden=false; }); });
    fm.addEventListener('click',function(e){ if(e.target===fm||e.target.closest('.vclose')) close(); });
    addEventListener('keydown',function(e){ if(e.key==='Escape') close(); }); }

  /* quote form */
  var form=$('#qform');
  if (form){
    var ENDPOINT='https://formspree.io/f/xjyyblve', err=$('#qerr'), card=$('.postcard');
    try { var hq=new URLSearchParams(location.search).get('headaches'); if(hq) $('#q-about').value='My top headaches (from the Headache Finder):\n'+hq+'\n\n'; } catch(e){}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var v=function(n){ var el=form.elements[n]; return el?(el.value||'').trim():''; };
      var pick=function(n){ var c=form.querySelector('input[name="'+n+'"]:checked'); return c?c.value:''; };
      var needs=$$('input[name="needs"]:checked',form).map(function(c){ return c.value; });
      if(!v('name')||!/^\S+@\S+\.\S+$/.test(v('email'))){ err.textContent='Add your name and a valid email so I can write back.'; (!v('name')?form.elements.name:form.elements.email).focus(); return; }
      err.textContent='';
      var subject='Quote request: '+(v('org')||v('name'));
      var extra={}; $$('[data-x]',form).forEach(function(el){ if((el.type==='radio'||el.type==='checkbox')&&!el.checked) return; if(el.value) extra[el.dataset.x]=el.value; });
      var body=['Name: '+v('name'),'Business: '+(v('org')||'—'),'Email: '+v('email'),'Phone: '+(v('phone')||'—')].concat(Object.keys(extra).map(function(k){ return k+': '+extra[k]; })).concat(['Needs: '+(needs.join(', ')||'—'),'Budget: '+(pick('budget')||'—'),'','Notes:',v('about')||'—']).join('\n');
      var btn=$('button[type=submit]',form); btn.disabled=true; btn.textContent='Sending...';
      function done(h,p){ $('.sent',card).innerHTML='<h3>'+h+'</h3><p>'+p+'</p>'; card.classList.add('done'); }
      fetch(ENDPOINT,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(Object.assign({_subject:subject,name:v('name'),business:v('org'),email:v('email'),_replyto:v('email'),phone:v('phone'),needs:needs.join(', '),budget:pick('budget'),notes:v('about'),source:location.pathname},extra))})
      .then(function(r){ if(!r.ok) throw 0; done('Postcard sent. Thanks, '+v('name').split(' ')[0].replace(/[<>&"]/g,'')+'!','I’ll write back within one business day. Need me sooner? Text <a href="sms:4025704788" style="font-weight:700;text-decoration:underline">402-570-4788</a>.'); })
      .catch(function(){ btn.disabled=false; btn.textContent='Send it'; location.href='mailto:kyle@winchell.co?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body); done('Almost there.','Your email app should open with everything filled in. Hit send and I’ll reply within one business day.'); });
    });
  }
})();
