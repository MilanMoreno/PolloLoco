/**
 * Clears all intervals associated with game objects (projectiles, enemies, etc.).
 */
World.prototype.clearAllIntervals = function() {
  this.clearEndbossProjectiles();
  this.clearEnemyIntervals();
  this.clearThrowableIntervals();
  this.clearSPATIntervals();
  this.clearCharacterIntervals();
  this.clearCloudIntervals();
};

/**
 * Clears intervals for endboss projectiles.
 */
World.prototype.clearEndbossProjectiles = function() {
  if (!this.endbossProjectiles) return;
  this.endbossProjectiles.forEach(p => {
    if (typeof p.clearIntervals === 'function') p.clearIntervals();
  });
};

/**
 * Clears intervals for all enemies.
 */
World.prototype.clearEnemyIntervals = function() {
  if (!this.level || !this.level.enemies) return;
  this.level.enemies.forEach(enemy => {
    if (typeof enemy.clearIntervals === 'function') enemy.clearIntervals();
  });
};

/**
 * Clears intervals for throwable objects (regular bottles).
 */
World.prototype.clearThrowableIntervals = function() {
  if (!this.throwableObjects) return;
  this.throwableObjects.forEach(obj => {
    if (typeof obj.clearIntervals === 'function') obj.clearIntervals();
  });
};

/**
 * Clears intervals for special-attack throwable objects (grenades).
 */
World.prototype.clearSPATIntervals = function() {
  if (!this.throwableObject_SP_AT) return;
  this.throwableObject_SP_AT.forEach(obj => {
    if (typeof obj.clearIntervals === 'function') obj.clearIntervals();
  });
};

/**
 * Clears intervals for the character itself.
 */
World.prototype.clearCharacterIntervals = function() {
  if (this.character && typeof this.character.clearIntervals === 'function') {
    this.character.clearIntervals();}
};

/**
 * Clears intervals for clouds in the level.
 */
World.prototype.clearCloudIntervals = function() {
  if (!this.level || !this.level.clouds) return;
  this.level.clouds.forEach(cloud => {
    if (typeof cloud.clearIntervals === 'function') cloud.clearIntervals();
  });
};

/**
 * Checks various collisions in the game: coin, bottle, grenades, eggs, projectiles, etc.
 */
World.prototype.checkCollisions = function() {
  this.handleCoinCollisions();
  this.handleBottleCollisions();
  this.handleGrenadeCollisions();
  this.handleEggCollisions();
  this.handleThrowableCollisions();
  this.level.enemies.forEach(enemy => this.handleCollisionWithEnemy(enemy));
};

/**
 * Determines collision handling based on enemy type (Endboss or standard enemy).
 * @param {Object} enemy - The enemy instance (Endboss, Chicken, etc.).
 */
World.prototype.handleCollisionWithEnemy = function(enemy) {
  if (enemy instanceof Endboss) {
    this.handleEndbossCollision(enemy);
  } else {
    this.handleStandardEnemyCollision(enemy); }
};

/**
 * Handles collision logic when the enemy is the Endboss.
 * @param {Object} enemy - The Endboss object.
 */
World.prototype.handleEndbossCollision = function(enemy) {
  if (enemy.isJumping) {
    const endbossBottom = enemy.y + enemy.height;
    const charTop = this.character.y;
    const verticalOverlap = endbossBottom >= charTop && endbossBottom <= charTop + 10;
    const horizontalDistance = Math.abs(
      (enemy.x + enemy.width / 2) - (this.character.x + this.character.width / 2));
    if (verticalOverlap && horizontalDistance < 50) {
      this.character.energy = 0;
      this.statusBar.setPercentage(0);
      this.checkGameOver(); }
  } else if (
    this.character.isColliding(enemy) &&
    !this.character.isHurt() &&
    !this.character.isDead()) {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy); setTimeout(() => {
      if (!this.character.isDead()) {
        this.character.img = this.character.imageCache['img_pollo_locco/img/2_character_pepe/2_walk/W-21.png'];
        this.character.currentImage = 0;
      }}, 2000); }
};

/**
 * Handles collision logic for standard enemies (e.g., Chickens).
 * @param {Object} enemy - The enemy object.
 */
