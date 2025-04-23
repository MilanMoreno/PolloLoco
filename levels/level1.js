/**
 * Creates a new level instance (Level1).
 * Adds enemies (chickens, etc.), clouds, background, coins, bottles, and SpecialAttacks.
 * @returns {Level} A complete level instance for the game
 */
function createLevel1() {
    return new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new MiniChicken(),new MiniChicken(),new MiniChicken(),new MiniChicken(),new MiniChicken(),new MiniChicken(),
        new Endboss(),
      
    ],

    [
                new Cloud(),
                new Cloud(),
                new Cloud()
              ],
     
    [
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', -724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/2.png', -724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/2.png', -724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/2.png', -724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 724),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 724 * 2),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/1.png', 724 * 2),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/1.png', 724 * 2),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/1.png', 724 * 2),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/air.png', 724 * 3),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/3_third_layer/2.png', 724 * 3),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/2_second_layer/2.png', 724 * 3),
        new BackgroundObject('img_pollo_locco/img/5_background/layers/1_first_layer/2.png', 724 * 3)
    ],
    [
        new Coin(350, 0),
        new Coin(400, 10),
        new Coin(450, 100),
        new Coin(500, 10),
        new Coin(550, 15),
        new Coin(600, 10),

        
        new Coin(650, 10),
        new Coin(700, 190),
        new Coin(750, 150),
        new Coin(800, 220),
        new Coin(850, 220),
        new Coin(900, 220),
        new Coin(950, 230),
        new Coin(1000, 150),
        new Coin(1050, 5),
        new Coin(1150, 2),
        new Coin(1200, 1),
        new Coin(1250, 150),
        new Coin(450, 10),
        new Coin(650, 300),
        new Coin(600, 380),
        
        new Coin(350, 240),
        new Coin(2500, 5),
        new Coin(1450, 255),
        new Coin(450, 205),
    ],
    [
        new Bottle(400, 400),
        new Bottle(500, 415),
        new Bottle(600, 410),
        new Bottle(700, 415),
        new Bottle(900, 415),
        new Bottle(1000, 410),
    
        new Bottle(500, 420),
        new Bottle(600, 415),
        new Bottle(700, 400),
        new Bottle(800, 400),
        new Bottle(900, 415),
        new Bottle(900, 410),

        new Bottle(1400, 410),
        new Bottle(1500, 410),
        new Bottle(1600, 410),
        new Bottle(1700, 410),
        new Bottle(1800, 415),
        new Bottle(1900, 415)
    ],
    [
    new Specialatack(100,160),
    new Specialatack(600,160),
    new Specialatack(800,160),
    new Specialatack(600,60)
    ]

);

}