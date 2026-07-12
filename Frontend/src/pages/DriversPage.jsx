import ModulePage from '../components/ModulePage.jsx'
import { getDrivers } from '../services/driverService.js'

function DriversPage() {
  return (
    <ModulePage
      title="Drivers"
      description="Operator roster"
      fetcher={getDrivers}
      columns={['Driver', 'Shift', 'Phone', 'Status']}
      emptyMessage="No driver records are available from the backend yet."
      renderItem={(item) => (
        <>
          <td>{item.driver || item.name || item.id || '—'}</td>
          <td>{item.shift || '—'}</td>
          <td>{item.phone || '—'}</td>
          <td>{item.status || '—'}</td>
        </>
      )}
    />
  )
}

export default DriversPage
