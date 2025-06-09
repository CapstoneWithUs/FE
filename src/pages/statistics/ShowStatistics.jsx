import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ShowStatistics.css'; // CSS 파일 임포트

// const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = 'https://be-production-1350.up.railway.app';

const ShowStatistics = () => {
  const location = useLocation();
  // 라우트에서 subject 파라미터 받기
  const initialSubject = location.state?.subject || localStorage.getItem('currentSubject') || '';
  
  const [statistics, setStatistics] = useState([]);
  const [allSubjects, setAllSubjects] = useState(['전체']);
  const [selectedSubject, setSelectedSubject] = useState('전체'); // 기본값은 '전체'
  const [timeScores, setTimeScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallGrade, setOverallGrade] = useState('');
  const [gradeScore, setGradeScore] = useState(0);
  const [filteredStatistics, setFilteredStatistics] = useState([]);

  // 로딩 상태 세분화 및 요청 중복 방지를 위한 상태
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [lastFetchParams, setLastFetchParams] = useState(null);

  // 기간별 탭 상태 관리
  const [selectedPeriod, setSelectedPeriod] = useState('daily'); // daily, weekly, monthly

  // 성능 최적화를 위한 memoized 유틸리티 함수
  const getDateRange = useCallback((period) => {
    const now = new Date();
    let startTime, endTime;

    switch (period) {
      case 'daily':
        // 오늘 00:00:00 ~ 23:59:59
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        break;
      
      case 'weekly':
        // 이번 주 월요일 00:00:00 ~ 일요일 23:59:59
        const dayOfWeek = now.getDay(); // 0(일요일) ~ 6(토요일)
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 월요일까지의 일수
        
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday, 0, 0, 0, 0);
        endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - daysToMonday), 23, 59, 59, 999);
        break;
      
      case 'monthly':
        // 이번 달 1일 00:00:00 ~ 말일 23:59:59
        startTime = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        endTime = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // 다음 달 0일 = 이번 달 마지막 날
        break;
      
      default:
        // 기본값은 일간
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }

    // Unix timestamp (밀리초)로 변환
    const startTimestamp = startTime.getTime();
    const endTimestamp = endTime.getTime();

    return { startTimestamp, endTimestamp };
  }, []); // 의존성 없음 - 순수 함수

  // 과목명을 localStorage에 저장 (페이지 새로고침 시 유지하기 위해)
  useEffect(() => {
    if (location.state?.subject) {
      localStorage.setItem('currentSubject', location.state.subject);
      setSelectedSubject(location.state.subject);
    }
  }, [location.state]);

  // memoized API 함수들로 성능 최적화
  const fetchStatisticsByPeriodAndSubject = useCallback(async (period, subject) => {
    try {
      const { startTimestamp, endTimestamp } = getDateRange(period);
      
      // 기존 API 사용
      const response = await fetch(`${API_BASE_URL}/get-all-statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`통계 데이터를 불러오는데 실패했습니다 (${response.status})`);
      }

      const data = await response.json();
      
      // 클라이언트 측에서 필터링
      const filteredData = data.filter(item => {
        const itemTime = item.startTime;
        const subjectMatch = subject === '전체' || item.subjectName === subject;
        const timeMatch = itemTime >= startTimestamp && itemTime <= endTimestamp;
        return subjectMatch && timeMatch;
      });
      
      return filteredData;
    } catch (err) {
      throw new Error('통계 데이터를 불러오는데 문제가 발생했습니다.');
    }
  }, [getDateRange]);

  const fetchTimeScoreDataByPeriodAndSubject = useCallback(async (period, subject) => {
    try {
      const { startTimestamp, endTimestamp } = getDateRange(period);
      
      // 기존 API 사용
      const response = await fetch(`${API_BASE_URL}/get-all-time-score-array-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`시간-점수 데이터를 불러오는데 실패했습니다 (${response.status})`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        return [];
      }
      
      // 클라이언트 측에서 필터링
      const filteredData = data.filter(item => {
        const itemTime = item.eachTime;
        const subjectMatch = subject === '전체' || item.subjectName === subject;
        const timeMatch = itemTime >= startTimestamp && itemTime <= endTimestamp;
        return subjectMatch && timeMatch;
      });
      
      return filteredData;
    } catch (err) {
      // 빈 배열 반환하여 UI가 깨지지 않도록 함
      return [];
    }
  }, [getDateRange]);

  // 초기 데이터 로딩 로직 최적화
  // 통계 페이지 로드 시 필요한 데이터 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsInitialLoading(true);
      setError(null);
      
      try {
        // 1. 먼저 전체 과목 목록을 위해 기본 데이터 가져오기 (일간, 전체)
        const allStatsData = await fetchStatisticsByPeriodAndSubject('daily', '전체');
        
        // 2. 통계 데이터에서 과목 목록 추출
        if (allStatsData && allStatsData.length > 0) {
          const subjects = ['전체', ...new Set(allStatsData.map(item => item.subjectName).filter(Boolean))];
          setAllSubjects(subjects);
          
          // 초기 과목이 있고 목록에 있으면 선택
          if (initialSubject && subjects.includes(initialSubject)) {
            setSelectedSubject(initialSubject);
          }
        }
      } catch (err) {
        setError(err.message || '데이터를 불러오는데 문제가 발생했습니다.');
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    fetchInitialData();
  }, [initialSubject, fetchStatisticsByPeriodAndSubject]); // fetchStatisticsByPeriodAndSubject 의존성 추가

  // 성능 최적화된 데이터 페칭 로직
  // 탭 또는 과목 변경 시 데이터 다시 가져오기
  useEffect(() => {
    const fetchDataByPeriodAndSubject = async () => {
      // 초기 로딩 중이거나 과목 목록이 없으면 스킵
      if (isInitialLoading || allSubjects.length <= 1) return;
      
      // 중복 요청 방지
      const currentParams = `${selectedPeriod}-${selectedSubject}`;
      if (lastFetchParams === currentParams && !isDataLoading) return;
      
      setIsDataLoading(true);
      setError(null);
      setLastFetchParams(currentParams);
      
      try {
        // Promise.all을 사용하여 병렬 처리로 성능 향상
        const [statsData, timeScoreData] = await Promise.all([
          fetchStatisticsByPeriodAndSubject(selectedPeriod, selectedSubject),
          fetchTimeScoreDataByPeriodAndSubject(selectedPeriod, selectedSubject)
        ]);
        
        setStatistics(statsData);
        processTimeScoreData(timeScoreData);
      } catch (err) {
        setError(err.message || '데이터를 불러오는데 문제가 발생했습니다.');
      } finally {
        setIsDataLoading(false);
      }
    };
    
    fetchDataByPeriodAndSubject();
  }, [selectedPeriod, selectedSubject, isInitialLoading, allSubjects.length, lastFetchParams, isDataLoading, fetchStatisticsByPeriodAndSubject, fetchTimeScoreDataByPeriodAndSubject]); // 필요한 의존성 모두 추가
  

  //새로운 API에서 받은 데이터로 등급 계산 및 필터링 로직 수정
  useEffect(() => {
    if (statistics.length > 0) {
      // 새로운 API는 이미 필터링된 데이터를 반환하므로 추가 필터링 불필요
      setFilteredStatistics(statistics);
      
      // 받은 데이터로 등급 계산
      calculateOverallGrade(statistics);
    } else {
      // 데이터가 없는 경우 초기화
      setFilteredStatistics([]);
      setOverallGrade('N/A');
      setGradeScore(0);
    }
  }, [statistics]);
  
  // 시간-점수 데이터 처리
  const processTimeScoreData = (data) => {
    if (!data || data.length === 0) {
      setTimeScores([]);
      return;
    }
    
    // null 체크 및 타입 변환 함수
    const safeNumber = (value) => {
      if (value === null || value === undefined) return 0;
      return typeof value === 'number' ? value : Number(value);
    };
    
    try {
      // 데이터 형식 변환
      const formattedData = data.map(item => {
        const timestamp = safeNumber(item.eachTime);
        const score = safeNumber(item.eachScore);
        
        // 유닉스 타임스탬프(밀리초)를 Date 객체로 변환
        const date = new Date(timestamp);
        
        return {
          time: date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          rawTime: date,
          score: score,
          timestamp: timestamp
        };
      });
      
      // 시간 순서대로 정렬
      const sortedData = formattedData.sort((a, b) => a.timestamp - b.timestamp);
      
      setTimeScores(sortedData);
    } catch (err) {
      setTimeScores([]);
    }
  };

  // 시간을 시:분:초 형식으로 변환
  const formatTime = (ms) => {
    ms = Number(ms) || 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

  // 차트용 짧은 시간 포맷 (시간만)
  const formatTimeShort = (ms) => {
    ms = Number(ms) || 0;
    return (ms / (1000 * 60 * 60)).toFixed(2);
  };

  // Calculate overall grade based on formula
  const calculateOverallGrade = (data) => {
    if (!data || data.length === 0) {
      setOverallGrade('N/A');
      setGradeScore(0);
      return;
    }

    let totalGradeATime = 0;
    let totalGradeBTime = 0;
    let totalGradeCTime = 0;
    let totalGradeDTime = 0;
    
    data.forEach(session => {
      totalGradeATime += Number(session.gradeATime) || 0;
      totalGradeBTime += Number(session.gradeBTime) || 0;
      totalGradeCTime += Number(session.gradeCTime) || 0;
      totalGradeDTime += Number(session.gradeDTime) || 0;
    });

    const totalStudyTime = totalGradeATime + totalGradeBTime + totalGradeCTime + totalGradeDTime;
    
    if (totalStudyTime === 0) {
      setOverallGrade('N/A');
      setGradeScore(0);
      return;
    }

    const score = (
      (totalGradeATime * 95 + 
       totalGradeBTime * 85 + 
       totalGradeCTime * 75 + 
       totalGradeDTime * 35) / totalStudyTime
    );
    
    const roundedScore = Math.round(score);
    setGradeScore(roundedScore);
    
    // Determine grade based on score
    if (score >= 90) {
      setOverallGrade('A');
    } else if (score >= 80) {
      setOverallGrade('B');
    } else if (score >= 70) {
      setOverallGrade('C');
    } else {
      setOverallGrade('D');
    }
  };

  // Prepare data for chart
  const prepareChartData = () => {
    // Group by subject name if multiple subjects exist
    const subjectData = {};
    
    // 필터링된 통계 사용
    filteredStatistics.forEach(session => {
      const subject = session.subjectName || '과목 없음';
      
      if (!subjectData[subject]) {
        subjectData[subject] = {
          subject,
          gradeA: 0,
          gradeB: 0,
          gradeC: 0,
          gradeD: 0
        };
      }
      
      subjectData[subject].gradeA += Number(session.gradeATime) || 0;
      subjectData[subject].gradeB += Number(session.gradeBTime) || 0;
      subjectData[subject].gradeC += Number(session.gradeCTime) || 0;
      subjectData[subject].gradeD += Number(session.gradeDTime) || 0;
    });
    
    // Convert to hours for display
    Object.keys(subjectData).forEach(key => {
      subjectData[key].gradeA = Number(formatTimeShort(subjectData[key].gradeA));
      subjectData[key].gradeB = Number(formatTimeShort(subjectData[key].gradeB));
      subjectData[key].gradeC = Number(formatTimeShort(subjectData[key].gradeC));
      subjectData[key].gradeD = Number(formatTimeShort(subjectData[key].gradeD));
    });
    
    return Object.values(subjectData);
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#4ade80'; // green
      case 'B': return '#3b82f6'; // blue
      case 'C': return '#f59e0b'; // amber
      case 'D': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  // 안전하게 값 계산하기
  const getTotalTime = (accessor) => {
    return filteredStatistics.reduce((sum, session) => {
      const value = session[accessor];
      return sum + (Number(value) || 0);
    }, 0);
  };

  // 디바운싱을 적용한 과목 선택 핸들러
  const handleSubjectChange = useCallback((e) => {
    const newSubject = e.target.value;
    setSelectedSubject(newSubject);
  }, []);

  //  디바운싱을 적용한 기간 탭 선택 핸들러
  const handlePeriodChange = useCallback((period) => {
    if (period === selectedPeriod) return; // 동일한 탭 클릭 시 중복 처리 방지
    
    setSelectedPeriod(period);
    
    // 선택된 기간의 날짜 범위 계산 및 콘솔 출력
    const { startTimestamp, endTimestamp } = getDateRange(period);
  }, [selectedPeriod, getDateRange]);

  // 통합된 로딩 상태 처리
  const isLoading = isInitialLoading || isDataLoading;
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{isInitialLoading ? '시스템 초기화 중...' : '데이터를 불러오는 중...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>오류:</strong> {error}
        </div>
      </div>
    );
  }
  
  // 데이터가 없는 경우 메시지 표시
  if (statistics.length === 0) {
    return (
      <div className="statistics-container">
        <h1 className="page-title">학습 통계</h1>
        
        {/* 기간별 탭 UI */}
        <div className="period-tabs">
          <div className="tab-container">
            <button
              className={`tab-button ${selectedPeriod === 'daily' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('daily')}
            >
              일간
            </button>
            <button
              className={`tab-button ${selectedPeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('weekly')}
            >
              주간
            </button>
            <button
              className={`tab-button ${selectedPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('monthly')}
            >
              월간
            </button>
          </div>
        </div>
        
        {/* 과목 선택 드롭다운 */}
        <div className="subject-selector">
          <label htmlFor="subject-select">과목 선택:</label>
          <select 
            id="subject-select" 
            value={selectedSubject} 
            onChange={handleSubjectChange}
            className="subject-select-dropdown"
          >
            {allSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        <div className="no-data-message full-page">
          <p>통계 데이터가 없습니다.</p>
          <p>먼저 학습을 진행한 후 통계를 확인해주세요.</p>
        </div>
      </div>
    );
  }

  // 필터링된 데이터가 없는 경우 메시지 표시
  if (filteredStatistics.length === 0 && selectedSubject !== '전체') {
    return (
      <div className="statistics-container">
        <h1 className="page-title">학습 통계</h1>
        
        {/* 기간별 탭 UI */}
        <div className="period-tabs">
          <div className="tab-container">
            <button
              className={`tab-button ${selectedPeriod === 'daily' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('daily')}
            >
              일간
            </button>
            <button
              className={`tab-button ${selectedPeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('weekly')}
            >
              주간
            </button>
            <button
              className={`tab-button ${selectedPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('monthly')}
            >
              월간
            </button>
          </div>
        </div>
        
        {/* 과목 선택 드롭다운 */}
        <div className="subject-selector">
          <label htmlFor="subject-select">과목 선택:</label>
          <select 
            id="subject-select" 
            value={selectedSubject} 
            onChange={handleSubjectChange}
            className="subject-select-dropdown"
          >
            {allSubjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        <div className="no-data-message full-page">
          <p>'{selectedSubject}' 과목에 대한 통계 데이터가 없습니다.</p>
          <p>다른 과목을 선택하거나, 해당 과목의 학습을 진행한 후 통계를 확인해주세요.</p>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="statistics-container">
      <h1 className="page-title">학습 통계</h1>
      
      {/* 기간별 탭 UI */}
      <div className="period-tabs">
        <div className="tab-container">
          <button
            className={`tab-button ${selectedPeriod === 'daily' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('daily')}
          >
            일간
          </button>
          <button
            className={`tab-button ${selectedPeriod === 'weekly' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('weekly')}
          >
            주간
          </button>
          <button
            className={`tab-button ${selectedPeriod === 'monthly' ? 'active' : ''}`}
            onClick={() => handlePeriodChange('monthly')}
          >
            월간
          </button>
        </div>
      </div>
      
      {/* 과목 선택 드롭다운 */}
      <div className="subject-selector">
        <label htmlFor="subject-select">과목 선택:</label>
        <select 
          id="subject-select" 
          value={selectedSubject} 
          onChange={handleSubjectChange}
          className="subject-select-dropdown"
        >
          {allSubjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>
      
      <div className="dashboard-layout">
        {/* 왼쪽 영역 - 등급과 요약 통계 */}
        <div className="stats-summary">
          {/* 등급 원형 */}
          <div className="grade-container">
            <div 
              className="grade-circle"
              style={{ backgroundColor: getGradeColor(overallGrade) }}
            >
              {overallGrade}
            </div>
            <div className="grade-info">
              <div className="grade-score">점수: {gradeScore}</div>
              <div className="grade-subject">{selectedSubject === '전체' ? '전체 과목' : selectedSubject}</div>
            </div>
          </div>
          
          {/* 요약 통계 */}
          <div className="summary-container">
            <h2 className="summary-title">공부 통계 요약</h2>
            <div className="stat-cards">
              <StatCard 
                label="A등급 시간" 
                value={formatTime(getTotalTime('gradeATime'))} 
                color="#4ade80"
              />
              <StatCard 
                label="B등급 시간" 
                value={formatTime(getTotalTime('gradeBTime'))} 
                color="#3b82f6"
              />
              <StatCard 
                label="C등급 시간" 
                value={formatTime(getTotalTime('gradeCTime'))} 
                color="#f59e0b"
              />
              <StatCard 
                label="D등급 시간" 
                value={formatTime(getTotalTime('gradeDTime'))} 
                color="#ef4444"
              />
            </div>
          </div>
          
          {/* 추가 통계 카드들 */}
          <div className="extra-stats-list">
            <StatBox 
              title="수면 시간"
              value={formatTime(getTotalTime('sleepTime'))}
              icon="💤"
              bgColor="#f3e8ff"
            />
            <StatBox 
              title="시선 이탈 시간"
              value={formatTime(getTotalTime('gazeAwayTime'))}
              icon="👀"
              bgColor="#fef3c7"
            />
            <StatBox 
              title="자리 비움 시간"
              value={formatTime(getTotalTime('absenceTime'))}
              icon="🚶"
              bgColor="#dbeafe"
            />
          </div>
        </div>
        
        {/* 오른쪽 차트 영역 */}
        <div className="chart-area">
          {/* 시간대별 집중도 꺾은선 그래프 */}
          <div className="chart-container">
            <h2 className="chart-title">시간대별 집중도 변화</h2>
            <div className="chart">
              {timeScores.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeScores}
                    margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time"
                      tickCount={5}
                      tickFormatter={(value, index) => {
                        if (timeScores.length === 0) return '';
                        // 인덱스를 균등하게 분배
                        const actualIndex = Math.min(
                          Math.floor(index * (timeScores.length / 5)), 
                          timeScores.length - 1
                        );
                        const item = timeScores[actualIndex];
                        return item ? item.time : '';
                      }}
                      label={{ value: '시간', position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      label={{ value: '집중도 점수', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} 점`, '집중도']}
                      labelFormatter={(label, items) => {
                        if (items.length > 0 && items[0].payload && items[0].payload.rawTime) {
                          return items[0].payload.rawTime.toLocaleString();
                        }
                        return label;
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      name="집중도" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-message">
                  <p>시간별 집중도 데이터가 없습니다</p>
                </div>
              )}
            </div>
          </div>
          
          {/* 과목별 집중도 분포 차트 */}
          <div className="chart-container mt-10">
            <h2 className="chart-title">과목별 집중도 분포 (시간)</h2>
            <div className="chart">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis label={{ value: '시간 (hrs)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value} 시간`, '']} />
                    <Legend />
                    <Bar dataKey="gradeA" name="A등급 (90-100점)" stackId="a" fill="#4ade80" />
                    <Bar dataKey="gradeB" name="B등급 (80-89점)" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="gradeC" name="C등급 (70-79점)" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="gradeD" name="D등급 (0-69점)" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-message">
                  <p>과목별 집중도 데이터가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, color }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color, fontSize: '14px' }}>
      {value}
    </div>
  </div>
);

// Stat Box Component
const StatBox = ({ title, value, icon, bgColor }) => (
  <div className="stat-box" style={{ backgroundColor: bgColor }}>
    <div className="stat-box-content">
      <div className="stat-box-icon">{icon}</div>
      <div className="stat-box-info">
        <h3 className="stat-box-title">{title}</h3>
        <p className="stat-box-value" style={{ fontSize: '14px' }}>{value}</p>
      </div>
    </div>
  </div>
);

export default ShowStatistics;