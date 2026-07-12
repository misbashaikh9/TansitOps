import { useEffect, useMemo, useState } from 'react'
import DriverDeleteDialog from '../components/drivers/DriverDeleteDialog.jsx'
import DriverFormModal from '../components/drivers/DriverFormModal.jsx'
import DriverPagination from '../components/drivers/DriverPagination.jsx'
import DriverStats from '../components/drivers/DriverStats.jsx'
import DriverTable from '../components/drivers/DriverTable.jsx'
import DriverToolbar from '../components/drivers/DriverToolbar.jsx'
import DriverViewModal from '../components/drivers/DriverViewModal.jsx'
import {
  createDriver,
  deleteDriver,
  getDriverById,
  getDrivers,
  updateDriver,
} from '../services/driverService.js'

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

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase()

  if (value.includes('trip')) {
    return 'on-trip'
  }

  if (value.includes('inactive')) {
    return 'inactive'
  }

  if (value.includes('active') || value.includes('available')) {
    return 'active'
  }

  return 'other'
}

function buildCreatePayload(form) {
  return {
    name: form.name.trim(),
    license_number: form.license_number.trim(),
    license_category: form.license_category.trim() || null,
    license_expiry: form.license_expiry || null,
    contact_number: form.contact_number.trim() || null,
    safety_score: Number(form.safety_score || 0),
  }
}

function buildUpdatePayload(form) {
  return {
    name: form.name.trim(),
    license_category: form.license_category.trim() || null,
    license_expiry: form.license_expiry || null,
    contact_number: form.contact_number.trim() || null,
    safety_score: Number(form.safety_score || 0),
    status: form.status,
  }
}

function sortDrivers(drivers) {
  return [...drivers].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
}

