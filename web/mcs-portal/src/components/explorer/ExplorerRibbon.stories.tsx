import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ExplorerRibbon from './ExplorerRibbon';
import type { ExplorerRouting } from '@/types/explorer';

const mockRouting: ExplorerRouting = {
  id: 'routing-001',
  code: 'R-001',
  status: 'PendingApproval',
  camRevision: 'CAM-5',
  owner: 'operator.one',
  files: []
};

const meta: Meta<typeof ExplorerRibbon> = {
  title: 'Explorer/Ribbon',
  component: ExplorerRibbon,
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    onOpenSelected: action('open-selected'),
    onOpenWizard: action('open-wizard'),
    onShowUploadPanel: action('show-upload'),
    onDownloadSelected: action('download-selected'),
    onShowAddinPanel: action('show-addin')
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '16px', background: '#e2e8f0' }}>
        <Story />
      </div>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ExplorerRibbon>;

export const NoSelection: Story = {
  args: {
    selectedRouting: null
  }
};

export const WithSelection: Story = {
  args: {
    selectedRouting: mockRouting
  }
};

export const ApprovedRouting: Story = {
  args: {
    selectedRouting: {
      ...mockRouting,
      status: 'Approved',
      code: 'R-099'
    }
  }
};
