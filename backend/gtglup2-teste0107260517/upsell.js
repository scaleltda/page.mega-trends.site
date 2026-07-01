(function () {
    'use strict';

    function showLoading() {
        var s = document.createElement('style');
        s.textContent =
            '.ds-loader{position:fixed;top:0;left:0;width:100%;height:100%;background:#e3e8ee;z-index:999999;' +
            'font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center}' +
            '.ds-inner{text-align:center}' +
            '.ds-spin{border:8px solid #ccc;border-top:8px solid #2180c0;border-radius:50%;' +
            'width:60px;height:60px;animation:ds-s 1s linear infinite;margin:0 auto 20px}' +
            '@keyframes ds-s{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}' +
            '.ds-txt{color:#525559;font-size:18px;font-weight:bold}.ds-txt .sub{font-weight:normal}';
        document.head.appendChild(s);

        var d = document.createElement('div');
        d.className = 'ds-loader';
        d.innerHTML =
            '<div class="ds-inner">' +
            '<div class="ds-spin"></div>' +
            '<div class="ds-txt">' +
            '<p>Confirming your order and sending your access...</p>' +
            '<p class="sub">Do not close this page.</p>' +
            '</div></div>';
        document.body.appendChild(d);
    }

    function findYesButton() {
        // Try the YES button by its class first, then by href pattern as fallback
        return document.querySelector('a.btn') ||
               document.querySelector('a[href*="answer/yes"]');
    }

    function init() {
        // Wait 2 seconds for digistore.js to finish initializing and
        // attaching its click handlers to the buttons.
        // Clicking before this causes direct href navigation (wrong redirect).
        setTimeout(function () {
            var btn = findYesButton();

            if (btn) {
                showLoading();
                // Small extra delay so the loading screen renders before the click
                setTimeout(function () {
                    btn.click();
                }, 300);
            }
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
