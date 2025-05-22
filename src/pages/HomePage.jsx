// HomePage.js 리팩토링 (CSS Modules 적용)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './HomePage.module.css';
import pocusLogo from '../assets/PocusMate.png';

const SUBJECTS_KEY = 'focusmate_subjects';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subjects, setSubjects] = useState(() => {
    // localStorage에서 초기값 불러오기
    const saved = localStorage.getItem(SUBJECTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // AddSubjectPage에서 돌아올 때 과목명 전달받아 추가
  useEffect(() => {
    if (location.state && location.state.newSubject) {
      const newSubject = location.state.newSubject;
      if (newSubject && !subjects.includes(newSubject)) {
        const updated = [...subjects, newSubject];
        setSubjects(updated);
        localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updated));
      }
      // 상태 초기화 (중복 추가 방지)
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, subjects, navigate]);

  // 과목 버튼 클릭 시 이동
  const handleSubjectClick = (subject) => {
    navigate('/focusTrackerPage', { state: { subject } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        {/* 왼쪽 로고 영역 */}
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <div className={styles.logoImage}>
              <img src={pocusLogo} alt="PocusMate Logo" className={styles.logo} />
            </div>
          </div>
          <p className={styles.logoDescription}>
            <div>PocusMate와 함께하는</div>
            <div>스마트한 집중력 관리</div>
          </p>
        </div>

        {/* 오른쪽 기능 영역 */}
        <div className={styles.contentSection}>
          <div className={styles.welcomeArea}>
            <h2 className={styles.welcomeTitle}>학습을 시작해보세요!</h2>
            <p className={styles.welcomeSubtitle}>과목을 선택하고 집중력을 측정해보세요</p>
          </div>

          <button
            className={styles.addButton}
            onClick={() => navigate('/add-subject')}
          >
            + 과목 추가
          </button>
          
          <div className={styles.subjectList}>
            {subjects.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📚</div>
                <p className={styles.emptyText}>아직 추가된 과목이 없습니다</p>
                <p className={styles.emptySubtext}>위 버튼을 눌러 과목을 추가해주세요</p>
              </div>
            ) : (
              subjects.map(subject => (
                <button
                  key={subject}
                  className={styles.subjectButton}
                  onClick={() => handleSubjectClick(subject)}
                >
                  📖 {subject} →
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;