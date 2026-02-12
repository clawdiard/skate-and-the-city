/**
 * PWA Install Prompt + Service Worker Update Handler
 */
(function() {
  // ─── Install Prompt ───
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  function showInstallBanner() {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('pwa-install-dismissed')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-skate-surface border border-skate-accent/40 rounded-xl shadow-2xl p-4 z-50 flex items-center gap-3';
    banner.innerHTML = `
      <span class="text-2xl">🛹</span>
      <div class="flex-1">
        <p class="text-sm font-semibold text-skate-text">Install Skate & the City</p>
        <p class="text-xs text-gray-400">Works offline — perfect for the subway!</p>
      </div>
      <button id="pwa-install-btn" class="bg-skate-accent text-skate-primary text-sm font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition">Install</button>
      <button id="pwa-dismiss-btn" class="text-gray-500 hover:text-gray-300 text-lg leading-none">&times;</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      banner.remove();
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      sessionStorage.setItem('pwa-install-dismissed', '1');
      banner.remove();
    });
  }

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.remove();
  });

  // ─── Service Worker Update ───
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/skate-and-the-city/sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdateBanner(newWorker);
          }
        });
      });
    });

    // Refresh on controller change
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }

  function showUpdateBanner(worker) {
    const banner = document.createElement('div');
    banner.className = 'fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-skate-surface border border-skate-accent/40 rounded-xl shadow-2xl p-4 z-50 flex items-center gap-3';
    banner.innerHTML = `
      <span class="text-2xl">🔄</span>
      <div class="flex-1">
        <p class="text-sm font-semibold text-skate-text">Update Available</p>
        <p class="text-xs text-gray-400">Tap to get the latest spots & routes.</p>
      </div>
      <button id="pwa-update-btn" class="bg-skate-accent text-skate-primary text-sm font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition">Update</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-update-btn').addEventListener('click', () => {
      worker.postMessage({ type: 'SKIP_WAITING' });
      banner.remove();
    });
  }
})();
