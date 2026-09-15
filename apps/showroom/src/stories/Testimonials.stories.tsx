import { Testimonial, TestimonialGrid } from "@vaultui/marketing";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Testimonial> = {
  title: "Marketing/Testimonials",
  component: Testimonial,
};

export default meta;
type Story = StoryObj<typeof Testimonial>;

export const Single: Story = {
  render: () => (
    <div className="max-w-sm">
      <Testimonial
        quote="We replaced three internal UI libraries with Vault UI over one sprint. The theming alone saved our design system team weeks."
        name="Ada Lovelace"
        role="VP Engineering, Acme Corp"
      />
    </div>
  ),
};

export const SingleWithPhoto: Story = {
  render: () => (
    <div className="max-w-sm">
      <Testimonial
        quote="The charts package is unreal. We shipped a full analytics dashboard without adding a single chart dependency."
        name="Katherine Johnson"
        role="Product Lead, Globex"
        src="https://i.pravatar.cc/96?img=44"
      />
    </div>
  ),
};

export const Grid: Story = {
  render: () => (
    <TestimonialGrid
      testimonials={[
        {
          quote: "The a11y work is best-in-class — our audit went from 14 issues to zero.",
          name: "Grace Hopper",
          role: "CTO, Northwind",
        },
        {
          quote: "Copy-paste install. My team shipped 3 features in the first week.",
          name: "Alan Turing",
          role: "Eng Lead, Initech",
        },
        {
          quote: "Themes swap in one line and everything just works. Magic.",
          name: "Margaret Hamilton",
          role: "Design Systems, Hooli",
        },
      ]}
    />
  ),
};