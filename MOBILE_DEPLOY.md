# 📱 every1pray — 모바일 앱 배포 준비 현황

> 최종 업데이트: 2026-06-18

---

## 앱 기본 정보

| 항목 | 값 |
|------|-----|
| 앱 이름 | `every1pray` |
| Bundle ID (iOS) | `app.every1pray` |
| Application ID (Android) | `app.every1pray` |
| 웹 서버 URL | `https://hugging.kr` (Vercel) |
| Capacitor 버전 | 8.x |
| 배포 방식 | Capacitor (WebView + Live URL) |

---

## ✅ 완료된 작업

### 공통
- [x] `capacitor.config.ts` 루트 생성
- [x] `next.config.ts` — `output: 'export'` 정적 빌드 설정
- [x] `package.json` — `@capacitor/cli`, `@capacitor/assets`, `@capacitor/splash-screen` 추가
- [x] 빌드 스크립트 추가: `build:static`, `cap:sync`, `cap:ios`, `cap:android`
- [x] 앱 아이콘 소스 생성 (`assets/icon.png` 1024×1024)
- [x] 스플래시 소스 생성 (`assets/splash.png` 2732×2732)
- [x] 전 해상도 아이콘 자동 생성 (`@capacitor/assets generate`)
- [x] Android 키스토어 생성 (`android-keystore/every1pray-release.keystore`)
- [x] `.gitignore`에 키스토어 제외 추가

### iOS
- [x] Xcode 프로젝트 생성 (`npx cap add ios`)
- [x] 앱 아이콘 생성 (AppIcon.appiconset)
- [x] 스플래시 이미지 생성 (Assets.xcassets/Splash.imageset)
- [x] Splash "unassigned children" 경고 수정
- [x] `Info.plist` 앱 이름 → `every1pray`
- [x] Bundle ID → `app.every1pray`

### Android
- [x] Android 프로젝트 생성 (`npx cap add android`)
- [x] 전 해상도 아이콘 생성 (ldpi ~ xxxhdpi)
- [x] 스플래시 이미지 생성 (portrait/landscape/dark 전체)
- [x] `build.gradle` Release 서명 설정 완료
- [x] **Release AAB 빌드 완료** (`android/app/release/app-release.aab`)
- [x] Google Play Console 계정 등록 ($25 결제 완료)

---

## ⏳ 대기 중

| 항목 | 상태 |
|------|------|
| Apple Developer Program 승인 | 결제 완료, 승인 대기 중 |
| Google Play Console 계정 인증 | 등록 완료, 인증 대기 중 |

---

## 🔜 남은 작업 (계정 승인 후)

### iOS
- [ ] Xcode Team → Personal Team → 유료 계정으로 변경
- [ ] Push Notifications Capability 추가
- [ ] Background Modes → Remote notifications 체크
- [ ] Firebase `GoogleService-Info.plist` 추가
- [ ] Archive 빌드 → App Store Connect 업로드
- [ ] TestFlight 내부 테스트
- [ ] App Store 심사 제출

### Android
- [ ] Google Play Console → 앱 만들기 (`every1pray`)
- [ ] `app-release.aab` 업로드 (내부 테스트 트랙)
- [ ] Firebase `google-services.json` 추가
- [ ] 스토어 등록 정보 작성 (설명, 스크린샷)
- [ ] 개인정보처리방침 URL 등록
- [ ] 프로덕션 출시

---

## 🔑 키스토어 정보 (별도 안전 보관 필요)

> ⚠️ 키스토어 파일은 git에 포함되지 않습니다. iCloud에 보관됨.

| 항목 | 값 |
|------|-----|
| 파일 위치 | `android-keystore/every1pray-release.keystore` |
| Alias | `every1pray` |
| 유효기간 | 10,000일 (~27년) |

---

## 📦 주요 패키지

```json
"@capacitor/core": "^8.4.0",
"@capacitor/ios": "^8.x",
"@capacitor/android": "^8.x",
"@capacitor/push-notifications": "^8.1.1",
"@capacitor/splash-screen": "^8.0.1",
"firebase": "^12.14.0"
```

---

## 🚀 배포 플로우 (코드 수정 시)

```bash
# 1. 웹 빌드
npm run build

# 2. 네이티브 프로젝트에 반영
npx cap sync

# 3. iOS — Xcode에서 Archive → App Store Connect
npm run cap:ios

# 4. Android — Android Studio에서 Generate Signed Bundle
npm run cap:android
```
