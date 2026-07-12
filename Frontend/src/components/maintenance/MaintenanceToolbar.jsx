function MaintenanceToolbar({
  search,
  statusFilter,
  dateFilter,
  vehicleFilter,
  sortBy,
  sortDirection,
  statuses,
  vehicles,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onVehicleChange,
  onSortByChange,
  onSortDirectionChange,
  onAdd,
}) {
  return (
    <section className="panel-card vehicles-toolbar">
      <div className="vehicles-toolbar-grid maintenance-toolbar-grid">
        <label className="vehicles-field vehicles-field-search maintenance-field-search">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by description or vehicle"
          />
        </label>

        <label className="vehicles-field">
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
            <option value="all">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="vehicles-field">
          <span>Start Date</span>
          <input type="date" value={dateFilter} onChange={(event) => onDateChange(event.target.value)} />
        </label>

        <label className="vehicles-field">
          <span>Vehicle</span>
          <select value={vehicleFilter} onChange={(event) => onVehicleChange(event.target.value)}>
            <option value="all">All</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </label>

        <label className="vehicles-field">
          <span>Sort By</span>
          <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
            <option value="start_date">Start Date</option>
            <option value="end_date">End Date</option>
            <option value="status">Status</option>
            <option value="description">Description</option>
          </select>
        </label>

        <label className="vehicles-field">
          <span>Direction</span>
          <select value={sortDirection} onChange={(event) => onSortDirectionChange(event.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>

        <button type="button" className="vehicles-add-button" onClick={onAdd}>
          Add Maintenance
        </button>
      </div>
    </section>
  )
}

export default MaintenanceToolbar
