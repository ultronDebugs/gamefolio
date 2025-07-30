// some comment to make things shut up
import platformImage from "./assets/landscape/Platform.png";
// import spike from "./assets/landscape/Circular_Saw.png";
import cloudBackground from "./assets/landscape/Castle_Background_0.png";
import axeTrap from "./assets/landscape/Axe_Trap.png";
import spriteIdleRight from "./assets/Gangster Pixel Character Pack/Gangsters_2/Idle_2.png";
import spriteRunRight from "./assets/Gangster Pixel Character Pack/Gangsters_2/Walk.png";

const canvas = document.querySelector("canvas");
const c = canvas?.getContext("2d");
canvas!.width = 1024;
canvas!.height = 576;
// c?.fill("evenodd");

const obstacles = [];
obstacles.push(1, 2, 3, 4, 5, 6, 7, 8, 9);

const gravity = 0.5;

const createImage = (imageSrc: string) => {
  const image = new Image();
  image.src = imageSrc;
  return image;
};
//player class
class Player {
  position: { x: number; y: number };
  width: number;
  height: number;
  velocity: { x: number; y: number };
  frames: number;
  image;
  sprites: {
    stand: {
      right: HTMLImageElement;
      cropWidth: number;
      left: HTMLImageElement;
    };
    run: {
      right: HTMLImageElement;
      cropWidth: number;
      left: HTMLImageElement;
    };
  };
  currentSprite;
  currentCropWidth;
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 128;
    this.height = 128;
    this.image = createImage(spriteIdleRight);
    this.frames = 0;
    this.sprites = {
      stand: {
        right: createImage(spriteIdleRight),
        cropWidth: 100,
        left: createImage(spriteIdleRight),
      },
      run: {
        right: createImage(spriteRunRight),
        cropWidth: 100,
        left: createImage(spriteRunRight),
      },
    };
    this.currentSprite = this.sprites.stand.right;
    this.currentCropWidth = 90;
  }

  draw() {
    c?.drawImage(
      this.currentSprite,
      128 * this.frames,
      0,
      128,
      128,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.frames++;
    if (this.frames === 11) {
      this.frames = 0;
    }
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    // the code right below here is gravity implementation
    if (this.position.y + this.height + this.velocity.y <= canvas!.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  position: { x: number; y: number };
  height: number;
  width: number;
  image: CanvasImageSource;
  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;
    image: CanvasImageSource & HTMLImageElement;
  }) {
    this.position = {
      x,
      y,
    };
    this.height = image.height;

    this.image = image;
    this.width = image.width;
  }
  draw() {
    c?.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  position: { x: number; y: number };
  height: number;
  width: number;
  image: CanvasImageSource;
  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;
    image: CanvasImageSource & HTMLImageElement;
  }) {
    this.position = {
      x,
      y,
    };
    this.height = image.height;

    this.image = image;
    this.width = image.width;
  }
  draw() {
    c?.drawImage(this.image, this.position.x, this.position.y);
  }
}

class Obstacle {
  position: { x: number; y: number };
  height: number;
  width: number;
  image: CanvasImageSource;
  constructor({
    x,
    y,
    image,
  }: {
    x: number;
    y: number;

    image: CanvasImageSource & HTMLImageElement;
  }) {
    this.position = {
      x,
      y,
    };
    this.height = image.height;
    this.image = image;
    this.width = image.width;
  }
  draw() {
    c?.drawImage(this.image, this.position.x, this.position.y);
  }
}

const trap = createImage(axeTrap);

const obstacle = new Obstacle({ image: trap, x: 500, y: 400 });

const backgroundImage = createImage(cloudBackground);

const landImage = createImage(platformImage);

let player = new Player();

let land: Platform[] = [];

let backgroundScreen: GenericObject[] = [];

for (let i = 0; i < 100; i++) {
  const background = new GenericObject({
    x: 0 + i + i * 319,
    y: canvas!.height - 180,
    image: backgroundImage,
  });
  backgroundScreen.push(background);
}

// const genericObjects = [new GenericObject({})];

