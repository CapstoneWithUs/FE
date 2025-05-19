import React, { useState } from "react";

const ApiTestPanel = () => {
  const [inputs, setInputs] = useState({
    gazeAwayTimeMs: 0,
    absenceTimeMs: 0,
    sleepTimeMs: 0,
    date: "",
    startTime: 0,
    endTime: 0,
    focusScore: 0,
    subjectName: "",
    gradeATime: 0,
    gradeBTime: 0,
    gradeCTime: 0,
    gradeDTime: 0,
    time: 0,
    score: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const send = async (url, payload) => {
    try {
      const res = await fetch(`http://localhost:8080${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      alert(`✅ ${url} → 성공\n응답: ${text || "본문 없음"}`);
    } catch (e) {
      alert(`❌ ${url} → 실패\n${e}`);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>🧪 API 테스트 패널</h2>

      {/* AttentionState */}
      <div>
        <h3>/send-attentionState</h3>
        <input name="gazeAwayTimeMs" placeholder="gazeAwayTimeMs" onChange={handleChange} />
        <input name="absenceTimeMs" placeholder="absenceTimeMs" onChange={handleChange} />
        <input name="sleepTimeMs" placeholder="sleepTimeMs" onChange={handleChange} />
        <button onClick={() =>
          send("/send-attentionState", {
            gazeAwayTimeMs: parseFloat(inputs.gazeAwayTimeMs),
            absenceTimeMs: parseFloat(inputs.absenceTimeMs),
            sleepTimeMs: parseFloat(inputs.sleepTimeMs),
          })
        }>전송</button>
      </div>

      {/* Date */}
      <div>
        <h3>/send-date</h3>
        <input name="date" placeholder="2024.12.15" onChange={handleChange} />
        <button onClick={() => send("/send-date", { date: inputs.date })}>전송</button>
      </div>

      {/* EdgeTime */}
      <div>
        <h3>/send-edgeTime</h3>
        <input name="startTime" placeholder="startTime" onChange={handleChange} />
        <input name="endTime" placeholder="endTime" onChange={handleChange} />
        <button onClick={() =>
          send("/send-edgeTime", {
            startTime: parseFloat(inputs.startTime),
            endTime: parseFloat(inputs.endTime),
          })
        }>전송</button>
      </div>

      {/* FocusScore */}
      <div>
        <h3>/focus-score/send-focus-score</h3>
        <input name="focusScore" placeholder="focusScore" onChange={handleChange} />
        <button onClick={() =>
          send("/focus-score/send-focus-score", {
            focusScore: parseFloat(inputs.focusScore),
          })
        }>전송</button>
      </div>

      {/* Subject */}
      <div>
        <h3>/subject/send-subject</h3>
        <input name="subjectName" placeholder="subjectName" onChange={handleChange} />
        <button onClick={() =>
          send("/subject/send-subject", { subjectName: inputs.subjectName })
        }>전송</button>
      </div>

      {/* TimePerGrade */}
      <div>
        <h3>/time-per-grade/send-time-per-grade</h3>
        <input name="gradeATime" placeholder="gradeATime" onChange={handleChange} />
        <input name="gradeBTime" placeholder="gradeBTime" onChange={handleChange} />
        <input name="gradeCTime" placeholder="gradeCTime" onChange={handleChange} />
        <input name="gradeDTime" placeholder="gradeDTime" onChange={handleChange} />
        <button onClick={() =>
          send("/time-per-grade/send-time-per-grade", {
            gradeATime: parseFloat(inputs.gradeATime),
            gradeBTime: parseFloat(inputs.gradeBTime),
            gradeCTime: parseFloat(inputs.gradeCTime),
            gradeDTime: parseFloat(inputs.gradeDTime),
          })
        }>전송</button>
      </div>

      {/* TimeScoreList */}
      <div>
        <h3>/time-score-list/send-time-score-list</h3>
        <input name="time" placeholder="time" onChange={handleChange} />
        <input name="score" placeholder="score" onChange={handleChange} />
        <button onClick={() =>
          send("/time-score-list/send-time-score-list", {
            time: parseFloat(inputs.time),
            score: parseFloat(inputs.score),
          })
        }>전송</button>
      </div>
    </div>
  );
};

export default ApiTestPanel;