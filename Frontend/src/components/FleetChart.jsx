import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function FleetChart({ data }) {
  return (
    <section className="panel-card">
      <div className="panel-card-header">
        <div>
          <p className="panel-card-eyebrow">Performance trend</p>
          <h2>Fleet utilization</h2>
        </div>
        <div className="panel-card-legend">
          <span className="legend-dot" />
          <span>Last 6 months</span>
        </div>
      </div>

      <div className="chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dbe4f2" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#64748b" />
            <YAxis tickLine={false} axisLine={false} stroke="#64748b" />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #dbe4f2',
                boxShadow: '0 18px 36px rgba(15, 23, 42, 0.12)',
              }}
            />
            <Line
              type="monotone"
              dataKey="utilization"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default FleetChart
