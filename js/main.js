/* Vectrum Dev — page behaviour: language switcher, floating header, mobile menu, FAQ, form validation. */
(function(){
var I18N = window.I18N;
var HTML_LANG = {en:'en',pl:'pl',ru:'ru',ua:'uk'};
var ORDER = ['en','pl','ru','ua'];
var current = 'en';

function t(k){ return (I18N[current] && I18N[current][k]) || I18N.en[k] || ''; }

function apply(lang){
  if(!I18N[lang]) lang = 'en';
  current = lang;
  document.documentElement.lang = HTML_LANG[lang];
  document.querySelectorAll('[data-t]').forEach(function(el){ el.textContent = t(el.getAttribute('data-t')); });
  document.querySelectorAll('[data-h]').forEach(function(el){ el.innerHTML = t(el.getAttribute('data-h')); });
  document.getElementById('langCode').textContent = I18N[lang].lc;
  document.querySelectorAll('[data-lang]').forEach(function(b){ b.setAttribute('aria-current', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
  var mb = document.getElementById('moreBtn');
  mb.querySelector('span').textContent = mb.getAttribute('aria-expanded') === 'true' ? t('less') : t('more');
  document.querySelectorAll('.err').forEach(function(e){ e.querySelector('span').textContent = t(e.getAttribute('data-k')); });
  try { localStorage.setItem('vd-lang', lang); } catch(e){}
}

/* mobile language chips */
document.querySelectorAll('.m-langs').forEach(function(box){
  ORDER.forEach(function(l){
    var b = document.createElement('button');
    b.type = 'button'; b.setAttribute('data-lang', l);
    b.textContent = l.charAt(0).toUpperCase() + l.slice(1);
    b.setAttribute('aria-label', I18N[l].lc);
    box.appendChild(b);
  });
});

/* dropdown */
var langBtn = document.getElementById('langBtn'), langMenu = document.getElementById('langMenu');
function closeLang(){ langMenu.hidden = true; langBtn.setAttribute('aria-expanded','false'); }
langBtn.addEventListener('click', function(e){
  e.stopPropagation();
  var open = langMenu.hidden;
  langMenu.hidden = !open; langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.addEventListener('click', function(e){ if(!langMenu.hidden && !langMenu.contains(e.target)) closeLang(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ closeLang(); closeMenu(); } });
document.querySelectorAll('[data-lang]').forEach(function(b){
  b.addEventListener('click', function(){ apply(b.getAttribute('data-lang')); closeLang(); });
});

/* mobile menu */
var mmenu = document.getElementById('mmenu'), burger = document.getElementById('burger');
function openMenu(){ mmenu.hidden = false; burger.setAttribute('aria-expanded','true'); document.body.style.overflow = 'hidden'; document.getElementById('mClose').focus(); }
function closeMenu(){ if(mmenu.hidden) return; mmenu.hidden = true; burger.setAttribute('aria-expanded','false'); document.body.style.overflow = ''; }
burger.addEventListener('click', openMenu);
document.getElementById('mClose').addEventListener('click', function(){ closeMenu(); burger.focus(); });
mmenu.querySelectorAll('[data-close]').forEach(function(a){ a.addEventListener('click', closeMenu); });
window.addEventListener('resize', function(){ if(window.innerWidth > 900) closeMenu(); });

/* faq */
document.querySelectorAll('.faq button').forEach(function(btn){
  btn.addEventListener('click', function(){
    var item = btn.parentElement, wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq').forEach(function(f){ f.classList.remove('open'); f.querySelector('button').setAttribute('aria-expanded','false'); f.querySelector('.ans').hidden = true; });
    if(!wasOpen){ item.classList.add('open'); btn.setAttribute('aria-expanded','true'); item.querySelector('.ans').hidden = false; }
  });
});

/* read more (mobile) */
var moreBtn = document.getElementById('moreBtn'), agrid = document.getElementById('agrid');
moreBtn.addEventListener('click', function(){
  var exp = moreBtn.getAttribute('aria-expanded') === 'true';
  moreBtn.setAttribute('aria-expanded', exp ? 'false' : 'true');
  agrid.classList.toggle('clamped', exp);
  moreBtn.querySelector('span').textContent = exp ? t('more') : t('less');
  moreBtn.querySelector('svg').style.transform = exp ? '' : 'rotate(90deg)';
});

/* phone mask: +38 (0XX) XXX-XXXX */
var phone = document.getElementById('phone');
phone.addEventListener('input', function(){
  var d = phone.value.replace(/\D/g,'');
  if(d.indexOf('38') === 0) d = d.slice(2);
  d = d.slice(0,10);
  if(!d){ phone.value = ''; return; }
  var out = '+38 (' + d.slice(0,3);
  if(d.length >= 3) out += ') ' + d.slice(3,6);
  if(d.length >= 6) out += '-' + d.slice(6,10);
  phone.value = out;
});

/* form validation */
var form = document.getElementById('form');
var errIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>';
function setErr(fieldId, key){
  var f = document.getElementById(fieldId), old = f.querySelector('.err');
  if(old) old.remove();
  var input = f.querySelector('input');
  if(!key){ f.classList.remove('invalid'); input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); return true; }
  f.classList.add('invalid');
  var p = document.createElement('p'); p.className = 'err'; p.id = fieldId + '-err'; p.setAttribute('data-k', key);
  p.innerHTML = errIcon + '<span></span>'; p.querySelector('span').textContent = t(key);
  f.appendChild(p);
  input.setAttribute('aria-invalid','true'); input.setAttribute('aria-describedby', p.id);
  return false;
}
function validate(){
  var ok = true;
  var n = document.getElementById('name').value.trim();
  var ph = phone.value.replace(/\D/g,'');
  var em = document.getElementById('email').value.trim();
  ok = setErr('f-name', n ? null : 'req') && ok;
  ok = setErr('f-phone', ph.length >= 12 ? null : 'req') && ok;
  ok = setErr('f-email', !em ? 'req' : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) ? null : 'badEmail')) && ok;
  return ok;
}
['name','phone','email'].forEach(function(id){
  document.getElementById(id).addEventListener('input', function(){ var f = document.getElementById('f-' + id); if(f.classList.contains('invalid')) validate(); });
});
form.addEventListener('submit', function(e){
  e.preventDefault();
  if(!validate()){ var first = form.querySelector('[aria-invalid="true"]'); if(first) first.focus(); return; }
  var btn = document.getElementById('submitBtn');
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg><span data-t="order"></span>';
  btn.querySelector('span').textContent = t('order');
  form.reset();
  setTimeout(function(){ btn.innerHTML = '<span data-t="order"></span>'; btn.querySelector('span').textContent = t('order'); }, 2200);
});

/* portfolio: if a project image fails to load, show a branded cover instead of a broken image */
document.querySelectorAll('.pcard img').forEach(function(img){
  function fallback(){
    var c = document.createElement('div');
    c.className = 'cover cover-vl'; c.setAttribute('role','img'); c.setAttribute('aria-label', img.alt);
    var n = document.createElement('span'); n.className = 'cover-name'; n.textContent = img.alt;
    c.appendChild(n); img.replaceWith(c);
  }
  if(img.complete && img.naturalWidth === 0) fallback(); else img.addEventListener('error', fallback);
});

/* header: turns into a floating rounded bar once the page scrolls */
var hdr = document.getElementById('hdr');
function onScroll(){ hdr.classList.toggle('scrolled', window.scrollY > 24); }
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* simple hash router: #normobaria and #vectrum-space open a project page */
var PROJECTS = ['normobaria','vectrum-space'];
var homeView = document.getElementById('homeView'), projectView = document.getElementById('projectView');
function route(){
  var h = location.hash.replace('#','');
  if(PROJECTS.indexOf(h) !== -1){
    homeView.hidden = true; projectView.hidden = false;
    projectView.querySelectorAll('.proj').forEach(function(p){ p.hidden = p.id !== 'p-' + h; });
    window.scrollTo(0,0);
    document.title = (h === 'normobaria' ? 'Krakowska Normobaria' : 'Vectrum Space') + ' — Vectrum Dev';
  } else if(homeView.hidden){
    projectView.hidden = true; homeView.hidden = false;
    document.title = 'Vectrum Dev';
    var target = h && document.getElementById(h);
    if(target) target.scrollIntoView(); else window.scrollTo(0,0);
  }
  onScroll();
}
window.addEventListener('hashchange', route);

/* start */
var saved = null;
try { saved = localStorage.getItem('vd-lang'); } catch(e){}
apply(saved || 'en');
route();
})();
