import { useEffect, useMemo, useState } from 'react'
import VehicleFormModal from '../components/vehicles/VehicleFormModal.jsx'
import VehiclePagination from '../components/vehicles/VehiclePagination.jsx'
import VehicleStats from '../components/vehicles/VehicleStats.jsx'
import VehicleTable from '../components/vehicles/VehicleTable.jsx'
import VehicleToolbar from '../components/vehicles/VehicleToolbar.jsx'
import VehicleViewModal from '../components/vehicles/VehicleViewModal.jsx'
import {
  createVehicle,
  deleteVehicle,
  getVehicles,
  updateVehicle,
} from '../services/vehicleService.js'

const PAGE_SIZE = 10

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()

  if (value.includes('maintenance')) {
    return 'maintenance'
  }

  if (value.includes('out') && value.includes('service')) {
    return 'out_of_service'
  }

  if (value.includes('active')) {
    return 'active'
  }

  return 'other'
}

function sortVehicles(vehicles, sortBy, direction) {
  const sorted = [...vehicles].sort((a, b) => {
    const left = String(a[sortBy] || '').toLowerCase()
    const right = String(b[sortBy] || '').toLowerCase()

    if (left < right) {
      return -1
    }

    if (left > right) {
      return 1
    }

    return 0
  })

  return direction === 'desc' ? sorted.reverse() : sorted
}

function buildPayload(formValues) {
  return {
    registration_number: formValues.registration_number.trim(),
    vehicle_name: formValues.vehicle_name.trim(),
    model: formValues.model.trim(),
    type: formValues.type.trim(),
    max_load_capacity: Number(formValues.max_load_capacity),
    odometer: Number(formValues.odometer || 0),
    acquisition_cost: Number(formValues.acquisition_cost || 0),
    status: formValues.status,
  }
}

