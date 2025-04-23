
/**
 * A collectible coin object.
 */
class Coin extends MovableObject {
    constructor(x, y) {
        super().loadImage('img_pollo_locco/img/8_coin/coin_2.png');
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
        this.offset = { top: 30, left: 30, right: 30, bottom: 30 }; 
    }
}
