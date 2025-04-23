
/**
* A smaller variant of Chicken (mini enemy).
*/
class MiniChicken extends MovableObject {
  height = 40;
  width = 20;
  y = 420;

  IMAGES_WALKING = [
      'img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];

  IMAGES_DEAD = [
      'img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
  ];

  isDead = false;
  removeFromWorld = false;
  direction = -1;
  walkingInterval;
  collisionInterval;

  constructor() {
      super().loadImage('img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
      this.loadImages(this.IMAGES_WALKING);
      this.loadImages(this.IMAGES_DEAD);
      this.isDead = false;
      this.x = 200 + Math.random() * 2500;
      this.speed = 0.1 + Math.random() * 0.3;
      this.animate();
      this.offset = {
          top: 10,
          left: 5,
          right: 5,
          bottom: 10
      };
  }
  
  /**
   * Dies => sets isDead=true, speed=0, and switches the image.
   */
  die() {
      if (!this.isDead) {
          this.isDead = true;
          this.speed = 0;
          this.img = this.imageCache['img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

          const squashSound = allSounds.find(audio => audio.src.includes('tomato-squash.mp3'));
          if (squashSound && !isMuted) squashSound.play();

          setTimeout(() => {
              this.removeFromWorld = true;
          }, 5000);
      }
  }
  
  /**
   * Starts the walking animation and collision checking.
   */
  clearIntervals() {
      clearInterval(this.walkingInterval);
      clearInterval(this.collisionInterval);
      this.clearGravityInterval();
  }

  /**
   * Moves, reverses direction at level boundaries, etc.
   */
  move() {
      this.x += this.speed * this.direction;
      this.handleBoundaries();
      this.checkCharacterProximity();
  }

  handleBoundaries() {
      if (this.world && this.world.level) {
          if (this.x <= 0 || this.x >= this.world.level.level_end_x) {
              this.direction *= -1;
              this.otherDirection = !this.otherDirection;
          }
      }
  }

  checkCharacterProximity() {
      if (this.world && this.world.character) {
          const distance = Math.abs(this.x - this.world.character.x);
          if (distance < 500) {
              this.moveTowardsCharacter();
          }
      }
  }

  animate() {
      this.startWalkingAnimation();
      this.startCollisionCheck();
  }

  startWalkingAnimation() {
      this.walkingInterval = setInterval(() => {
          if (!this.isDead) {
              this.move();
              this.updateAnimationFrame();
          }
      }, 300 / 60);
  }

  updateAnimationFrame() {
      const index = this.currentImage % this.IMAGES_WALKING.length;
      this.img = this.imageCache[this.IMAGES_WALKING[index]];
      this.currentImage++;
  }

  startCollisionCheck() {
      this.collisionInterval = setInterval(() => {
          if (this.world && !this.isDead && this.isColliding(this.world.character)) {
              const char = this.world.character;
              const charBottom = char.y + char.height;
              const miniTop = this.y;
              if (char.isFalling && charBottom < miniTop + 20) {
                  this.die();
                  char.speedY = 15;
              } else {
                  char.hit();
                  this.world.statusBar.setPercentage(char.energy);
              }
          }
      }, 1000 / 60);
  }

  moveTowardsCharacter() {
      if (this.world && this.world.character) {
          const characterX = this.world.character.x;
          if (this.x > characterX) {
              this.x -= this.speed;
              this.otherDirection = false;
          } else if (this.x < characterX) {
              this.x += this.speed;
              this.otherDirection = true;
          }
      }
  }

  clearIntervals() {
      clearInterval(this.walkingInterval);
      clearInterval(this.collisionInterval);
      this.clearGravityInterval();
  }
}
