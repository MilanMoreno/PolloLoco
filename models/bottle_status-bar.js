
/**
 * Represents the bottle display (StatusBar) at the top left.
 * Indicates how many bottles have been collected.
 */
class BottlesStatusBar extends DrawableObject {
    IMAGES = [
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
    ];
    percentage = 0; 

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = 35;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }
    
    /**
     * Determines which image index to use based on the percentage.
     * @returns {number} Index in the IMAGES array
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
     * Sets the percentage display and updates the displayed image.
     * @param {number} percentage - 0..100
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100)); 
        const imageIndex = this.resolveImageIndex(); 
        const path = this.IMAGES[imageIndex];
        this.img = this.imageCache[path]; 
    }
    
    /**
     * Renders the status bar on the canvas context.
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        this.draw(ctx);
        ctx.restore();
    }
}
