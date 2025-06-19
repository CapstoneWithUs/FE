const blinkScore = (blink) => {
  if (blink < 7/60) return (28/60+blink)/(35/60);
  if (blink <= 13/60) return 1;
  return Math.pow(1/2, (blink-13/60)/(30/60-13/60));
};

const headAngleScore = (head_angle_var) => {
  if (head_angle_var <= 1.1) return 1;
  return Math.pow(1/2, (head_angle_var-1.1)/(2.3-1.1));
};

const headMoveScore = (head_move) => {
  if (head_move <= 0.5) return 1;
  return Math.pow(1/2, (head_move-0.5)/(1.0-0.5));
};

const calculateFocusScore = (state, left_blink, right_blink, left_ear, right_ear, head_angle_var, head_move) => {
  if (state != 1) return 0;
  return (
    blinkScore(left_blink)*2
    + blinkScore(right_blink)*2
    + headAngleScore(head_angle_var)*1
    + headMoveScore(head_move)*1
  )/6;
};

export default calculateFocusScore;