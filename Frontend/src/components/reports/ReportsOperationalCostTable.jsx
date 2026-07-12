function formatCurrency(value) {
  const numericValue = Number(value || 0)
  return numericValue.toFixed(2)
}

function ReportsOperationalCostTable({ rows = [] }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Operational cost</p>
          <h2>Per Vehicle Cost Breakdown</h2>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="drivers-page-subtitle">No vehicle cost data available yet.</p>
      ) : (
        <div className="trip-table-wrapper">
          <table className="trip-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Fuel Cost</th>
                <th>Maintenance Cost</th>
                <th>Other Expenses</th>
                <th>Total Operational Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.vehicle_id}>
                  <td>
                    {row.vehicle_name
                      ? `${row.vehicle_name} (${row.registration_number || 'No Reg'})`
                      : row.registration_number || `Vehicle ${row.vehicle_id}`}
                  </td>
                  <td>{formatCurrency(row.fuel_cost)}</td>
                  <td>{formatCurrency(row.maintenance_cost)}</td>
                  <td>{formatCurrency(row.other_expense_cost)}</td>
                  <td><strong>{formatCurrency(row.total_operational_cost)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ReportsOperationalCostTable
