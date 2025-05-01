import rvec2euler from "./rvec2euler";

const getPose = (cv, object_points, coordination, focal_length, w, h) => {
  let objectMat = cv.matFromArray(object_points.length, 3, cv.CV_64F, object_points.flat());
  let coordMat = cv.matFromArray(coordination.length, 2, cv.CV_64F, coordination.flat());
  let cameraMat = cv.matFromArray(3, 3, cv.CV_64F, [
      focal_length, 0, w/2,
      0, focal_length, h/2,
      0, 0, 1
  ]);
  let distCoeffs = cv.Mat.zeros(4, 1, cv.CV_64F);
  let rvec = new cv.Mat();
  let tvec = new cv.Mat();
  
  let success = cv.solvePnP(objectMat, coordMat, cameraMat, distCoeffs, rvec, tvec, false, cv.SOLVEPNP_SQPNP);
  let ret = [];

  if (success) {
    let [x, y, z] = rvec2euler(cv, rvec);
    ret = [x, y, z, -tvec.data64F[0], tvec.data64F[1], Math.abs(tvec.data64F[2])];
  }
  else {}

  objectMat.delete();
  coordMat.delete();
  cameraMat.delete();
  distCoeffs.delete();
  rvec.delete();
  tvec.delete();

  return ret;
};

export default getPose;
