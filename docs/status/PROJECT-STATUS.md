# Project Status

Last Updated: 2026-03-09 (KST)
Focus Hackathon: `daker-handover-2026-03`

## Current Focus
- SSOT 문서 잠금 완료
- Expedition Hub 제품 서사와 핵심 용어 재정의 완료
- PRD / Schema / Wireframe / Architecture 재정렬 진행 중
- Submission 1 기획서 초안 구조 작성 시작
- automation scaffold bootstrap 완료

## Canonical Source
- `docs/ref/hackathons/daker-handover-2026-03.md`

## Confirmed Facts
- 개인 참가 가능, 팀 최대 5인
- 제출은 `기획서 -> 웹 URL + GitHub -> PDF` 순서
- 평가 비중은 참가자 30%, 심사위원 70%
- 외부 접속 가능한 배포 URL이 필요
- 심사자 검토에 별도 API 키가 필요하면 불리함
- 전 페이지 공통 상단 이동과 상태 UI 3종이 필요
- 핵심 페이지는 `/hackathons/:slug`
- `teams`는 해커톤과 연결되지 않아도 생성 가능
- 내부 유저 정보, 비공개 정보, 다른 팀 내부 정보는 공개 금지
- 팀 수 `43`, 조회수 `614`, 총상금 `1,000,000원`

## Open Gaps
- Submission 1 문안 최종본 미작성
- GitHub 저장소 공개 방식 미확정
- 실제 구현용 앱 골격 미생성
- 워크플로우 카드 시드 데이터 미작성

## Next Actions
1. Expedition Hub 기준 기획서 초안 문안 작성
2. 워크플로우 카드 스키마와 시드 구조 잠금
3. 프론트엔드 구현 계획에 베이스캠프/작전실 반영
4. 웹 제출 체크리스트 작성

## Recent Decisions
- 제품 서비스명은 `Expedition Hub`
- 공식 안내가 사용자 수기 명세, PNG, 기존 JSON보다 우선
- UI spec과 master plan은 SSOT 파생 문서로 유지
- 베이스캠프는 별도 라우트가 아니라 작전실 상단 상태 요약으로 처리
- 작전실은 팀 전용 협업 공간이 아니라 제출 준비 관리 허브로 해석
- 기술 스택은 `Next.js + TypeScript + Tailwind + localStorage + Vercel`
