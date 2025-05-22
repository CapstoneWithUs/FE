import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

// 오늘 날짜를 'MM. DD. (요일)' 형식으로 반환하는 함수
const getToday = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const day = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  return `${mm}. ${dd}. (${day})`;
};

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 활성 버튼 결정
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.includes(path)) return true;
    return false;
  };

  return (
    <header className={styles.header}>
      {/* 앱 이름: 좌측 */}
      <h1 className={styles.appTitle}>
        PocusMate
      </h1>
      
      {/* 날짜: 중앙 */}
      <div className={styles.dateDisplay}>
        {getToday()}
      </div>

      {/* 네비게이션: 우측 */}
      <nav className={styles.navigation}>
        <button
          className={`${styles.navButton} ${isActive('/') ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          <span className={styles.navIcon}>🏠</span>
          <span className={styles.navLabel}>홈</span>
        </button>
        <button
          className={`${styles.navButton} ${isActive('/statistics') ? styles.active : ''}`}
          onClick={() => navigate('/statistics')}
        >
          <span className={styles.navIcon}>📊</span>
          <span className={styles.navLabel}>통계</span>
        </button>
        <button
          className={`${styles.navButton} ${isActive('/RankingPage') ? styles.active : ''}`}
          onClick={() => navigate('/RankingPage')}
        >
          <span className={styles.navIcon}>🏆</span>
          <span className={styles.navLabel}>랭킹</span>
        </button>
        <button
          className={`${styles.navButton} ${isActive('/SettingPage') ? styles.active : ''}`}
          onClick={() => navigate('/SettingPage')}
        >
          <span className={styles.navIcon}>⚙️</span>
          <span className={styles.navLabel}>더보기</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;