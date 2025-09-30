import type { Meta, StoryObj } from '@storybook/react';
import SearchFilterRail, { type FilterOption } from './SearchFilterRail';

const meta: Meta<typeof SearchFilterRail> = {
  title: 'Explorer/SearchFilterRail',
  component: SearchFilterRail,
  parameters: {
    layout: 'centered'
  },
  args: {
    productOptions: buildOptions(['PRD-001', 'PRD-002']),
    groupOptions: buildOptions(['Main', 'Secondary']),
    statusOptions: buildOptions(['Approved', 'PendingApproval', 'Draft'])
  }
};

export default meta;

type Story = StoryObj<typeof SearchFilterRail>;

export const Default: Story = {
  args: {
    onReset: () => {
      // eslint-disable-next-line no-console
      console.log('reset clicked');
    }
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onReset: undefined
  }
};

export const ScrollableContainer: Story = {
  args: {
    onReset: () => {
      // eslint-disable-next-line no-console
      console.log('reset clicked');
    }
  },
  render: (storyArgs) => (
    <div
      style={{
        maxWidth: 480,
        height: 320,
        overflow: 'auto',
        border: '1px solid #d9dee7',
        padding: 16,
        background: '#ffffff'
      }}
    >
      <div style={{ height: 600 }}>
        <p style={{ marginBottom: 16 }}>Scroll to observe the sticky rail.</p>
        <SearchFilterRail {...storyArgs} />
        <div style={{ height: 400 }} />
      </div>
    </div>
  )
};

function buildOptions(values: string[]): FilterOption[] {
  return values.map((value) => ({ label: value, value }));
}
