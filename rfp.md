# RFP: everyone-prays

> 개인용 기도 기록 & 알람 PWA 웹앱

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | everyone-prays |
| 유형 | PWA (Progressive Web App) |
| 기술스택 | Next.js (App Router) + TypeScript |
| 데이터 저장 | LocalStorage / IndexedDB (로컬 전용, 백엔드 없음) |
| 배포 | Vercel 자동배포 (URL: everyone-prays) |
| 소스관리 | GitHub (repo: everyone-prays) → Vercel 연동 자동배포 |
| 디자인 | 초기 Black + White 단색 → 추후 design.md 반영 |

---

## 2. 핵심 기능 목록

### F1. 이름 쓰기
- 홈 화면 상단에 **기도 대상자 이름** 입력 필드
- 텍스트 입력 → IndexedDB에 저장
- 이전에 입력한 이름 자동완성/최근 목록 제공

### F2. 기도문 쓰기
- 이름 입력 하단에 **기도문 본문** 텍스트 영역
- 날짜(오늘)와 함께 자동 저장
- 한 날짜에 여러 기도문 작성 가능 (이름별)

### F3. 알람 울리기
- 홈 화면에서 **기도 알람 시간 설정**
- PWA Push Notification + Web Notification API 활용
- 매일 반복 알람 지원
- Service Worker 기반 백그라운드 알림

### F4. 예약하기
- **예약 탭**: 미래 날짜/시간에 기도문을 미리 작성
- 예약 목록 관리 (수정/삭제)
- 예약 시간 도달 시 알림 발송 + 홈 화면에 표시

### F5. 캘린더 보기
- **캘린더 탭**: 월간 달력 뷰
- 기도 기록이 있는 날짜에 마커(dot) 표시
- 날짜 클릭 → 해당일의 기도 기록 목록 확인

---

## 3. 화면 구조

```
┌─────────────────────────┐
│     📅 2026년 5월 18일    │  ← 오늘 날짜
│                         │
│  [이름 입력 필드]         │  ← F1
│                         │
│  [기도문 텍스트 영역]      │  ← F2
│                         │
│  [저장 버튼]              │
│                         │
│  🔔 알람: 오전 6:00       │  ← F3
│                         │
├─────────────────────────┤
│  📅 캘린더 | 🏠 홈 | ⏰ 예약 │  ← 하단 탭 네비게이션
└─────────────────────────┘
```

---

## 4. 기술 아키텍처

```
[Next.js App Router]
  ├── app/
  │   ├── layout.tsx          ← 전체 레이아웃 + 탭 네비게이션
  │   ├── page.tsx            ← 홈 (이름/기도문/알람)
  │   ├── calendar/page.tsx   ← 캘린더 뷰
  │   └── reservation/page.tsx ← 예약 관리
  ├── components/             ← 공통 컴포넌트
  ├── lib/
  │   ├── db.ts               ← IndexedDB 래퍼 (Dexie.js)
  │   └── notification.ts     ← 알림 유틸
  ├── public/
  │   ├── manifest.json       ← PWA 매니페스트
  │   └── sw.js               ← Service Worker
  └── styles/                 ← 글로벌 스타일 (B&W)
```

---

## 5. 데이터 모델 (IndexedDB)

```typescript
// 기도 기록
interface Prayer {
  id: string;           // UUID
  name: string;         // 기도 대상자 이름
  content: string;      // 기도문 본문
  date: string;         // YYYY-MM-DD
  createdAt: number;    // timestamp
}

// 알람 설정
interface Alarm {
  id: string;
  time: string;         // HH:mm
  enabled: boolean;
  repeat: boolean;      // 매일 반복
}

// 예약
interface Reservation {
  id: string;
  name: string;
  content: string;
  scheduledAt: number;  // 예약 시간 timestamp
  notified: boolean;    // 알림 발송 여부
  createdAt: number;
}
```

---

## 6. 인프라 & 배포

| 단계 | 작업 |
|------|------|
| 1 | 로컬 폴더에 Next.js 프로젝트 초기화 |
| 2 | GitHub repo `everyone-prays` 생성 + push |
| 3 | Vercel 프로젝트 연결 (URL: everyone-prays.vercel.app) |
| 4 | main 브랜치 push → Vercel 자동배포 |

---

## 7. 구현 순서 (권장)

| Phase | 내용 |
|-------|------|
| **Phase 1** | 프로젝트 셋업 (Next.js + GitHub + Vercel + PWA 기본) |
| **Phase 2** | 홈 화면 (이름 입력 + 기도문 작성 + 저장) |
| **Phase 3** | 캘린더 탭 (월간 뷰 + 기도 기록 조회) |
| **Phase 4** | 예약 탭 (예약 작성 + 목록 관리) |
| **Phase 5** | 알람 기능 (Notification API + Service Worker) |
| **Phase 6** | 디자인 적용 (design.md 기반) |

---

## 8. 제약사항 & 참고

- **백엔드 없음**: 모든 데이터는 브라우저 로컬에 저장 (기기 간 동기화 불가)
- **알람 한계**: PWA 알림은 브라우저/OS 권한에 의존, iOS Safari 제한 있음
- **디자인**: 초기 B&W → 추후 design.md 제공 시 전면 적용
- **design.md 템플릿**: `/Users/lt-025/Library/Mobile Documents/com~apple~CloudDocs/LLM/design-md-template.md` 활용
