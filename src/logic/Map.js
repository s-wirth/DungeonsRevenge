import ndarray from "ndarray";
import stampit from "stampit";
import NoThis from "util/NoThis";

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
        self.setTile("stairsDown", { x: stairsDownPosition[0], y: stairsDownPosition[1] });
      }
      if (stairsUpPosition) {
        self.stairsUpPosition = stairsUpPosition;
        self.setTile("stairsUp", { x: stairsUpPosition[0], y: stairsUpPosition[1] });
      }
    },

    setInitialPlayerPosition(self, x, y) {
      self.initialPlayerPosition = { x, y };
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

    addItem(self, item) {
      self.items.push(item);
    },

    removeItem(self, item) {
      self.items.splice(self.items.indexOf(item), 1);
    },

    setTile(self, type, { x, y }) {
      self.tiles.set(x, y, {
        type,
      });
    },
  },

  init({ instance: self }) {
    const { width, height } = self;
    self.tiles = ndarray([], [width, height]);
    self.creatures = [];
    self.items = [];
  },
}));

export default Map;