World.prototype.handleStandardEnemyCollision = function(enemy) {
  if (this.character.isColliding(enemy) && !enemy.isDead) {
    const charBottom = this.character.y + this.character.height - this.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    if (this.character.speedY < 0 && charBottom < enemyTop + 30) {
      enemy.die();
      this.character.speedY = 15;
    } else {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
      setTimeout(() => {
        if (!this.character.isDead()) {
          this.character.img = this.character.imageCache['img_pollo_locco/img/2_character_pepe/2_walk/W-21.png'];
          this.character.currentImage = 0;}
      }, 1000); }}
};

/**
 * Handles collision detection for collectible coins.
 */
World.prototype.handleCoinCollisions = function() {
  const maxCoinsForFullBar = 21;
  const minCoinsForGrenade = 21;
  this.level.coins.forEach((coin, index) => {
    if (this.character.isColliding(coin)) {
      this.level.coins.splice(index, 1);
      const coinSound = allSounds.find(audio => audio.src.includes('collecting-gems.mp3'));
      if (coinSound && !isMuted) coinSound.play();
      const collectedCoins = maxCoinsForFullBar - this.level.coins.length;
      const coinPercentage = (collectedCoins / maxCoinsForFullBar) * 100;
      this.coinsStatusBar.setPercentage(Math.min(coinPercentage, 100));
      if (collectedCoins >= minCoinsForGrenade) {
        this.handleCoinGrenadeUnlocked();
      } else {
        this.canThrowGrenade = false;
        this.grenadeReadySoundPlayed = false;
      }}
  });
};

/**
 * Unlocks the grenade (special attack) once enough coins are collected.
 */
World.prototype.handleCoinGrenadeUnlocked = function() {
  if (!this.canThrowGrenade) {
    this.canThrowGrenade = true;
    if (!this.grenadeReadySoundPlayed) {
      const grenadeReadySound = allSounds.find(audio => audio.src.includes('granade_ready.mp3'));
      if (grenadeReadySound && !isMuted) grenadeReadySound.play();
      this.grenadeReadySoundPlayed = true;}
    this.showGrenadeReadyMessage = true;
    clearTimeout(this.grenadeMessageTimer);
    this.grenadeMessageTimer = setTimeout(() => {
      this.showGrenadeReadyMessage = false;
    }, 2000);}
};

/**
 * Handles collision with bottles, allowing the character to pick them up.
 */
World.prototype.handleBottleCollisions = function() {
  const maxBottlesForFullBar = 18;
  this.level.bottles.forEach((bottle, index) => {
    if (this.character.isColliding(bottle)) {
      if (this.character.collectedBottles < maxBottlesForFullBar) {
        this.character.collectedBottles++;
        this.level.bottles.splice(index, 1);
        const bottlePercentage = (this.character.collectedBottles / maxBottlesForFullBar) * 100;
        this.bottlesStatusBar.setPercentage(Math.min(bottlePercentage, 100));
      }}
  });
};

/**
 * Handles collision checks for grenades (special attack) with enemies.
 */
World.prototype.handleGrenadeCollisions = function() {
  this.throwableObject_SP_AT.forEach((grenade, grenadeIndex) => {
    this.level.enemies.forEach(enemy => {
      if (grenade.isColliding(enemy)) {
        const explosionSound = allSounds.find(a => a.src.includes('impact_explosion_03.mp3'));
        if (explosionSound && !isMuted) {
          explosionSound.play().catch(error => {}); }
        if (enemy instanceof Endboss) {
          enemy.energy = 0;
          enemy.isDead = true;
          if (window.levelCompleteSound && !isMuted) {
            window.levelCompleteSound.volume = 0.5;
            window.levelCompleteSound.play().catch(error => {});}
          enemy.dieWithDelay(this);
          this.endbossStatusBar.setPercentage(0);
        } else {
          enemy.die();}
        this.throwableObject_SP_AT.splice(grenadeIndex, 1);
      }});
  });
};

/**
 * Handles collision checks for Endboss projectiles (eggs) with the character.
 */
World.prototype.handleEggCollisions = function() {
  this.endbossProjectiles.forEach((egg, index) => {
    if (this.character.isColliding(egg)) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
      this.endbossProjectiles.splice(index, 1); }
    if (egg.x < -200 || egg.x > 3200) {
      this.endbossProjectiles.splice(index, 1);}
  });
};

/**
 * Handles collision checks for normal throwable bottles with enemies.
 */
World.prototype.handleThrowableCollisions = function() {
  this.throwableObjects.forEach((bottle, bottleIndex) => {
    this.level.enemies.forEach(enemy => {
      if (bottle.isColliding(enemy)) {
        if (enemy instanceof Endboss) {
          enemy.hit();} else {
          enemy.die();}
        this.throwableObjects.splice(bottleIndex, 1);
      }});
  });
};

