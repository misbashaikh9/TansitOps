import { useEffect, useState } from 'react'
import SkeletonBlock from '../components/SkeletonBlock.jsx'
import StatePanel from '../components/StatePanel.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ReportsCharts from '../components/reports/ReportsCharts.jsx'
import ReportsDetailsGrid from '../components/reports/ReportsDetailsGrid.jsx'
import ReportsHeader from '../components/reports/ReportsHeader.jsx'
import ReportsOperationalCostTable from '../components/reports/ReportsOperationalCostTable.jsx'
import ReportsSummaryCards from '../components/reports/ReportsSummaryCards.jsx'
import { getReports } from '../services/reportService.js'

function ReportsPage() {
  const toast = useToast()
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
          toast.success('Reports Synced', 'Summary analytics updated.')
        }
      } catch (error) {
        if (mounted) {
          setReportState({ loading: false, error: error.message, data: null })
          toast.error('Reports Error', error.message || 'Unable to load reports.')
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
      toast.success('Reports Refreshed', 'Latest report data loaded.')
    } catch (error) {
      setReportState({ loading: false, error: error.message, data: null })
      toast.error('Refresh Failed', error.message || 'Unable to refresh reports.')
    }
  }

  if (reportState.loading) {
    return <SkeletonBlock rows={6} />
  }

  if (reportState.error) {
    return (
      <StatePanel
        title="Unable to Load Reports"
        message={reportState.error}
        tone="error"
        primaryAction={{ label: 'Retry', onClick: refreshReports }}
      />
    )
  }

  if (!reportState.data) {
    return (
      <StatePanel
        title="No Report Data"
        message="No report data available from backend yet."
        tone="neutral"
        primaryAction={{ label: 'Refresh', onClick: refreshReports }}
      />
    )
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
    {
      id: 'other-expense-cost',
      label: 'Other Expense Cost',
      value: String(reportState.data.totalOtherExpenseCost ?? 0),
      tone: 'fuchsia',
      icon: 'EC',
    },
    {
      id: 'operational-cost',
      label: 'Operational Cost',
      value: String(reportState.data.operationalCost ?? 0),
      tone: 'rose',
      icon: 'OC',
    },
    {
      id: 'fuel-efficiency',
      label: 'Fuel Efficiency',
      value: reportState.data.fuelEfficiency ?? '0.00 km/L',
      tone: 'cyan',
      icon: 'FE',
    },
  ]

  return (
    <>
      <ReportsHeader onRefresh={refreshReports} />
      <ReportsSummaryCards cards={cards} />
      <ReportsCharts data={reportState.data} />
      <ReportsDetailsGrid data={reportState.data} />
      <ReportsOperationalCostTable rows={reportState.data.vehicleOperationalCosts || []} />
    </>
  )
}

export default ReportsPage
