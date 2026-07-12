function ReportsStateCard({ message, error = false, actionLabel, onAction }) {
  return (
    <section className={`dashboard-state-card ${error ? 'dashboard-state-error' : ''}`}>
      <p>{message}</p>
      {actionLabel && onAction && (
        <div className="vehicles-action-group reports-action-row">
          <button type="button" className="vehicles-action-button" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      )}
    </section>
  )
}

export default ReportsStateCard
