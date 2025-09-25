'use client';

import {
  Children,
  CSSProperties,
  isValidElement,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useState
} from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

const visuallyHidden: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px'
};

type OptionEntry = NonNullable<SelectProps['options']>[number];

function extractLabelsFromOptions(options?: SelectProps['options']): string[] {
  if (!options) {
    return [];
  }

  return options
    .map((option) => {
      if (!option) return '';
      if (typeof option === 'string' || typeof option === 'number') {
        return String(option);
      }
      const entry = option as OptionEntry;
      if (typeof entry.label === 'string') {
        return entry.label;
      }
      if (isValidElement(entry.label)) {
        const value = (entry.label.props?.children as unknown) ?? '';
        return typeof value === 'string' ? value : '';
      }
      if (entry.value !== undefined) {
        return String(entry.value);
      }
      return '';
    })
    .filter(Boolean);
}

function extractLabelsFromChildren(children?: ReactNode): string[] {
  const labels: string[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const value = child.props?.children;
    if (typeof value === 'string') {
      labels.push(value);
    }
  });
  return labels;
}

export interface AccessibleSelectProps<ValueType = unknown>
  extends SelectProps<ValueType> {
  labelText?: string;
  optionTextOverride?: string[];
  describedBy?: string;
}

export default function AccessibleSelect<ValueType = unknown>({
  labelText,
  optionTextOverride,
  describedBy,
  id,
  options,
  children,
  onDropdownVisibleChange,
  ...rest
}: AccessibleSelectProps<ValueType>) {
  const generatedId = useId();
  const controlId = id ?? `accessible-select-${generatedId}`;
  const listboxId = `${controlId}_list`;
  const [expanded, setExpanded] = useState(false);

  const mergedOptionLabels = useMemo(() => {
    if (optionTextOverride && optionTextOverride.length > 0) {
      return optionTextOverride.filter(Boolean);
    }
    const labelsFromOptions = extractLabelsFromOptions(options);
    if (labelsFromOptions.length > 0) {
      return labelsFromOptions;
    }
    return extractLabelsFromChildren(children);
  }, [optionTextOverride, options, children]);

  const handleVisibilityChange = (visible: boolean) => {
    setExpanded(visible);
    onDropdownVisibleChange?.(visible);
  };

  useEffect(() => {
    const input = document.getElementById(controlId);
    if (input) {
      input.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
  }, [controlId, expanded]);

  const restWithAria = rest as SelectProps<ValueType> & Record<string, unknown>;
  const labelledById = labelText
    ? `${controlId}-label`
    : (restWithAria['aria-labelledby'] as string | undefined);
  const describedById =
    describedBy ?? (restWithAria['aria-describedby'] as string | undefined);
  const ariaLabel = labelText
    ? undefined
    : (restWithAria['aria-label'] as string | undefined);

  const selectProps: SelectProps<ValueType> & Record<string, unknown> = {
    ...rest,
    id: controlId,
    options,
    onDropdownVisibleChange: handleVisibilityChange
  };

  selectProps['aria-controls'] = listboxId;
  selectProps['aria-haspopup'] = 'listbox';

  if (labelledById) {
    selectProps['aria-labelledby'] = labelledById;
  } else if (ariaLabel) {
    selectProps['aria-label'] = ariaLabel;
  } else if (!labelText) {
    selectProps['aria-label'] = '선택';
  }

  if (describedById) {
    selectProps['aria-describedby'] = describedById;
  }

  return (
    <div style={{ position: 'relative' }}>
      {labelText ? (
        <span id={`${controlId}-label`} style={visuallyHidden}>
          {labelText}
        </span>
      ) : null}
      <Select<ValueType> {...selectProps}>{children}</Select>
      <ul
        id={listboxId}
        role="listbox"
        aria-hidden="true"
        style={visuallyHidden}
      >
        {mergedOptionLabels.map((text, index) => (
          <li
            key={index}
            id={`${listboxId}_${index}`}
            role="option"
            aria-selected={index === 0}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
