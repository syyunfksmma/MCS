import { Badge, Button, Input, Select, Space, Switch, Tag, Typography } from "antd";
import { useMemo } from "react";
import styles from "./SearchFilterRail.module.css";

export interface FilterOption {
  label: string;
  value: string;
}

export interface SlaBadgeValue {
  value: number;
  target: number;
}

interface SearchFilterRailProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  productOptions: FilterOption[];
  groupOptions: FilterOption[];
  statusOptions: FilterOption[];
  productValue?: string;
  groupValue?: string;
  statusValue?: string;
  recentOnly?: boolean;
  slaOnly?: boolean;
  slaBadge?: SlaBadgeValue | null;
  disabled?: boolean;
  onProductChange: (value: string | undefined) => void;
  onGroupChange: (value: string | undefined) => void;
  onStatusChange: (value: string | undefined) => void;
  onToggleRecent?: (next: boolean) => void;
  onToggleSla?: (next: boolean) => void;
  onReset?: () => void;
}

const { Title, Text } = Typography;

function toSelectOptions(options: FilterOption[]) {
  return options.map((option) => ({ label: option.label, value: option.value }));
}

export default function SearchFilterRail({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  productOptions,
  groupOptions,
  statusOptions,
  productValue,
  groupValue,
  statusValue,
  recentOnly,
  slaOnly,
  slaBadge,
  disabled = false,
  onProductChange,
  onGroupChange,
  onStatusChange,
  onToggleRecent,
  onToggleSla,
  onReset
}: SearchFilterRailProps) {
  const productSelectItems = useMemo(() => toSelectOptions(productOptions), [productOptions]);
  const groupSelectItems = useMemo(() => toSelectOptions(groupOptions), [groupOptions]);
  const statusSelectItems = useMemo(() => toSelectOptions(statusOptions), [statusOptions]);

  const badgeStatus = useMemo(() => {
    if (!slaBadge) return undefined;
    return slaBadge.value > slaBadge.target ? "error" : "success";
  }, [slaBadge]);

  const effectiveRecentOnly = recentOnly ?? false;
  const effectiveSlaOnly = slaOnly ?? false;
  const activeFilterCount = [productValue, groupValue, statusValue].filter(Boolean).length;

  return (
    <aside className={styles.rail} role="complementary" aria-label="Explorer 필터" aria-live="polite">
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Title level={5} className={styles.title}>
            Filter Rail
          </Title>
          {slaBadge ? (
            <Badge
              status={badgeStatus}
              text={`SLA ${slaBadge.value} / ${slaBadge.target} ms`}
              className={styles.slaBadge}
            />
          ) : null}
        </div>
        {onReset ? (
          <Button
            type="text"
            size="small"
            onClick={onReset}
            disabled={disabled}
            aria-label="필터 초기화"
            className={styles.resetButton}
          >
            초기화
          </Button>
        ) : null}
      </header>

      {onSearchChange ? (
        <section className={styles.section} aria-label="검색">
          <label htmlFor="explorer-filter-search" className={styles.sectionLabel}>
            검색
          </label>
          <Input.Search
            id="explorer-filter-search"
            placeholder="Routing 코드, 제품, 상태 검색"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            onSearch={onSearchSubmit}
            enterButton
            allowClear
            disabled={disabled}
            aria-describedby={slaBadge ? "explorer-filter-sla-help" : undefined}
          />
          {slaBadge ? (
            <Text id="explorer-filter-sla-help" type="secondary" className={styles.helper}>
              목표 대비 {Math.round((slaBadge.value / Math.max(slaBadge.target, 1)) * 100)}%
            </Text>
          ) : null}
        </section>
      ) : null}

      <section className={styles.section} aria-label="제품 필터">
        <span className={styles.sectionLabel}>제품</span>
        <Select
          className={styles.select}
          aria-label="제품 코드 필터"
          allowClear
          placeholder="제품 선택"
          options={productSelectItems}
          value={productValue}
          onChange={(value) => onProductChange(value as string | undefined)}
          disabled={disabled}
        />
      </section>

      <section className={styles.section} aria-label="그룹 필터">
        <span className={styles.sectionLabel}>그룹</span>
        <Select
          className={styles.select}
          aria-label="Routing 그룹 필터"
          allowClear
          placeholder="Routing 그룹"
          options={groupSelectItems}
          value={groupValue}
          onChange={(value) => onGroupChange(value as string | undefined)}
          disabled={disabled}
        />
      </section>

      <section className={styles.section} aria-label="상태 필터">
        <span className={styles.sectionLabel}>상태</span>
        <Select
          className={styles.select}
          aria-label="상태 필터"
          allowClear
          placeholder="상태 선택"
          options={statusSelectItems}
          value={statusValue}
          onChange={(value) => onStatusChange(value as string | undefined)}
          disabled={disabled}
        />
      </section>

      <section className={styles.section} aria-label="빠른 동작">
        <span className={styles.sectionLabel}>Quick Actions</span>
        <Space direction="vertical" className={styles.quickActions}>
          <label className={styles.toggleRow}>
            <Switch
              checked={effectiveRecentOnly}
              onChange={(next) => onToggleRecent?.(next)}
              disabled={disabled}
              aria-label="최근 본 Routing만 보기"
            />
            <span>최근 본 Routing만 보기</span>
          </label>
          <label className={styles.toggleRow}>
            <Switch
              checked={effectiveSlaOnly}
              onChange={(next) => onToggleSla?.(next)}
              disabled={disabled}
              aria-label="SLA 초과 Routing만 보기"
            />
            <span>SLA 초과만 보기</span>
          </label>
        </Space>
      </section>

      <footer className={styles.footer}>
        <Tag color="default">필터 {activeFilterCount}</Tag>
      </footer>
    </aside>
  );
}
