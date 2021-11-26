(function kaijuBattle() {
  'use strict';

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

  // Grab a reference to the two fighter's DOM elements for future use.
  const p1 = document.getElementById('p1');
  const p2 = document.getElementById('p2');

  // Setup for attribute changes. Primitive to trigger graphic state changes.
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        showFrame(mutation.target, mutation.target.dataset.frameVisible)
      }
    });
  });

  // Listen for DOM mutations on the two fighters.
  observer.observe(p1, {attributes: true});
  observer.observe(p2, {attributes: true});

  // Show the default graphic state on initial load.
  showFrame(p1, p1.dataset.frameVisible);
  showFrame(p2, p2.dataset.frameVisible);

})();
