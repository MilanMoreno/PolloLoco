/**
 * Represents a background image (e.g., trees, mountains) in the level.
 * Inherits from MovableObject.
 */
class BackgroundObject extends MovableObject {

    width = 725;
    height = 500;

    /**
     * Constructor loads the specified image and sets the coordinates.
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X-coordinate
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);

        this.x = x;
        this.y = 480 - this.height;
    }
}
