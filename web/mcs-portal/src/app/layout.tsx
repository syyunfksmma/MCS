import '../app/globals.css';
import { ReactNode } from 'react';
import MainLayout from '../components/MainLayout';

export const metadata = {
  title: 'MCS Portal',
  description: 'Manufacturing CAM Management System Portal'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
