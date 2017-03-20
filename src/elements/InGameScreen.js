import React from "react";
import ReactDOM from "react-dom";
import Dungeon from "elements/Dungeon";
import "css/InGameScreen";
import Tween from "gsap";
import InfoBar from "elements/InGameScreen/InfoBar";
import Mousetrap from "mousetrap";
import Log from "elements/Log";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

function HealthBar({ health, maxHealth }) {
  const width = health * 100 / maxHealth;
  return (
    <div className="health">
      <div className="health__remaining" style={{ width: `${width}%` }} />
    </div>
  );
}
HealthBar.propTypes = {
  health: React.PropTypes.number.isRequired,
  maxHealth: React.PropTypes.number.isRequired,
};

function Creature({ creature, onClick, showHealthBar }) {
  function onClickHandler() {
    onClick(creature);
  }

  return (
    <div
      className={ `creature ${creature.type}-creature` }
      style={{ left: creature.x * TILE_WIDTH, top: creature.y * TILE_WIDTH }}
      onClick={ onClickHandler }
    >
      {
        showHealthBar ?
        <HealthBar health={ creature.health } maxHealth={ creature.maxHealth } /> :
        null
      }
    </div>
  );
}
Creature.propTypes = {
  creature: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func.isRequired,
  showHealthBar: React.PropTypes.bool,
};

function renderCreatures(creatures, sightMap, movePlayerTo) {
  if (!creatures) return null;

  return creatures.map((creature) => {
    if (creature.type !== "player" && sightMap.includes(creature.x, creature.y)) {
      return (
        <Creature
          key={`creature creature-${creature.id}`}
          creature={ creature }
          onClick={ movePlayerTo }
          showHealthBar
        />
      );
    }
    return null;
  });
}

function renderPlayer(player, level, sightMap, skipPlayerTurn) {
  return (
    <Creature
      key={ `creature player-${level}` }
      creature={ player }
      onClick={ skipPlayerTurn }
    />
  );
}

function renderItems(items, sightMap) {
  if (!items) return null;
  return items.map((item) => {
    if (sightMap.includes(item.x, item.y)) {
      return (
        <div
          className={ `item ${item.type}` }
          key={`${item.id}`}
          style={{ left: item.x * TILE_WIDTH, top: item.y * TILE_WIDTH }}
        >
        </div>
      );
    }
    return null;
  });
}

class InGameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomLevel: 2.0,
    };
  }
  componentDidMount() {
    this.scrollPlayerIntoView({ animate: false });
    this.bindControls();
    ReactDOM.findDOMNode(this).focus();
  }

  componentDidUpdate() {
    this.scrollTimeout = setTimeout(() => {
      this.scrollPlayerIntoView();
    }, 100);
  }

  componentWillUnmount() {
    this.unbindControls();
    clearTimeout(this.scrollTimeout);
  }

  bindControls() {
    const domNode = ReactDOM.findDOMNode(this);
    this.mousetrap = Mousetrap(domNode);
    this.mousetrap.bind(["up", "k"], (event) => {
      event.preventDefault();
      this.props.updatePlayerPosition({
        y: this.props.player.y - 1,
      });
    });

    this.mousetrap.bind(["right", "l"], (event) => {
      event.preventDefault();
      this.props.updatePlayerPosition({
        x: this.props.player.x + 1,
      });
    });

    this.mousetrap.bind(["down", "j"], (event) => {
      event.preventDefault();
      this.props.updatePlayerPosition({
        y: this.props.player.y + 1,
      });
    });

    this.mousetrap.bind(["left", "h"], (event) => {
      event.preventDefault();
      this.props.updatePlayerPosition({
        x: this.props.player.x - 1,
      });
    });

    this.mousetrap.bind(".", (event) => {
      event.preventDefault();
      this.props.skipPlayerTurn();
    });

    this.mousetrap.bind("i", (event) => {
      event.preventDefault();
      this.props.showInventoryScreen();
    });

    this.mousetrap.bind("=", (event) => {
      event.preventDefault();
      const zoomLevel = this.state.zoomLevel;
      const MAX_ZOOM_LEVEL = 8;
      if (zoomLevel === MAX_ZOOM_LEVEL) return;
      const newZoomLevel = zoomLevel * 2;

      this.setState({ zoomLevel: newZoomLevel });
    });

    this.mousetrap.bind("-", (event) => {
      event.preventDefault();
      const zoomLevel = this.state.zoomLevel;
      const MIN_ZOOM_LEVEL = 0.5;
      if (zoomLevel <= MIN_ZOOM_LEVEL) return;
      const newZoomLevel = zoomLevel / 2;

      this.setState({ zoomLevel: newZoomLevel });
    });
  }

  unbindControls() {
    this.mousetrap.reset();
  }

  scrollPlayerIntoView({ animate } = { animate: true }) {
    const container = this.refs.scrollableContainer;
    if (!container) return;

    if (this.tween) this.tween.kill();

    const { zoomLevel } = this.state;

    const { player } = this.props;
    const scaledPlayerLeftOffset = player.x * TILE_WIDTH * zoomLevel;
    const scaledPlayerTopOffset = player.y * TILE_WIDTH * zoomLevel;

    const containerHeight = container.clientHeight;
    const contentHeight = container.scrollHeight;
    const containerWidth = container.clientWidth;
    const contentWidth = container.scrollWidth;

    let scrollTop = scaledPlayerTopOffset - (containerHeight / 2);
    const scrollTopMax = contentHeight - containerHeight;

    if (scrollTop < 0) scrollTop = 0;
    if (scrollTop > scrollTopMax) scrollTop = scrollTopMax;

    let scrollLeft = scaledPlayerLeftOffset - (containerWidth / 2);
    const scrollLeftMax = contentWidth - containerWidth;

    if (scrollLeft < 0) scrollLeft = 0;
    if (scrollLeft > scrollLeftMax) scrollLeft = scrollLeftMax;

    if (animate) {
      this.tween = Tween.to(container, 1.0, { scrollTop, scrollLeft });
    } else {
      container.scrollTop = scrollTop;
      container.scrollLeft = scrollLeft;
    }
  }

  render() {
    const {
      creatures, sightMap, memorisedSightMap, items, map, player, movePlayerTo, skipPlayerTurn,
      showInventoryScreen, logMessages,
    } = this.props;
    const { zoomLevel } = this.state;
    const unscaledMapWidth = map.width * TILE_WIDTH;
    const unscaledMapHeight = map.height * TILE_WIDTH;

    return (
      <div className="InGameScreen flex-list flex-list--vertical flex-list--gutters" tabIndex="0">
        <div
          className="InGameScreen__main-area flex-list__item flex-list__item--expand
            flex-list__item--expand-cross flex-list__item--clip"
        >
          <Log
            className="InGameScreen__Log"
            messages={ logMessages }
          />

          <div
            className="InGameScreen__scrollable-container"
            ref="scrollableContainer"
          >
            <div
              className="InGameScreen__zoom-wrapper"
              style={{
                transform: `scale(${zoomLevel})`,
                width: unscaledMapWidth,
                height: unscaledMapHeight,
              }}
            >
              <Dungeon {...{ map, sightMap, memorisedSightMap, movePlayerTo }} />
              { renderItems(items, sightMap) }
              { renderPlayer(player, map.id, sightMap, skipPlayerTurn) }
              { renderCreatures(creatures, sightMap, movePlayerTo) }
            </div>
          </div>
        </div>

        <InfoBar
          className="flex-list__item flex-list__item--expand-cross"
          {...{ map, player, showInventoryScreen }}
        />
      </div>
    );
  }
}

InGameScreen.propTypes = {
  creatures: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  sightMap: React.PropTypes.object.isRequired,
  memorisedSightMap: React.PropTypes.object.isRequired,
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  map: React.PropTypes.object.isRequired,
  player: React.PropTypes.object.isRequired,
  movePlayerTo: React.PropTypes.func.isRequired,
  updatePlayerPosition: React.PropTypes.func.isRequired,
  skipPlayerTurn: React.PropTypes.func.isRequired,
  showInventoryScreen: React.PropTypes.func.isRequired,
  logMessages: React.PropTypes.object.isRequired,
};

export default InGameScreen;
