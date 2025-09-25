import '../app/globals.css';
import { ReactNode, Suspense } from 'react';
import MainLayout from '../components/MainLayout';
import ReactQueryProvider from '../components/providers/ReactQueryProvider';
import MaintenanceGate from '@/components/maintenance/MaintenanceGate';

export const metadata = {
  title: 'MCS Portal',
  description: 'Manufacturing CAM Management System Portal'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-neutral-900">
        <ReactQueryProvider>
          <Suspense fallback={null}>
            <MaintenanceGate>
              <MainLayout>{children}</MainLayout>
            </MaintenanceGate>
          </Suspense>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
