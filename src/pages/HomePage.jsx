// HomePage.js 리팩토링 (CSS Modules 적용)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './HomePage.module.css';

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
      <button
        className={styles.addButton}
        onClick={() => navigate('/add-subject')}
      >
        과목 추가
      </button>
      <div className={styles.subjectList}>
        {subjects.map(subject => (
          <button
            key={subject}
            className={styles.subjectButton}
            onClick={() => handleSubjectClick(subject)}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomePage;