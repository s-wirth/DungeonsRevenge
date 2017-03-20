import hashFromList from "util/hashFromList";
import Tile from "logic/terrain/Tile";
import WallTile from "logic/terrain/WallTile";
import FloorTile from "logic/terrain/FloorTile";

const TILE_TYPES = [
  FloorTile,
  WallTile,
  // TODO: make doors a dungeon feature instead of a tile
  Tile.props({ type: "door" }),
];

const TILE_TYPES_HASH = hashFromList(TILE_TYPES, (stamp) => stamp.fixed.props.type);
export default TILE_TYPES_HASH;
