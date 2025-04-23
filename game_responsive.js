/**
 * Helper function that attaches both touchstart and touchend events to an element with the given ID
 * to simulate keydown and keyup events.
 * @param {string} elementId - The ID of the element.
 * @param {number} keyCode - The keycode to simulate.
 */
function addTouchKeyListener(elementId, keyCode) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.addEventListener('touchstart', (e) => {
    e.preventDefault();
    simulateKeyDown(keyCode);
  });
  element.addEventListener('touchend', (e) => {
    e.preventDefault();
    simulateKeyUp(keyCode);
  });
}

/**
 * Executed when the DOM is fully loaded.
 * Initializes touch controls, reads the mute status from localStorage,
 * sets up the mute button and the start button, and adds the start screen text.
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1) Retrieve the canvas
  canvas = document.getElementById('canvas');

  // 2) Initialize touch controls
  const touchControls = document.getElementById('touch-controls');
  if (touchControls) {
    const btnLeft = document.getElementById('btn-left');
    if (btnLeft) {
      btnLeft.addEventListener('touchstart', () => keyboard.LEFT = true);
      btnLeft.addEventListener('touchend', () => keyboard.LEFT = false);
      btnLeft.addEventListener('mousedown', () => keyboard.LEFT = true);
      btnLeft.addEventListener('mouseup', () => keyboard.LEFT = false);
      btnLeft.addEventListener('mouseleave', () => keyboard.LEFT = false);
    }

    const btnRight = document.getElementById('btn-right');
    if (btnRight) {
      btnRight.addEventListener('touchstart', () => keyboard.RIGHT = true);
      btnRight.addEventListener('touchend', () => keyboard.RIGHT = false);
      btnRight.addEventListener('mousedown', () => keyboard.RIGHT = true);
      btnRight.addEventListener('mouseup', () => keyboard.RIGHT = false);
      btnRight.addEventListener('mouseleave', () => keyboard.RIGHT = false);
    }

    const btnJump = document.getElementById('btn-jump');
    if (btnJump) {
      btnJump.addEventListener('touchstart', () => {
        keyboard.SPACE = true;
        setTimeout(() => keyboard.SPACE = false, 100);
      });
      btnJump.addEventListener('click', () => {
        keyboard.SPACE = true;
        setTimeout(() => keyboard.SPACE = false, 100);
      });
    }

    const btnThrow = document.getElementById('btn-throw');
    if (btnThrow) {
      btnThrow.addEventListener('touchstart', () => keyboard.D = true);
      btnThrow.addEventListener('touchend', () => keyboard.D = false);
      btnThrow.addEventListener('mousedown', () => keyboard.D = true);
      btnThrow.addEventListener('mouseup', () => keyboard.D = false);
    }

    const btnEnter = document.getElementById('btn-enter');
    if (btnEnter) {
      btnEnter.addEventListener('touchstart', () => keyboard.ENTER = true);
      btnEnter.addEventListener('touchend', () => keyboard.ENTER = false);
      btnEnter.addEventListener('mousedown', () => keyboard.ENTER = true);
      btnEnter.addEventListener('mouseup', () => keyboard.ENTER = false);
    }
  }

  // 3) Mute settings: Read and apply the stored state from localStorage
  const storedIsMuted = localStorage.getItem('isMuted');
  if (storedIsMuted === null) {
    // If no value is stored yet, you can set the default here (e.g. false = sound on)
    isMuted = false;
    localStorage.setItem('isMuted', 'false');
  } else {
    isMuted = (storedIsMuted === 'true');
  }
  
  if (isMuted) {
    muteAllSounds();
  } else {
    unmuteAllSounds();
  }

  // 4) Mute button: Update icon and set up click handler
  const muteButton = document.getElementById('muteButton');
  if (muteButton) {
    updateMuteButtonIcon(muteButton);
    muteButton.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('isMuted', isMuted);
      if (isMuted) {
        muteAllSounds();
      } else {
        unmuteAllSounds();
      }
      updateMuteButtonIcon(muteButton);
    });
  }

  // 5) Start button: Starts the game on click
  const startButton = document.getElementById('startButton');
  if (startButton) {
    startButton.addEventListener('click', () => {
      startOrRestartGame();
    });
  }

  // 6) Additional touch controls (via helper)
  if (touchControls) {
    addTouchKeyListener('btn-left', 37);
    addTouchKeyListener('btn-right', 39);
    addTouchKeyListener('btn-up', 38);
    addTouchKeyListener('btn-down', 40);
    addTouchKeyListener('btn-enter', 13);
  }

  // 7) Add the start screen text
  addStartScreenText();
});

/**
 * Keydown event listener: Sets keys in the keyboard object and plays the walkSound if needed.
 */

