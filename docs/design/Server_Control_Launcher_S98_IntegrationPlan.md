# Server Control Launcher S98 Integration & Packaging Plan

## 목표
- UI와 런처 간 통신 규약을 확정하고 배포 전략(EXE/MSIX/Docker)을 비교해 최종 출시 준비를 완료한다.

## UI 통합 아키텍처
- 이벤트 채널: `window.postMessage` → 런처 백엔드 Bridge
- API 계약: `/launcher/start`, `/launcher/stop`, `/launcher/status`
- 에러 코드 표
  | 코드 | 설명 | UI 처리 |
  |---|---|---|
  | L001 | 프로세스 기동 실패 | 토스트 알림 + 재시도 CTA |
  | L002 | 헬스 체크 타임아웃 | 배지 빨간색 전환, 재기동 유도 |
  | L003 | 권한 부족 | 모달 안내 및 관리자 실행 안내 |

## 상태/알림 UX 체크
- [ ] Running: 녹색 배지 + 로그 탭 자동 스크롤
- [ ] Stopped: 회색 배지 + Start CTA 강조
- [ ] Error: 빨간 배지 + 에러 토스트 및 상세 로그 링크
- [ ] Custom URL 저장 시 성공/실패 알림 메시지 정의

## 설정 저장 전략
| 옵션 | 장점 | 단점 | 비고 |
|---|---|---|---|
| `localStorage` | 구현 간단, UI만으로 처리 | 다른 계정에서 공유 불가 | 개발 환경 기본값 |
| `appsettings.local.json` | 런처와 공유 가능 | 파일 쓰기 권한 필요 | 프로덕션 권장 |
| Hybrid | UI/런처 모두 사용 | 동기화 로직 필요 | PoC 후 결정 |

## 배포 옵션 비교
| 방식 | 장점 | 단점 | 메모 |
|---|---|---|---|
| Standalone EXE | 배포 용이, 설치 간단 | 자동 업데이트 부재 | Electron/Squirrel 고려 |
| MSIX | Windows 정책 호환 | 서명/스토어 절차 필요 | 엔터프라이즈 권장 |
| Docker | 환경 일관성 | Windows Desktop 제약 | 내부 테스트용 |

## 테스트 매트릭스
| 테스트 | 도구 | 빈도 | 책임 |
|---|---|---|---|
| Lint | `pnpm lint` | 커밋별 | FE |
| Unit | `pnpm test:unit -- --run` | 일일 | FE |
| E2E | `pnpm test:e2e` | 마일스톤 | QA |
| 런처 스모크 | PowerShell 스크립트 | 빌드 후 | ENG |
| 배포 검증 | Install/Uninstall | 릴리스 전 | OPS |

## 산출물 패키징
- [ ] UI 빌드 산출물(`dist/`)
- [ ] 런처 실행 스크립트 및 설정 파일
- [ ] 배포 노트 및 설치 가이드
- [ ] QA 보고서 및 헬스 체크 로그 스냅샷

## 일정 체크포인트
- [ ] UI/런처 통합 브랜치 머지 준비
- [ ] 배포 옵션 결정 회의(ENG+OPS)
- [ ] QA 드라이런 일정 확정