import { Utils } from './utils.js';

export const Events = {
    async createEventData(eventName) {
        const eventId = crypto.randomUUID();
        const externalId = await Utils.generateSHA256(crypto.randomUUID());
        const emailHash = await Utils.generateSHA256('email' + crypto.randomUUID());
        const phoneHash = await Utils.generateSHA256('phone' + crypto.randomUUID());
        
        return {
            event: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            user: {
                external_id: externalId,
                phone: phoneHash,
                email: emailHash,
                ip: Utils.generateRandomIP(),
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
};