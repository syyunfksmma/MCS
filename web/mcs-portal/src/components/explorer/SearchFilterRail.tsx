import { Button, Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import styles from './SearchFilterRail.module.css';

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
    <div
      className={styles.rail}
      role="region"
      aria-label="탐색 필터"
      aria-live="polite"
    >
      <div className={styles.header}>
        <span className={styles.title}>Filters</span>
        {onReset ? (
          <Button
            type="text"
            size="small"
            onClick={onReset}
            disabled={disabled}
            aria-label="필터 초기화"
            className={styles.resetButton}
          >
            필터 초기화
          </Button>
        ) : null}
      </div>
      <Space
        wrap
        className={styles.options}
        role="group"
        aria-label="검색 조건 선택"
      >
        <Select
          allowClear
          placeholder="제품 코드"
          options={productOptions}
          value={productValue}
          onChange={onProductChange}
          disabled={disabled}
          aria-label="제품 코드 필터"
        />
        <Select
          allowClear
          placeholder="Routing 그룹"
          options={groupOptions}
          value={groupValue}
          onChange={onGroupChange}
          disabled={disabled}
          aria-label="Routing 그룹 필터"
        />
        <Select
          allowClear
          placeholder="상태"
          options={statusOptions}
          value={statusValue}
          onChange={onStatusChange}
          disabled={disabled}
          aria-label="상태 필터"
        />
      </Space>
    </div>
  );
}
