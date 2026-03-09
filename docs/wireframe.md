# Hackerton Wireframe

Last Updated: 2026-03-09 (KST)

## Design References
| 페이지 | 레퍼런스 파일 |
|--------|-------------|
| `/` 랜딩 | `public/design_reference/landing_page.png` |
| `/hackathons` 목록 | `public/design_reference/hackathon_listing.png` |
| `/hackathons/:slug` 상세 | `public/design_reference/hackathon_detail.png` |
| `/camp` 팀 모집 | `public/design_reference/camp_recruitment.png` |
| `/rankings` 랭킹 | `public/design_reference/rankings.png` |
| `/war-room/:teamId` 작전실 | `public/design_reference/war_room.png` |
| 공통 컴포넌트 스타일 | `public/design_reference/1.png` |

## 1. 디자인 방향
- 8비트 게이머 감성
- 랜딩은 롱스크롤 쇼케이스
- 포털은 운영 가독성 우선
- 픽셀 보더, 스티커 같은 컬러 카드, 블랙 배경 섹션, 밝은 카드 박스 조합

## 2. Foundations
### 2.1 Color
- Background Dark: `#171314`
- Orange: `#F08A24`
- Yellow: `#F7D64A`
- Mint: `#98F0E1`
- Pink: `#FF79C9`
- Purple: `#A98DF8`
- White Card: `#F7F1E8`
- Border Dark: `#1A1A1A`

### 2.2 Typography
- **영문 타이틀/헤더**: `Press Start 2P` (`public/fonts/press-start-2p/PressStart2P.ttf`)
- **한글 타이틀/본문**: `DungGeunMo` (`public/fonts/DungGeunMo/DungGeunMo.ttf`)
- Body: DungGeunMo 또는 시스템 sans-serif fallback
- Small: compact pixel-inspired label text

### 2.3 Component Mood
- 강한 외곽선
- 낮은 라운드 또는 모서리 잘린 카드
- 상태 배지와 CTA가 명확한 게임 UI 느낌

## 3. Global Layout
- Top navigation:
  - 메인
  - Hackathons
  - Camp
  - Rankings
- Common states:
  - 로딩중...
  - 데이터 없음
  - 에러

## 4. Page Wireframes
### 4.1 Home (`/`)
- Hero
  - 제품 한 줄 정의
  - 주요 CTA 3개
- Featured Hackathons
  - 모집중 / 종료 카드
- Portal Value Section
  - 모집, 팀 구성, 작전실, 제출, 평가 이해
- Featured Teams / Rankings Preview
- 운영 품질 증거 섹션
  - SSOT / PRD / Schema / Automation 카드
- Footer CTA

### 4.2 Hackathons (`/hackathons`)
- 헤더
  - 페이지 타이틀
  - 선택 필터 영역
- 해커톤 카드 리스트
  - 제목
  - 상태
  - 태그
  - 시작일
  - 종료일
  - 참가자수
- 카드 클릭 -> 상세

### 4.3 Hackathon Detail (`/hackathons/:slug`)
- 상단 요약 바
  - 상태
  - 기간
  - 팀 수
  - 조회수
  - 총상금
- 섹션 네비
  - 개요
  - 안내
  - 평가
  - 일정
  - 상금
  - 팀
  - 제출
  - 리더보드
- 각 섹션은 카드형 모듈
- 팀 섹션 CTA
  - 팀 만들기
  - 팀 찾기
  - 초대/수락/거절 버튼 영역
- 제출 섹션
  - 가이드
  - 상태
  - 최소 폼
- 리더보드
  - 점수 설명
  - 미제출 상태

### 4.4 Camp (`/camp`)
- 필터 바
  - 전체 / 특정 해커톤
- 팀 리스트 카드
  - 팀명
  - 소개
  - 모집 상태
  - 모집 포지션
  - 연락 링크
- 팀 생성 폼
  - 팀명
  - 소개
  - 모집중 여부
  - 모집 포지션
  - 연락 링크

### 4.5 Rankings (`/rankings`)
- 타이틀
- 기간 필터
- 글로벌 랭킹 테이블
  - rank
  - nickname
  - points
  - activity summary

### 4.6 War Room (`/war-room/:teamId`)
- 팀 요약 카드
- 제출 단계 상태 카드
- 체크리스트 보드
- 팀 메모
- 링크 관리
- 팀원 상태/초대 상태 요약

## 5. Responsive
### Desktop
- 랜딩은 1열 롱스크롤
- 포털은 2~3열 카드 조합

### Tablet
- 상세 페이지 섹션 네비 고정 또는 접기
- 캠프/작전실 카드 세로 적층

### Mobile
- CTA 우선
- 표보다 카드 우선
- 작전실은 단일 컬럼

## 6. Designer Handoff Checklist
- [ ] 색상 토큰 확정
- [ ] 카드 형태와 보더 규칙 확정
- [ ] 상태 배지 스타일 확정
- [ ] 랜딩과 포털의 연결 톤 확정
- [ ] 작전실 구조 확정
