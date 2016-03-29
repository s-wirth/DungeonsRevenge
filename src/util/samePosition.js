export default function samePosition(position1, position2) {
  if (!position1 || !position2) {
    return position1 === position2;
  }
  const { x: x1, y: y1 } = position1;
  const { x: x2, y: y2 } = position2;
  return x1 === x2 && y1 === y2;
}
