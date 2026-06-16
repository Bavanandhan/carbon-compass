// ============================================================
// CarbonTwin AI - Carbon Footprint Dashboard
// ============================================================



import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, StatCard } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import {
  formatEmissions,
  formatMonthLabel,
  CATEGORY_CHART_COLORS,
} from "@/lib/carbon/formatters";
import { vsParisTarget, treesNeededToOffset, GLOBAL_AVERAGES } from "@/lib/carbon/carbonCalculations";

interface DashboardProps {
  store: CarbonStore;
}

export function Dashboard({ store }: DashboardProps) {
  const { totalEmissions, emissionsByCategory, monthlySummaries, emissionSources } = store;

  const { overByPercent, onTrack } = vsParisTarget(totalEmissions);
  const trees = treesNeededToOffset(totalEmissions);

  const pieData = useMemo(
    () => [
      { name: "Transport", value: emissionsByCategory.transport, fill: CATEGORY_CHART_COLORS.transport },
      { name: "Energy", value: emissionsByCategory.energy, fill: CATEGORY_CHART_COLORS.energy },
      { name: "Diet", value: emissionsByCategory.diet, fill: CATEGORY_CHART_COLORS.diet },
      { name: "Consumption", value: emissionsByCategory.consumption, fill: CATEGORY_CHART_COLORS.consumption },
    ],
    [emissionsByCategory],
  );

  const trendData = useMemo(
    () =>
      monthlySummaries.slice(-6).map((s) => ({
        ...s,
        month: formatMonthLabel(s.month),
      })),
    [monthlySummaries],
  );

  const prevMonth = monthlySummaries[monthlySummaries.length - 2];
  const trend = prevMonth
    ? {
        value: ((totalEmissions - prevMonth.total) / prevMonth.total) * 100,
        label: "vs last month",
      }
    : undefined;

  const rankedSources = useMemo(
    () => [...emissionSources].sort((a, b) => b.value - a.value).slice(0, 5),
    [emissionSources],
  );

  return (
    <section
      aria-labelledby="dashboard-heading"
      id="dashboard"
      className="space-y-6"
    >
      <div>
        <h1
          id="dashboard-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          Your Carbon Footprint
        </h1>
        <p className="mt-1 text-carbon-500">
          Tracking your monthly CO₂ emissions across all categories
        </p>
      </div>

      {/* Key stats */}
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        role="region"
        aria-label="Key emission statistics"
      >
        <StatCard
          label="Monthly Emissions"
          value={formatEmissions(totalEmissions)}
          sub="This month"
          trend={trend}
          color={onTrack ? "green" : "red"}
          icon="🌍"
        />
        <StatCard
          label="vs Paris Target"
          value={onTrack ? "On track ✓" : `+${overByPercent.toFixed(0)}% over`}
          sub={`Target: ${formatEmissions(GLOBAL_AVERAGES.paris_target)}/month`}
          color={onTrack ? "green" : "red"}
          icon="🎯"
        />
        <StatCard
          label="UK Average"
          value={formatEmissions(GLOBAL_AVERAGES.uk)}
          sub={`You are ${totalEmissions < GLOBAL_AVERAGES.uk ? "below" : "above"} average`}
          color={totalEmissions < GLOBAL_AVERAGES.uk ? "green" : "amber"}
          icon="📍"
        />
        <StatCard
          label="Trees to Offset"
          value={`${trees} trees/month`}
          sub="Needed to neutralise your footprint"
          color="amber"
          icon="🌳"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend chart */}
        <Card
          className="lg:col-span-2"
          as="article"
          aria-labelledby="trend-chart-heading"
        >
          <CardHeader
            id="trend-chart-heading"
            title="6-Month Emission Trend"
            subtitle="Monthly CO₂e by category (kg)"
          />
          <div aria-label="Stacked area chart showing emission trends by category over 6 months">
            <ResponsiveContainer
              width="100%"
              height={260}
            >
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  formatter={(v: number) => [`${v} kg`, ""]}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend />
                {Object.entries(CATEGORY_CHART_COLORS).map(([key, color]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stackId="1"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.6}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category breakdown */}
        <Card
          as="article"
          aria-labelledby="breakdown-heading"
        >
          <CardHeader
            id="breakdown-heading"
            title="Category Breakdown"
            subtitle="This month"
          />
          <div aria-label="Pie chart showing emissions by category">
            <ResponsiveContainer
              width="100%"
              height={180}
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} kg CO₂e`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul
            className="mt-2 space-y-2"
            aria-label="Emission amounts by category"
          >
            {pieData.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                    aria-hidden="true"
                  />
                  <span className="text-carbon-600">{item.name}</span>
                </span>
                <span className="font-medium text-carbon-900">{item.value} kg</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Carbon Leak Detection - Top Sources */}
      <Card
        as="article"
        aria-labelledby="leak-heading"
      >
        <CardHeader
          id="leak-heading"
          title="Carbon Leak Detection"
          subtitle="Your top 5 emission sources ranked by impact"
        />
        <ul
          className="space-y-3"
          aria-label="Emission sources ranked by CO2 impact"
        >
          {rankedSources.map((source, index) => {
            const pct = (source.value / totalEmissions) * 100;
            return (
              <li
                key={source.id}
                className="flex items-center gap-4"
              >
                <span
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-carbon-100 text-xs font-bold text-carbon-600"
                  aria-label={`Rank ${index + 1}`}
                >
                  {index + 1}
                </span>
                <span
                  className="flex-shrink-0 text-xl"
                  aria-hidden="true"
                >
                  {source.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-carbon-800">
                      {source.label}
                    </span>
                    <span className="flex-shrink-0 text-sm font-semibold text-carbon-900">
                      {source.value} kg
                    </span>
                  </div>
                  <div
                    className="mt-1 h-2 overflow-hidden rounded-full bg-carbon-100"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${source.label}: ${pct.toFixed(0)}% of total emissions`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_CHART_COLORS[source.category],
                      }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-carbon-400">{pct.toFixed(1)}% of total</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
