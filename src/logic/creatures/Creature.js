import stampit from "stampit";
import NoThis from "util/stamps/NoThis";
import UniqueId from "util/stamps/UniqueId";

const MAX_INVENTORY_SIZE = 9;

const Creature = stampit.compose(NoThis, UniqueId, stampit({
  props: {
    inventorySize: MAX_INVENTORY_SIZE,
  },

  methods: {
    increaseHealth(creature, amount) {
      creature.health += amount;
      if (creature.health > creature.maxHealth) {
        creature.health = creature.maxHealth;
      }
    },

    removeFromInventory(creature, item) {
      creature.inventory.splice(creature.inventory.indexOf(item), 1);
    },

    addToInventory(creature, item) {
      creature.inventory.push(item);
    },
  },

  init({ instance }) {
    Object.assign(instance, {
      health: instance.maxHealth,
      inventory: [],
    });
  },
}));

export default Creature;
