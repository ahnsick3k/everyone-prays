'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLang } from '@/contexts/LangContext';
import {
  DevicePhoneMobileIcon,
  ArrowUpOnSquareIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

const t = {
  ko: {
    heroTitle: '설치 안내',
    heroDesc: <>앱스토어 없이, 지금 바로<br />홈 화면에 설치할 수 있어요!</>,
    detectIos: 'iPhone을 사용하고 계시네요!',
    detectAndroid: 'Android를 사용하고 계시네요!',
    detectDesktop: 'PC에서 접속 중이시네요! 모바일로 접속하면 앱처럼 설치할 수 있어요.',
    iosTitle: 'iPhone에서 설치하기',
    iosSub: 'Safari 브라우저를 사용해주세요',
    iosSteps: [
      { title: 'Safari로 접속하세요', desc: <>꼭 <strong>Safari</strong> 브라우저로 열어야 해요. 카카오톡이나 Chrome에서는 설치가 안 돼요!</> },
      { title: '공유 버튼을 누르세요', desc: '화면 맨 아래에 있는 공유 버튼이에요.', hasShareIcon: true },
      { title: '\u201C홈 화면에 추가\u201D를 누르세요', desc: '아래로 스크롤하면 홈 화면에 추가가 보여요.', hasPlusIcon: true },
      { title: '오른쪽 위 \u201C추가\u201D를 누르세요', desc: '끝! 홈 화면에 앱 아이콘이 생겨요.', done: true },
    ],
    androidTitle: 'Android에서 설치하기',
    androidSub: 'Chrome 브라우저를 사용해주세요',
    androidSteps: [
      { title: 'Chrome으로 접속하세요', desc: <>기본 브라우저인 <strong>Chrome</strong>으로 열어주세요.</> },
      { title: '\u201C앱 설치\u201D 배너가 뜨면 눌러주세요', desc: '화면 아래에 \u201C앱 설치\u201D 안내가 자동으로 나와요.' },
      { title: '안 뜬다면?', desc: '메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요.', hasMenuIcon: true },
      { title: '\u201C설치\u201D를 누르면 끝!', desc: '홈 화면에 앱 아이콘이 생겨요.', done: true },
    ],
    faqTitle: '자주 묻는 질문',
    faqs: [
      { q: '앱스토어에서 다운받는 건가요?', a: '아니에요! 웹사이트를 앱처럼 설치하는 거라서 앱스토어가 필요 없어요. 용량도 거의 안 차지해요.' },
      { q: '데이터는 어디에 저장되나요?', a: '내 폰 안에만 저장돼요. 서버에 올라가지 않아서 안전해요.' },
      { q: '알림은 어떻게 받나요?', a: '앱을 설치한 뒤, 홈 화면에서 알림 토글을 켜면 매일 정해진 시간에 기도 알림을 받을 수 있어요.' },
      { q: '삭제하고 싶으면요?', a: '일반 앱처럼 아이콘을 길게 누르고 삭제하면 돼요!' },
    ],
    ctaTitle: '지금 바로 시작해보세요',
    ctaDesc: <>오늘 떠오르는 한 사람을 위해,<br />짧은 기도 한 줄이면 충분합니다.</>,
    ctaBtn: '기도 시작하기',
  },
  en: {
    heroTitle: 'How to Install',
    heroDesc: <>Install directly to your home screen<br />— no app store needed!</>,
    detectIos: 'You\u2019re using an iPhone!',
    detectAndroid: 'You\u2019re using Android!',
    detectDesktop: 'You\u2019re on a PC! Visit on mobile to install as an app.',
    iosTitle: 'Install on iPhone',
    iosSub: 'Use the Safari browser',
    iosSteps: [
      { title: 'Open in Safari', desc: <>You must use <strong>Safari</strong>. It won\u2019t work from KakaoTalk or Chrome.</> },
      { title: 'Tap the Share button', desc: 'It\u2019s the button at the bottom of the screen.', hasShareIcon: true },
      { title: 'Tap \u201CAdd to Home Screen\u201D', desc: 'Scroll down to find it.', hasPlusIcon: true },
      { title: 'Tap \u201CAdd\u201D in the top right', desc: 'Done! The app icon appears on your home screen.', done: true },
    ],
    androidTitle: 'Install on Android',
    androidSub: 'Use the Chrome browser',
    androidSteps: [
      { title: 'Open in Chrome', desc: <>Use the default <strong>Chrome</strong> browser.</> },
      { title: 'Tap the \u201CInstall App\u201D banner', desc: 'An install prompt appears automatically at the bottom.' },
      { title: 'Don\u2019t see it?', desc: 'Tap the menu icon, then select \u201CInstall App\u201D or \u201CAdd to Home Screen.\u201D', hasMenuIcon: true },
      { title: 'Tap \u201CInstall\u201D and you\u2019re done!', desc: 'The app icon appears on your home screen.', done: true },
    ],
    faqTitle: 'FAQ',
    faqs: [
      { q: 'Do I download it from an app store?', a: 'No! It installs like a web app — no app store required. It takes almost no storage.' },
      { q: 'Where is my data stored?', a: 'Only on your device. Nothing is sent to a server, so it\u2019s completely private.' },
      { q: 'How do I get notifications?', a: 'After installing, turn on the notification toggle to receive daily prayer reminders.' },
      { q: 'How do I delete it?', a: 'Just long-press the icon and delete it like any other app!' },
    ],
    ctaTitle: 'Get started now',
    ctaDesc: <>For that one person on your mind today,<br />a short prayer is all it takes.</>,
    ctaBtn: 'Start Praying',
  },
};

export default function InstallPage() {
  const { lang } = useLang();
  const s = t[lang];
  const [device, setDevice] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) setDevice('ios');
    else if (/Android/.test(ua)) setDevice('android');
    else setDevice('desktop');
  }, []);

  return (
    <>
      <section className="landing-hero">
        <DevicePhoneMobileIcon className="landing-hero-icon" />
        <h1 className="landing-hero-title">{s.heroTitle}</h1>
        <p className="landing-hero-desc">{s.heroDesc}</p>
        <div className="landing-detect-badge">
          {device === 'ios' && <><DevicePhoneMobileIcon className="landing-detect-icon" /> {s.detectIos}</>}
          {device === 'android' && <><DevicePhoneMobileIcon className="landing-detect-icon" /> {s.detectAndroid}</>}
          {device === 'desktop' && <><ComputerDesktopIcon className="landing-detect-icon" /> {s.detectDesktop}</>}
        </div>
      </section>

      {/* iPhone */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <DevicePhoneMobileIcon className="landing-section-icon" />
            <h2 className="landing-section-title">{s.iosTitle}</h2>
            <p className="landing-section-subtitle">{s.iosSub}</p>
          </div>
          <div className="landing-steps">
            {s.iosSteps.map((step, i) => (
              <div className="landing-step" key={i}>
                <div className="landing-step-num">{i + 1}</div>
                <div className="landing-step-body">
                  <h3>{step.title}</h3>
                  <p>
                    {step.hasShareIcon && <span className="landing-inline-icon"><ArrowUpOnSquareIcon style={{ width: 16, height: 16 }} /></span>}
                    {step.hasPlusIcon && <span className="landing-inline-icon"><PlusCircleIcon style={{ width: 16, height: 16 }} /></span>}
                    {' '}{step.desc}
                  </p>
                  {step.done && <CheckCircleIcon className="landing-step-done-icon" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Android */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <DevicePhoneMobileIcon className="landing-section-icon" />
            <h2 className="landing-section-title">{s.androidTitle}</h2>
            <p className="landing-section-subtitle">{s.androidSub}</p>
          </div>
          <div className="landing-steps">
            {s.androidSteps.map((step, i) => (
              <div className="landing-step" key={i}>
                <div className="landing-step-num">{i + 1}</div>
                <div className="landing-step-body">
                  <h3>{step.title}</h3>
                  <p>
                    {step.hasMenuIcon && <span className="landing-inline-icon"><EllipsisVerticalIcon style={{ width: 16, height: 16 }} /></span>}
                    {' '}{step.desc}
                  </p>
                  {step.done && <CheckCircleIcon className="landing-step-done-icon" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <QuestionMarkCircleIcon className="landing-section-icon" />
            <h2 className="landing-section-title">{s.faqTitle}</h2>
          </div>
          <div className="landing-faq-grid">
            {s.faqs.map((faq, i) => (
              <div className="landing-faq-card" key={i}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section">
        <h2>{s.ctaTitle}</h2>
        <p>{s.ctaDesc}</p>
        <Link href="/" className="landing-cta-btn">{s.ctaBtn}</Link>
      </section>
    </>
  );
}
