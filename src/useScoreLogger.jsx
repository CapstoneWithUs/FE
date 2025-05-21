import { useRef } from "react";
import { SCORE_LOG_TERM } from './constants';
import getHistogramArea from './getHistogramArea';

export function useScoreLogger(startTime) {
  const scoreLog = useRef([[{ time: startTime, value: 0 }], []]);
  const prvTimeRef = useRef(startTime);

  const scoreLogger = (score) => {
    const now = Date.now();
    const prvTime = prvTimeRef.current;

    if (now - prvTime < SCORE_LOG_TERM) {
      scoreLog.current[1].push({ time: now, value: score });

      const duration = now - prvTime || 1;
      scoreLog.current[0][scoreLog.current[0].length - 1].value =
        getHistogramArea(scoreLog.current[1], prvTime) / duration;
    } else {
      const duration = now - prvTime || 1;
      scoreLog.current[0].push({
        time: now,
        value: getHistogramArea(scoreLog.current[1], prvTime) / duration
      });

      scoreLog.current[1] = [{ time: now, value: score }];
      prvTimeRef.current = now;
    }
  };

  return {
    scoreLog,
    scoreLogger
  };
}
