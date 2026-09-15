import { useState } from "react";
import { AlertDialog, Button, Modal } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const BasicModal: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open modal
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Invite a teammate"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Send invite</Button>
            </>
          }
        >
          <p className="m-0 text-sm leading-relaxed text-surface-500">
            They'll get an email with a magic link. No password required.
          </p>
        </Modal>
      </>
    );
  },
};

export const AlertConfirm: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete project
        </Button>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          title="Delete this project?"
          description="This permanently removes the project and all of its data. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Keep it"
        />
      </>
    );
  },
};

export const ConfirmNotDanger: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Approve payment</Button>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
          danger={false}
          title="Approve $490.00?"
          description="The customer will be charged immediately on the next invoice run."
          confirmLabel="Approve"
          cancelLabel="Review later"
        />
      </>
    );
  },
};