function DriversPage({ globalSearchQuery = '' }) {
  const [driversState, setDriversState] = useState({ loading: true, error: '', data: [] })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [formState, setFormState] = useState({ open: false, mode: 'add', saving: false, driver: null })
  const [viewDriver, setViewDriver] = useState(null)
  const [deleteState, setDeleteState] = useState({ open: false, deleting: false, driver: null })

  const loadDrivers = async () => {
    setDriversState((previous) => ({ ...previous, loading: true, error: '' }))

    try {
      const response = await getDrivers()
      setDriversState({ loading: false, error: '', data: normalizeList(response) })
    } catch (error) {
      setDriversState({ loading: false, error: error.message || 'Unable to load drivers.', data: [] })
    }
  }

  useEffect(() => {
    loadDrivers()
  }, [])

  useEffect(() => {
    setSearch(globalSearchQuery)
  }, [globalSearchQuery])

  const statuses = useMemo(() => {
    return [...new Set(driversState.data.map((driver) => driver.status).filter(Boolean).map(String))]
  }, [driversState.data])

  const vehicles = useMemo(() => {
    return [
      ...new Set(
        driversState.data
          .map((driver) => driver.assigned_vehicle || driver.vehicle_name)
          .filter(Boolean)
          .map(String),
      ),
    ]
  }, [driversState.data])

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return sortDrivers(
      driversState.data.filter((driver) => {
        const searchableText = [driver.name, driver.license_number].filter(Boolean).join(' ').toLowerCase()
        const assignedVehicle = String(driver.assigned_vehicle || driver.vehicle_name || '')

        const queryMatch = !query || searchableText.includes(query)
        const statusMatch = statusFilter === 'all' || String(driver.status || '') === statusFilter
        const vehicleMatch = vehicleFilter === 'all' || assignedVehicle === vehicleFilter

        return queryMatch && statusMatch && vehicleMatch
      }),
    )
  }, [driversState.data, search, statusFilter, vehicleFilter])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, vehicleFilter])

  const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredDrivers.slice(start, start + PAGE_SIZE)
  }, [filteredDrivers, currentPage])

  const stats = useMemo(() => {
    const total = driversState.data.length
    const active = driversState.data.filter((driver) => normalizeStatus(driver.status) === 'active').length
    const onTrip = driversState.data.filter((driver) => normalizeStatus(driver.status) === 'on-trip').length
    const inactive = driversState.data.filter((driver) => normalizeStatus(driver.status) === 'inactive').length

    return [
      {
        id: 'total-drivers',
        label: 'Total Drivers',
        value: String(total),
        description: 'All registered fleet drivers.',
        icon: 'TD',
        tone: 'blue',
      },
      {
        id: 'active-drivers',
        label: 'Active Drivers',
        value: String(active),
        description: 'Drivers currently active in operations.',
        icon: 'AD',
        tone: 'emerald',
      },
      {
        id: 'on-trip-drivers',
        label: 'On Trip',
        value: String(onTrip),
        description: 'Drivers assigned to active trips.',
        icon: 'OT',
        tone: 'amber',
      },
      {
        id: 'inactive-drivers',
        label: 'Inactive Drivers',
        value: String(inactive),
        description: 'Drivers currently inactive.',
        icon: 'ID',
        tone: 'slate',
      },
    ]
  }, [driversState.data])

  const openAddModal = () => {
    setFormState({ open: true, mode: 'add', saving: false, driver: null })
  }

  const openEditModal = (driver) => {
    setFormState({ open: true, mode: 'edit', saving: false, driver })
  }

  const closeFormModal = () => {
    setFormState({ open: false, mode: 'add', saving: false, driver: null })
  }

  const onSaveDriver = async (formValues) => {
    setFormState((previous) => ({ ...previous, saving: true }))

    try {
      if (formState.mode === 'edit' && formState.driver?.id) {
        await updateDriver(formState.driver.id, buildUpdatePayload(formValues))
      } else {
        await createDriver(buildCreatePayload(formValues))
      }

      closeFormModal()
      await loadDrivers()
    } catch (error) {
      setDriversState((previous) => ({ ...previous, error: error.message }))
      setFormState((previous) => ({ ...previous, saving: false }))
    }
  }

  const onViewDriver = async (driver) => {
    try {
      const detail = await getDriverById(driver.id)
      setViewDriver(detail || driver)
    } catch {
      setViewDriver(driver)
    }
  }

  const openDeleteDialog = (driver) => {
    setDeleteState({ open: true, deleting: false, driver })
  }

  const closeDeleteDialog = () => {
    setDeleteState({ open: false, deleting: false, driver: null })
  }

  const onConfirmDelete = async () => {
    if (!deleteState.driver?.id) {
      return
    }

    setDeleteState((previous) => ({ ...previous, deleting: true }))

    try {
      await deleteDriver(deleteState.driver.id)
      closeDeleteDialog()
      await loadDrivers()
    } catch (error) {
      setDriversState((previous) => ({ ...previous, error: error.message }))
      setDeleteState((previous) => ({ ...previous, deleting: false }))
    }
  }

  return (
    <>
      <section className="panel-card drivers-page-header">
        <p className="panel-card-eyebrow">Drivers</p>
        <h2>Drivers</h2>
        <p className="drivers-page-subtitle">Manage all fleet drivers.</p>
      </section>

      <DriverStats stats={stats} />

      <DriverToolbar
        search={search}
        statusFilter={statusFilter}
        vehicleFilter={vehicleFilter}
        statuses={statuses}
        vehicles={vehicles}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onVehicleChange={setVehicleFilter}
        onAdd={openAddModal}
      />

      {driversState.loading && <section className="dashboard-state-card">Loading drivers...</section>}

      {!driversState.loading && driversState.error && (
        <section className="dashboard-state-card dashboard-state-error">{driversState.error}</section>
      )}

      {!driversState.loading && !driversState.error && filteredDrivers.length === 0 && (
        <section className="dashboard-state-card">No drivers found for the selected filters.</section>
      )}

      {!driversState.loading && !driversState.error && filteredDrivers.length > 0 && (
        <>
          <DriverTable
            drivers={paginatedDrivers}
            onView={onViewDriver}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
          />

          <DriverPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredDrivers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <DriverFormModal
        isOpen={formState.open}
        mode={formState.mode}
        driver={formState.driver}
        saving={formState.saving}
        onClose={closeFormModal}
        onSave={onSaveDriver}
      />

      <DriverViewModal driver={viewDriver} onClose={() => setViewDriver(null)} />

      <DriverDeleteDialog
        driver={deleteState.open ? deleteState.driver : null}
        deleting={deleteState.deleting}
        onCancel={closeDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}

export default DriversPage
