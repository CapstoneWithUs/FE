const blinkScore = (blink) => {
  if (blink <= 4/60) return 1;
  return Math.pow(1/2, (blink-4/60)/(20/60-4/60));
};

const headAngleScore = (head_angle_var) => {
  if (head_angle_var <= 0.14) return 1;
  return Math.pow(1/2, (head_angle_var-0.14)/(0.38-0.14));
};

const headMoveScore = (head_move) => {
  if (head_move <= 0.05) return 1;
  return Math.pow(1/2, (head_move-0.05)/(0.25-0.05));
};

const calculateFocusScore = (state, left_blink, right_blink, left_ear, right_ear, head_angle_var, head_move) => {
  if (state != 1) return 0;
  return (
    blinkScore(left_blink)*1
    + blinkScore(right_blink)*1
    + headAngleScore(head_angle_var)*2
    + headMoveScore(head_move)*2
  )/6;
};

export default calculateFocusScore;