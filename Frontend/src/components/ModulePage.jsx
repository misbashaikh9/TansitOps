import { useEffect, useMemo, useState } from 'react'

function normalizeList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  if (Array.isArray(payload?.rows)) {
    return payload.rows
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

function ModulePage({
  title,
  description,
  fetcher,
  columns,
  emptyMessage,
  renderItem,
}) {
  const [moduleState, setModuleState] = useState({
    loading: true,
    error: '',
    data: [],
  })

  useEffect(() => {
    let isMounted = true

    async function loadModule() {
      setModuleState({ loading: true, error: '', data: [] })

      try {
        const response = await fetcher()
        const payload = normalizeList(response)

        if (isMounted) {
          setModuleState({ loading: false, error: '', data: payload })
        }
      } catch (error) {
        if (isMounted) {
          setModuleState({
            loading: false,
            error: error.message || `Unable to load ${title.toLowerCase()} data.`,
            data: [],
          })
        }
      }
    }

    loadModule()

    return () => {
      isMounted = false
    }
  }, [fetcher, title])

  const tableRows = useMemo(() => moduleState.data, [moduleState.data])

  if (moduleState.loading) {
    return <section className="dashboard-state-card">Loading {title.toLowerCase()} data...</section>
  }

  if (moduleState.error) {
    return <section className="dashboard-state-card dashboard-state-error">{moduleState.error}</section>
  }

  if (!tableRows.length) {
    return <section className="dashboard-state-card">{emptyMessage}</section>
  }

  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Operations module</p>
          <h2>{title}</h2>
        </div>
        <button type="button" className="panel-card-link">
          {description}
        </button>
      </div>

      <div className="trip-table-wrapper">
        <table className="trip-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((item, index) => (
              <tr key={item.id || `${title}-${index}`}>{renderItem(item)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ModulePage
