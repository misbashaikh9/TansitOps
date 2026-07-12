import { useState } from 'react'

function FuelCreateModal({ open, submitting, vehicles, onClose, onSubmit }) {
  const [form, setForm] = useState({
    vehicle_id: vehicles[0]?.id ? String(vehicles[0].id) : '',
    liters: '',
    cost: '',
    date: new Date().toISOString().slice(0, 10),
  })

  if (!open) {
    return null
  }

  const resetAndClose = () => {
    setForm({
      vehicle_id: vehicles[0]?.id ? String(vehicles[0].id) : '',
      liters: '',
      cost: '',
      date: new Date().toISOString().slice(0, 10),
    })
    onClose()
  }

  const submit = (event) => {
    event.preventDefault()

    onSubmit({
      vehicle_id: Number(form.vehicle_id),
      liters: Number(form.liters),
      cost: Number(form.cost),
      date: form.date,
    })
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card drivers-delete-dialog" aria-label="Create fuel record">
        <header className="vehicles-modal-header">
          <h3>Add Fuel Record</h3>
          <button type="button" onClick={resetAndClose} disabled={submitting}>
            Close
          </button>
        </header>

        <form className="vehicles-form-grid" onSubmit={submit}>
          <label>
            Vehicle
            <select
              required
              value={form.vehicle_id}
              onChange={(event) => setForm((previous) => ({ ...previous, vehicle_id: event.target.value }))}
            >
              {vehicles.length === 0 && <option value="">No vehicles available</option>}
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={String(vehicle.id)}>
                  {vehicle.vehicle_name
                    ? `${vehicle.vehicle_name} (${vehicle.registration_number || 'No Reg'})`
                    : vehicle.registration_number || `Vehicle ${vehicle.id}`}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input
              type="date"
              required
              value={form.date}
              onChange={(event) => setForm((previous) => ({ ...previous, date: event.target.value }))}
            />
          </label>

          <label>
            Liters
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={form.liters}
              onChange={(event) => setForm((previous) => ({ ...previous, liters: event.target.value }))}
            />
          </label>

          <label>
            Cost
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.cost}
              onChange={(event) => setForm((previous) => ({ ...previous, cost: event.target.value }))}
            />
          </label>

          <div className="vehicles-form-actions">
            <button type="button" onClick={resetAndClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting || !form.vehicle_id}>
              {submitting ? 'Saving...' : 'Save Fuel Record'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default FuelCreateModal
