# design.md 작성 체크리스트

> everyone-prays 앱의 디자인 시스템 문서(design.md) 작성을 위해 결정해야 할 항목들

---

## 1. Overview & 방향성

- [ ] 앱의 전체적인 비주얼 분위기 (예: 따뜻한/차분한/미니멀/영적인)
- [ ] 참고할 레퍼런스 앱 또는 웹사이트 URL (1~3개)
- [ ] 서피스 모드 결정 (라이트 전용 / 다크 전용 / 라이트+다크)

---

## 2. Colors

### Brand & Accent
- [ ] 메인 액센트 컬러 (hex) — CTA, 강조 요소
- [ ] 액센트 Hover/Active 상태 색상
- [ ] 액센트 Disabled 상태 색상
- [ ] 보조 액센트 필요 여부 (있다면 hex)

### Surface (배경)
- [ ] 기본 페이지 배경색 (canvas)
- [ ] 카드/섹션 배경색 (surface-card)
- [ ] Border/구분선 색상 (hairline)

### Text
- [ ] 주요 텍스트 색상 (ink — 헤드라인, 강조)
- [ ] 본문 텍스트 색상 (body)
- [ ] 보조/뮤트 텍스트 색상 (muted — 캡션, 날짜 등)
- [ ] 액센트 배경 위 텍스트 색상 (on-primary)

### Semantic
- [ ] Success 색상 (저장 완료 등)
- [ ] Warning 색상 (알람 관련)
- [ ] Error 색상 (오류/삭제)

### Gradient
- [ ] 그라디언트 사용 여부 (있다면 방향 + 색상)

---

## 3. Typography

### Font Family
- [ ] 헤드라인/Display 폰트 (이름 + fallback)
- [ ] Body/UI 폰트 (이름 + fallback)
- [ ] 한글 폰트 결정 (Pretendard / Noto Sans KR / 기타)

### Hierarchy (사이즈 결정)
- [ ] Display (날짜 표시용) — size, weight
- [ ] Title (탭 제목, 섹션 제목) — size, weight
- [ ] Body (기도문 본문) — size, weight, line-height
- [ ] Caption (보조 정보, 시간 등) — size, weight
- [ ] Button 텍스트 — size, weight
- [ ] Nav/Tab 텍스트 — size, weight

---

## 4. Layout & Spacing

- [ ] Base unit (4px / 8px)
- [ ] 모바일 좌우 패딩 (기본)
- [ ] 섹션 간 수직 간격
- [ ] 카드 내부 패딩
- [ ] 입력 필드 높이
- [ ] 하단 탭 바 높이
- [ ] 최대 콘텐츠 너비 (모바일 중심이므로 max-width)

---

## 5. Elevation & Depth

- [ ] 그림자 사용 여부 (flat vs. elevated)
- [ ] 카드 그림자 값 (사용한다면)
- [ ] 입력 필드 스타일 (border vs. shadow vs. underline)
- [ ] 하단 탭 바 구분 방식 (shadow / border-top / none)

---

## 6. Motion

- [ ] 버튼 hover/press 트랜지션 (duration, easing)
- [ ] 탭 전환 애니메이션 (있다면)
- [ ] 저장 완료 피드백 애니메이션
- [ ] 모달/드롭다운 진입/퇴장 (있다면)

---

## 7. Shapes

- [ ] 버튼 border-radius (pill / rounded / square)
- [ ] 카드 border-radius
- [ ] 입력 필드 border-radius
- [ ] 캘린더 날짜 셀 모양 (원형 / rounded square)
- [ ] 탭 아이콘 스타일 (outline / filled / 커스텀)

---

## 8. Components (앱 고유)

### Navigation
- [ ] 하단 탭 바 디자인 (아이콘 + 텍스트 / 아이콘만 / 스타일)
- [ ] 활성 탭 표시 방식 (색상 변경 / 밑줄 / 배경 등)

### Buttons
- [ ] Primary 버튼 스타일 (저장 버튼)
- [ ] Secondary 버튼 스타일 (취소/삭제)
- [ ] 아이콘 버튼 스타일 (알람 설정 등)

### Input Fields
- [ ] 이름 입력 필드 스타일
- [ ] 기도문 텍스트 영역 스타일 (높이, placeholder)
- [ ] 시간 선택 UI (time picker 스타일)

### Cards
- [ ] 기도 기록 카드 (캘린더에서 날짜 클릭 시)
- [ ] 예약 카드 (예약 목록)

### Calendar
- [ ] 캘린더 전체 스타일
- [ ] 기도 기록 있는 날짜 마커 (dot 색상/크기)
- [ ] 선택된 날짜 표시 스타일
- [ ] 오늘 날짜 표시 스타일

### Alarm
- [ ] 알람 시간 표시 스타일
- [ ] ON/OFF 토글 스타일

---

## 9. Responsive & Touch

- [ ] 기준 해상도 (iPhone 기준? 390px?)
- [ ] 터치 타겟 최소 크기 (44×44px 권장)
- [ ] 태블릿 대응 필요 여부

---

## 10. Do's and Don'ts

- [ ] 절대 하면 안 되는 디자인 규칙 (3~5개)
- [ ] 반드시 지켜야 하는 핵심 규칙 (3~5개)

---

## 참고

- 템플릿 위치: `/Users/lt-025/Library/Mobile Documents/com~apple~CloudDocs/LLM/design-md-template.md`
- 초기 디자인: Black + White 기본
- 최종 design.md는 위 항목들이 결정된 후 템플릿 형식에 맞춰 작성
