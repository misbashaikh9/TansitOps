import { useEffect, useState } from 'react'
import ReportsDetailsGrid from '../components/reports/ReportsDetailsGrid.jsx'
import ReportsHeader from '../components/reports/ReportsHeader.jsx'
import ReportsStateCard from '../components/reports/ReportsStateCard.jsx'
import ReportsSummaryCards from '../components/reports/ReportsSummaryCards.jsx'
import { getReports } from '../services/reportService.js'

function ReportsPage() {
  const [reportState, setReportState] = useState({
    loading: true,
    error: '',
    data: null,
  })

  useEffect(() => {
    let mounted = true

    async function loadReports() {
      setReportState({ loading: true, error: '', data: null })

      try {
        const response = await getReports()
        if (mounted) {
          setReportState({ loading: false, error: '', data: response?.data || null })
        }
      } catch (error) {
        if (mounted) {
          setReportState({ loading: false, error: error.message, data: null })
        }
      }
    }

    loadReports()

    return () => {
      mounted = false
    }
  }, [])

  async function refreshReports() {
    setReportState((previous) => ({ ...previous, loading: true, error: '' }))

    try {
      const response = await getReports()
      setReportState({ loading: false, error: '', data: response?.data || null })
    } catch (error) {
      setReportState({ loading: false, error: error.message, data: null })
    }
  }

  if (reportState.loading) {
    return <ReportsStateCard message="Loading reports..." />
  }

  if (reportState.error) {
    return <ReportsStateCard message={reportState.error} error actionLabel="Retry" onAction={refreshReports} />
  }

  if (!reportState.data) {
    return <ReportsStateCard message="No report data available from backend yet." actionLabel="Refresh" onAction={refreshReports} />
  }

  const cards = [
    {
      id: 'total-vehicles',
      label: 'Total Vehicles',
      value: String(reportState.data.totalVehicles ?? 0),
      tone: 'blue',
      icon: 'TV',
    },
    {
      id: 'active-vehicles',
      label: 'Active Vehicles',
      value: String(reportState.data.activeVehicles ?? 0),
      tone: 'teal',
      icon: 'AV',
    },
    {
      id: 'fleet-utilization',
      label: 'Fleet Utilization',
      value: reportState.data.fleetUtilization ?? '0%',
      tone: 'indigo',
      icon: 'FU',
    },
    {
      id: 'active-trips',
      label: 'Active Trips',
      value: String(reportState.data.activeTrips ?? 0),
      tone: 'emerald',
      icon: 'AT',
    },
    {
      id: 'fuel-cost',
      label: 'Total Fuel Cost',
      value: String(reportState.data.totalFuelCost ?? 0),
      tone: 'amber',
      icon: 'FC',
    },
    {
      id: 'maintenance-cost',
      label: 'Total Maintenance Cost',
      value: String(reportState.data.totalMaintenanceCost ?? 0),
      tone: 'slate',
      icon: 'MC',
    },
  ]

  return (
    <>
      <ReportsHeader onRefresh={refreshReports} />
      <ReportsSummaryCards cards={cards} />
      <ReportsDetailsGrid data={reportState.data} />
    </>
  )
}

export default ReportsPage
