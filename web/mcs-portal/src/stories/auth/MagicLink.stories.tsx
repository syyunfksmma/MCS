import type { Meta, StoryObj } from '@storybook/react';

type MagicLinkProps = {
  userDisplayName: string;
  token: string;
  expiresAt: string;
};

const MagicLinkTemplate = ({ userDisplayName, token, expiresAt }: MagicLinkProps) => (
  <div style={{ fontFamily: 'Pretendard, Arial, sans-serif', maxWidth: 480 }}>
    <p>안녕하세요 {userDisplayName} 님,</p>
    <p>MCMS Web Portal 접속을 위해 아래 버튼을 클릭하세요.</p>
    <p>
      <a
        href={`https://mcms.corp/auth/magic?token=${token}`}
        style={{
          background: '#1A6AF4',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: 8,
          textDecoration: 'none',
          display: 'inline-block'
        }}
        aria-label="로그인 링크"
      >
        지금 로그인
      </a>
    </p>
    <p>유효기간: {expiresAt} (15분)</p>
    <p>요청하지 않은 로그인이라면 즉시 Ops 팀에 알려주세요.</p>
  </div>
);

const meta: Meta<typeof MagicLinkTemplate> = {
  title: 'Auth/Magic Link Email',
  component: MagicLinkTemplate,
  argTypes: {
    userDisplayName: { control: 'text' },
    token: { control: 'text' },
    expiresAt: { control: 'text' }
  },
  args: {
    userDisplayName: '홍길동',
    token: 'sample-token-123',
    expiresAt: '2025-09-29T15:30:00+09:00'
  }
};

export default meta;

type Story = StoryObj<typeof MagicLinkTemplate>;

export const Default: Story = {};

export const ExpiringSoon: Story = {
  args: {
    expiresAt: '2025-09-29T15:15:00+09:00'
  }
};
