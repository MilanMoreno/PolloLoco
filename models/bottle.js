
/**
 * Represents a salsa bottle that can be collected in the level.
 */
class Bottle extends MovableObject {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super().loadImage('img_pollo_locco/img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.offset = { top: 10, left: 10, right: 10, bottom: 10 }; 
    }
}
