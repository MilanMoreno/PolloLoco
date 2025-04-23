/**
 * Represents an Egg thrown by the boss.
 * Inherits from MovableObject.
 */
class Egg extends MovableObject {
  /**
   * Creates a new Egg instance.
   * Loads the egg image, sets its position and dimensions,
   * initializes its horizontal speed based on the given direction,
   * applies gravity, and starts its movement.
   *
   * @param {number} x - The initial x-coordinate of the egg.
   * @param {number} y - The initial y-coordinate of the egg.
   * @param {boolean} directionToRight - If true, the egg moves to the right; otherwise, to the left.
   */
  constructor(x, y, directionToRight) {
      super().loadImage('img_pollo_locco/img/4_enemie_boss_chicken/3_attack/egg.png');
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 50;
      this.speedX = directionToRight ? 15 : -15;
      this.applyGravity();
      this.move();
  }

  /**
   * Moves the egg horizontally by updating its x-coordinate.
   * This method uses a setInterval to update the position at approximately 60 frames per second.
   */
  move() {
      this.movementInterval = setInterval(() => {
          this.x += this.speedX;
      }, 1000 / 60);
  }

  /**
   * Clears the movement interval and any gravity intervals.
   * This should be called when the egg is no longer needed to prevent memory leaks.
   */
  clearIntervals() {
      clearInterval(this.movementInterval);
      this.clearGravityInterval();
  }
}
