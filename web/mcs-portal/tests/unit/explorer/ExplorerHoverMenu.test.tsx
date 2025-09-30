import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('antd', () => {
  const Button = ({
    children,
    onClick,
    disabled,
    'aria-disabled': ariaDisabled,
    'aria-label': ariaLabel,
    role
  }: {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    'aria-disabled'?: boolean;
    'aria-label'?: string;
    role?: string;
  }) => (
    <button
      type="button"
      onClick={onClick as never}
      disabled={disabled}
      aria-disabled={ariaDisabled}
      aria-label={ariaLabel}
      role={role}
    >
      {children}
    </button>
  );

  const Space = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  const Typography = {
    Text: ({ children, strong, type }: { children: React.ReactNode; strong?: boolean; type?: string }) => (
      <span data-strong={strong} data-type={type}>{children}</span>
    )
  };

  return {
    Button,
    Space,
    Tooltip,
    Typography
  };
});

vi.mock('@ant-design/icons', () => ({
  EyeOutlined: () => <span>eye</span>,
  UploadOutlined: () => <span>upload</span>,
  CheckCircleOutlined: () => <span>approve</span>,
  PushpinOutlined: () => <span>pin</span>,
  PushpinFilled: () => <span>pin-filled</span>,
  ClockCircleOutlined: () => <span>clock</span>
}));

import ExplorerHoverMenu from '@/components/explorer/ExplorerHoverMenu';
import type { HoverMenuContext } from '@/hooks/useHoverMenu';

describe('ExplorerHoverMenu', () => {
  const baseContext: HoverMenuContext = {
    routingId: 'routing-1',
    routingCode: 'R-001',
    status: 'PendingApproval',
    origin: 'search',
    anchorRect: new DOMRect(10, 10, 40, 20),
    canApprove: true
  };

  const createHandlers = () => ({
    onClose: vi.fn(),
    cancelClose: vi.fn(),
    scheduleClose: vi.fn(),
    onViewDetail: vi.fn(),
    onOpenUploads: vi.fn(),
    onApprove: vi.fn(),
    onPinToggle: vi.fn()
  });

  it('액션 버튼을 통해 핸들러와 닫기 이벤트를 호출한다', async () => {
    const user = userEvent.setup();
    const handlers = createHandlers();

    render(
      <ExplorerHoverMenu
        context={{ ...baseContext, isPinned: false }}
        {...handlers}
      />
    );

    await user.click(screen.getByRole('menuitem', { name: 'View Detail' }));
    await user.click(screen.getByRole('menuitem', { name: 'Open Uploads' }));
    await user.click(screen.getByRole('menuitem', { name: 'Approve' }));
    await user.click(screen.getByRole('menuitem', { name: 'Pin' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(handlers.onViewDetail).toHaveBeenCalledWith('routing-1');
    expect(handlers.onOpenUploads).toHaveBeenCalledWith('routing-1');
    expect(handlers.onApprove).toHaveBeenCalledWith('routing-1');
    expect(handlers.onPinToggle).toHaveBeenCalledWith('routing-1', true);
    expect(handlers.onClose).toHaveBeenCalledTimes(5);
  });

  it('승인 비활성화 및 고정 상태를 렌더링한다', () => {
    const handlers = createHandlers();

    render(
      <ExplorerHoverMenu
        context={{
          ...baseContext,
          canApprove: false,
          isPinned: true,
          slaBreached: true,
          breachMs: 520,
          addinJobStatus: 'queued'
        }}
        {...handlers}
      />
    );

    const approveButton = screen.getByRole('menuitem', { name: 'Approve' });
    expect(approveButton).toHaveAttribute('aria-disabled', 'true');
    expect(approveButton).toBeDisabled();
    expect(screen.getByText('Pinned')).toBeInTheDocument();
    expect(screen.getByText(/SLA \+520 ms/i)).toBeInTheDocument();
    expect(screen.getByText(/queued/i)).toBeInTheDocument();
  });
});
