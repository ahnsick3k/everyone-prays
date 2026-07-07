# Lordbubble Prototype Orchestration Plan

## Goal

`src/app/(proto)/lordball` 프로토타입을 "주여볼"에서 "주여방울" 경험으로 전환한다.

사용자가 봤을 때 첫 인상은 무거운 구체가 아니라 가볍고 투명한 비눗방울이어야 한다. 이름 입력은 방울 내부에 직접 타이핑하는 방식이 아니라, 방울 밖 입력 영역에서 시작되고 입력된 글자가 한 글자씩 방울 안으로 빨려 들어가거나 방울 내부에서 부드럽게 나타나는 방식이어야 한다.

최종 목표는 밝은 컨셉의 첫 화면에서 기도 대상 이름을 입력하고, 그 이름이 방울 안에 담긴 뒤 "기도합니다" 액션으로 이어지는 모바일 중심 인터랙션 프로토타입이다.

## Product Direction

### Working Name

- UI 표기: `주여방울`
- 기존 `주여볼` 텍스트는 제거한다.
- 완료 상태 카운터도 `주여볼`이 아니라 `주여방울` 또는 더 자연스러운 `기도방울` 계열로 바꾼다.

### Experience Principles

- 방울은 무게감보다 투명감, 반사광, 부유감이 중요하다.
- 사용자는 "공을 채운다"가 아니라 "기도할 이름이 방울 안에 담긴다"는 감각을 받아야 한다.
- 입력은 화면 하단 또는 방울 아래쪽의 외부 입력 영역에서 한다.
- 방울 내부 텍스트는 입력 필드가 아니라 결과가 머무는 공간이다.
- 화면은 밝아야 한다. 어두운 보라/검정 중심의 현재 톤은 버린다.
- 기독교적 상징은 과하지 않게 다룬다. 십자가 폭발 같은 무거운 클라이맥스보다 빛 번짐, 잔물결, 부드러운 승화가 적합하다.

## Current State

Relevant route:

- `src/app/(proto)/lordball/page.tsx`
- `src/app/(proto)/lordball/ChromeBall.tsx`
- `src/app/(proto)/lordball/CssBall.tsx`
- `src/app/(proto)/lordball/LiquidChromeBall.tsx`
- `src/app/(proto)/lordball/lordball.module.css`

Current behavior:

- `ChromeBall` is a compatibility wrapper around `CssBall`.
- `CssBall` renders a dark plum, heavy orb through CSS layers.
- `page.tsx` uses a phase state machine:
  - `intro`
  - `intro2`
  - `home`
  - `typing`
  - `complete`
  - `submitting`
  - `done`
- The input is hidden and captured globally.
- The typed name is displayed directly inside the orb.
- Submit uses a shrinking orb and cross-light climax.

Repository notes:

- This project is Next.js 16. Follow `AGENTS.md`: read relevant local Next.js docs in `node_modules/next/dist/docs/` before code changes if a framework behavior is uncertain.
- Existing design tokens live in `src/app/globals.css`, but this route is a prototype and can use module-scoped CSS for visual exploration.
- At the time this document was written, `framer-motion` and `lucide-react` had been installed in the working tree, but package files may be uncommitted. Confirm `package.json` before implementation.

## Non-Goals

- Do not rebuild the main app navigation or landing pages.
- Do not change the `(app)` production prayer flows.
- Do not introduce server persistence.
- Do not create a full design system migration.
- Do not keep the old dark plum orb as a fallback visual unless explicitly needed for comparison.
- Do not add explanatory in-app tutorial copy. Interaction should be understandable from layout and motion.

## Recommended Implementation Strategy

### Phase 1: Rename The Concept In UI

Replace user-facing `주여볼` language.

Suggested copy:

- Main title: `누구를 위한 기도방울인가요?`
- Input placeholder: `이름을 적어주세요`
- CTA: `기도합니다`
- Done counter: `{prayCount}/{PRAY_TOTAL} 기도방울`

