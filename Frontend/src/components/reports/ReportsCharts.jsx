import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function ReportsCharts({ data }) {
  const chartData = [
    {
      name: 'Fleet',
      Total: Number(data.totalVehicles ?? 0),
      Active: Number(data.activeVehicles ?? 0),
    },
    {
      name: 'Trips',
      Total: Number(data.activeTrips ?? 0),
      Active: Number(data.activeTrips ?? 0),
    },
  ]

  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Visual analytics</p>
          <h2>Reports Overview</h2>
        </div>
      </div>
      <div className="chart-shell reports-chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid var(--line)',
                boxShadow: '0 14px 32px rgba(15, 23, 42, 0.15)',
              }}
            />
            <Legend />
            <Bar dataKey="Total" radius={[8, 8, 0, 0]} fill="#2563eb" animationDuration={700} />
            <Bar dataKey="Active" radius={[8, 8, 0, 0]} fill="#14b8a6" animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default ReportsCharts
