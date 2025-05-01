const blinkScore = (blink) => {
  if (blink <= 7/60) return 1;
  return Math.pow(1/2, (blink-7/60)/(13/60));
};

const calculateFocusScore = (left_blink, right_blink, left_ear, right_ear, head_angle_var, head_move) => {
  return (blinkScore(left_blink)*1+blinkScore(right_blink)*1)/2;
};

export default calculateFocusScore;
