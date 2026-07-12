function FuelStats({ stats }) {
  return (
    <section className="kpi-grid trips-kpi-grid">
      {stats.map((item) => (
        <article key={item.id} className="kpi-card">
          <div className={`kpi-icon kpi-icon-${item.tone}`}>{item.icon}</div>
          <div className="kpi-copy">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  )
}

export default FuelStats
