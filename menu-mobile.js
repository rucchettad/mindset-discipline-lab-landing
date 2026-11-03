/* Menu ☰ per telefono e tablet (3/11/2026).
   Sotto i 1060 px il menu in alto è nascosto (style.css): questo file aggiunge il pulsante ☰
   e una tendina con le stesse voci del menu da computer, prese da <nav class="nav-links">.
   Se aggiungi una pagina al menu da computer, compare da sola anche qui.
   Da computer non cambia niente. */
(function(){
  var header = document.querySelector('header.nav');
  var nav = header && header.querySelector('.nav-links');
  var ctas = header && header.querySelector('.nav-ctas');
  if(!header || !nav || !ctas) return;

  var css = ''
  + '.mm-btn{display:none;align-items:center;justify-content:center;width:40px;height:38px;flex-shrink:0;'
  + 'background:transparent;border:1px solid var(--wire);border-radius:6px;color:var(--paper);cursor:pointer;padding:0;}'
  + '.mm-btn:hover{border-color:var(--copper);}'
  + '.mm-btn svg{display:block;}'
  + '.mm-btn .mm-x{display:none;}'
  + '.mm-aperto .mm-btn .mm-righe{display:none;}'
  + '.mm-aperto .mm-btn .mm-x{display:block;}'
  + '.mm-pannello{display:none;}'
  + '@media (max-width:1060px){'
  +   '.mm-btn{display:inline-flex;}'
  +   '.nav-ctas .nav-cta:not(.nav-cta-primary){display:none;}'
  +   '.mm-aperto .mm-pannello{display:block;}'
  +   '.mm-pannello{position:absolute;left:0;right:0;top:100%;'
  +     'background:#090b10;border-bottom:1px solid var(--wire);'
  +     'box-shadow:0 18px 40px rgba(0,0,0,0.55);max-height:calc(100vh - 70px);overflow-y:auto;}'
  +   '.mm-lista{max-width:var(--maxw);margin:0 auto;padding:8px 28px 20px;'
  +     'font-family:"DM Serif Display",Georgia,serif;}'
  +   '.mm-lista a{display:block;padding:14px 0;font-size:19px;color:var(--paper);text-decoration:none;'
  +     'border-bottom:1px solid var(--wire);}'
  +   '.mm-lista a.active{color:var(--copper-bright);}'
  +   '.mm-gruppo{padding:14px 0 6px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;'
  +     'color:var(--muted);font-family:"DM Sans",sans-serif;font-weight:600;}'
  +   '.mm-lista a.mm-sotto{padding:11px 0 11px 18px;font-size:17px;border-bottom:0;'
  +     'border-left:2px solid rgba(31,111,235,0.35);}'
  +   '.mm-lista a.mm-sotto.active{border-left-color:var(--copper-bright);}'
  +   '.mm-gruppo-fine{border-bottom:1px solid var(--wire);padding-bottom:8px;}'
  +   '.mm-accedi{margin-top:18px;}'
  +   '.mm-lista a.mm-accedi-link{display:block;text-align:center;border:1px solid var(--wire);border-radius:7px;'
  +     'padding:12px;font-family:"DM Sans",sans-serif;font-size:15px;font-weight:600;}'
  + '}'
  + '@media (max-width:480px){'
  +   '.mm-btn{width:38px;height:34px;}'
  +   '.mm-lista{padding:6px 16px 18px;}'
  + '}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* Pulsante ☰ accanto a «Registrati» */
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mm-btn';
  btn.setAttribute('aria-label', 'Apri il menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML =
    '<svg class="mm-righe" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  + '<svg class="mm-x" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  ctas.appendChild(btn);

  /* Tendina con le voci del menu da computer */
  var pannello = document.createElement('div');
  pannello.className = 'mm-pannello';
  var lista = document.createElement('div');
  lista.className = 'mm-lista';
  pannello.appendChild(lista);

  function link(a, cls){
    var n = document.createElement('a');
    n.href = a.getAttribute('href');
    n.textContent = a.textContent.trim();
    if(a.classList.contains('active')) n.classList.add('active');
    if(cls) n.classList.add(cls);
    return n;
  }
  Array.prototype.forEach.call(nav.children, function(el){
    if(el.tagName === 'A'){
      lista.appendChild(link(el));
    } else if(el.classList.contains('nav-drop')){
      var b = el.querySelector('.nav-drop-btn');
      var g = document.createElement('div');
      g.className = 'mm-gruppo';
      g.textContent = b ? b.childNodes[0].textContent.trim() : 'Poker Tools';
      lista.appendChild(g);
      var wrap = document.createElement('div');
      wrap.className = 'mm-gruppo-fine';
      el.querySelectorAll('.nav-drop-menu a').forEach(function(a){ wrap.appendChild(link(a, 'mm-sotto')); });
      lista.appendChild(wrap);
    }
  });
  var accedi = ctas.querySelector('.nav-cta:not(.nav-cta-primary)');
  if(accedi){
    var box = document.createElement('div');
    box.className = 'mm-accedi';
    var a2 = link(accedi, 'mm-accedi-link');
    a2.target = '_blank'; a2.rel = 'noopener';
    box.appendChild(a2);
    lista.appendChild(box);
  }
  header.appendChild(pannello);

  function apri(si){
    header.classList.toggle('mm-aperto', si);
    btn.setAttribute('aria-expanded', si ? 'true' : 'false');
    btn.setAttribute('aria-label', si ? 'Chiudi il menu' : 'Apri il menu');
  }
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    apri(!header.classList.contains('mm-aperto'));
  });
  lista.addEventListener('click', function(e){ if(e.target.closest('a')) apri(false); });
  document.addEventListener('click', function(e){
    if(header.classList.contains('mm-aperto') && !header.contains(e.target)) apri(false);
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') apri(false); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 1060) apri(false); });
})();
