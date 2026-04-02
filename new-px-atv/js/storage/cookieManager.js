export const CookieManager = {
    save: (name, value, days = 30) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${JSON.stringify(value)};expires=${date.toUTCString()};path=/`;
    },

    load: (name) => {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                try {
                    return JSON.parse(c.substring(nameEQ.length, c.length));
                } catch {
                    return null;
                }
            }
        }
        return null;
    }
};