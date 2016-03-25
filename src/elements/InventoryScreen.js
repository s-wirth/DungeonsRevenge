import React from "react";
import ReactDOM from "react-dom";
import "css/InventoryScreen";
import potionSprite from "assets/sprites/items/potion.png";
import Mousetrap from "mousetrap";
import classnames from "classnames";
import UILink from "elements/UILink";
import bindFunctions from "util/bindFunctions";

function iconForItem(item) {
  if (item.type === "healingPotion") {
    return <img src={ potionSprite } width="16" height="16" />;
  }

  return null;
}

function renderItem(item, isFocused, activateItem, dropItem) {
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
          "ItemList__item--has-focus": isFocused,
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

function renderItemList(inventory, focusIndex, activateItem, dropItem) {
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
          renderItem(item, index === focusIndex, activateItem, dropItem))
        )
      }
    </ul>
  );
}

class InventoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusIndex: -1,
    };
    bindFunctions(this, [
      "highlightNextItem",
      "highlightPreviousItem",
      "activateFocusedItem",
      "activateItem",
      "dropFocusedItem",
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
    this.mousetrap.bind(["enter"], this.activateFocusedItem);
    this.mousetrap.bind(["d"], this.dropFocusedItem);
  }

  focusedItem() {
    const { inventory } = this.props;
    const { focusIndex } = this.state;
    return inventory[focusIndex];
  }

  activateFocusedItem() {
    if (!this.focusedItem()) return;
    this.activateItem(this.focusedItem());
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
    let { focusIndex } = this.state;
    focusIndex += 1;
    if (focusIndex === inventory.length) focusIndex = inventory.length - 1;
    this.setState({
      focusIndex,
    });
  }

  highlightPreviousItem() {
    let { focusIndex } = this.state;
    focusIndex -= 1;
    if (focusIndex < 0) focusIndex = 0;
    this.setState({
      focusIndex,
    });
  }

  dropFocusedItem() {
    if (!this.focusedItem()) return;
    this.dropItem(this.focusedItem());
  }

  dropItem(item) {
    const { hideInventoryScreen, dropItem } = this.props;
    dropItem(item);
    hideInventoryScreen();
  }

  render() {
    const { inventory, hideInventoryScreen } = this.props;
    const { focusIndex } = this.state;
    const { activateItem, dropItem } = this;

    return (
      <div className="InventoryScreen" tabIndex="0" onClick={ hideInventoryScreen }>
        <div className="InventoryScreen__content">
          <div className="flex-list flex-list--horizontal screen-header">
            <h2 className="flex-list__item flex-list__item--expand screen-header__title">
              Inventory
            </h2>
            <UILink
              flatButton
              className="flex-list__item"
              onClick={ hideInventoryScreen }
            >
              ☓
            </UILink>
          </div>
          { renderItemList(inventory, focusIndex, activateItem, dropItem) }
        </div>
      </div>
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
