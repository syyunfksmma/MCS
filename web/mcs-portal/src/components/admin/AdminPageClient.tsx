'use client';

import { Button, Result, Space } from 'antd';
import AdminConsole from '@/components/admin/AdminConsole';
import AdminApiKeysPanel from '@/components/admin/AdminApiKeysPanel';
import AdminFeatureFlagsPanel from '@/components/admin/AdminFeatureFlagsPanel';
import AdminAuditSummaryPanel from '@/components/admin/AdminAuditSummaryPanel';
import AdminAuditLogPanel from '@/components/admin/AdminAuditLogPanel';
import AdminMonitoringPanel from '@/components/admin/AdminMonitoringPanel';
import { useAuth } from '@/hooks/useAuth';

const REQUIRED_ROLES = ['mcms.admin', 'mcms.operations'];

export default function AdminPageClient() {
  const { isAuthenticated, isLoading, roles, signIn, signOut } = useAuth();

  if (isLoading) {
    return null;
  }

  const normalizedRoles = roles.map((role) => role.toLowerCase());
  const hasAccess =
    isAuthenticated && REQUIRED_ROLES.some((role) => normalizedRoles.includes(role));

  if (!hasAccess) {
    return (
      <Result
        status="403"
        title="Insufficient Permissions"
        subTitle="Admin console requires the MCMS.Admin or MCMS.Operations role."
        extra={
          <Space>
            <Button onClick={() => void signOut()}>Switch Account</Button>
            <Button type="primary" onClick={() => void signIn()}>
              Re-authenticate
            </Button>
          </Space>
        }
      />
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <Space direction="vertical" size="large" className="w-full">
        <AdminConsole />
        <AdminApiKeysPanel createdBy="admin.console" />
        <AdminFeatureFlagsPanel />
        <AdminAuditSummaryPanel />
        <AdminAuditLogPanel />
        <AdminMonitoringPanel />
      </Space>
    </section>
  );
}
