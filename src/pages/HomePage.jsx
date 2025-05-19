import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
    <div className="flex flex-col items-center w-full min-h-screen bg-black text-white">
      <button
        className="mt-8 bg-cyan-600 px-4 py-2 rounded font-bold hover:bg-cyan-700 transition"
        onClick={() => navigate('/add-subject')}
      >
        과목 추가
      </button>
      <div className="mt-8 w-full max-w-md flex flex-col gap-3">
        {subjects.map(subject => (
          <button
            key={subject}
            className="w-full bg-gray-800 rounded px-4 py-3 text-lg font-semibold text-left hover:bg-cyan-700 transition"
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
