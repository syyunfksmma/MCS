"use client";

import Link from "next/link";
import { Alert, Button, Card, Result, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

export type VerifyEmailStatus = "pending" | "success" | "expired";

interface VerifyEmailClientProps {
  status: VerifyEmailStatus;
}

export default function VerifyEmailClient({ status }: VerifyEmailClientProps) {
  if (status === "success") {
    return (
      <Result
        status="success"
        title="이메일 인증이 완료되었습니다."
        subTitle="이제 MCMS Explorer 기능을 모두 사용할 수 있습니다."
        extra={[
          <Link key="dashboard" href="/explorer">
            <Button type="primary">Explorer로 이동</Button>
          </Link>
        ]}
      />
    );
  }

  if (status === "expired") {
    return (
      <Result
        status="warning"
        title="Magic Link이 만료되었습니다."
        subTitle="Ops 팀 또는 관리자에게 재인증 요청을 진행해 주세요."
        extra={[
          <Link key="resend" href="/auth/login">
            <Button type="primary">로그인으로 돌아가기</Button>
          </Link>
        ]}
      />
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 py-12">
      <Card className="max-w-lg shadow-md">
        <Title level={3} className="!mb-2">
          이메일 인증이 필요합니다
        </Title>
        <Paragraph type="secondary">
          Magic Link 메일을 열어 &quot;지금 로그인&quot; 버튼을 클릭하면 인증이 완료됩니다.
        </Paragraph>
        <Alert
          type="info"
          message="15분 안에 인증을 완료하지 못한 경우 재전송 요청이 가능합니다."
          showIcon
          className="mb-4"
        />
        <Paragraph className="mb-0 text-sm text-slate-500">
          <Text strong>Tip:</Text> 메일이 보이지 않는다면 스팸함을 확인하거나 Ops 팀에게 재전송을 요청하세요.
        </Paragraph>
        <div className="mt-6 flex justify-end gap-2">
          <Link href="/auth/login">
            <Button>로그인으로 돌아가기</Button>
          </Link>
          <Button type="primary" disabled>
            Magic Link 재전송 (준비 중)
          </Button>
        </div>
      </Card>
    </div>
  );
}
