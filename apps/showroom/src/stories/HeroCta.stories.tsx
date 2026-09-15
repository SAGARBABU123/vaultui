import { Button } from "@vaultui/ui";
import { CtaBand, HeroSection } from "@vaultui/marketing";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof HeroSection> = {
  title: "Marketing/Hero & CTA",
  component: HeroSection,
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Hero: Story = {
  render: () => (
    <HeroSection
      eyebrow="v1.4 — now with themes"
      title="Premium React + Tailwind components"
      body="Production-ready, token-driven and fully accessible. The pieces your roadmap needs — without the boilerplate."
      primaryAction={<Button size="lg">Browse components</Button>}
      secondaryAction={<Button variant="ghost" size="lg">View pricing</Button>}
    />
  ),
};

export const Cta: Story = {
  render: () => (
    <CtaBand
      title="Ready to ship faster?"
      body="Join 4,000+ teams building with Vault UI. Free tier included — no credit card required."
      primaryAction={<Button size="lg">Start free</Button>}
      secondaryAction={<Button variant="ghost" size="lg">Talk to sales</Button>}
    />
  ),
};

export const CtaMinimal: Story = {
  render: () => (
    <CtaBand title="Your launch is one line away" primaryAction={<Button>Get started</Button>} />
  ),
};