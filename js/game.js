let canvas;
let world;
let keyboard = new Keyboard();
let isMuted = false;
let gameEnded = false;
let gameStarted = false;
const allSounds = [];
let keyboardActive = false;
const walkSound = new Audio('audio/footsteps_character.mp3');
walkSound.loop = true;
const jumpSound = new Audio('audio/jump2_character.mp3');
const chickenSound = new Audio('audio/chicken_1.mp3');
const chickenDieSound = new Audio('audio/chicken_die_sound.mp3');
const collectingGemsSound = new Audio('audio/collecting-gems.mp3');
const enrageModeEndbossSound = new Audio('audio/enrage_mode_endboss.mp3');
const gameOverSound = new Audio('audio/game_over.mp3');
const grenadeReadySound = new Audio('audio/granade_ready.mp3');
const explosionSound = new Audio('audio/impact_explosion_03.mp3');
const killedWithBottlesSound = new Audio('audio/oh_nooo_Endboss.mp3');
const levelCompleteSound = new Audio('audio/mixkit-game-level-completed-2059 (1).wav');
const painSound = new Audio('audio/pain.mp3');
const laughSound = new Audio('audio/Pepe_peligroso_laugh.mp3');
const squashSound = new Audio('audio/tomato-squash.mp3');
const coinSound = new Audio('audio/coins-drop.mp3');
const gameSong = new Audio('audio/Pepe Peligroso vs Endboss Rooster.wav');

window.levelCompleteSound = levelCompleteSound;

allSounds.push(
  walkSound,
  jumpSound,
  chickenSound,
  chickenDieSound,
  collectingGemsSound,
  enrageModeEndbossSound,
  gameOverSound,
  grenadeReadySound,
  explosionSound,
  killedWithBottlesSound,
  painSound,
  laughSound,
  squashSound,
  coinSound,
  gameSong,
  levelCompleteSound
);

/**
 * Updates the mute button icon depending on the isMuted status.
 * @param {HTMLElement} muteButton - The button element from the DOM.
 */
function updateMuteButtonIcon(muteButton) {
  if (!muteButton) return;
  if (isMuted) {
    muteButton.innerHTML = `<img src="audio/turn_off_sound.png" 
                                  alt="Turn On Sound" 
                                  width="8"
                                  style="vertical-align: middle; display: flex; justify-content: center; align-items: center;">`;
  } else {
    muteButton.innerHTML = `<img src="audio/turn_on_sound.png" 
                                  alt="Turn Off Sound" 
                                  width="8"
                                  style="vertical-align: middle; display: flex; justify-content: center; align-items: center;">`;
  }
}

/**
 * Simulates a keydown event for the given key code.
 * @param {number} keyCode - The key code (e.g. 37 for left arrow).
 */
function simulateKeyDown(keyCode) {
  const event = new KeyboardEvent('keydown', { keyCode });
  window.dispatchEvent(event);
}

/**
 * Simulates a keyup event for the given key code.
 * @param {number} keyCode - The key code (e.g. 37 for left arrow).
 */
function simulateKeyUp(keyCode) {
  const event = new KeyboardEvent('keyup', { keyCode });
  window.dispatchEvent(event);
}

/**
 * Starts or restarts the game.
 * Hides the start screen, sets the gameStarted flag, and creates or resets the World instance.
 */
function startOrRestartGame() {
  hideStartScreen();
  gameStarted = true;
  if (!world) {
    createNewWorld();
  } else {
    resetGame();
  }
  adjustEndbossPositionIfExists();
  if (isMuted) muteAllSounds();
  keyboardActive = false;
  setTimeout(() => {
    keyboardActive = true;
  }, 1000);
}

/**
 * Hides the start screen element.
 */
function hideStartScreen() {
  const startScreen = document.getElementById('startscreen');
  if (startScreen) startScreen.style.display = 'none';
}

/**
 * Creates a new World instance.
 */
function createNewWorld() {
  canvas.style.display = 'block';
  let freshLevel = createLevel1();
  world = new World(canvas, keyboard, freshLevel);
  if (!isMuted) world.playGameSong();
}

/**
 * Adjusts the Endboss position if it exists.
 */
function adjustEndbossPositionIfExists() {
  adjustEndbossPosition();
}

/**
 * Adjusts the Y position of the Endboss (optional).
 */
function adjustEndbossPosition() {
  if (world && world.level && world.level.enemies) {
    const endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);
    if (endboss) {
      endboss.y -= 100;
    }
  }
}

/**
 * Resets the game: stops sounds, removes overlays, resets the keyboard, and recreates the World instance.
 */
function resetGame() {
  clearWorldTimeouts();
  removeAllOverlays();
  stopAllGameSounds();
  resetKeyboardStates();
  gameEnded = false;
  resetEndScreenFlag();
  recreateWorld();
  remuteIfNeeded();
}

/**
 * Clears all timeouts and intervals associated with the current World instance.
 */
