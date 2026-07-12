function DriverToolbar({
  search,
  statusFilter,
  vehicleFilter,
  statuses,
  vehicles,
  onSearchChange,
  onStatusChange,
  onVehicleChange,
  onAdd,
}) {
  return (
    <section className="panel-card vehicles-toolbar">
      <div className="vehicles-toolbar-grid drivers-toolbar-grid">
        <label className="vehicles-field vehicles-field-search drivers-field-search">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by driver name or license number"
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
          <span>Assigned Vehicle</span>
          <select value={vehicleFilter} onChange={(event) => onVehicleChange(event.target.value)}>
            <option value="all">All</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="vehicles-add-button" onClick={onAdd}>
          Add Driver
        </button>
      </div>
    </section>
  )
}

export default DriverToolbar
