export const Utils = {
    generateRandomIP: () => {
        return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
    },

    generateSHA256: async (input) => {
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },

    showResult: (message, type) => {
        const resultDiv = document.getElementById('result');
        // Create a new paragraph for each result
        const p = document.createElement('p');
        p.textContent = message;
        p.className = `mb-2 ${type === 'error' ? 'text-red-700' : 'text-green-700'}`;
        
        // Clear previous results if it's an error
        if (type === 'error') {
            resultDiv.innerHTML = '';
        }
        
        resultDiv.appendChild(p);
        resultDiv.classList.remove('hidden');
        resultDiv.className = `mt-4 p-4 rounded ${type === 'error' ? 'bg-red-100' : 'bg-green-100'}`;
    },

    clearResults: () => {
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';
        resultDiv.classList.add('hidden');
    }
};