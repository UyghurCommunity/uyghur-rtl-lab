// The directional loom is a decorative companion to the real RTL controls.
const loom = document.getElementById('direction-loom');
const toggle = document.getElementById('loom-motion-toggle');
if (loom && toggle) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let inView = true;
  const activeReveals = new Set();
  const seen = new WeakSet();
  const pageEnabled = () => !userPaused && !preference.matches && !document.hidden;
  function sync() {
    const enabled = pageEnabled();
    document.body.dataset.pageMotion = enabled ? 'playing' : 'paused';
    loom.dataset.motion = enabled && inView ? 'playing' : 'paused';
    toggle.disabled = preference.matches;
    toggle.setAttribute('aria-pressed', String(userPaused || preference.matches));
    toggle.setAttribute('aria-label', preference.matches ? 'سىستېمىدا ھەرىكەتنى ئازايتىش ئېچىلغان' : userPaused ? 'تېكىست ھەرىكىتىنى قوزغىتىش' : 'تېكىست ھەرىكىتىنى توختىتىش');
    toggle.querySelector('span').textContent = userPaused || preference.matches ? '▷' : 'Ⅱ';
    if (!enabled) {
      activeReveals.forEach((element) => element.classList.remove('motion-enter'));
      activeReveals.clear();
    }
  }
  toggle.addEventListener('click', () => { if (!preference.matches) { userPaused = !userPaused; sync(); } });
  preference.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  function reflectDirection(direction) {
    if (!['rtl', 'ltr'].includes(direction)) return;
    loom.dataset.loomDirection = direction;
    document.getElementById('loom-current-direction').textContent = direction === 'rtl' ? 'RTL ←' : 'LTR →';
    const switcher = document.getElementById('loom-direction-toggle');
    switcher.setAttribute('aria-pressed', String(direction === 'ltr'));
    switcher.setAttribute('aria-label', direction === 'rtl' ? 'مىسال يۆنىلىشىنى LTR قىلىش' : 'مىسال يۆنىلىشىنى RTL قىلىش');
  }
  document.querySelectorAll('[data-direction]').forEach((button) => {
    if (button.tagName !== 'BUTTON') return;
    button.addEventListener('click', () => reflectDirection(button.dataset.direction));
  });
  document.getElementById('loom-direction-toggle').addEventListener('click', () => {
    const next = loom.dataset.loomDirection === 'rtl' ? 'ltr' : 'rtl';
    reflectDirection(next);
    document.querySelector(`button[data-direction="${next}"]`)?.click();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.05 }).observe(loom);
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        target.dataset.viewport = isIntersecting ? 'inside' : 'outside';
        if (!isIntersecting || seen.has(target)) return;
        seen.add(target);
        if (!pageEnabled()) return;
        target.classList.add('motion-enter');
        activeReveals.add(target);
        target.addEventListener('animationend', () => { target.classList.remove('motion-enter'); activeReveals.delete(target); }, { once: true });
      });
    }, { threshold: 0.1 });
    const watch = (root) => {
      if (root.matches?.('.example-copy')) reveal.observe(root);
      root.querySelectorAll?.('.example-copy').forEach((element) => reveal.observe(element));
    };
    document.querySelectorAll('.section-heading, .guidelines > div').forEach((element) => reveal.observe(element));
    watch(document.getElementById('fixture-grid'));
    // Filtering creates fresh example headings. Preview inputs remain static.
    new MutationObserver((changes) => changes.forEach(({ addedNodes, removedNodes }) => {
      addedNodes.forEach((node) => { if (node.nodeType === 1) watch(node); });
      removedNodes.forEach((node) => node.querySelectorAll?.('.example-copy').forEach((element) => { reveal.unobserve(element); activeReveals.delete(element); }));
    })).observe(document.getElementById('fixture-grid'), { childList: true });
  } else {
    const checkView = () => { const bounds = loom.getBoundingClientRect(); inView = bounds.bottom > 0 && bounds.top < innerHeight; sync(); };
    window.addEventListener('scroll', checkView, { passive: true });
    window.addEventListener('resize', checkView, { passive: true });
    checkView();
  }
  reflectDirection(document.querySelector('button[data-direction][aria-pressed="true"]')?.dataset.direction || 'rtl');
  sync();
}
