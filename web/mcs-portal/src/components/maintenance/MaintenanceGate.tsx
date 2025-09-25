'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, Button, Result, Space, Typography } from 'antd';
import {
  getMaintenanceConfig,
  getMaintenanceWindowLabel,
  isMaintenanceActive
} from '@/lib/maintenance';

const STORAGE_KEY = 'mcs-maintenance-override';

interface MaintenanceGateProps {
  children: ReactNode;
}

export default function MaintenanceGate({ children }: MaintenanceGateProps) {
  const [override, setOverride] = useState(false);
  const searchParams = useSearchParams();
  const [forcedActive, setForcedActive] = useState(
    searchParams?.get('maintenance') === 'force'
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setOverride(true);
    }
  }, []);

  useEffect(() => {
    setForcedActive(searchParams?.get('maintenance') === 'force');
  }, [searchParams]);

  const config = getMaintenanceConfig();
  const active = useMemo(
    () => forcedActive || isMaintenanceActive(),
    [forcedActive]
  );

  if (!active || override) {
    return <>{children}</>;
  }

  const windowLabel = getMaintenanceWindowLabel();

  const handleBypass = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    setOverride(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb',
        padding: '48px'
      }}
    >
      <Result
        status="info"
        title={
          <Typography.Title
            level={2}
            role="heading"
            aria-level={2}
            className="!mb-0"
          >
            Scheduled maintenance in progress
          </Typography.Title>
        }
        subTitle={
          windowLabel ??
          'The portal is temporarily unavailable while maintenance is underway.'
        }
        extra={
          <Space>
            <Button type="primary" danger onClick={handleBypass}>
              Temporary override
            </Button>
            {config.contact && (
              <Button href={'mailto:' + config.contact}>
                Contact operations
              </Button>
            )}
          </Space>
        }
      >
        {config.message && (
          <Typography.Paragraph>{config.message}</Typography.Paragraph>
        )}
        <Alert
          type="warning"
          message="Only proceed with override if you are performing validation."
          showIcon
        />
      </Result>
    </div>
  );
}
