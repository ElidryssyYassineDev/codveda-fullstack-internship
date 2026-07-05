// client/src/components/Navbar.jsx
// Now receives isDarkMode and onThemeToggle props from App.
// Renders the toggle button and passes intent up via the callback.

function Navbar({ isDarkMode, onThemeToggle }) {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__title">
          Product<span className="navbar__accent">.</span>Manager
        </span>
      </div>

      <nav className="navbar__links">
        <span className="navbar__tag">Level 2 — React</span>

        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          // aria-label makes the button accessible to screen readers —
          // an icon-only button with no visible text needs this.
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}

export default Navbar