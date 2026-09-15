import { FaqSection, LogosStrip, NewsletterSignup } from "@vaultui/marketing";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof FaqSection> = {
  title: "Marketing/Facts & Signup",
  component: FaqSection,
};

export default meta;
type Story = StoryObj<typeof FaqSection>;

export const Logos: Story = {
  render: () => (
    <div className="rounded-2xl bg-surface-0 p-6 shadow-soft">
      <LogosStrip
        names={["Acme Corp", "Northwind", "Globex", "Initech", "Hooli", "Umbrella", "Stark Industries"]}
      />
    </div>
  ),
};

export const Faq: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <FaqSection
        items={[
          { question: "Is there a free tier?", answer: "Yes — all core components are free under the commercial license." },
          { question: "Can I use it in commercial projects?", answer: "Absolutely. Paid tiers include extended commercial rights and priority support." },
          { question: "Do you offer team pricing?", answer: "Yes, volume pricing kicks in at 10 seats. Contact sales for a quote." },
          { question: "How do themes work?", answer: "Set document.documentElement.dataset.theme to 'light' | 'dark' | 'midnight' | 'paper' and every token updates instantly." },
        ]}
      />
    </div>
  ),
};

export const Newsletter: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <NewsletterSignup
        note="One email a month. Unsubscribe anytime."
        onSubscribe={(email) => alert(`Subscribed: ${email}`)}
      />
    </div>
  ),
};