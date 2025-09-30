import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('antd', () => {
  const Select = ({
    'aria-label': ariaLabel,
    options = [],
    disabled,
    value,
    onChange,
    placeholder
  }: {
    'aria-label'?: string;
    options?: Array<{ label: string; value: string }>;
    disabled?: boolean;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
  }) => (
    <select
      aria-label={ariaLabel}
      disabled={disabled}
      data-placeholder={placeholder}
      value={value ?? ''}
      onChange={(event) => onChange?.(event.target.value)}
    >
      <option value="">선택</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const Button = ({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
    type
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    'aria-label'?: string;
    type?: 'text' | 'default';
  }) => (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel} data-type={type}>
      {children}
    </button>
  );

  const Space = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  return {
    Select,
    Button,
    Space
  };
});

import SearchFilterRail from '@/components/explorer/SearchFilterRail';

const OPTIONS = [
  { label: '옵션1', value: 'opt-1' },
  { label: '옵션2', value: 'opt-2' }
];

describe('SearchFilterRail', () => {
  it('콜백을 통해 필터와 초기화 이벤트를 전달한다', async () => {
    const user = userEvent.setup();
    const onProductChange = vi.fn();
    const onGroupChange = vi.fn();
    const onStatusChange = vi.fn();
    const onReset = vi.fn();

    render(
      <SearchFilterRail
        productOptions={OPTIONS}
        groupOptions={OPTIONS}
        statusOptions={OPTIONS}
        onProductChange={onProductChange}
        onGroupChange={onGroupChange}
        onStatusChange={onStatusChange}
        onReset={onReset}
      />
    );

    expect(
      screen.getByRole('region', { name: '탐색 필터' })
    ).toBeInTheDocument();

    await user.selectOptions(
      screen.getByLabelText('제품 코드 필터') as HTMLSelectElement,
      'opt-2'
    );

    await user.selectOptions(
      screen.getByLabelText('Routing 그룹 필터') as HTMLSelectElement,
      'opt-1'
    );

    await user.selectOptions(
      screen.getByLabelText('상태 필터') as HTMLSelectElement,
      'opt-2'
    );

    await user.click(screen.getByRole('button', { name: '필터 초기화' }));

    expect(onProductChange).toHaveBeenCalledWith('opt-2');
    expect(onGroupChange).toHaveBeenCalledWith('opt-1');
    expect(onStatusChange).toHaveBeenCalledWith('opt-2');
    expect(onReset).toHaveBeenCalled();
  });

  it('disabled=true일 때 모든 컨트롤을 비활성화한다', () => {
    render(
      <SearchFilterRail
        productOptions={OPTIONS}
        groupOptions={OPTIONS}
        statusOptions={OPTIONS}
        disabled
        onReset={() => undefined}
      />
    );

    expect(screen.getByRole('button', { name: '필터 초기화' })).toBeDisabled();
    expect(screen.getByLabelText('제품 코드 필터')).toBeDisabled();
    expect(screen.getByLabelText('Routing 그룹 필터')).toBeDisabled();
    expect(screen.getByLabelText('상태 필터')).toBeDisabled();
  });
});
