import { useState } from 'react'

const DEFAULT_TYPE_OPTIONS = ['Toll', 'Maintenance', 'Insurance', 'Parking', 'Other']

function ExpenseCreateModal({ open, submitting, vehicles, onClose, onSubmit }) {
  const [form, setForm] = useState({
    vehicle_id: vehicles[0]?.id ? String(vehicles[0].id) : '',
    expense_type: 'Toll',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  })

  if (!open) {
    return null
  }

  const resetAndClose = () => {
    setForm({
      vehicle_id: vehicles[0]?.id ? String(vehicles[0].id) : '',
      expense_type: 'Toll',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      note: '',
    })
    onClose()
  }

  const submit = (event) => {
    event.preventDefault()

    onSubmit({
      vehicle_id: Number(form.vehicle_id),
      expense_type: form.expense_type,
      amount: Number(form.amount),
      date: form.date,
      note: form.note.trim(),
    })
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card drivers-delete-dialog" aria-label="Create expense record">
        <header className="vehicles-modal-header">
          <h3>Add Expense Record</h3>
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
            Expense Type
            <select
              required
              value={form.expense_type}
              onChange={(event) => setForm((previous) => ({ ...previous, expense_type: event.target.value }))}
            >
              {DEFAULT_TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {type}
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
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.amount}
              onChange={(event) => setForm((previous) => ({ ...previous, amount: event.target.value }))}
            />
          </label>

          <label style={{ gridColumn: '1 / -1' }}>
            Note
            <input
              type="text"
              placeholder="Optional notes"
              value={form.note}
              onChange={(event) => setForm((previous) => ({ ...previous, note: event.target.value }))}
            />
          </label>

          <div className="vehicles-form-actions">
            <button type="button" onClick={resetAndClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting || !form.vehicle_id}>
              {submitting ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ExpenseCreateModal
