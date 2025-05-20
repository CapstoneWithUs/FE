import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSubjectPage = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4 py-8">
      {/* 상단 바 */}
      <div className="flex items-center justify-between mb-8">
        <button className="text-gray-400 text-lg" onClick={() => navigate(-1)}>취소</button>
        <span className="text-lg font-semibold">측정할 과목 이름</span>
        <button
          className={`text-lg font-semibold ${subject.trim() ? 'text-cyan-400' : 'text-gray-400'}`}
          disabled={!subject.trim()}
          onClick={() => {
            navigate('/HomePage', { state: { newSubject: subject.trim() } });
          }}
        >
          완료
        </button>
      </div>
      {/* 입력 필드 */}
      <input
        className="w-full rounded-xl bg-gray-800 text-white placeholder-gray-500 px-4 py-4 text-lg mb-6 outline-none"
        placeholder="e.g. 수학, 영어, 과학, 역사.."
        value={subject}
        onChange={e => setSubject(e.target.value)}
        autoFocus
      />
    </div>
  );
};

export default AddSubjectPage;
