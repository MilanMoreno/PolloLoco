/**
 * Represents the Endboss (big hen).
 * Inherits from MovableObject.
 */
class Endboss extends MovableObject {
  width = 250;
  height = 100;
  y = 380;
  energy = 15;
  isDead = false;
  isHurt = false;
  isEnraged = false;
  isJumping = false;
  isAlert = true;
  speed = 3;

  // Speed and jump constants:
  SPEED_ALERT = 0;
  SPEED_WALKING = 3;
  SPEED_ENRAGED = 4;
  JUMP_HEIGHT = 30;

  // Image arrays:
  IMAGES_ALERT = [
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png'
  ];
  IMAGES_WALKING_ENDBOSS = [
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png'
  ];
  IMAGES_HURT = [
    'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png'
  ];
  IMAGES_DEAD = [
    'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
    'img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
  ];

  lastAnimationTime = 0;
  animationInterval = 200;

  /**
   * Creates a new Endboss instance.
   * Loads the first (Alert) image, initializes properties, preloads all animation images,
   * applies gravity, and starts the animation loop.
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.initProperties();
    this.loadAnimationImages();
    this.applyGravity();
    this.animate();
  }

  /**
   * Initializes basic properties of the Endboss.
   */
  initProperties() {
    this.width = 250;
    this.height = 500;
    this.x = 2600;
    this.y = -200;
    this.energy = 15;
    this.isDead = false;
    this.isHurt = false;
    this.isEnraged = false;
    this.isJumping = false;
    this.isAlert = true;
    this.speed = this.SPEED_ALERT;
  }

  /**
   * Loads all required image sequences for the animations.
   */
  loadAnimationImages() {
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING_ENDBOSS);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Main animation loop.
   * Updates the state of the Endboss and continuously requests the next animation frame.
   */
  animate() {
    const self = this;
    function gameLoop() {
      self.updateState();
      if (!self.isAboveGround() && self.isJumping) {
        self.isJumping = false;
      }
      requestAnimationFrame(gameLoop);
    }
    gameLoop();
  }

