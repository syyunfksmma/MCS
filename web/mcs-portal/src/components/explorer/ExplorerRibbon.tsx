import { Button, Card, Divider, Space, Tooltip } from 'antd';
import type { ExplorerRouting } from '@/types/explorer';

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

  return (
    <Card title="Explorer Ribbon" bordered>
      <Space size="large" className="flex flex-wrap" role="toolbar" aria-label="Explorer 작업 리본">
        <ActionGroup label="작업">
          <Button type="link" disabled={!isRoutingSelected} onClick={onOpenSelected} aria-label="선택한 Routing 열기">
            {routingCode ? `${routingCode} 열기` : '열기'}
          </Button>
          <Button type="link" onClick={onOpenWizard} aria-label="Routing 생성 마법사 열기">
            새 Routing
          </Button>
        </ActionGroup>
        <Divider type="vertical" />
        <ActionGroup label="배포">
          <Button type="link" onClick={onShowUploadPanel} aria-label="Workspace 업로드 패널로 이동">
            Workspace 업로드
          </Button>
          <Tooltip title={isRoutingSelected ? '다운로드 준비 중' : 'Routing 선택 후 사용 가능'}>
            <Button type="link" disabled={!isRoutingSelected} onClick={onDownloadSelected} aria-label="Routing 다운로드">
              다운로드
            </Button>
          </Tooltip>
        </ActionGroup>
        <Divider type="vertical" />
        <ActionGroup label="관리">
          <Button type="link" onClick={onShowAddinPanel} aria-label="Add-in 상태 패널 보기">
            Add-in 상태
          </Button>
        </ActionGroup>
      </Space>
    </Card>
  );
}

function ActionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2" aria-label={`${label} 그룹`}>
      <span className="text-xs text-gray-500">{label}</span>
      <Space size="small">{children}</Space>
    </div>
  );
}
