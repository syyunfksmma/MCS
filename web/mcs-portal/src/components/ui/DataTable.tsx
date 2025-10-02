"use client";

import { Table, TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { designTokens } from "@/styles/tokens";

export interface DataTableProps<RecordType> extends TableProps<RecordType> {
  columns: ColumnsType<RecordType>;
}

export function DataTable<RecordType extends object>({
  columns,
  pagination,
  style,
  ...props
}: DataTableProps<RecordType>) {
  return (
    <Table<RecordType>
      columns={columns}
      pagination={{
        pageSize: 20,
        showSizeChanger: false,
        ...pagination
      }}
      style={{
        backgroundColor: designTokens.color.surfaceElevated,
        borderRadius: designTokens.radius.md,
        border: `1px solid ${designTokens.color.borderSubtle}`,
        ...style
      }}
      {...props}
    />
  );
}
