import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, Button, Space, Typography } from "antd";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  info?: ErrorInfo;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ info });
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, info: undefined });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <Alert
        type="error"
        message="예상치 못한 오류가 발생했습니다."
        description={
          <Space direction="vertical" size="small">
            <Typography.Text type="secondary">
              다시 시도하거나 Ops 팀에 로그를 전달해 주세요.
            </Typography.Text>
            <Button type="primary" onClick={this.handleRetry}>
              다시 시도
            </Button>
          </Space>
        }
        showIcon
      />
    );
  }
}
