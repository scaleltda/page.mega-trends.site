import { CookieManager } from '../storage/cookieManager.js';

export class EventSelector {
    constructor(events, containerId) {
        this.events = events;
        this.container = document.getElementById(containerId);
        this.cookieName = 'selectedEvents';
        this.init();
    }

    init() {
        // Create dropdown container
        const wrapper = document.createElement('div');
        wrapper.className = 'relative';

        // Create dropdown button
        const button = document.createElement('button');
        button.className = 'w-full p-2.5 text-gray-700 bg-white border rounded-md shadow-sm outline-none appearance-none flex justify-between items-center';
        button.innerHTML = `
            <span>Select Events</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        `;

        // Create dropdown content
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute z-10 w-full bg-white rounded-md shadow-lg mt-1 border hidden';

        // Load saved selections from cookies
        const savedSelections = CookieManager.load(this.cookieName) || {};

        // Create checkboxes for each event
        this.events.forEach(event => {
            const isSelected = savedSelections[event.id] !== undefined ? 
                savedSelections[event.id] : 
                event.defaultSelected;

            const item = document.createElement('label');
            item.className = 'flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2';
            checkbox.checked = isSelected;
            checkbox.value = event.id;
            
            const text = document.createElement('span');
            text.textContent = event.name;
            
            item.appendChild(checkbox);
            item.appendChild(text);
            dropdown.appendChild(item);

            // Save selection when changed
            checkbox.addEventListener('change', () => {
                const currentSelections = this.getSelectedEvents();
                CookieManager.save(this.cookieName, 
                    Object.fromEntries(currentSelections.map(id => [id, true]))
                );
                this.updateButtonText();
            });
        });

        // Toggle dropdown
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
        });

        // Prevent dropdown from closing when clicking inside
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Add elements to container
        wrapper.appendChild(button);
        wrapper.appendChild(dropdown);
        this.container.appendChild(wrapper);

        // Initial button text update
        this.updateButtonText();
    }

    updateButtonText() {
        const selected = this.getSelectedEvents();
        const button = this.container.querySelector('button span');
        if (selected.length === 0) {
            button.textContent = 'Select Events';
        } else if (selected.length === this.events.length) {
            button.textContent = 'All Events Selected';
        } else {
            button.textContent = `${selected.length} Events Selected`;
        }
    }

    getSelectedEvents() {
        const checkboxes = this.container.querySelectorAll('input[type="checkbox"]');
        return Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }
}