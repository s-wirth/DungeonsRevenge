import Immutable from "immutable";

export function makeSightMap(width, height, divisions = 8) {
  let visibleTilesMatrix = new Immutable.Map();
  let divisionWidth = width / divisions;
  let divisionHeight = height / divisions;

  function divisionCoordinates(x, y) {
    let divisionX = Math.floor(x / divisionWidth);
    let divisionY = Math.floor(y / divisionHeight);
    return [divisionX, divisionY, x, y];
  }

  let sightMap = {
    visibleTiles: visibleTilesMatrix,

    divisions,

    setVisible(x, y) {
      sightMap.visibleTiles = sightMap.visibleTiles.setIn(divisionCoordinates(x, y), true);
    },

    getDivision(x, y) {
      let divisionX = Math.floor(x / divisionWidth);
      let divisionY = Math.floor(y / divisionHeight);
      return sightMap.visibleTiles.getIn([divisionX, divisionY]);
    },

    includes(x, y) {
      return sightMap.visibleTiles.getIn(divisionCoordinates(x, y));
    },

    combine(otherSightMap) {
      let combinedSightMap = makeSightMap(width, height, divisions);
      combinedSightMap.visibleTiles = sightMap.visibleTiles.mergeDeep(otherSightMap.visibleTiles);
      return combinedSightMap;
    },

    equals(otherSightMap) {
      return Immutable.is(sightMap.visibleTiles, otherSightMap.visibleTiles);
    },
  };

  return sightMap;
}
