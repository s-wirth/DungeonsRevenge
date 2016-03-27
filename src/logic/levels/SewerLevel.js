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

function randomPositionIn(room) {
  return [
    Math.floor(room.getLeft() + (room.getRight() - room.getLeft()) * Math.random()),
    Math.floor(room.getTop() + (room.getBottom() - room.getTop()) * Math.random()),
  ];
}

const SewerLevel = Map.compose(stampit({
  props: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },

  init({ instance: map }) {
    function spawnNumberOfEnemies(type, number, rooms) {
      for (let i = 0; i < number; i++) {
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const position = randomPositionIn(room);
        const creature = makeCreature(type, { x: position[0], y: position[1] });
        map.addCreature(creature);
      }
    }

    function spawnEnemies(rooms, proportionOfRats, proportionOfMinions) {
      const ratsToSpawn = proportionOfRats * NUMBER_OF_ENEMIES;
      const minionsToSpawn = proportionOfMinions * NUMBER_OF_ENEMIES;

      spawnNumberOfEnemies("mutantRat", ratsToSpawn, rooms);
      spawnNumberOfEnemies("minion", minionsToSpawn, rooms);
    }

    function makeDoors(x, y) {
      map.setTile("door", { x, y });
    }

    function getDoors(rooms) {
      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        room.getDoors(makeDoors);
      }
    }

    function spawnHealingPotions(rooms, number) {
      for (let i = 0; i < number; i++) {
        const randomRoom = Math.floor(Math.random() * rooms.length);
        const position = randomPositionIn(rooms[randomRoom]);
        const potion = makeItem("healingPotion", { x: position[0], y: position[1] });
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
      map.setStairs(rooms[0].getCenter(), rooms[rooms.length - 1].getCenter());
    } else {
      map.setStairs(null, rooms[rooms.length - 1].getCenter());
    }

    map.setInitialPlayerPosition(rooms[0].getCenter()[0], rooms[0].getCenter()[1]);
    getDoors(rooms);
    spawnHealingPotions(rooms, map.numberOfHealingPotions);

    spawnEnemies(rooms, map.rats, map.minions);
  },
}));

export default SewerLevel;
