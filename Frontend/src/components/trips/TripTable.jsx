function TripTable({
  trips,
  onView,
  onEdit,
  onDelete,
  onDispatch,
  onComplete,
  onCancel,
}) {
  function statusValue(status) {
    return String(status || '').toLowerCase()
  }

  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Trip registry</p>
          <h2>Trips</h2>
        </div>
      </div>

      <div className="trip-table-wrapper trips-desktop-table">
        <table className="trip-table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Start Date & Time</th>
              <th>End Date & Time</th>
              <th>Distance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>{trip.driver_name || '—'}</td>
                <td>
                  {trip.vehicle_name
                    ? `${trip.vehicle_name} (${trip.registration_number || 'No Reg'})`
                    : trip.registration_number || '—'}
                </td>
                <td>{trip.source || '—'}</td>
                <td>{trip.destination || '—'}</td>
                <td>{trip.start_datetime || trip.created_at || '—'}</td>
                <td>{trip.end_datetime || '—'}</td>
                <td>{trip.planned_distance || trip.distance || '—'}</td>
                <td>
                  <span className={`status-badge status-${String(trip.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                    {trip.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  <div className="vehicles-action-group">
                    <button type="button" className="vehicles-action-button" onClick={() => onView(trip)}>
                      View
                    </button>
                    <button type="button" className="vehicles-action-button" onClick={() => onEdit(trip)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="vehicles-action-button vehicles-action-danger"
                      onClick={() => onDelete(trip)}
                    >
                      Delete
                    </button>
                    {statusValue(trip.status) === 'draft' && (
                      <button type="button" className="vehicles-action-button" onClick={() => onDispatch(trip)}>
                        Dispatch
                      </button>
                    )}
                    {statusValue(trip.status) === 'dispatched' && (
                      <>
                        <button type="button" className="vehicles-action-button" onClick={() => onComplete(trip)}>
                          Complete
                        </button>
                        <button type="button" className="vehicles-action-button" onClick={() => onCancel(trip)}>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="trips-mobile-list">
        {trips.map((trip) => (
          <article key={`mobile-${trip.id}`} className="drivers-mobile-card">
            <div className="drivers-mobile-header">
              <div>
                <h3>Trip #{trip.id}</h3>
                <p>{trip.driver_name || 'No Driver'}</p>
              </div>
            </div>

            <div className="drivers-mobile-content">
              <p><strong>Vehicle:</strong> {trip.vehicle_name || trip.registration_number || '—'}</p>
              <p><strong>Route:</strong> {trip.source || '—'} to {trip.destination || '—'}</p>
              <p><strong>Start:</strong> {trip.start_datetime || trip.created_at || '—'}</p>
              <p><strong>End:</strong> {trip.end_datetime || '—'}</p>
              <p><strong>Distance:</strong> {trip.planned_distance || trip.distance || '—'}</p>
              <p><strong>Status:</strong> {trip.status || 'Unknown'}</p>
            </div>

            <div className="vehicles-action-group">
              <button type="button" className="vehicles-action-button" onClick={() => onView(trip)}>
                View
              </button>
              <button type="button" className="vehicles-action-button" onClick={() => onEdit(trip)}>
                Edit
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TripTable
