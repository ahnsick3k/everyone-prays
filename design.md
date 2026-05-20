# Design System: everyone-prays (Hershey Edition)

---

## Token Architecture

### Principle 1 · CSS Variable Naming

모든 디자인 토큰은 반드시 **CSS custom property 이름(`--var-name`)** 과 함께 선언한다.

명명 규칙:
- 색상: `--color-[role]` — 예: `--color-interactive`, `--color-bg`, `--color-text-muted`
- 간격: `--space-[scale]` — 예: `--space-100`, `--space-400`
- 타이포: `--font-[property]-[role]` — 예: `--font-size-body`, `--font-weight-heading`
- 반경: `--radius-[scale]` — 예: `--radius-sm`, `--radius-pill`
- 그림자: `--shadow-[scale]` — 예: `--shadow-sm`, `--shadow-card`
- 모션: `--duration-[scale]`, `--ease-[type]`

### Principle 2 · Two-Layer Token System (Primitive → Alias)

```
Layer 1 — Primitive
  --brown-900: #3C1321
  --brown-700: #5C2E3E
  --brown-500: #7B4B5A
  --cream-50:  #FFF9F5
  --cream-100: #FFF3EB
  --gold-500:  #C8902E
  --gold-600:  #A67425
  --white:     #FFFFFF

Layer 2 — Alias/Semantic
  --color-interactive:       var(--brown-900)
  --color-interactive-hover: var(--brown-700)
  --color-bg:                var(--cream-50)
  --color-surface-card:      var(--white)
```

규칙:
- **컴포넌트 코드에서는 항상 Alias 토큰만 사용** — Primitive를 직접 참조하면 테마 전환이 깨진다.
- Primitive는 `:root`에 한 번만 선언한다.
- Alias 토큰이 없는 색상은 컴포넌트에서 사용하면 안 된다.

---

## Documentation Principles

### 1. 문서화 전에 먼저 생각하라

**가정하지 않는다. 불확실하면 명시한다.**

- 토큰 값을 확인하지 못했다면 `[미확인]` 또는 `[추정]` 태그를 반드시 붙인다.
- 불명확한 항목은 **Known Gaps** 섹션에 기재한다.

### 2. 관찰된 것만 문서화하라

**확인된 것만. 추측 기반 항목은 없다.**

### 3. 업데이트는 외과적으로

**건드려야 할 것만 건드린다.**

### 4. 검증 가능한 스펙을 작성하라

**"맞는지 어떻게 아는가?"를 항상 물어라.**

---

## Overview

everyone-prays는 Hershey의 "moments of goodness" 철학에서 영감을 받은 기도 기록 PWA이다. 따뜻한 초콜릿 브라운과 부드러운 크림 톤을 기반으로, 정돈된 산세리프 타이포그래피를 통해 **따뜻하고 경건한 일상의 동반자** 감각을 구현한다. Hershey가 리테일 공간에서 "whimsical worlds"를 만들 듯, 이 앱은 기도라는 영적 행위에 감각적 따뜻함과 즐거움을 부여한다.

가장 독특한 디자인 결정은 **초콜릿 브라운 단일 액센트 시스템**이다. 모든 인터랙티브 요소(버튼, 링크, 포커스 링)에 Hershey 시그니처 브라운 #3C1321을 사용하고, 보조 액센트로 따뜻한 골드 #C8902E를 캘린더 마커와 알람 하이라이트에만 제한적으로 사용한다. 이 절제된 색상 전략이 기도의 집중감과 브랜드 정체성을 동시에 전달한다.