Avoid long instructional labels. Keep text sparse and calm.

### Phase 2: Rebuild The Visual Scene

Replace the dark stage with a light, airy scene.

Scene direction:

- Background: warm white or very light sky tint.
- Add subtle full-screen light fields through CSS gradients.
- Avoid decorative purple orbs and dark bokeh.
- The main object is the bubble itself, not background decoration.

Suggested palette:

- Canvas: `#f8fbff`
- Warm light: `#fff8ec`
- Soft blue: `#dff5ff`
- Soft mint: `#dffaf0`
- Soft rose highlight: `#ffe4ef`
- Ink: `#27313b`
- Muted: `rgba(39, 49, 59, 0.56)`
- CTA: `#27313b` or existing app brown token if brand consistency is preferred.

### Phase 3: Replace The Orb With A Soap Bubble

Keep the pure CSS rendering path unless Three.js becomes necessary. CSS is enough for this prototype and keeps behavior stable across mobile browsers.

Rename is optional but recommended:

- `CssBall.tsx` -> `PrayerBubble.tsx`
- `ChromeBall.tsx` can either import `PrayerBubble` for compatibility or be removed if all imports are updated.
- `LiquidChromeBall.tsx` can remain as a wrapper for compatibility if unused cleanup is deferred.

Bubble visual requirements:

- Mostly transparent center.
- Thin iridescent rim.
- Multiple rim highlights: cyan, rose, gold, violet in small doses.
- Internal sheen should drift slowly.
- Drop shadow should be soft and pale, not purple-heavy.
- Shape should breathe subtly: tiny scale and translate changes.
- Add tiny surface glints only on the bubble boundary.

CSS layer model:

- `.bubble`: transparent radial base, border-radius 50%, overflow hidden.
- `.bubbleRim`: conic/radial gradients for rainbow rim.
- `.bubbleSheen`: broad translucent highlight that slowly rotates/translates.
- `.bubbleCaustic`: faint internal wave or streaks.
- `.bubbleGloss`: small sharp white highlights near upper-left and right rim.
- `.bubbleName`: the settled name inside the bubble.

### Phase 4: Move Typing Outside The Bubble

The input should be visible and outside the object.

Layout recommendation:

- `root`: fixed full viewport.
- `stage`: full width, mobile max width can remain around 440px for phone prototype.
- Top: small brand/concept text.
- Center: large bubble.
- Bottom: visible input row and CTA area.

Input behavior:

- Use a real visible input.
- Keep autofocus when typing phase begins.
- On each typed character, create a transient "letter particle" that animates from the input area toward the bubble center.
- The actual settled name inside the bubble should update after a slight delay or use visual ghost letters while the input remains authoritative.

Implementation options:

- Preferred: React state tracks `name` and `letterBursts`.
- On input change:
  - Determine added characters when `nextValue.length > previousValue.length`.
  - Append burst objects for newly added characters.
  - Each burst renders an absolutely positioned character near the input and animates toward the bubble using Framer Motion.
  - Remove each burst on animation complete.
- Deletion:
  - Update `name` normally.
  - Do not animate reverse deletion unless there is time.

Bubble name behavior:

- While typing, show the current name inside the bubble with a soft fade/blur transition.
- If using bursts, keep inside text subtle until confirm.
- On confirm, make the name clearer and centered.

### Phase 5: State Machine Cleanup

The old `intro` and `intro2` phases are visually tied to "주여" echo and dark orb reveal. Replace with a smaller state machine:

Recommended phases:

```ts
type Phase = "idle" | "typing" | "ready" | "submitting" | "done";
```

State meanings:

- `idle`: initial scene, input is visible, bubble floating.
- `typing`: input focused or non-empty.
- `ready`: name has content and can be submitted.
- `submitting`: CTA pressed, bubble brightens and lifts.
- `done`: confirmation view.

