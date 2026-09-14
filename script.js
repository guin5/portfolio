const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
const storedTheme = localStorage.getItem('portfolio-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
}

setTheme(storedTheme || preferredTheme);

themeButton.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  localStorage.setItem('portfolio-theme', nextTheme);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll('.nav-pill a')];
const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.hash === `#${visible.target.id}`);
  });
}, { rootMargin: '-25% 0px -60%', threshold: [0, 0.2, 0.5] });

sections.forEach((section) => sectionObserver.observe(section));
document.querySelector('#year').textContent = new Date().getFullYear();
