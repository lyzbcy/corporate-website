---
layout: page
title: 藏品库
permalink: /collection/
---

<section class="vault" id="vault">
  <a class="vault-back" href="{{ site.baseurl }}/#portfolio"><i class="fas fa-arrow-left" aria-hidden="true"></i> 返回精选作品</a>
  <header class="vault-hero">
    <span class="vault-kicker">THE COLLECTOR'S VAULT</span>
    <h1>藏品库</h1>
    <p>把项目里值得珍藏的「手艺」与「方法」陈列在此——每一件都从真实项目里来，擦干净灰，挂上铭牌。</p>
  </header>

  <div class="vault-wall" id="vaultWall">
    <div class="vault-spot" aria-hidden="true"></div>
    {% assign shelf_numbers = site.data.collection.items | map: "shelf" | uniq | sort %}
    {% for sn in shelf_numbers %}
    {% assign shelf_items = site.data.collection.items | where: "shelf", sn %}
    <div class="vault-shelf">
      <div class="vault-items">
        {% for item in shelf_items %}
        <button id="{{ item.id }}" class="vault-item{% if item.placeholder %} is-placeholder{% endif %}" data-id="{{ item.id }}"{% if item.placeholder %} aria-label="未拆封的藏品"{% else %} aria-haspopup="dialog"{% endif %}>
          <span class="vault-halo" aria-hidden="true"></span>
          <span class="vault-figure">{% case item.figure %}
            {% when "grimoire" %}{% include vault/grimoire.svg %}
            {% when "crm-grimoire" %}{% include vault/crm-grimoire.svg %}
            {% when "potion" %}{% include vault/potion.svg %}
            {% when "crystal" %}{% include vault/crystal.svg %}
            {% when "crate" %}{% include vault/crate.svg %}
            {% when "orb" %}{% include vault/orb.svg %}
            {% else %}{% include vault/crate.svg %}
          {% endcase %}</span>
          <span class="vault-plaque"><b>{{ item.plaque_name }}</b><i>{{ item.plaque_sub }}</i></span>
          <span class="vault-dust" aria-hidden="true"><i></i><i></i><i></i></span>
        </button>
        {% endfor %}
      </div>
      <div class="vault-board"></div>
      <div class="vault-brackets" aria-hidden="true"><span></span><span></span></div>
    </div>
    {% endfor %}
    <p class="vault-note"><i class="fas fa-box-open" aria-hidden="true"></i> 更多藏品整理入库中 · 下一件或许是某个深夜救过场的工具</p>
  </div>
</section>

<div class="vault-modal" id="vaultModal" hidden>
  <div class="vault-overlay" data-close></div>
  <div class="vault-card" role="dialog" aria-modal="true" aria-labelledby="vmTitle">
    <button class="vault-close" data-close aria-label="关闭"><i class="fas fa-times" aria-hidden="true"></i></button>
    <div class="vault-m-kicker">藏品编号 <b id="vmNo"></b></div>
    <h3 class="vault-m-title" id="vmTitle"></h3>
    <p class="vault-m-en" id="vmEn"></p>
    <div class="vault-m-body">
      <div class="vault-m-figure" id="vmFigure"></div>
      <dl class="vault-meta" id="vmMeta"></dl>
    </div>
    <div class="vault-m-story" id="vmStory"></div>
    <div class="vault-m-actions" id="vmActions"></div>
  </div>
</div>

<script>
(function () {
  var ITEMS = {{ site.data.collection.items | jsonify }};
  var byId = {};
  ITEMS.forEach(function (it) { byId[it.id] = it; });

  var wall = document.getElementById('vaultWall');
  var modal = document.getElementById('vaultModal');
  var lastFocus = null;
  var spotRAF = null;

  wall.addEventListener('mousemove', function (e) {
    if (spotRAF) return;
    spotRAF = requestAnimationFrame(function () {
      var r = wall.getBoundingClientRect();
      wall.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      wall.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      spotRAF = null;
    });
  });
  wall.addEventListener('mouseover', function (e) {
    if (e.target.closest('.vault-item')) wall.classList.add('is-lit');
  });
  wall.addEventListener('mouseout', function (e) {
    if (e.target.closest('.vault-item') && !wall.contains(e.relatedTarget)) wall.classList.remove('is-lit');
  });

  document.querySelectorAll('.vault-item').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-placeholder')) {
        btn.classList.remove('is-shake');
        void btn.offsetWidth;
        btn.classList.add('is-shake');
        return;
      }
      openModal(btn);
    });
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function openModal(btn) {
    var d = byId[btn.dataset.id];
    if (!d) return;
    document.getElementById('vmNo').textContent = d.no;
    document.getElementById('vmTitle').textContent = d.name;
    document.getElementById('vmEn').textContent = d.en || '';
    document.getElementById('vmFigure').innerHTML = btn.querySelector('.vault-figure').innerHTML;
    var meta = [
      ['入库日期', d.collected],
      ['来源', d.origin],
      ['类别', d.category],
      ['稀有度', d.rarity],
      ['存档位置', d.storage]
    ].filter(function (row) { return row[1]; });
    document.getElementById('vmMeta').innerHTML = meta.map(function (row) {
      var value = esc(row[1]);
      if (row[0] === '稀有度') value = '<span class="rar">' + value + '</span>';
      return '<div><dt>' + row[0] + '</dt><dd>' + value + '</dd></div>';
    }).join('');
    document.getElementById('vmStory').innerHTML = (d.story || []).map(function (p) {
      return '<p>' + esc(p) + '</p>';
    }).join('');
    document.getElementById('vmActions').innerHTML = (d.actions || []).map(function (a) {
      return '<a class="vault-btn ' + (a.primary ? 'vault-btn-gold' : 'vault-btn-ghost') + '" target="_blank" rel="noopener" href="' + esc(a.url) + '"><i class="' + (a.icon || 'fas fa-link') + '" aria-hidden="true"></i> ' + esc(a.label) + '</a>';
    }).join('') + '<button class="vault-btn vault-btn-ghost" data-close>合上</button>';
    lastFocus = btn;
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    modal.querySelector('.vault-close').focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    setTimeout(function () {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }, 320);
  }

  modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
</script>
