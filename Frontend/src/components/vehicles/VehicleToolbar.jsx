function VehicleToolbar({
  search,
  statusFilter,
  typeFilter,
  typeOptions,
  sortBy,
  sortDirection,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortByChange,
  onSortDirectionChange,
  onAdd,
}) {
  return (
    <section className="panel-card vehicles-toolbar">
      <div className="vehicles-toolbar-grid">
        <label className="vehicles-field vehicles-field-search">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by number, name, model, driver"
          />
        </label>

        <label className="vehicles-field">
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="maintenance">Under Maintenance</option>
            <option value="out_of_service">Out of Service</option>
          </select>
        </label>

        <label className="vehicles-field">
          <span>Type</span>
          <select value={typeFilter} onChange={(event) => onTypeChange(event.target.value)}>
            <option value="all">All</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="vehicles-field">
          <span>Sort By</span>
          <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
            <option value="registration_number">Vehicle Number</option>
            <option value="vehicle_name">Vehicle Name</option>
            <option value="type">Type</option>
            <option value="model">Model</option>
            <option value="status">Status</option>
          </select>
        </label>

        <label className="vehicles-field">
          <span>Direction</span>
          <select value={sortDirection} onChange={(event) => onSortDirectionChange(event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <button type="button" className="vehicles-add-button" onClick={onAdd}>
          Add Vehicle
        </button>
      </div>
    </section>
  )
}

export default VehicleToolbar
