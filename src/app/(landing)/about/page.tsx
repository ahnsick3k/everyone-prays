'use client';

import Link from 'next/link';
import { useLang } from '@/contexts/LangContext';
import {
  PencilSquareIcon,
  BellIcon,
  CalendarDaysIcon,
  LockClosedIcon,
  LightBulbIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const t = {
  ko: {
    heroDesc: <>생각나는 그 사람을 위한<br />하루 1번의 중보기도</>,
    featuresTitle: '이런 것들을 할 수 있어요',
    features: [
      { title: '기도를 기록하세요', desc: '누구를 위해, 무엇을 기도했는지 매일 기록할 수 있어요. 짧은 한 줄이라도 괜찮아요.', Icon: PencilSquareIcon },
      { title: '매일 알림을 받으세요', desc: '원하는 시간에 기도 알림을 설정하면, 잊지 않고 기도할 수 있어요.', Icon: BellIcon },
      { title: '기도 캘린더', desc: '언제, 누구를 위해 기도했는지 한눈에 볼 수 있어요. 꾸준히 쌓이는 기도의 흔적을 확인하세요.', Icon: CalendarDaysIcon },
      { title: '내 폰에만 저장', desc: '기도 내용은 서버에 올라가지 않아요. 오직 내 기기 안에서만 안전하게 보관됩니다.', Icon: LockClosedIcon },
    ],
    storyTitle: '이런 마음으로 만들었어요',
    storyParagraphs: [
      <>&ldquo;그 사람을 위해 기도해야지&rdquo; 생각하면서도, 바쁜 하루에 잊어버리곤 했어요.</>,
      <>EVERY 1 PRAY는 <strong>하루 1번, 딱 1명</strong>이라도 기억하고 기도하자는 마음에서 시작됐어요.</>,
      <>거창하지 않아도 괜찮아요.<br />오늘 떠오르는 한 사람을 위해, 짧은 기도 한 줄이면 충분합니다.</>,
    ],
    ctaTitle: '지금 바로 시작해보세요',
    ctaDesc: '앱스토어 없이, 홈 화면에 바로 설치하세요.',
    ctaBtn: '기도 시작하기',
    ctaInstall: '설치 방법 보기',
  },
  en: {
    heroDesc: <>One intercessory prayer a day<br />for someone on your mind</>,
    featuresTitle: 'What you can do',
    features: [
      { title: 'Record your prayers', desc: 'Write down who you prayed for and what you prayed about. Even a short line is enough.', Icon: PencilSquareIcon },
      { title: 'Get daily reminders', desc: 'Set a prayer reminder at your preferred time so you never forget.', Icon: BellIcon },
      { title: 'Prayer calendar', desc: 'See at a glance when and for whom you prayed. Watch your prayer journey grow.', Icon: CalendarDaysIcon },
      { title: 'Stored on your device only', desc: 'Your prayers never leave your device. Everything stays private and secure.', Icon: LockClosedIcon },
    ],
    storyTitle: 'Why we made this',
    storyParagraphs: [
      <>We\u2019d think \u201CI should pray for them\u201D but forget in the busyness of the day.</>,
      <>EVERY 1 PRAY started from a simple wish: to remember and pray for <strong>just one person, once a day</strong>.</>,
      <>It doesn\u2019t have to be grand.<br />A short prayer for that one person on your mind today is more than enough.</>,
    ],
    ctaTitle: 'Get started now',
    ctaDesc: 'Install to your home screen — no app store needed.',
    ctaBtn: 'Start Praying',
    ctaInstall: 'How to Install',
  },
};

export default function AboutPage() {
  const { lang } = useLang();
  const s = t[lang];

  return (
    <>
      <section className="landing-hero">
        <HeartIcon className="landing-hero-icon" />
        <h1 className="landing-hero-title">EVERY 1 PRAY</h1>
        <p className="landing-hero-desc">{s.heroDesc}</p>
      </section>

      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <h2 className="landing-section-title">{s.featuresTitle}</h2>
          </div>
          <div className="landing-feature-grid">
            {s.features.map((f, i) => (
              <div className="landing-feature-card" key={i}>
                <f.Icon className="landing-feature-icon" />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <LightBulbIcon className="landing-section-icon" />
            <h2 className="landing-section-title">{s.storyTitle}</h2>
          </div>
          <div className="landing-story-card">
            {s.storyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="landing-cta-section">
        <h2>{s.ctaTitle}</h2>
        <p>{s.ctaDesc}</p>
        <div className="landing-cta-buttons">
          <Link href="/" className="landing-cta-btn">{s.ctaBtn}</Link>
          <Link href="/install" className="landing-cta-btn-outline">{s.ctaInstall}</Link>
        </div>
      </section>
    </>
  );
}
