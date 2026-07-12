function Sidebar({ items, activeItem, isOpen, onSelect, onClose, onLogout }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside className={`dashboard-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">TO</div>
          <div>
            <p className="sidebar-brand-label">TransitOps</p>
            <small>Fleet command center</small>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {items.map((item) => {
            const isActive = activeItem === item.id

            if (item.id === 'logout') {
              return (
                <button
                  key={item.id}
                  type="button"
                  className="sidebar-item sidebar-item-logout"
                  onClick={onLogout}
                >
                  <span className="sidebar-item-icon">{item.shortLabel}</span>
                  <span>{item.label}</span>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelect(item.id)}
              >
                <span className="sidebar-item-icon">{item.shortLabel}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
