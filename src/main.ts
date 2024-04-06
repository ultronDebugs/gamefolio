// some comment to make things shut up

const canvas = document.querySelector("canvas");
const c = canvas?.getContext("2d");
canvas!.width = innerWidth;
canvas!.height = innerHeight;

const gravity = 0.5;
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

const player = new Player();

// player.update();

function animate() {
  c?.clearRect(0, 0, canvas!.width, canvas!.height);
  requestAnimationFrame(animate);
  player.update();
  // console.log("run");
}
animate();

addEventListener("keydown", ({ keyCode }) => {
  // console.log(keyCode);
  switch (keyCode) {
    case 65:
      console.log("left");
      player.velocity.x = -2.4;

      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      player.velocity.x = 2.4;
      break;
    case 87:
      console.log("up");
      player.velocity.y -= 20;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  console.log(keyCode);
  switch (keyCode) {
    case 65:
      console.log("left");
      player.velocity.x = 0;

      break;
    case 83:
      console.log("down");
      break;
    case 68:
      console.log("right");
      player.velocity.x = 0;
      break;
    case 87:
      console.log("up");
      // player.velocity.y -= 20;
      break;
  }
});
