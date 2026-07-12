function FuelDetailsModal({ record, onClose }) {
  if (!record) {
    return null
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card">
        <header className="vehicles-modal-header">
          <h3>Fuel Record Details</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="vehicles-view-grid">
          <p><strong>Fuel Entry ID:</strong> {record.id || '—'}</p>
          <p>
            <strong>Vehicle:</strong>{' '}
            {record.vehicle_name
              ? `${record.vehicle_name} (${record.registration_number || 'No Reg'})`
              : record.registration_number || '—'}
          </p>
          <p><strong>Quantity:</strong> {record.liters || '—'}</p>
          <p><strong>Cost:</strong> {record.cost || '—'}</p>
          <p><strong>Date:</strong> {record.date || '—'}</p>
        </div>
      </section>
    </div>
  )
}

export default FuelDetailsModal
