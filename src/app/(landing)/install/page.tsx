'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DevicePhoneMobileIcon,
  ArrowUpOnSquareIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';

export default function InstallPage() {
  const [device, setDevice] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) {
      setDevice('ios');
    } else if (/Android/.test(ua)) {
      setDevice('android');
    } else {
      setDevice('desktop');
    }
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="landing-hero">
        <DevicePhoneMobileIcon className="landing-hero-icon" />
        <h1 className="landing-hero-title">설치 안내</h1>
        <p className="landing-hero-desc">
          앱스토어 없이, 지금 바로<br />홈 화면에 설치할 수 있어요!
        </p>

        {/* 자동 감지 배지 */}
        <div className="landing-detect-badge">
          {device === 'ios' && (
            <><DevicePhoneMobileIcon className="landing-detect-icon" /> iPhone을 사용하고 계시네요!</>
          )}
          {device === 'android' && (
            <><DevicePhoneMobileIcon className="landing-detect-icon" /> Android를 사용하고 계시네요!</>
          )}
          {device === 'desktop' && (
            <><ComputerDesktopIcon className="landing-detect-icon" /> PC에서 접속 중이시네요! 모바일로 접속하면 앱처럼 설치할 수 있어요.</>
          )}
        </div>
      </section>

      {/* iPhone 설치 */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <DevicePhoneMobileIcon className="landing-section-icon" />
            <h2 className="landing-section-title">iPhone에서 설치하기</h2>
            <p className="landing-section-subtitle">Safari 브라우저를 사용해주세요</p>
          </div>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-num">1</div>
              <div className="landing-step-body">
                <h3>Safari로 접속하세요</h3>
                <p>꼭 <strong>Safari</strong> 브라우저로 열어야 해요. 카카오톡이나 Chrome에서는 설치가 안 돼요!</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <div className="landing-step-body">
                <h3>공유 버튼을 누르세요</h3>
                <p>화면 맨 아래에 있는 <span className="landing-inline-icon"><ArrowUpOnSquareIcon style={{ width: 16, height: 16 }} /></span> 모양 버튼이에요.</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <div className="landing-step-body">
                <h3>&ldquo;홈 화면에 추가&rdquo;를 누르세요</h3>
                <p>아래로 스크롤하면 <span className="landing-inline-icon"><PlusCircleIcon style={{ width: 16, height: 16 }} /></span> 홈 화면에 추가가 보여요.</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">4</div>
              <div className="landing-step-body">
                <h3>오른쪽 위 &ldquo;추가&rdquo;를 누르세요</h3>
                <p>끝! 홈 화면에 앱 아이콘이 생겨요.</p>
                <CheckCircleIcon className="landing-step-done-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Android 설치 */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <DevicePhoneMobileIcon className="landing-section-icon" />
            <h2 className="landing-section-title">Android에서 설치하기</h2>
            <p className="landing-section-subtitle">Chrome 브라우저를 사용해주세요</p>
          </div>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-num">1</div>
              <div className="landing-step-body">
                <h3>Chrome으로 접속하세요</h3>
                <p>기본 브라우저인 <strong>Chrome</strong>으로 열어주세요.</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">2</div>
              <div className="landing-step-body">
                <h3>&ldquo;앱 설치&rdquo; 배너가 뜨면 눌러주세요</h3>
                <p>화면 아래에 &ldquo;앱 설치&rdquo; 안내가 자동으로 나와요.</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">3</div>
              <div className="landing-step-body">
                <h3>안 뜬다면?</h3>
                <p>오른쪽 위 <span className="landing-inline-icon"><EllipsisVerticalIcon style={{ width: 16, height: 16 }} /></span> 메뉴에서 <strong>앱 설치</strong> 또는 <strong>홈 화면에 추가</strong>를 선택하세요.</p>
              </div>
            </div>
            <div className="landing-step">
              <div className="landing-step-num">4</div>
              <div className="landing-step-body">
                <h3>&ldquo;설치&rdquo;를 누르면 끝!</h3>
                <p>홈 화면에 앱 아이콘이 생겨요.</p>
                <CheckCircleIcon className="landing-step-done-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <QuestionMarkCircleIcon className="landing-section-icon" />
            <h2 className="landing-section-title">자주 묻는 질문</h2>
          </div>

          <div className="landing-faq-grid">
            <div className="landing-faq-card">
              <h3>앱스토어에서 다운받는 건가요?</h3>
              <p>아니에요! 웹사이트를 앱처럼 설치하는 거라서 앱스토어가 필요 없어요. 용량도 거의 안 차지해요.</p>
            </div>
            <div className="landing-faq-card">
              <h3>데이터는 어디에 저장되나요?</h3>
              <p>내 폰 안에만 저장돼요. 서버에 올라가지 않아서 안전해요.</p>
            </div>
            <div className="landing-faq-card">
              <h3>알림은 어떻게 받나요?</h3>
              <p>앱을 설치한 뒤, 홈 화면에서 알림 토글을 켜면 매일 정해진 시간에 기도 알림을 받을 수 있어요.</p>
            </div>
            <div className="landing-faq-card">
              <h3>삭제하고 싶으면요?</h3>
              <p>일반 앱처럼 아이콘을 길게 누르고 삭제하면 돼요!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section">
        <h2>지금 바로 시작해보세요</h2>
        <p>오늘 떠오르는 한 사람을 위해,<br />짧은 기도 한 줄이면 충분합니다.</p>
        <Link href="/" className="landing-cta-btn">기도 시작하기</Link>
      </section>
    </>
  );
}
