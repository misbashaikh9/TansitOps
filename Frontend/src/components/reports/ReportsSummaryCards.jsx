function ReportsSummaryCards({ cards }) {
  return (
    <section className="kpi-grid reports-kpi-grid">
      {cards.map((card) => (
        <article key={card.id} className="kpi-card">
          <div className={`kpi-icon kpi-icon-${card.tone}`}>{card.icon}</div>
          <div className="kpi-copy">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}

export default ReportsSummaryCards
