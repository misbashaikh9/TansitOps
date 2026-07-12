import { useEffect, useMemo, useState } from 'react'
import FilterDrawer from '../components/FilterDrawer.jsx'
import FuelDetailsModal from '../components/fuel/FuelDetailsModal.jsx'
import FuelPagination from '../components/fuel/FuelPagination.jsx'
import FuelStats from '../components/fuel/FuelStats.jsx'
import FuelTable from '../components/fuel/FuelTable.jsx'
import FuelToolbar from '../components/fuel/FuelToolbar.jsx'
import SkeletonBlock from '../components/SkeletonBlock.jsx'
import StatePanel from '../components/StatePanel.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getFuelLogs } from '../services/fuelService.js'

const PAGE_SIZE = 10

function normalizeList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

function sortFuelRecords(records, sortBy, sortDirection) {
  const sorted = [...records].sort((leftItem, rightItem) => {
    const left = String(leftItem[sortBy] || '').toLowerCase()
    const right = String(rightItem[sortBy] || '').toLowerCase()

    if (left < right) {
      return -1
    }

    if (left > right) {
      return 1
    }

    return 0
  })

  return sortDirection === 'desc' ? sorted.reverse() : sorted
}

function FuelPage({ globalSearchQuery = '' }) {
  const toast = useToast()
  const [fuelState, setFuelState] = useState({ loading: true, error: '', data: [] })
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [page, setPage] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    async function loadFuel() {
      setFuelState((previous) => ({ ...previous, loading: true, error: '' }))

      try {
        const response = await getFuelLogs()
        setFuelState({ loading: false, error: '', data: normalizeList(response) })
        toast.success('Fuel Updated', 'Fuel records loaded.')
      } catch (error) {
        setFuelState({
          loading: false,
          error: error.message || 'Unable to load fuel records.',
          data: [],
        })
        toast.error('Fuel Load Failed', error.message || 'Unable to load fuel records.')
      }
    }

    loadFuel()
  }, [])

  useEffect(() => {
    setSearch(globalSearchQuery)
  }, [globalSearchQuery])

  const vehicles = useMemo(() => {
    return [
      ...new Set(
        fuelState.data
          .map((item) =>
            item.vehicle_name
              ? `${item.vehicle_name} (${item.registration_number || 'No Reg'})`
              : item.registration_number,
          )
          .filter(Boolean)
          .map(String),
      ),
    ]
  }, [fuelState.data])

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()

    return fuelState.data.filter((item) => {
      const vehicle = item.vehicle_name
        ? `${item.vehicle_name} (${item.registration_number || 'No Reg'})`
        : item.registration_number || ''
      const recordDate = String(item.date || '').slice(0, 10)
      const searchableText = [item.id, vehicle, item.liters, item.cost]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const queryMatch = !query || searchableText.includes(query)
      const fromMatch = !dateFrom || recordDate >= dateFrom
      const toMatch = !dateTo || recordDate <= dateTo
      const vehicleMatch = vehicleFilter === 'all' || vehicle === vehicleFilter

      return queryMatch && fromMatch && toMatch && vehicleMatch
    })
  }, [fuelState.data, search, dateFrom, dateTo, vehicleFilter])

  const sortedData = useMemo(
    () => sortFuelRecords(filteredData, sortBy, sortDirection),
    [filteredData, sortBy, sortDirection],
  )

  useEffect(() => {
    setPage(1)
  }, [search, dateFrom, dateTo, vehicleFilter, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedData.slice(start, start + PAGE_SIZE)
  }, [sortedData, currentPage])

  const stats = useMemo(() => {
    const totalLogs = fuelState.data.length
    const totalLiters = fuelState.data.reduce((sum, item) => sum + Number(item.liters || 0), 0)
    const totalCost = fuelState.data.reduce((sum, item) => sum + Number(item.cost || 0), 0)
    const currentMonth = new Date().toISOString().slice(0, 7)
    const monthlyFuelUsage = fuelState.data.reduce((sum, item) => {
      const recordMonth = String(item.date || '').slice(0, 7)
      return recordMonth === currentMonth ? sum + Number(item.liters || 0) : sum
    }, 0)

    return [
      { id: 'cost', label: 'Total Fuel Cost', value: String(totalCost), icon: 'TC', tone: 'amber', description: 'Total fuel spend.' },
      { id: 'entries', label: 'Total Fuel Entries', value: String(totalLogs), icon: 'FE', tone: 'blue', description: 'Total recorded fuel entries.' },
      { id: 'usage', label: 'Monthly Fuel Usage', value: String(monthlyFuelUsage), icon: 'MU', tone: 'teal', description: 'Liters logged this month.' },
      { id: 'liters', label: 'Total Fuel Volume', value: String(totalLiters), icon: 'LT', tone: 'indigo', description: 'Total liters recorded.' },
    ]
  }, [fuelState.data])

  function resetFilters() {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setVehicleFilter('all')
    setSortBy('date')
    setSortDirection('desc')
  }

  return (
    <>
      <section className="panel-card drivers-page-header">
        <p className="panel-card-eyebrow">Fuel</p>
        <h2>Fuel & Expenses</h2>
        <p className="drivers-page-subtitle">Manage fuel usage records.</p>
      </section>

      <FuelStats stats={stats} />

      <FuelToolbar
        search={search}
        dateFrom={dateFrom}
        dateTo={dateTo}
        vehicleFilter={vehicleFilter}
        sortBy={sortBy}
        sortDirection={sortDirection}
        vehicles={vehicles}
        onSearchChange={setSearch}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onVehicleChange={setVehicleFilter}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <section className="panel-card filters-trigger-card">
        <div className="vehicles-action-group">
          <button type="button" className="vehicles-action-button" onClick={() => setIsFilterOpen(true)}>
            Advanced Filters
          </button>
        </div>
      </section>

      <FilterDrawer
        title="Fuel Filters"
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={() => setIsFilterOpen(false)}
        onReset={resetFilters}
      >
        <label>
          <span>Status</span>
          <select disabled>
            <option>Not available for this module</option>
          </select>
        </label>
        <label>
          <span>Vehicle</span>
          <select value={vehicleFilter} onChange={(event) => setVehicleFilter(event.target.value)}>
            <option value="all">All Vehicles</option>
            {vehicles.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Date From</span>
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
        </label>
        <label>
          <span>Date To</span>
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        </label>
      </FilterDrawer>

      {fuelState.loading && <SkeletonBlock rows={7} />}

      {!fuelState.loading && fuelState.error && (
        <StatePanel
          title="Unable to Load Fuel Records"
          message={fuelState.error}
          tone="error"
          primaryAction={{ label: 'Refresh', onClick: () => window.location.reload() }}
        />
      )}

      {!fuelState.loading && !fuelState.error && sortedData.length === 0 && (
        <StatePanel
          title="No Fuel Records"
          message="No fuel records found for the selected filters."
          primaryAction={{ label: 'Reset Filters', onClick: resetFilters }}
          secondaryAction={{ label: 'Refresh', onClick: () => window.location.reload() }}
        />
      )}

      {!fuelState.loading && !fuelState.error && sortedData.length > 0 && (
        <>
          <FuelTable records={paginatedData} onView={setSelectedRecord} />

          <FuelPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={sortedData.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <FuelDetailsModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </>
  )
}

export default FuelPage
