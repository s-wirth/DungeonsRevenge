import React from "react";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

const InGameScreen = React.createClass({

  renderCreatures() {
    let creatures = this.props.creatures;

    if (!creatures) return null;

    function renderHealthBar(creature) {
      if (creature.type !== "player") {
        let width = creature.health * 100 / creature.maxHealth;
        return (
          <div className="health">
            <div className="health__remaining" style={{ width: `${width}%` }} />
          </div>
        );
      }
      return null;
    }

    return creatures.map((creature) => {
      if (this.props.sightMap.includes(creature.x, creature.y)) {
        return (
          <div
            className={ `creature ${creature.type}-creature` }
            key={`creature-${creature.id}`}
            style={{ left: creature.x * TILE_WIDTH, top: creature.y * TILE_WIDTH }}
          >
            { renderHealthBar(creature) }
          </div>
        );
      }
      return null;
    });
  },

  renderHealingPotions() {
    let potions = this.props.potions;
    if (!potions) return null;
    return potions.map((potion) => {
      if (this.props.sightMap.includes(potion.x, potion.y)) {
        return (
          <div
            className="healingPotion"
            key={`${potion.id}`}
            style={{ left: potion.x * TILE_WIDTH, top: potion.y * TILE_WIDTH }}
          >
          </div>
        );
      }
      return null;
    });
  },

  renderPlayerStats() {
    let player = this.props.player;
    let map = this.props.map;
    return (
      <div>
        Current Level: { map.id + 1 }
        <div className="playerHealth">
          <div
            className="playerHealth__remaining"
            style={{ width: `${player.health * 100 / player.maxHealth}%` }}
          />
        </div>
        Health: { player.health }
        <br />
        <div className="experienceNeeded">
          <div
            className="playerExperience"
            style={{ width: `${player.experience * 100 / player.experienceNeeded}%` }}
          />
        </div>
          Experience: { player.experience } / { player.experienceNeeded }
        <br />
          Strength: { player.strength }
      </div>
    );
  },

  renderInstructions() {
    return (
      <div>
        <div className="movement">
          Move Up: ↑
          <br />
          Move Down: ↓
          <br />
          Move Right: →
          <br />
          Move Left: ←
          <br />
        </div>
        <div className="other">
          Skip Turn: .
          <br />
          Heal: walk on Potion
          <br />
          Kill Enemy: on contact
        </div>
      </div>
    );
  },

  render() {
    let { map, sightMap, memorisedSightMap } = this.props;
    return (
      <div className="gameContainer">
        <div className="scene">
          <Dungeon map={ map } sightMap={ sightMap } memorisedSightMap={ memorisedSightMap }/>
          { this.renderCreatures() }
          { this.renderHealingPotions() }
        </div>
        <div className="infoBar">
          <div className="stats">
            { this.renderPlayerStats() }
          </div>
          <div className="eventLog">
          </div>
          <div className="items">
            { this.renderInstructions() }</div>
        </div>
      </div>
    );
  },
});

export default InGameScreen;
