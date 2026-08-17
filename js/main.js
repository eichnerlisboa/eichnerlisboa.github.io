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
  await Promise.all([
    populateProjectMenu(),
    populateProjectGrid()
  ]);

  setupMobileMenu();
  setupMobileDropdown();
  setupLinkClickListeners();
  updateYear();

  setupLanguageToggle();


  // 3. Trigger animations
  initAnimations();

  // Check if the URL has a hash (e.g., #skills) and scroll to it
  handleInitialScroll();

  

}
document.addEventListener('DOMContentLoaded', initGlobal);


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

  const menu2SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler-menu-2">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M4 6l16 0" />
<path d="M4 12l16 0" />
<path d="M4 18l16 0" />
</svg>`;
  const closeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler-x">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M18 6l-12 12" />
<path d="M6 6l12 12" />
</svg>`;

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
  console.log("transate")
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

async function populateProjectMenu() {
  const container = document.getElementById('dynamic-project-menu-links');
  if (!container) return;

  try {
    const response = await fetch('/projects/projects.json');
    const projects = await response.json();

    container.innerHTML = projects.map(project => `
            <a href="/projects/${project.id}.html" data-lang="en">${project.title_en}</a>
            <a href="/projects/${project.id}.html" data-lang="de">${project.title_de}</a>
        `).join('');
  } catch (err) {
    console.error("Error populating dropdown", err);
  }
}


async function populateProjectGrid() {
  const container = document.getElementById('dynamic-project-card-links');
  if (!container) return;

  try {
    const response = await fetch('/projects/projects.json');
    const projects = await response.json();

    container.innerHTML = projects.map(project => `
      <a href="projects/${project.id}.html" class="project-card">
        <div class="project-thumb">
          <div class="detail-image">
            <img src="/images/${project.id}/${project.image}" alt="${project.title_en} image">
          </div>
        </div>
        <div class="project-body">
          <span class="project-tag" data-lang="en">${project.title_en}</span>
          <span class="project-tag" data-lang="de">${project.title_de}</span>
          <h3 data-lang="en">${project.headline_en}</h3>
          <h3 data-lang="de">${project.headline_de}</h3>
          <p data-lang="en">${project.description_en}</p>
          <p data-lang="de">${project.description_de}</p>
          <p class="project-highlight">
            <span class="lang-inline" data-lang="en>${ project.highlights_en}</span>
            <span class="lang-inline" data-lang="de>${ project.highlights_de }</span>
          </p>
          <span class="read-more">
          <span data-lang="en" class="active lang-inline">Read more</span>
          <span data-lang="de" class="lang-inline">Mehr lesen</span>
          </span>
        </div>
      </a>
        `).join('');
  } catch (err) {
    console.error("Error populating dropdown", err);
  }
}

function setupMobileDropdown() {
  const toggleBtn = document.querySelector('.dropdown-toggle-btn');
  const dropdown = document.querySelector('.project-dropdown');
  const chevron = document.querySelector('.chevron');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', (e) => {
    // Stop propagation so it doesn't accidentally trigger parent clicks
    e.stopPropagation();

    const isActive = dropdown.classList.toggle('active');

    if (chevron) {
      chevron.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
    }
  });
}
function setupLinkClickListeners() {
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const projectDropdown = document.querySelector('.project-dropdown');
  const toggler = document.querySelector('.navbar-toggler'); // Get the button

  // Define the original menu icon again so we can switch back to it
  const menu2SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler-menu-2">
<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
<path d="M4 6l16 0" />
<path d="M4 12l16 0" />
<path d="M4 18l16 0" />
</svg>`;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');

    // Check if a link was clicked while the menu is open
    if (link && navbarCollapse && navbarCollapse.classList.contains('show')) {

      // 1. Close the main mobile menu
      navbarCollapse.classList.remove('show');

      // 2. Reset the toggler icon back to hamburger
      if (toggler) {
        toggler.innerHTML = menu2SVG;
      }

      // 3. Close the project dropdown if it was open
      if (projectDropdown) {
        projectDropdown.classList.remove('active');
        const chevron = projectDropdown.querySelector('.chevron');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    }
  });
}