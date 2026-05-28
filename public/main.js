const storesImages = document.querySelectorAll('.stores');

const findButton = document.querySelector('#find-button');
findButton.disabled = true;

const results = document.querySelector('#results');

const searchInput = document.querySelector('#search');

const minPriceInput = document.querySelector('#minPrice');
const maxPriceInput = document.querySelector('#maxPrice');

const selectedStores = getStoresFromLocal();
setSelectedStores();

function verifyInput() {
    if (searchInput.value.trim() !== "" && selectedStores.length > 0) {
        findButton.disabled = false;
    } else {
        findButton.disabled = true;
    }
}

function scrollToResults() {
    const resultsSection = document.querySelector('#results');
    resultsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

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
    storesImages.forEach(image => {
        const storeName = image.getAttribute('alt');
        if (selectedStores.includes(storeName)) {
            image.parentElement.classList.add('selected');
        } else {
            image.parentElement.classList.remove('selected');
        }
    })
}

storesImages.forEach(image => {
    image.parentElement.addEventListener('click', () => {

        const storeName = image.getAttribute('alt');

        if (image.parentElement.classList.contains('selected')) {
            image.parentElement.classList.remove('selected')
            const index = selectedStores.indexOf(storeName);
            selectedStores.splice(index, 1);
        } else {
            image.parentElement.classList.add('selected');
            selectedStores.push(storeName);
        }
        console.log(selectedStores);
        verifyInput();
        saveStoresIntoLocal();
    })
})

findButton.addEventListener('click', () => {
    findProducts();
    scrollToResults();
});

searchInput.addEventListener('input', () => {
    verifyInput();
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !findButton.disabled) {
        findButton.click();
    }
});


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

const storeSearchUrls = {
    'Amazon': (term) => `https://www.amazon.com/s?k=${encodeURIComponent(term)}`,
    'Walmart': (term) => `https://www.walmart.com/search?q=${encodeURIComponent(term)}`,
    'Aliexpress': (term) => `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(term)}.html`,
    'Temu': (term) => `https://www.temu.com/search_result.html?search_key=${encodeURIComponent(term)}`,
    'Nike': (term) => `https://www.nike.com/w?q=${encodeURIComponent(term)}`,
    'Adidas': (term) => `https://www.adidas.com/us/search?q=${encodeURIComponent(term)}`,
    'Coppel': (term) => `https://www.coppel.com/SearchDisplay?searchTerm=${encodeURIComponent(term)}`,
    'Liverpool': (term) => `https://www.liverpool.com.mx/tienda?s=${encodeURIComponent(term)}`
};

async function findProducts() {
    if (selectedStores.length <= 0) {
        alert("Debe de seleccionar por lo menos una tienda");
        return;
    }

    const searchTerm = searchInput.value.trim();
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    results.classList.remove('d-none');

    const resultsTitle = document.querySelector('#results h2');
    const cardsContainer = document.querySelector('#cards-container');
    const loadingSpinner = document.querySelector('#loading');

    cardsContainer.innerHTML = '';
    loadingSpinner.classList.remove('d-none');

    let storesText = `en las tiendas seleccionadas: ${selectedStores.join(', ')}`;
    let message = `Buscando "${searchTerm}" ${storesText}`;
    if (minPrice > 0) message += `, precio mínimo: $${minPrice}`;
    if (maxPrice < Infinity) message += `, precio máximo: $${maxPrice}`;
    resultsTitle.textContent = message;

    try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error("Error en la llamada a la API");
        const data = await response.json();

        let productsList = data.products || [];

        if (productsList.length === 0) {
            const fallbackResponse = await fetch(`https://dummyjson.com/products?limit=10`);
            if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                productsList = fallbackData.products || [];
            }
        }

        const filteredProducts = productsList.filter(product => {
            return product.price >= minPrice && product.price <= maxPrice;
        });

        loadingSpinner.classList.add('d-none');

        if (filteredProducts.length === 0) {
            cardsContainer.innerHTML = `
                <div class="col-lg-10 text-center my-4">
                    <p class="fs-4 text-warning">No se encontraron productos coincidentes en este rango de precios.</p>
                </div>
            `;
            resultsTitle.textContent = "Búsqueda finalizada";
            return;
        }

        filteredProducts.forEach((product, idx) => {
            const assignedStore = selectedStores[idx % selectedStores.length];
            const logoSrc = storeLogos[assignedStore] || '/res/amazon-com-logo.svg';
            const redirectUrl = storeSearchUrls[assignedStore] ? storeSearchUrls[assignedStore](searchTerm) : '#';

            const col = document.createElement('div');
            col.className = 'col-lg-10';
            col.style.cursor = 'pointer';
            col.addEventListener('click', () => {
                window.open(redirectUrl, '_blank');
            });

            col.innerHTML = `
                <div class="card mb-4 shadow-sm p-4 custom-bg rounded-5">
                    <div class="row g-0 align-items-center">
                        <div class="col-md-2">
                            <img src="${product.thumbnail || '/res/gamerMouse.jpg'}" class="img-fluid rounded-start" alt="${product.title}" style="max-height: 120px; object-fit: contain;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h3 class="card-title text-success fw-bold fs-3">${product.title}</h3>
                                <img src="${logoSrc}" alt="${assignedStore}" class="img-fluid bg-white p-2 rounded-3" style="max-width: 150px;">
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="badge bg-success text-white fs-3 p-3 rounded-pill">
                                $${product.price}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(col);
        });

        resultsTitle.textContent = `Se encontraron ${filteredProducts.length} productos en ${selectedStores.join(', ')}`;

    } catch (err) {
        console.error("Error al buscar productos:", err);
        loadingSpinner.classList.add('d-none');
        cardsContainer.innerHTML = `
            <div class="col-lg-10 text-center my-4">
                <p class="fs-4 text-danger">Ocurrió un error al buscar los productos. Intente de nuevo.</p>
            </div>
        `;
    }
}