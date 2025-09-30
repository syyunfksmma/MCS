import { Badge, Button, Checkbox, Input, Space, Switch, Tag, Typography } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useMemo } from 'react';
import styles from './SearchFilterRail.module.css';

export interface FilterOption {
  label: string;
  value: string;
}

export interface SlaBadgeValue {
  value: number;
  target: number;
}

interface SearchFilterRailProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  statusOptions: FilterOption[];
  revisionOptions: FilterOption[];
  ownerOptions: FilterOption[];
  selectedStatuses: string[];
  selectedRevisions: string[];
  selectedOwners: string[];
  recentOnly: boolean;
  slaOnly: boolean;
  slaBadge?: SlaBadgeValue | null;
  disabled?: boolean;
  onStatusesChange: (next: string[]) => void;
  onRevisionsChange: (next: string[]) => void;
  onOwnersChange: (next: string[]) => void;
  onToggleRecent: (next: boolean) => void;
  onToggleSla: (next: boolean) => void;
  onReset?: () => void;
}

const { Title, Text } = Typography;

function renderOptions(options: FilterOption[]) {
  return options.map((option) => ({
    label: option.label,
    value: option.value
  }));
}

export default function SearchFilterRail({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  statusOptions,
  revisionOptions,
  ownerOptions,
  selectedStatuses,
  selectedRevisions,
  selectedOwners,
  recentOnly,
  slaOnly,
  slaBadge,
  disabled = false,
  onStatusesChange,
  onRevisionsChange,
  onOwnersChange,
  onToggleRecent,
  onToggleSla,
  onReset
}: SearchFilterRailProps) {
  const statusItems = useMemo(() => renderOptions(statusOptions), [statusOptions]);
  const revisionItems = useMemo(() => renderOptions(revisionOptions), [revisionOptions]);
  const ownerItems = useMemo(() => renderOptions(ownerOptions), [ownerOptions]);

  const badgeStatus = useMemo(() => {
    if (!slaBadge) return undefined;
    return slaBadge.value > slaBadge.target ? 'error' : 'success';
  }, [slaBadge]);

  const handleStatusChange = (values: CheckboxValueType[]) =>
    onStatusesChange(values.map(String));

  const handleRevisionChange = (values: CheckboxValueType[]) =>
    onRevisionsChange(values.map(String));

  const handleOwnerChange = (values: CheckboxValueType[]) =>
    onOwnersChange(values.map(String));

  return (
    <aside
      className={styles.rail}
      role="complementary"
      aria-label="Explorer 필터"
      aria-live="polite"
    >
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Title level={5} className={styles.title}>
            Filter Rail
          </Title>
          {slaBadge ? (
            <Badge
              status={badgeStatus}
              text={SLA  /  ms}
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

      <section className={styles.section} aria-label="검색">
        <label htmlFor="explorer-filter-search" className={styles.sectionLabel}>
          검색
        </label>
        <Input.Search
          id="explorer-filter-search"
          placeholder="Routing 코드, 제품, 상태 검색"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          onSearch={onSearchSubmit}
          enterButton
          allowClear
          disabled={disabled}
          aria-describedby={slaBadge ? 'explorer-filter-sla-help' : undefined}
        />
        {slaBadge ? (
          <Text id="explorer-filter-sla-help" type="secondary" className={styles.helper}>
            목표 대비 {Math.round((slaBadge.value / Math.max(slaBadge.target, 1)) * 100)}%
          </Text>
        ) : null}
      </section>

      <section className={styles.section} aria-label="Routing 상태 필터">
        <span className={styles.sectionLabel}>상태</span>
        <Checkbox.Group
          options={statusItems}
          value={selectedStatuses}
          onChange={handleStatusChange}
          disabled={disabled}
        />
      </section>

      <section className={styles.section} aria-label="CAM Revision 필터">
        <span className={styles.sectionLabel}>CAM Revision</span>
        <Checkbox.Group
          options={revisionItems}
          value={selectedRevisions}
          onChange={handleRevisionChange}
          disabled={disabled}
        />
      </section>

      <section className={styles.section} aria-label="Owner 필터">
        <span className={styles.sectionLabel}>Owner</span>
        <Checkbox.Group
          options={ownerItems}
          value={selectedOwners}
          onChange={handleOwnerChange}
          disabled={disabled}
        />
      </section>

      <section className={styles.section} aria-label="빠른 동작">
        <span className={styles.sectionLabel}>Quick Actions</span>
        <Space direction="vertical" className={styles.quickActions}>
          <label className={styles.toggleRow}>
            <Switch
              checked={recentOnly}
              onChange={onToggleRecent}
              disabled={disabled}
              aria-label="최근 본 Routing만 보기"
            />
            <span>최근 본 Routing만 보기</span>
          </label>
          <label className={styles.toggleRow}>
            <Switch
              checked={slaOnly}
              onChange={onToggleSla}
              disabled={disabled}
              aria-label="SLA 초과 Routing만 보기"
            />
            <span>SLA 초과만 보기</span>
          </label>
        </Space>
      </section>

      <footer className={styles.footer}>
        <Tag color="default">필터 {selectedStatuses.length + selectedRevisions.length + selectedOwners.length}</Tag>
      </footer>
    </aside>
  );
}
