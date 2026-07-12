import { useEffect, useMemo, useState } from 'react'
import TripPagination from '../components/trips/TripPagination.jsx'
import TripStats from '../components/trips/TripStats.jsx'
import TripTable from '../components/trips/TripTable.jsx'
import TripToolbar from '../components/trips/TripToolbar.jsx'
import TripViewModal from '../components/trips/TripViewModal.jsx'
import { getTrips } from '../services/tripService.js'

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

  if (value.includes('active') || value.includes('dispatch')) {
    return 'active'
  }

  if (value.includes('complete')) {
    return 'completed'
  }

  if (value.includes('cancel')) {
    return 'cancelled'
  }

  return 'other'
}

function sortTrips(trips) {
  return [...trips].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
}

function TripsPage() {
  const [tripsState, setTripsState] = useState({ loading: true, error: '', data: [] })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [viewTrip, setViewTrip] = useState(null)

  const loadTrips = async () => {
    setTripsState((previous) => ({ ...previous, loading: true, error: '' }))

    try {
      const response = await getTrips()
      setTripsState({ loading: false, error: '', data: normalizeList(response) })
    } catch (error) {
      setTripsState({ loading: false, error: error.message || 'Unable to load trips.', data: [] })
    }
  }

  useEffect(() => {
    loadTrips()
  }, [])

  const statuses = useMemo(() => {
    return [...new Set(tripsState.data.map((trip) => trip.status).filter(Boolean).map(String))]
  }, [tripsState.data])

  const vehicles = useMemo(() => {
    return [
      ...new Set(
        tripsState.data
          .map((trip) => (trip.vehicle_name ? `${trip.vehicle_name} (${trip.registration_number || 'No Reg'})` : trip.registration_number))
          .filter(Boolean)
          .map(String),
      ),
    ]
  }, [tripsState.data])

  const filteredTrips = useMemo(() => {
    const query = search.trim().toLowerCase()

    return sortTrips(
      tripsState.data.filter((trip) => {
        const tripVehicle = trip.vehicle_name
          ? `${trip.vehicle_name} (${trip.registration_number || 'No Reg'})`
          : trip.registration_number || ''
        const searchableText = [trip.id, trip.driver_name, tripVehicle]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const tripDate = String(trip.start_datetime || trip.created_at || '').slice(0, 10)

        const queryMatch = !query || searchableText.includes(query)
        const statusMatch = statusFilter === 'all' || String(trip.status || '') === statusFilter
        const dateMatch = !dateFilter || tripDate === dateFilter
        const vehicleMatch = vehicleFilter === 'all' || tripVehicle === vehicleFilter

        return queryMatch && statusMatch && dateMatch && vehicleMatch
      }),
    )
  }, [tripsState.data, search, statusFilter, dateFilter, vehicleFilter])

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, dateFilter, vehicleFilter])

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredTrips.slice(start, start + PAGE_SIZE)
  }, [filteredTrips, currentPage])

  const stats = useMemo(() => {
    const total = tripsState.data.length
    const active = tripsState.data.filter((trip) => normalizeStatus(trip.status) === 'active').length
    const completed = tripsState.data.filter((trip) => normalizeStatus(trip.status) === 'completed').length
    const cancelled = tripsState.data.filter((trip) => normalizeStatus(trip.status) === 'cancelled').length

    return [
      {
        id: 'total-trips',
        label: 'Total Trips',
        value: String(total),
        description: 'All registered trips.',
        icon: 'TT',
        tone: 'blue',
      },
      {
        id: 'active-trips',
        label: 'Active Trips',
        value: String(active),
        description: 'Trips currently active.',
        icon: 'AT',
        tone: 'emerald',
      },
      {
        id: 'completed-trips',
        label: 'Completed Trips',
        value: String(completed),
        description: 'Trips marked completed.',
        icon: 'CT',
        tone: 'indigo',
      },
      {
        id: 'cancelled-trips',
        label: 'Cancelled Trips',
        value: String(cancelled),
        description: 'Trips marked cancelled.',
        icon: 'XL',
        tone: 'slate',
      },
    ]
  }, [tripsState.data])

  return (
    <>
      <section className="panel-card drivers-page-header">
        <p className="panel-card-eyebrow">Trips</p>
        <h2>Trips</h2>
        <p className="drivers-page-subtitle">Manage all fleet trips.</p>
      </section>

      <TripStats stats={stats} />

      <TripToolbar
        search={search}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        vehicleFilter={vehicleFilter}
        statuses={statuses}
        vehicles={vehicles}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onDateChange={setDateFilter}
        onVehicleChange={setVehicleFilter}
      />

      {tripsState.loading && <section className="dashboard-state-card">Loading trips...</section>}

      {!tripsState.loading && tripsState.error && (
        <section className="dashboard-state-card dashboard-state-error">{tripsState.error}</section>
      )}

      {!tripsState.loading && !tripsState.error && filteredTrips.length === 0 && (
        <section className="dashboard-state-card">No trips found for the selected filters.</section>
      )}

      {!tripsState.loading && !tripsState.error && filteredTrips.length > 0 && (
        <>
          <TripTable trips={paginatedTrips} onView={setViewTrip} />

          <TripPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredTrips.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <TripViewModal trip={viewTrip} onClose={() => setViewTrip(null)} />
    </>
  )
}

export default TripsPage
