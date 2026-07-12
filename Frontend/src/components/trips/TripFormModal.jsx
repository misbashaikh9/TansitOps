import { useEffect, useState } from 'react'

const initialForm = {
  source: '',
  destination: '',
  vehicle_id: '',
  driver_id: '',
  cargo_weight: '',
  planned_distance: '',
  status: 'Draft',
}

function TripFormModal({
  isOpen,
  mode,
  trip,
  vehicles,
  drivers,
  saving,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (!trip) {
      setForm(initialForm)
      return
    }

    setForm({
      source: trip.source || '',
      destination: trip.destination || '',
      vehicle_id: String(trip.vehicle_id || ''),
      driver_id: String(trip.driver_id || ''),
      cargo_weight: String(trip.cargo_weight || ''),
      planned_distance: String(trip.planned_distance || ''),
      status: trip.status || 'Draft',
    })
  }, [trip])

  if (!isOpen) {
    return null
  }

  const onFieldChange = (name, value) => {
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card">
        <header className="vehicles-modal-header">
          <h3>{mode === 'edit' ? 'Edit Trip' : 'Create Trip'}</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <form className="vehicles-form-grid" onSubmit={submit}>
          <label>
            Source
            <input
              required
              value={form.source}
              onChange={(event) => onFieldChange('source', event.target.value)}
            />
          </label>

          <label>
            Destination
            <input
              required
              value={form.destination}
              onChange={(event) => onFieldChange('destination', event.target.value)}
            />
          </label>

          <label>
            Vehicle
            <select
              required
              value={form.vehicle_id}
              onChange={(event) => onFieldChange('vehicle_id', event.target.value)}
            >
              <option value="">Select vehicle</option>
              {vehicles.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.vehicle_name
                    ? `${item.vehicle_name} (${item.registration_number || 'No Reg'})`
                    : item.registration_number || `Vehicle #${item.id}`}
                </option>
              ))}
            </select>
          </label>

          <label>
            Driver
            <select
              required
              value={form.driver_id}
              onChange={(event) => onFieldChange('driver_id', event.target.value)}
            >
              <option value="">Select driver</option>
              {drivers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name || `Driver #${item.id}`}
                </option>
              ))}
            </select>
          </label>

          <label>
            Cargo Weight
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.cargo_weight}
              onChange={(event) => onFieldChange('cargo_weight', event.target.value)}
            />
          </label>

          <label>
            Planned Distance
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.planned_distance}
              onChange={(event) => onFieldChange('planned_distance', event.target.value)}
            />
          </label>

          {mode === 'edit' && (
            <label>
              Status
              <select value={form.status} onChange={(event) => onFieldChange('status', event.target.value)}>
                <option value="Draft">Draft</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
          )}

          <div className="vehicles-form-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TripFormModal
