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

  const params = new URLSearchParams(window.location.search);
  const p1 = document.getElementById('p1');
  const p2 = document.getElementById('p2');

  showFrame(p1, params.has('p1') ? params.get('p1') : p1.dataset.frameDefault);
  showFrame(p2, params.has('p2') ? params.get('p2') : p2.dataset.frameDefault);

})();
