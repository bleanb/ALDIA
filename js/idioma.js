// Toggle ES/EN con animación
(() => {
  const btn = document.querySelector('.btn-idioma');
  if (!btn) return;

  const label = btn.querySelector('p');
  if (!label) return;

  // transición para el texto (una vez)
  label.style.transition = 'opacity 160ms ease, transform 160ms ease';
  let animating = false;

  function toggleLang() {
    if (animating) return;
    animating = true;

    // fade-out + slide-up
    label.style.opacity = '0';
    label.style.transform = 'translateY(-6px)';

    const onEnd = () => {
      // cambiar texto
      const current = (label.textContent || '').trim().toUpperCase();
      const next = current === 'EN' ? 'ES' : 'EN';
      label.textContent = next;

      // opcional: reflejar en <html lang="">
      document.documentElement.setAttribute('lang', next.toLowerCase());

      // preparar reentrada abajo
      label.style.transform = 'translateY(6px)';

      // siguiente frame: fade-in + slide a 0
      requestAnimationFrame(() => {
        label.style.opacity = '1';
        label.style.transform = 'translateY(0)';
      });

      // liberar bloqueo al terminar el fade-in
      const onInEnd = () => {
        animating = false;
        label.removeEventListener('transitionend', onInEnd);
      };
      label.addEventListener('transitionend', onInEnd, { once: true });
      label.removeEventListener('transitionend', onEnd);
    };

    label.addEventListener('transitionend', onEnd, { once: true });
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault(); // por si el <a> llega a tener href
    toggleLang();
  });
})();
