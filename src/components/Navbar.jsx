import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#C0C0C0] text-black flex justify-center items-center gap-x-4 h-16 text-xl font-bold z-50 mt-6">
      <button
        className="flex flex-col items-center justify-center px-4 py-2 border-2 border-gray-700 rounded-lg bg-white mx-2 shadow-sm hover:bg-gray-200 transition"
        onClick={() => navigate('/HomePage')}
      >
        홈
      </button>
      <button
        className="flex flex-col items-center justify-center px-4 py-2 border-2 border-gray-700 rounded-lg bg-white mx-2 shadow-sm hover:bg-gray-200 transition"
        onClick={() => navigate('/statistics')}
      >
        통계
      </button>
      <button
        className="flex flex-col items-center justify-center px-4 py-2 border-2 border-gray-700 rounded-lg bg-white mx-2 shadow-sm hover:bg-gray-200 transition"
        onClick={() => navigate('/RankingPage')}
      >
        랭킹
      </button>
      <button
        className="flex flex-col items-center justify-center px-4 py-2 border-2 border-gray-700 rounded-lg bg-white mx-2 shadow-sm hover:bg-gray-200 transition"
        onClick={() => navigate('/SettingPage')}
      >
        더보기
      </button>
    </nav>
  );
}

export default Navbar;
