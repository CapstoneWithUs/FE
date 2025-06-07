import { useRef } from 'react';
import { SCORE_LOG_TERM } from './constants';

export function useWorstTimeRecorder(scoreLog) {
  const worstRecordRef = useRef([null, null]);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  const initMediaRecorder = (stream) => {
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    mediaRecorderRef.current.onstop = () => {
      if (!scoreLog.current || !scoreLog.current[0]) return;
      const x = scoreLog.current[0][scoreLog.current[0].length-1].value;
      setTimeout(() => {
        if (worstRecordRef.current[0] != null && worstRecordRef.current[0] < x) return;
        const record = [x, new Blob(recordedChunksRef.current, { type: 'video/webm' })];
        if (record[1].size == 0) return;
        recordedChunksRef.current = [];
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
          mediaRecorderRef.current.start();
        }
        worstRecordRef.current = record;
      }, 50);
    }
  }

  const startRecordingInterval = () => {
    if (!mediaRecorderRef.current) return;
    console.log(worstRecordRef.current);
    recordedChunksRef.current = [];
    mediaRecorderRef.current.start();
    recordingIntervalRef.current = setInterval(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    }, SCORE_LOG_TERM);
  };

  const stopRecordingInterval = () => {
    clearInterval(recordingIntervalRef.current);
    recordingIntervalRef.current = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  
  return {
    worstRecordRef,
    initMediaRecorder,
    startRecordingInterval,
    stopRecordingInterval,
  };
}
