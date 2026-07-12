function TripPagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalItems === 0) {
    return null
  }

  return (
    <section className="panel-card vehicles-pagination">
      <p>
        Showing page {page} of {totalPages} ({totalItems} trips)
      </p>
      <div className="vehicles-pagination-actions">
        <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
      <small>{pageSize} records per page</small>
    </section>
  )
}

export default TripPagination
