/**
 * Represents a complete level.
 * Contains arrays for enemies, clouds, background images, coins, bottles, etc.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles; 
    Specialatack;
    level_end_x = 2896; 
    
 /**
     * @param {Array} enemies 
     * @param {Array} clouds 
     * @param {Array} backgroundObjects
     * @param {Array} coins
     * @param {Array} bottles
     * @param {Array} Specialatack
     */
    constructor(enemies, clouds, backgroundObjects, coins = [], bottles = [] , Specialatack = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles; 
        this.Specialatack = Specialatack;
    }
}
