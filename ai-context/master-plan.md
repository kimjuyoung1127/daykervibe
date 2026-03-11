# Expedition Hub Master Plan

기준일: 2026-03-11 (KST)
프로젝트: Expedition Hub 해커톤 운영 포털

## 1) 현재 상태

- 핵심 6개 라우트 구현 완료
- 공개 포털 흐름 구현 완료
- `/camp?hackathon=:slug` 해커톤 스코프 흐름 구현 완료
- `/camp` 생성/수정 폼 정합성 보강 완료:
  - `isOpen` 직접 입력
  - 커스텀 팀 전용 수정
  - 커스텀 팀 전용 모집 마감
- `/war-room/:teamId` 작전실 진입 흐름 구현 완료
- `/war-room/:teamId` 내부 기능 구현 완료:
  - 베이스캠프
  - 제출 단계 스테퍼
  - 워크플로우 보드
  - 체크리스트
  - 팀 메모
  - 링크 관리
  - 데스크톱 drag-and-drop
  - 모바일 move controls
  - TEAM MEMBERS 역할 칩 (roleLabel, team-local only)
- 반응형 1차 QA 및 수정 완료
- 공개/팀 로컬 프라이버시 경계 검증 완료
- 핵심 6개 라우트 공통 상태 UI 정합성 보강 완료:
  - loading
  - empty
  - error
- 데스크톱 수동 drag sanity pass 완료
- 에셋 로딩 최적화 완료:
  - 이미지 webp 파생본 + responsive sizes
  - 폰트 woff2 전환, DungGeunMo preload 제거
  - 상세 배너 thumbnailUrl 동적 정책 적용
  - 미사용 에셋 7개 + design_reference/ 삭제
  - ghost war-room.svg 참조 제거
- 확장성 개선 구현 완료 (SSOT 준수 5개):
  - 포맷 유틸 중앙화 (`src/lib/format.ts`)
  - TeamCard 통합 (`src/components/ui/TeamCard.tsx`)
  - Modal 컴포넌트 (`src/components/ui/Modal.tsx`)
  - Ended 가드 검증 완료
  - 역할 칩 War Room 추가

## 2) 현재 단계

- Phase 2: QA + 제출 준비 정리

## 3) 남은 우선순위

1. 실기기 phone pass 1회
2. Submission 1 문안 정리
3. 상태/증빙/제출 문서 최종 정합화
4. Vercel 배포 및 공개 URL 증빙
5. PDF 제출 패키징 자산 정리

## 4) 운영 원칙

- SSOT 우선
- 문서는 심사 증빙 자산으로 유지
- 공개 포털과 팀 로컬 데이터 경계를 유지
- localStorage 우선 구조를 유지
- 추가 기능보다 제출 완성도와 검증 증빙을 우선

## 5) 현재 판단

- 제품 핵심 기능은 이미 제출 가능한 수준까지 올라와 있다.
- SSOT 기준에서 남는 핵심 리스크는 기능 누락보다 실기기 검증과 제출 증빙이다.
- 지금 남은 일의 성격은 대규모 구현보다:
  - 실기기 확인
  - 문안 정리
  - 배포 증빙
  - 제출 자산 패키징
  에 가깝다.
