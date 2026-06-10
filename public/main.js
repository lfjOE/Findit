// ===========================
// DOM REFERENCES
// ===========================
const storesImages = document.querySelectorAll('.stores');
const storeCards = document.querySelectorAll('.store-card');

const findButton = document.querySelector('#find-button');
findButton.disabled = true;

const results = document.querySelector('#results');

const searchInput = document.querySelector('#search');

const minPriceInput = document.querySelector('#minPrice');
const maxPriceInput = document.querySelector('#maxPrice');

const priceError = document.querySelector('#price-error');
const priceErrorText = document.querySelector('#price-error-text');

const toastContainer = document.querySelector('#toast-container');

// ===========================
// STATE
// ===========================
const selectedStores = getStoresFromLocal();
let hasPriceError = false;

// ===========================
// INIT
// ===========================
setSelectedStores();

// ===========================
// PRICE VALIDATION
// ===========================
function validatePrices() {
    const minVal = minPriceInput.value.trim();
    const maxVal = maxPriceInput.value.trim();
    const min = parseFloat(minVal);
    const max = parseFloat(maxVal);

    // Reset states
    hasPriceError = false;
    minPriceInput.classList.remove('is-invalid');
    maxPriceInput.classList.remove('is-invalid');
    hidePriceError();

    // Check negative values
    if (minVal !== '' && min < 0) {
        hasPriceError = true;
        minPriceInput.classList.add('is-invalid');
        showPriceError('El precio mínimo no puede ser negativo');
        return;
    }

    if (maxVal !== '' && max < 0) {
        hasPriceError = true;
        maxPriceInput.classList.add('is-invalid');
        showPriceError('El precio máximo no puede ser negativo');
        return;
    }

    // Check min > max
    if (minVal !== '' && maxVal !== '' && min > max) {
        hasPriceError = true;
        minPriceInput.classList.add('is-invalid');
        maxPriceInput.classList.add('is-invalid');
        showPriceError('El precio mínimo no puede ser mayor al precio máximo');
        return;
    }
}

function showPriceError(message) {
    priceErrorText.textContent = message;
    priceError.classList.add('visible');
}

function hidePriceError() {
    priceError.classList.remove('visible');
    priceErrorText.textContent = '';
}

// ===========================
// TOAST NOTIFICATIONS
// ===========================
function showToast(message, type = 'info') {
    const icons = {
        error: '✕',
        success: '✓',
        info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;

    // Click to dismiss
    toast.addEventListener('click', () => {
        dismissToast(toast);
    });

    toastContainer.appendChild(toast);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        dismissToast(toast);
    }, 4000);
}

function dismissToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add('toast-slideout');
    toast.addEventListener('animationend', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

// ===========================
// INPUT VERIFICATION
// ===========================
function verifyInput() {
    validatePrices();

    if (searchInput.value.trim() !== "" && !hasPriceError) {
        findButton.disabled = false;
    } else {
        findButton.disabled = true;
    }
}

// ===========================
// SCROLL
// ===========================
function scrollToResults() {
    const resultsSection = document.querySelector('#results');
    resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ===========================
// LOCAL STORAGE — STORES
// ===========================
function saveStoresIntoLocal() {
    localStorage.setItem('selectedStores', JSON.stringify(selectedStores));
}

function getStoresFromLocal() {
    const stores = localStorage.getItem('selectedStores');
    if (stores) {
        return JSON.parse(stores);
    } else {
        return [];
    }
}

function setSelectedStores() {
    storeCards.forEach(card => {
        const image = card.querySelector('.stores');
        const storeName = image.getAttribute('alt');
        if (selectedStores.includes(storeName)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// ===========================
// STORE SELECTION EVENTS
// ===========================
storeCards.forEach(card => {
    card.addEventListener('click', () => {
        const image = card.querySelector('.stores');
        const storeName = image.getAttribute('alt');

        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            const index = selectedStores.indexOf(storeName);
            selectedStores.splice(index, 1);
        } else {
            card.classList.add('selected');
            selectedStores.push(storeName);
        }
        console.log(selectedStores);
        verifyInput();
        saveStoresIntoLocal();
    });

    // Keyboard support: Enter/Space to toggle
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// ===========================
// FIND BUTTON EVENT
// ===========================
findButton.addEventListener('click', () => {
    findProducts();
});

// ===========================
// SEARCH INPUT EVENTS
// ===========================
searchInput.addEventListener('input', () => {
    verifyInput();
});

// Search with Enter key
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !findButton.disabled) {
        e.preventDefault();
        findProducts();
    }
});

// ===========================
// PRICE INPUT EVENTS
// ===========================
minPriceInput.addEventListener('input', () => {
    verifyInput();
});

maxPriceInput.addEventListener('input', () => {
    verifyInput();
});

// ===========================
// FIND PRODUCTS
// ===========================
function findProducts() {
    // Validate prices one more time
    validatePrices();
    if (hasPriceError) {
        showToast('Corrige los errores de precio antes de buscar', 'error');
        return;
    }

    if (selectedStores.length <= 0) {
        showToast('Debes seleccionar por lo menos una tienda', 'error');
        return;
    }

    results.classList.remove('d-none');

    const searchTerm = searchInput.value.trim();
    const minPrice = minPriceInput.value;
    const maxPrice = maxPriceInput.value;

    // Search term
    document.querySelector('#resultSearchTerm').textContent = `"${searchTerm}"`;

    // Store pills with mini logos
    const storeLogos = {
        'Amazon': '/res/amazon-com-logo.svg',
        'Walmart': '/res/walmart-com-logo.svg',
        'Aliexpress': '/res/aliexpress-com-logo.svg',
        'Temu': '/res/temu-logo.svg',
        'Nike': '/res/nike-com-logo.svg',
        'Adidas': '/res/adidas-com-logo.svg',
        'Coppel': '/res/coppel-logo.svg',
        'Liverpool': '/res/liverpool-logo.svg'
    };

    const storesContainer = document.querySelector('#resultStores');
    storesContainer.innerHTML = selectedStores
        .map(store => {
            const logo = storeLogos[store];
            const iconHTML = logo
                ? `<span class="store-pill-icon"><img src="${logo}" alt=""></span>`
                : '';
            return `<span class="store-pill">${iconHTML}${store}</span>`;
        })
        .join('');

    // Price range pills
    const priceGroup = document.querySelector('#resultPriceGroup');
    const priceContainer = document.querySelector('#resultPriceRange');
    let priceHTML = '';
    if (minPrice) priceHTML += `<span class="price-pill price-min"><span class="price-pill-arrow">↑</span> Desde $${Number(minPrice).toLocaleString()}</span>`;
    if (maxPrice) priceHTML += `<span class="price-pill price-max"><span class="price-pill-arrow">↓</span> Hasta $${Number(maxPrice).toLocaleString()}</span>`;
    priceContainer.innerHTML = priceHTML;
    priceGroup.style.display = (minPrice || maxPrice) ? 'flex' : 'none';

    scrollToResults();
}