window.addEventListener('keydown', (e) => {
  // Erst prüfen, ob wir Tastatur zulassen:
  if (!keyboardActive || !gameStarted || gameEnded) return;

  if (e.keyCode === 39) { // RIGHT
    keyboard.RIGHT = true;
    if (walkSound.paused && !isMuted) {
      walkSound.play().catch(() => {});
    }
  }
  if (e.keyCode === 37) { // LEFT
    keyboard.LEFT = true;
    if (walkSound.paused && !isMuted) {
      walkSound.play().catch(() => {});
    }
  }
  if (e.keyCode === 68) { 
    keyboard.D = true;
  }
  if (e.keyCode === 32) { 
    keyboard.SPACE = true;
    if (!jumpSound.played.length && !isMuted) {
      jumpSound.play().catch(() => {});
    }
  }
  if (e.keyCode === 13) { 
    keyboard.ENTER = true;
  }
});

window.addEventListener('keyup', (e) => {
  // Wieder nur reagieren, wenn Tastatur aktiv und Spiel läuft:
  if (!keyboardActive || !gameStarted || gameEnded) return;

  if (e.keyCode === 39) { 
    keyboard.RIGHT = false;
    if (!keyboard.LEFT && !walkSound.paused) {
      walkSound.pause();
    
    }
  }
  if (e.keyCode === 37) { 
    keyboard.LEFT = false;
    if (!keyboard.RIGHT && !walkSound.paused) {
      walkSound.pause();
  
    }
  }
  if (e.keyCode === 68) { 
    keyboard.D = false;
  }
  if (e.keyCode === 32) { 
    keyboard.SPACE = false;
    jumpSound.pause();
  }
  if (e.keyCode === 13) { 
    keyboard.ENTER = false;
  }
});



/**+  if (gameEnded || !gameStarted) return;
 * Window resize event listener: Adjusts the canvas dimensions if fullscreen is active.
 */
window.addEventListener('resize', () => {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
 
  if (
    document.fullscreenElement === canvas ||
    document.webkitFullscreenElement === canvas ||
    document.mozFullScreenElement === canvas ||
    document.msFullscreenElement === canvas
  ) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

/**
 * Monitors changes in fullscreen state and adjusts UI elements.
 */
function handleFullscreenChange() {
  const isFullscreen =
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement;
  const mobile = window.innerWidth <= 800;
  const muteButton = document.getElementById('muteButton');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const touchControls = document.getElementById('touch-controls');
  const canvas = document.getElementById('canvas');

  if (isFullscreen) {
    if (mobile) {
      if (muteButton) muteButton.style.display = 'block';
      if (fullscreenButton) fullscreenButton.style.display = 'block';
      if (touchControls) touchControls.style.display = 'flex';
    } else {
      if (muteButton) muteButton.style.display = 'block';
      if (fullscreenButton) fullscreenButton.style.display = 'block';
      if (touchControls) touchControls.style.display = 'none';
    }
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  } else {
    if (muteButton) muteButton.style.display = 'none';
    if (fullscreenButton) fullscreenButton.style.display = 'none';
    if (touchControls) touchControls.style.display = 'none';
    if (canvas) {
      canvas.width = 720;
      canvas.height = 480;
    }
  }
  updateFullscreenButton();
}

/**
 * Updates the text of the fullscreen toggle button.
 */
function updateFullscreenButton() {
  const fullscreenButton = document.getElementById('fullscreenButton');
  if (!fullscreenButton) return;

  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    fullscreenButton.innerText = 'Exit Fullscreen';
  } else {
    fullscreenButton.innerText = 'Fullscreen';
  }
}

/**
 * Debug function to check which sounds are not muted.
 */
window.debugSounds = function() {
  const notMuted = allSounds.filter(audio => audio && !audio.muted);
  if (notMuted.length > 0) {
    // For example, logs can be output here or further actions can be taken.
  }
};

/**
 * Resets the state of the keyboard by setting all keys to false.
 */
function resetKeyboardStates() {
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.S = false;
  keyboard.D = false;
  keyboard.ENTER = false;
}

/**
 * Toggles the fullscreen mode for the canvas element.
 */
function toggleFullscreen() {
  const canvas = document.getElementById('canvas');
  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.mozFullScreenElement &&
    !document.msFullscreenElement
  ) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
