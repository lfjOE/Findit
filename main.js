const storesImages = document.querySelectorAll('.stores');
const selectedStores = [];

storesImages.forEach(image=>{
    image.parentElement.addEventListener('click', ()=>{

        const storeName = image.getAttribute('alt');

        if (image.parentElement.classList.contains('selected')){
            image.parentElement.classList.remove('selected')
            const index = selectedStores.indexOf(storeName);
            selectedStores.splice(index,1);
        }else{
            image.parentElement.classList.add('selected');
        }
        console.log(selectedStores);
    })
})