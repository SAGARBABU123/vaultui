import { Button } from "@vault/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  title: "Free Tier/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
  args: {
    children: "Label",
    variant: "primary",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Danger: Story = {
  args: { variant: "danger" },
};

export const WithLeadingIcon: Story = {
  args: {
    variant: "secondary",
    leadingIcon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { docs: { description: { story: "Disabled buttons block all interaction." } } },
};

export const SizeSmall: Story = {
  args: { size: "sm" },
};

export const SizeLarge: Story = {
  args: { size: "lg" },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (StoryComp) => (
      <div className="mx-auto w-full max-w-xs">
        <StoryComp />
      </div>
    ),
  ],
};