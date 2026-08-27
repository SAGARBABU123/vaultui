# Changelog

All notable changes to the Vault UI monorepo.

## [0.1.0] — 2026-02-27

### Added — Kits & components
- **Free tier** `@gudipudimani/ui` (MIT): Button (xs–xl scale), Badge, Card
- **AI Agent Kit** `@gudipudimani/ai-chat` (11): ChatCanvas, ChatInput, TokenStreamer, TypingIndicator,
  ToolCallInspector, ConstraintBadge, SourceCitation, ModelPicker, MemoryTimeline,
  AgentOrchestrationCanvas, PromptPlayground
- **Data Viz Pro** `@gudipudimani/data-viz` (12): KpiCard, Sparkline, AnimatedCounter, ProgressRadial,
  HeatmapCalendar, TreeMap, WaterfallChart, RadarChart, SankeyDiagram, CandlestickChart,
  TimelineSlider, GeoMap
- **Commerce Kit** `@gudipudimani/commerce` (8): CartDrawer, PricingTable, RefundWizard,
  InstallmentToggle, InventoryChip, CheckoutProgressRail, SubscriptionManager, GiftCardBuilder
- **Dev Tools Kit** `@gudipudimani/dev-tools` (8): DiffViewer, LogStream, ApiPlayground,
  FeatureFlagBoard, SqlBuilder, CronBuilder, JsonPathTester, WebhookSimulator
- **Project Mgmt Kit** `@gudipudimani/project` (3): KanbanBoard, RoadmapTimeline, GanttChart
- **Collab Kit** `@gudipudimani/collab` (3): PresenceList, LiveCursors, ActivityFeed

### Added — Platform
- `@gudipudimani/tokens` theme engine: Tailwind v4 CSS-first tokens, motion keyframes, Inter Variable font
- `@gudipudimani/utils` `cn()`; `@gudipudimani/configs` strict tsconfig
- Turborepo pipelines: build · typecheck · lint · dev
- tsup dist builds (esm + cjs + d.ts), npm-ready conditional exports, publish config
- MIT + Commercial licenses; RELEASE.md publishing guide
- Docs explorer app (`apps/web`): sidebar index (47 entries), usage/API/live-demo shell,
  search, mobile drawer
- Storybook scaffold (`apps/showroom`) — paused pending story coverage

### Fixed
- Button sizing scale + touch targets; eliminated sub-13px text (55 spots)
- Card radii reduced (24px → 16px) via radius tokens
- Copy buttons now lucide-react icons; double-text prev/next nav