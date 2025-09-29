"use client";

import { useEffect, useState } from "react";
import { Alert } from "antd";

export default function NetworkBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <Alert
      type="warning"
      message="네트워크 연결이 끊어졌습니다. 재연결을 시도하는 중입니다."
      showIcon
      banner
    />
  );
}
