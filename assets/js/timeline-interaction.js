document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('tree-container');
  if (!container) return;

  const buttons = Array.from(container.querySelectorAll('.filter-btn'));
  const items = Array.from(container.querySelectorAll('.tree-item'));
  const hint = container.querySelector('.tree-filter-hint');
  const labels = {
    school: '学校作品',
    personal: '个人作品',
    team: '团队作品',
    work: '打工项目'
  };

  function applyFilter(filter) {
    const nextFilter = container.dataset.activeFilter === filter ? '' : filter;
    container.dataset.activeFilter = nextFilter;

    buttons.forEach(function (button) {
      const active = button.dataset.filter === nextFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    items.forEach(function (item) {
      const collapsed = Boolean(nextFilter) && item.dataset.category !== nextFilter;
      item.classList.toggle('is-collapsed', collapsed);
      item.setAttribute('aria-hidden', String(collapsed));
      const link = item.querySelector('.tree-content');
      if (link) link.setAttribute('tabindex', collapsed ? '-1' : '0');
    });

    if (hint) {
      hint.textContent = nextFilter
        ? `正在聚焦「${labels[nextFilter]}」，其他轨迹已压缩为时间刻度`
        : '点击轨迹聚焦；再次点击可查看全部';
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.dataset.filter);
    });
  });
});
