import ModulePage from '../components/ModulePage.jsx'
import { getDrivers } from '../services/driverService.js'

function DriversPage() {
  return (
    <ModulePage
      title="Drivers"
      description="Operator roster"
      fetcher={getDrivers}
      columns={['Driver', 'License No.', 'Contact', 'Status']}
      emptyMessage="No driver records are available from the backend yet."
      renderItem={(item) => (
        <>
          <td>{item.name || item.id || '—'}</td>
          <td>{item.license_number || '—'}</td>
          <td>{item.contact_number || '—'}</td>
          <td>{item.status || '—'}</td>
        </>
      )}
    />
  )
}

export default DriversPage
