/* Product discovery and the original software-center opening animation. */
document.addEventListener('DOMContentLoaded', function () {
  const library = document.getElementById('software-library');
  if (library) {
    const controls = library.querySelector('.library-controls');
    const input = library.querySelector('input');
    const buttons = Array.from(library.querySelectorAll('button[data-category]'));
    const cards = Array.from(library.querySelectorAll('.studio-product'));
    let category = 'all';
    function filter() {
      const query = input.value.trim().toLocaleLowerCase();
      let count = 0;
      cards.forEach(function (card) {
        card.hidden = !(category === 'all' || card.dataset.category === category) || !card.dataset.search.toLocaleLowerCase().includes(query);
        if (!card.hidden) count++;
      });
      library.querySelector('.library-count').textContent = '显示 ' + count + ' / ' + cards.length + ' 个工具';
      library.querySelector('.library-empty').hidden = count !== 0;
    }
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        category = button.dataset.category;
        buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        filter();
      });
    });
    input.addEventListener('input', filter);
    controls.hidden = false;
  }
  const video = document.getElementById('studio-intro');
  const toggle = document.getElementById('studio-motion-toggle');
  if (!video || !toggle) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let allowed = !reduced.matches;
  let visible = true;
  const update = function () {
    const play = allowed && visible && !document.hidden;
    if (play) video.play().catch(function () { allowed = false; syncButton(); });
    else video.pause();
    syncButton();
  };
  function syncButton() {
    toggle.textContent = allowed ? '暂停背景动画 Ⅱ' : '播放背景动画 ▷';
    toggle.setAttribute('aria-pressed', String(allowed));
  }
  toggle.addEventListener('click', function () { allowed = !allowed; update(); });
  reduced.addEventListener('change', function () { allowed = !reduced.matches; update(); });
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting; update();
  }).observe(video.closest('header'));
  toggle.hidden = false;
  update();
});
