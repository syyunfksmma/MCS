import type { Meta, StoryObj } from '@storybook/react';
import SearchFilterRail, { type FilterOption } from './SearchFilterRail';

const meta: Meta<typeof SearchFilterRail> = {
  title: 'Explorer/SearchFilterRail',
  component: SearchFilterRail,
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
    disabled: true
  }
};

function buildOptions(values: string[]): FilterOption[] {
  return values.map((value) => ({ label: value, value }));
}
