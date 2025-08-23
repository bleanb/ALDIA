(() => {
  /* =========================
   * 1) CHISPAS / PARTÍCULAS
   * ========================= */
  function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-10px';
      p.style.animationDuration = (Math.random() * 4 + 3) + 's';
      p.style.animationDelay = Math.random() * 2 + 's';
      p.style.setProperty('--random-x-1', ((Math.random()-0.5)*100) + 'px');
      p.style.setProperty('--random-x-2', ((Math.random()-0.5)*150) + 'px');
      p.style.setProperty('--random-x-3', ((Math.random()-0.5)*200) + 'px');
      p.style.setProperty('--random-x-4', ((Math.random()-0.5)*100) + 'px');
      const colors = ['#FFD700', '#FFA500', '#FF6347', '#FFFF00'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      particlesContainer.appendChild(p);
    }
  }
  function addNewParticle() {
    const c = document.getElementById('particles');
    if (!c) return;
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    p.style.animationDuration = (Math.random() * 4 + 3) + 's';
    p.style.setProperty('--random-x-1', ((Math.random()-0.5)*100) + 'px');
    p.style.setProperty('--random-x-2', ((Math.random()-0.5)*150) + 'px');
    p.style.setProperty('--random-x-3', ((Math.random()-0.5)*200) + 'px');
    p.style.setProperty('--random-x-4', ((Math.random()-0.5)*100) + 'px');
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#FFFF00'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.appendChild(p);
    setTimeout(() => { p.remove(); }, 7000);
  }
  createParticles();
  setInterval(addNewParticle, 200);

  /* =========================
   * 2) TITLE ANIMATION
   * ========================= */
  function createAnimatedTitle() {
    const titleEl = document.getElementById('animatedTitle');
    if (!titleEl) return;

    titleEl.style.position = 'relative';
    titleEl.style.display  = 'inline-block';

    const cs   = getComputedStyle(titleEl);
    const text = (titleEl.dataset.text || titleEl.textContent);
    titleEl.dataset.text = text;
    titleEl.innerHTML = '';

    let currentX = 0;
    const letterSpacing = parseFloat(cs.letterSpacing) || 0;

    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'letter';

      if (ch === ' ') {
        span.classList.add('space');
        span.innerHTML = '&nbsp;';
        currentX += 0.5 * parseFloat(cs.fontSize);
      } else {
        // medir ancho con la misma fuente
        const m = document.createElement('span');
        m.style.visibility = 'hidden';
        m.style.position   = 'absolute';
        m.style.font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`;
        m.textContent = ch;
        titleEl.appendChild(m);
        const w = m.offsetWidth;
        m.remove();

        span.textContent = ch;
        if (ch === '.') span.classList.add('dot');
        span.style.left = currentX + 'px';
        span.style.top  = '0px';
        span.style.setProperty('--random-fall-x', ((Math.random()-0.5) * 400) + 'px');
        currentX += w + letterSpacing;
      }

      // rotaciones aleatorias
      span.style.setProperty('--rotation-start', ((Math.random()-0.5)*720) + 'deg');
      span.style.setProperty('--rotation-mid',   ((Math.random()-0.5)*180) + 'deg');
      span.style.setProperty('--rotation-end',   ((Math.random()-0.5)* 90) + 'deg');

      titleEl.appendChild(span);
    }
  }

  function animateTitle() {
    const letters = document.querySelectorAll('#animatedTitle .letter');
    letters.forEach((letter, index) => {
      letter.style.animation = 'none';
      letter.offsetHeight; // reflow
      const duration = 1.2 + Math.random() * 0.8;
      const delay    = index * 0.08 + Math.random() * 0.12;
      letter.style.animation = `letterFall ${duration}s ease-out ${delay}s forwards`;
    });
  }

  
  function stopEllipsisLoop() {
    const letters = document.querySelectorAll('#animatedTitle .letter');
    letters.forEach(l => {
      if (l.style.animation && l.style.animation.includes('dotBounce')) {
        l.style.animation = 'none';
        requestAnimationFrame(() => { l.style.removeProperty('animation'); });
      }
    });
  }
function startEllipsisLoop() {
  const letters = Array.from(document.querySelectorAll('#animatedTitle .letter'));
  const dots = letters.filter(el => el.textContent === '.').slice(-3);
  if (dots.length !== 3) return;

  const baseDur = 1.8; // s ciclo completo
  const hopMs   = 0.6; // s desfase entre puntos

  dots.forEach((dot, i) => {
    // sin rotación: posición base y visibilidad fija
    dot.style.opacity = '1';
    dot.style.transform = 'translateY(0)';           // no rotamos
    dot.style.animation = `dotBounceUpright ${baseDur}s ease-in-out infinite ${i*hopMs}s`;
  });
}
  // --- cuando termine el título, mostrar subtítulo y arrancar loop de “...”
  function watchTitleEndAndShowSubtitle() {
    const subtitle = document.querySelector('.subtitle-yacasi');
    if (!subtitle) return;

    subtitle.classList.remove('show'); // por si venimos de otra vuelta

    const letters = document.querySelectorAll('#animatedTitle .letter');
    if (!letters.length) { subtitle.classList.add('show'); return; }

    let remaining = letters.length;
    const onEnd = (e) => {
      if (e.animationName !== 'letterFall') return;
      remaining--;
      if (remaining === 0) {
        subtitle.classList.add('show'); // fade-in
        startEllipsisLoop();            // arranca rebote de “...”
      }
    };
    letters.forEach(l => l.addEventListener('animationend', onEnd, { once: true }));
  }

  function startTitle(){
    const titleEl = document.getElementById('animatedTitle');
    if (!titleEl) return;
    // reset & reconstrucción
    titleEl.textContent = titleEl.dataset.text || titleEl.textContent;
    createAnimatedTitle();
    requestAnimationFrame(() => {
      animateTitle();
      watchTitleEndAndShowSubtitle();
    });
  }

  /* =========================
   * 3) SECCIONES + HOOKS
   * ========================= */
  const sections = Array.from(document.querySelectorAll('.content-section'));
  let currentSection = sections.findIndex(s => s.classList.contains('active'));
  if (currentSection < 0) {
    sections[0]?.classList.add('active');
    currentSection = 0;
  }

  const titleSection = document.getElementById('section1') || sections[0] || null;

  // ===== PROXIMAMENTE (section3) =====
  const proxSection   = sections.find(s => s.querySelector('.proximamente-container')) || null;
  const proxSubtitle  = proxSection ? proxSection.querySelector('.subtitle-proximamente') : null;
  const proxVideoWrap = proxSection ? proxSection.querySelector('.video-container') : null;
  const proxVideo     = proxSection ? proxSection.querySelector('video') : null;
  const proxLastText  = proxSection ? proxSection.querySelector('.proximamente-text.text-1') : null;

  function ensureAutoplay(videoEl){
    if (!videoEl) return;
    videoEl.muted = true;  videoEl.setAttribute('muted','');
    videoEl.playsInline = true; videoEl.setAttribute('playsinline','');
    const tryPlay = () => videoEl.play?.().catch(()=>{});
    tryPlay();
    const unlock = () => { tryPlay(); cleanup(); };
    const events = ['click','touchstart','keydown','wheel'];
    function cleanup(){ events.forEach(ev => window.removeEventListener(ev, unlock)); }
    events.forEach(ev => window.addEventListener(ev, unlock, { once:true, passive:true }));
  }
  function forceReflow(el){ if (el) void el.offsetWidth; }

  let endAttached = false;
  function onTextAnimationEnd(e){
    if (!e || !e.target || !e.target.classList || !e.target.classList.contains('text-1')) return;
    if (proxVideoWrap) proxVideoWrap.classList.add('show-video');
    if (proxVideo) {
      try { proxVideo.currentTime = 0; } catch {}
      ensureAutoplay(proxVideo);
    }
  }
  function attachTextEnd(){
    if (proxLastText && !endAttached) {
      proxLastText.addEventListener('animationend', onTextAnimationEnd);
      endAttached = true;
    }
  }
  function detachTextEnd(){
    if (proxLastText && endAttached) {
      proxLastText.removeEventListener('animationend', onTextAnimationEnd);
      endAttached = false;
    }
  }
  function startProximamente(){
    if (!proxSection) return;
    proxSection.classList.remove('animate');
    if (proxSubtitle)  proxSubtitle.classList.remove('animate');
    if (proxVideoWrap) proxVideoWrap.classList.remove('show-video');
    detachTextEnd();
    if (proxVideo){ try { proxVideo.pause(); proxVideo.currentTime = 0; } catch {} }
    forceReflow(proxSection); forceReflow(proxSubtitle); forceReflow(proxVideoWrap);
    proxSection.classList.add('animate');
    if (proxSubtitle) proxSubtitle.classList.add('animate');
    attachTextEnd();
  }
  function resetProximamente(hard = true){
    if (!proxSection) return;
    proxSection.classList.remove('animate');
    if (proxSubtitle)  proxSubtitle.classList.remove('animate');
    if (hard && proxVideoWrap) proxVideoWrap.classList.remove('show-video');
    if (proxVideo){ try { if (!proxVideo.paused) proxVideo.pause(); proxVideo.currentTime = 0; } catch {} }
    detachTextEnd();
    forceReflow(proxSection); forceReflow(proxSubtitle); forceReflow(proxVideoWrap);
  }

  // ===== SPAM (section2) =====
  const spamSection = document.getElementById('section2') || sections.find(s => s.querySelector('.spam-grid')) || null;
  let spamTimer = null;
  let spamIdx = 0;

  function startSpam(){
    if (!spamSection) return;

    const v = spamSection.querySelector('.spam-video') || spamSection.querySelector('video');
    if (v){ try { v.currentTime = 0; } catch{} ensureAutoplay(v); }

    const msgs = Array.from(spamSection.querySelectorAll('.spam-rotator .msg'));
    if (msgs.length){
      msgs.forEach(m => m.classList.remove('show'));
      spamIdx = 0;
      msgs[0].classList.add('show');

      clearInterval(spamTimer);
      spamTimer = setInterval(() => {
        const prev = spamIdx;
        spamIdx = (spamIdx + 1) % msgs.length;
        msgs[prev].classList.remove('show');
        msgs[spamIdx].classList.add('show');
      }, 2400);
    }
  }
  function resetSpam(){
    clearInterval(spamTimer);
    spamTimer = null;
    const msgs = spamSection ? spamSection.querySelectorAll('.spam-rotator .msg') : [];
    msgs.forEach(m => m.classList.remove('show'));
    const v = spamSection ? (spamSection.querySelector('.spam-video') || spamSection.querySelector('video')) : null;
    if (v){ try { v.pause(); v.currentTime = 0; } catch{} }
  }

  // ===== NAVEGACIÓN (una sola función showSection) =====
  function showSection(index) {
    if (index === currentSection || index < 0 || index >= sections.length) return;

    const leaving  = sections[currentSection];
    const entering = sections[index];

    // resetear los “…” al salir de la sección 1
    if (leaving === titleSection) stopEllipsisLoop();

    // hooks al salir
    if (leaving === proxSection) resetProximamente(true);
    if (leaving === spamSection) resetSpam();

    sections.forEach((sec, i) => {
      const isActive = i === index;
      sec.classList.toggle('active', isActive);
      sec.toggleAttribute('inert', !isActive);
      sec.setAttribute('aria-hidden', String(!isActive));
    });

    currentSection = index;

    // hooks al entrar
    requestAnimationFrame(() => {
      if (entering === titleSection) startTitle();
      if (entering === proxSection)  startProximamente();
      if (entering === spamSection)  startSpam();
    });
  }

  // Estado inicial: disparar hooks de la activa
  requestAnimationFrame(() => {
    const active = sections[currentSection];
    if (active === titleSection) startTitle();
    if (active === proxSection)  startProximamente();
    if (active === spamSection)  startSpam();
  });

  // Scroll rueda
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentSection < sections.length - 1) {
      showSection(currentSection + 1);
    } else if (e.deltaY < 0 && currentSection > 0) {
      showSection(currentSection - 1);
    }
  }, { passive: false });

  // Flechas teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
      showSection(currentSection + 1);
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
      showSection(currentSection - 1);
    }
  });

  // Debug clicks badges
  document.querySelectorAll('.store-badge').forEach(a=>{
    a.addEventListener('click', e => console.log('click en', e.currentTarget, 'href=', a.href));
  });
})();