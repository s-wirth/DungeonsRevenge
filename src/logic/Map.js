import ndarray from "ndarray";
import stampit from "stampit";
import NoThis from "util/stamps/NoThis";
import Immutable from "immutable";
import terrain from "logic/terrain";

const DEFAULT_MAP_WIDTH = 80;
const DEFAULT_MAP_HEIGHT = 40;

const Map = NoThis.compose(stampit({
  props: {
    id: 0,
    width: DEFAULT_MAP_WIDTH,
    height: DEFAULT_MAP_HEIGHT,
  },

  methods: {
    setStairs(self, stairsDownPosition, stairsUpPosition) {
      if (stairsDownPosition) {
        self.stairsDownPosition = stairsDownPosition;
        self.setFeature("stairsDown", stairsDownPosition);
      }
      if (stairsUpPosition) {
        self.stairsUpPosition = stairsUpPosition;
        self.setFeature("stairsUp", stairsUpPosition);
      }
    },

    setInitialPlayerPosition(self, position) {
      self.initialPlayerPosition = position;
    },

    addCreature(self, creature) {
      self.creatures.push(creature);
    },

    removeCreature(self, creature) {
      self.creatures.splice(self.creatures.indexOf(creature), 1);
    },

    getCreatureAt(self, { x, y }) {
      const creatures = self.creatures;
      for (let i = 0; i < creatures.length; i++) {
        const creature = creatures[i];
        if (creature.x === x && creature.y === y) return creatures[i];
      }
      return null;
    },

    setFeature(self, type, { x, y }) {
      self.features = self.features.setIn([x, y], { type });
    },

    getFeature(self, { x, y }) {
      return self.features.getIn([x, y]);
    },

    addItem(self, item) {
      self.items.push(item);
    },

    removeItem(self, item) {
      self.items.splice(self.items.indexOf(item), 1);
    },

    setTile(self, type, { x, y }) {
      self.tiles.set(x, y, terrain[type]({
        x, y, type,
        adjacentTiles: self.adjacentTiles,
      }));
    },

    getTile(self, { x, y }) {
      if (x < 0 || x >= self.width) return null;
      if (y < 0 || y >= self.height) return null;
      return self.tiles.get(x, y);
    },

    adjacentTiles(self, { x, y }) {
      return {
        NW: self.getTile({ x: x - 1, y: y - 1 }),
        N: self.getTile({ x, y: y - 1 }),
        NE: self.getTile({ x: x + 1, y: y - 1 }),
        E: self.getTile({ x: x + 1, y }),
        SE: self.getTile({ x: x + 1, y: y + 1 }),
        S: self.getTile({ x, y: y + 1 }),
        SW: self.getTile({ x: x - 1, y: y + 1 }),
        W: self.getTile({ x: x - 1, y }),
      };
    },
  },

  init({ instance: self }) {
    const { width, height } = self;
    self.tiles = ndarray([], [width, height]);
    self.features = Immutable.Map();
    self.creatures = [];
    self.items = [];
  },
}));

export default Map;
