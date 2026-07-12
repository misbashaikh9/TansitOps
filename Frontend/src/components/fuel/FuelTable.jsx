function FuelTable({ records, onView }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Fuel ledger</p>
          <h2>Fuel Records</h2>
        </div>
      </div>

      <div className="trip-table-wrapper trips-desktop-table">
        <table className="trip-table">
          <thead>
            <tr>
              <th>Fuel Entry ID</th>
              <th>Vehicle</th>
              <th>Quantity</th>
              <th>Cost</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) => (
              <tr key={item.id}>
                <td>{item.id || '—'}</td>
                <td>
                  {item.vehicle_name
                    ? `${item.vehicle_name} (${item.registration_number || 'No Reg'})`
                    : item.registration_number || '—'}
                </td>
                <td>{item.liters || '—'}</td>
                <td>{item.cost || '—'}</td>
                <td>{item.date || '—'}</td>
                <td>
                  <div className="vehicles-action-group">
                    <button type="button" className="vehicles-action-button" onClick={() => onView(item)}>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="trips-mobile-list">
        {records.map((item) => (
          <article key={`mobile-${item.id}`} className="drivers-mobile-card">
            <div className="drivers-mobile-content">
              <p><strong>Fuel Entry ID:</strong> {item.id || '—'}</p>
              <p><strong>Vehicle:</strong> {item.vehicle_name || item.registration_number || '—'}</p>
              <p><strong>Quantity:</strong> {item.liters || '—'}</p>
              <p><strong>Cost:</strong> {item.cost || '—'}</p>
              <p><strong>Date:</strong> {item.date || '—'}</p>
            </div>
            <div className="vehicles-action-group">
              <button type="button" className="vehicles-action-button" onClick={() => onView(item)}>
                View
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FuelTable
