const D = Math.pow(1/2, 1/10);

const getTimeDecayAvg = (data, now) => {
  if (data.length == 0) return 0;
  let x = 0;
  let y = 0;
  for (let i = 0; i < data.length; i++) {
    const { value, time } = data[i];
    x += value * Math.pow(D, (now-time)/1000);
    y += Math.pow(D, (now-time)/1000);
  }
  return x/y;
};

export default getTimeDecayAvg;