function clearWorldTimeouts() {
  if (!world) return;
  if (world.winScreenTimeout) clearTimeout(world.winScreenTimeout);
  if (world.lostScreenTimeout) clearTimeout(world.lostScreenTimeout);
  if (world.clearAllIntervals) world.clearAllIntervals();
}

/**
 * Resets the end screen flag and removes the World instance.
 */
function resetEndScreenFlag() {
  if (world) world.isEndScreenActive = false;
  world = null;
}

/**
 * Recreates the World instance with a fresh level.
 */
function recreateWorld() {
  let freshLevel = createLevel1();
  world = new World(canvas, keyboard, freshLevel);
}

/**
 * Re-mutes all sounds if isMuted is set.
 */
function remuteIfNeeded() {
  if (isMuted) {
    muteAllSounds();
  }
}

/**
 * Displays the Game Over screen by creating and appending a lost overlay.
 * @param {string} message - The message to display (e.g. "You lost!").
 */
function showEndScreen(message) {
  const lostOverlay = createLostOverlay(message);
  document.body.appendChild(lostOverlay);
}

/**
 * Creates and returns an overlay element that represents the Game Over screen.
 * @param {string} message - The message to display.
 * @returns {HTMLElement} - The created overlay element.
 */
function createLostOverlay(message) {
  const overlay = document.createElement('div');
  overlay.id = 'lostOverlay';
  Object.assign(overlay.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '999',
    pointerEvents: 'auto'
  });
  
  const lostText = createLostText(message);
  const btnContainer = createLostButtonContainer();
  overlay.appendChild(lostText);
  overlay.appendChild(btnContainer);
  return overlay;
}

/**
 * Creates and returns an element containing the Game Over text.
 * @param {string} message - The message to display.
 * @returns {HTMLElement} - The text element.
 */
function createLostText(message) {
  const lostText = document.createElement('div');
  lostText.innerText = message;
  Object.assign(lostText.style, {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '50px',
    color: 'orange',
    textShadow: '2px 2px 4px #000'
  });
  return lostText;
}

/**
 * Creates and returns a container element with buttons for the Game Over screen.
 * @returns {HTMLElement} - The container element with the buttons.
 */
function createLostButtonContainer() {
  const btnContainer = document.createElement('div');
  btnContainer.id = 'lostBtnContainer';
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '20px';
  
  const restartBtn = document.createElement('button');
  restartBtn.innerText = 'Start Game';
  restartBtn.onclick = () => {
    removeAllOverlays();
    resetGame();
  };
  btnContainer.appendChild(restartBtn);
  
  const mainMenuBtn = document.createElement('button');
  mainMenuBtn.innerText = 'Back to main menu';
  mainMenuBtn.onclick = () => location.reload();
  btnContainer.appendChild(mainMenuBtn);
  
  return btnContainer;
}

/**
 * Removes all overlay elements from the document.
 */
function removeAllOverlays() {
  removeOverlay('lostOverlay');
  removeOverlay('winOverlay');
  removeOverlay('winBtnContainer');
  removeOverlay('lostBtnContainer');
  removeAllImagesInBody();
}

/**
 * Removes an element with the specified ID from the document.
 * @param {string} id - The ID of the element to remove.
 */
function removeOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/**
 * Removes all direct img elements from the body.
 */
function removeAllImagesInBody() {
  document.querySelectorAll('body > img').forEach(img => img.remove());
}

/**
 * Adds start screen instructions (controls) to the start screen.
 */
function addStartScreenText() {
  const startScreen = document.getElementById('startscreen');
  if (!startScreen) return;
  const instructions = document.createElement('div');
  instructions.classList.add('instructions');
  instructions.innerHTML = `
    <div>Arrows Left/Right = Walk</div>
    <div>Space Bar = Jump</div>
    <div>D = Throw Bottle</div>
    <div>Enter = Special Attack</div>
  `;
  startScreen.appendChild(instructions);
}

/**
 * Mutes all audio objects.
 */
function muteAllSounds() {
  allSounds.forEach(audio => {
    if (audio) {
      audio.muted = true;
    }
  });
}

/**
 * Unmutes all audio objects.
 */
function unmuteAllSounds() {
  allSounds.forEach(audio => {
    if (audio) {
      audio.muted = false;
    }
  });
}

function startOrRestartGame() {
  hideStartScreen();
  gameStarted = true;

  if (!world) {
    createNewWorld();
  } else {
    resetGame();
  }

  adjustEndbossPositionIfExists();
  if (isMuted) muteAllSounds();


  keyboardActive = false;
  setTimeout(() => {
    keyboardActive = true;
  }, 1000);
}

/**
 * Stops all game sounds and resets their playback position.
 */
function stopAllGameSounds() {
  walkSound.pause();
  walkSound.currentTime = 0;
  jumpSound.pause();
  jumpSound.currentTime = 0;

  allSounds.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}
