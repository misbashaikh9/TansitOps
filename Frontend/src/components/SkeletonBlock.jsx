function SkeletonBlock({ rows = 4 }) {
  return (
    <section className="panel-card skeleton-card" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-line" />
      ))}
    </section>
  )
}

export default SkeletonBlock
