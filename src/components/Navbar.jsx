import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <button
        className={styles.navButton}
        onClick={() => navigate('/HomePage')}
      >
        홈
      </button>
      <button
        className={styles.navButton}
        onClick={() => navigate('/statistics')}
      >
        통계
      </button>
      <button
        className={styles.navButton}
        onClick={() => navigate('/RankingPage')}
      >
        랭킹
      </button>
      <button
        className={styles.navButton}
        onClick={() => navigate('/SettingPage')}
      >
        더보기
      </button>
    </nav>
  );
}

export default Navbar;