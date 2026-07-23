/*!
 * Project detail progressive loader
 * Keeps project bodies and large media out of the homepage until a visitor opens one.
 */
(function () {
  'use strict';

  if (!window.jQuery || !window.fetch) return;

  var $ = window.jQuery;
  var responseCache = new Map();

  function prepareFragment(html) {
    var template = document.createElement('template');
    template.innerHTML = html;

    template.content.querySelectorAll('img').forEach(function (image) {
      image.loading = 'lazy';
      image.decoding = 'async';
    });

    template.content.querySelectorAll('iframe').forEach(function (frame) {
      frame.loading = 'lazy';
    });

    return template.content.cloneNode(true);
  }

  function fetchDetail(url) {
    if (!responseCache.has(url)) {
      responseCache.set(url, fetch(url, {
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'project-detail-loader' }
      }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      }).catch(function (error) {
        responseCache.delete(url);
        throw error;
      }));
    }

    return responseCache.get(url);
  }

  function renderError(modal, url) {
    var body = modal.querySelector('[data-project-body]');
    if (!body) return;

    modal.dataset.projectState = 'error';
    body.innerHTML =
      '<div class="project-detail-state project-detail-error" role="alert">' +
      '<strong>项目详情暂时没有加载成功</strong>' +
      '<p>可以检查网络后重试，或者直接打开独立详情页。</p>' +
      '<div class="project-detail-actions">' +
      '<button class="btn btn-primary" type="button" data-project-retry>重新加载</button>' +
      '<a class="btn btn-outline-secondary" href="' + url + '">打开详情页</a>' +
      '</div></div>';
  }

  function loadModal(modal) {
    var state = modal.dataset.projectState;
    if (state === 'loaded' || state === 'loading') return;

    var url = modal.dataset.projectUrl;
    var body = modal.querySelector('[data-project-body]');
    if (!url || !body) return;

    modal.dataset.projectState = 'loading';
    body.innerHTML =
      '<div class="project-detail-state" role="status" aria-live="polite">' +
      '<span class="project-detail-spinner" aria-hidden="true"></span>' +
      '<strong>正在加载项目详情…</strong>' +
      '<p>只加载你正在查看的项目，其他项目继续保持轻量。</p>' +
      '</div>';

    fetchDetail(url).then(function (html) {
      body.replaceChildren(prepareFragment(html));
      modal.dataset.projectState = 'loaded';
    }).catch(function () {
      renderError(modal, url);
    });
  }

  $(document)
    .on('show.bs.modal', '.portfolio-modal', function () {
      loadModal(this);
    })
    .on('click', '[data-project-retry]', function () {
      var modal = this.closest('.portfolio-modal');
      if (modal) loadModal(modal);
    });
}());
