function ReportsDetailsGrid({ data }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Backend metrics</p>
          <h2>Report Fields</h2>
        </div>
      </div>

      <div className="reports-details-grid">
        <div className="reports-detail-item">
          <span>Total Vehicles</span>
          <strong>{String(data.totalVehicles ?? 0)}</strong>
        </div>
        <div className="reports-detail-item">
          <span>Active Vehicles</span>
          <strong>{String(data.activeVehicles ?? 0)}</strong>
        </div>
        <div className="reports-detail-item">
          <span>Fleet Utilization</span>
          <strong>{data.fleetUtilization ?? '0%'}</strong>
        </div>
        <div className="reports-detail-item">
          <span>Active Trips</span>
          <strong>{String(data.activeTrips ?? 0)}</strong>
        </div>
        <div className="reports-detail-item">
          <span>Total Fuel Cost</span>
          <strong>{String(data.totalFuelCost ?? 0)}</strong>
        </div>
        <div className="reports-detail-item">
          <span>Total Maintenance Cost</span>
          <strong>{String(data.totalMaintenanceCost ?? 0)}</strong>
        </div>
      </div>
    </section>
  )
}

export default ReportsDetailsGrid
