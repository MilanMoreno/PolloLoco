/**
 * Represents a collectible Special-Attack object (e.g. grenade).
 */
class Specialatack extends MovableObject {
    constructor(x, y) {
        super().loadImage('img_pollo_locco/img/6_salsa_bottle/bottle_rotation/grenade.png.png');
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.offset = { top: 15, left: 15, right: 15, bottom: 15 }; 
    }
}
