import Immutable from "immutable";

export function makeSightMap(width, height, divisions = 8) {
  const visibleTilesMatrix = new Immutable.Map();
  const divisionWidth = width / divisions;
  const divisionHeight = height / divisions;

  function divisionCoordinates(x, y) {
    const divisionX = Math.floor(x / divisionWidth);
    const divisionY = Math.floor(y / divisionHeight);
    return [divisionX, divisionY, x, y];
  }

  const sightMap = {
    visibleTiles: visibleTilesMatrix,

    divisions,

    setVisible(x, y) {
      sightMap.visibleTiles = sightMap.visibleTiles.setIn(divisionCoordinates(x, y), true);
    },

    getDivision(x, y) {
      const divisionX = Math.floor(x / divisionWidth);
      const divisionY = Math.floor(y / divisionHeight);
      return sightMap.visibleTiles.getIn([divisionX, divisionY]);
    },

    includes(x, y) {
      return sightMap.visibleTiles.getIn(divisionCoordinates(x, y));
    },

    combine(otherSightMap) {
      const combinedSightMap = makeSightMap(width, height, divisions);
      combinedSightMap.visibleTiles = sightMap.visibleTiles.mergeDeep(otherSightMap.visibleTiles);
      return combinedSightMap;
    },

    equals(otherSightMap) {
      return Immutable.is(sightMap.visibleTiles, otherSightMap.visibleTiles);
    },
  };

  return sightMap;
}
