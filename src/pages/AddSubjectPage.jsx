import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddSubjectPage.module.css';

const AddSubjectPage = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');

  return (
    <div className={styles.container}>
      {/* 상단 바 */}
      <div className={styles.topBar}>
        <button 
          className={styles.cancelButton} 
          onClick={() => navigate(-1)}
        >
          취소
        </button>
        <span className={styles.title}>측정할 과목 이름</span>
        <button
          className={`${styles.completeButton} ${
            subject.trim() ? styles.active : styles.disabled
          }`}
          disabled={!subject.trim()}
          onClick={() => {
            navigate('/', { state: { newSubject: subject.trim() } });
          }}
        >
          완료
        </button>
      </div>
      {/* 입력 필드 */}
      <input
        className={styles.inputField}
        placeholder="e.g. 수학, 영어, 과학, 역사.."
        value={subject}
        onChange={e => setSubject(e.target.value)}
        autoFocus
      />
    </div>
  );
};

export default AddSubjectPage;