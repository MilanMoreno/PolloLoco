/**
 * Represents an explosion (e.g. a grenade explosion).
 * Has a short lifespan and then removes itself (removeFromWorld).
 */
class Explosion {
    constructor(x, y, world) {
        this.x = x;
        this.y = y;
        this.width = 200; 
        this.height = 200; 
        this.image = new Image();
        this.image.src = 'img_pollo_locco/img/2_character_pepe/5_dead/granade_explosion_picture.png';
        this.world = world;
        this.removeFromWorld = false;
        this.startTime = Date.now();
        this.image.onerror = () => {
        };
    }
   /**
     * Draws the explosion on the canvas.
     * After 1 second (Time > 1000 ms) => removeFromWorld=true
     */
    draw(ctx) {
        if (this.image.complete && this.image.naturalWidth !== 0) {
            ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
        }
        if (Date.now() - this.startTime > 1000) { 
            this.removeFromWorld = true;
        }
    }
}
