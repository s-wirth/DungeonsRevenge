import stampit from "stampit";
import Tile from "logic/terrain/Tile";

function isFloor(tile) {
  return !tile || tile.type === "floor";
}
function isWall(tile) {
  return tile && tile.type === "wall";
}

const WallTile = Tile.compose(stampit({
  props: {
    type: "wall",
  },
  methods: {
    variant(self) {
      const adjacentTiles = self.adjacentTiles(self);

      const N = (
        isWall(adjacentTiles.N) &&
        (
          isFloor(adjacentTiles.NE) || isFloor(adjacentTiles.NW) ||
          isFloor(adjacentTiles.E) || isFloor(adjacentTiles.W)
        )
      );
      const E = (
        isWall(adjacentTiles.E) &&
        (
          isFloor(adjacentTiles.NE) || isFloor(adjacentTiles.SE) ||
          isFloor(adjacentTiles.N) || isFloor(adjacentTiles.S)
        )
      );
      const S = (
        isWall(adjacentTiles.S) &&
        (
          isFloor(adjacentTiles.SE) || isFloor(adjacentTiles.SW) ||
          isFloor(adjacentTiles.E) || isFloor(adjacentTiles.W)
        )
      );
      const W = (
        isWall(adjacentTiles.W) &&
        (
          isFloor(adjacentTiles.NW) || isFloor(adjacentTiles.SW) ||
          isFloor(adjacentTiles.N) || isFloor(adjacentTiles.S)
        )
      );
      const column = (
        isFloor(adjacentTiles.N) &&
        isFloor(adjacentTiles.E) &&
        isFloor(adjacentTiles.S) &&
        isFloor(adjacentTiles.W)
      );

      if (column) {
        return "column";
      }

      return `edgesIntersect-${N ? "N" : "_"}${E ? "E" : "_"}${S ? "S" : "_"}${W ? "W" : "_"}`;
    },
  },
}));

export default WallTile;
