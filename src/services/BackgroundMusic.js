import stampit from "stampit";
import NoThis from "util/stamps/NoThis";
import { Howl } from "howler";
import normalBackgroundMusic from "assets/audio/background/normal";

const FADE_DURATION = 1000;

const BackgroundMusic = NoThis.compose(stampit({
  methods: {
    setActiveTransition(instance, transition) {
      if (instance.activeTransition) {
        throw new Error("Can't begin a transition while one is already in progress");
      }

      instance.activeTransition = transition.then(() => {
        instance.activeTransition = null;
      });

      return instance.activeTransition;
    },

    stopMusic(instance) {
      const { currentMusic } = instance;

      if (!currentMusic) {
        return instance.setActiveTransition(Promise.resolve());
      }

      return instance.setActiveTransition(
        new Promise(resolve => {
          currentMusic.fade(1, 0, FADE_DURATION, resolve);
        }).then(() => currentMusic.stop())
      );
    },

    playTrack(instance, desiredTrack) {
      const { currentMusic } = instance;

      if (instance.activeTransition) return;

      if (currentMusic && desiredTrack === null) {
        instance.stopMusic();
        return;
      }

      if (!currentMusic || currentMusic.track !== desiredTrack) {
        instance.stopMusic()
          .then(() => {
            instance.currentMusic = new Howl({
              urls: [desiredTrack],
              loop: true,
            });
            instance.currentMusic.track = desiredTrack;
            instance.setActiveTransition(new Promise(resolve => {
              instance.currentMusic.play();
              instance.currentMusic.fade(0, 1, FADE_DURATION, resolve);
            }));
          });
      }
    },

    updateBackgroundMusic(instance) {
      const { gameState } = instance;

      if (!gameState.audioEnabled) {
        instance.playTrack(null);
      }

      if (gameState.visibleScreen === "inGame" || gameState.visibleScreen === "inventory") {
        const { map } = gameState;
        const desiredTrack = map.music || normalBackgroundMusic;
        instance.playTrack(desiredTrack);
      } else {
        instance.playTrack(null);
      }
    },
  },

  init({ instance }) {
    const { gameState } = instance;
    gameState.on("change", instance.updateBackgroundMusic);
  },
}));

export default BackgroundMusic;
