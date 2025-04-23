
/**
 * Represents a cloud that moves from right to left.
 */
class Cloud extends MovableObject {
    width = 500;
    height = 200;
    y = 20;
    cloudInterval;
  
    constructor() {
        super().loadImage('img_pollo_locco/img/5_background/layers/4_clouds/1.png');
        this.x = 700 + Math.random() * 300; 
        this.y = 50;
  
        this.animate();
    }

    /**
     * Continuously moves the cloud to the left.
     * If it moves too far to the left,
     * it is repositioned to the right (wrap-around).
     */
    animate() {
        this.cloudInterval = setInterval(() => {
            this.moveLeft();
            if (this.x + this.width < 0) {
                this.x = 2500 + Math.random() * 500;
            }
        }, 1000 / 25);
    }
  
    /**
     * Stops the interval.
     */
    clearIntervals() {
        clearInterval(this.cloudInterval);
        this.clearGravityInterval();
    }
}
  