for (let i = 0; i < 100; i++) {
  const landTile = new Platform({
    x: 0 + i + i * 45,
    y: canvas!.height - 12,
    image: landImage,
  });
  land.push(landTile);
}
let scrollOffset = 0;

const initGame = () => {
  player = new Player();

  land = [];

  backgroundScreen = [];

  for (let i = 0; i < 100; i++) {
    const background = new GenericObject({
      x: 0 + i + i * 319,
      y: canvas!.height - 180,
      image: backgroundImage,
    });
    backgroundScreen.push(background);
  }

  // const genericObjects = [new GenericObject({})];

  for (let i = 0; i < 100; i++) {
    const landTile = new Platform({
      x: 0 + i + i * 45,
      y: canvas!.height - 12,
      image: landImage,
    });
    land.push(landTile);
  }
  scrollOffset = 0;
};

const keys = {
  left: { pressed: false },
  right: { pressed: false },
};

function animate() {
  c?.clearRect(0, 0, canvas!.width, canvas!.height);

  backgroundScreen.forEach((background) => {
    background.draw();
  });

  requestAnimationFrame(animate);
  land.forEach((land) => {
    land.draw();
  });
  obstacle.draw();

  player.update();
  // platforms.forEach((platform) => {
  //   platform.draw();
  // })

  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else {
    player.velocity.x = 0;
  }

  // object collision detection for the player against the obstacle

  // move player and move platforms with parallax effect
  if (keys.right.pressed && player.position.x < 405) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      backgroundScreen.forEach((background) => {
        background.position.x -= 3;
      });
      land.forEach((land) => {
        land.position.x -= 5;
        obstacle.position.x -= 0.02;
      });
      scrollOffset += 5;
    } else if (keys.left.pressed) {
      backgroundScreen.forEach((background) => {
        background.position.x += 3;
      });
      land.forEach((land) => {
        land.position.x += 5;
        obstacle.position.x += 0.02;
      });
      scrollOffset -= 5;
      // platforms.forEach((platform) => {
      //   platform.position.x += 5;
      // });
    }
  }

  // stops scrolling if  player is scrolled left passed -30
  if (keys.left.pressed && scrollOffset <= -300) {
    // scrollOffset = -30;
    player.velocity.x = 0;
    land.forEach((land) => {
      land.position.x += 0;
    });
  }

  //platform collisions detection below
  /* The comment `//platform collisions detection below` is indicating that the code block following
    that comment is responsible for detecting collisions between the player and the platforms in the
    game. It checks if the player is colliding with any of the platforms by comparing their positions
    and dimensions. If a collision is detected, it sets the player's vertical velocity to 0,
    effectively stopping the player from falling through the platform. */

  // win condition
  if (scrollOffset > 20000) {
    console.log("player wins");
  }

  // lose condition
  if (player.position.y > canvas!.height) {
    // console.log("you lose");
    initGame();
  }

  land.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  if (
    player.position.y + player.height <= obstacle.position.y &&
    player.position.y + player.height + player.velocity.y >=
      obstacle.position.y &&
    player.position.x + player.width >= obstacle.position.x &&
    player.position.x <= obstacle.position.x + obstacle.width
  ) {
    player.velocity.y = 0;
  }
}

// audio playback
/**
 * The function `playBackgroundMusic` plays the background music on a webpage.
 */
// function playBackgroundMusic(): void {
//   const audio = document.getElementById("background-music") as HTMLAudioElement;
//   audio.play();
// }

function playJumpSound(): void {
  const audio = document.getElementById("jump-sound") as HTMLAudioElement;
  audio.play();
}

//
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      // player.velocity.x = -2.4;
      keys.left.pressed = true;
      // playBackgroundMusic();
      break;

    case 83:
      console.log("down");
      break;
    case 68:
      keys.right.pressed = true;
      player.currentSprite = player.sprites.run.right;
      // playBackgroundMusic();

      break;
    case 87:
      player.velocity.y -= 10;
      playJumpSound();
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      // player.velocity.x = 0;
      keys.left.pressed = false;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      break;
    case 87:
      // console.log("up");

      break;
  }
});
