/*
  © 2026 Mindset & Discipline Lab - Danilo Rucchetta
  Spiegazioni dei termini (parole blu) su telefono: il riquadro si apre
  vicino alla parola toccata, sotto o sopra a seconda dello spazio,
  sempre dentro lo schermo.
  Se questo script non parte, resta il comportamento di style.css
  (riquadro in basso a tutta larghezza): nessun danno.
  Su PC non fa nulla: resta il riquadro sopra la parola gestito da style.css.
*/
(function () {
  'use strict';

  var mq = window.matchMedia('(max-width: 780px)');
  var MARGINE = 12;   // distanza minima dai bordi dello schermo
  var DISTANZA = 8;   // distanza tra parola e riquadro
  var LARGH_MAX = 340;
  var SCROLL_CHIUSURA = 40; // px di scorrimento dopo i quali il riquadro si chiude
  var scrollApertura = 0;

  function tipDi(el) { return el.querySelector('.gloss-tip'); }

  function azzera(tip) {
    tip.style.left = tip.style.right = tip.style.top = tip.style.bottom = tip.style.width = '';
  }

  function posiziona(parola) {
    document.documentElement.classList.remove('gloss-nascondi');
    scrollApertura = window.scrollY;
    var tip = tipDi(parola);
    if (!tip) return;
    if (!mq.matches) { azzera(tip); return; }

    var W = window.innerWidth;
    var H = window.innerHeight;
    var larghezza = Math.min(W - MARGINE * 2, LARGH_MAX);

    // Prima la larghezza, poi si misura l'altezza reale del testo
    tip.style.width = larghezza + 'px';
    tip.style.right = 'auto';
    tip.style.bottom = 'auto';

    var r = parola.getBoundingClientRect();
    var h = tip.offsetHeight;

    // Orizzontale: centrato sulla parola, ma mai fuori dallo schermo
    var left = r.left + r.width / 2 - larghezza / 2;
    left = Math.max(MARGINE, Math.min(left, W - MARGINE - larghezza));

    // Verticale: sotto la parola se c'è spazio, altrimenti sopra
    var top = r.bottom + DISTANZA;
    if (top + h > H - MARGINE) top = r.top - DISTANZA - h;
    if (top < MARGINE) top = MARGINE;

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function chiudiAperto() {
    // su iPhone il tocco lascia la parola "in hover": la classe nasconde il riquadro
    // finché non si tocca un'altra parola
    if (mq.matches) document.documentElement.classList.add('gloss-nascondi');
    var a = document.activeElement;
    if (a && (a.classList.contains('gloss') || a.classList.contains('gloss-pill'))) a.blur();
  }

  function init() {
    var parole = document.querySelectorAll('.gloss, .gloss-pill');
    Array.prototype.forEach.call(parole, function (p) {
      if (!p.hasAttribute('tabindex')) p.setAttribute('tabindex', '0');
      p.addEventListener('focus', function () { posiziona(p); });
      p.addEventListener('mouseenter', function () { posiziona(p); });
      p.addEventListener('touchstart', function () { posiziona(p); }, { passive: true });
    });

    // Scorrendo la pagina il riquadro si chiude, così non resta nel posto sbagliato
    // (un piccolo scorrimento involontario durante il tocco non lo chiude)
    window.addEventListener('scroll', function () {
      if (Math.abs(window.scrollY - scrollApertura) > SCROLL_CHIUSURA) chiudiAperto();
    }, { passive: true });
    window.addEventListener('resize', chiudiAperto);
    if (mq.addEventListener) mq.addEventListener('change', function () {
      Array.prototype.forEach.call(parole, function (p) { var t = tipDi(p); if (t) azzera(t); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
