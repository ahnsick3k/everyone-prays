'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    <div className="static-page">
      <Link href="/" className="back-link">← 돌아가기</Link>

      <h1 className="page-title">📲 설치 안내</h1>
      <p className="page-subtitle">
        EVERY 1 PRAY는 앱스토어 없이,<br />
        지금 바로 홈 화면에 설치할 수 있어요!
      </p>

      {/* 자동 감지 안내 */}
      <div className="install-auto-detect">
        {device === 'ios' && '🍎 iPhone을 사용하고 계시네요!'}
        {device === 'android' && '🤖 Android를 사용하고 계시네요!'}
        {device === 'desktop' && '🖥️ PC에서 접속 중이시네요! 모바일로 접속하면 앱처럼 설치할 수 있어요.'}
      </div>

      {/* iPhone 설치 방법 */}
      <section className="install-section">
        <h2 className="section-title">🍎 iPhone (Safari)</h2>
        <div className="step-list">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Safari로 접속하세요</strong>
              <p>꼭 <em>Safari</em> 브라우저로 열어야 해요.<br />카카오톡이나 Chrome에서는 설치가 안 돼요!</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>아래쪽 공유 버튼을 누르세요</strong>
              <p>화면 맨 아래에 있는 <span className="icon-badge">⬆️</span> 모양 버튼이에요.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>&quot;홈 화면에 추가&quot;를 누르세요</strong>
              <p>아래로 스크롤하면 <span className="icon-badge">＋ 홈 화면에 추가</span>가 보여요.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>오른쪽 위 &quot;추가&quot; 버튼을 누르세요</strong>
              <p>끝! 🎉 홈 화면에 앱 아이콘이 생겨요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Android 설치 방법 */}
      <section className="install-section">
        <h2 className="section-title">🤖 Android (Chrome)</h2>
        <div className="step-list">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <strong>Chrome 브라우저로 접속하세요</strong>
              <p>기본 브라우저인 Chrome으로 열어주세요.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <strong>&quot;앱 설치&quot; 배너가 뜨면 눌러주세요</strong>
              <p>화면 아래에 &quot;앱 설치&quot; 안내가 자동으로 나와요.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <strong>안 뜬다면? 오른쪽 위 <span className="icon-badge">⋮</span> 메뉴를 누르세요</strong>
              <p>메뉴에서 <span className="icon-badge">앱 설치</span> 또는 <span className="icon-badge">홈 화면에 추가</span>를 선택하세요.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <strong>&quot;설치&quot;를 누르면 끝!</strong>
              <p>🎉 홈 화면에 앱 아이콘이 생겨요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="install-section">
        <h2 className="section-title">❓ 자주 묻는 질문</h2>
        <div className="faq-list">
          <div className="faq-item">
            <strong>Q. 앱스토어에서 다운받는 거 아니에요?</strong>
            <p>아니에요! 웹사이트를 앱처럼 설치하는 거라서 앱스토어가 필요 없어요. 용량도 거의 안 차지해요.</p>
          </div>
          <div className="faq-item">
            <strong>Q. 데이터는 어디에 저장되나요?</strong>
            <p>내 폰 안에만 저장돼요. 서버에 올라가지 않아서 안전해요.</p>
          </div>
          <div className="faq-item">
            <strong>Q. 알림은 어떻게 받나요?</strong>
            <p>앱을 설치한 뒤, 홈 화면에서 알림 토글을 켜면 매일 정해진 시간에 기도 알림을 받을 수 있어요.</p>
          </div>
          <div className="faq-item">
            <strong>Q. 삭제하고 싶으면요?</strong>
            <p>일반 앱처럼 아이콘을 길게 누르고 삭제하면 돼요!</p>
          </div>
        </div>
      </section>
    </div>
  );
}
