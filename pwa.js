/* PWA — Team Rando : enregistrement du service worker + mise à jour auto à chaque ouverture */
if ('serviceWorker' in navigator) {
  let reloading = false;
  const hadController = !!navigator.serviceWorker.controller; // faux à la 1ʳᵉ installation

  // Quand une NOUVELLE version prend la main → on recharge une fois pour l'appliquer
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading || !hadController) return; // pas de reload à la toute première installation
    reloading = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      // Vérifie tout de suite s'il y a une version plus récente en ligne
      reg.update().catch(() => {});

      // Si une nouvelle version est déjà en attente, on l'active immédiatement (→ controllerchange → reload)
      if (reg.waiting && navigator.serviceWorker.controller) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            (reg.waiting || nw).postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });

      // Re-vérifie la mise à jour à chaque fois que l'appli revient au premier plan (ouverture depuis l'icône)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    }).catch(() => {});
  });
}
