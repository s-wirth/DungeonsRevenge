import React from 'react';

// This has to match the tile width in the CSS
const TILE_WIDTH = 16;

const Dungeon = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    let { map } = this.props;

    function renderTiles() {
      if (!map) return null;

      let width = map.shape[0];
      let height = map.shape[1];
      let result = [];

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let mapTile = map.get(x, y);
          if (mapTile) {
            result.push(
              <div className={ `${mapTile.type}-tile` } key={`${x}-${y}`}
                   style={{ left: x * TILE_WIDTH, top: y * TILE_WIDTH }}/>
            );
          }
        }
      }

      return result;
    }

    return <div>{ renderTiles() }</div>;
  },
});

export default Dungeon;