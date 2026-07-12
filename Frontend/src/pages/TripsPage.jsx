import ModulePage from '../components/ModulePage.jsx'
import { getTrips } from '../services/tripService.js'

function TripsPage() {
  return (
    <ModulePage
      title="Trips"
      description="Trip timeline"
      fetcher={getTrips}
      columns={['Trip ID', 'Vehicle', 'Driver', 'Status']}
      emptyMessage="No trip records are available from the backend yet."
      renderItem={(item) => (
        <>
          <td>{item.tripId || item.id || '—'}</td>
          <td>{item.vehicle || '—'}</td>
          <td>{item.driver || '—'}</td>
          <td>{item.status || '—'}</td>
        </>
      )}
    />
  )
}

export default TripsPage
