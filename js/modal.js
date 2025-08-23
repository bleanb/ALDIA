
// ===== Modal Demo Free =====
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('demo-modal');
  if (!modal) return;

  const dialog   = modal.querySelector('.modal-dialog');
  const feedback = modal.querySelector('.subscribe-feedback');
  const input    = modal.querySelector('#modal-email');
  const form     = modal.querySelector('#modal-subscribe-form');

  const open = () => {
    modal.classList.add('is-active');
    document.body.classList.add('modal-open');
    feedback.textContent = '';
    input.classList.remove('is-valid','is-invalid');
    setTimeout(() => input?.focus(), 60);
    trapStart = document.activeElement;
  };
  const close = () => {
    modal.classList.remove('is-active');
    document.body.classList.remove('modal-open');
    trapStart?.focus?.();
  };

  // Cerrar: backdrop, botón y ESC
  modal.addEventListener('click', (e) => {
    if (e.target.matches('[data-close], .modal-backdrop')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('is-active') && e.key === 'Escape') close();
  });

  // Abrir cuando el botón diga "Demo" (nav, hero o cards de precios)
  const isDemoTrigger = (el) => /demo/i.test(el.textContent || '');
  document.querySelectorAll('.btn-secondary, .plan-cta, .nav-actions .btn-secondary')
    .forEach(btn => {
      if (!isDemoTrigger(btn)) return;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      });
    });

// Validación sencilla (igual criterio que el footer) 
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);

const setFeedback = (msg, type) => {
  feedback.textContent = msg;
  feedback.classList.remove('success','error');
  feedback.classList.add(type);
  input.classList.remove('is-valid','is-invalid');
  input.classList.add(type === 'success' ? 'is-valid' : 'is-invalid');
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = (input.value || '').trim();

  if (!value)           return setFeedback('Por favor, escribí tu email.', 'error');
  if (!emailOk(value))  return setFeedback('Revisá el formato del email.', 'error');

  // Simulación de envío — conectá acá tu servicio (Beehiiv/Mailchimp/etc)
  const submitBtn = form.querySelector('.btn-subscribe');
  submitBtn.disabled = true;
  submitBtn.classList.add('disabled-btn');

  await new Promise(r => setTimeout(r, 800)); // <-- reemplazar por fetch real

  setFeedback('¡Listo! Te sumamos a la Demo Free 🙌', 'success');
  form.reset();

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.classList.remove('disabled-btn');
    input.classList.remove('is-valid');

    // === Redirección según dónde esté el archivo actual ===
    // Si la URL contiene "/pages/", estamos dentro de /ALDIA/pages/*
    //   -> redirigir a "../pages/bienvenida.html"
    // Si NO, estamos en el index (root)
    //   -> redirigir a "./pages/bienvenida.html"
    const inPages = window.location.pathname.includes('/pages/');
    const target  = inPages ? '../pages/bienvenida.html' : './pages/bienvenida.html';
    window.location.assign(target);

    // Nota: si no querés que el usuario pueda volver con "atrás":
    // window.location.replace(target);
  }, 1200); // 1200 ms = 1.2 s
});

  // Trap de foco simple
  let trapStart = null;
  modal.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active') || e.key !== 'Tab') return;
    const focusables = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const list = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  });
});
