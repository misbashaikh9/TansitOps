function VehicleViewModal({ vehicle, onClose }) {
  if (!vehicle) {
    return null
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card">
        <header className="vehicles-modal-header">
          <h3>Vehicle Details</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="vehicles-view-grid">
          <p><strong>Vehicle Number:</strong> {vehicle.registration_number || '—'}</p>
          <p><strong>Vehicle Name:</strong> {vehicle.vehicle_name || '—'}</p>
          <p><strong>Type:</strong> {vehicle.type || '—'}</p>
          <p><strong>Model:</strong> {vehicle.model || '—'}</p>
          <p><strong>Assigned Driver:</strong> {vehicle.assigned_driver || vehicle.driver_name || '—'}</p>
          <p><strong>Fuel Type:</strong> {vehicle.fuel_type || '—'}</p>
          <p><strong>Last Service Date:</strong> {vehicle.last_service_date || '—'}</p>
          <p><strong>Status:</strong> {vehicle.status || '—'}</p>
        </div>
      </section>
    </div>
  )
}

export default VehicleViewModal
