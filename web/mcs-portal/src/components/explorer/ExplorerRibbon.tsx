import { Button, Tooltip } from 'antd';
import type { ReactNode } from 'react';
import type { ExplorerRouting } from '@/types/explorer';
import styles from './ExplorerRibbon.module.css';

type ClassValue = string | false | null | undefined;

const composeClassNames = (...values: ClassValue[]) =>
  values.filter(Boolean).join(' ');

interface ExplorerRibbonProps {
  selectedRouting: ExplorerRouting | null;
  onOpenSelected: () => void;
  onOpenWizard: () => void;
  onShowUploadPanel: () => void;
  onDownloadSelected: () => void;
  onShowAddinPanel: () => void;
}

export default function ExplorerRibbon({
  selectedRouting,
  onOpenSelected,
  onOpenWizard,
  onShowUploadPanel,
  onDownloadSelected,
  onShowAddinPanel
}: ExplorerRibbonProps) {
  const isRoutingSelected = Boolean(selectedRouting);
  const routingCode = selectedRouting?.code;
  const routingStatus = selectedRouting?.status ?? '대기';

  return (
    <div className={styles.root}>
      <div
        className={styles.groups}
        role="toolbar"
        aria-label="Explorer 작업 리본"
      >
        <ActionGroup label="작업">
          <Button
            type="text"
            className={composeClassNames(
              styles.actionButton,
              isRoutingSelected && styles.actionButtonPrimary
            )}
            disabled={!isRoutingSelected}
            onClick={onOpenSelected}
            aria-label="선택한 Routing 열기"
          >
            {routingCode ? `${routingCode} 열기` : '열기'}
          </Button>
          <Button
            type="text"
            className={composeClassNames(
              styles.actionButton,
              styles.actionButtonPrimary
            )}
            onClick={onOpenWizard}
            aria-label="새 Routing 만들기"
          >
            새 Routing
          </Button>
        </ActionGroup>
        <ActionGroup label="흐름">
          <Button
            type="text"
            className={styles.actionButton}
            onClick={onShowUploadPanel}
            aria-label="Workspace 업로드로 이동"
          >
            Workspace 업로드
          </Button>
          <Tooltip
            title={
              isRoutingSelected
                ? '다운로드 준비'
                : 'Routing 선택 후 이용 가능합니다'
            }
          >
            <Button
              type="text"
              className={styles.actionButton}
              disabled={!isRoutingSelected}
              onClick={onDownloadSelected}
              aria-label="Routing 다운로드"
            >
              다운로드
            </Button>
          </Tooltip>
        </ActionGroup>
        <ActionGroup label="도구">
          <Button
            type="text"
            className={styles.actionButton}
            onClick={onShowAddinPanel}
            aria-label="Add-in 패널로 이동"
          >
            Add-in 콘솔
          </Button>
        </ActionGroup>
      </div>
      <div className={styles.meta} aria-live="polite">
        {isRoutingSelected ? (
          <>
            <span className={styles.metaLabel}>선택</span>
            <span className={styles.metaBadge}>{routingCode}</span>
            <span className={styles.metaStatus}>{routingStatus}</span>
          </>
        ) : (
          <span className={styles.metaPlaceholder}>Routing 미선택</span>
        )}
      </div>
    </div>
  );
}

function ActionGroup({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.group} aria-label={`${label} 그룹`}>
      <span className={styles.groupLabel}>{label}</span>
      <div className={styles.groupActions}>{children}</div>
    </div>
  );
}
