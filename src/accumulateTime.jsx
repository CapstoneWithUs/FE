export function accumulateTime(prv, now, acc_time, state, score) {
  if (state == 1) {
    if (score >= 80) acc_time[0] += now-prv;
    else if (score >= 60) acc_time[1] += now-prv;
    else if (score >= 40) acc_time[2] += now-prv;
    else acc_time[3] += now-prv;
  }
  else if (state == 2) {
    acc_time[4] += now-prv;
  }
  else if (state == 3) {
    acc_time[5] += now-prv;
  }
  else if (state == 4) {
    acc_time[6] += now-prv;
  }
};
