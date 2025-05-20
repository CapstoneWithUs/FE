const getHistogramArea = (arr, start) => {
  let ret = 0;
  let prvt = start;
  for (let i = 0; i < arr.length; i++) {
    const { time, value } = arr[i];
    ret += (time-prvt)*value;
    prvt = time;
  }
  return ret;
};

export default getHistogramArea;
