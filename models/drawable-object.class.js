
/**
 * Base class for objects that can be drawn.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120; 
    y = 320;
    height = 100;
    width = 100;

    /**
     * Loads a single image into this.img.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    
    /**
     * Draws the image on the canvas (with coordinates & size).
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Optional: Draws a frame or similar for debugging purposes.
     */
    drawFrame(ctx) {

    }
    
    /**
     * Loads an array of images into the imageCache (preloading).
     */
    loadImages(arr) { 
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}

