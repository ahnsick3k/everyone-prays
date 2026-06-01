import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="static-page">
      <Link href="/" className="back-link">← 돌아가기</Link>

      <h1 className="page-title">🙏 EVERY 1 PRAY</h1>
      <p className="page-subtitle">
        생각나는 그 사람을 위한<br />
        하루 1번의 중보기도
      </p>

      {/* 소개 */}
      <section className="about-section">
        <div className="about-card">
          <span className="about-emoji">✍️</span>
          <h3>기도를 기록하세요</h3>
          <p>누구를 위해, 무엇을 기도했는지 매일 기록할 수 있어요. 짧은 한 줄이라도 괜찮아요.</p>
        </div>
        <div className="about-card">
          <span className="about-emoji">🔔</span>
          <h3>매일 알림을 받으세요</h3>
          <p>원하는 시간에 기도 알림을 설정하면, 잊지 않고 기도할 수 있어요.</p>
        </div>
        <div className="about-card">
          <span className="about-emoji">📅</span>
          <h3>기도 캘린더</h3>
          <p>언제, 누구를 위해 기도했는지 한눈에 볼 수 있어요. 꾸준히 쌓이는 기도의 흔적을 확인하세요.</p>
        </div>
        <div className="about-card">
          <span className="about-emoji">🔒</span>
          <h3>내 폰에만 저장</h3>
          <p>기도 내용은 서버에 올라가지 않아요. 오직 내 기기 안에서만 안전하게 보관됩니다.</p>
        </div>
      </section>

      {/* 왜 만들었나 */}
      <section className="about-section">
        <h2 className="section-title">💡 이런 마음으로 만들었어요</h2>
        <div className="about-story">
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
      </section>

      {/* CTA */}
      <section className="about-cta">
        <Link href="/" className="sidebar-btn sidebar-btn-cta">
          지금 기도 시작하기 →
        </Link>
      </section>
    </div>
  );
}
