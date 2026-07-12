import { useState } from 'react'

function TripCompleteModal({ trip, submitting, onClose, onSubmit }) {
  const [form, setForm] = useState({
    final_odometer: trip?.final_odometer ? String(trip.final_odometer) : '',
    fuel_consumed: trip?.fuel_consumed ? String(trip.fuel_consumed) : '',
  })

  if (!trip) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      final_odometer: Number(form.final_odometer || 0),
      fuel_consumed: Number(form.fuel_consumed || 0),
    })
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card drivers-delete-dialog" aria-label="Complete trip">
        <header className="vehicles-modal-header">
          <h3>Complete Trip #{trip.id}</h3>
          <button type="button" onClick={onClose} disabled={submitting}>
            Close
          </button>
        </header>

        <form className="vehicles-form-grid" onSubmit={submit}>
          <label>
            Final Odometer
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.final_odometer}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, final_odometer: event.target.value }))
              }
            />
          </label>

          <label>
            Fuel Consumed (liters)
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.fuel_consumed}
              onChange={(event) =>
                setForm((previous) => ({ ...previous, fuel_consumed: event.target.value }))
              }
            />
          </label>

          <div className="vehicles-form-actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Completing...' : 'Complete Trip'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TripCompleteModal
