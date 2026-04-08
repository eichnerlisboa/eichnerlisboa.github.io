// Shared language toggle logic
function initLang(defaultLang) {
  let lang = defaultLang || 'en';
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  function setLang(l) {
    lang = l;
    btn.textContent = l === 'en' ? 'DE' : 'EN';
    document.querySelectorAll('[data-lang]').forEach(el => {
      const isInline = el.classList.contains('lang-inline');
      if (el.dataset.lang === l) {
        el.classList.add('active');
        if (!isInline) el.style.display = 'block';
      } else {
        el.classList.remove('active');
        if (!isInline) el.style.display = 'none';
      }
    });
    localStorage.setItem('portfolio-lang', l);
  }

  btn.addEventListener('click', () => setLang(lang === 'en' ? 'de' : 'en'));
  const saved = localStorage.getItem('portfolio-lang');
  setLang(saved || defaultLang || 'en');
}

// Scroll fade-in
function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Footer year
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initLang();
  initFadeIn();
  initYear();
});
