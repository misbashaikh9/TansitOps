import { useEffect, useMemo, useState } from 'react'
import MaintenanceCreateModal from '../components/maintenance/MaintenanceCreateModal.jsx'
import MaintenanceDetailsModal from '../components/maintenance/MaintenanceDetailsModal.jsx'
import MaintenancePagination from '../components/maintenance/MaintenancePagination.jsx'
import MaintenanceStats from '../components/maintenance/MaintenanceStats.jsx'
import MaintenanceTable from '../components/maintenance/MaintenanceTable.jsx'
import MaintenanceToolbar from '../components/maintenance/MaintenanceToolbar.jsx'
import { createMaintenanceTask, getMaintenanceTasks } from '../services/maintenanceService.js'
import { getVehicles } from '../services/vehicleService.js'

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

function statusLabel(status) {
  const value = String(status || '').toLowerCase()

  if (value.includes('complete') || value.includes('closed')) {
    return 'completed'
  }

  if (value.includes('active') || value.includes('progress')) {
    return 'in-progress'
  }

  if (value.includes('schedule') || value.includes('planned')) {
    return 'scheduled'
  }

  return 'other'
}

function sortMaintenance(data, sortBy, sortDirection) {
  const sorted = [...data].sort((leftItem, rightItem) => {
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

function MaintenancePage({ globalSearchQuery = '' }) {
  const [maintenanceState, setMaintenanceState] = useState({
    loading: true,
    error: '',
    data: [],
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('start_date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [page, setPage] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [vehiclesState, setVehiclesState] = useState([])
  const [createState, setCreateState] = useState({ open: false, saving: false })

  useEffect(() => {
    async function loadMaintenance() {
      setMaintenanceState((previous) => ({ ...previous, loading: true, error: '' }))

      try {
        const response = await getMaintenanceTasks()
        setMaintenanceState({ loading: false, error: '', data: normalizeList(response) })
      } catch (error) {
        setMaintenanceState({
          loading: false,
          error: error.message || 'Unable to load maintenance records.',
          data: [],
        })
      }
    }

    loadMaintenance()
  }, [])

  useEffect(() => {
    async function loadVehicles() {
      try {
        const vehicles = await getVehicles()
        setVehiclesState(Array.isArray(vehicles) ? vehicles : [])
      } catch {
        setVehiclesState([])
      }
    }

    loadVehicles()
  }, [])

  useEffect(() => {
    setSearch(globalSearchQuery)
  }, [globalSearchQuery])

  const statuses = useMemo(() => {
    return [...new Set(maintenanceState.data.map((item) => item.status).filter(Boolean).map(String))]
  }, [maintenanceState.data])

  const vehicles = useMemo(() => {
    return [
      ...new Set(
        maintenanceState.data
          .map((item) =>
            item.vehicle_name
              ? `${item.vehicle_name} (${item.registration_number || 'No Reg'})`
              : item.registration_number,
          )
          .filter(Boolean)
          .map(String),
      ),
    ]
  }, [maintenanceState.data])

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()

    return maintenanceState.data.filter((item) => {
      const vehicle = item.vehicle_name
        ? `${item.vehicle_name} (${item.registration_number || 'No Reg'})`
        : item.registration_number || ''
      const searchableText = [item.description, vehicle].filter(Boolean).join(' ').toLowerCase()
      const recordDate = String(item.start_date || '').slice(0, 10)

      const queryMatch = !query || searchableText.includes(query)
      const statusMatch = statusFilter === 'all' || String(item.status || '') === statusFilter
      const dateMatch = !dateFilter || recordDate === dateFilter
      const vehicleMatch = vehicleFilter === 'all' || vehicle === vehicleFilter

      return queryMatch && statusMatch && dateMatch && vehicleMatch
    })
  }, [maintenanceState.data, search, statusFilter, dateFilter, vehicleFilter])

  const sortedData = useMemo(
    () => sortMaintenance(filteredData, sortBy, sortDirection),
    [filteredData, sortBy, sortDirection],
  )

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, dateFilter, vehicleFilter, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedData.slice(start, start + PAGE_SIZE)
  }, [sortedData, currentPage])

  const stats = useMemo(() => {
    const total = maintenanceState.data.length
    const scheduled = maintenanceState.data.filter(
      (item) => statusLabel(item.status) === 'scheduled',
    ).length
    const inProgress = maintenanceState.data.filter(
      (item) => statusLabel(item.status) === 'in-progress',
    ).length
    const completed = maintenanceState.data.filter(
      (item) => statusLabel(item.status) === 'completed',
    ).length

    return [
      { id: 'total', label: 'Total Maintenance Records', value: String(total), icon: 'TM', tone: 'blue', description: 'All maintenance records.' },
      { id: 'scheduled', label: 'Scheduled', value: String(scheduled), icon: 'SC', tone: 'teal', description: 'Scheduled maintenance records.' },
      { id: 'in-progress', label: 'In Progress', value: String(inProgress), icon: 'IP', tone: 'amber', description: 'Work currently in progress.' },
      { id: 'completed', label: 'Completed', value: String(completed), icon: 'CP', tone: 'emerald', description: 'Maintenance completed.' },
    ]
  }, [maintenanceState.data])

  const openCreateModal = () => {
    setCreateState({ open: true, saving: false })
  }

  const closeCreateModal = () => {
    setCreateState({ open: false, saving: false })
  }

  const refreshMaintenance = async () => {
    setMaintenanceState((previous) => ({ ...previous, loading: true, error: '' }))

    try {
      const response = await getMaintenanceTasks()
      setMaintenanceState({ loading: false, error: '', data: normalizeList(response) })
    } catch (error) {
      setMaintenanceState({
        loading: false,
        error: error.message || 'Unable to load maintenance records.',
        data: [],
      })
    }
  }

  const onCreateMaintenance = async (payload) => {
    setCreateState((previous) => ({ ...previous, saving: true }))

    try {
      await createMaintenanceTask(payload)
      closeCreateModal()
      await refreshMaintenance()
      const vehicles = await getVehicles()
      setVehiclesState(Array.isArray(vehicles) ? vehicles : [])
    } catch (error) {
      setMaintenanceState((previous) => ({ ...previous, error: error.message || 'Unable to create maintenance record.' }))
      setCreateState((previous) => ({ ...previous, saving: false }))
    }
  }

  return (
    <>
      <section className="panel-card drivers-page-header">
        <p className="panel-card-eyebrow">Maintenance</p>
        <h2>Maintenance</h2>
        <p className="drivers-page-subtitle">Manage vehicle maintenance records.</p>
      </section>

      <MaintenanceStats stats={stats} />

      <MaintenanceToolbar
        search={search}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        vehicleFilter={vehicleFilter}
        sortBy={sortBy}
        sortDirection={sortDirection}
        statuses={statuses}
        vehicles={vehicles}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onDateChange={setDateFilter}
        onVehicleChange={setVehicleFilter}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
        onAdd={openCreateModal}
      />

      {maintenanceState.loading && (
        <section className="dashboard-state-card">Loading maintenance records...</section>
      )}

      {!maintenanceState.loading && maintenanceState.error && (
        <section className="dashboard-state-card dashboard-state-error">{maintenanceState.error}</section>
      )}

      {!maintenanceState.loading && !maintenanceState.error && sortedData.length === 0 && (
        <section className="dashboard-state-card">No maintenance records found.</section>
      )}

      {!maintenanceState.loading && !maintenanceState.error && sortedData.length > 0 && (
        <>
          <MaintenanceTable records={paginatedData} onView={setSelectedRecord} />

          <MaintenancePagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={sortedData.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <MaintenanceDetailsModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />

      {createState.open && (
        <MaintenanceCreateModal
          open={createState.open}
          submitting={createState.saving}
          vehicles={vehiclesState}
          onClose={closeCreateModal}
          onSubmit={onCreateMaintenance}
        />
      )}
    </>
  )
}

export default MaintenancePage
