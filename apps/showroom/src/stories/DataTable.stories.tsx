import { DataTable, type TableColumn } from "@vaultui/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
};

export default meta;
type Story = StoryObj<typeof DataTable>;

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: string;
  [key: string]: unknown;
}

const columns: TableColumn<Invoice>[] = [
  { key: "id", label: "Invoice" },
  { key: "customer", label: "Customer" },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    align: "right",
    render: (row) => `$${row.amount.toLocaleString()}`,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={
          row.status === "Paid"
            ? "inline-flex rounded-full bg-success-50 px-2 py-0.5 text-xs font-medium text-success-700"
            : row.status === "Pending"
              ? "inline-flex rounded-full bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-800"
              : "inline-flex rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-700"
        }
      >
        {row.status}
      </span>
    ),
  },
];

const rows: Invoice[] = [
  { id: "INV-1042", customer: "Acme Corp", amount: 4200, status: "Paid" },
  { id: "INV-1043", customer: "Northwind", amount: 1800, status: "Pending" },
  { id: "INV-1044", customer: "Globex", amount: 960, status: "Paid" },
  { id: "INV-1045", customer: "Initech", amount: 5120, status: "Draft" },
  { id: "INV-1046", customer: "Umbrella", amount: 2400, status: "Paid" },
  { id: "INV-1047", customer: "Stark Industries", amount: 7800, status: "Pending" },
  { id: "INV-1048", customer: "Wayne Enterprises", amount: 3300, status: "Paid" },
  { id: "INV-1049", customer: "Hooli", amount: 640, status: "Draft" },
  { id: "INV-1050", customer: "Pied Piper", amount: 1180, status: "Paid" },
  { id: "INV-1051", customer: "Aperture Science", amount: 3950, status: "Pending" },
  { id: "INV-1052", customer: "Cyberdyne", amount: 4550, status: "Paid" },
];

export const Default: Story = {
  render: (args) => <DataTable columns={columns} rows={rows} pageSize={8} />,
};

export const NoPagination: Story = {
  render: (args) => <DataTable columns={columns} rows={rows.slice(0, 3)} pageSize={0} />,
};

export const Empty: Story = {
  render: (args) => <DataTable columns={columns} rows={[]} empty="Nothing here yet." />,
};