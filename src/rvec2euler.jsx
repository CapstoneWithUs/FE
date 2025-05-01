const rvec2euler = (cv, rvec) => {
    let rotationMat = new cv.Mat();
    let _ = new cv.Mat();
    cv.Rodrigues(rvec, rotationMat, _);
    let R = rotationMat.data64F;
    let x, y, z;
    let sy = Math.sqrt(R[0]*R[0]+R[3]*R[3]);
    if (sy >= 1e-6) { 
      x = Math.atan2(R[7], R[8]);
      y = Math.atan2(-R[6], sy);
      z = Math.atan2(R[3], R[0]);
    }
    else {
      x = Math.atan2(-R[5], R[4]);
      y = Math.atan2(-R[6], sy);
      z = 0;
    }
    rotationMat.delete();
    _.delete();
    return [x, y, z];
  };
  
  export default rvec2euler;
  