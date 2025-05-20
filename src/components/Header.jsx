import React from 'react';

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
    <header className="relative w-full h-16 md:h-20 bg-gray-100 shadow-sm flex items-center px-4 md:px-8 mb-6">
      {/* 앱 이름: 좌측 상단 */}
      <h1>
        FocusMate
      </h1>
      {/* 날짜: 중앙 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl font-bold text-gray-800 select-none">
        {getToday()}
      </div>
    </header>
  );
}

export default Header;
