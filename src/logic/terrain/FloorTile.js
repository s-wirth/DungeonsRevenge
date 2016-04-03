import stampit from "stampit";
import Tile from "logic/terrain/Tile";

const FloorTile = Tile.compose(stampit({
  props: {
    type: "floor",
  },
}));

export default FloorTile;
