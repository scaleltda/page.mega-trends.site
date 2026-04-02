import { AVAILABLE_EVENTS } from './config/events.js';
import { EventSelector } from './components/eventSelector.js';
import { Utils } from './utils.js';
import { Events } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize event selector
    const eventSelector = new EventSelector(AVAILABLE_EVENTS, 'eventSelector');
    
    // Make triggerEvents available globally
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
            for (const eventName of selectedEvents) {
                const eventData = await Events.createEventData(eventName);
                const response = await fetch('./api/trigger.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pixelId,
                        accessToken,
                        eventData
                    })
                });

                const result = await response.json();
                Utils.showResult(`${eventName} triggered: ${JSON.stringify(result)}`, 
                    result.code === 0 ? 'success' : 'error');
            }
        } catch (error) {
            Utils.showResult(`Error: ${error.message}`, 'error');
        }
    };
});