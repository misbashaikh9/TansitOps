function MaintenanceTable({ records, onView }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Service queue</p>
          <h2>Maintenance Logs</h2>
        </div>
      </div>

      <div className="trip-table-wrapper trips-desktop-table">
        <table className="trip-table">
          <thead>
            <tr>
              <th>Maintenance ID</th>
              <th>Description</th>
              <th>Vehicle</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((item) => (
              <tr key={item.id}>
                <td>{item.id || '—'}</td>
                <td>{item.description || '—'}</td>
                <td>
                  {item.vehicle_name
                    ? `${item.vehicle_name} (${item.registration_number || 'No Reg'})`
                    : item.registration_number || '—'}
                </td>
                <td>{item.start_date || '—'}</td>
                <td>{item.end_date || '—'}</td>
                <td>
                  <span className={`status-badge status-${String(item.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {item.status || 'Unknown'}
                  </span>
                </td>
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
              <p><strong>Maintenance ID:</strong> {item.id || '—'}</p>
              <p><strong>Description:</strong> {item.description || '—'}</p>
              <p><strong>Vehicle:</strong> {item.vehicle_name || item.registration_number || '—'}</p>
              <p><strong>Start:</strong> {item.start_date || '—'}</p>
              <p><strong>End:</strong> {item.end_date || '—'}</p>
              <p><strong>Status:</strong> {item.status || 'Unknown'}</p>
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

export default MaintenanceTable
