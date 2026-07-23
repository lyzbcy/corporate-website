document.addEventListener('DOMContentLoaded', function () {
  const root = document.getElementById('project-explorer');
  if (!root) return;

  const grid = document.getElementById('project-index-grid');
  const cards = Array.from(grid.querySelectorAll('.project-index-card'));
  const search = document.getElementById('project-search-input');
  const sort = document.getElementById('project-sort-select');
  const categoryList = document.getElementById('category-filter-list');
  const tagList = document.getElementById('tag-filter-list');
  const count = document.getElementById('project-result-count');
  const empty = document.getElementById('project-empty-state');
  const reset = document.getElementById('project-reset-button');
  const state = { category: 'all', tag: 'all', query: '' };

  const normalize = function (value) {
    return (value || '').toLocaleLowerCase('zh-CN').trim();
  };

  const categories = new Map();
  const tags = new Set();
  cards.forEach(function (card) {
    categories.set(card.dataset.category, card.dataset.categoryLabel);
    (card.dataset.tags || '').split('||').filter(Boolean).forEach(function (tag) { tags.add(tag); });
  });

  function makeFilterButton(value, label, type) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.value = value;
    button.dataset.filterType = type;
    button.textContent = label;
    button.setAttribute('aria-pressed', String(value === 'all'));
    if (value === 'all') button.classList.add('is-active');
    return button;
  }

  categoryList.appendChild(makeFilterButton('all', '全部', 'category'));
  Array.from(categories.entries()).forEach(function (entry) {
    categoryList.appendChild(makeFilterButton(entry[0], entry[1], 'category'));
  });
  tagList.appendChild(makeFilterButton('all', '全部标签', 'tag'));
  Array.from(tags).sort(function (a, b) { return a.localeCompare(b, 'zh-CN'); }).forEach(function (tag) {
    tagList.appendChild(makeFilterButton(tag, tag, 'tag'));
  });

  function updateButtons(container, value) {
    container.querySelectorAll('button').forEach(function (button) {
      const active = button.dataset.value === value;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function render() {
    let visible = 0;
    cards.forEach(function (card) {
      const matchesCategory = state.category === 'all' || card.dataset.category === state.category;
      const matchesTag = state.tag === 'all' || (card.dataset.tags || '').split('||').includes(state.tag);
      const matchesQuery = !state.query || normalize(card.dataset.search).includes(state.query);
      const show = matchesCategory && matchesTag && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = `找到 ${visible} / ${cards.length} 个项目`;
    empty.hidden = visible !== 0;
  }

  function sortCards(mode) {
    const sorted = cards.slice().sort(function (a, b) {
      if (mode === 'score-desc') return Number(b.dataset.score) - Number(a.dataset.score);
      if (mode === 'title-asc') return a.dataset.title.localeCompare(b.dataset.title, 'zh-CN');
      return b.dataset.date.localeCompare(a.dataset.date);
    });
    sorted.forEach(function (card) { grid.appendChild(card); });
  }

  root.addEventListener('click', function (event) {
    const button = event.target.closest('[data-filter-type]');
    if (!button) return;
    const type = button.dataset.filterType;
    state[type] = button.dataset.value;
    updateButtons(type === 'category' ? categoryList : tagList, state[type]);
    render();
  });

  search.addEventListener('input', function () { state.query = normalize(search.value); render(); });
  sort.addEventListener('change', function () { sortCards(sort.value); });
  reset.addEventListener('click', function () {
    state.category = 'all'; state.tag = 'all'; state.query = '';
    search.value = ''; sort.value = 'date-desc';
    updateButtons(categoryList, 'all'); updateButtons(tagList, 'all');
    sortCards('date-desc'); render(); search.focus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === '/' && document.activeElement !== search) { event.preventDefault(); search.focus(); }
  });

  render();
});
