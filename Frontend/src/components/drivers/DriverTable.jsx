function DriverTable({ drivers, onView, onEdit, onDelete }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Driver directory</p>
          <h2>Drivers</h2>
        </div>
      </div>

      <div className="trip-table-wrapper drivers-desktop-table">
        <table className="trip-table">
          <thead>
            <tr>
              <th>Profile Photo</th>
              <th>Driver Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>License Number</th>
              <th>License Expiry</th>
              <th>Assigned Vehicle</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>
                  <div className="driver-avatar-cell">
                    {driver.profile_photo ? (
                      <img src={driver.profile_photo} alt={driver.name || 'Driver'} />
                    ) : (
                      <span>
                        {(driver.name || 'DR')
                          .split(' ')
                          .slice(0, 2)
                          .map((item) => item[0]?.toUpperCase())
                          .join('')}
                      </span>
                    )}
                  </div>
                </td>
                <td>{driver.name || '—'}</td>
                <td>{driver.contact_number || '—'}</td>
                <td>{driver.email || '—'}</td>
                <td>{driver.license_number || '—'}</td>
                <td>{driver.license_expiry || '—'}</td>
                <td>{driver.assigned_vehicle || driver.vehicle_name || '—'}</td>
                <td>
                  <span className={`status-badge status-${String(driver.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {driver.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="vehicles-action-group">
                    <button type="button" className="vehicles-action-button" onClick={() => onView(driver)}>
                      View
                    </button>
                    <button type="button" className="vehicles-action-button" onClick={() => onEdit(driver)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="vehicles-action-button vehicles-action-danger"
                      onClick={() => onDelete(driver)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="drivers-mobile-list">
        {drivers.map((driver) => (
          <article key={`mobile-${driver.id}`} className="drivers-mobile-card">
            <div className="drivers-mobile-header">
              <div className="driver-avatar-cell">
                {driver.profile_photo ? (
                  <img src={driver.profile_photo} alt={driver.name || 'Driver'} />
                ) : (
                  <span>
                    {(driver.name || 'DR')
                      .split(' ')
                      .slice(0, 2)
                      .map((item) => item[0]?.toUpperCase())
                      .join('')}
                  </span>
                )}
              </div>
              <div>
                <h3>{driver.name || '—'}</h3>
                <p>{driver.license_number || '—'}</p>
              </div>
            </div>

            <div className="drivers-mobile-content">
              <p><strong>Phone:</strong> {driver.contact_number || '—'}</p>
              <p><strong>Email:</strong> {driver.email || '—'}</p>
              <p><strong>Expiry:</strong> {driver.license_expiry || '—'}</p>
              <p><strong>Assigned Vehicle:</strong> {driver.assigned_vehicle || driver.vehicle_name || '—'}</p>
              <p><strong>Status:</strong> {driver.status || 'Unknown'}</p>
            </div>

            <div className="vehicles-action-group">
              <button type="button" className="vehicles-action-button" onClick={() => onView(driver)}>
                View
              </button>
              <button type="button" className="vehicles-action-button" onClick={() => onEdit(driver)}>
                Edit
              </button>
              <button
                type="button"
                className="vehicles-action-button vehicles-action-danger"
                onClick={() => onDelete(driver)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DriverTable
