function KPICard({ item }) {
  return (
    <article className="kpi-card">
      <div className={`kpi-icon kpi-icon-${item.tone}`}>{item.icon}</div>
      <div className="kpi-copy">
        <span>{item.label}</span>
        <strong>{item.value}</strong>
      </div>
      <p>{item.description}</p>
    </article>
  )
}

export default KPICard
