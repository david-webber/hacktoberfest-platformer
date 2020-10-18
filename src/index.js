import Phaser from "phaser";

import Start from "./scenes/Start";
import Main from "./scenes/Main";

import css from "./css/style.css";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: window.innerWidth,
  height: window.innerHeight,
  // scene: [Start, Main],
  scene: [Main],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true,
    },
  }
};

const game = new Phaser.Game(config);

