import { AVAILABLE_EVENTS } from './config/events.js';
import { EventSelector } from './components/eventSelector.js';
import { Utils } from './utils.js';
import { Events } from './events.js';

const loadedPixels = new Set();

async function ensurePixelLoaded(pixelId) {
    if (loadedPixels.has(pixelId)) return;

    if (!window.TiktokAnalyticsObject) {
        window.TiktokAnalyticsObject = 'ttq';
        const ttq = window.ttq = window.ttq || [];
        const methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
        const setAndDefer = (t, e) => {
            t[e] = function() { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
        };
        methods.forEach(m => setAndDefer(ttq, m));
        ttq.instance = (t) => {
            const e = ttq._i[t] || [];
            methods.forEach(m => setAndDefer(e, m));
            return e;
        };
    }

    const ttq = window.ttq;
    const sdkUrl = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i || {};
    ttq._i[pixelId] = ttq._i[pixelId] || [];
    ttq._i[pixelId]._u = sdkUrl;
    ttq._t = ttq._t || {};
    ttq._t[pixelId] = ttq._t[pixelId] || +new Date;
    ttq._o = ttq._o || {};
    ttq._o[pixelId] = ttq._o[pixelId] || {};

    await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `${sdkUrl}?sdkid=${pixelId}&lib=ttq`;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load TikTok Pixel SDK. Check if the Pixel ID is valid.'));
        document.head.appendChild(script);
    });

    loadedPixels.add(pixelId);
}

document.addEventListener('DOMContentLoaded', () => {
    const eventSelector = new EventSelector(AVAILABLE_EVENTS, 'eventSelector');

    window.triggerEvents = async () => {
        const pixelId = document.getElementById('pixelId').value.trim();
        const accessToken = document.getElementById('apiToken').value.trim();

        if (!pixelId || !accessToken) {
            Utils.showResult('Please enter both Pixel ID and API token.', 'error');
            return;
        }

        const selectedEvents = eventSelector.getSelectedEvents();

        if (selectedEvents.length === 0) {
            Utils.showResult('Please select at least one event to trigger.', 'error');
            return;
        }

        Utils.clearResults();

        try {
            await ensurePixelLoaded(pixelId);

            for (const eventName of selectedEvents) {
                const eventData = await Events.createEventData(eventName);

                window.ttq.identify({
                    email: eventData.user.email,
                    phone_number: eventData.user.phone,
                    external_id: eventData.user.external_id
                });

                window.ttq.track(eventName, eventData.properties);

                Utils.showResult(
                    `${eventName} triggered: ${JSON.stringify({ code: 0, message: "OK" })}`,
                    'success'
                );
            }
        } catch (error) {
            Utils.showResult(`Error: ${error.message}`, 'error');
        }
    };
});