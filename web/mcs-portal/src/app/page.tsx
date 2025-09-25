'use client';

import Link from 'next/link';
import { Card, Typography, Button, Space } from 'antd';

const { Paragraph, Title } = Typography;

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <Title level={2}>MCMS Portal</Title>
      <Space direction="vertical" size="large" className="w-full">
        <Card bordered>
          <Paragraph>
            Explorer에서 CAM Item/Revision/Routing을 확인하세요.
          </Paragraph>
          <Link href="/explorer">
            <Button type="primary">Explorer 이동</Button>
          </Link>
        </Card>
        <Card bordered>
          <Paragraph>
            품목 라우팅 현황과 SolidWorks 연계를 제품 대시보드에서 확인하세요.
          </Paragraph>
          <Link href="/products">
            <Button type="primary">Product Dashboard 이동</Button>
          </Link>
        </Card>
        <Card bordered>
          <Paragraph>
            운영자 콘솔에서 환경 설정 및 Feature Flag를 관리합니다.
          </Paragraph>
          <Link href="/admin">
            <Button>Admin Console 이동</Button>
          </Link>
        </Card>
      </Space>
    </div>
  );
}
