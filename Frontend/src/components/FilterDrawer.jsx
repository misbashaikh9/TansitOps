function FilterDrawer({ title, isOpen, onClose, onApply, onReset, children }) {
  return (
    <div className={`filter-drawer-overlay ${isOpen ? 'is-open' : ''}`} onClick={onClose}>
      <aside
        className={`filter-drawer ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="filter-drawer-header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close filters">
            x
          </button>
        </header>

        <div className="filter-drawer-body">{children}</div>

        <footer className="filter-drawer-footer">
          <button type="button" className="vehicles-action-button" onClick={onReset}>
            Reset Filters
          </button>
          <button type="button" className="vehicles-action-button" onClick={onApply}>
            Apply Filters
          </button>
        </footer>
      </aside>
    </div>
  )
}

export default FilterDrawer
