import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ShowStatistics.css'; // CSS 파일 임포트

const ShowStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [timeScores, setTimeScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallGrade, setOverallGrade] = useState('');
  const [gradeScore, setGradeScore] = useState(0);

  useEffect(() => {
    Promise.all([
      fetchStatistics(),
      fetchTimeScoreData()
    ]).then(() => {
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  // 테스트용 시간-점수 데이터 생성 (실제 API가 동작하지 않을 경우)
  const generateTestTimeScoreData = () => {
    const data = [];
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    
    // 지난 24시간 동안의 데이터 생성 (2시간 간격)
    for (let i = 24; i >= 0; i -= 2) {
      const time = now - (i * hourMs);
      const date = new Date(time);
      const score = 100 - i * 2; // 100점부터 시작해서 점점 감소
      
      data.push({
        eachTime: time,
        eachScore: score
      });
    }
    
    return data;
  };

  // 통계 데이터 가져오기
  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8080/get-all-statistics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        // 테스트용 더미 데이터 (실제 API가 동작하지 않을 경우)
        console.warn('통계 API 호출 실패, 테스트 데이터 사용');
        const dummyData = [
          {
            gradeATime: 360000, // 6분 = 0.1시간
            gradeBTime: 360000,
            gradeCTime: 360000,
            gradeDTime: 0,
            sleepTime: 360000,
            gazeAwayTime: 360000,
            absenceTime: 0,
            focusScore: 78,
            startTime: Date.now() - 3600000,
            endTime: Date.now(),
            subjectName: "blahblah"
          }
        ];
        
        setStatistics(dummyData);
        calculateOverallGrade(dummyData);
        return dummyData;
      }

      const data = await response.json();
      
      // 데이터가 없으면 더미 데이터 사용
      if (!data || data.length === 0) {
        console.warn('API에서 빈 데이터 반환, 테스트 데이터 사용');
        const dummyData = [
          {
            gradeATime: 360000, // 6분 = 0.1시간
            gradeBTime: 360000,
            gradeCTime: 360000,
            gradeDTime: 0,
            sleepTime: 360000,
            gazeAwayTime: 360000,
            absenceTime: 0,
            focusScore: 78,
            startTime: Date.now() - 3600000,
            endTime: Date.now(),
            subjectName: "blahblah"
          }
        ];
        
        setStatistics(dummyData);
        calculateOverallGrade(dummyData);
        return dummyData;
      }
      
      setStatistics(data);
      calculateOverallGrade(data);
      return data;
    } catch (err) {
      console.error('통계 데이터 불러오기 오류:', err);
      
      // 테스트용 더미 데이터
      const dummyData = [
        {
          gradeATime: 360000, // 6분 = 0.1시간
          gradeBTime: 360000,
          gradeCTime: 360000,
          gradeDTime: 0,
          sleepTime: 360000,
          gazeAwayTime: 360000,
          absenceTime: 0,
          focusScore: 78,
          startTime: Date.now() - 3600000,
          endTime: Date.now(),
          subjectName: "blahblah"
        }
      ];
      
      setStatistics(dummyData);
      calculateOverallGrade(dummyData);
      return dummyData;
    }
  };

  // 시간-점수 데이터 가져오기
  const fetchTimeScoreData = async () => {
    try {
      const response = await fetch('http://localhost:8080/get-all-time-score-array-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        // API 호출 실패 시 테스트 데이터 사용
        console.warn('시간-점수 API 호출 실패, 테스트 데이터 사용');
        const testData = generateTestTimeScoreData();
        processTimeScoreData(testData);
        return testData;
      }

      const data = await response.json();
      
      // 데이터가 없으면 테스트 데이터 사용
      if (!data || data.length === 0) {
        console.warn('API에서 빈 데이터 반환, 테스트 데이터 사용');
        const testData = generateTestTimeScoreData();
        processTimeScoreData(testData);
        return testData;
      }
      
      processTimeScoreData(data);
      return data;
    } catch (err) {
      console.error('시간-점수 데이터 불러오기 오류:', err);
      // 테스트 데이터 사용
      const testData = generateTestTimeScoreData();
      processTimeScoreData(testData);
      return testData;
    }
  };
  
  // 시간-점수 데이터 처리
  const processTimeScoreData = (data) => {
    // 시간 순서대로 정렬
    const sortedData = [...data].sort((a, b) => a.eachTime - b.eachTime);
    
    // 데이터 형식 변환
    const formattedData = sortedData.map(item => {
      // 유닉스 타임스탬프(밀리초)를 Date 객체로 변환
      const date = new Date(item.eachTime);
      return {
        time: date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        rawTime: date, // 원본 Date 객체 저장 (정렬 및 Tooltip용)
        score: item.eachScore,
        timestamp: item.eachTime
      };
    });
    
    setTimeScores(formattedData);
  };

  // 시간을 시:분:초 형식으로 변환
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}시간 ${minutes}분 ${seconds}초`;
  };

  // 차트용 짧은 시간 포맷 (시간만)
  const formatTimeShort = (ms) => {
    return (ms / (1000 * 60 * 60)).toFixed(2);
  };

  // Calculate overall grade based on formula
  const calculateOverallGrade = (data) => {
    if (!data || data.length === 0) {
      setOverallGrade('N/A');
      return;
    }

    let totalGradeATime = 0;
    let totalGradeBTime = 0;
    let totalGradeCTime = 0;
    let totalGradeDTime = 0;
    
    data.forEach(session => {
      totalGradeATime += session.gradeATime || 0;
      totalGradeBTime += session.gradeBTime || 0;
      totalGradeCTime += session.gradeCTime || 0;
      totalGradeDTime += session.gradeDTime || 0;
    });

    const totalStudyTime = totalGradeATime + totalGradeBTime + totalGradeCTime + totalGradeDTime;
    
    if (totalStudyTime === 0) {
      setOverallGrade('N/A');
      return;
    }

    const score = (
      (totalGradeATime * 95 + 
       totalGradeBTime * 85 + 
       totalGradeCTime * 75 + 
       totalGradeDTime * 35) / totalStudyTime
    );
    
    setGradeScore(Math.round(score));
    
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
    
    statistics.forEach(session => {
      const subject = session.subjectName || 'blahblah';
      
      if (!subjectData[subject]) {
        subjectData[subject] = {
          subject,
          gradeA: 0,
          gradeB: 0,
          gradeC: 0,
          gradeD: 0
        };
      }
      
      subjectData[subject].gradeA += session.gradeATime || 0;
      subjectData[subject].gradeB += session.gradeBTime || 0;
      subjectData[subject].gradeC += session.gradeCTime || 0;
      subjectData[subject].gradeD += session.gradeDTime || 0;
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
    return statistics.reduce((sum, session) => sum + (session[accessor] || 0), 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>데이터를 불러오는 중...</p>
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

  const chartData = prepareChartData();

  return (
    <div className="statistics-container">
      <h1 className="page-title">학습 통계</h1>
      
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
                      tickFormatter={(value, index) => {
                        // timeScores 배열에서 해당 인덱스의 실제 시간 값 사용
                        const item = timeScores[index];
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
                        // items[0].payload에서 rawTime 사용
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