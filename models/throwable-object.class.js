/**
* Represents a regular throwable bottle (e.g. Bottle).
* Can be thrown, falls to the ground, etc.
*/
class ThrowableObject extends MovableObject {
    constructor(x, y, direction) {
        super().loadImage('img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.x = x;
        this.y = y;
        this.height = 50;
        this.width = 50;
        this.speedX = direction ? -5 : 5; 
        this.throw();
    }
  
    throw() {
        this.speedY = 20; 
        this.applyGravity();
        this.moveForward();
    }
  
    moveForward() {
        setInterval(() => {
            this.x += this.speedX; 
        }, 1000 / 60); 
    }
  }
  