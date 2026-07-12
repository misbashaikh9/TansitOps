function ReportsHeader({ onRefresh }) {
  return (
    <>
      <section className="panel-card drivers-page-header">
        <p className="panel-card-eyebrow">Reports & Analytics</p>
        <h2>Reports</h2>
        <p className="drivers-page-subtitle">Review backend-generated fleet analytics summaries.</p>
      </section>

      <section className="panel-card reports-header-actions">
        <div>
          <p className="panel-card-eyebrow">Available backend report</p>
          <h2>Summary Analytics</h2>
        </div>
        <div className="vehicles-action-group">
          <button type="button" className="vehicles-action-button" onClick={onRefresh}>
            Refresh
          </button>
        </div>
      </section>
    </>
  )
}

export default ReportsHeader
