import ModulePage from '../components/ModulePage.jsx'
import { getFuelLogs } from '../services/fuelService.js'

function FuelPage() {
  return (
    <ModulePage
      title="Fuel & Expenses"
      description="Fuel ledger"
      fetcher={getFuelLogs}
      columns={['Vehicle ID', 'Liters', 'Cost', 'Date']}
      emptyMessage="No fuel records are available from the backend yet."
      renderItem={(item) => (
        <>
          <td>{item.vehicle_id || '—'}</td>
          <td>{item.liters || '—'}</td>
          <td>{item.cost || '—'}</td>
          <td>{item.date || '—'}</td>
        </>
      )}
    />
  )
}

export default FuelPage
