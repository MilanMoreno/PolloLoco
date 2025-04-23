/**
 * Represents the playable character Pepe.
 * Contains animations, movement logic, collisions, etc.
 */
class Character extends MovableObject {
  collectedBottles = 0;
  height = 300;
  width = 100;
  y = 300;
  speed = 5;
  isIdle = false;
  isSleeping = false;

  idleTimer = null;
  lastInputTime = Date.now();

  IMAGES_IDLE = [
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'
  ];

  IMAGES_SLEEPING = [
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png'
  ];

  IMAGES_WALKING = [
    'img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
    'img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
  ];

  IMAGES_JUMP_ASCEND = [
    'img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-35.png'
  ];

  IMAGES_JUMP_DESCEND = [
    'img_pollo_locco/img/2_character_pepe/3_jump/J-39.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
    'img_pollo_locco/img/2_character_pepe/3_jump/J-36.png'
  ];

  IMAGES_DEAD = [
    'img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-56.png',
    'img_pollo_locco/img/2_character_pepe/5_dead/D-57.png'
  ];

  IMAGES_HURT = [
    'img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
    'img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
    'img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png'
  ];

  walking_sound = new Audio('audio/footsteps_character.mp3');
  currentImage = 0;
  isMoving = false;
  lastAnimationTime = 0;
  animationInterval = 200;

