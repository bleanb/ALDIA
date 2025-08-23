// animation-logo-deleted.js
document.addEventListener('DOMContentLoaded', () => {
  const svg  = document.getElementById('logo-animated');
  const hero = document.querySelector('.hero-info');
  if (!svg || !hero) return;

  // === util: ocultar hero una sola vez ===
  const vanish = () => {
    if (hero.dataset.vanished === '1') return; // idempotente
    hero.dataset.vanished = '1';
    hero.classList.add('vanish');               // usa el keyframe heroFold
    hero.addEventListener('animationend', () => {
      hero.style.display = 'none';
    }, { once: true });
    // fallback por si no corre la animación CSS
    setTimeout(() => { hero.style.display = 'none'; }, 1200);
  };

  // === Fallback duro: 3s después de cargar la página ===
  window.addEventListener('load', () => {
    setTimeout(vanish, 6000); // <<-- siempre se borra a los 3s del load
  });

  // === animación de dibujo (cuando el SVG entra en viewport) ===
  const letters = svg.querySelectorAll('.glyph');
  letters.forEach((el, i) => el.style.setProperty('--delay', (i * 0.22) + 's'));

  const DRAW_S   = 1.1; // duración del trazo
  const FILL_AT  = 1.0; // inicio del fill
  const FILL_S   = 0.6; // duración del fill
  const EXTRA_MS = 2000; // esperar 2s tras finalizar el dibujo

  let io;

  const start = () => {
    if (svg.classList.contains('drawn')) return;

    svg.classList.add('drawn');

    // Calcula el final del último glyph y agenda el vanish (si el fallback de 3s aún no ocurrió)
    const delays = [...letters].map(el => parseFloat(getComputedStyle(el).getPropertyValue('--delay') || '0'));
    const delayMax = Math.max(0, ...delays);
    const finishMs = (delayMax + Math.max(DRAW_S, FILL_AT + FILL_S)) * 1000;

    setTimeout(vanish, finishMs + EXTRA_MS);
  };

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        start();
        io.disconnect();
      }
    }, { threshold: 0.6, rootMargin: '0px 0px -8% 0px' });
    io.observe(svg);
  } else {
    const onScroll = () => {
      const r  = svg.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = r.top < vh * 0.4 && r.bottom > vh * 0.6;
      if (visible) {
        start();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});
