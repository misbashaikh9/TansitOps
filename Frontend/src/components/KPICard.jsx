import { useEffect, useMemo, useState } from 'react'

function parseNumericValue(rawValue) {
  const numeric = Number(String(rawValue).replace(/[^\d.-]/g, ''))
  return Number.isNaN(numeric) ? null : numeric
}

function KPICard({ item }) {
  const targetNumber = useMemo(() => parseNumericValue(item.value), [item.value])
  const [displayValue, setDisplayValue] = useState(item.value)

  useEffect(() => {
    if (targetNumber === null) {
      setDisplayValue(item.value)
      return
    }

    const duration = 500
    const start = performance.now()
    const frame = (timestamp) => {
      const progress = Math.min(1, (timestamp - start) / duration)
      const nextValue = Math.round(targetNumber * progress)
      setDisplayValue(String(nextValue))

      if (progress < 1) {
        requestAnimationFrame(frame)
      }
    }

    requestAnimationFrame(frame)
  }, [item.value, targetNumber])

  return (
    <article className="kpi-card">
      <div className={`kpi-icon kpi-icon-${item.tone}`}>{item.icon}</div>
      <div className="kpi-copy">
        <span>{item.label}</span>
        <strong>{displayValue}</strong>
      </div>
      <p>{item.description}</p>
    </article>
  )
}

export default KPICard
