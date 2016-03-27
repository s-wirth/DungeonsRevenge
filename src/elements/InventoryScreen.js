import React from "react";
import ReactDOM from "react-dom";
import "css/InventoryScreen";
import potionSprite from "assets/sprites/items/potion.png";
import Mousetrap from "mousetrap";
import classnames from "classnames";
import UILink from "elements/UILink";
import bindFunctions from "util/bindFunctions";
import Screen from "elements/ui/Screen";
import Dialog from "elements/ui/Dialog";

function iconForItem(item) {
  if (item.type === "healingPotion") {
    return <img src={ potionSprite } width="16" height="16" />;
  }

  return null;
}

function renderItem(item, isHighlighted, activateItem, dropItem) {
  function onUseClick(event) {
    event.preventDefault();
    activateItem(item);
  }
  function onDropItemClick(event) {
    event.preventDefault();
    dropItem(item);
  }

  return (
    <li
      key={ item.id }
      className={ classnames(
        "ui-list__item ItemList__item flex-list flex-list--horizontal flex-list--small-gutters",
        {
          "ItemList__item--highlighted": isHighlighted,
        }
      )}
    >
      <div className="flex-list__item ui-list__icon">
        { iconForItem(item) }
      </div>
      <div className="flex-list__item flex-list__item--expand">
        { item.name }
      </div>
      <UILink className="flex-list__item" onClick={ onDropItemClick }>
        <u>D</u>rop
      </UILink>
      <UILink className="flex-list__item" onClick={ onUseClick }>
        { item.verb || "Use" }
      </UILink>
    </li>
  );
}

function renderItemList(inventory, highlightIndex, activateItem, dropItem) {
  if (inventory.length === 0) {
    return (
      <div className="ui-list">
        <div className="ui-list__emptyMessage">Your inventory is empty</div>
      </div>
    );
  }

  return (
    <ul className="ui-list">
      {
        inventory.map((item, index) => (
          renderItem(item, index === highlightIndex, activateItem, dropItem))
        )
      }
    </ul>
  );
}

class InventoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightIndex: -1,
    };
    bindFunctions(this, [
      "highlightNextItem",
      "highlightPreviousItem",
      "activateHighlightedItem",
      "activateItem",
      "dropHighlightedItem",
      "dropItem",
    ]);
  }

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);
    this.bindControls();
    domNode.focus();
  }

  componentWillUnmount() {
    this.unbindControls();
  }

  bindControls() {
    const { hideInventoryScreen } = this.props;
    const domNode = ReactDOM.findDOMNode(this);
    this.mousetrap = Mousetrap(domNode);
    this.mousetrap.bind(["escape", "i"], hideInventoryScreen);
    this.mousetrap.bind(["down", "j"], this.highlightNextItem);
    this.mousetrap.bind(["up", "k"], this.highlightPreviousItem);
    this.mousetrap.bind(["enter"], this.activateHighlightedItem);
    this.mousetrap.bind(["d"], this.dropHighlightedItem);
  }

  highlightedItem() {
    const { inventory } = this.props;
    const { highlightIndex } = this.state;
    return inventory[highlightIndex];
  }

  activateHighlightedItem() {
    if (!this.highlightedItem()) return;
    this.activateItem(this.highlightedItem());
  }

  activateItem(item) {
    const { activateItem, hideInventoryScreen } = this.props;
    activateItem(item);
    hideInventoryScreen();
  }

  unbindControls() {
    this.mousetrap.reset();
  }

  highlightNextItem() {
    const { inventory } = this.props;
    let { highlightIndex } = this.state;
    highlightIndex += 1;
    if (highlightIndex === inventory.length) highlightIndex = inventory.length - 1;
    this.setState({
      highlightIndex,
    });
  }

  highlightPreviousItem() {
    let { highlightIndex } = this.state;
    highlightIndex -= 1;
    if (highlightIndex < 0) highlightIndex = 0;
    this.setState({
      highlightIndex,
    });
  }

  dropHighlightedItem() {
    if (!this.highlightedItem()) return;
    this.dropItem(this.highlightedItem());
  }

  dropItem(item) {
    const { hideInventoryScreen, dropItem } = this.props;
    dropItem(item);
    hideInventoryScreen();
  }

  render() {
    const { inventory, hideInventoryScreen } = this.props;
    const { highlightIndex } = this.state;
    const { activateItem, dropItem } = this;

    return (
      <Screen onClick={ hideInventoryScreen }>
        <Dialog title="Inventory" onClose={ hideInventoryScreen }>
          { renderItemList(inventory, highlightIndex, activateItem, dropItem) }
        </Dialog>
      </Screen>
    );
  }
}
InventoryScreen.propTypes = {
  hideInventoryScreen: React.PropTypes.func.isRequired,
  inventory: React.PropTypes.array.isRequired,
  inventorySize: React.PropTypes.number.isRequired,
  activateItem: React.PropTypes.func.isRequired,
  dropItem: React.PropTypes.func.isRequired,
};

export default InventoryScreen;
