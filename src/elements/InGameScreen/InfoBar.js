import React from "react";
import classnames from "classnames";
import "css/InGameScreen/InfoBar";
import stairsIcon from "assets/ui/stairsIcon.png";
import strengthIcon from "assets/ui/strengthIcon.png";
import heartIcon from "assets/ui/heartIcon.png";
import UILink from "elements/UILink";
import audioOnIcon from "assets/ui/audioOnIcon.png";
import audioOffIcon from "assets/ui/audioOffIcon.png";

function renderPlayerStats(map, player) {
  return (
    <div className="flex-list__item flex-list__item--expand">
      <div className="flex-list flex-list--horizontal flex-list--small-gutters">
        <div className="flex-list__item flex-list flex-list--horizontal flex-list--small-gutters">
          <div className="flex-list__item">
            <img src={ stairsIcon } width="16" height="16" />
          </div>
          <div className="flex-list__item flex-list__item--expand">
            { map.id + 1 }
          </div>
        </div>

        <div className="flex-list__item flex-list flex-list--horizontal flex-list--small-gutters">
          <div className="flex-list__item">
            LVL
          </div>
          <div className="flex-list__item">
            { player.level }
          </div>
        </div>

        <div className="flex-list__item flex-list flex-list--horizontal flex-list--small-gutters">
          <div className="flex-list__item">
            <img src={ strengthIcon } width="16" height="16" />
          </div>
          <div className="flex-list__item">
            { Math.round(player.damage * 100) / 100 }
          </div>
        </div>
      </div>

      <div className="flex-list flex-list--horizontal flex-list--small-gutters">
        <div className="flex-list__item">
          <img src={ heartIcon } width="16" height="16" />
        </div>
        <div className="flex-list__item flex-list__item--expand">
          <div className="playerHealth ProgressBar ProgressBar--large">
            <div
              className="playerHealth__remaining"
              style={{ width: `${player.health * 100 / player.maxHealth}%` }}
            />
            <div className="ProgressBar__label">
              { Math.round(player.health) } / { Math.round(player.maxHealth) }
            </div>
          </div>
        </div>
      </div>

      <div className="flex-list flex-list--horizontal flex-list--small-gutters">
        <div className="flex-list__item" style={{ width: 16 }}>
          XP
        </div>
        <div className="flex-list__item flex-list__item--expand">
          <div className="experienceNeeded ProgressBar ProgressBar--large">
            <div
              className="playerExperience"
              style={{ width: `${player.experience * 100 / player.experienceNeeded}%` }}
            />
            <div className="ProgressBar__label">
              { Math.round(player.experience) } / { Math.round(player.experienceNeeded) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InfoBar({ className, map, player, showInventoryScreen, audioEnabled,
  toggleAudio }) {
  return (
    <div className={ classnames(className, "InfoBar") }>
      <div className="InfoBar__container flex-list flex-list--horizontal flex-list--gutters">
        { renderPlayerStats(map, player) }
        <div className="flex-list__item">
          <UILink button onClick={ showInventoryScreen }>INV</UILink>
        </div>
        <div className="flex-list__item">
          <UILink button onClick={ toggleAudio }>
            <img src={ audioEnabled ? audioOnIcon : audioOffIcon } />
          </UILink>
        </div>
      </div>
    </div>
  );
}
InfoBar.propTypes = {
  map: React.PropTypes.object.isRequired,
  player: React.PropTypes.object.isRequired,
  className: React.PropTypes.string,
  showInventoryScreen: React.PropTypes.func.isRequired,
  toggleAudio: React.PropTypes.func.isRequired,
  audioEnabled: React.PropTypes.bool,
};
