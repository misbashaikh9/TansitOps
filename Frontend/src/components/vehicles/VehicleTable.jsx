function VehicleTable({ vehicles, onView, onEdit, onDelete }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Fleet inventory</p>
          <h2>Vehicles</h2>
        </div>
      </div>

      <div className="trip-table-wrapper">
        <table className="trip-table vehicles-table">
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Vehicle Name</th>
              <th>Type</th>
              <th>Model</th>
              <th>Assigned Driver</th>
              <th>Fuel Type</th>
              <th>Last Service Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.registration_number || '—'}</td>
                <td>{vehicle.vehicle_name || '—'}</td>
                <td>{vehicle.type || '—'}</td>
                <td>{vehicle.model || '—'}</td>
                <td>{vehicle.assigned_driver || vehicle.driver_name || '—'}</td>
                <td>{vehicle.fuel_type || '—'}</td>
                <td>{vehicle.last_service_date || '—'}</td>
                <td>
                  <span className={`status-badge status-${String(vehicle.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {vehicle.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="vehicles-action-group">
                    <button type="button" className="vehicles-action-button" onClick={() => onView(vehicle)}>
                      View
                    </button>
                    <button type="button" className="vehicles-action-button" onClick={() => onEdit(vehicle)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="vehicles-action-button vehicles-action-danger"
                      onClick={() => onDelete(vehicle)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default VehicleTable
