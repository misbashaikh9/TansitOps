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
          <label className="floating-field">
            <span>Vehicle Number</span>
            <input
              required
              maxLength={30}
              value={form.registration_number}
              onChange={(event) => onFieldChange('registration_number', event.target.value)}
            />
            <small>{form.registration_number.length}/30</small>
          </label>

          <label className="floating-field">
            <span>Vehicle Name</span>
            <input
              required
              maxLength={60}
              value={form.vehicle_name}
              onChange={(event) => onFieldChange('vehicle_name', event.target.value)}
            />
            <small>{form.vehicle_name.length}/60</small>
          </label>

          <label className="floating-field">
            <span>Type</span>
            <input value={form.type} onChange={(event) => onFieldChange('type', event.target.value)} />
          </label>

          <label className="floating-field">
            <span>Model</span>
            <input value={form.model} onChange={(event) => onFieldChange('model', event.target.value)} />
          </label>

          <label className="floating-field">
            <span>Max Load Capacity</span>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.max_load_capacity}
              onChange={(event) => onFieldChange('max_load_capacity', event.target.value)}
            />
          </label>

          <label className="floating-field">
            <span>Odometer</span>
            <input
              type="number"
              min="0"
              value={form.odometer}
              onChange={(event) => onFieldChange('odometer', event.target.value)}
            />
          </label>

          <label className="floating-field">
            <span>Acquisition Cost</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.acquisition_cost}
              onChange={(event) => onFieldChange('acquisition_cost', event.target.value)}
            />
          </label>

          <label className="floating-field">
            <span>Status</span>
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
