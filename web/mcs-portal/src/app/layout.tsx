import '../app/globals.css';
import { ReactNode, Suspense } from 'react';
import MainLayout from '../components/MainLayout';
import ReactQueryProvider from '../components/providers/ReactQueryProvider';
import MaintenanceGate from '@/components/maintenance/MaintenanceGate';
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata = {
  title: 'MCS Portal',
  description: 'Manufacturing CAM Management System Portal'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface-canvas text-primary">
        <ReactQueryProvider>
          <Suspense fallback={null}>
            <MaintenanceGate>
              <AuthProvider>
                <MainLayout>{children}</MainLayout>
              </AuthProvider>
            </MaintenanceGate>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
