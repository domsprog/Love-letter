(function () {
  const stage = document.getElementById('stage');
  const heartWrap = document.getElementById('heartWrap');
  const heartBtn = document.getElementById('heartBtn');
  const leavesLayer = document.getElementById('leavesLayer');
  const messagePanel = document.getElementById('messagePanel');
  const messageText = document.getElementById('messageText');

  // Edit this message freely
  const MESSAGE = "The moment you tapped, my heart bloomed just like this, scattering little pieces of it into the air. I'm so lucky to have you.";

  const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width:721px)').matches;

  let started = false;
  let leafInterval = null;
  const MAX_LEAVES = 40;

  function spawnLeaf() {
    if (prefersReduced) return;
    if (leavesLayer.childElementCount > MAX_LEAVES) return;

    const rect = heartBtn.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const centerX = rect.left - stageRect.left + rect.width / 2;
    const spread = 140;

    const leaf = document.createElement('div');
    const variant = Math.random();
    leaf.className = 'leaf' + (variant < 0.33 ? ' alt' : variant < 0.5 ? ' gold' : '');

    const size = 10 + Math.random() * 10;
    const startLeft = centerX + (Math.random() * spread - spread / 2);
    const fallDuration = 5 + Math.random() * 4;
    const swayDuration = 1.6 + Math.random() * 1.4;
    const delay = Math.random() * 0.4;

    leaf.style.left = startLeft + 'px';
    leaf.style.width = size + 'px';
    leaf.style.height = size + 'px';
    leaf.style.animationDuration = fallDuration + 's, ' + swayDuration + 's';
    leaf.style.animationDelay = delay + 's, 0s';

    leaf.innerHTML = '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '"><path d="' + HEART_PATH + '"/></svg>';

    leavesLayer.appendChild(leaf);

    leaf.addEventListener('animationend', (e) => {
      if (e.animationName === 'fall') leaf.remove();
    });
    setTimeout(() => { if (leaf.parentNode) leaf.remove(); }, (fallDuration + delay + 1) * 1000);
  }

  function typeMessage(text, el) {
    el.innerHTML = '';
    text.split('').forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (i * 0.026) + 's';
      el.appendChild(span);
    });
  }

  function begin() {
    if (started) {
      heartBtn.style.transform = 'scale(0.9)';
      setTimeout(() => { heartBtn.style.transform = ''; }, 180);
      return;
    }
    started = true;

    // 1) the heart blooms and leaves start falling
    heartWrap.classList.add('bloomed');
    if (!prefersReduced) {
      for (let i = 0; i < 6; i++) setTimeout(spawnLeaf, i * 220);
      leafInterval = setInterval(spawnLeaf, 650);
    }

    // 2) slide the heart to the right (desktop only) to make room for the message
    setTimeout(() => {
      if (isDesktop()) heartWrap.classList.add('slid');
    }, 700);

    // 3) let the message flow in on the left
    setTimeout(() => {
      messagePanel.classList.add('visible');
      typeMessage(MESSAGE, messageText);
    }, isDesktop() ? 1600 : 1000);
  }

  heartBtn.addEventListener('click', begin);
  heartBtn.addEventListener('keyup', (e) => { if (e.key === 'Enter' || e.key === ' ') begin(); });
})();