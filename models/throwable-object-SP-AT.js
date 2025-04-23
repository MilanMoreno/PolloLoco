/**
 * Represents the Special Attack (grenade).
 * Flies a certain distance, explodes, or disappears after a while.
 */
class ThrowableObject_SP_AT extends MovableObject {
  constructor(x, y, direction) {
    super().loadImage('img_pollo_locco/img/6_salsa_bottle/bottle_rotation/grenade.png.png');
    this.initProperties(x, y, direction);
    this.initIntervals();
    this.startAutoRemoveTimer(3000);
  }

  // Sets basic properties of the grenade
  initProperties(x, y, direction) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.height = 50;
    this.width = 50;
    this.speedX = direction ? -10 : 10;
    this.speedY = 15;
    this.gravity = 3;
    this.hasExploded = false;
    this.explosionRadius = 100;
    this.maxDistance = 300;
    // Interval IDs will be stored here later
    this.despawnTimeout = null;
    this.gravityInterval = null;
    this.movementInterval = null;
  }

  // Starts the movement and gravity intervals
  initIntervals() {
    this.applyGravity();
    this.throw();
  }

  // Starts a timer after which the object is automatically removed
  startAutoRemoveTimer(delay) {
    this.despawnTimeout = setTimeout(() => {
      this.cleanup();
    }, delay);
  }

  // Stops the auto-remove timer
  stopAutoRemoveTimer() {
    if (this.despawnTimeout) {
      clearTimeout(this.despawnTimeout);
      this.despawnTimeout = null;
    }
  }

  // Grenade physics: updates y-value and checks if conditions for explosion are met
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (!this.hasExploded) {
        this.y += this.speedY;
        this.speedY += this.gravity;
        if (this.y >= 400) {
          this.y = 400;
          this.explode(this.world);
        }
        if (Math.abs(this.x - this.initialX) > this.maxDistance) {
          this.cleanup();
        }
      }
    }, 1000 / 25);
  }

  // Moves the grenade horizontally
  throw() {
    this.movementInterval = setInterval(() => {
      if (!this.hasExploded) {
        this.x += this.speedX;
      }
    }, 1000 / 60);
  }

  // Triggers the explosion, plays sound, checks for hits, and cleans up
  explode(world) {
    if (this.hasExploded) return;
    this.hasExploded = true;
    this.stopAutoRemoveTimer();
    this.playExplosionSound();
    this.processEnemyHits(world);
    world.showExplosionImage(this.x, this.y);
    this.cleanup();
  }

  // Plays the explosion sound
  playExplosionSound() {
    if (!isMuted) {
      const explosionSound = allSounds.find(audio => audio.src.includes('impact_explosion_03.mp3'));
      if (explosionSound) {
        explosionSound.play().catch(error => {});
      }
    }
  }

  // Checks which enemies are within the explosion radius and handles hits
  processEnemyHits(world) {
    world.level.enemies.forEach(enemy => {
      if (this.isWithinRadius(enemy, this.explosionRadius)) {
        if (enemy instanceof Endboss) {
          enemy.energy = 0;
          enemy.isDead = true;
          enemy.dieWithDelay(world);
        } else {
          enemy.die();
        }
      }
    });
  }

  // Calculates whether a target object is within the explosion radius
  isWithinRadius(target, radius) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;
    const distanceX = Math.abs(centerX - targetCenterX);
    const distanceY = Math.abs(centerY - targetCenterY);
    return Math.sqrt(distanceX ** 2 + distanceY ** 2) <= radius;
  }

  // Clears all intervals and marks the object to be removed
  cleanup() {
    clearInterval(this.gravityInterval);
    clearInterval(this.movementInterval);
    this.stopAutoRemoveTimer();
    this.removeFromWorld = true;
  }
}
