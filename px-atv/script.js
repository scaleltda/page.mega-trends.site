// Load saved preferences when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedEvents = JSON.parse(localStorage.getItem('selectedEvents') || '{}');
    document.getElementById('completePayment').checked = savedEvents.completePayment || false;
    document.getElementById('completeRegistration').checked = savedEvents.completeRegistration || false;
});

// Save preferences when checkboxes change
document.getElementById('completePayment').addEventListener('change', savePreferences);
document.getElementById('completeRegistration').addEventListener('change', savePreferences);

function savePreferences() {
    const preferences = {
        completePayment: document.getElementById('completePayment').checked,
        completeRegistration: document.getElementById('completeRegistration').checked
    };
    localStorage.setItem('selectedEvents', JSON.stringify(preferences));
}

function generateRandomIP() {
    return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
}

function generateSHA256(input) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
        .then(hash => Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join(''));
}

async function createEventData(eventName) {
    const eventId = crypto.randomUUID();
    const externalId = await generateSHA256(crypto.randomUUID());
    const emailHash = await generateSHA256('email' + crypto.randomUUID());
    const phoneHash = await generateSHA256('phone' + crypto.randomUUID());
    
    return {
        event: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        user: {
            external_id: externalId,
            phone: phoneHash,
            email: emailHash,
            ip: generateRandomIP(),
            user_agent: navigator.userAgent,
            locale: navigator.language
        },
        properties: {
            currency: "USD",
            value: 200.0,
            content_type: "product",
            description: "some product description",
            contents: [{
                price: 100.0,
                quantity: 2,
                content_id: "12345",
                content_name: "Fancy-AirMax2.0 Black",
                content_category: "Shoes - Running Shoes",
                brand: "Fancy Sneakers"
            }]
        },
        page: {
            url: window.location.href
        }
    };
}

async function triggerEvents() {
    const pixelId = document.getElementById('pixelId').value.trim();
    const accessToken = document.getElementById('apiToken').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!pixelId || !accessToken) {
        showResult('Please enter both Pixel ID and API token.', 'error');
        return;
    }

    const selectedEvents = [];
    if (document.getElementById('completePayment').checked) {
        selectedEvents.push('CompletePayment');
    }
    if (document.getElementById('completeRegistration').checked) {
        selectedEvents.push('CompleteRegistration');
    }

    if (selectedEvents.length === 0) {
        showResult('Please select at least one event to trigger.', 'error');
        return;
    }

    try {
        for (const eventName of selectedEvents) {
            const eventData = await createEventData(eventName);
            const data = {
                event_source: "web",
                event_source_id: pixelId,
                data: [eventData]
            };

            const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Token': accessToken
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            showResult(`${eventName} triggered: ${JSON.stringify(result)}`, response.ok ? 'success' : 'error');
        }
    } catch (error) {
        showResult(`Error: ${error.message}`, 'error');
    }
}

function showResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.className = `mt-4 p-4 rounded ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    resultDiv.classList.remove('hidden');
}