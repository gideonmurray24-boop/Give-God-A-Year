const navLinks = document.querySelectorAll('.nav-links a');
const navSections = [...navLinks]
  .filter((link) => link.getAttribute('href')?.startsWith('#'))
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter(({ section }) => section);
const logo = document.querySelector('.logo');

function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPage === '' || currentPage === 'index.html';

  if (!isHomePage) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isActive = href === currentPage || (href === 'index.html' && currentPage === 'index.html');
      link.classList.toggle('is-active', isActive);
    });
    if (logo) logo.classList.remove('is-active');
    return;
  }

  const checkpoint = window.scrollY + window.innerHeight * 0.28;
  const isHome = checkpoint < (navSections[0]?.section.offsetTop || 0);
  let currentSection = isHome ? null : navSections[0]?.section;

  navSections.forEach(({ section }) => {
    if (section.offsetTop <= checkpoint) currentSection = section;
  });

  navSections.forEach(({ link, section }) => {
    link.classList.toggle('is-active', section === currentSection);
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) {
      const isCurrent = href === 'index.html';
      link.classList.toggle('is-active', isCurrent && isHome);
    }
  });

  if (logo) logo.classList.toggle('is-active', isHome);
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll-triggered reveal animations
const revealSelectors = [
  '.hero-text', '.hero-cover',
  '.section-heading', '.about-content', '.pillar',
  '.author-photo', '.author-bio',
  '.excerpt', '.review-card',
  '.buy-inner', '.newsletter-form'
];
const revealEls = document.querySelectorAll(revealSelectors.join(','));

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 3) * 0.08}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el) => revealObserver.observe(el));

const hero = document.querySelector('.hero');
let scrollFrame;

function updateHeroShape() {
  const progress = Math.min(window.scrollY / 360, 1);
  hero.style.setProperty('--hero-side-inset', `${progress * 42}px`);
  hero.style.setProperty('--hero-corner-radius', `${progress * 34}px`);
  scrollFrame = undefined;
}

window.addEventListener('scroll', () => {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(updateHeroShape);
  }
}, { passive: true });

updateHeroShape();

// Newsletter form (front-end only placeholder)
const form = document.getElementById('newsletterForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  if (email) {
    note.textContent = `Thanks! We'll keep ${email} updated on Give God a Year.`;
    form.reset();
  }
});
