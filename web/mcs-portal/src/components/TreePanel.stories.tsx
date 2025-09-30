import type { Meta, StoryObj } from '@storybook/react';
import TreePanel from './TreePanel';
import type { ExplorerItem } from '@/types/explorer';

const sampleItems: ExplorerItem[] = [
  {
    id: 'item-1',
    code: 'ITEM-001',
    name: 'Impeller Assembly',
    revisions: [
      {
        id: 'rev-1',
        code: 'A',
        routingGroups: [
          {
            id: 'group-1',
            name: 'Roughing',
            displayOrder: 0,
            routings: [
              {
                id: 'routing-1',
                code: 'RT-001',
                status: 'Approved',
                camRevision: 'CAM-A',
                files: [
                  { id: 'file-1', name: 'rt-001.esprit', type: 'esprit' },
                  { id: 'file-2', name: 'rt-001.nc', type: 'nc' }
                ]
              },
              {
                id: 'routing-2',
                code: 'RT-002',
                status: 'PendingApproval',
                camRevision: 'CAM-B',
                files: [{ id: 'file-3', name: 'rt-002.esprit', type: 'esprit' }]
              }
            ]
          },
          {
            id: 'group-2',
            name: 'Finishing',
            displayOrder: 1,
            routings: [
              {
                id: 'routing-3',
                code: 'RT-003',
                status: 'Draft',
                camRevision: 'CAM-C',
                files: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'item-2',
    code: 'ITEM-002',
    name: 'Valve Body',
    revisions: [
      {
        id: 'rev-2',
        code: 'B',
        routingGroups: [
          {
            id: 'group-3',
            name: 'Prototype',
            isDeleted: true,
            displayOrder: 0,
            routings: [
              {
                id: 'routing-4',
                code: 'RT-004',
                status: 'Rejected',
                camRevision: 'CAM-D',
                files: []
              }
            ]
          }
        ]
      }
    ]
  }
];

const meta: Meta<typeof TreePanel> = {
  title: 'Explorer/TreePanel',
  component: TreePanel,
  args: {
    items: sampleItems
  },
  parameters: {
    layout: 'centered'
  }
};

export default meta;

type Story = StoryObj<typeof TreePanel>;

export const Default: Story = {
  args: {
    onSelect: (key) => {
      // eslint-disable-next-line no-console
      console.log('selected', key);
    }
  }
};

export const WithSelection: Story = {
  args: {
    selectedKey: 'routing-2'
  }
};
