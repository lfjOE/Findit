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
  const searchValue = searchInput.value.trim();
  if (!searchValue) return;
  // Obtener tiendas seleccionadas
  const selectedStores = getStoresFromLocal();
  // Hacer fetch al backend
  const params = new URLSearchParams();
  params.append("q", searchValue);
  selectedStores.forEach((store) => params.append("stores", store));

  fetch(`/search?${params.toString()}`)
    .then((res) => res.json())
    .then((products) => {
      renderResults(products);
    });
  results.classList.remove("d-none");
}

function renderResults(products) {
  const resultsSection = document.querySelector(
    "#results .row.justify-content-center"
  );
  if (!resultsSection) return;
  if (!products.length) {
    resultsSection.innerHTML =
      '<div class="text-center text-danger fw-bold fs-4">No se encontraron resultados</div>';
    return;
  }
  resultsSection.innerHTML = products
    .map(
      (product) => `
    <div class="col-lg-10">
      <div class="card mb-4 shadow-sm p-4 custom-bg rounded-5">
        <div class="row g-0 align-items-center">
          <div class="col-md-2">
            <img src="${product.imgloc}" class="img-fluid rounded-start" alt="${product.productname}" />
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <h3 class="card-title text-success fw-bold fs-3">${product.productname}</h3>
              <img src="${product.store_img}" alt="${product.storename}" class="img-fluid bg-white p-2 rounded-3" style="max-width: 150px" />
            </div>
          </div>
          <div class="col-md-3 text-center">
            <div class="badge bg-success text-white fs-3 p-3 rounded-pill">
              $${product.price}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");
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
