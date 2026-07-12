function StatePanel({
  title,
  message,
  tone = 'neutral',
  primaryAction,
  secondaryAction,
}) {
  return (
    <section className={`dashboard-state-card dashboard-state-${tone}`} role="status">
      <div className="state-panel-illustration" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="vehicles-action-group">
        {primaryAction && (
          <button type="button" className="vehicles-action-button" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button type="button" className="vehicles-action-button" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </button>
        )}
      </div>
    </section>
  )
}

export default StatePanel
