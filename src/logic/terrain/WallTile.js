import stampit from "stampit";
import Tile from "logic/terrain/Tile";

const WallTile = Tile.compose(stampit({
  props: {
    type: "wall",
  },
}));

export default WallTile;
