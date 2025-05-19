import React from 'react';
import { useLocation } from 'react-router-dom';
import FaceDetection from '../FaceDetection'; // 실제 경로에 맞게 import

const FocusTrackerPage = () => {
  const location = useLocation();
  const subject = location.state?.subject || '과목 없음';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      <h2 className="text-2xl font-bold mt-8 mb-4">{subject} - 순공 시간 측정</h2>
      {/* FaceDetection 컴포넌트에서 순공 시간 측정 및 표시 */}
      <FaceDetection subject={subject} />
    </div>
  );
};

export default FocusTrackerPage;
