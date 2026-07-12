import api from './api.js'

function normalizeList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  return []
}

function toTitleCase(value) {
  if (!value) {
    return 'Unknown'
  }

  return String(value)
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function getDashboardData() {
  const [vehiclesResponse, driversResponse, tripsResponse] = await Promise.all([
    api.get('/vehicles'),
    api.get('/drivers'),
    api.get('/trips'),
  ])

  const vehicles = normalizeList(vehiclesResponse.data)
  const drivers = normalizeList(driversResponse.data)
  const trips = normalizeList(tripsResponse.data)

  const activeVehicles = vehicles.filter((vehicle) =>
    ['active', 'in service', 'running'].includes(String(vehicle.status || '').toLowerCase()),
  ).length
  const availableVehicles = vehicles.filter(
    (vehicle) => String(vehicle.status || '').toLowerCase() === 'available',
  ).length
  const activeTrips = trips.filter((trip) =>
    ['active', 'in transit', 'in progress'].includes(String(trip.status || '').toLowerCase()),
  ).length
  const completedTrips = trips.filter(
    (trip) => String(trip.status || '').toLowerCase() === 'completed',
  ).length
  const driversAvailable = drivers.filter(
    (driver) => String(driver.status || '').toLowerCase() === 'available',
  ).length

  const fleetTrend = [
    { month: 'Vehicles', utilization: vehicles.length },
    { month: 'Drivers', utilization: drivers.length },
    { month: 'Trips', utilization: trips.length },
    { month: 'Active Trips', utilization: activeTrips },
    { month: 'Completed', utilization: completedTrips },
    { month: 'Available Fleet', utilization: availableVehicles },
  ]

  const recentTrips = trips.slice(0, 8).map((trip) => ({
    id: `TR-${trip.id}`,
    vehicle: trip.vehicle_name
      ? `${trip.vehicle_name} (${trip.registration_number || 'No Reg'})`
      : trip.registration_number || 'Unassigned Vehicle',
    driver: trip.driver_name || 'Unassigned Driver',
    destination: `${trip.source || 'Unknown'} -> ${trip.destination || 'Unknown'}`,
    status: toTitleCase(trip.status),
    date: 'Live',
  }))

  return {
    kpis: [
      {
        id: 'total-vehicles',
        label: 'Fleet Size',
        value: String(vehicles.length),
        description: 'Total registered vehicles from backend records.',
        icon: 'VH',
        tone: 'blue',
      },
      {
        id: 'available-vehicles',
        label: 'Available Vehicles',
        value: String(availableVehicles),
        description: 'Vehicles currently available for assignment.',
        icon: 'AV',
        tone: 'teal',
      },
      {
        id: 'active-vehicles',
        label: 'Active Vehicles',
        value: String(activeVehicles),
        description: 'Vehicles currently active in operations.',
        icon: 'AC',
        tone: 'amber',
      },
      {
        id: 'total-drivers',
        label: 'Driver Pool',
        value: String(drivers.length),
        description: 'Total drivers synced from backend.',
        icon: 'DR',
        tone: 'indigo',
      },
      {
        id: 'drivers-available',
        label: 'Available Drivers',
        value: String(driversAvailable),
        description: 'Drivers marked available in backend status.',
        icon: 'DA',
        tone: 'slate',
      },
      {
        id: 'active-trips',
        label: 'Active Trips',
        value: String(activeTrips),
        description: 'Trips currently active or in transit.',
        icon: 'TR',
        tone: 'emerald',
      },
    ],
    fleetTrend,
    recentTrips,
  }
}
