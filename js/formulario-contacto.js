  document.addEventListener('DOMContentLoaded', () => {
    // Reveal de la card (misma energía que tus entradas animadas)
    const card = document.getElementById('contact-card');
    if (card){
      card.style.opacity='0';
      card.style.transform='translateY(30px)';
      card.style.transition='all .6s ease';
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            card.style.opacity='1';
            card.style.transform='translateY(0)';
            io.disconnect();
          }
        });
      }, {threshold:.2});
      io.observe(card);
    }

    // Interacción/validación del formulario
    const form   = document.getElementById('contact-form');
    const submit = document.getElementById('c-submit');
    const fb     = document.getElementById('c-feedback');

    form?.addEventListener('submit', async (e)=>{
      e.preventDefault();

      // honeypot
      const trap = form.querySelector('input[name="website"]');
      if (trap && trap.value.trim() !== '') return;

      // validaciones mínimas
      const name  = form.name.value.trim();
      const email = form.email.value.trim();
      const msg   = form.message.value.trim();
      const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !okEmail || msg.length < 5){
        fb.className = 'form-err';
        fb.textContent = 'Revisá los datos: nombre, email válido y un mensaje de al menos 5 caracteres.';
        fb.style.display = 'block';
        return;
      }

      // “enviando…”
      submit.classList.add('is-sending');
      submit.setAttribute('disabled', 'disabled');

      // TODO: conectar a tu backend/servicio (Beehiiv/Mailchimp/Formspree/EmailJS)
      await new Promise(r => setTimeout(r, 800)); // simulación de envío

      fb.className = 'form-ok';
      fb.textContent = '¡Mensaje enviado! Te respondemos pronto 🚀';
      fb.style.display = 'block';
      form.reset();

      submit.classList.remove('is-sending');
      submit.removeAttribute('disabled');
    });
  });
