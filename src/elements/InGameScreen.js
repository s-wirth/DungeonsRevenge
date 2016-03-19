import React from "react";
import Dungeon from "elements/Dungeon";
import "css/InGameScreen";

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

function renderCreatures(creatures, sightMap) {
  if (!creatures) return null;

  function renderHealthBar(creature) {
    if (creature.type !== "player") {
      const width = creature.health * 100 / creature.maxHealth;
      return (
        <div className="health">
          <div className="health__remaining" style={{ width: `${width}%` }} />
        </div>
      );
    }
    return null;
  }

  return creatures.map((creature) => {
    if (sightMap.includes(creature.x, creature.y)) {
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
}

function renderHealingPotions(potions, sightMap) {
  if (!potions) return null;
  return potions.map((potion) => {
    if (sightMap.includes(potion.x, potion.y)) {
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
}

function renderPlayerStats(map, player) {
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
}

function renderInstructions() {
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
}

function InGameScreen({ creatures, sightMap, memorisedSightMap, potions, map, player }) {
  return (
    <div className="gameContainer">
      <div className="scene">
        <Dungeon map={ map } sightMap={ sightMap } memorisedSightMap={ memorisedSightMap } />
        { renderCreatures(creatures, sightMap) }
        { renderHealingPotions(potions, sightMap) }
      </div>
      <div className="infoBar">
        <div className="stats">
          { renderPlayerStats(map, player) }
        </div>
        <div className="eventLog">
        </div>
        <div className="items">
          { renderInstructions() }</div>
      </div>
    </div>
  );
}

InGameScreen.propTypes = {
  creatures: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  sightMap: React.PropTypes.object.isRequired,
  memorisedSightMap: React.PropTypes.object.isRequired,
  potions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  map: React.PropTypes.object.isRequired,
  player: React.PropTypes.object.isRequired,
};

export default InGameScreen;
