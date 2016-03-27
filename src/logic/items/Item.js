import stampit from "stampit";
import NoThis from "util/NoThis";
import UniqueId from "util/stamps/UniqueId";

const Item = stampit.compose(NoThis, UniqueId(), stampit({
  methods: {
    activate(instance, activatingCreature) {
      instance.effects.forEach((effect) => effect(instance, activatingCreature));
    },
  },
}));

export default Item;