이 시스템은 **라이트 모드 전용**으로 구성된다. 크림빛 배경(#FFF9F5)이 따뜻한 종이 질감을 주고, 순백(#FFFFFF) 카드가 콘텐츠 영역을 부각시킨다. 다크 서피스는 하단 탭 바의 초콜릿 브라운(#3C1321)에서만 사용되어 네비게이션 앵커 역할을 한다.

> **Source pages analyzed:** https://www.thehersheycompany.com/en_us/home/newsroom/blog/leading-by-design-how-hershey-is-helping-retailers-create-buzzworthy-spaces.html

**Key Characteristics:**
- 초콜릿 브라운(#3C1321) 단일 액센트 — 모든 CTA, 링크, 포커스 링에 사용
- 크림(#FFF9F5) + 화이트(#FFFFFF) 투톤 서피스 — 따뜻한 종이 위 카드 레이아웃
- SF Pro Display 디스플레이 폰트(날짜 표시) + Pretendard 바디(UI 전반)
- 부드러운 라운드 코너(12px 카드, pill 버튼) — 초콜릿 바의 부드러운 곡선에서 영감
- 그림자 최소화, 색상 변화로 깊이 표현 — flat + hairline border 시스템
- 8px 베이스 유닛, 관대한 여백 — 기도에 집중하는 여유로운 호흡감

---

## Colors

### Brand & Accent

- **Hershey Brown** (`{colors.primary}` (`--color-interactive`) — #3C1321): 메인 인터랙티브 컬러. 저장 버튼, 링크, 포커스 링, 활성 탭 아이콘 등 모든 클릭 가능 요소에 사용. Hershey의 시그니처 초콜릿 색상으로 따뜻한 깊이감을 전달.
- **Hershey Brown Hover** (`{colors.primary-active}` (`--color-interactive-hover`) — #5C2E3E): hover/press 상태. 밝기를 약간 올려 시각적 피드백 제공.
- **Hershey Brown Disabled** (`{colors.primary-disabled}` (`--color-interactive-disabled`) — #3C1321 at 40% opacity): 비활성 버튼 상태.
- **Warm Gold** (`{colors.accent-gold}` (`--color-accent-gold`) — #C8902E): 보조 액센트. 캘린더 기도 마커 dot, 알람 활성 아이콘, 오늘 날짜 하이라이트에만 제한 사용.

### Surface

- **Cream Canvas** (`{colors.canvas}` (`--color-bg`) — #FFF9F5): 기본 페이지 배경. 순수 흰색 대신 따뜻한 크림을 써서 초콜릿 브라운과 조화롭고 눈이 편안한 기도 환경 조성.
- **White Card** (`{colors.surface-card}` (`--color-surface-card`) — #FFFFFF): 카드/입력 필드 배경. canvas와의 미세한 대비로 콘텐츠 영역 부각.
- **Dark Nav** (`{colors.surface-dark}` (`--color-surface-dark`) — #3C1321): 하단 탭 바 배경. 유일한 다크 서피스로 네비게이션 앵커 역할.
- **Hairline** (`{colors.hairline}` (`--color-border`) — rgba(60, 19, 33, 0.12)): 카드 테두리, 입력 필드 보더, 구분선에 사용.

### Text

- **Ink** (`{colors.ink}` (`--color-text-primary`) — #3C1321): 헤드라인, 날짜 표시, 강조 텍스트. 순수 검정 대신 브라운 톤을 써서 따뜻한 분위기 유지.
- **Body** (`{colors.body}` (`--color-text-body`) — #5C2E3E): 기도문 본문, 일반 텍스트.
- **Muted** (`{colors.muted}` (`--color-text-muted`) — #9B7A85): 캡션, 날짜 보조 텍스트, placeholder.
- **On-primary** (`{colors.on-primary}` (`--color-text-on-primary`) — #FFFFFF): 초콜릿 브라운 버튼/탭 바 위 텍스트.
- **On-gold** (`{colors.on-gold}` (`--color-text-on-gold`) — #FFFFFF): 골드 배지 위 텍스트.

### Semantic

- **Success** (`{colors.success}` (`--color-success`) — #2E7D4F): 저장 완료, 기도 기록 확인.
- **Warning** (`{colors.warning}` (`--color-warning`) — #C8902E): 알람 관련 경고 (골드와 동일).
- **Error** (`{colors.error}` (`--color-error`) — #C4392D): 삭제 확인, 입력 오류.

### Brand Gradient

**No decorative gradients.** Hershey의 디자인 철학은 단색 블록과 사진으로 분위기를 전달한다. 이 앱에서도 그라디언트 없이 크림-화이트 서피스 교번으로 시각적 리듬을 만든다.

### Contrast Matrix (draft)

| 조합 | 전경색 | 배경색 | 비율 | 등급 |
|---|---|---|---|---|
| Ink on canvas | `{colors.ink}` #3C1321 | `{colors.canvas}` #FFF9F5 | 12.8:1 | AAA |
| Body on canvas | `{colors.body}` #5C2E3E | `{colors.canvas}` #FFF9F5 | 8.2:1 | AAA |
| Muted on canvas | `{colors.muted}` #9B7A85 | `{colors.canvas}` #FFF9F5 | 3.8:1 | AA Large |
| On-primary (button) | `{colors.on-primary}` #FFF | `{colors.primary}` #3C1321 | 12.8:1 | AAA |
| Body on white card | `{colors.body}` #5C2E3E | `{colors.surface-card}` #FFF | 8.6:1 | AAA |
| Gold on canvas | `{colors.accent-gold}` #C8902E | `{colors.canvas}` #FFF9F5 | 3.5:1 | AA Large |

---

## Typography

### Font Family

- **SF Pro Display**: `'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif` — Display/헤드라인 폰트. Apple 시스템 디스플레이 서체로 날짜 표시와 대형 숫자에 사용. 세련되고 모던한 인상.
- **Pretendard**: `'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — Body/UI 폰트. 한글·영문 모두 높은 가독성과 중립적 톤으로 기도문 가독성 확보. 모든 UI 텍스트의 기본 서체.

### Hierarchy

| Token | Font | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|---|
| `{typography.display-xl}` | SF Pro Display | 36px (2.25rem) | 700 (Bold) | 1.1 | -0.02em | 홈 화면 오늘 날짜 |
| `{typography.display-lg}` | SF Pro Display | 28px (1.75rem) | 700 | 1.2 | -0.01em | 캘린더 월 표시 |
| `{typography.title-lg}` | Pretendard | 20px (1.25rem) | 700 | 1.3 | 0 | 탭 제목, 섹션 헤드라인 |
| `{typography.title-md}` | Pretendard | 17px (1.0625rem) | 600 | 1.4 | 0 | 카드 제목, 이름 표시 |
| `{typography.body-lg}` | Pretendard | 16px (1rem) | 400 | 1.6 | 0 | 기도문 본문 |
| `{typography.body}` | Pretendard | 15px (0.9375rem) | 400 | 1.5 | 0 | UI 텍스트, 설명문 |
| `{typography.body-sm}` | Pretendard | 13px (0.8125rem) | 400 | 1.5 | 0 | 보조 정보 |
| `{typography.button}` | Pretendard | 15px (0.9375rem) | 600 | 1.0 | 0.01em | 버튼 레이블 |
| `{typography.caption}` | Pretendard | 12px (0.75rem) | 500 | 1.4 | 0.02em | 캡션, 시간 표시, 메타 |
| `{typography.nav-link}` | Pretendard | 11px (0.6875rem) | 500 | 1.0 | 0.03em | 하단 탭 레이블 |

### Principles

- **Display는 SF Pro Display, UI는 Pretendard**: 날짜와 숫자에만 SF Pro Display를 사용하여 시각적 위계를 형성. 기도문 본문은 반드시 Pretendard로 — 가독성이 최우선.
- **Weight 제한**: 400(본문), 500(캡션/내비), 600(제목/버튼), 700(헤드라인/Display). 다른 weight 사용 금지.
- **Line-height 패턴**: Display(1.1~1.2)는 타이트, Body(1.5~1.6)는 넉넉하게. 기도문은 1.6으로 읽기 편한 호흡 확보.
- **Letter-spacing**: Display는 음수(-0.02em), Body는 0, Caption/Nav는 양수(+0.02~0.03em). 크기가 작을수록 자간을 벌려 가독성 확보.

### Note on Fonts

- **SF Pro Display**: Apple 기기에서 시스템 폰트로 자동 적용. 비Apple 환경에서는 `-apple-system, BlinkMacSystemFont, 'Segoe UI'` 폴백.
- **Pretendard**: 웹폰트로 제공 (CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css`). 한글·영문 동일한 시각적 밸런스 제공.

---

## Layout

### Spacing System

- **Base unit:** 8px.
- **Tokens:** `{spacing.xxs}` 2px · `{spacing.xs}` 4px · `{spacing.sm}` 8px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **섹션 수직 패딩:** `{spacing.section}` (64px) — 탭 콘텐츠 간 전환 시 충분한 호흡.
- **카드 내부 패딩:** `{spacing.lg}` (24px) for 기도 기록 카드; `{spacing.md}` (16px) for 예약 카드.
- **버튼 패딩:** 14px × 24px (Medium 기준).

### Grid & Container

- **최대 콘텐츠 너비:** 390px centered (iPhone 기준).
- **모바일 좌우 패딩:** 20px (좌우 합 40px).
- **카드 그리드:** 1열 스택 (모바일 전용 앱).
- **거터:** 12px between 카드 아이템.

### Whitespace Philosophy

everyone-prays의 여백은 **기도의 여유와 집중을 위한 무대**이다. 입력 필드 사이 24px, 섹션 간 64px의 관대한 수직 간격이 기도문 작성 시 심리적 안정감을 제공한다. 홈 화면 상단 날짜 표시 위아래의 넉넉한 여백(48px)은 하루의 시작을 의식적으로 인지하게 하는 "숨쉬는 공간" 역할을 한다.

---

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat (0) | 그림자 없음, 보더 없음 | 페이지 배경, 섹션, 탭 콘텐츠 영역 |
| Hairline (1) | 1px solid rgba(60,19,33,0.12) | 기도 기록 카드, 입력 필드, 구분선 |
| Subtle (2) | 0 2px 8px rgba(60,19,33,0.06) | 하단 탭 바 상단 경계, 시간 선택 모달 |
| Elevated (3) | 0 4px 16px rgba(60,19,33,0.12) | 저장 완료 토스트, 삭제 확인 다이얼로그 |

**Shadow philosophy.** 이 시스템에서 그림자는 극히 절제적으로 사용된다. 주된 깊이 표현은 크림 배경(#FFF9F5) 위 흰색 카드(#FFFFFF)의 **색상 차이**로 이루어진다. 그림자는 모달과 토스트처럼 레이어가 물리적으로 위에 떠 있는 경우에만 사용한다.

### Decorative Depth

- 크림-화이트 서피스 교번이 카드-배경 구분 역할
- 하단 탭 바의 다크 브라운 서피스가 자연스러운 앵커 깊이감 형성
- 캘린더 셀의 골드 dot이 기록 있는 날짜에 시각적 레이어 추가

---

## Motion

### Principle 3 · Motion as Token

규칙:
- **micro** (버튼 hover, 색상 전환): 120ms
- **base** (카드 press, 토글 전환): 200ms
- **complex** (모달 진입, 토스트): 300ms
- Easing은 진입(`ease-out`)과 퇴장(`ease-in`)을 분리한다.

### Duration Scale

| Token | CSS Variable | Value | Use |
|---|---|---|---|
| `{motion.fast}` | `--duration-fast` | 120ms | 버튼 press, 색상/투명도 전환 |
| `{motion.base}` | `--duration-base` | 200ms | 카드 터치, 토글 슬라이드 |
| `{motion.slow}` | `--duration-slow` | 300ms | 토스트 진입, 시간 선택 드롭다운 |
| `{motion.modal}` | `--duration-modal` | 400ms | 삭제 확인 모달 진입/퇴장 |

### Easing Scale

| Token | CSS Variable | Value | Use |
|---|---|---|---|
| `{motion.ease-out}` | `--ease-out` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | 요소 진입 (화면에 나타날 때) |
| `{motion.ease-in}` | `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | 요소 퇴장 (화면에서 사라질 때) |
| `{motion.ease-spring}` | `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 저장 완료 체크마크, 토글 snap |

### Component-level Motion

| Component | Property | Duration | Easing |
|---|---|---|---|
| `button-primary` | background, transform | `--duration-fast` | `--ease-out` |
| `prayer-card` | border-color, transform | `--duration-base` | `--ease-out` |
| `text-input` | border-color, box-shadow | `--duration-fast` | `--ease-out` |
| `toggle` | transform, background | `--duration-base` | `--ease-spring` |
| `toast` | opacity, transform(translateY) | `--duration-slow` | `--ease-out` / `--ease-in` |
| `modal` | opacity, transform(scale) | `--duration-modal` | `--ease-out` / `--ease-in` |
| `tab-switch` | opacity | `--duration-base` | `--ease-out` |

---

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | — |
| `{rounded.xs}` | 4px | 캘린더 날짜 셀 내부 요소 |
| `{rounded.sm}` | 8px | 입력 필드, 시간 선택 |
| `{rounded.md}` | 12px | 기도 기록 카드, 예약 카드 |
| `{rounded.lg}` | 16px | 모달, 토스트 |
| `{rounded.pill}` | 9999px | Primary 버튼, 배지 |
| `{rounded.full}` | 50% | 캘린더 날짜 셀 (원형), 골드 dot 마커 |

### Photography & Illustration

- 이 앱은 사진/일러스트를 사용하지 않음 — 순수 UI 기반
- 캘린더의 골드 dot(6px 원형)이 유일한 장식적 도형 요소
- 아이콘은 outline 스타일 (24px, stroke-width 1.5px)

---

## Components

### Navigation

**`bottom-tab-bar`** — 앱 하단 고정 네비게이션. 초콜릿 브라운 배경 위 흰색 아이콘+텍스트.
- Background `{colors.surface-dark}` (#3C1321), height 64px (safe area 별도), type `{typography.nav-link}`.
- 구성: 홈 | 예약 | 캘린더 (3탭).
- 활성 탭: 아이콘 filled + 텍스트 `{colors.on-primary}` (#FFF) + 상단 2px 골드 바(`{colors.accent-gold}`).
- 비활성 탭: 아이콘 outline + 텍스트 rgba(255,255,255,0.6).
- 상단 구분: `{shadow.subtle}` (0 -2px 8px rgba(60,19,33,0.06)).

### Buttons

#### Size Variants

| Size | Token | Height | Padding H | Font Size | Radius | Use |
|---|---|---|---|---|---|---|
| Small | `btn-sm` | 36px | 16px | 13px | `{rounded.pill}` | 인라인 삭제, 취소 |
| Medium | `btn-md` | 48px | 24px | 15px | `{rounded.pill}` | 저장 버튼 (기본) |
| Large | `btn-lg` | 52px | 32px | 16px | `{rounded.pill}` | — (미사용) |

#### State Matrix

**`button-primary` states:**

| State | Background | Text | Border | Shadow | Transform |
|---|---|---|---|---|---|
| Default | `{colors.primary}` #3C1321 | `{colors.on-primary}` #FFF | none | none | none |
| Hover/Press | `{colors.primary-active}` #5C2E3E | `{colors.on-primary}` #FFF | none | none | `scale(0.97)` |
| Focus | `{colors.primary}` #3C1321 | `{colors.on-primary}` #FFF | 2px solid `{colors.accent-gold}` | none | none |
| Disabled | `{colors.primary}` #3C1321 | `{colors.on-primary}` #FFF | none | none | `opacity: 0.4` |

**`button-secondary` states:**

| State | Background | Text | Border | Shadow | Transform |
|---|---|---|---|---|---|
| Default | transparent | `{colors.primary}` #3C1321 | 1px solid rgba(60,19,33,0.3) | none | none |
| Hover/Press | rgba(60,19,33,0.05) | `{colors.primary}` #3C1321 | 1px solid `{colors.primary}` | none | none |
| Focus | transparent | `{colors.primary}` | 2px solid `{colors.accent-gold}` | none | none |
| Disabled | transparent | `{colors.muted}` | 1px solid `{colors.hairline}` | none | `opacity: 0.4` |

**`button-destructive` states:**

| State | Background | Text | Border | Shadow | Transform |
|---|---|---|---|---|---|
| Default | transparent | `{colors.error}` #C4392D | 1px solid rgba(196,57,45,0.3) | none | none |
| Hover/Press | rgba(196,57,45,0.05) | `{colors.error}` | 1px solid `{colors.error}` | none | none |

**`icon-button`** — 알람 설정, 편집 등 아이콘만 있는 터치 버튼.
- Size: 44×44px (터치 타겟), 아이콘 24px.
- Background: transparent, active: rgba(60,19,33,0.08).
- Rounded: `{rounded.full}`.

### Input Fields

**`text-input`** — 이름 입력 필드.
- Background `{colors.surface-card}` (#FFF), text `{colors.body}` (#5C2E3E), type `{typography.body}`, rounded `{rounded.sm}` (8px), padding 14px × 16px, height 48px.
- Border: 1px solid `{colors.hairline}` rgba(60,19,33,0.12).
- Placeholder: `{colors.muted}` (#9B7A85).
- Focus: border-color `{colors.primary}` (#3C1321), box-shadow 0 0 0 3px rgba(60,19,33,0.08).

**`textarea`** — 기도문 텍스트 영역.
- 동일 스타일, min-height 120px, resize: vertical.
- Placeholder: "오늘의 기도를 작성하세요..."

**`time-picker`** — 알람 시간 선택.
- Native `<input type="time">` 스타일링 + 동일 보더/포커스 처리.
- Height 48px, padding 14px × 16px.

### Cards

**`prayer-record-card`** — 캘린더에서 날짜 클릭 시 표시되는 기도 기록 카드.
- Background `{colors.surface-card}` (#FFF), rounded `{rounded.md}` (12px), padding `{spacing.lg}` (24px).
- Border: 1px solid `{colors.hairline}`.
- 내부: 이름(`{typography.title-md}`) → 기도문(`{typography.body-lg}`) → 시간(`{typography.caption}` + `{colors.muted}`).

**`reservation-card`** — 예약 목록 아이템.
- Background `{colors.surface-card}` (#FFF), rounded `{rounded.md}` (12px), padding `{spacing.md}` (16px).
- Border: 1px solid `{colors.hairline}`.
- 내부: 날짜/시간(`{typography.caption}` + gold) → 이름(`{typography.title-md}`) → 기도문 미리보기(`{typography.body-sm}` + `{colors.muted}`).
- 좌측 4px 골드 바 장식 (border-left: 4px solid `{colors.accent-gold}`).

### Calendar

**`calendar`** — 월간 달력 뷰.
- Background: `{colors.canvas}` (#FFF9F5), 헤더는 월 표시(`{typography.display-lg}` SF Pro Display).
- 요일 헤더: `{typography.caption}`, `{colors.muted}`.
- 날짜 셀: 40×40px, `{rounded.full}`, `{typography.body}`.
- **기도 기록 있는 날짜 마커**: 셀 하단 중앙 6px 원형 dot, `{colors.accent-gold}` (#C8902E).
- **선택된 날짜**: background `{colors.primary}` (#3C1321), text `{colors.on-primary}` (#FFF).
- **오늘 날짜**: border 2px solid `{colors.accent-gold}`, text `{colors.ink}`.

### Alarm

**`alarm-display`** — 홈 화면 알람 시간 표시.
- 시간: `{typography.title-lg}`, `{colors.ink}`.
- "매일 반복" 레이블: `{typography.caption}`, `{colors.muted}`.

**`toggle-switch`** — 알람 ON/OFF 토글.
- Track: width 48px, height 28px, rounded `{rounded.pill}`.
- OFF: background rgba(60,19,33,0.15), thumb #FFF.
- ON: background `{colors.accent-gold}` (#C8902E), thumb #FFF.
- Transition: `--duration-base` + `--ease-spring`.

### Signature Component — 저장 완료 피드백

**`save-confirmation`** — 기도 저장 시 화면 하단에서 올라오는 토스트.
- Background `{colors.primary}` (#3C1321), text `{colors.on-primary}` (#FFF), rounded `{rounded.lg}` (16px).
- 좌측 체크마크 아이콘(✓) + "기도가 저장되었습니다" 텍스트.
- 진입: translateY(100%) → translateY(0), `--duration-slow`, `--ease-out`.
- 2초 후 자동 퇴장: opacity 1→0, `--duration-slow`, `--ease-in`.

---

## Do's and Don'ts

### Do

- `{colors.primary}` (#3C1321)를 모든 인터랙티브 요소에 사용 — 버튼, 링크, 포커스 링, 활성 캘린더 셀 모두 단일 액센트
- 헤드라인/날짜에만 SF Pro Display, 나머지 전부 Pretendard — 폰트 역할 경계를 엄격히 유지
- 모든 Primary 버튼을 `{rounded.pill}` 형태로 — pill이 이 앱의 액션 신호
- `scale(0.97)`을 모든 버튼 active 상태에 — 터치 피드백의 일관된 micro-interaction
- 크림(#FFF9F5) + 화이트(#FFF) 서피스 교번으로 시각적 계층 표현 — 그림자 대신 색상 차이
- 캘린더 dot과 예약 카드 좌측 바에만 `{colors.accent-gold}` 사용 — 골드는 "기록이 있음"의 신호

### Don't

- 두 번째 인터랙티브 액센트 색상 추가 금지 — 모든 클릭 신호는 `{colors.primary}` 하나
- 카드/버튼에 드롭 섀도 사용 금지 — 깊이는 서피스 색상 차이로만 표현 (모달 제외)
- 기도문 본문에 SF Pro Display 사용 금지 — Display 폰트는 날짜/숫자 전용
- Body 텍스트에 weight 700 사용 금지 — 본문은 400, 강조는 600까지만
- 순수 검정(#000000) 사용 금지 — 텍스트는 항상 브라운 톤 `{colors.ink}` 또는 `{colors.body}`
- 골드를 버튼이나 링크에 사용 금지 — 골드는 상태 표시(마커/배지) 전용, 인터랙티브 요소에는 브라운만

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile (기준) | 320px–430px | 풀 레이아웃, 좌우 패딩 20px |
| Tablet | 431px–768px | 좌우 패딩 40px, 최대 너비 430px centered |
| Desktop | 769px+ | 최대 너비 430px centered, 좌우 여백 auto |

The structural breakpoint that matters most: 430px (모바일 앱 최대 너비).

### Touch Targets

- 최소 44×44px. 모든 버튼, 탭, 캘린더 셀의 tap area.
- `{component.icon-button}`: 44×44px.
- 캘린더 날짜 셀: 40×40px visible, 44×44px touch area (2px gap으로 확보).

### Collapsing Strategy

- **Nav**: 하단 탭 바 — 모든 뷰포트에서 동일 (모바일 전용 앱).
- **Calendar**: 7열 고정 — 뷰포트 너비에 따라 셀 크기만 조정.
- **Typography**: Display 36px → 32px (320px 이하).

### Image Behavior

- 이미지 없음 — 순수 UI 기반 앱. 아이콘만 SVG inline으로 사용.

---

## Agent Prompt Guide

### Quick Color Reference

| Role | Token | Hex |
|---|---|---|
| Primary CTA | `{colors.primary}` | #3C1321 |
| Page Background | `{colors.canvas}` | #FFF9F5 |
| Card Background | `{colors.surface-card}` | #FFFFFF |
| Primary Text | `{colors.ink}` | #3C1321 |
| Body Text | `{colors.body}` | #5C2E3E |
| Secondary Text | `{colors.muted}` | #9B7A85 |
| Border | `{colors.hairline}` | rgba(60,19,33,0.12) |
| Accent (markers) | `{colors.accent-gold}` | #C8902E |
| On-primary | `{colors.on-primary}` | #FFFFFF |
| Tab Bar BG | `{colors.surface-dark}` | #3C1321 |
| Focus Ring | `{colors.accent-gold}` | #C8902E (2px solid) |
| Success | `{colors.success}` | #2E7D4F |
| Error | `{colors.error}` | #C4392D |

### Example Component Prompts

- "**홈 화면 날짜**: 배경 #FFF9F5, SF Pro Display 36px/700/LH1.1/-0.02em/#3C1321, 상하 패딩 48px"
- "**저장 버튼**: 배경 #3C1321, 텍스트 #FFF/15px/600, pill radius, 패딩 14px×24px, 높이 48px, active시 scale(0.97)"
- "**기도 기록 카드**: 배경 #FFF, border 1px rgba(60,19,33,0.12), radius 12px, 패딩 24px, 이름 Pretendard 17px/600/#3C1321, 본문 16px/400/#5C2E3E"
- "**하단 탭 바**: 배경 #3C1321, 높이 64px+safe area, 아이콘 24px outline/#FFF60%, 활성 filled/#FFF + 상단 2px gold bar"
- "**캘린더 날짜 셀**: 40×40px 원형, 기본 #5C2E3E/15px, 선택시 배경 #3C1321 텍스트 #FFF, 기록있는 날 하단 6px gold dot"
- "**토글 스위치**: 48×28px pill, OFF rgba(60,19,33,0.15), ON #C8902E, thumb #FFF 24px, spring easing"
- "**저장 토스트**: 배경 #3C1321, 텍스트 #FFF, radius 16px, 하단에서 슬라이드 업 300ms ease-out, 2초 후 퇴장"

### Iteration Guide

1. 한 번에 컴포넌트 하나. `{component.button-primary}`, `{component.prayer-card}` 등으로 참조.
2. 기존 컴포넌트의 변형 (`-active`, `-focused`)은 State Matrix 테이블로 관리.
3. `{token.refs}` 사용 일관 — hex 직접 입력 금지.
4. **불변 규칙 1**: 인터랙티브 요소는 항상 `{colors.primary}` #3C1321 — 예외 없음.
5. **불변 규칙 2**: 골드(#C8902E)는 상태 마커 전용 — 버튼/링크에 사용 금지.
6. **불변 규칙 3**: 크림(#FFF9F5) + 화이트(#FFF) 외 3번째 라이트 서피스 추가 금지.

---

## Known Gaps

- Hershey 공식 사이트의 정확한 hex 값은 Figma/스타일가이드 접근 없이 추정값 — `{colors.primary}` #3C1321은 시각적 추정
- SF Pro Display 폰트의 정확한 weight axis 범위 미확인 — Black(900)만 확인됨
- Pretendard의 한글 지원 여부 미확인 — 한글은 Pretendard로 대체 전제
- Form validation / error 상태의 구체적 인터랙션(shake, inline message 등)은 미정의
- PWA 설치 배너, 오프라인 상태 UI는 별도 디자인 필요
- 캘린더 스와이프(월 전환) 애니메이션 상세 미정의
- 다크모드는 현재 스코프 외 — 추후 확장 시 Primitive 레이어에서 Alias 재매핑으로 대응 가능
