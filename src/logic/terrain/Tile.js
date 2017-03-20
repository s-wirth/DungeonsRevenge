import stampit from "stampit";
import NoThis from "util/stamps/NoThis";

const Tile = NoThis.compose(stampit({
  methods: {
    variant() {
      return "default";
    },
  },
}));

export default Tile;
