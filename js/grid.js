(function () {
  'use strict';

  var items = window.WC_GRID_ITEMS;
  var container = document.getElementById('gridNodes');
  var gridBoard = document.getElementById('gridBoard');
  var pageGrid = document.querySelector('.page-grid');
  if (!items || !items.length || !container || !gridBoard || !pageGrid) return;

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var measure = document.createElement('div');
  measure.className = 'grid-measure';
  measure.setAttribute('aria-hidden', 'true');
  gridBoard.appendChild(measure);

  function getCellSize() {
    return measure.getBoundingClientRect().width;
  }

  function viewportWidth() {
    // clientWidth is the layout width (excludes scrollbar) and stays correct
    // under device emulation, where window.innerWidth can report the unscaled
    // width.
    return document.documentElement.clientWidth || window.innerWidth;
  }

  function isMobile() {
    return viewportWidth() < 640;
  }

  function getSlot(item) {
    return isMobile() ? item.mobile : item.desktop;
  }

  function maxGridRow() {
    var max = 0;
    items.forEach(function (item) {
      var slot = getSlot(item);
      if (slot) max = Math.max(max, slot.row + slot.h);
    });
    return max + 2;
  }

  // Slots place cards by fraction of the available width (colFrac) instead of
  // an absolute column, so the layout spreads across the actual viewport
  // instead of hugging the left edge on wide screens (the grid's column count
  // grows with viewport width, but a fixed absolute column stays put).
  // colFrac 0 = as far left as the gutter allows, 1 = as far right.
  var EDGE_GUTTER = 1;

  function resolveCol(slot, cols) {
    if (slot.colFrac == null) return slot.col;
    var first = 1 + EDGE_GUTTER;
    var last = cols - slot.w + 1 - EDGE_GUTTER;
    // A viewport too narrow to afford gutters on both sides gets the full
    // range back rather than a card pushed off-grid.
    if (last < first) {
      first = 1;
      last = Math.max(1, cols - slot.w + 1);
    }
    return Math.round(first + slot.colFrac * (last - first));
  }

  function currentCols() {
    var preferred = getCellSize();
    if (!preferred) return 0;
    return Math.max(3, Math.floor(viewportWidth() / preferred));
  }

  function syncGrid(cols) {
    var preferred = getCellSize();
    if (!preferred || !cols) return;

    // Integer pixel cells so the painted background lines and the CSS grid
    // tracks share the same lattice. Fractional cell sizes (vw / cols) let
    // background-size and grid track rounding diverge — cards look mid-cell.
    var vw = viewportWidth();
    var cell = Math.max(1, Math.floor(vw / cols));
    var offset = Math.floor((vw - cell * cols) / 2);
    var rows = maxGridRow();

    pageGrid.style.setProperty('--grid-cols', String(cols));
    pageGrid.style.setProperty('--grid-offset-x', offset + 'px');
    pageGrid.style.setProperty('--grid-rows', String(rows));
    pageGrid.style.setProperty('--cell-px', cell + 'px');
    pageGrid.style.setProperty('--grid-peek', cell * 6 + 'px');
    pageGrid.style.setProperty('--grid-rise', cell * 5 + 'px');
    pageGrid.style.setProperty('--grid-fade', cell * 2.5 + 'px');
  }

  function applyPlacement(node, slot, cols) {
    node.style.gridColumn = resolveCol(slot, cols) + ' / span ' + slot.w;
    node.style.gridRow = slot.row + ' / span ' + slot.h;
  }

  function relayoutNodes() {
    var cols = currentCols();
    if (!cols) return;
    container.querySelectorAll('.grid-node').forEach(function (node, index) {
      var item = items[index];
      if (!item) return;
      var slot = getSlot(item);
      if (slot) applyPlacement(node, slot, cols);
    });
    syncGrid(cols);
  }

  var initialCols = currentCols();

  var coarsePointer = matchMedia('(hover: none), (pointer: coarse)').matches;

  function buildCardMarkup(item) {
    return (
      '<div class="grid-node-inner">' +
        '<div class="grid-node-face grid-node-front">' +
          '<img class="grid-node-icon" src="' + item.icon + '" alt="" width="40" height="40" decoding="async" />' +
          '<p class="grid-node-title">' + item.title + '</p>' +
          '<p class="grid-node-stat">' + item.stat + '</p>' +
        '</div>' +
        '<div class="grid-node-face grid-node-back">' +
          '<img class="grid-node-icon" src="' + item.icon + '" alt="" width="40" height="40" decoding="async" />' +
          '<p class="grid-node-title">' + item.hoverTitle + '</p>' +
          '<p class="grid-node-stat">' + item.hoverStat + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function setupFlip(node) {
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    node.setAttribute('aria-pressed', 'false');
    node.setAttribute(
      'aria-label',
      node.querySelector('.grid-node-front .grid-node-title').textContent
    );

    node.addEventListener('click', function () {
      if (!coarsePointer) return;
      if (!node.classList.contains('is-lit')) return;

      var wasFlipped = node.classList.contains('is-flipped');
      container.querySelectorAll('.grid-node.is-flipped').forEach(function (n) {
        n.classList.remove('is-flipped');
        n.setAttribute('aria-pressed', 'false');
      });
      if (!wasFlipped) {
        node.classList.add('is-flipped');
        node.setAttribute('aria-pressed', 'true');
      }
    });

    node.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      node.click();
    });

    if (!coarsePointer) {
      node.addEventListener('pointerenter', function () {
        if (!node.classList.contains('is-lit')) return;
        node.classList.remove('is-nudge');
      });

      node.addEventListener('animationend', function (event) {
        if (event.animationName !== 'grid-nudge-flip') return;
        node.classList.remove('is-nudge');
      });
    }
  }

  items.forEach(function (item, index) {
    var node = document.createElement('div');
    node.className = 'grid-node';
    node.innerHTML = buildCardMarkup(item);

    // Only the first three cards get the flip "nudge" hint on reveal; once the
    // idea is taught, later cards just fade in without teasing.
    if (index < 3) node.dataset.canNudge = '1';

    var slot = getSlot(item);
    if (slot) applyPlacement(node, slot, initialCols);
    container.appendChild(node);
    setupFlip(node);
  });

  syncGrid(initialCols);

  var resizeRaf = 0;
  window.addEventListener('resize', function () {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(function () {
      resizeRaf = 0;
      relayoutNodes();
    });
  }, { passive: true });

  document.addEventListener('click', function (event) {
    if (!coarsePointer) return;
    if (event.target.closest('.grid-node')) return;
    container.querySelectorAll('.grid-node.is-flipped').forEach(function (n) {
      n.classList.remove('is-flipped');
      n.setAttribute('aria-pressed', 'false');
    });
  });

  if (reduced) {
    container.querySelectorAll('.grid-node').forEach(function (n) {
      n.classList.add('is-lit');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-lit');
          if (entry.target.dataset.canNudge) {
            entry.target.classList.add('is-nudge');
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -30% 0px', threshold: 0.18 }
  );

  container.querySelectorAll('.grid-node').forEach(function (node) {
    observer.observe(node);
  });
})();
