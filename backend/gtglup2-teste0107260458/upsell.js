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

    function buildAnswerUrl() {
        // Copy all Digistore session params from the current page URL into the answer URL.
        // Do NOT include template=light — that flag suppresses the server-side redirect
        // to the configured thank-you page.
        var pageParams = new URLSearchParams(window.location.search);
        var answerParams = new URLSearchParams();

        pageParams.forEach(function (value, key) {
            if (key !== 'template') {
                answerParams.set(key, value);
            }
        });

        var qs = answerParams.toString();
        return 'https://www.checkout-ds24.com/answer/yes' + (qs ? '?' + qs : '');
    }

    function init() {
        showLoading();

        setTimeout(function () {
            window.location.href = buildAnswerUrl();
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