/**
 * Checks if the player pressed D and throws a bottle if available.
 */
World.prototype.checkThrowObjects = function() {
  if (this.keyboard.D && Date.now() - this.lastThrowTime > 500) {
    if (this.character.collectedBottles > 0) {
      const bottle = new ThrowableObject(
      this.character.x + (this.character.otherDirection ? -50 : 50),
      this.character.y + 100,
      this.character.otherDirection );
      this.throwableObjects.push(bottle);
      this.character.collectedBottles--;
      this.bottlesStatusBar.setPercentage( (
      this.character.collectedBottles / 18) * 100);
      this.lastThrowTime = Date.now();
    } else {this.showNoMoreBottlesMessage = true;
      clearTimeout(this.noMoreBottlesTimer);
      this.noMoreBottlesTimer = setTimeout(() => {
        this.showNoMoreBottlesMessage = false;
      }, 2000);}}
};

/**
 * Checks if the player pressed ENTER for the special attack (grenade).
 */
World.prototype.checkThrowObjectsSPAT = function() {
  if (!this.canEnterThrow()) return;
  if (this.canThrowGrenade) {
    this.handleGrenadeThrow();
  } else {
    this.showCoinsWarning();
  }
};

/**
 * Determines if the user can throw the grenade based on cooldown and ENTER press.
 * @returns {boolean} True if can throw, false otherwise.
 */
World.prototype.canEnterThrow = function() {
  return this.keyboard.ENTER && Date.now() - this.lastThrowTime > 500;
};

/**
 * Initiates the grenade throw sequence by changing the character image, playing laughter, etc.
 */
World.prototype.handleGrenadeThrow = function() {
  this.playLaughSound();
  this.changeCharacterImage('img_pollo_locco/img/2_character_pepe/5_dead/pepe_glasses2.png');
  setTimeout(() => {
  this.createAndThrowGrenade();
  }, 1500);
};

/**
 * Plays a laughter sound effect for the character if not muted.
 */
World.prototype.playLaughSound = function() {
  const laughSound = allSounds.find(audio => audio.src.includes('Pepe_peligroso_laugh.mp3'));
  if (laughSound && !isMuted) laughSound.play();
};

/**
 * Temporarily changes the character's image (e.g., to sunglasses) and reverts it.
 * @param {string} imagePath - The path to the new image for the character.
 */
World.prototype.changeCharacterImage = function(imagePath) {
  this.character.img = new Image();
  this.character.img.src = imagePath;
  setTimeout(() => {
    this.character.img.src = this.character.IMAGES_WALKING[0];
  }, 1000);
};

/**
 * Actually creates the grenade object and updates the status bars accordingly.
 */
World.prototype.createAndThrowGrenade = function() {
  const throwOffsetX = 100;
  const grenade = new ThrowableObject_SP_AT(
    this.character.x + (this.character.otherDirection ? -throwOffsetX : throwOffsetX),
    this.character.y + 100,
    this.character.otherDirection);
  grenade.world = this;
  this.throwableObject_SP_AT = [grenade];
  this.lastThrowTime = Date.now();
  this.coinsStatusBar.setPercentage(0);
  this.canThrowGrenade = false;
  this.showGrenadeReadyMessage = false;
  this.showExplosionImage();
};

/**
 * Shows a UI warning if there are not enough coins to unlock the grenade yet.
 */
World.prototype.showCoinsWarning = function() {
  this.showNotEnoughCoinsMessage = true;
  clearTimeout(this.notEnoughCoinsTimer);
  this.notEnoughCoinsTimer = setTimeout(() => {
    this.showNotEnoughCoinsMessage = false;
  }, 2000);
};

/**
 * Removes enemies or projectiles marked with removeFromWorld=true.
 */
World.prototype.removeDeadEnemies = function() {
  this.endbossProjectiles = this.endbossProjectiles.filter(egg => !egg.removeFromWorld);
  this.throwableObject_SP_AT = this.throwableObject_SP_AT.filter(obj => !obj.removeFromWorld);
  this.throwableObjects = this.throwableObjects.filter(obj => !obj.removeFromWorld);
  this.level.enemies = this.level.enemies.filter(e => !e.removeFromWorld);
};

/**
 * Checks if the character is near the Endboss for the first time to trigger the encounter sequence.
 */
