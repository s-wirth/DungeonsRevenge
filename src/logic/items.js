import _ from "lodash";

let itemIdCounter = 0;

const ITEM_TYPES = {
  healingPotion: {
    type: "healingPotion",
    typeName: "Healing Potion",
    activate(item, activatingCreature) {
      const AMOUNT_HEALED = 5;
      activatingCreature.increaseHealth(AMOUNT_HEALED);
      activatingCreature.removeFromInventory(item);
    },
  },
};
export default ITEM_TYPES;

export function makeItem(type, { x, y }) {
  const id = itemIdCounter += 1;
  const itemType = ITEM_TYPES[type];
  const item = Object.assign(Object.create(itemType), {
    id,
    x, y,
  });

  // Methods on the returned object will have their first argument bound to the item instance
  _.functions(itemType).forEach((methodName) => {
    const method = itemType[methodName];
    item[methodName] = method.bind(null, item);
  });

  return item;
}
