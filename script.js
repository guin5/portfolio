(() => {
  const root = document.documentElement;
  const storageKey = 'portfolio-theme';
  let theme = 'light';

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch {
    // The portfolio still works when browser storage is unavailable.
  }

  // Apply before the body renders to avoid a flash when returning in dark mode.
  root.dataset.theme = theme;

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function applyTheme(nextTheme) {
      theme = nextTheme;
      root.dataset.theme = theme;
      const isDark = theme === 'dark';
      button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      button.setAttribute('aria-pressed', String(isDark));
      button.querySelector('span').textContent = isDark ? 'Light mode' : 'Dark mode';
      themeColor.content = isDark ? '#182124' : '#ffffff';
    }

    applyTheme(theme);
    button.hidden = false;
    button.addEventListener('click', () => {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        // Theme changes remain usable for the current visit.
      }
    });

    window.addEventListener('storage', (event) => {
      if (event.key === storageKey) {
        applyTheme(event.newValue === 'dark' ? 'dark' : 'light');
      }
    });

    const sections = [...document.querySelectorAll('main > article[id]')];
    const links = [...document.querySelectorAll('.section-nav a')];
    let scheduled = false;

    function updateSection() {
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 160) current = section;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1];
      }
      for (const link of links) {
        if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
      scheduled = false;
    }

    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateSection);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateSection();
  });
})();
