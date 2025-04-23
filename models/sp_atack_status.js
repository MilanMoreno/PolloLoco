/**
 * A status bar for the "Special Attack" (grenade).
 * Can be filled percentage-wise.
 */
class SpecialatackStatusBar extends DrawableObject {
    IMAGES = [
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];
    percentage = 0; 
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 100; 
        this.y = 200; 
        this.setPercentage(0);
    }

     /**
     * Sets the percentage progress (0..100).
     */
    setPercentage(percentage) {
        this.percentage = Math.min(percentage, 100);
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

      /**
     * Calculates the index for the appropriate image (0..5).
     */
    resolveImageIndex() {
        return Math.floor(this.percentage / 20); 
    }
    
      /**
     * Renders the bar on the canvas context.
     */
    render(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        this.draw(ctx);
        ctx.restore();
    }
}