  /**
   * Updates the state of the Endboss and executes the corresponding animation and movement.
   */
  updateState() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isEnraged) {
      this.setSpeed(this.SPEED_ENRAGED);
      this.playAnimation(this.IMAGES_WALKING_ENDBOSS);
      this.moveTowardsCharacter();
      this.checkForJumpAttack();
    } else if (this.isAlert) {
      this.setSpeed(this.SPEED_ALERT);
      this.playAnimation(this.IMAGES_ALERT);
    } else {
      this.setSpeed(this.SPEED_WALKING);
      this.playAnimation(this.IMAGES_WALKING_ENDBOSS);
      this.moveTowardsCharacter();
    }
  }

  /**
   * Sets the current speed of the Endboss.
   * @param {number} newSpeed - New speed.
   */
  setSpeed(newSpeed) {
    this.speed = newSpeed;
  }

  /**
   * Plays an animation sequence.
   * @param {string[]} images - Array of image paths for the animation.
   */
  playAnimation(images) {
    const currentTime = Date.now();
    if (currentTime - this.lastAnimationTime >= this.animationInterval) {
      const index = this.currentImage % images.length;
      this.img = this.imageCache[images[index]];
      this.currentImage++;
      this.lastAnimationTime = currentTime;
    }
  }

  /**
   * Checks if the Endboss is above the ground.
   * @returns {boolean} true if the Endboss is above the ground.
   */
  isAboveGround() {
    return this.y < 480 - this.height;
  }

  /**
   * Checks if the Endboss should switch to the enrage state (energy ≤ 6).
   * Triggers enrage actions if necessary.
   */
  checkEnrageState() {
    if (this.energy <= 6 && !this.isEnraged) {
      this.isEnraged = true;
      this.isAlert = false;
      this.world.showEnrageMessage = true;
      setTimeout(() => { this.world.showEnrageMessage = false; }, 1500);
      this.playEnrageSound();
      this.startEggAttackSequence();
    }
  }

  /**
   * Plays the enrage sound if available and not muted.
   */
  playEnrageSound() {
    const enrageSound = allSounds.find(audio => audio.src.includes('enrage_mode_endboss.mp3'));
    if (enrageSound && !isMuted) {
      enrageSound.play();
    }
  }

  /**
   * Starts the sequence in which the Endboss throws eggs.
   * The Endboss throws 5 eggs at intervals of 1.5 seconds.
   */
  startEggAttackSequence() {
    let throwCount = 0;
    const attackInterval = setInterval(() => {
      if (throwCount < 5 && !this.isDead) {
        this.throwEgg();
        throwCount++;
      } else {
        clearInterval(attackInterval);
      }
    }, 1500);
  }

  /**
   * Throws a single egg.
   * Creates a new Egg object and adds it to the array of Endboss projectiles.
   */
  throwEgg() {
    const characterX = this.world.character.x;
    const directionToRight = (characterX >= this.x);
    const egg = new Egg(
      this.x + 50,
      this.y + 300,
      directionToRight
    );
    egg.world = this.world;
    this.world.endbossProjectiles.push(egg);
  }

  /**
   * Moves the Endboss horizontally towards the player.
   */
  moveTowardsCharacter() {
    const characterX = this.world.character.x;
    if (this.x > characterX) {
      this.x -= this.speed;
      this.otherDirection = false;
    } else if (this.x < characterX) {
      this.x += this.speed;
      this.otherDirection = true;
    }
  }

  /**
   * Checks if the Endboss is close enough to the player to initiate a jump attack.
   */
  checkForJumpAttack() {
    const distance = Math.abs(this.x - this.world.character.x);
    if (distance < 300 && !this.isJumping) {
      this.triggerJump();
    }
  }

  /**
   * Triggers a jump by setting the jumping state and vertical speed.
   */
  triggerJump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.speedY = this.JUMP_HEIGHT;
  }

  /**
   * Checks collision with the player and sets the player's energy to 0 if a collision occurs.
   */
  checkCollisionWithCharacter() {
    if (this.isColliding(this.world.character)) {
      this.world.character.energy = 0;
      this.world.statusBar.setPercentage(0);
    }
  }

  /**
   * Causes the Endboss to take damage.
   * Reduces energy, plays the hit sound, and checks if the enrage state should be triggered.
   */
  hit() {
    if (!this.isDead) {
      this.energy -= 1;
      const hitSound = allSounds.find(audio => audio.src.includes('chicken_1.mp3'));
      if (hitSound && !isMuted) hitSound.play();
      this.isHurt = true;
      this.isAlert = false;
      setTimeout(() => { this.isHurt = false; }, 500);
      this.world.endbossStatusBar.setPercentage((this.energy / 20) * 100);
      this.checkEnrageState();
      if (this.energy <= 0) {
        this.die();
      }
    }
  }

  /**
   * Kills the Endboss.
   * Sets the death state, plays the death sound, kills other enemies, and triggers the win screen after a delay.
   */
  die() {
    if (!this.isDead) {
      this.isDead = true;
      this.world.showEndbossDeathMessage = true;
      this.killOtherEnemies();
      setTimeout(() => { this.world.showEndbossDeathMessage = false; }, 500);
      this.playDeathSound();
      setTimeout(() => {
        this.removeFromWorld = true;
        this.world.stopGame();
        this.world.showWinScreenMenu();
      }, 1000);
    }
  }

  /**
   * Kills all other enemies (Chickens and MiniChickens) in the level.
   */
  killOtherEnemies() {
    this.world.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken || enemy instanceof MiniChicken) {
        enemy.die();
      }
    });
  }

  /**
   * Plays the Endboss's death sound if available and not muted.
   */
  playDeathSound() {
    const deathSound = allSounds.find(audio => audio.src.includes('chicken_die_sound.mp3'));
    if (deathSound && !isMuted) {
      deathSound.play();
    }
  }

  /**
   * Delayed death of the Endboss, for example to play a level complete sound.
   * @param {World} world - The current game world.
   */
  dieWithDelay(world) {
    this.killOtherEnemies();
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      if (window.levelCompleteSound && !isMuted) {
        window.levelCompleteSound.addEventListener('ended', () => {
          setTimeout(() => {
            this.removeFromWorld = true;
            this.world.stopGame();
            world.showWinScreenMenu();
          }, 100);
        }, { once: true });
      } else {
        setTimeout(() => {
          this.removeFromWorld = true;
          this.world.stopGame();
          this.world.showWinScreenMenu();
        }, 100);
      }
    }, 100);
  }
}
