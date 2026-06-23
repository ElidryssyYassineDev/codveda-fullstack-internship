const STORAGE_KEY = 'theme';
const root = document.documentElement;
const toggleBtn = document.getElementById('theme-toggle');

function currentTheme() {
  return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  toggleBtn.setAttribute('aria-pressed', String(theme === 'dark'));
  localStorage.setItem(STORAGE_KEY, theme);
}

toggleBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// Sync the button's ARIA state with whatever the <head> script already
// set, since this module loads after that script has already run.
toggleBtn.setAttribute('aria-pressed', String(currentTheme() === 'dark'));