# Firebase 설정 파일 추가 방법

Firebase Console (https://console.firebase.google.com) 에서 프로젝트 생성 후 아래 파일을 각 위치에 추가하세요.

## iOS — GoogleService-Info.plist
1. Firebase Console > 프로젝트 설정 > iOS 앱 추가
2. Bundle ID: `app.every1pray` 입력
3. `GoogleService-Info.plist` 다운로드
4. Xcode에서 `ios/App/App/` 폴더에 드래그 앤 드롭
   - "Copy items if needed" 체크
   - Target: App 체크

## Android — google-services.json
1. Firebase Console > 프로젝트 설정 > Android 앱 추가
2. 패키지명: `app.every1pray` 입력
3. `google-services.json` 다운로드
4. `android/app/google-services.json` 위치에 저장

## 웹 (.env.local)
1. `.env.example` 파일을 `.env.local` 로 복사
2. Firebase Console > 프로젝트 설정 > 일반 > 내 앱 의 SDK 설정 값 입력
3. 웹 푸시 VAPID 키: Firebase Console > 클라우드 메시징 > 웹 구성 에서 발급

⚠️ 이 파일들은 절대 git에 커밋하지 마세요 (.gitignore에 포함됨)
