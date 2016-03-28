import ROT from "rot-js";
import samePosition from "util/samePosition";

export default function findPath(origin, destination, isTilePassable) {
  function canPass(x, y) {
    const position = { x, y };
    if (samePosition(position, origin) || samePosition(position, destination)) {
      return true;
    }
    return isTilePassable({ x, y });
  }

  const pathfinder = new ROT.Path.Dijkstra(origin.x, origin.y, canPass, { topology: 4 });
  const result = [];
  pathfinder.compute(destination.x, destination.y, (x, y) => result.push({ x, y }));
  return result;
}
