import SearchHighlight from './SearchHighlight.jsx'

function RecentTrips({ trips, query }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Live dispatch</p>
          <h2>Recent trips</h2>
        </div>
        <button type="button" className="panel-card-link">
          View all
        </button>
      </div>
      <div className="trip-table-wrapper">
        {trips.length === 0 ? (
          <p className="dashboard-state-card">No recent trips are available from the backend yet.</p>
        ) : (
          <table className="trip-table">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td><SearchHighlight text={trip.id} query={query} /></td>
                  <td><SearchHighlight text={trip.vehicle} query={query} /></td>
                  <td><SearchHighlight text={trip.driver} query={query} /></td>
                  <td><SearchHighlight text={trip.destination} query={query} /></td>
                  <td>
                    <span className={`status-badge status-${trip.status.toLowerCase()}`}>
                      {trip.status}
                    </span>
                  </td>
                  <td>{trip.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default RecentTrips
