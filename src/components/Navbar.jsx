import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black text-white flex justify-around items-center h-16 text-xl font-bold z-50 mt-6">
      <button
        className="flex-1 h-full flex items-center justify-center hover:bg-gray-800 transition"
        onClick={() => navigate('/HomePage')}
      >
        홈
      </button>
      <button
        className="flex-1 h-full flex items-center justify-center hover:bg-gray-800 transition"
        onClick={() => navigate('/StatsPage')}
      >
        통계
      </button>
      <button
        className="flex-1 h-full flex items-center justify-center hover:bg-gray-800 transition"
        onClick={() => navigate('/RankingPage')}
      >
        랭킹
      </button>
      <button
        className="flex-1 h-full flex items-center justify-center hover:bg-gray-800 transition"
        onClick={() => navigate('/SettingPage')}
      >
        더보기
      </button>
    </nav>
  );
}

export default Navbar;
