/**
 * Affiliate Link Tracking
 * Tracks clicks on affiliate links via data-affiliate attributes.
 * Sends events to analytics (GA4 / plausible / custom).
 */
(function() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('[data-affiliate]');
    if (!link) return;

    const data = {
      type: link.dataset.affiliate,
      partner: link.dataset.partner || null,
      product: link.dataset.product || null,
      href: link.href,
      page: window.location.pathname,
      timestamp: Date.now()
    };

    // GA4 event
    if (typeof gtag === 'function') {
      gtag('event', 'affiliate_click', {
        affiliate_type: data.type,
        affiliate_partner: data.partner,
        affiliate_product: data.product,
        link_url: data.href
      });
    }

    // Plausible event
    if (typeof plausible === 'function') {
      plausible('Affiliate Click', { props: data });
    }

    // Store locally for export
    try {
      const clicks = JSON.parse(localStorage.getItem('satc_affiliate_clicks') || '[]');
      clicks.push(data);
      // Keep last 500
      if (clicks.length > 500) clicks.splice(0, clicks.length - 500);
      localStorage.setItem('satc_affiliate_clicks', JSON.stringify(clicks));
    } catch(e) { /* quota */ }
  });

  // Export function for revenue dashboard
  window.SATC = window.SATC || {};
  window.SATC.exportAffiliateClicks = function() {
    const clicks = JSON.parse(localStorage.getItem('satc_affiliate_clicks') || '[]');
    const blob = new Blob([JSON.stringify(clicks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'affiliate-clicks-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
    return clicks.length + ' clicks exported';
  };
})();
