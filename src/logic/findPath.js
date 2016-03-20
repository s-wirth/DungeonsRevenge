import ROT from "rot-js";

export default function findPath(origin, destination, isTilePassable) {
  function canPass(x, y) {
    if (x === origin.x && y === origin.y || x === destination.x && y === destination.y) {
      return true;
    }
    return isTilePassable({ x, y });
  }

  const pathfinder = new ROT.Path.Dijkstra(origin.x, origin.y, canPass, { topology: 4 });
  const result = [];
  pathfinder.compute(destination.x, destination.y, (x, y) => result.push({ x, y }));
  return result;
}
