import { Button, ToastProvider, useToast } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Components/Toast",
};

export default meta;

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={() => toast({ title: "Changes saved", description: "Your workspace is up to date." })}>
        Default toast
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Deploy complete", variant: "success", description: "production is live." })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "Payment failed", variant: "error", description: "Card was declined." })}>
        Error
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: "New in v1.4", variant: "info", description: "Check the changelog." })}>
        Info
      </Button>
    </div>
  );
}

export const Default: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};