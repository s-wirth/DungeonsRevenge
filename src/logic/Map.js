import ndarray from "ndarray";
import stampit from "stampit";
import NoThis from "util/NoThis";

function makeTile(type) {
  return {
    type,
  };
}

const Map = NoThis.compose(stampit({
  props: {
    id: 0,
  },

  methods: {
    setStairs(self, stairsDownPosition, stairsUpPosition) {
      if (stairsDownPosition) {
        self.stairsDownPosition = stairsDownPosition;
        self.tiles.set(stairsDownPosition[0], stairsDownPosition[1], makeTile("stairsDown"));
      }
      if (stairsUpPosition) {
        self.stairsUpPosition = stairsUpPosition;
        self.tiles.set(stairsUpPosition[0], stairsUpPosition[1], makeTile("stairsUp"));
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
  },

  init({ instance: self }) {
    const { width, height } = self;
    self.tiles = ndarray([], [width, height]);
    self.creatures = [];
    self.items = [];
  },
}));

export default Map;
