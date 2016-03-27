import ROT from "rot-js";
import Map from "logic/Map";
import {
  makeItem,
} from "logic/items";
import {
  makeCreature,
} from "logic/creatures";
import stampit from "stampit";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 40;
const NUMBER_OF_ENEMIES = 12;

const SewerLevel = Map.compose(stampit({
  props: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },

  init({ instance: map }) {
    function randomPositionIn(room) {
      const left = room.getLeft();
      const right = room.getRight();
      const width = right - left;
      const top = room.getTop();
      const bottom = room.getBottom();
      const height = bottom - top;

      return {
        x: Math.floor(left + (width * Math.random())),
        y: Math.floor(top + (height * Math.random())),
      };
    }

    function positionIsUnoccupied({ x, y }) {
      if (map.stairsDownPosition && x === map.stairsDownPosition.x && map.stairsDownPosition.y) {
        return true;
      }
      return (x === map.stairsUpPosition.x && y === map.stairsUpPosition.y) ||
        !map.getCreatureAt({ x, y });
    }

    function unoccupiedPositionIn(room) {
      const MAX_ATTEMPTS = 20;

      for (let attempts = 0; attempts < MAX_ATTEMPTS; attempts++) {
        const position = randomPositionIn(room);
        if (positionIsUnoccupied(position)) {
          return position;
        }
      }

      throw new Error(`Can't find an unoccupied position in room ${room}`);
    }

    function spawnNumberOfEnemies(type, number, rooms) {
      for (let i = 0; i < number; i++) {
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const position = unoccupiedPositionIn(room);
        const creature = makeCreature(type, position);
        map.addCreature(creature);
      }
    }

    function spawnEnemies(rooms, proportionOfRats, proportionOfMinions) {
      const ratsToSpawn = proportionOfRats * NUMBER_OF_ENEMIES;
      const minionsToSpawn = proportionOfMinions * NUMBER_OF_ENEMIES;

      spawnNumberOfEnemies("mutantRat", ratsToSpawn, rooms);
      spawnNumberOfEnemies("minion", minionsToSpawn, rooms);
    }

    function makeDoors(rooms) {
      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        room.getDoors((x, y) => map.setTile("door", { x, y }));
      }
    }

    function spawnHealingPotions(rooms, number) {
      for (let i = 0; i < number; i++) {
        const randomRoom = Math.floor(Math.random() * rooms.length);
        const position = randomPositionIn(rooms[randomRoom]);
        const potion = makeItem("healingPotion", { x: position.x, y: position.y });
        map.addItem(potion);
      }
    }

    const rotMap = new ROT.Map.Digger(MAP_WIDTH, MAP_HEIGHT, {
      roomWidth: [7, 12],
      roomHeight: [7, 13],
      dugPercentage: 0.5,
    });

    rotMap.create((x, y, wall) => {
      if (wall) {
        map.setTile("wall", { x, y });
      } else {
        map.setTile("floor", { x, y });
      }
    });

    const rooms = rotMap.getRooms();

    if (map.id !== 0) {
      map.setStairs(
        positionArrayToObject(rooms[0].getCenter()),
        positionArrayToObject(rooms[rooms.length - 1].getCenter())
      );
    } else {
      map.setStairs(
        null,
        positionArrayToObject(rooms[rooms.length - 1].getCenter())
      );
      map.setInitialPlayerPosition(
        positionArrayToObject(rooms[0].getCenter())
      );
    }

    makeDoors(rooms);
    spawnHealingPotions(rooms, map.numberOfHealingPotions);
    spawnEnemies(rooms, map.rats, map.minions);
  },
}));

export default SewerLevel;
