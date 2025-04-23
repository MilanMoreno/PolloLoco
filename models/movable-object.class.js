/**
 * Base class for objects that can move (Character, Chickens, Bottles, etc.).
 * Inherits from DrawableObject.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    offset = { top: 0, left: 0, right: 0, bottom: 0 };
    oldY = 0;
    isFalling = false;
    gravityInterval;

    /**
     * Applies gravity (speedY decreases, object falls).
     */
    applyGravity() {
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

   /**
     * Stops the gravity interval.
     */
    clearGravityInterval() {
        clearInterval(this.gravityInterval);
    }

     /**
     * Checks if the object is still above the ground (e.g. y < 90).
     * @returns {boolean}
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 90;
        }
    }

    /**
     * Renders the object (possibly flipping it if otherDirection=true).
     */
    render(ctx) {
        if (this.otherDirection) {
            ctx.save();
            ctx.translate(this.width + this.x * 2, 0);
            ctx.scale(-1, 1);
        }
        this.draw(ctx);
        this.drawFrame(ctx);
        if (this.otherDirection) {
            ctx.restore();
        }
    }

      /**
     * Checks for a collision with another MovableObject (box test).
     */
    isColliding(mo) {
        return (
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
        );
    }
 /**
     * Character or object is hit => -10 Energy, sound.
     */
    hit() {
        if (!isMuted) {
            const painSound = allSounds.find(audio => audio.src.includes('pain.mp3'));
            if (painSound) painSound.play();
        }
        const currentTime = new Date().getTime();
        if (currentTime - this.lastHit > 1000) {
            this.energy -= 10;
            if (this.energy <= 0) {
                this.energy = 0;
            } else {
                this.lastHit = currentTime;
            }
        }
    }
    
 /**
     * Checks if Energy = 0 => dead.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
 /**
     * Moves (x += speed).
     */
    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Jumps up (speedY = 30).
     */
    jump() {
        this.speedY = 30;
    }

      /**
     * Moves to the left (x -= 10).
     */
    moveLeft() {
        this.x -= 10.0;
    }

      /**
     * Plays a sequence of images (animation).
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
