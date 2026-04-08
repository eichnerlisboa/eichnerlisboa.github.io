/**
 * Kevin Eichner de Lemos Lisboa - Portfolio Logic
 */

async function initGlobal() {
  // 1. Find all placeholders
  const components = document.querySelectorAll('[data-include]');

  const promises = Array.from(components).map(async (el) => {
    const file = el.getAttribute('data-include');
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error("Fetch failed");
      const html = await response.text();
      el.outerHTML = html;
    } catch (err) {
      console.error("Error loading:", file);
    }
  });

  // Wait for everything (Header + Sections) to load
  await Promise.all(promises);


  // 2. Setup components that exist on the current page
  setupMobileMenu();
  setupLanguageToggle();
  updateYear();

  // 3. Trigger animations
  initAnimations();

  // Check if the URL has a hash (e.g., #skills) and scroll to it
  handleInitialScroll();


}


// Scroll fade-in
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/**
 * Mobile Navigation Logic using Tabler Icons (Menu-2)
 */
function setupMobileMenu() {
  const toggler = document.querySelector('.navbar-toggler');
  const menu = document.querySelector('#navbarSupportedContent');
  if (!toggler || !menu) return;

  const menu2SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>`;
  const closeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`;

  toggler.innerHTML = menu2SVG;

  toggler.onclick = () => {
    const isOpen = menu.classList.toggle('show');
    toggler.innerHTML = isOpen ? closeSVG : menu2SVG;
  };
}

/**
 * Language Toggle Logic
 */
function setupLanguageToggle(defaultLang) {
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
function updateYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
function handleInitialScroll() {
  const hash = window.location.hash;
  if (hash) {
    // We use a slight timeout to ensure the browser has 
    // finished rendering the injected HTML.
    setTimeout(() => {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}

document.addEventListener('DOMContentLoaded', initGlobal);