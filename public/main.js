const storesImages = document.querySelectorAll(".stores");

const findButton = document.querySelector("#find-button");
findButton.disabled = true;

const results = document.querySelector("#results");

const searchInput = document.querySelector("#search");

// const loginButton = document.querySelector("#login-button");
// const signuputton = document.querySelector("#signup-button");

console.log(findButton.innerHTML);
const selectedStores = getStoresFromLocal();
setSelectedStores();

//Codigo para mostrar modal de login
document.getElementById("login-button").addEventListener("click", function () {
  var loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
  loginModal.show();
});

// Reemplaza los botones de login/signup por el nombre del usuario si está logueado
fetch("/session-username")
  .then((res) => res.json())
  .then((data) => {
    if (data.username) {
      document.getElementById(
        "user-nav-area"
      ).innerHTML = `<span class='fw-bold h2 text-success'>${data.username}</span>`;
    }
  });

function verifyInput() {
  if (searchInput.value.trim() !== "" && selectedStores.length > 0) {
    findButton.disabled = false;
  } else {
    findButton.disabled = true;
  }
}

function scrollToResults() {
  const resultsSection = document.querySelector("#results");
  resultsSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function saveStoresIntoLocal() {
  localStorage.setItem("selectedStores", JSON.stringify(selectedStores));
}
function getStoresFromLocal() {
  const stores = localStorage.getItem("selectedStores");
  if (stores) {
    return JSON.parse(stores);
  } else {
    return [];
  }
}

function setSelectedStores() {
  storesImages.forEach((image) => {
    const storeName = image.getAttribute("alt");
    if (selectedStores.includes(storeName)) {
      image.parentElement.classList.add("selected");
    } else {
      image.parentElement.classList.remove("selected");
    }
  });
}

storesImages.forEach((image) => {
  image.parentElement.addEventListener("click", () => {
    const storeName = image.getAttribute("alt");

    if (image.parentElement.classList.contains("selected")) {
      image.parentElement.classList.remove("selected");
      const index = selectedStores.indexOf(storeName);
      selectedStores.splice(index, 1);
    } else {
      image.parentElement.classList.add("selected");
      selectedStores.push(storeName);
    }
    console.log(selectedStores);
    verifyInput();
    saveStoresIntoLocal();
  });
});

findButton.addEventListener("click", () => {
  findProducts();
  scrollToResults();
});

searchInput.addEventListener("input", () => {
  verifyInput();
});

function findProducts() {
  results.classList.remove("d-none");
}

// Cargar tiendas dinámicamente desde la base de datos
function renderStores() {
  fetch("/stores")
    .then((res) => res.json())
    .then((stores) => {
      const storesRow = document.querySelector(
        ".row.g-4.justify-content-center.custom-bg"
      );
      if (!storesRow) return;
      storesRow.innerHTML = stores
        .map(
          (store) => `
        <div class="col-6 col-sm-3">
          <div class="box-shadow card bg-white d-flex align-items-center justify-content-center p-3">
            <img
              src="${store.imgloc}"
              class="stores logo-store mx-auto"
              alt="${store.storename}"
            />
          </div>
        </div>
      `
        )
        .join("");
      // Volver a asignar eventos a las imágenes
      setStoreImageEvents();
    });
}

function setStoreImageEvents() {
  const storesImages = document.querySelectorAll(".stores");
  storesImages.forEach((image) => {
    const storeName = image.getAttribute("alt");
    image.parentElement.addEventListener("click", () => {
      if (image.parentElement.classList.contains("selected")) {
        image.parentElement.classList.remove("selected");
        const index = selectedStores.indexOf(storeName);
        selectedStores.splice(index, 1);
      } else {
        image.parentElement.classList.add("selected");
        selectedStores.push(storeName);
      }
      verifyInput();
      saveStoresIntoLocal();
    });
  });
  setSelectedStores();
}

// Llama a renderStores al cargar la página
renderStores();
