function DriverViewModal({ driver, onClose }) {
  if (!driver) {
    return null
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card">
        <header className="vehicles-modal-header">
          <h3>Driver Details</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="vehicles-view-grid">
          <p><strong>Driver Name:</strong> {driver.name || '—'}</p>
          <p><strong>Phone Number:</strong> {driver.contact_number || '—'}</p>
          <p><strong>Email:</strong> {driver.email || '—'}</p>
          <p><strong>License Number:</strong> {driver.license_number || '—'}</p>
          <p><strong>License Category:</strong> {driver.license_category || '—'}</p>
          <p><strong>License Expiry:</strong> {driver.license_expiry || '—'}</p>
          <p><strong>Assigned Vehicle:</strong> {driver.assigned_vehicle || driver.vehicle_name || '—'}</p>
          <p><strong>Status:</strong> {driver.status || '—'}</p>
        </div>
      </section>
    </div>
  )
}

export default DriverViewModal
