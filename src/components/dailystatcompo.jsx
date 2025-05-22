import React, { useState, useEffect } from 'react';

/*홈페이지에서 보여줄 일간 통계 컴포넌트*/
function DailyStatComp() {
    const [stats, setStats] = useState({
        todayStudyTime: 0,
        todayFocusScore: 0,
        weeklyAverage: 0,
        streak: 0
    });

    const containerStyle = {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        margin: '1rem 0',
        boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        color: '#ffffff',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        animation: 'cardSlideIn 0.8s ease-out',
        transition: 'all 0.3s ease'
    };

    const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        letterSpacing: '0.025em'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '1rem'
    };

    const statCardStyle = {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
        borderRadius: '1rem',
        padding: '1rem',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
    };

    const statLabelStyle = {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '0.5rem',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
    };

    const statValueStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#ffffff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
    };

    const progressBarStyle = {
        width: '100%',
        height: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '1rem'
    };

    const progressFillStyle = {
        height: '100%',
        background: 'linear-gradient(90deg, #4ade80, #22c55e)',
        borderRadius: '4px',
        width: `${Math.min((stats.todayStudyTime / 120) * 100, 100)}%`,
        transition: 'width 0.3s ease',
        boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
                    @keyframes cardSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .stat-card:hover {
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%) !important;
                        transform: translateY(-2px) scale(1.02);
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
                    }
                    
                    .daily-stat-container:hover {
                        transform: translateY(-2px);
                        box-shadow: 
                            0 35px 60px -12px rgba(0, 0, 0, 0.3),
                            0 0 0 1px rgba(255, 255, 255, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                    }
                `}
            </style>
            
            <h2 style={titleStyle}>📊 오늘의 학습 현황</h2>
            
            <div style={statsGridStyle}>
                <div style={statCardStyle} className="stat-card">
                    <div style={statLabelStyle}>오늘 공부시간</div>
                    <div style={statValueStyle}>{formatTime(stats.todayStudyTime)}</div>
                </div>
                
                <div style={statCardStyle} className="stat-card">
                    <div style={statLabelStyle}>평균 집중도</div>
                    <div style={{...statValueStyle, color: '#4ade80'}}>{stats.todayFocusScore}점</div>
                </div>
                
                <div style={statCardStyle} className="stat-card">
                    <div style={statLabelStyle}>주간 평균</div>
                    <div style={{...statValueStyle, color: '#60a5fa'}}>{formatTime(stats.weeklyAverage)}</div>
                </div>
                
                <div style={statCardStyle} className="stat-card">
                    <div style={statLabelStyle}>연속 학습일</div>
                    <div style={{...statValueStyle, color: '#f59e0b'}}>{stats.streak}일</div>
                </div>
            </div>
            
            <div>
                <div style={statLabelStyle}>오늘 목표 달성률 ({Math.min(Math.round((stats.todayStudyTime / 120) * 100), 100)}%)</div>
                <div style={progressBarStyle}>
                    <div style={progressFillStyle}></div>
                </div>
            </div>
        </div>
    );
}

export default DailyStatComp;