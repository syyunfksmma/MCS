import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('antd', () => {
  const Button = ({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    'aria-label'?: string;
  }) => (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );

  const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return {
    Button,
    Tooltip
  };
});

import ExplorerRibbon from '@/components/explorer/ExplorerRibbon';
import type { ExplorerRouting } from '@/types/explorer';

const routing: ExplorerRouting = {
  id: 'routing-11',
  code: 'RT-011',
  status: 'Draft',
  camRevision: 'CAM-1',
  owner: 'operator.one',
  files: [],
  sharedDrivePath: '\\shared\routing\RT-011\model.sldasm'
};

describe('ExplorerRibbon', () => {
  it('선택된 Routing이 없으면 주요 액션을 비활성화한다', () => {
    const onOpenSelected = vi.fn();

    render(
      <ExplorerRibbon
        selectedRouting={null}
        canOpenExplorer={true}
        onOpenSelected={onOpenSelected}
        onOpenWizard={vi.fn()}
        onOpenExplorer={vi.fn()}
        onShowUploadPanel={vi.fn()}
        onDownloadSelected={vi.fn()}
        onShowAddinPanel={vi.fn()}
      />
    );

    const openButton = screen.getByRole('button', { name: '선택한 Routing 열기' });
    expect(openButton).toBeDisabled();
  });

  it('Routing 선택 시 모든 콜백을 실행한다', async () => {
    const user = userEvent.setup();
    const onOpenSelected = vi.fn();
    const onOpenWizard = vi.fn();
    const onShowUploadPanel = vi.fn();
    const onDownloadSelected = vi.fn();
    const onShowAddinPanel = vi.fn();
    const onOpenExplorer = vi.fn();

    render(
      <ExplorerRibbon
        selectedRouting={routing}
        canOpenExplorer={true}
        onOpenSelected={onOpenSelected}
        onOpenWizard={onOpenWizard}
        onOpenExplorer={onOpenExplorer}
        onShowUploadPanel={onShowUploadPanel}
        onDownloadSelected={onDownloadSelected}
        onShowAddinPanel={onShowAddinPanel}
      />
    );

    await user.click(screen.getByRole('button', { name: '선택한 Routing 열기' }));
    await user.click(screen.getByRole('button', { name: '새 Routing 만들기' }));
    await user.click(screen.getByRole('button', { name: 'Workspace 업로드로 이동' }));
    await user.click(screen.getByRole('button', { name: 'Routing 다운로드' }));
    await user.click(screen.getByRole('button', { name: 'Add-in 패널로 이동' }));
    await user.click(screen.getByRole('button', { name: 'mcms-explorer 프로토콜로 열기' }));

    expect(onOpenSelected).toHaveBeenCalled();
    expect(onOpenWizard).toHaveBeenCalled();
    expect(onShowUploadPanel).toHaveBeenCalled();
    expect(onDownloadSelected).toHaveBeenCalled();
    expect(onShowAddinPanel).toHaveBeenCalled();
    expect(onOpenExplorer).toHaveBeenCalled();

    expect(
      screen.getByText('선택', { selector: 'span' })
    ).toBeInTheDocument();
    expect(screen.getByText('RT-011')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
});
