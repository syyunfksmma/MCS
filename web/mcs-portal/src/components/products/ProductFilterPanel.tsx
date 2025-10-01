import { Divider, Typography, Checkbox } from "antd";
import type { CheckboxOptionType } from "antd/es/checkbox";

const { Title, Text } = Typography;

interface FilterGroup {
  title: string;
  options: CheckboxOptionType[];
}

// NOTE: Static filter metadata keeps Sprint 5 scope focused on styling; actual filtering arrives with FR-9.
const FILTER_GROUPS: FilterGroup[] = [
  {
    title: "Category",
    options: [
      { label: "Parts", value: "parts" },
      { label: "Documents", value: "documents" },
      { label: "Changes", value: "changes" }
    ]
  },
  {
    title: "Release Status",
    options: [
      { label: "Approved", value: "approved" },
      { label: "In Work", value: "inWork" },
      { label: "Obsolete", value: "obsolete" }
    ]
  },
  {
    title: "SolidWorks",
    options: [
      { label: "3DM Linked", value: "linked" },
      { label: "Missing 3DM", value: "missing" },
      { label: "Unknown", value: "unknown", disabled: true }
    ]
  }
];

export default function ProductFilterPanel() {
  return (
    <aside className="flex w-64 flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <header>
        <Title level={4} className="!mb-1 text-sky-900">
          Filters
        </Title>
        <Text type="secondary">
          Benchmarks Teamcenter left rail styling; functionality lands with FR-9.
        </Text>
      </header>
      {FILTER_GROUPS.map((group) => (
        <section key={group.title}>
          <Divider orientation="left" plain className="!mt-0 !mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {group.title}
            </span>
          </Divider>
          <Checkbox.Group className="flex flex-col gap-2" options={group.options} disabled />
        </section>
      ))}
    </aside>
  );
}
