import React from 'react';
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
  return (
    <header className={styles.header}>
      {/* 앱 이름: 좌측 상단 */}
      <h1 className={styles.appTitle}>
        PocusMate
      </h1>
      {/* 날짜: 중앙 */}
      <div className={styles.dateDisplay}>
        {getToday()}
      </div>
    </header>
  );
}

export default Header;