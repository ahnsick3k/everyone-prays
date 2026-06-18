<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## 📱 모바일 배포 컨텍스트 (2026-06-18 작업)

이 프로젝트는 **iOS App Store + Google Play Store** 배포를 준비 중입니다.
작업 전 아래 문서를 반드시 읽으세요:

| 문서 | 내용 |
|------|------|
| [`MOBILE_DEPLOY.md`](./MOBILE_DEPLOY.md) | 전체 배포 현황 및 남은 작업 |
| [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) | Firebase 설정 파일 추가 방법 |
| [`APP_STORE_LISTING.md`](./APP_STORE_LISTING.md) | 앱 설명문, 키워드, 스크린샷 가이드 |
| [`.env.example`](./.env.example) | Firebase 환경변수 템플릿 |

## 프로젝트 핵심 정보

- **앱 이름**: every1pray
- **Bundle ID**: `app.every1pray`
- **배포 방식**: Capacitor 8.x (WebView + Live URL)
- **서버 URL**: `https://hugging.kr/every1pray`
- **개인정보처리방침**: `https://hugging.kr/every1pray/privacy`

## 라우트 구조

```
/every1pray          ← 앱 메인 (기도 입력)
/every1pray/calendar ← 캘린더
/every1pray/reservation ← 예약 알림
/every1pray/about    ← 소개 (랜딩)
/every1pray/install  ← 설치 방법 (랜딩)
/every1pray/privacy  ← 개인정보처리방침
/                    → /every1pray 리다이렉트
```

## 주요 파일 위치

```
src/lib/firebase.ts     — Firebase 초기화
src/lib/push.ts         — Capacitor 푸시 알림
src/lib/notification.ts — 웹 푸시 알림
src/lib/db.ts           — Dexie (로컬 DB)
ios/                    — Xcode 프로젝트
android/                — Android Studio 프로젝트
assets/                 — 아이콘/스플래시 소스 이미지
capacitor.config.ts     — Capacitor 설정
```

## ⚠️ 주의사항

- `android-keystore/` 폴더는 git에 없음 — iCloud에만 보관
- Firebase 설정 파일 (`GoogleService-Info.plist`, `google-services.json`, `.env.local`) 은 git에 커밋 금지
- 링크 수정 시 반드시 `/every1pray` 접두사 유지
- Capacitor 웹 변경 후 반드시 `npx cap sync` 실행

