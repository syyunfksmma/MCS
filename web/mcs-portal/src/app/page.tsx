import Link from 'next/link';
import { Card, Typography, Button } from 'antd';

const { Paragraph, Title } = Typography;

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <Title level={2}>MCMS Portal</Title>
      <Card bordered>
        <Paragraph>Explorer에서 CAM Item/Revision/Routing을 관리하세요.</Paragraph>
        <Link href="/explorer">
          <Button type="primary">Explorer 열기</Button>
        </Link>
      </Card>
    </div>
  );
}
