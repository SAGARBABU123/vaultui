import { GeoMap } from "@vaultui/data-viz";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof GeoMap> = {
  title: "Charts/GeoMap",
  component: GeoMap,
};

export default meta;
type Story = StoryObj<typeof GeoMap>;

export const Global: Story = {
  args: {
    regions: [
      { id: "us", label: "USA", value: 420, x: 24, y: 38 },
      { id: "eu", label: "EU", value: 380, x: 48, y: 32 },
      { id: "in", label: "India", value: 210, x: 62, y: 48 },
      { id: "jp", label: "Japan", value: 140, x: 76, y: 32 },
      { id: "au", label: "Australia", value: 55, x: 78, y: 76 },
      { id: "br", label: "Brazil", value: 90, x: 36, y: 66 },
      { id: "za", label: "South Africa", value: 40, x: 56, y: 74 },
    ],
  },
};

export const Small: Story = {
  args: {
    regions: [
      { id: "a", label: "North", value: 80, x: 30, y: 30 },
      { id: "b", label: "West", value: 55, x: 20, y: 60 },
      { id: "c", label: "East", value: 95, x: 70, y: 40 },
      { id: "d", label: "South", value: 30, x: 60, y: 70 },
    ],
  },
};