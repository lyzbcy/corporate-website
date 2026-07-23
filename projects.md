---
layout: page
title: 项目索引
permalink: /projects/
---

<section class="project-explorer" id="project-explorer">
  <header class="project-explorer-hero">
    <a class="project-back-link" href="{{ site.baseurl }}/#portfolio"><i class="fas fa-arrow-left" aria-hidden="true"></i> 返回精选作品</a>
    <span class="section-kicker">DYNAMIC PROJECT INDEX</span>
    <h1>全部项目，一处检索</h1>
    <p>搜索标题、描述或技术标签；筛选项会直接从项目元数据生成，新增作品后无需维护索引。</p>
  </header>

  <div class="project-explorer-panel">
    <div class="project-search-row">
      <label class="project-search-box" for="project-search-input">
        <i class="fas fa-search" aria-hidden="true"></i>
        <input id="project-search-input" type="search" placeholder="搜索项目、技术或关键词…" autocomplete="off">
        <kbd>/</kbd>
      </label>
      <label class="project-sort-box">
        <span>排序</span>
        <select id="project-sort-select">
          <option value="date-desc">最新项目</option>
          <option value="score-desc">评分最高</option>
          <option value="title-asc">名称 A—Z</option>
        </select>
      </label>
    </div>

    <div class="project-filter-group">
      <span class="filter-label">类别</span>
      <div class="project-filter-list" id="category-filter-list" aria-label="项目类别"></div>
    </div>
    <div class="project-filter-group">
      <span class="filter-label">标签</span>
      <div class="project-filter-list tag-list" id="tag-filter-list" aria-label="项目标签"></div>
    </div>

    <div class="project-results-toolbar">
      <p id="project-result-count" aria-live="polite"></p>
      <button id="project-reset-button" type="button">清除筛选</button>
    </div>
  </div>

  <div class="project-index-grid" id="project-index-grid">
    {% assign projects_by_date = site.portfolio | sort: 'date' | reverse %}
    {% for project in projects_by_date %}
    {% if project.category == 'school' %}
      {% assign category_key = 'school' %}{% assign category_label = '学校作品' %}
    {% elsif project.category == 'team' or project.category == '团队项目' %}
      {% assign category_key = 'team' %}{% assign category_label = '团队作品' %}
    {% elsif project.category == 'work' %}
      {% assign category_key = 'work' %}{% assign category_label = '打工项目' %}
    {% elsif project.category == 'tool' %}
      {% assign category_key = 'tool' %}{% assign category_label = '妙妙工具' %}
    {% else %}
      {% assign category_key = 'personal' %}{% assign category_label = '个人作品' %}
    {% endif %}
    <article class="project-index-card"
      data-title="{{ project.title | escape }}"
      data-search="{{ project.title | append: ' ' | append: project.subtitle | append: ' ' | append: project.tags | strip_html | escape }}"
      data-category="{{ category_key }}"
      data-category-label="{{ category_label }}"
      data-tags="{{ project.tags | join: '||' | escape }}"
      data-date="{{ project.date | date: '%Y-%m-%d' }}"
      data-score="{{ project.total_score | default: 0 }}">
      <a class="project-index-card-link" data-toggle="modal" data-target="#p-{{ project.caption.title | slugify }}"
        href="#p-{{ project.caption.title | slugify }}" aria-label="查看 {{ project.title }} 详情">
        <div class="project-index-cover">
          {% if project.caption.thumbnail contains 'http' %}
          <img src="{{ project.caption.thumbnail }}" alt="{{ project.alt | default: project.title }}" loading="lazy">
          {% elsif project.caption.thumbnail %}
          <img src="{{ site.baseurl }}/{{ project.caption.thumbnail }}" alt="{{ project.alt | default: project.title }}" loading="lazy">
          {% else %}
          <span class="project-index-fallback">{{ project.title | slice: 0, 1 }}</span>
          {% endif %}
          <span class="project-index-category category-{{ category_key }}">{{ category_label }}</span>
          {% if project.total_score %}<span class="project-index-score">{{ project.total_score }}</span>{% endif %}
        </div>
        <div class="project-index-body">
          <time datetime="{{ project.date | date: '%Y-%m-%d' }}">{{ project.date | date: '%Y.%m.%d' }}</time>
          <h2>{{ project.title }}</h2>
          <p>{{ project.subtitle }}</p>
          {% if project.tags %}
          <div class="project-index-tags">
            {% for tag in project.tags limit: 4 %}<span>{{ tag }}</span>{% endfor %}
          </div>
          {% endif %}
        </div>
      </a>
    </article>
    {% endfor %}
  </div>
  <div class="project-empty-state" id="project-empty-state" hidden>
    <span>⌁</span><h2>没有找到匹配项目</h2><p>换个关键词，或清除筛选再看看。</p>
  </div>
</section>

{% include modals.html %}
