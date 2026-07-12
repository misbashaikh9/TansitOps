function FuelToolbar({
  search,
  dateFrom,
  dateTo,
  vehicleFilter,
  sortBy,
  sortDirection,
  vehicles,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
  onVehicleChange,
  onSortByChange,
  onSortDirectionChange,
  onAdd,
  onAddExpense,
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
            placeholder="Search by vehicle, liters, or cost"
          />
        </label>

        <label className="vehicles-field">
          <span>Date From</span>
          <input type="date" value={dateFrom} onChange={(event) => onDateFromChange(event.target.value)} />
        </label>

        <label className="vehicles-field">
          <span>Date To</span>
          <input type="date" value={dateTo} onChange={(event) => onDateToChange(event.target.value)} />
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
            <option value="date">Date</option>
            <option value="cost">Cost</option>
            <option value="liters">Quantity</option>
            <option value="vehicle_name">Vehicle</option>
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
          Add Fuel
        </button>

        <button type="button" className="vehicles-add-button" onClick={onAddExpense}>
          Add Expense
        </button>
      </div>
    </section>
  )
}

export default FuelToolbar
