'use client';

import { useLang } from '@/contexts/LangContext';

const t = {
  ko: {
    title: '개인정보처리방침',
    updated: '최종 업데이트: 2026년 6월 18일',
    sections: [
      {
        heading: '1. 수집하는 개인정보',
        body: 'every1pray는 서버에 개인정보를 수집하거나 저장하지 않습니다. 기도 기록, 알림 설정 등 모든 데이터는 사용자의 기기 내부에만 저장됩니다.',
      },
      {
        heading: '2. 푸시 알림',
        body: '사용자가 알림을 허용한 경우, Firebase Cloud Messaging(FCM)을 통해 기도 알림을 전송합니다. 이 과정에서 기기 토큰이 Firebase 서버에 전달될 수 있으나, 해당 정보는 알림 전송 목적으로만 사용되며 HUG CENTER는 이 토큰을 별도로 수집하거나 보관하지 않습니다.',
      },
      {
        heading: '3. 제3자 서비스',
        body: '본 앱은 다음 제3자 서비스를 사용합니다.\n• Firebase (Google LLC) — 푸시 알림 전송\n\nFirebase 개인정보처리방침: https://firebase.google.com/support/privacy',
      },
      {
        heading: '4. 데이터 보관 및 삭제',
        body: '모든 기도 기록은 사용자의 기기에만 저장됩니다. 앱을 삭제하면 모든 데이터가 함께 삭제됩니다. HUG CENTER는 사용자의 기도 내용에 접근할 수 없습니다.',
      },
      {
        heading: '5. 미성년자 보호',
        body: '본 앱은 만 14세 미만 아동을 대상으로 개인정보를 수집하지 않습니다.',
      },
      {
        heading: '6. 방침 변경',
        body: '본 방침이 변경될 경우 앱 내 공지 또는 본 페이지를 통해 안내드립니다.',
      },
      {
        heading: '7. 문의',
        body: '개인정보 관련 문의는 아래로 연락해 주세요.\n운영자: HUG CENTER\n이메일: ahnsick@proton.me',
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 18, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'every1pray does not collect or store any personal information on our servers. All data including prayer records and notification settings is stored locally on your device only.',
      },
      {
        heading: '2. Push Notifications',
        body: 'If you enable notifications, we use Firebase Cloud Messaging (FCM) to send prayer reminders. Your device token may be transmitted to Firebase servers solely for the purpose of delivering notifications. HUG CENTER does not separately collect or retain this token.',
      },
      {
        heading: '3. Third-Party Services',
        body: 'This app uses the following third-party services:\n• Firebase (Google LLC) — push notification delivery\n\nFirebase Privacy Policy: https://firebase.google.com/support/privacy',
      },
      {
        heading: '4. Data Retention & Deletion',
        body: 'All prayer records are stored only on your device. Uninstalling the app permanently deletes all data. HUG CENTER has no access to your prayer content.',
      },
      {
        heading: "5. Children's Privacy",
        body: 'This app does not knowingly collect personal information from children under 14.',
      },
      {
        heading: '6. Changes to This Policy',
        body: 'If this policy changes, we will notify you through an in-app notice or by updating this page.',
      },
      {
        heading: '7. Contact',
        body: 'For privacy-related inquiries, please contact:\nOperator: HUG CENTER\nEmail: ahnsick@proton.me',
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useLang();
  const s = t[lang];

  return (
    <section className="landing-section" style={{ minHeight: '80vh' }}>
      <div className="landing-section-inner" style={{ maxWidth: '720px' }}>
        <div className="landing-section-header">
          <h1 className="landing-section-title">{s.title}</h1>
          <p style={{ fontSize: '0.875rem', opacity: 0.5, marginTop: '0.5rem' }}>{s.updated}</p>
        </div>
        <div className="landing-story-card" style={{ gap: '2rem' }}>
          {s.sections.map((sec, i) => (
            <div key={i}>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{sec.heading}</h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8, opacity: 0.8 }}>{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