  constructor() {
    super().loadImage('img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
    this.height = 380; this.width = 100; this.y = 40;
    this.keyboard = keyboard;
    this.offset = { top: 20, left: 15, right: 15, bottom: 0 };
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP_ASCEND);
    this.loadImages(this.IMAGES_JUMP_DESCEND);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_SLEEPING);
    this.resetIdleTimer();
    this.applyGravity();
    this.animate();
  }

  /**
    * Moves the character to the right.
    * Logs the new X position in the console.
    */
  moveRight() {
    this.otherDirection = false;
    if (this.x < 2800) {
      this.x += this.speed;
    } else {
      this.x = 2800;
    }
  }

  /**
   * Moves the character to the left.
   * Logs the new X position in the console.
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  /**
   * Checks if the character is currently hurt (less than 1 second ago).
   * @returns {boolean}
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed < 1000 && this.energy > 0;
  }

  /**
    * Checks if two objects are colliding (depending on offset etc.)
    * @param {MovableObject} mo - e.g., Chicken
    * @returns {boolean} true if they are touching
    */
  isColliding(mo) {
    if (this.isJumping) {
      return (
        this.x + this.jumpHitBox.left < mo.x + mo.width - mo.offset.right &&
        this.x + this.width - this.jumpHitBox.right > mo.x + mo.offset.left &&
        this.y + this.jumpHitBox.top < mo.y + mo.height - mo.offset.bottom &&
        this.y + this.jumpHitBox.bottom > mo.y + mo.offset.top
      );
    } else {
      return (
        this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
        this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
        this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
        this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
      );
    }
  }

  handleInput(input) {
    const isMovementKey = ['LEFT', 'RIGHT', 'SPACE', 'UP', 'DOWN', 'D', 'ENTER'].some(key => input[key]);
    if (isMovementKey) {
      this.lastInputTime = Date.now();
      this.resetIdleTimer();
    }
  }

  /**
   * Resets the idle logic, i.e., the character only starts idling after a certain time.
   */
  resetIdleTimer() {
    this.isIdle = false;
    this.isSleeping = false;
    clearTimeout(this.idleTimer);
    clearTimeout(this.sleepTimer);

    
    this.idleTimer = setTimeout(() => {
     this.isIdle = true;
      this.sleepTimer = setTimeout(() => {
        this.isSleeping = true;
      }, 1500);

    }, 100);
  }

  handleCollisionWithChicken(chicken) {
    if (this.isAboveGround() && this.y + this.height <= chicken.y + 10) {
      chicken.die();
      this.speedY = 15;
    } else if (!chicken.isDead) {
      this.hit();
    }
  }

  handleCollisionWithminiChicken(chicken) {
    if (this.isAboveGround() && this.y + this.height <= chicken.y + 10) {
      chicken.die();
      this.speedY = 15;
    } else if (!chicken.isDead) {
      this.hit();
    }
  }

  /**
   * Main animation loop. Calls move() and updateAnimation().
   */
  animate() {
    let self = this;
    function gameLoop() {
      if (gameEnded) {
        return;
      }
      self.move();
      self.updateAnimation();
      if (self.isIdle) {
        self.playAnimation(self.IMAGES_SLEEPING);
      }
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
  }

  /**
   * Character takes damage (e.g., -10 energy, play sound).
   */
 hit() {
    if (!isMuted) {
      const painSound = allSounds.find(audio => audio.src.includes('pain.mp3'));
      if (painSound) {
        painSound.play().catch(error => {
          if (error.name !== 'AbortError') {console.error('Fehler beim Abspielen von painSound:', error); }
        });
      }}
    const currentTime = new Date().getTime();
    if (currentTime - this.lastHit > 1000) {this.energy -= 10;
      if (this.energy <= 0) {
        this.energy = 0;
      } else {
        this.lastHit = currentTime;}}this.resetIdleTimer();
  }
  

  /**
   * Draws the character rotated by 45° (optional).
   */
  drawLookingAtCamera(ctx) {
    const width = this.width;
    const height = this.height;
    ctx.save();
    ctx.translate(this.x + width / 2, this.y + height / 2);
    ctx.rotate(Math.PI / 4);
    ctx.drawImage(this.img, -width / 2, -height / 2, width, height);
    ctx.restore();
  }

  /**
   * Plays an animation sequence of images (e.g., jump frames).
   */
  playAnimation(images) {
    const currentTime = Date.now();
    if (currentTime - this.lastAnimationTime >= this.animationInterval) {
      let i = this.currentImage % images.length;
      let path = images[i];
      this.img = this.imageCache[path];
      this.currentImage++;
      this.lastAnimationTime = currentTime;
    }
  }

  /**
   * Movement logic in horizontal direction + jump, fall, etc.
   */
  move() {
    if (!this.world || !this.world.keyboard) return;

    this.pauseWalkingSound();
    this.handleJump();
    this.handleLookUp();
    this.handleHorizontalMovement();
    this.handleResetIdleOnKeys();
    this.updateCamera();
    if (this.isMoving) this.resetIdleTimer();
  }

  pauseWalkingSound() {
    if (!this.walking_sound.paused) {
      this.walking_sound.pause();
    }
  }
  

  handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.isMoving = true;
      this.resetIdleTimer();
    }
  }

  handleLookUp() {
    if (this.world.keyboard.UP) {
      this.lookAtCamera();
      this.isMoving = true;
      this.resetIdleTimer();
    }
  }

  handleHorizontalMovement() {
    if (this.world.keyboard.RIGHT && this.x < Math.min(this.world.level.level_end_x, 2800)) {
      this.moveRight();
      if (!this.isMoving) this.walking_sound.play();
      this.isMoving = true;
    } else if (this.world.keyboard.LEFT && this.x > 0) {
      this.otherDirection = true;
      this.moveLeft();
      if (!this.isMoving) this.walking_sound.play();
      this.isMoving = true;
    } else {
      this.isMoving = false;
    }
  }

  handleResetIdleOnKeys() {
    if (this.world.keyboard.D || this.world.keyboard.ENTER) {
      this.resetIdleTimer();
    }
  }

  updateCamera() {
    if (this.world.level && this.world.canvas) {
      this.world.camera_x = Math.min(0,
        Math.max(-this.x + 100, -(this.world.level.level_end_x - this.world.canvas.width))
      );
    }
  }

  /**
   * Updates the animation (e.g., Dead/Hurt/Jump/Walk/Idle).
   */
  updateAnimation() {
    if (this.handleHurtAnimation()) return;
    if (this.forceNormalMode) {
      this.resetToNormal();
      return;
    }
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isLookingAtCamera) {
      this.currentImage = 0;
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      if (this.speedY > 0) {
        this.playAnimation(this.IMAGES_JUMP_ASCEND);
      } else {
        this.playAnimation(this.IMAGES_JUMP_DESCEND);
      }
    } else if (this.isSleeping) {
      this.playAnimation(this.IMAGES_SLEEPING);
    } else if (this.isIdle) {
      this.playAnimation(this.IMAGES_IDLE);
    } else {
      this.handleMovingAnimation();
    }
  }

  handleHurtAnimation() {
    if (this.hurtEndedAt) {
      const diff = Date.now() - this.hurtEndedAt;
      if (diff < 1000) {
        this.playAnimation(this.IMAGES_HURT);
        return true;
      } else {
        this.resetToNormal();
        this.hurtEndedAt = null;
        return true;
      }
    }
    return false;
  }

  resetToNormal() {
    this.img = this.imageCache['img_pollo_locco/img/2_character_pepe/2_walk/W-21.png'];
  }

  handleMovingAnimation() {
    if (this.isMoving) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.currentImage = 0;
    }
  }
}