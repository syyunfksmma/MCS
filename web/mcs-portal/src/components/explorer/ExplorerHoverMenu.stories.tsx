import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { action } from '@storybook/addon-actions';

import ExplorerHoverMenu from './ExplorerHoverMenu';
import type { HoverMenuContext } from '@/hooks/useHoverMenu';

const meta: Meta<typeof ExplorerHoverMenu> = {
  title: 'Explorer/Hover Menu',
  component: ExplorerHoverMenu,
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

type Story = StoryObj<typeof ExplorerHoverMenu>;

interface DemoProps {
  context: HoverMenuContext;
}

function Demo({ context }: DemoProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect>(() =>
    new DOMRect(240, 160, 220, 48)
  );

  useEffect(() => {
    const node = anchorRef.current;
    if (!node) {
      return;
    }
    const update = () => {
      setAnchorRect(node.getBoundingClientRect());
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div style={{ padding: '120px 80px', minHeight: '480px' }}>
      <div
        ref={anchorRef}
        style={{
          width: 220,
          height: 48,
          border: '1px dashed #94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b'
        }}
      >
        Hover Anchor
      </div>
      <ExplorerHoverMenu
        context={{ ...context, anchorRect }}
        onClose={action('close')}
        cancelClose={() => action('cancel-close')()}
        scheduleClose={() => action('schedule-close')()}
        onViewDetail={action('view-detail')}
        onOpenUploads={action('open-uploads')}
        onApprove={action('approve')}
        onPinToggle={(routingId, nextPinned) =>
          action('pin-toggle')({ routingId, nextPinned })
        }
      />
    </div>
  );
}

export const DraftDefault: Story = {
  render: () => (
    <Demo
      context={{
        routingId: 'routing-001',
        routingCode: 'RT-001',
        status: 'Draft',
        origin: 'search',
        anchorRect: new DOMRect(240, 160, 220, 48),
        canApprove: false,
        isPinned: false
      }}
    />
  )
};

export const PendingWithSla: Story = {
  render: () => (
    <Demo
      context={{
        routingId: 'routing-002',
        routingCode: 'RT-002',
        status: 'PendingApproval',
        origin: 'tree',
        anchorRect: new DOMRect(240, 160, 220, 48),
        canApprove: true,
        slaBreached: true,
        breachMs: 420,
        addinJobStatus: 'queued'
      }}
    />
  )
};

export const PinnedState: Story = {
  render: () => (
    <Demo
      context={{
        routingId: 'routing-003',
        routingCode: 'RT-003',
        status: 'Approved',
        origin: 'search',
        anchorRect: new DOMRect(240, 160, 220, 48),
        canApprove: false,
        isPinned: true
      }}
    />
  )
};
