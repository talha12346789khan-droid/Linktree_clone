"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PURPLE = "#9333ea";
const PINK = "#db2777";

function ChartCard({ title, subtitle, children, empty }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-2xl md:p-6">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      )}
      <div className="mt-4 h-56 w-full">
        {empty ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No activity in this period yet
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function hasAnyCount(data) {
  return data?.some((d) => d.count > 0);
}

export default function AnalyticsCharts({ series, range }) {
  const views = series?.viewsByDay || [];
  const clicks = series?.clicksByDay || [];
  const byLink = series?.clicksByLink || [];

  return (
    <div className="mb-6 space-y-6">
      <ChartCard
        title="Profile views"
        subtitle={`Last ${range} days (UTC)`}
        empty={!hasAnyCount(views)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={views}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              name="Views"
              stroke={PURPLE}
              strokeWidth={2}
              dot={{ r: 3, fill: PURPLE }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Link clicks"
        subtitle={`Total clicks per day — last ${range} days`}
        empty={!hasAnyCount(clicks)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={clicks}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              name="Clicks"
              stroke={PINK}
              strokeWidth={2}
              dot={{ r: 3, fill: PINK }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Clicks per link"
        subtitle="All-time clicks (lifetime)"
        empty={byLink.length === 0 || !byLink.some((l) => l.clicks > 0)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byLink} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Bar
              dataKey="clicks"
              name="Clicks"
              fill="url(#barGradient)"
              radius={[0, 4, 4, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={PURPLE} />
                <stop offset="100%" stopColor={PINK} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
