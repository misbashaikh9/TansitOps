import { useEffect, useState } from 'react'

const initialForm = {
  name: '',
  license_number: '',
  license_category: '',
  license_expiry: '',
  contact_number: '',
  safety_score: '',
  status: 'Available',
}

function DriverFormModal({ isOpen, mode, driver, saving, onClose, onSave }) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (!driver) {
      setForm(initialForm)
      return
    }

    setForm({
      name: driver.name || '',
      license_number: driver.license_number || '',
      license_category: driver.license_category || '',
      license_expiry: driver.license_expiry || '',
      contact_number: driver.contact_number || '',
      safety_score: driver.safety_score || '',
      status: driver.status || 'Available',
    })
  }, [driver])

  if (!isOpen) {
    return null
  }

  const onFieldChange = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  return (
    <div className="vehicles-modal-overlay" role="dialog" aria-modal="true">
      <section className="vehicles-modal-card">
        <header className="vehicles-modal-header">
          <h3>{mode === 'edit' ? 'Edit Driver' : 'Add Driver'}</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <form className="vehicles-form-grid" onSubmit={submit}>
          <label>
            Driver Name
            <input
              required
              value={form.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
            />
          </label>

          <label>
            License Number
            <input
              required
              value={form.license_number}
              onChange={(event) => onFieldChange('license_number', event.target.value)}
              disabled={mode === 'edit'}
            />
          </label>

          <label>
            License Category
            <input
              value={form.license_category}
              onChange={(event) => onFieldChange('license_category', event.target.value)}
            />
          </label>

          <label>
            License Expiry
            <input
              type="date"
              value={form.license_expiry}
              onChange={(event) => onFieldChange('license_expiry', event.target.value)}
            />
          </label>

          <label>
            Contact Number
            <input
              value={form.contact_number}
              onChange={(event) => onFieldChange('contact_number', event.target.value)}
            />
          </label>

          <label>
            Safety Score
            <input
              type="number"
              min="0"
              max="100"
              value={form.safety_score}
              onChange={(event) => onFieldChange('safety_score', event.target.value)}
            />
          </label>

          <label>
            Status
            <select value={form.status} onChange={(event) => onFieldChange('status', event.target.value)}>
              <option value="Available">Available</option>
              <option value="Active">Active</option>
              <option value="On Trip">On Trip</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <div className="vehicles-form-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Driver'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default DriverFormModal