Do not overfit the old timeline. The new experience should start quickly.

### Phase 6: Motion System

Use the hero interaction ideas from the reference spec as motion grammar, not as a full page copy.

Apply these patterns:

- Page elements fade/slide into view on load.
- Bubble scales up gently from below with opacity.
- Bottom input fades up after bubble appears.
- Each letter either travels into the bubble or appears inside with a clip/fade.
- Confirming the name triggers a soft ring ripple across the bubble.
- Submit makes the bubble lift slightly, brighten, and dissolve into a pale glow.

Framer Motion usage:

- Use `motion.div` for title, bubble wrapper, input row, letter bursts, CTA, done view.
- Use `AnimatePresence` for transient letter particles and phase transitions.
- Keep CSS keyframes for continuous bubble shimmer and float.

Motion timing:

- Load fade: 0.5s to 0.7s.
- Bubble reveal: 0.9s, cubic-bezier close to `[0.22, 1, 0.36, 1]`.
- Letter absorption: 0.55s to 0.75s.
- Confirm ripple: 0.8s.
- Submit transition: 1.8s to 2.4s.

### Phase 7: Done Screen

Done should stay bright and quiet.

Suggested behavior:

- Bubble moves upward or becomes smaller near the top.
- Name remains visible.
- Counter says `{prayCount}/{PRAY_TOTAL} 기도방울`.
- Add one primary action if needed later, but for this prototype it can remain a completion view.

Avoid the old cross burst. It makes the concept heavy again.

## File-Level Work Plan

### `page.tsx`

Primary rewrite target.

Tasks:

- Replace phase union with simplified phase type.
- Replace old intro timers with load-focused motion.
- Replace hidden input with visible input.
- Add `letterBursts` state.
- Add `handleNameChange`.
- Add `confirmName`.
- Add `submitPrayer`.
- Render:
  - scene header/title
  - bubble wrapper
  - visible input row
  - CTA
  - letter burst layer
  - done screen

Implementation detail:

```ts
type LetterBurst = {
  id: string;
  char: string;
  xOffset: number;
};
```

Use `crypto.randomUUID()` if available, or a ref counter for IDs to avoid hydration-sensitive randomness in render.

### `CssBall.tsx`

Either rewrite as bubble layers or replace with a new `PrayerBubble.tsx`.

Recommended minimal path:

- Keep file name for fewer import changes.
- Change component comments and class names only if also updating CSS.
- Render semantic bubble layers:

```tsx
<div className={`${styles.bubble} ${className ?? ""}`} aria-hidden="true">
  <span className={styles.bubbleRim} />
  <span className={styles.bubbleSheen} />
  <span className={styles.bubbleCaustic} />
  <span className={styles.bubbleGloss} />
</div>
```

### `ChromeBall.tsx`

Keep compatibility wrapper.

Tasks:

- Update comment from orb/chrome to prayer bubble.
- Continue returning `CssBall`.

### `LiquidChromeBall.tsx`

Optional cleanup.

Tasks:

- Update comment if touched.
- Leave wrapper if no imports depend on it.

### `lordball.module.css`

Major rewrite target.

Tasks:

- Replace dark background with light scene.
- Remove old `juyeo`, `cross`, `net`, dark orb, and internal input styles if unused.
- Add:
  - root/stage light layout
  - title and eyebrow
  - bubble wrapper
  - bubble layers
  - outside input dock
  - letter burst layer
  - CTA
  - done view
  - reduced motion overrides

Use CSS module naming around the new concept:

- `root`
- `stage`
- `ambient`
- `titleBlock`
- `bubbleWrap`
- `bubble`
- `bubbleName`
- `inputDock`
- `nameInput`
- `letterBurst`
- `cta`
- `doneView`

## Orchestration For GPT-5.4

Use GPT-5.4 as the implementation agent with this operating order:

