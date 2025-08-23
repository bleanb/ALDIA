
// === INFO: reveal + reproducción del video (borra caption al click) ===
document.addEventListener('DOMContentLoaded', () => {
  const vCard = document.querySelector('.video-card');
  if (!vCard) return;

  const video   = vCard.querySelector('video');
  const playBtn = vCard.querySelector('.video-play');
  const caption = vCard.querySelector('.video-caption');

  // Reveal suave
  vCard.style.opacity = '0';
  vCard.style.transform = 'translateY(30px)';
  vCard.style.transition = 'all 0.6s ease';
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        vCard.style.opacity = '1';
        vCard.style.transform = 'translateY(0)';
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });
  io.observe(vCard);

  // Play + borrar caption al primer click
  playBtn?.addEventListener('click', () => {
    if (!video) return;

    // Borrar el figcaption (solo una vez)
    if (caption && caption.parentNode) {
      caption.parentNode.removeChild(caption);
    }

    vCard.classList.add('playing');
    video.setAttribute('controls', 'controls');
    video.play();
  });

  // Al terminar, volvemos al estado sin controles (no restauramos el caption)
  video?.addEventListener('ended', () => {
    vCard.classList.remove('playing');
    video.removeAttribute('controls');
  });
});
