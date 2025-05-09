const storesImages = document.querySelectorAll('.stores');

const findButton = document.querySelector('#find-button');
findButton.disabled = true;

const results = document.querySelector('#results');

const searchInput = document.querySelector('#search');

console.log(findButton.innerHTML);
const selectedStores = getStoresFromLocal();
setSelectedStores();

function verifyInput(){
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

function saveStoresIntoLocal(){
    localStorage.setItem('selectedStores', JSON.stringify(selectedStores));
}
function getStoresFromLocal(){
    const stores = localStorage.getItem('selectedStores');
    if (stores) {
        return JSON.parse(stores);
    } else {
        return [];
    }
}

function setSelectedStores(){
    storesImages.forEach(image=>{
        const storeName = image.getAttribute('alt');
        if (selectedStores.includes(storeName)){
            image.parentElement.classList.add('selected');
        }else{
            image.parentElement.classList.remove('selected');
        }
    })
}

storesImages.forEach(image=>{
    image.parentElement.addEventListener('click', ()=>{

        const storeName = image.getAttribute('alt');

        if (image.parentElement.classList.contains('selected')){
            image.parentElement.classList.remove('selected')
            const index = selectedStores.indexOf(storeName);
            selectedStores.splice(index,1);
        }else{
            image.parentElement.classList.add('selected');
            selectedStores.push(storeName);
        }
        console.log(selectedStores);
        verifyInput();
        saveStoresIntoLocal();
    })
})

findButton.addEventListener('click', ()=>{
    findProducts();
    scrollToResults();
});

searchInput.addEventListener('input', () => {
    verifyInput();
});


function findProducts(){
    results.classList.remove('d-none');
}