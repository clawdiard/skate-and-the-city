/**
 * Client-side search powered by Fuse.js
 * Loaded in base template, reads pre-built searchIndex.json
 */
(function () {
  const FUSE_OPTIONS = {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'neighborhood', weight: 0.2 },
      { name: 'borough', weight: 0.1 },
      { name: 'features', weight: 0.15 },
      { name: 'description', weight: 0.15 }
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 2
  };

  let fuse = null;
  let searchData = null;

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const overlay = document.getElementById('search-overlay');
  if (!input || !results || !overlay) return;

  // Load index + Fuse.js on first focus
  let loaded = false;
  async function ensureLoaded() {
    if (loaded) return;
    loaded = true;
    const [indexRes, fuseModule] = await Promise.all([
      fetch('/search-index.json').then(r => r.json()),
      import('https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.mjs')
    ]);
    searchData = indexRes;
    fuse = new fuseModule.default(searchData, FUSE_OPTIONS);
  }

  input.addEventListener('focus', ensureLoaded);

  // Debounced search
  let timer = null;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(doSearch, 80);
  });

  function doSearch() {
    const q = input.value.trim();
    if (!q || !fuse) {
      results.classList.add('hidden');
      overlay.classList.add('hidden');
      return;
    }

    const hits = fuse.search(q, { limit: 12 });
    if (hits.length === 0) {
      results.innerHTML = '<div class="px-4 py-3 text-gray-400 text-sm">No results found</div>';
      results.classList.remove('hidden');
      overlay.classList.remove('hidden');
      return;
    }

    // Group by type
    const grouped = {};
    for (const h of hits) {
      const t = h.item.type;
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(h.item);
    }

    const typeLabels = { spot: '📍 Spots', route: '🗺️ Routes' };
    let html = '';
    for (const [type, items] of Object.entries(grouped)) {
      html += `<div class="px-4 pt-2 pb-1 text-xs font-semibold text-skate-accent uppercase tracking-wide">${typeLabels[type] || type}</div>`;
      for (const item of items) {
        html += `<a href="${item.url}" class="block px-4 py-2 hover:bg-skate-accent/10 transition">
          <div class="font-medium text-sm">${esc(item.name)}</div>
          <div class="text-xs text-gray-400">${esc(item.neighborhood || item.borough)}${item.features ? ' · ' + esc(item.features.substring(0, 60)) : ''}</div>
        </a>`;
      }
    }
    results.innerHTML = html;
    results.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  // Close on overlay click or Escape
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });

  function close() {
    results.classList.add('hidden');
    overlay.classList.add('hidden');
    input.blur();
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();