1. Read `AGENTS.md`.
2. Read `src/app/(proto)/lordball/page.tsx`.
3. Read `src/app/(proto)/lordball/CssBall.tsx`.
4. Read `src/app/(proto)/lordball/ChromeBall.tsx`.
5. Read `src/app/(proto)/lordball/lordball.module.css`.
6. Confirm `framer-motion` and `lucide-react` are present in `package.json`.
7. Rewrite `page.tsx` for the new state machine and visible input.
8. Rewrite `CssBall.tsx` into the CSS bubble layer component.
9. Update wrapper comments in `ChromeBall.tsx` and optionally `LiquidChromeBall.tsx`.
10. Rewrite `lordball.module.css`.
11. Run lint/build checks.
12. Start dev server and inspect `/proto/lordball` on mobile and desktop widths.
13. Fix visual overlap, clipped text, and interaction bugs.
14. Commit only relevant implementation files.

Recommended implementation prompt:

```text
Implement docs/lordbubble-orchestration.md for the everyone-prays repository.

Scope:
- Only change src/app/(proto)/lordball files and package files if dependency state requires it.
- Do not touch production app flows.
- Preserve the route path /proto/lordball.
- Build a bright "주여방울" prototype with a CSS soap bubble object.
- Make name input happen outside the bubble.
- Animate newly typed characters into the bubble or reveal them inside the bubble.
- Remove the old dark orb, juyeo echo intro, cross burst, and net cage.
- Run validation and report changed files.
```

## Validation Checklist

Functional:

- `/proto/lordball` loads without runtime errors.
- Input is visible outside the bubble.
- Typing updates the input and bubble state.
- New letters animate into or appear within the bubble.
- Enter or CTA can confirm/submit the name.
- Done state uses `기도방울`/`주여방울`, not `주여볼`.

Visual:

- First viewport reads as bright.
- Bubble looks transparent and light, not like a heavy black sphere.
- Text does not overlap on 390px mobile width.
- CTA remains reachable above browser safe areas.
- Bubble remains centered and large enough on mobile.
- Desktop view does not stretch awkwardly.

Accessibility:

- Input has an accessible label.
- Button has clear text.
- Focus state is visible.
- Motion reduction path disables continuous shimmer/float where reasonable.

Engineering:

- No unused imports.
- No hydration-sensitive random values in render.
- Timers and animation cleanup are handled.
- Build/lint passes or known failures are documented.

## Risk Register

### Risk: Bubble Becomes Decorative Rather Than Functional

Mitigation:

- Keep the name visibly entering and settling inside the bubble.
- Bubble must react to input and submit states.

### Risk: CSS Bubble Looks Like Another Gradient Orb

Mitigation:

- Use transparency, rim, glints, and pale shadows.
- Avoid a filled dark center.
- Keep interior mostly clear.

### Risk: Letter Absorption Feels Mechanically Inaccurate

Mitigation:

- Use a short particle animation as a perceptual cue rather than pixel-perfect path tracking.
- Prioritize rhythm and readability over physical realism.

### Risk: Mobile Keyboard Breaks Layout

Mitigation:

- Keep input dock near bottom but not fixed to unsafe viewport assumptions.
- Test with mobile viewport and focused input.
- Use `100dvh` where possible.

### Risk: Existing Package Changes Pollute Commit

Mitigation:

- Before implementation commit, inspect `git status --short`.
- Commit only files required for the prototype.
- If package files already include `framer-motion` and `lucide-react`, include them only when the implementation imports those packages.

## Definition Of Done

The work is done when:

- The old heavy "주여볼" identity is no longer present in the prototype UI.
- The route presents a bright, mobile-first "주여방울" experience.
- The main object reads as a soap bubble.
- Input happens outside the bubble.
- Typed characters visibly transition into or appear inside the bubble.
- The submit flow completes into a quiet done state.
- Lint/build status is known.
- A developer can explain the changed files and interaction flow in under one minute.
