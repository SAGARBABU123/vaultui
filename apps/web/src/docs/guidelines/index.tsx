import type { ComponentType } from "react";

import { Overview } from "./sections/Overview";
import { StartingFromScratch } from "./sections/StartingFromScratch";
import { DesignTokens } from "./sections/DesignTokens";
import { Hierarchy } from "./sections/Hierarchy";
import { Spacing } from "./sections/Spacing";
import { Responsive } from "./sections/Responsive";
import { Typography } from "./sections/Typography";
import { Copywriting } from "./sections/Copywriting";
import { Color } from "./sections/Color";
import { DarkMode } from "./sections/DarkMode";
import { Depth } from "./sections/Depth";
import { Components } from "./sections/Components";
import { CardsAnatomy } from "./sections/CardsAnatomy";
import { ComponentStates } from "./sections/ComponentStates";
import { FormsAndDashboards } from "./sections/FormsAndDashboards";
import { FormValidation } from "./sections/FormValidation";
import { InputsControls } from "./sections/InputsControls";
import { DataTables } from "./sections/DataTables";
import { Navigation } from "./sections/Navigation";
import { Tabs } from "./sections/Tabs";
import { Dropdowns } from "./sections/Dropdowns";
import { Modals } from "./sections/Modals";
import { Accordions } from "./sections/Accordions";
import { Toasts } from "./sections/Toasts";
import { Tooltips } from "./sections/Tooltips";
import { Badges } from "./sections/Badges";
import { AdvancedInputs } from "./sections/AdvancedInputs";
import { ComplexData } from "./sections/ComplexData";
import { AdvancedOverlays } from "./sections/AdvancedOverlays";
import { FeedbackIndicators } from "./sections/FeedbackIndicators";
import { Breadcrumbs } from "./sections/Breadcrumbs";
import { OtpInputs } from "./sections/OtpInputs";
import { HoverCards } from "./sections/HoverCards";
import { Sliders } from "./sections/Sliders";
import { Carousels } from "./sections/Carousels";
import { Images } from "./sections/Images";
import { Iconography } from "./sections/Iconography";
import { Borders } from "./sections/Borders";
import { Motion } from "./sections/Motion";
import { EmptyStates } from "./sections/EmptyStates";
import { LoadingStates } from "./sections/LoadingStates";
import { DoDontLibrary } from "./sections/DoDontLibrary";
import { UiQualityChecker } from "./sections/UiQualityChecker";

/**
 * Vault UI — UI Guidelines.
 *
 * The do/don't style guide (ported from the AI Studio reference and re-skinned
 * onto Vault tokens: surface/brand/success/danger). Every page follows the
 * same shape — Rule → Why → Do / Don't → Agent Check — with ✕/✓ side-by-side
 * visual comparisons. Lives under /docs/guidelines/:id.
 */

export interface GuidelineItem {
  id: string;
  label: string;
}

export interface GuidelineGroup {
  title: string;
  items: GuidelineItem[];
}

