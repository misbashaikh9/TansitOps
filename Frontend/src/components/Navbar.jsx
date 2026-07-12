function Navbar({
  pageTitle,
  currentUser,
  searchValue,
  onSearchChange,
  onMenuToggle,
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
          <input
            type="search"
            placeholder="Search vehicles, drivers, or trips"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

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
