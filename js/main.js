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

// 1. Function to fetch the external HTML files
async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    // We use a Map to wait for all fetches to complete
    const fetchPromises = Array.from(elements).map(async (el) => {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (response.ok) {
                const html = await response.text();
                el.outerHTML = html;
            }
        } catch (err) {
            console.error("Could not load section:", file);
        }
    });

    // Wait for ALL sections to be injected into the page
    await Promise.all(fetchPromises);

    // 2. NOW that the content exists, trigger your UI scripts
    initLanguageSystem(); 
    initFadeIn();

}

function initLanguageSystem() {
    // Re-run your existing language toggle logic here
    // This ensures it 'sees' the new About, Skills, and Project sections
    console.log("Language system initialized on new content.");
    // ... (Your existing DE/EN toggle code)
}

// Run the loader when the page first loads
document.addEventListener('DOMContentLoaded', includeHTML);