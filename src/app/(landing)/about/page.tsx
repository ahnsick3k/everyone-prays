import Link from 'next/link';
import {
  PencilSquareIcon,
  BellIcon,
  CalendarDaysIcon,
  LockClosedIcon,
  LightBulbIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="landing-hero">
        <HeartIcon className="landing-hero-icon" />
        <h1 className="landing-hero-title">EVERY 1 PRAY</h1>
        <p className="landing-hero-desc">
          생각나는 그 사람을 위한<br />하루 1번의 중보기도
        </p>
      </section>

      {/* Feature Grid */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <h2 className="landing-section-title">이런 것들을 할 수 있어요</h2>
          </div>

          <div className="landing-feature-grid">
            <div className="landing-feature-card">
              <PencilSquareIcon className="landing-feature-icon" />
              <h3>기도를 기록하세요</h3>
              <p>누구를 위해, 무엇을 기도했는지 매일 기록할 수 있어요. 짧은 한 줄이라도 괜찮아요.</p>
            </div>
            <div className="landing-feature-card">
              <BellIcon className="landing-feature-icon" />
              <h3>매일 알림을 받으세요</h3>
              <p>원하는 시간에 기도 알림을 설정하면, 잊지 않고 기도할 수 있어요.</p>
            </div>
            <div className="landing-feature-card">
              <CalendarDaysIcon className="landing-feature-icon" />
              <h3>기도 캘린더</h3>
              <p>언제, 누구를 위해 기도했는지 한눈에 볼 수 있어요. 꾸준히 쌓이는 기도의 흔적을 확인하세요.</p>
            </div>
            <div className="landing-feature-card">
              <LockClosedIcon className="landing-feature-icon" />
              <h3>내 폰에만 저장</h3>
              <p>기도 내용은 서버에 올라가지 않아요. 오직 내 기기 안에서만 안전하게 보관됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="landing-section landing-section-alt">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <LightBulbIcon className="landing-section-icon" />
            <h2 className="landing-section-title">이런 마음으로 만들었어요</h2>
          </div>

          <div className="landing-story-card">
            <p>
              &ldquo;그 사람을 위해 기도해야지&rdquo; 생각하면서도,
              바쁜 하루에 잊어버리곤 했어요.
            </p>
            <p>
              EVERY 1 PRAY는 <strong>하루 1번, 딱 1명</strong>이라도
              기억하고 기도하자는 마음에서 시작됐어요.
            </p>
            <p>
              거창하지 않아도 괜찮아요.<br />
              오늘 떠오르는 한 사람을 위해, 짧은 기도 한 줄이면 충분합니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta-section">
        <h2>지금 바로 시작해보세요</h2>
        <p>앱스토어 없이, 홈 화면에 바로 설치하세요.</p>
        <div className="landing-cta-buttons">
          <Link href="/" className="landing-cta-btn">기도 시작하기</Link>
          <Link href="/install" className="landing-cta-btn-outline">설치 방법 보기</Link>
        </div>
      </section>
    </>
  );
}
