(() => {
  const LANG_STORAGE_KEY = 'lang';
  const BTN_SELECTOR     = '.btn-idioma';
  const LABEL_SELECTOR   = '.btn-idioma p';

  // ⚠️ Ajustá esta ruta si tus JSON están en otro lado
  const I18N_BASE = '/i18n/'; // ejemplo: '../i18n/' si estás dentro de /pages/

  const I18N = {
    current: 'es',
    dicts: {},

    async load(lang) {
      this.current = lang;
      if (!this.dicts[lang]) {
        const url = `${I18N_BASE}${lang}.json?t=${Date.now()}`; // evita cache al desarrollar
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
        this.dicts[lang] = await res.json();
      }
      this.apply();
    },

    t(path, fallback) {
      const parts = path.split('.');
      let obj = this.dicts[this.current];
      for (const p of parts) {
        if (obj && Object.prototype.hasOwnProperty.call(obj, p)) obj = obj[p];
        else return fallback ?? path; // fallback: la key misma
      }
      return obj;
    },

    apply() {
      const lang = this.current;
      document.documentElement.setAttribute('lang', lang);

      // Texto (por defecto textContent). Si querés HTML, usá data-i18n-mode="html"
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key  = el.getAttribute('data-i18n');
        const mode = el.getAttribute('data-i18n-mode'); // "html" | "text"
        const val  = this.t(key);
        if (val == null) return;
        if (mode === 'html') el.innerHTML   = val;
        else                 el.textContent = val;
      });

      // Atributos (placeholder, title, aria-*)
      // Sintaxis: data-i18n-attr="placeholder:form.email_placeholder; aria-label:form.email_aria"
      document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const map = el.getAttribute('data-i18n-attr');
        map.split(';').forEach(pair => {
          const [attr, key] = pair.split(':').map(s => s && s.trim());
          if (!attr || !key) return;
          const v = this.t(key);
          if (v != null) el.setAttribute(attr, v);
        });
      });
    }
  };

  // --- helpers botón ES/EN (reusa tu UI actual)
  function setButtonLabel(lang) {
    const label = document.querySelector(LABEL_SELECTOR);
    if (label) label.textContent = lang.toUpperCase();
  }
  async function setLanguage(lang) {
    setButtonLabel(lang);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    try { await I18N.load(lang); } catch (e) { console.error(e); }
  }

  // Init
  document.addEventListener('DOMContentLoaded', async () => {
    const saved   = localStorage.getItem(LANG_STORAGE_KEY);
    const current = (document.querySelector(LABEL_SELECTOR)?.textContent || '').trim().toLowerCase();
    let initial   = saved || (current === 'en' ? 'en' : 'es');
    await setLanguage(initial);

    // Toggle al click (con la animación de tu botón)
    const btn = document.querySelector(BTN_SELECTOR);
    const label = document.querySelector(LABEL_SELECTOR);
    if (btn && label) {
      label.style.transition = 'opacity 160ms ease, transform 160ms ease';
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        // fade-out + slide-up del texto del botón
        label.style.opacity = '0';
        label.style.transform = 'translateY(-6px)';
        label.addEventListener('transitionend', async function handler() {
          label.removeEventListener('transitionend', handler);
          const next = (I18N.current === 'es') ? 'en' : 'es';
          await setLanguage(next);
          // preparar reentrada desde abajo
          label.style.transform = 'translateY(6px)';
          requestAnimationFrame(() => {
            label.style.opacity = '1';
            label.style.transform = 'translateY(0)';
          });
        }, { once: true });
      });
    }
  });
})();

