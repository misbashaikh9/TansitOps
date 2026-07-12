function DriverDeleteDialog({ driver, deleting, onCancel, onConfirm }) {
  if (!driver) {
    return null
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card drivers-delete-dialog">
        <header className="vehicles-modal-header">
          <h3>Delete Driver</h3>
        </header>

        <p>
          Are you sure you want to delete <strong>{driver.name || driver.license_number || 'this driver'}</strong>?
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

export default DriverDeleteDialog