World.prototype.checkEndbossFirstEncounter = function() {
  const boss = this.level.enemies.find(e => e instanceof Endboss && !e.isDead);
  if (!boss) return;
  const distance = Math.abs(this.character.x - boss.x);
  if (distance < 400 && !this.endbossEncountered) {
    this.endbossEncountered = true;
    this.showFirstFightText = true;
    if (!isMuted) {
      this.fightingAudio.currentTime = 0;
      this.fightingAudio.play();}
    setTimeout(() => {
      this.showFirstFightText = false;
      boss.isAlert = false;
    }, 2000);}
};

World.prototype.checkGameOver = function() {
  if (this.gameOver || this.menuDisplayed) return;
  if (this.character.isDead()) {
    this.handlePlayerDeath();
  } else if (this.level.enemies.some(e => e instanceof Endboss && e.removeFromWorld)) {
    this.handleEndbossVictory();
  }
};

World.prototype.handlePlayerDeath = function() {
  this.character.img = this.character.imageCache['img_pollo_locco/img/2_character_pepe/5_dead/D-54.png'];
  this.gameSong.pause();
  this.gameSong.currentTime = 0;
  this.gameOver = true;
  this.menuDisplayed = true;
  gameEnded = true;
  stopAllGameSounds();
  this.clearAllIntervals();
  this.pauseGame();
  if (!isMuted) {
    const gameOverAudio = new Audio('audio/game_over.mp3');
    gameOverAudio.volume = 0.5;
    gameOverAudio.play();}
  this.showEndScreen('img_pollo_locco/img/9_intro_outro_screens/game_over/you lost.png');
};

World.prototype.handleEndbossVictory = function() {
  this.gameSong.pause();
  this.gameSong.currentTime = 0;
  this.gameOver = true;
  this.menuDisplayed = true;
  gameEnded = true;
  stopAllGameSounds();
  this.clearAllIntervals();
  this.pauseGame();
  this.showWinScreenMenu();
};

World.prototype.stopGame = function() {
  this.stopAllGameSounds();
  this.clearAllIntervals();
  gameEnded = true;
  this.resetKeyboardStates();
};

World.prototype.stopAllGameSounds = function() {
  allSounds.forEach(audio => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }});
};

World.prototype.resetKeyboardStates = function() {
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.S = false;
  keyboard.D = false; 
  keyboard.ENTER = false;
};

World.prototype.showWinScreenMenu = function() {
  this.dimCanvas();
  const img = this.createWinImage();
  document.body.appendChild(img);
  const btnContainer = this.createWinButtonContainer();
  document.body.appendChild(btnContainer);
};

World.prototype.dimCanvas = function() {
  this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

World.prototype.createWinImage = function() {
  const img = new Image();
  img.src = "img_pollo_locco/img/9_intro_outro_screens/win/won_2.png";
  img.style.position = "absolute";
  img.style.maxWidth = "90%";
  img.style.maxHeight = "90%";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";
  img.style.zIndex = "999";
  img.style.pointerEvents = "none";
  return img;
};

World.prototype.createWinButtonContainer = function() {
  const btnContainer = document.createElement("div");
  btnContainer.id = 'winBtnContainer';
  btnContainer.style.position = "absolute";
  btnContainer.style.top = "75%";
  btnContainer.style.left = "50%";
  btnContainer.style.transform = "translate(-50%, -50%)";
  btnContainer.style.zIndex = "1000";
  const restartButton = document.createElement("button");
  restartButton.innerText = "Start Game";
  restartButton.style.fontSize = "18px";
  restartButton.style.marginRight = "20px";
  restartButton.addEventListener("click", () => {
  resetGame(); this.removeWinUI();});
  btnContainer.appendChild(restartButton);
  const mainMenuButton = document.createElement("button");
  mainMenuButton.innerText = "Back to main menu";
  mainMenuButton.style.fontSize = "18px";
  mainMenuButton.addEventListener("click", () => {
  location.reload();});
  btnContainer.appendChild(mainMenuButton);
  return btnContainer;
};

World.prototype.removeWinUI = function() {
  const existingWinBtnContainer = document.getElementById('winBtnContainer');
  const existingImg = document.querySelector('img[src="img_pollo_locco/img/9_intro_outro_screens/win/won_2.png"]');
  if (existingWinBtnContainer) existingWinBtnContainer.remove();
  if (existingImg) existingImg.remove();
};