import stampit from "stampit";
import NoThis from "util/stamps/NoThis";
import { Howl } from "howler";

import playerDeath from "assets/audio/effects/playerDeath";
import footstepOnStone from "assets/audio/effects/footstepOnStone";

const SoundEffect = NoThis.compose(stampit({
  methods: {
    play(instance) {
      new Howl(instance).play();
    },
  },
}));

const SoundEffects = {
  playerDeath: SoundEffect.props({ urls: [playerDeath] }),
  footstepOnStone: SoundEffect.props({ urls: [footstepOnStone], volume: 0.5 }),
};

export default SoundEffects;
