import ModulePage from '../components/ModulePage.jsx'
import { getVehicles } from '../services/vehicleService.js'

function VehiclesPage() {
  return (
    <ModulePage
      title="Vehicles"
      description="Fleet view"
      fetcher={getVehicles}
      columns={['Vehicle', 'Status', 'Driver', 'Region']}
      emptyMessage="No vehicle records are available from the backend yet."
      renderItem={(item) => (
        <>
          <td>{item.vehicle || item.name || item.id || '—'}</td>
          <td>{item.status || '—'}</td>
          <td>{item.driver || '—'}</td>
          <td>{item.region || '—'}</td>
        </>
      )}
    />
  )
}

export default VehiclesPage
