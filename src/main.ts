// some comment to make things shut up
import car from "./assets/landscape/Platform.png";

const canvas = document.querySelector("canvas");
const c = canvas?.getContext("2d");
canvas!.width = innerWidth;
canvas!.height = innerHeight - 300;

const gravity = 0.5;

//player class
class Player {
  position: { x: number; y: number };
  width: number;
  height: number;
  velocity: { x: number; y: number };
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 25;
    this.height = 25;
  }

  draw() {
    c!.fillStyle = "red";
    c?.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    // the code right below here is gravity implementation
    if (this.position.y + this.height + this.velocity.y <= canvas!.height) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y += 0;
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

const landImage = new Image();
landImage.src = car;
landImage.width = 48;

const player = new Player();
// console.log(car);
// const platform = new Platform();
// const platforms = [
//   new Platform({ x: 200, y: 951, image: landImage }),
//   new Platform({ x: 400, y: 951, image: landImage }),
// ];

let lands: Platform[] = [];

for (let i = 0; i < 100; i++) {
  const land = new Platform({
    x: 0 + i + i * 45,
    y: innerHeight - 310,
    image: landImage,
  });
  lands.push(land);
}

const keys = {
  left: { pressed: false },
  right: { pressed: false },
};

let scrollOffset = 0;
function animate() {
  c?.clearRect(0, 0, canvas!.width, canvas!.height);
  requestAnimationFrame(animate);
  player.update();
  lands.forEach((land) => {
    land.draw();
  });
  // platforms.forEach((platform) => {
  //   platform.draw();
  // });

  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else {
    player.velocity.x = 0;
  }
  // move player and move platforms with parallax effect
  if (keys.right.pressed && player.position.x < 405) {
    player.velocity.x = 3.5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -3.5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      lands.forEach((land) => {
        land.position.x -= 5;
      });
      scrollOffset += 5;

      // platforms.forEach((platform) => {
      //   platform.position.x -= 5;
      // });
    } else if (keys.left.pressed) {
      lands.forEach((land) => {
        land.position.x += 5;
      });
      scrollOffset -= 5;
      // platforms.forEach((platform) => {
      //   platform.position.x += 5;
      // });
    }
  }

  // stops scrolling if  player is scrolled left passed -30
  if (keys.left.pressed && scrollOffset < -5) {
    // scrollOffset = -30;
    player.velocity.x = 0;
    lands.forEach((land) => {
      land.position.x;
    });
  }

  //stops scrolling if player is scrolled right passed 3000
  // if (scrollOffset > 30) {
  //   // scrollOffset = 3;
  //   player.velocity.y = 0;
  // }

  //platform collisions detection below
  /* The comment `//platform collisions detection below` is indicating that the code block following
    that comment is responsible for detecting collisions between the player and the platforms in the
    game. It checks if the player is colliding with any of the platforms by comparing their positions
    and dimensions. If a collision is detected, it sets the player's vertical velocity to 0,
    effectively stopping the player from falling through the platform. */

  // platforms.forEach((platform) => {
  //   if (
  //     player.position.y + player.height <= platform.position.y &&
  //     player.position.y + player.height + player.velocity.y >=
  //       platform.position.y &&
  //     player.position.x + player.width >= platform.position.x &&
  //     player.position.x <= platform.position.x + platform.width
  //   ) {
  //     player.velocity.y = 0;
  //   }
  // });

  if (scrollOffset > 20000) {
    console.log("player wins");
  }

  lands.forEach((platform) => {
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
}

// audio playback
function playBackgroundMusic(): void {
  const audio = document.getElementById("background-music") as HTMLAudioElement;
  audio.play();
}
function pauseBackgroundMusic(): void {
  const audio = document.getElementById("background-music") as HTMLAudioElement;
  audio.pause();
}

function playJumpSound(): void {
  const audio = document.getElementById("jump-sound") as HTMLAudioElement;
  audio.play();
}
function pauseJumpSound(): void {
  const audio = document.getElementById("jump-sound") as HTMLAudioElement;
  audio.pause();
}
console.log(pauseBackgroundMusic, pauseJumpSound);

//
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      // player.velocity.x = -2.4;
      keys.left.pressed = true;
      playBackgroundMusic();
      break;

    case 83:
      console.log("down");
      break;
    case 68:
      keys.right.pressed = true;
      playBackgroundMusic();

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
      break;
    case 87:
      // console.log("up");

      break;
  }
});
