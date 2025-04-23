/**
 * Health indicator for the character.
 */
class StatusBar extends DrawableObject {
    IMAGES = [
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    percentage = 100; 
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 10;
        this.y = -15;
        this.width = 200;  
        this.height = 60;  
        this.setPercentage(100);
    }

    /**
     * Sets the energy percentage (0..100).
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];  
    }

    /**
     * Determines the index for the appropriate image (e.g. 0..5).
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        else if (this.percentage > 80)  return 4;
        else if (this.percentage > 60)  return 3;
        else if (this.percentage > 40)  return 2;
        else if (this.percentage > 20)  return 1;
        else                            return 0;  
    }

    /**
     * Draws the image (health bar) on the canvas.
     */
    render(ctx) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        this.draw(ctx); 
        ctx.restore(); 
    }
}
