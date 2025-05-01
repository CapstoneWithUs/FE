const D = Math.pow(1/2, 1/10);

const getTimeDecaySum = (data, now) => {
  if (data.length == 0) return 0;
  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const { value, time } = data[i];
    x += value * Math.pow(D, (now-time)/1000);
  }
  const len = (Math.pow(D, (now-data[0].time)/1000)-1)/Math.log(D);
  return x/len;
};

export default getTimeDecaySum;
