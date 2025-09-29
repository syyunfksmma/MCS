"use client";

import { Modal as AntModal, ModalProps as AntModalProps } from "antd";
import { designTokens } from "@/styles/tokens";

export type ModalProps = AntModalProps;

export function Modal(props: ModalProps) {
  return (
    <AntModal
      centered
      maskClosable={false}
      styles={{
        body: {
          padding: designTokens.spacing.lg
        },
        header: {
          padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`
        }
      }}
      {...props}
    />
  );
}
