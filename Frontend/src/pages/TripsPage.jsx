import ModulePage from '../components/ModulePage.jsx'
import { getTrips } from '../services/tripService.js'

function TripsPage() {
  return (
    <ModulePage
      title="Trips"
      description="Trip timeline"
      fetcher={getTrips}
      columns={['Trip ID', 'Route', 'Driver', 'Status']}
      emptyMessage="No trip records are available from the backend yet."
      renderItem={(item) => (
        <>
          <td>{item.tripId || item.id || '—'}</td>
          <td>{`${item.source || 'Unknown'} -> ${item.destination || 'Unknown'}`}</td>
          <td>{item.driver_name || '—'}</td>
          <td>{item.status || '—'}</td>
        </>
      )}
    />
  )
}

export default TripsPage
