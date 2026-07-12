function Navbar({
  pageTitle,
  currentUser,
  searchValue,
  onSearchChange,
  onMenuToggle,
  theme,
  onThemeToggle,
}) {
  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-title-group">
        <button type="button" className="navbar-menu-button" onClick={onMenuToggle}>
          Menu
        </button>
        <div>
          <p className="dashboard-eyebrow">Operations overview</p>
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div className="dashboard-navbar-actions">
        <label className="navbar-search">
          <span className="sr-only">Search dashboard</span>
          <span className="navbar-search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search vehicles, drivers, or trips"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Global search"
          />
          {searchValue && (
            <button
              type="button"
              className="navbar-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              x
            </button>
          )}
          <kbd className="navbar-search-shortcut">Ctrl+K</kbd>
        </label>

        <button type="button" className="navbar-theme-toggle" onClick={onThemeToggle} aria-label="Toggle theme">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>

        <button type="button" className="navbar-notification" aria-label="Notifications">
          <span className="navbar-notification-badge">3</span>
          <span className="navbar-notification-label">Alerts</span>
        </button>

        <div className="navbar-profile">
          <div className="navbar-avatar">
            {(currentUser?.name || 'TU')
              .split(' ')
              .slice(0, 2)
              .map((word) => word[0]?.toUpperCase())
              .join('')}
          </div>
          <div>
            <p>{currentUser?.name || 'Transit User'}</p>
            <small>{currentUser?.email || 'fleet@transitops.com'}</small>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
