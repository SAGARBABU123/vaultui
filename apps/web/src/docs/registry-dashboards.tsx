import { ExecutiveDashboardDemo } from "./dashboards/executive-dashboard";
import { RealtimeMonitoringDemo } from "./dashboards/realtime-monitoring";
import { DrillDownAnalyticsDemo } from "./dashboards/drill-down-analytics";
import { PredictiveAnalyticsDemo } from "./dashboards/predictive-analytics";
import { FinancialDashboardDemo } from "./dashboards/financial-dashboard";
import type { DashboardGroup } from "./types";

/**
 * Dashboard Templates — full-page product layouts composed from Vault UI
 * components. They live in their own sidebar section above the component
 * groups, and each one MUST be built from theme tokens only so the theme
 * dropdown re-skins it (Neumorphic / Glassmorphism / Dimensional Layering /
 * Vintage Retro Film).
 *
 * Adding a template (one by one):
 *   1. import the components you need (all tokens-driven by design)
 *   2. push a DashboardEntry into `items` below:
 *        { kind: "dashboard", id, name, description, packages, demo }
 *   3. in `demo`, use ONLY token utilities — bg-surface-*, text-surface-*,
 *      border-*, shadow-*, bg-brand-*, text-brand-* — never raw hex
 *   4. give the template its own full-bleed background (bg-surface-50 etc.)
 *      so the active theme's backdrop shows through the whole preview
 *
 * It appears in the sidebar + wide docs preview automatically.
 */
export const DASHBOARDS: DashboardGroup[] = [
  {
    group: "Dashboard Templates",
    items: [
      {
        kind: "dashboard",
        id: "dashboard-executive",
        name: "Executive Dashboard",
        description:
          "C-suite summary at a glance — animated KPI cards with trend arrows, a revenue chart, goal-attainment donut, activity heatmap, quarterly roadmap and an audit feed. Spec: uistyleguide.com executive dashboard.",
        packages: ["@vaultui/data-viz", "@vaultui/dev-tools", "@vaultui/project", "@vaultui/ui"],
        demo: <ExecutiveDashboardDemo />,
      },
      {
        kind: "dashboard",
        id: "dashboard-realtime-monitoring",
        name: "Realtime Monitoring",
        description:
          "Ops-center console on the dark token steps — live clock, streaming traffic chart, drifting resource gauges, pulse status pills, auto-refresh and a live-appending event feed. Spec: uistyleguide.com realtime monitoring.",
        packages: ["@vaultui/data-viz", "@vaultui/dev-tools", "@vaultui/ui"],
        demo: <RealtimeMonitoringDemo />,
      },
      {
        kind: "dashboard",
        id: "dashboard-drill-down-analytics",
        name: "Drill-Down Analytics",
        description:
          "Hierarchical data exploration — breadcrumb navigation, expandable tree rows, zoom transitions, linked selection details and a revenue bridge that follows the drilled level. Spec: uistyleguide.com drill-down analytics.",
        packages: ["@vaultui/data-viz", "@vaultui/ui"],
        demo: <DrillDownAnalyticsDemo />,
      },
      {
        kind: "dashboard",
        id: "dashboard-predictive-analytics",
        name: "Predictive Analytics",
        description:
          "Forecast explorer — animated projection line with a widening confidence band, live scenario toggles (Base / Optimistic / Conservative), prediction indicators and segment-level model output. Spec: uistyleguide.com predictive analytics.",
        packages: ["@vaultui/data-viz", "@vaultui/ui"],
        demo: <PredictiveAnalyticsDemo />,
      },
      {
        kind: "dashboard",
        id: "dashboard-financial-dashboard",
        name: "Financial Dashboard",
        description:
          "CFO view with accounting conventions — drill-through P&L (actual vs budget with red/green variance), a revenue→net-income waterfall bridge and cash flow with runway. Spec: uistyleguide.com financial dashboard.",
        packages: ["@vaultui/data-viz", "@vaultui/ui"],
        demo: <FinancialDashboardDemo />,
      },
    ],
  },
];