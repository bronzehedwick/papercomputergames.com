(function kaijuBattle() {
  'use strict';

  // Grab a reference to the two fighter's DOM elements for future use.
  const p1 = document.getElementById('p1');
  const p2 = document.getElementById('p2');

  // Get sound effects audio references.
  const audioContext = new AudioContext();
  const backgroundMusic = document.getElementById('background-music');
  const punchSfx = document.getElementById('punch-sfx');
  const blockSfx = document.getElementById('block-sfx');
  const beepSfx = document.getElementById('beep-sfx');
  const backgroundMusicTrack = audioContext.createMediaElementSource(backgroundMusic);
  const punchSfxTrack = audioContext.createMediaElementSource(punchSfx);
  const blockSfxTrack = audioContext.createMediaElementSource(blockSfx);
  const beepSfxTrack = audioContext.createMediaElementSource(beepSfx);
  backgroundMusicTrack.connect(audioContext.destination);
  punchSfxTrack.connect(audioContext.destination);
  blockSfxTrack.connect(audioContext.destination);
  beepSfxTrack.connect(audioContext.destination);

  // Setup game conditions.
  const p1Health = document.getElementById('p1-health');
  const p2Health = document.getElementById('p2-health');
  let enemyAttackChance = 1;
  let enemyAttacking = false;
  let p1Vulnerable = false;
  let p2Vulnerable = false;

  /**
    * Show the version of the character requested.
    * @param {Element} player - Player element wrapping the frames.
    * @param {string} frameName - Frame graphic inside Player to show.
    * @return {void}
    */
  function showFrame(player, frameName) {
    // Hide all other frames first.
    const frames = player.children;
    for (let i = 0; i < frames.length; i++) {
      if (frames[i].hasAttribute('hidden')) continue;
      frames[i].setAttribute('hidden', 'hidden');
    }
    const frameToShow = document.getElementById(`${player.id}-${frameName}`);
    if (frameToShow) {
      frameToShow.removeAttribute('hidden');
    }
    else {
      document
        .getElementById(`${player.id}-${player.dataset.frameDefault}`)
        .removeAttribute('hidden');
    }
  }

  function gameOver() {
    p2.classList.add('defeated');
    showFrame(p2, 'hit');
    p1.classList.add('victorious');
    showFrame(p1, 'standard');
    document.getElementById('lose-message').removeAttribute('hidden');
  }

  function youWin() {
    p1.classList.add('defeated');
    showFrame(p1, 'hit');
    p2.classList.add('victorious');
    showFrame(p2, 'standard');
    document.getElementById('win-message').removeAttribute('hidden');
  }

  /**
   * Show the standard animation.
   * @param {Element} player - Player element wrapping the frames.
   * @return {void}
   */
  function doStandard(player) {
    if (player.id === 'p1') {
      p1Vulnerable = false;
    }
    if (player.id === 'p2') {
      p2Vulnerable = false;
    }
    showFrame(player, 'standard');
  }

  /**
   * Show the wind up animation.
   * @param {Element} player - Player element wrapping the frames.
   * @return {void}
   */
  function doWindUp(player) {
    if (player.id === 'p1') {
      p1Vulnerable = true;
    }
    if (player.id === 'p2') {
      p2Vulnerable = true;
    }
    showFrame(player, 'standard');
  }

  /**
   * Show the punch animation.
   * @param {Element} player - Player element wrapping the frames.
   * @return {void}
   */
  function doPunch(player) {
    showFrame(player, 'punch');
    if (player.id === 'p1') {
      if (p2Vulnerable) {
        punchSfx.play();
        doHit(p2);
        p2Health.value = p2Health.value - 1;
        if (p2Health.value <= 0) {
          gameOver();
        }
      }
      else {
        blockSfx.play();
      }
    }
    if (player.id === 'p2') {
      if (p1Vulnerable) {
        punchSfx.play();
        doHit(p1);
        p1Health.value = p1Health.value - 1;
        if (p1Health.value <= 0) {
          youWin();
        }
      }
      else {
        blockSfx.play();
      }
    }
  }

  /**
   * Show the hit animation.
   * @param {Element} player - Player element wrapping the frames.
   * @return {void}
   */
  function doHit(player) {
    showFrame(player, 'hit');
    setTimeout(() => {
      showFrame(player, 'standard');
    }, 300);
  }

  /**
   * Make the enemy attack the player.
   * @return {void}
   */
  function enemyAttack() {
    enemyAttacking = true;
    p1.classList.add('wind-up-started');
    doWindUp(p1);
    setTimeout(() => {
      p1.classList.add('wind-up-ready');
      doPunch(p1);
      setTimeout(() => {
        doStandard(p1);
        p1.classList.remove('wind-up-started', 'wind-up-ready');
        enemyAttacking = false;
      }, 300);
    }, 500);
  }

  // Show the default graphic state on initial load.
  showFrame(p1, p1.dataset.frameVisible);
  showFrame(p2, p2.dataset.frameVisible);

  let windUpTimeoutId;

  function setupGameEvents() {
    document.getElementById('stage').classList.remove('game-not-started');
    // Listener to wind up a punch.
    document.addEventListener('mousedown', (event) => {
      if (event.buttons !== 1) return;
      doWindUp(p2);
      p2.classList.add('wind-up-started');
      windUpTimeoutId = setTimeout(() => {
        p2.classList.add('wind-up-ready');
      }, 500);
    });

    // Listener to punch the enemy.
    document.addEventListener('mouseup', () => {
      clearTimeout(windUpTimeoutId);
      p2.classList.remove('wind-up-started');
      if (p2.classList.contains('wind-up-ready')) {
        doPunch(p2);
        setTimeout(() => doStandard(p2), 300);
      }
      else {
        doStandard(p2);
      }
      p2.classList.remove('wind-up-ready');
    });

    // Loop to randomly attack the player.
    function step() {
      if (!enemyAttacking && !p1.dataset.hit && Math.floor(Math.random() * 100) === enemyAttackChance) {
        enemyAttack();
      }
      window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  // Setup starting the game via button.
  document.getElementById('start').addEventListener('pointerup', (event) => {
    event.target.hidden = true;
    beepSfx.play()
      .then(() => backgroundMusic.play())
      .then(setupGameEvents);
  });

})();