function VehiclesPage({ globalSearchQuery = '' }) {
  const [vehiclesState, setVehiclesState] = useState({
    loading: true,
    error: '',
    data: [],
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('registration_number')
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [formState, setFormState] = useState({
    open: false,
    mode: 'add',
    saving: false,
    vehicle: null,
  })
  const [viewVehicle, setViewVehicle] = useState(null)

  const loadVehicles = async () => {
    setVehiclesState((previous) => ({ ...previous, loading: true, error: '' }))

    try {
      const vehicles = await getVehicles()
      setVehiclesState({ loading: false, error: '', data: Array.isArray(vehicles) ? vehicles : [] })
    } catch (error) {
      setVehiclesState({
        loading: false,
        error: error.message || 'Unable to load vehicles.',
        data: [],
      })
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  useEffect(() => {
    setSearch(globalSearchQuery)
  }, [globalSearchQuery])

  const typeOptions = useMemo(() => {
    const items = vehiclesState.data
      .map((vehicle) => vehicle.type)
      .filter(Boolean)
      .map((value) => String(value))

    return [...new Set(items)].sort((a, b) => a.localeCompare(b))
  }, [vehiclesState.data])

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase()

    return vehiclesState.data.filter((vehicle) => {
      const searchableText = [
        vehicle.registration_number,
        vehicle.vehicle_name,
        vehicle.model,
        vehicle.type,
        vehicle.assigned_driver,
        vehicle.driver_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const queryMatch = !query || searchableText.includes(query)
      const statusMatch =
        statusFilter === 'all' || normalizeStatus(vehicle.status) === statusFilter
      const typeMatch =
        typeFilter === 'all' || String(vehicle.type || '').toLowerCase() === typeFilter.toLowerCase()

      return queryMatch && statusMatch && typeMatch
    })
  }, [vehiclesState.data, search, statusFilter, typeFilter])

  const sortedVehicles = useMemo(
    () => sortVehicles(filteredVehicles, sortBy, sortDirection),
    [filteredVehicles, sortBy, sortDirection],
  )

  const totalPages = Math.max(1, Math.ceil(sortedVehicles.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedVehicles.slice(start, start + PAGE_SIZE)
  }, [sortedVehicles, currentPage])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, typeFilter, sortBy, sortDirection])

  const stats = useMemo(() => {
    const total = vehiclesState.data.length
    const active = vehiclesState.data.filter(
      (vehicle) => normalizeStatus(vehicle.status) === 'active',
    ).length
    const maintenance = vehiclesState.data.filter(
      (vehicle) => normalizeStatus(vehicle.status) === 'maintenance',
    ).length
    const outOfService = vehiclesState.data.filter(
      (vehicle) => normalizeStatus(vehicle.status) === 'out_of_service',
    ).length

    return [
      {
        id: 'total',
        label: 'Total Vehicles',
        value: String(total),
        description: 'Vehicles registered in the fleet.',
        icon: 'TV',
        tone: 'blue',
      },
      {
        id: 'active',
        label: 'Active Vehicles',
        value: String(active),
        description: 'Vehicles currently active.',
        icon: 'AC',
        tone: 'emerald',
      },
      {
        id: 'maintenance',
        label: 'Under Maintenance',
        value: String(maintenance),
        description: 'Vehicles currently in maintenance.',
        icon: 'MT',
        tone: 'amber',
      },
      {
        id: 'out-of-service',
        label: 'Out of Service',
        value: String(outOfService),
        description: 'Vehicles unavailable for operations.',
        icon: 'OS',
        tone: 'slate',
      },
    ]
  }, [vehiclesState.data])

  const openAddModal = () => {
    setFormState({ open: true, mode: 'add', saving: false, vehicle: null })
  }

  const openEditModal = (vehicle) => {
    setFormState({ open: true, mode: 'edit', saving: false, vehicle })
  }

  const closeModal = () => {
    setFormState({ open: false, mode: 'add', saving: false, vehicle: null })
  }

  const onSaveVehicle = async (formValues) => {
    setFormState((previous) => ({ ...previous, saving: true }))

    try {
      const payload = buildPayload(formValues)

      if (formState.mode === 'edit' && formState.vehicle?.id) {
        await updateVehicle(formState.vehicle.id, payload)
      } else {
        await createVehicle(payload)
      }

      closeModal()
      await loadVehicles()
    } catch (error) {
      setVehiclesState((previous) => ({ ...previous, error: error.message }))
      setFormState((previous) => ({ ...previous, saving: false }))
    }
  }

  const onDeleteVehicle = async (vehicle) => {
    const confirmed = window.confirm(
      `Delete vehicle ${vehicle.registration_number || vehicle.vehicle_name || vehicle.id}?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteVehicle(vehicle.id)
      await loadVehicles()
    } catch (error) {
      setVehiclesState((previous) => ({ ...previous, error: error.message }))
    }
  }

  return (
    <>
      <VehicleStats stats={stats} />

      <VehicleToolbar
        search={search}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        typeOptions={typeOptions}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
        onAdd={openAddModal}
      />

      {vehiclesState.loading && (
        <section className="dashboard-state-card">Loading vehicles...</section>
      )}

      {!vehiclesState.loading && vehiclesState.error && (
        <section className="dashboard-state-card dashboard-state-error">{vehiclesState.error}</section>
      )}

      {!vehiclesState.loading && !vehiclesState.error && sortedVehicles.length === 0 && (
        <section className="dashboard-state-card">No vehicles found for the current filters.</section>
      )}

      {!vehiclesState.loading && !vehiclesState.error && sortedVehicles.length > 0 && (
        <>
          <VehicleTable
            vehicles={paginatedVehicles}
            onView={setViewVehicle}
            onEdit={openEditModal}
            onDelete={onDeleteVehicle}
          />

          <VehiclePagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={sortedVehicles.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <VehicleFormModal
        isOpen={formState.open}
        mode={formState.mode}
        vehicle={formState.vehicle}
        saving={formState.saving}
        onClose={closeModal}
        onSave={onSaveVehicle}
      />

      <VehicleViewModal vehicle={viewVehicle} onClose={() => setViewVehicle(null)} />
    </>
  )
}

export default VehiclesPage
