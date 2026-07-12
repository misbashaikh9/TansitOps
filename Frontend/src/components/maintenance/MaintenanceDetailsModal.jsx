function MaintenanceDetailsModal({ record, onClose }) {
  if (!record) {
    return null
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card">
        <header className="vehicles-modal-header">
          <h3>Maintenance Details</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="vehicles-view-grid">
          <p><strong>Maintenance ID:</strong> {record.id || '—'}</p>
          <p><strong>Status:</strong> {record.status || '—'}</p>
          <p><strong>Description:</strong> {record.description || '—'}</p>
          <p>
            <strong>Vehicle:</strong>{' '}
            {record.vehicle_name
              ? `${record.vehicle_name} (${record.registration_number || 'No Reg'})`
              : record.registration_number || '—'}
          </p>
          <p><strong>Start Date:</strong> {record.start_date || '—'}</p>
          <p><strong>End Date:</strong> {record.end_date || '—'}</p>
        </div>
      </section>
    </div>
  )
}

export default MaintenanceDetailsModal
