document.addEventListener('DOMContentLoaded', () => {
  const svg = document.getElementById('logo-animated');
  if (!svg) return;

  // delays en cascada (una vez)
  svg.querySelectorAll('.glyph').forEach((el, i) => {
    el.style.setProperty('--delay', (i * 0.22) + 's');
  });

  let io; // para desconectar luego
  const start = () => {
    if (!svg.classList.contains('drawn')) svg.classList.add('drawn');
    if (io) io.disconnect();
  };

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) start();
    }, {
      threshold: 0.6,           // qué porcentaje del SVG debe ser visible
      rootMargin: '0px 0px -8% 0px' // dispará un toque antes (ajustable)
    });
    io.observe(svg);
  } else {
    // Fallback sin IO
    const onScroll = () => {
      const r = svg.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = r.top < vh * 0.4 && r.bottom > vh * 0.6; // ~60% en viewport
      if (visible) {
        start();
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});
