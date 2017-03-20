import stampit from "stampit";
import Tile from "logic/terrain/Tile";

const FloorTile = Tile.compose(stampit({
  props: {
    type: "floor",
  },
  methods: {
    variant(self) {
      const adjacentTiles = self.adjacentTiles(self);

      const N = adjacentTiles.N && adjacentTiles.N.type === "wall";
      const E = adjacentTiles.E && adjacentTiles.E.type === "wall";
      const S = adjacentTiles.S && adjacentTiles.S.type === "wall";
      const W = adjacentTiles.W && adjacentTiles.W.type === "wall";

      return `${N ? "N" : "_"}${E ? "E" : "_"}${S ? "S" : "_"}${W ? "W" : "_"}`;
    },
  },
}));

export default FloorTile;
