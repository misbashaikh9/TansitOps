function TripToolbar({
  search,
  statusFilter,
  dateFilter,
  vehicleFilter,
  statuses,
  vehicles,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onVehicleChange,
  onAdd,
  onRefresh,
}) {
  return (
    <section className="panel-card vehicles-toolbar">
      <div className="vehicles-toolbar-grid trips-toolbar-grid">
        <label className="vehicles-field vehicles-field-search trips-field-search">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by Trip ID, Driver, or Vehicle"
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
          <span>Date</span>
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

        <div className="vehicles-action-group">
          <button type="button" className="vehicles-action-button" onClick={onRefresh}>
            Refresh
          </button>
          <button type="button" className="vehicles-action-button" onClick={onAdd}>
            Add Trip
          </button>
        </div>
      </div>
    </section>
  )
}

export default TripToolbar
