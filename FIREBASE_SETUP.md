# Firebase 설정 파일 추가 방법

Firebase Console (https://console.firebase.google.com) 에서 프로젝트 생성 후 아래 파일을 각 위치에 추가하세요.

## iOS — GoogleService-Info.plist
1. Firebase Console > 프로젝트 설정 > iOS 앱 추가
2. Bundle ID: `app.every1pray` 입력
3. `GoogleService-Info.plist` 다운로드
4. Xcode에서 `ios/App/App/` 폴더에 드래그 앤 드롭
   - "Copy items if needed" 체크
   - Target: App 체크
5. Firebase Console > 프로젝트 설정 > 클라우드 메시징
6. Apple Developer 에서 만든 **APNs Auth Key (.p8)** 를 Firebase에 업로드
   - Key ID, Team ID 함께 입력
   - 이 단계가 없으면 iOS 푸시가 오지 않습니다.

## Android — google-services.json
1. Firebase Console > 프로젝트 설정 > Android 앱 추가
2. 패키지명: `app.every1pray` 입력
3. `google-services.json` 다운로드
4. `android/app/google-services.json` 위치에 저장

## 웹 (.env.local)
1. `.env.example` 파일을 `.env.local` 로 복사
2. Firebase Console > 프로젝트 설정 > 일반 > 내 앱 의 SDK 설정 값 입력
3. 웹 푸시 VAPID 키: Firebase Console > 클라우드 메시징 > 웹 구성 에서 발급
4. Firebase Console > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성
5. 다운로드한 JSON 에서 아래 3개 값을 `.env.local` 에 추가
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
6. `FIREBASE_PRIVATE_KEY` 는 줄바꿈을 `\n` 형태로 넣어야 합니다

⚠️ 이 파일들은 절대 git에 커밋하지 마세요 (.gitignore에 포함됨)
