import { useEffect, useMemo, useState } from 'react'
import FleetChart from '../components/FleetChart.jsx'
import KPICard from '../components/KPICard.jsx'
import Navbar from '../components/Navbar.jsx'
import RecentTrips from '../components/RecentTrips.jsx'
import Sidebar from '../components/Sidebar.jsx'
import DriversPage from './DriversPage.jsx'
import FuelPage from './FuelPage.jsx'
import MaintenancePage from './MaintenancePage.jsx'
import ReportsPage from './ReportsPage.jsx'
import TripsPage from './TripsPage.jsx'
import VehiclesPage from './VehiclesPage.jsx'
import { getDashboardData } from '../services/dashboardService.js'
import '../styles/dashboard.css'

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: 'DB' },
  { id: 'vehicles', label: 'Vehicles', shortLabel: 'VH' },
  { id: 'drivers', label: 'Drivers', shortLabel: 'DR' },
  { id: 'trips', label: 'Trips', shortLabel: 'TR' },
  { id: 'maintenance', label: 'Maintenance', shortLabel: 'MT' },
  { id: 'fuel', label: 'Fuel & Expenses', shortLabel: 'FE' },
  { id: 'reports', label: 'Reports', shortLabel: 'RP' },
  { id: 'logout', label: 'Logout', shortLabel: 'LO' },
]

function Dashboard({ currentUser, backendStatus, onLogout }) {
  const [dashboardState, setDashboardState] = useState({
    loading: true,
    error: '',
    data: null,
  })
  const [activeItem, setActiveItem] = useState('dashboard')
  const [searchValue, setSearchValue] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      setDashboardState((previous) => ({ ...previous, loading: true, error: '' }))

      try {
        const data = await getDashboardData()
        setDashboardState({ loading: false, error: '', data })
      } catch (error) {
        setDashboardState({
          loading: false,
          error: error.message || 'Unable to load dashboard data.',
          data: null,
        })
      }
    }

    loadDashboard()
  }, [])

  const filteredTrips = useMemo(() => {
    const trips = dashboardState.data?.recentTrips || []
    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return trips
    }

    return trips.filter((trip) =>
      [trip.id, trip.vehicle, trip.driver, trip.destination, trip.status]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [dashboardState.data, searchValue])

  const pageTitle = useMemo(() => {
    const currentPage = navigationItems.find((item) => item.id === activeItem)
    return currentPage?.label || 'Dashboard'
  }, [activeItem])

  return (
    <main className="dashboard-shell">
      <Sidebar
        items={navigationItems}
        activeItem={activeItem}
        isOpen={isSidebarOpen}
        onSelect={(itemId) => {
          setActiveItem(itemId)
          setIsSidebarOpen(false)
        }}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={onLogout}
      />

      <section className="dashboard-main">
        <Navbar
          pageTitle={pageTitle}
          currentUser={currentUser}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onMenuToggle={() => setIsSidebarOpen((previous) => !previous)}
        />

        <section className="dashboard-hero">
          <div>
            <p className="dashboard-eyebrow">TransitOps live console</p>
            <h2>Welcome back, {currentUser?.name || 'Operator'}.</h2>
            <p className="dashboard-hero-copy">
              Track vehicles, drivers, and trip momentum from one responsive dashboard.
            </p>
          </div>
          <div className="dashboard-hero-status">
            <div className="dashboard-status-pill">
              <span className="hero-status-pulse" />
              <span>Live</span>
            </div>
            <span className="hero-status-label">Backend status</span>
            <strong>{backendStatus}</strong>
          </div>
        </section>

        {activeItem === 'vehicles' && <VehiclesPage />}
        {activeItem === 'drivers' && <DriversPage />}
        {activeItem === 'trips' && <TripsPage />}
        {activeItem === 'maintenance' && <MaintenancePage />}
        {activeItem === 'fuel' && <FuelPage />}
        {activeItem === 'reports' && <ReportsPage />}

        {activeItem === 'dashboard' && (
          <>
            {dashboardState.loading && (
              <section className="dashboard-state-card">Loading dashboard data...</section>
            )}

            {!dashboardState.loading && dashboardState.error && (
              <section className="dashboard-state-card dashboard-state-error">
                {dashboardState.error}
              </section>
            )}

            {!dashboardState.loading && dashboardState.data && (
              <>
                <section className="kpi-grid">
                  {(dashboardState.data.kpis || []).map((item) => (
                    <KPICard key={item.id} item={item} />
                  ))}
                </section>

                <section className="dashboard-content-grid">
                  <FleetChart data={dashboardState.data.fleetTrend || []} />
                  <RecentTrips trips={filteredTrips} />
                </section>
              </>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default Dashboard
