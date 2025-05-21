import React from 'react';
import { useLocation } from 'react-router-dom';
import FaceDetection from '../FaceDetection';

const FocusTrackerPage = () => {
  const location = useLocation();
  // 라우트에서 전달된 과목명 가져오기 
  const subject = location.state?.subject || '';
  
  // 과목명이 없는 경우를 위한 검사
  if (!subject) {
    console.warn('FocusTrackerPage: 과목명이 전달되지 않았습니다.');
  } else {
    console.log('FocusTrackerPage: 과목명 수신:', subject);
    
    // localStorage에 현재 측정 중인 과목명 저장 (새로고침 시 유지)
    localStorage.setItem('currentSubject', subject);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mt-8 mb-4">{subject ? `${subject} - 순공 시간 측정` : '순공 시간 측정'}</h2>
      {/* FaceDetection 컴포넌트에 과목명 전달 */}
      <FaceDetection subject={subject} />
    </div>
  );
};

export default FocusTrackerPage;