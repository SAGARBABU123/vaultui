import {
  Sparkline,
  AnimatedCounter,
  KpiCard,
  ProgressRadial,
  HeatmapCalendar,
  TreeMap,
  WaterfallChart,
  RadarChart,
  SankeyDiagram,
  CandlestickChart,
  TimelineSlider,
  GeoMap,
  BarChart,
  LineChart,
  DonutChart,
  ScatterChart,
  FunnelChart,
  GaugeChart,
  BulletChart,
} from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Charts/Overview",
};

export default meta;

export const All: StoryObj = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm font-semibold text-surface-500">Trends</p>
        <KpiCard
          label="Revenue"
          value={48290}
          delta={12.4}
          hint="vs last month"
          trend={[10, 12, 9, 14, 18, 16, 22, 26, 24, 31, 35, 42]}
        />
        <div className="rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
          <LineChart
            labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]}
            series={[
              { label: "Signups", points: [10, 24, 18, 32, 41, 38, 55, 62], color: "var(--color-brand-600)" },
              { label: "Upgrades", points: [4, 8, 7, 12, 15, 17, 19, 24], color: "var(--color-success-500)" },
            ]}
          />
        </div>
        <div className="rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
          <BarChart
            data={[
              { label: "M", value: 42 },
              { label: "T", value: 58 },
              { label: "W", value: 36 },
              { label: "T", value: 71 },
              { label: "F", value: 49 },
              { label: "S", value: 22 },
              { label: "S", value: 30 },
            ]}
          />
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-semibold text-surface-500">Distribution</p>
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
          <DonutChart
            size={140}
            data={[
              { label: "Pro", value: 42 },
              { label: "Free", value: 30 },
              { label: "Enterprise", value: 18 },
              { label: "Trial", value: 10 },
            ]}
            centerValue="100"
            centerLabel="plans"
          />
          <DonutChart
            size={90}
            data={[
              { label: "One", value: 3 },
              { label: "Two", value: 5 },
            ]}
            legend={false}
          />
        </div>
        <div className="flex gap-6 rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
          <div className="flex flex-col items-center gap-2">
            <ProgressRadial value={72} label="72" sublabel="score" tone="success" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <GaugeChart value={68} label="health" size={180} />
          </div>
        </div>
        <div className="rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-soft">
          <BulletChart value={72} target={90} max={120} label="Active users" />
          <div className="mt-4">
            <BulletChart value={32} target={40} max={60} q1={25} q2={48} label="Churn risk" />
          </div>
        </div>
      </div>
    </div>
  ),
};