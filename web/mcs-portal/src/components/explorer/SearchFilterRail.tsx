import { Button, Select, Space } from 'antd';
import type { SelectProps } from 'antd';

export interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterRailProps {
  productOptions: FilterOption[];
  groupOptions: FilterOption[];
  statusOptions: FilterOption[];
  productValue?: string;
  groupValue?: string;
  statusValue?: string;
  disabled?: boolean;
  onProductChange?: SelectProps['onChange'];
  onGroupChange?: SelectProps['onChange'];
  onStatusChange?: SelectProps['onChange'];
  onReset?: () => void;
}

export default function SearchFilterRail({
  productOptions,
  groupOptions,
  statusOptions,
  productValue,
  groupValue,
  statusValue,
  disabled = false,
  onProductChange,
  onGroupChange,
  onStatusChange,
  onReset
}: SearchFilterRailProps) {
  return (
    <Space
      wrap
      className="mb-2"
      role="group"
      aria-label="검색 결과 필터"
    >
      <Select
        allowClear
        placeholder="제품 코드"
        options={productOptions}
        value={productValue}
        onChange={onProductChange}
        style={{ minWidth: 176 }}
        disabled={disabled}
        aria-label="제품 코드 필터"
      />
      <Select
        allowClear
        placeholder="Routing 그룹"
        options={groupOptions}
        value={groupValue}
        onChange={onGroupChange}
        style={{ minWidth: 176 }}
        disabled={disabled}
        aria-label="Routing 그룹 필터"
      />
      <Select
        allowClear
        placeholder="상태"
        options={statusOptions}
        value={statusValue}
        onChange={onStatusChange}
        style={{ minWidth: 160 }}
        disabled={disabled}
        aria-label="상태 필터"
      />
      <Button onClick={onReset} disabled={disabled} aria-label="필터 초기화">
        필터 초기화
      </Button>
    </Space>
  );
}
