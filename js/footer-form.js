document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('footer-subscribe-form');
  if (!form) return;

  const input = form.querySelector('#footer-email');
  const feedback = form.querySelector('.subscribe-feedback');
  const btn = form.querySelector('.btn-subscribe');

  const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);

  const setFeedback = (msg, type) => {
    feedback.textContent = msg;
    feedback.classList.remove('success','error');
    feedback.classList.add(type);
    input.classList.remove('is-valid','is-invalid');
    input.classList.add(type === 'success' ? 'is-valid' : 'is-invalid');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = (input.value || '').trim();

    if (!value) {
      setFeedback('Por favor, escribí tu email.', 'error');
      input.focus();
      return;
    }
    if (!emailOk(value)) {
      setFeedback('Revisá el formato del email.', 'error');
      input.focus();
      return;
    }

    // “Éxito” local
    btn.disabled = true;
    btn.classList.add('disabled-btn'); // usa tu estilo disabled
    setFeedback('¡Gracias por suscribirte! Te vamos a escribir pronto.','success');
    form.reset();

    // reactivamos el botón al ratito
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove('disabled-btn');
      input.classList.remove('is-valid');
    }, 1500);
  });

  // limpiar mensajes al escribir
  input.addEventListener('input', () => {
    feedback.textContent = '';
    feedback.classList.remove('success','error');
    input.classList.remove('is-valid','is-invalid');
  });
});
