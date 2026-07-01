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

    function getSessionId() {
        try {
            return new URLSearchParams(window.location.search).get('digistore_upsell_session_id');
        } catch (e) {
            var m = window.location.search.match(/[?&]digistore_upsell_session_id=([^&]+)/);
            return m ? decodeURIComponent(m[1]) : null;
        }
    }

    function init() {
        showLoading();

        var sessionId = getSessionId();
        var tries = 0;

        var iv = setInterval(function () {
            tries++;

            // Hard timeout at 30 seconds
            if (tries > 60) {
                clearInterval(iv);
                if (sessionId) {
                    // Navigate directly — we have the session ID from the page URL
                    window.location.href =
                        'https://www.checkout-ds24.com/answer/yes' +
                        '?digistore_upsell_session_id=' + encodeURIComponent(sessionId) +
                        '&template=light';
                }
                return;
            }

            var btn = document.querySelector(
                'a[href*="checkout-ds24.com/answer/yes"], a[href*="answer/yes"]'
            );

            if (!btn) return; // DOM not ready yet, keep waiting

            var href = btn.getAttribute('href') || '';

            // If we know the session ID, wait until Digistore has injected it into the
            // button href — this confirms Digistore processed the page correctly.
            // We wait up to 10 seconds (20 tries) for this.
            if (sessionId && !href.includes(sessionId) && tries <= 20) {
                return;
            }

            clearInterval(iv);

            if (sessionId && !href.includes(sessionId)) {
                // Digistore did not update the href in time — navigate directly
                window.location.href =
                    'https://www.checkout-ds24.com/answer/yes' +
                    '?digistore_upsell_session_id=' + encodeURIComponent(sessionId) +
                    '&template=light';
                return;
            }

            // Digistore updated the href correctly — click the button normally
            btn.click();

        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
