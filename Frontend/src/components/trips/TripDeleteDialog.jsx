function TripDeleteDialog({ trip, deleting, onCancel, onConfirm }) {
  if (!trip) {
    return null
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card drivers-delete-dialog" aria-label="Delete trip confirmation">
        <header className="vehicles-modal-header">
          <h3>Delete Trip</h3>
        </header>

        <p>
          Are you sure you want to delete trip <strong>#{trip.id}</strong>?
        </p>

        <div className="vehicles-form-actions">
          <button type="button" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default TripDeleteDialog
