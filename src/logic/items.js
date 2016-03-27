import Item from "logic/items/Item";

function restoreFullHealth(item, activatingCreature) {
  activatingCreature.increaseHealth(activatingCreature.maxHealth);
}

function consumeItem(item, activatingCreature) {
  activatingCreature.removeFromInventory(item);
}

const ITEM_TYPES = [
  Item.props({
    type: "healingPotion",
    name: "healing potion",
    effects: [restoreFullHealth, consumeItem],
  }),
];

const ITEM_TYPES_DICT = ITEM_TYPES.reduce((dict, itemType) => {
  dict[itemType.fixed.props.type] = itemType;
  return dict;
}, {});

export default ITEM_TYPES_DICT;
