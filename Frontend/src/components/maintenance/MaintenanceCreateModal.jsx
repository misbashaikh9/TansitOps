import { useMemo, useState } from 'react'

function defaultForm(vehicles) {
  return {
    vehicle_id: vehicles[0]?.id ? String(vehicles[0].id) : '',
    description: '',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: '',
    amount: '',
    status: 'In Shop',
  }
}

function MaintenanceCreateModal({ open, submitting, vehicles, onClose, onSubmit }) {
  const [form, setForm] = useState(() => defaultForm(vehicles))

  const vehicleOptions = useMemo(
    () => vehicles.map((vehicle) => ({
      id: vehicle.id,
      label: `${vehicle.name || 'Vehicle'} (${vehicle.registration_number || 'No Reg'})`,
    })),
    [vehicles],
  )

  if (!open) {
    return null
  }

  const resetAndClose = () => {
    setForm(defaultForm(vehicles))
    onClose()
  }

  const submit = (event) => {
    event.preventDefault()

    onSubmit({
      vehicle_id: Number(form.vehicle_id),
      description: form.description.trim(),
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      amount: form.amount === '' ? null : Number(form.amount),
      status: form.status,
    })
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card drivers-delete-dialog" aria-label="Create maintenance">
        <header className="vehicles-modal-header">
          <h3>Create Maintenance</h3>
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
              {vehicleOptions.length === 0 && <option value="">No vehicles available</option>}
              {vehicleOptions.map((vehicle) => (
                <option key={vehicle.id} value={String(vehicle.id)}>
                  {vehicle.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Status
            <select value={form.status} onChange={(event) => setForm((previous) => ({ ...previous, status: event.target.value }))}>
              <option value="In Shop">In Shop</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

          <label>
            Start Date
            <input
              type="date"
              value={form.start_date}
              onChange={(event) => setForm((previous) => ({ ...previous, start_date: event.target.value }))}
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              value={form.end_date}
              onChange={(event) => setForm((previous) => ({ ...previous, end_date: event.target.value }))}
            />
          </label>

          <label>
            Cost Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => setForm((previous) => ({ ...previous, amount: event.target.value }))}
            />
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            Description
            <input
              type="text"
              required
              placeholder="Maintenance details"
              value={form.description}
              onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
            />
          </label>

          <div className="vehicles-form-actions">
            <button type="button" onClick={resetAndClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting || !form.vehicle_id}>
              {submitting ? 'Saving...' : 'Create Maintenance'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default MaintenanceCreateModal
