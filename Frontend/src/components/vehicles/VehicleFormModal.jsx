import { useEffect, useState } from 'react'

const initialFormState = {
  registration_number: '',
  vehicle_name: '',
  type: '',
  model: '',
  max_load_capacity: '',
  odometer: '',
  acquisition_cost: '',
  status: 'Available',
}

function VehicleFormModal({ isOpen, mode, vehicle, onClose, onSave, saving }) {
  const [form, setForm] = useState(initialFormState)

  useEffect(() => {
    if (!vehicle) {
      setForm(initialFormState)
      return
    }

    setForm({
      registration_number: vehicle.registration_number || '',
      vehicle_name: vehicle.vehicle_name || '',
      type: vehicle.type || '',
      model: vehicle.model || '',
      max_load_capacity: vehicle.max_load_capacity || '',
      odometer: vehicle.odometer || '',
      acquisition_cost: vehicle.acquisition_cost || '',
      status: vehicle.status || 'Available',
    })
  }, [vehicle])

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
          <h3>{mode === 'edit' ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <form className="vehicles-form-grid" onSubmit={submit}>
          <label>
            Vehicle Number
            <input
              required
              value={form.registration_number}
              onChange={(event) => onFieldChange('registration_number', event.target.value)}
            />
          </label>

          <label>
            Vehicle Name
            <input
              required
              value={form.vehicle_name}
              onChange={(event) => onFieldChange('vehicle_name', event.target.value)}
            />
          </label>

          <label>
            Type
            <input value={form.type} onChange={(event) => onFieldChange('type', event.target.value)} />
          </label>

          <label>
            Model
            <input value={form.model} onChange={(event) => onFieldChange('model', event.target.value)} />
          </label>

          <label>
            Max Load Capacity
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.max_load_capacity}
              onChange={(event) => onFieldChange('max_load_capacity', event.target.value)}
            />
          </label>

          <label>
            Odometer
            <input
              type="number"
              min="0"
              value={form.odometer}
              onChange={(event) => onFieldChange('odometer', event.target.value)}
            />
          </label>

          <label>
            Acquisition Cost
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.acquisition_cost}
              onChange={(event) => onFieldChange('acquisition_cost', event.target.value)}
            />
          </label>

          <label>
            Status
            <select value={form.status} onChange={(event) => onFieldChange('status', event.target.value)}>
              <option value="Available">Available</option>
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </label>

          <div className="vehicles-form-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Vehicle'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default VehicleFormModal
