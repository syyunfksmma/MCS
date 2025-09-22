import { Space } from 'antd';
import AdminConsole from '@/components/admin/AdminConsole';
import AdminApiKeysPanel from '@/components/admin/AdminApiKeysPanel';
import AdminFeatureFlagsPanel from '@/components/admin/AdminFeatureFlagsPanel';
import AdminAuditSummaryPanel from '@/components/admin/AdminAuditSummaryPanel';
import AdminAuditLogPanel from '@/components/admin/AdminAuditLogPanel';
import AdminMonitoringPanel from '@/components/admin/AdminMonitoringPanel';

export const metadata = {
  title: 'MCMS Admin Console',
  description: 'Unified admin, audit, and monitoring console.'
};

export default function AdminPage() {
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
