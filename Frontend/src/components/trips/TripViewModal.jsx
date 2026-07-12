function TripViewModal({ trip, onClose }) {
  if (!trip) {
    return null
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card">
        <header className="vehicles-modal-header">
          <h3>Trip Details</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="vehicles-view-grid">
          <p><strong>Trip ID:</strong> {trip.id || '—'}</p>
          <p><strong>Driver:</strong> {trip.driver_name || '—'}</p>
          <p><strong>Vehicle:</strong> {trip.vehicle_name || trip.registration_number || '—'}</p>
          <p><strong>Source:</strong> {trip.source || '—'}</p>
          <p><strong>Destination:</strong> {trip.destination || '—'}</p>
          <p><strong>Start Date & Time:</strong> {trip.start_datetime || trip.created_at || '—'}</p>
          <p><strong>End Date & Time:</strong> {trip.end_datetime || '—'}</p>
          <p><strong>Distance:</strong> {trip.planned_distance || trip.distance || '—'}</p>
          <p><strong>Status:</strong> {trip.status || '—'}</p>
        </div>
      </section>
    </div>
  )
}

export default TripViewModal
