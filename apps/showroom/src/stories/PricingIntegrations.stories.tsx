import { Button } from "@vaultui/ui";
import { ComparisonSection, IntegrationsGrid, PricingSection } from "@vaultui/marketing";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PricingSection> = {
  title: "Marketing/Pricing & Integrations",
  component: PricingSection,
};

export default meta;
type Story = StoryObj<typeof PricingSection>;

export const Pricing: Story = {
  render: () => (
    <PricingSection
      plans={[
        {
          name: "Free",
          price: "$0",
          period: "month",
          description: "Core components for side projects.",
          features: ["All core UI components", "1 theme", "Community support", "Storybook access"],
        },
        {
          name: "Pro",
          price: "$19",
          period: "month",
          description: "Everything you need to ship production UI.",
          highlighted: true,
          features: ["Everything in Free", "All 4 themes", "Charts + marketing packs", "Priority support", "License for 3 products"],
          cta: <Button className="vault-btn-primary w-full">Choose Pro</Button>,
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "For orgs that need the whole vault.",
          features: ["Everything in Pro", "Unlimited products", "SSO & audit logs", "Dedicated engineer", "SLA"],
        },
      ]}
    />
  ),
};

export const Integrations: Story = {
  render: () => (
    <IntegrationsGrid
      integrations={[
        { name: "Vercel", description: "Deploy your showroom in one click.", tag: "deploy" },
        { name: "Supabase", description: "Auth + Postgres behind every app.", tag: "backend" },
        { name: "Tailwind", description: "Strict v4 token compatibility." },
        { name: "Storybook", description: "Live component storefront.", tag: "tooling" },
        { name: "Figma", description: "Token-driven design kit import.", tag: "design" },
        { name: "GitHub", description: "Versioned registry releases." },
      ]}
    />
  ),
};

export const Comparison: Story = {
  render: () => (
    <ComparisonSection
      features={["Core components", "Themes", "Charts", "Marketing kit", "Commercial license", "Priority support"]}
      columns={[
        { label: "Vault UI Free", rows: [true, false, false, false, false, false] },
        { label: "Vault UI Pro", highlighted: true, rows: [true, true, true, true, true, true] },
        { label: "Roll-your-own", rows: ["~3 months", true, false, "half a year", false, false] },
      ]}
    />
  ),
};