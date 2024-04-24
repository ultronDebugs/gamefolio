// some comment to make things shut up
import car from "../src/images/car.jpg";

const canvas = document.querySelector("canvas");
const c = canvas?.getContext("2d");
canvas!.width = innerWidth;
canvas!.height = innerHeight;

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
    this.width = 30;
    this.height = 30;
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
      this.velocity.y = 0;
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
    image: CanvasImageSource;
  }) {
    this.position = {
      x,
      y,
    };
    this.height = 20;
    this.image = image;
    this.width = 200;
  }
  draw() {
    c?.drawImage(this.image, this.position.x, this.position.y);
  }
}
const image = new Image();
image.src = car;
const player = new Player();
// console.log(car);
// const platform = new Platform();
const platforms = [
  new Platform({ x: 200, y: 300, image: image }),
  new Platform({ x: 400, y: 200, image: image }),
];
const keys = {
  left: { pressed: false },
  right: { pressed: false },
};

let scrollOffset = 0;
function animate() {
  c?.clearRect(0, 0, canvas!.width, canvas!.height);
  requestAnimationFrame(animate);
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });

  if (keys.right.pressed) {
    player.velocity.x = 5;
  } else {
    player.velocity.x = 0;
  }
  // move player
  if (keys.right.pressed && player.position.x < 405) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      platforms.forEach((platform) => {
        platform.position.x -= 5;
        scrollOffset += 5;
      });
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 5;
        scrollOffset -= 5;
      });
    }
  }

  //platform collisions detection below
  platforms.forEach((platform) => {
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
  if (scrollOffset > 2000) {
    // console.log("player wins");
  }
}
animate();

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      // player.velocity.x = -2.4;
      keys.left.pressed = true;
      break;

    case 83:
      console.log("down");
      break;
    case 68:
      keys.right.pressed = true;

      break;
    case 87:
      player.velocity.y -= 10;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  // console.log(keyCode);
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
