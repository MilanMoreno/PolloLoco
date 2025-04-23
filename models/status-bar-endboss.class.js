/**
 * Displays the endboss's life indicator.
 */
class StatusBarEndboss extends DrawableObject {
    IMAGES = [
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green100.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green0.png'
    ];

    percentage = 100; 
    percentage = 0; 
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 510;
        this.y = 30;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }

    /**
     * Boss is hit => boss energy decreases => update display.
     */
    hit() {
        if (!this.isDead) {
            this.energy -= 5; 
            this.world.endbossStatusBar.setPercentage((this.energy / 20) * 100); 
            if (this.energy <= 0) {
                this.die();
            }
        }
    }
    
      /**
     * Sets the percentage (0..100) and updates the displayed image.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100)); 
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines the index in the IMAGES array based on the percentage value.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 0;
        else if (this.percentage > 80) return 1;
        else if (this.percentage > 60) return 2;
        else if (this.percentage > 40) return 3;
        else if (this.percentage > 20) return 4;
        else return 5;
    }
  /**
     * Draws the display on the canvas.
     */
    render(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        this.draw(ctx);
        ctx.restore();
    }
}
