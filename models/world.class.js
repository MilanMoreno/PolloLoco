/**
 * Creates the World class, containing basic setup and methods for initializing the game.
 */
class World {

  /**
   * Constructs a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas element to render the game.
   * @param {Keyboard} keyboard - The Keyboard instance for player input.
   * @param {Level} level - The current level object with enemies, items, etc.
   */
  constructor(canvas, keyboard, level) {
    this.initParameters(canvas, keyboard, level);
    this.initStatusBarsAndCharacter();
    this.initArraysAndFlags();
    this.initImages();
    this.setWorld();
    this.initializeEnemies();
    this.startGameLoop();
    this.addFullscreenListeners();
  }

  /**
   * Initializes basic parameters like canvas context, keyboard, and level references.
   * @param {HTMLCanvasElement} canvas - The canvas element to render on.
   * @param {Keyboard} keyboard - The Keyboard instance for user input.
   * @param {Level} level - The game level containing enemies, items, etc.
   */
  initParameters(canvas, keyboard, level) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.keyboard = keyboard;
    this.level = level;
    this.camera_x = 0;
    this.gameSong = new Audio('audio/Pepe Peligroso vs Endboss Rooster.wav');
    allSounds.push(this.gameSong);
  }

  /**
   * Creates the Character object and all status bars for health, coins, bottles, etc.
   */
  initStatusBarsAndCharacter() {
    this.character = new Character();
    this.statusBar = new StatusBar();
    this.coinsStatusBar = new CoinsStatusBar();
    this.bottlesStatusBar = new BottlesStatusBar();
    this.endbossStatusBar = new StatusBarEndboss();
  }

  /**
   * Sets up arrays and flags for various game states (projectiles, collisions, etc.).
   */
  initArraysAndFlags() {
    this.endbossProjectiles = [];
    this.throwableObjects = [];
    this.throwableObject_SP_AT = [];
    this.lastThrowTime = 0;
    this.canThrowGrenade = false;
    this.grenadeUsed = false;
    this.gameStarted = false;
    this.gameLoop = null;
    this.showWinScreen = false;
    this.gameOver = false;
    this.menuDisplayed = false;
    this.showChallengeMessage = false;
    this.showFightMessage = false;
    this.endbossEncountered = false;
    this.showFirstFightText = false;
    this.showEnrageMessage = false;
    this.showEndbossDeathMessage = false;
  }

  /**
   * Loads important images such as the win screen, game over screen, explosion image, etc.
   */
  initImages() {
    this.winImage = new Image();
    this.gameOverImage = new Image();
    this.winImage.src = 'img_pollo_locco/img/9_intro_outro_screens/win/win_2.png';
    this.gameOverImage.src = 'img_pollo_locco/img/9_intro_outro_screens/game_over/game over!.png';
    this.explosionImage = new Image();
    this.explosionImage.src = 'img_pollo_locco/img/2_character_pepe/5_dead/granade_explosion_picture.png';
    this.explosionImage.onerror = () => {};
    this.showExplosionImageFlag = false;
    this.fightingAudio = new Audio('audio/fighting.mp3');
  }

  /**
   * Starts the main game logic: playing background music, launching the run loop, drawing, etc.
   */
  startGameLoop() {
    this.playGameSong();
    this.run();
    this.draw();
    this.waitForGameStart();
  }

  /**
   * Adds listeners for detecting fullscreen changes, and adjusts the canvas on page load.
   */
  addFullscreenListeners() {
    const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    events.forEach(ev => document.addEventListener(ev, this.handleFullscreenChange.bind(this)));
    window.addEventListener('load', () => {
      const canvas = document.getElementById('canvas');
      if (canvas) this.resizeCanvas();
    });
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => enemy.world = this);
  }

  /**
   * Initializes all enemies with a reference to this world object.
   */
  initializeEnemies() {
    this.level.enemies.forEach(enemy => {
      enemy.world = this;
      if (enemy instanceof Chicken && enemy.dieSound) {
        allSounds.push(enemy.dieSound);
      }
    });
  }

  /**
   * Shows an explosion image in the middle of the canvas.
   */
  showExplosionImage() {
    if (this.explosionImage.complete && this.explosionImage.naturalWidth !== 0) {
      this.showExplosionImageFlag = true;
      setTimeout(() => {
        this.showExplosionImageFlag = false;
      }, 1000);
    }
  }

  /**
   * Adds multiple objects (e.g., coins, enemies) to the canvas map.
   * @param {Object[]} objects - An array of drawable objects to be added.
   */
  addObjectsToMap(objects) {
    objects.forEach(o => this.addToMap(o));
  }

  /**
   * Waits for the player to press the RIGHT arrow key, then starts the game.
   */
  waitForGameStart() {
    const checkStartInterval = setInterval(() => {
      if (this.keyboard.RIGHT) {
        this.gameStarted = true;
        this.run();
        this.playGameSong();
        clearInterval(checkStartInterval);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          "Drücke RECHTS, um das Spiel zu starten!",
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      }
    }, 100);
  }

  /**
   * Resizes the canvas to fit the current browser window dimensions.
   */
  resizeCanvas() {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  /**
   * Main loop that updates collisions, throwing objects, etc. at 60 FPS.
   */
  run() {
    this.gameLoop = setInterval(() => {
      if (this.gameStarted && !this.gameOver) {
        this.checkCollisions();
        this.checkThrowObjects();
        this.checkThrowObjectsSPAT();
        this.removeDeadEnemies();
        this.checkGameOver();
        this.checkEndbossFirstEncounter();
      }
    }, 1000 / 60);
  }

  clearAllIntervals() {}
  checkEndbossProximity() {}
  checkGameOver() {}
  handlePlayerDeath() {}
  handleEndbossVictory() {}
  stopGame() {}
  stopAllGameSounds() {}
  resetKeyboardStates() {}
  playGameSong() {
    this.gameSong.loop = true;
    this.gameSong.volume = 0.5;
    this.gameSong.play();
  }

  pauseGame() {
  clearInterval(this.gameLoop);}
  checkThrowObjects() {}
  checkThrowObjectsSPAT() {}
  canEnterThrow() {return false;}
  handleGrenadeThrow() {}
  playLaughSound() {}
  createAndThrowGrenade() {}
  showCoinsWarning() {}
  changeCharacterImage(imagePath) {}
  removeDeadEnemies() {}
  checkCollisions() {}
  handleCoinCollisions() {}
  handleCoinGrenadeUnlocked() {}
  handleBottleCollisions() {}
  handleGrenadeCollisions() {}
  handleEggCollisions() {}
  handleThrowableCollisions() {}
  handleCollisionWithEnemy(enemy) {}
  checkEndbossFirstEncounter() {}

  /**
   * Handles fullscreen change events and adjusts UI elements accordingly.
   */
  handleFullscreenChange() {
    const isFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    const nonFullscreenElements = document.querySelectorAll(
      'h1, #startscreen, #restart-button, #muteButton, #controls, #touch-controls');
    nonFullscreenElements.forEach(el => {
      if (isFullscreen) {
        el.style.display = 'none';
      } else {
        if (!this.gameStarted) {
          if (el.id === 'startscreen') {
            el.style.display = 'flex';
          } else {
            el.style.display = 'block';
          }
        } else {
          if (el.id !== 'startscreen') {
            el.style.display = 'block';}}
      }});
    }

  handleEndbossCollision(enemy) {}
  handleStandardEnemyCollision(enemy) {}

  /**
   * Main drawing loop that clears the canvas, translates camera, draws background, entities, etc.
   */
  draw() {
    this.clearCanvas();
    this.ctx.translate(this.camera_x, 0);
    this.drawBackground();
    this.drawEntities();
    this.ctx.translate(-this.camera_x, 0);
    this.drawStatusBars();
    this.drawAdditionalUI();
    if (this.showWinScreen) {
      this.showWinScreenMenu();
      return;
    } else if (this.gameOver) {
      return;
    }
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Clears the entire canvas area.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
  }

  /**
   * Draws the character, enemies, projectiles, coins, bottles, etc. onto the canvas.
   */
  drawEntities() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies.filter(enemy => !enemy.removeFromWorld));
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.endbossProjectiles);
    this.addObjectsToMap(this.throwableObject_SP_AT);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
  }

  /**
   * Renders all status bars (health, coins, bottles, endboss) on the canvas.
   */
  drawStatusBars() {
    this.statusBar.render(this.ctx);
    this.coinsStatusBar.render(this.ctx);
    this.bottlesStatusBar.render(this.ctx);
    const endboss = this.level.enemies.find(e => e instanceof Endboss);
    if (endboss && !endboss.isDead && this.isCharacterNearEndboss(endboss)) {
      this.endbossStatusBar.setPercentage((endboss.energy / 15) * 100);
      this.endbossStatusBar.render(this.ctx);
    }
  }

  /**
   * Draws various UI messages (grenade ready, not enough coins, etc.) and explosion images.
   */
  drawAdditionalUI() {
    if (this.showGrenadeReadyMessage)
      this.drawCenteredText("Granade is ready!!", this.canvas.height / 2 - 100, "bold 30px 'Comic Sans MS', cursive", "red");
    if (this.showNotEnoughCoinsMessage)
      this.drawCenteredText("Not enough coins!", this.canvas.height / 2 - 50, "bold 30px 'Comic Sans MS', cursive", "red");
    if (this.showNoMoreBottlesMessage)
      this.drawCenteredText("Not enough bottles!", this.canvas.height / 2 - 80, "bold 30px 'Comic Sans MS', cursive", "red");
    if (this.showExplosionImageFlag) this.drawExplosionImage();
    if (this.showEnrageMessage)
      this.drawCenteredText("Endboss is angry!", this.canvas.height / 2 - 120, "bold 30px 'Comic Sans MS', cursive", "red");
    if (this.showEndbossDeathMessage)
      this.drawCenteredText("Ooooh Nooooo", this.canvas.height / 2 - 120, "30px Arial", "red");
    if (this.showFirstFightText)
      this.drawCenteredText("Do you want to challenge me, Pepe?", this.canvas.height / 2 - 80, "bold 20px 'Comic Sans MS', cursive", "red");
  }

  /**
   * Draws centered text on the canvas with specified font and color.
   */
  drawCenteredText(text, y, font, color) {
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, this.canvas.width / 2, y);
  }

  /**
   * Draws the explosion image in the center of the canvas at a certain scale.
   */
  drawExplosionImage() {
    const scale = 1 / 3;
    const w = this.explosionImage.naturalWidth * scale;
    const h = this.explosionImage.naturalHeight * scale;
    const x = (this.canvas.width - w) / 2;
    const y = (this.canvas.height - h) / 2;
    this.ctx.drawImage(this.explosionImage, x, y, w, h);
  }

  /**
   * Displays a red "Endboss is enraged!" text on the canvas.
   */
  showEnrageMessage() {
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.fillText("Endboss is enraged!", 100, 100);
  }

  /**
   * Shows the explosion image if it is loaded and not previously displayed.
   */
  showExplosionImage() {
    if (this.explosionImage.complete && this.explosionImage.naturalWidth !== 0) {
      this.showExplosionImageFlag = true;
      setTimeout(() => {
        this.showExplosionImageFlag = false;
      }, 2000);
    }
  }

  /**
   * Displays the end screen (lost overlay) after a short delay.
   * @param {string} imageSrc - The URL or path to the background image.
   */
  showEndScreen(imageSrc) {
    setTimeout(() => {
      const lostOverlay = this.createLostOverlay(imageSrc);
      const btnContainer = this.createLostButtonContainer();
      lostOverlay.appendChild(btnContainer);
      document.getElementById('game-container').appendChild(lostOverlay);
    }, 1000);
  }

  /**
   * Creates a lost overlay element with the given background image.
   * @param {string} imageSrc - The URL or path to the lost screen image.
   * @returns {HTMLDivElement} - The created overlay element.
   */
  createLostOverlay(imageSrc) {
    const overlay = document.createElement('div');
    overlay.id = 'lostOverlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'auto';
    overlay.style.background = `url('${imageSrc}') center center / cover no-repeat`;
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'flex-end';
    overlay.style.alignItems = 'center';
    overlay.style.paddingBottom = '30px';
    return overlay;
  }

  /**
   * Creates the container for lost screen buttons (restart, main menu).
   * @returns {HTMLDivElement} - The created button container element.
   */
  createLostButtonContainer() {
    const btnContainer = document.createElement('div');
    btnContainer.id = 'lostBtnContainer';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '20px';
    const restartBtn = document.createElement('button');
    restartBtn.innerText = 'Start Game';
    restartBtn.onclick = () => {
      removeAllOverlays();
      resetGame();};
    btnContainer.appendChild(restartBtn);
    const mainMenuBtn = document.createElement('button');
    mainMenuBtn.innerText = 'Back to main menu';
    mainMenuBtn.onclick = () => location.reload();
    btnContainer.appendChild(mainMenuBtn);
    return btnContainer;
  }

  showWinScreenMenu() {}
  clearAllIntervals() {}
  showWinScreenMenu() {}
  dimCanvas() {}
  createWinImage() {}
  createWinButtonContainer() {}
  removeWinUI() {}
  waitForGameStart() {
    const checkStartInterval = setInterval(() => {
      if (this.keyboard.RIGHT) {
        this.gameStarted = true;
        this.run();
        this.playGameSong();
        clearInterval(checkStartInterval);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          "Drücke RECHTS, um das Spiel zu starten!",
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      }
    }, 100);
  }

  restartGame() {
    location.reload();
  }

  /**
   * Adds a single object to the map. If otherDirection is set, flips the object horizontally.
   * @param {Object} mo - The movable or drawable object to add.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mo.x + mo.width, mo.y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(mo.img, 0, 0, mo.width, mo.height);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
    }
    if (mo instanceof MovableObject) {
      mo.drawFrame(this.ctx);
    }
  }
  isCharacterNearEndboss(endboss) {
    const distance = Math.abs(this.character.x - endboss.x);
    return distance < 600;
  }
}
window.World = World;