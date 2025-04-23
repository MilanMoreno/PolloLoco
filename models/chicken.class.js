/**
 * Represents a normal Chicken (enemy).
 * Can wander around, die, and has its own walking animation.
 */
class Chicken extends MovableObject {
  height = 85;
  width = 40;
  y = 380;

  IMAGES_WALKING = [
      'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
      'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
      'img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];

  IMAGES_DEAD = [
      'img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
  ];

  isDead = false;
  removeFromWorld = false;
  direction = -1;

  walkingInterval;
  collisionInterval;

  constructor() {
      super().loadImage('img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
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
      }
  }

  /**
   * Sets isDead=true, stops speed, and shows dead.png.
   * After 5 seconds, removeFromWorld is set to true.
   */
  die() {
      if (!this.isDead) {
          this.isDead = true;
          this.speed = 0;
          this.img = this.imageCache['img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

          const squashSound = allSounds.find(audio => audio.src.includes('tomato-squash.mp3'));
          if (squashSound && !isMuted) squashSound.play();

          setTimeout(() => {
              this.removeFromWorld = true;
          }, 5000);
      }
  }

  registerSounds(allSounds) {
      this.allSounds = allSounds;
  }

  /**
   * Starts the walking animation (interval).
   */
  animate() {
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
    
  clearIntervals() {
      clearInterval(this.walkingInterval);
      clearInterval(this.collisionInterval);
      this.clearGravityInterval();
  }

  initializeEnemies() {
      this.level.enemies.forEach(enemy => {
          enemy.world = this;
          if (enemy instanceof Chicken && enemy.dieSound) {
              allSounds.push(enemy.dieSound);
          }
      });
  }
  
  /**
   * Moves the Chicken left or right,
   * reverses direction at level boundaries, or moves towards the character.
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