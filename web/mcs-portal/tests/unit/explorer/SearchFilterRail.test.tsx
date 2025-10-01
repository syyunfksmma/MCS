import React from 'react';
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
      aria-label={ariaLabel ?? placeholder ?? 'select'}
      disabled={disabled}
      value={value ?? ''}
      onChange={(event) => onChange?.(event.target.value)}
    >
      <option value="">{placeholder ?? '선택'}</option>
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

  const Badge = ({ text }: { text?: React.ReactNode }) => <span>{text}</span>;

  const Switch = ({
    checked,
    onChange,
    disabled,
    'aria-label': ariaLabel
  }: {
    checked?: boolean;
    onChange?: (next: boolean) => void;
    disabled?: boolean;
    'aria-label'?: string;
  }) => (
    <input
      type="checkbox"
      role="switch"
      aria-label={ariaLabel}
      checked={checked ?? false}
      disabled={disabled}
      onChange={(event) => onChange?.(event.target.checked)}
    />
  );

  const Tag = ({ children }: { children: React.ReactNode }) => <span>{children}</span>;

  const Typography = {
    Title: ({ children }: { children: React.ReactNode }) => <h5>{children}</h5>,
    Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
  };

  const Input = ({
    value,
    onChange,
    placeholder,
    id,
    disabled,
    ...rest
  }: {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    id?: string;
    disabled?: boolean;
  }) => (
    <input
      id={id}
      value={value ?? ''}
      onChange={(event) => onChange?.(event)}
      placeholder={placeholder}
      disabled={disabled}
      {...rest}
    />
  );

  Input.Search = ({
    value,
    onChange,
    onSearch,
    placeholder,
    allowClear,
    id,
    disabled,
    'aria-describedby': ariaDescribedBy,
    enterButton
  }: {
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    allowClear?: boolean;
    id?: string;
    disabled?: boolean;
    'aria-describedby'?: string;
    enterButton?: React.ReactNode;
  }) => (
    <div>
      <input
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange?.(event)}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
      />
      <button type="button" onClick={() => onSearch?.(value ?? '')} disabled={disabled}>
        {enterButton ?? 'Search'}
      </button>
      {allowClear ? (
        <button type="button" onClick={() => onChange?.({ target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>)}>
          Clear
        </button>
      ) : null}
    </div>
  );

  return {
    Select,
    Button,
    Space,
    Badge,
    Switch,
    Tag,
    Typography,
    Input
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
      screen.getByRole('complementary', { name: 'Explorer 필터' })
    ).toBeInTheDocument();

    const productSelect = screen.getByRole('combobox', { name: '제품 코드 필터' });
    const groupSelect = screen.getByRole('combobox', { name: 'Routing 그룹 필터' });
    const statusSelect = screen.getByRole('combobox', { name: '상태 필터' });

    await user.selectOptions(productSelect as HTMLSelectElement, 'opt-2');
    await user.selectOptions(groupSelect as HTMLSelectElement, 'opt-1');
    await user.selectOptions(statusSelect as HTMLSelectElement, 'opt-2');


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
    expect(screen.getByRole('combobox', { name: '제품 코드 필터' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Routing 그룹 필터' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: '상태 필터' })).toBeDisabled();
  });
});
