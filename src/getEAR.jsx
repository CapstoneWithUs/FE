const getEAR = (pts, yaw, pitch) => {
  return (
    Math.hypot(pts[1][0]-pts[5][0], pts[1][1]-pts[5][1])+
    Math.hypot(pts[2][0]-pts[4][0], pts[2][1]-pts[4][1])
  )/Math.hypot(pts[0][0]-pts[3][0], pts[0][1]-pts[3][1])/2
  * Math.cos(yaw) / Math.cos(pitch);
};

export default getEAR;
