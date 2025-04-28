const storesImages = document.querySelectorAll('.stores');

const findButton = document.querySelector('#find-button');
findButton.disabled = true;

const results = document.querySelector('#results');

const searchInput = document.querySelector('#search');

console.log(findButton.innerHTML);
const selectedStores = [];

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