
export const getLocationFromRangeAndAngle = (dir: number, range: number) => {
  const degPi = dir * (Math.PI / 180);
  const x = range * Math.sin(degPi);
  const y = range * Math.cos(degPi);
  return { x, y: -y };
}

export const getRangeAndAngleFromLocation = (fromX: number, fromY: number, toX: number, toY: number) => {
  const x = toX - fromX;
  const y = toY - fromY;
  const angle = 180 - Math.atan2(x, y) * 180 / Math.PI;
  const range = Math.floor(Math.sqrt(x*x + y*y));
  return { angle, range };
}
