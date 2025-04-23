
/**
 * Displays the progress of the collected coins.
 */
class CoinsStatusBar extends DrawableObject {
    IMAGES = [
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];
    percentage = 0; 

    constructor() {
        super();
        this.loadImages(this.IMAGES);
    
        this.x = 10;
        this.y = 85;
        this.width = 200;
        this.height = 60;

        this.setPercentage(0);
    }

    /**
     * Determines the index based on this.percentage (0..100).
     */
    resolveImageIndex() {
        if (this.percentage >= 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Sets the percentage image (0..100).
     */
    setPercentage(percentage) {
        this.percentage = Math.min(percentage, 100); 
        const imageIndex = this.resolveImageIndex();
        const path = this.IMAGES[imageIndex];
        this.img = this.imageCache[path];
    }

    /**
     * Resets the progress back to 0%.
     */
    resetPercentage() {
        this.setPercentage(0);
    }
    
    /**
     * Draws the status bar on the canvas.
     */
    render(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.draw(ctx);
        ctx.restore();
    }
}
