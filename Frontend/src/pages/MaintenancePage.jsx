import ModulePage from '../components/ModulePage.jsx'
import { getMaintenanceTasks } from '../services/maintenanceService.js'

function MaintenancePage() {
  return (
    <ModulePage
      title="Maintenance"
      description="Service queue"
      fetcher={getMaintenanceTasks}
      columns={['Task', 'Vehicle', 'Due', 'Status']}
      emptyMessage="No maintenance records are available from the backend yet."
      renderItem={(item) => (
        <>
          <td>{item.task || item.name || item.id || '—'}</td>
          <td>{item.vehicle || '—'}</td>
          <td>{item.due || item.date || '—'}</td>
          <td>{item.status || '—'}</td>
        </>
      )}
    />
  )
}

export default MaintenancePage
