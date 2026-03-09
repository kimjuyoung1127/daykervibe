# 프로젝트 컨텍스트

기준일: 2026-03-09 (KST)
프로젝트명: Expedition Hub 해커톤 실행 포털

## 1) 한 줄 정의
주어진 명세를 구현하는 수준을 넘어, 원정대 구성부터 제출 준비 워크플로우 관리, 결과 확인까지 이어지는 해커톤 실행 포털을 docs-first 방식으로 기획하고 증빙하는 워크스페이스.

## 2) 왜 만드는가
- 이 대회는 명세 해석 능력과 전달력이 점수에 직접 연결된다.
- 제출이 `기획서 -> 웹 URL -> PDF`로 단계화되어 있어 준비 과정 자체를 설명 가능하게 만드는 것이 중요하다.
- 심사자는 별도 키 없이 결과를 확인해야 하므로 공개 포털과 팀 전용 워크플로우를 분리해야 한다.

## 3) 소스 오브 트루스
- canonical source: `docs/ref/hackathons/daker-handover-2026-03.md`
- 대회 규칙/일정/제출물 참고: `hackathonsjson/public_hackathon_detail.json`
- 팀 모집 상황 참고: `hackathonsjson/public_teams.json`
- 결과물 형태 참고: `hackathonsjson/public_leaderboard.json`

## 4) 핵심 제약
- 예시 자료 외 추가 데이터는 제공되지 않음
- 더미 데이터와 `localStorage` 사용 가능
- 배포 URL은 외부에서 접근 가능해야 하고 심사 기간 동안 유지되어야 함
- 외부 API/DB를 쓰더라도 심사자가 별도 키 없이 확인 가능해야 함
- 확장은 `기본 구현 강화`로 읽혀야 하며, 새 제품 추가처럼 보이면 안 됨

## 5) 산출물 기준
- 기획서 1차 제출: 텍스트 또는 URL
- 최종 제출: 외부 공개 웹 URL + GitHub 링크
- 최종 문서: PDF URL

## 6) 예상 라우트 구조
- `/`: Expedition Hub 랜딩 + 포털 진입
- `/hackathons`: 해커톤 목록
- `/hackathons/:slug`: 해커톤 상세
- `/camp`: 원정대 모집/생성
- `/rankings`: 랭킹
- `/war-room/:teamId`: 베이스캠프 + 작전실 실행 허브

## 7) 화면 중심 데이터 모델
- `hackathons`
- `teams`
- `teamInvites`
- `warRooms`
- `warRoomWorkflowCards`
- `warRoomChecklist`
- `submissions`
- `leaderboards`
- `rankings`
- 초기 저장 방식은 `localStorage` 우선

## 8) 준비 운영 방식
- `START-HERE`, `master plan`, `status`, `ref`, `logs` 체계를 유지
- 요구사항 해석, 구현 범위 결정, 데모 시나리오를 문서에 먼저 고정
- 개발 과정 자체도 심사 증빙으로 남긴다