export const GUIDELINE_GROUPS: GuidelineGroup[] = [
  {
    title: "Introduction",
    items: [
      { id: "overview", label: "Overview & Purpose" },
      { id: "starting", label: "Starting from Scratch" },
      { id: "design-tokens", label: "Design Tokens" },
    ],
  },
  {
    title: "Layout & Hierarchy",
    items: [
      { id: "hierarchy", label: "Hierarchy is Everything" },
      { id: "spacing", label: "Layout & Spacing" },
      { id: "responsive", label: "Responsive Adaptations" },
    ],
  },
  {
    title: "Typography",
    items: [
      { id: "typography", label: "Typography System" },
      { id: "copywriting", label: "Copywriting & Text Wrap" },
    ],
  },
  {
    title: "Color & Depth",
    items: [
      { id: "color", label: "Color System" },
      { id: "dark-mode", label: "Dark Mode Architecture" },
      { id: "depth", label: "Depth & Elevation" },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "components", label: "Component Design" },
      { id: "cards-anatomy", label: "Cards Anatomy" },
      { id: "component-states", label: "Component States" },
      { id: "forms-dashboards", label: "Forms & Dashboards" },
      { id: "form-validation", label: "Form Validation" },
      { id: "inputs-controls", label: "Radios & Checkboxes" },
      { id: "data-tables", label: "Data Tables" },
      { id: "navigation", label: "Navigation Active States" },
      { id: "tabs", label: "Tabs & Segmented" },
      { id: "dropdowns", label: "Dropdowns & Popovers" },
      { id: "modals", label: "Modals & Overlays" },
      { id: "accordions", label: "Accordions" },
      { id: "toasts", label: "Toasts & Snackbars" },
      { id: "tooltips", label: "Tooltips" },
      { id: "badges", label: "Badges & Tags" },
    ],
  },
  {
    title: "Advanced Components",
    items: [
      { id: "advanced-inputs", label: "Advanced Inputs" },
      { id: "complex-data", label: "Complex Data" },
      { id: "advanced-overlays", label: "Overlays & Drawers" },
      { id: "feedback-indicators", label: "Feedback & Alerts" },
    ],
  },
  {
    title: "Specialized Patterns",
    items: [
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "otp-inputs", label: "OTP & PIN Inputs" },
      { id: "hover-cards", label: "Hover Cards" },
      { id: "sliders", label: "Sliders" },
      { id: "carousels", label: "Carousels" },
    ],
  },
  {
    title: "Polish & Feedback",
    items: [
      { id: "images", label: "Working with Images" },
      { id: "iconography", label: "Iconography" },
      { id: "borders", label: "Borders & Polish" },
      { id: "motion", label: "Meaningful Motion" },
      { id: "empty-states", label: "Empty States" },
      { id: "loading-states", label: "Loading & Skeletons" },
    ],
  },
  {
    title: "Review & Tools",
    items: [
      { id: "do-dont", label: "DO / DON'T Library" },
      { id: "checklist", label: "UI Quality Checker" },
    ],
  },
];

export const GUIDELINE_VIEWS: Record<string, ComponentType<{ agentMode: boolean }>> = {
  overview: Overview,
  starting: StartingFromScratch,
  "design-tokens": DesignTokens,
  hierarchy: Hierarchy,
  spacing: Spacing,
  responsive: Responsive,
  typography: Typography,
  copywriting: Copywriting,
  color: Color,
  "dark-mode": DarkMode,
  depth: Depth,
  components: Components,
  "cards-anatomy": CardsAnatomy,
  "component-states": ComponentStates,
  "forms-dashboards": FormsAndDashboards,
  "form-validation": FormValidation,
  "inputs-controls": InputsControls,
  "data-tables": DataTables,
  navigation: Navigation,
  tabs: Tabs,
  dropdowns: Dropdowns,
  modals: Modals,
  accordions: Accordions,
  toasts: Toasts,
  tooltips: Tooltips,
  badges: Badges,
  "advanced-inputs": AdvancedInputs,
  "complex-data": ComplexData,
  "advanced-overlays": AdvancedOverlays,
  "feedback-indicators": FeedbackIndicators,
  breadcrumbs: Breadcrumbs,
  "otp-inputs": OtpInputs,
  "hover-cards": HoverCards,
  sliders: Sliders,
  carousels: Carousels,
  images: Images,
  iconography: Iconography,
  borders: Borders,
  motion: Motion,
  "empty-states": EmptyStates,
  "loading-states": LoadingStates,
  "do-dont": DoDontLibrary,
  checklist: UiQualityChecker,
};

/** Linear prev/next spine — same order as the sidebar. */
export const GUIDELINE_NAV: GuidelineItem[] = GUIDELINE_GROUPS.flatMap((g) => g.items);

export function guidelineUrl(id: string): string {
  return `/docs/guidelines/${id}`;
}