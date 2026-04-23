// Handle local storage operations
const Storage = {
    saveEvents: (preferences) => {
        localStorage.setItem('selectedEvents', JSON.stringify(preferences));
    },

    loadEvents: () => {
        return JSON.parse(localStorage.getItem('selectedEvents') || '{}');
    }
};