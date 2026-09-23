/* =========================================================
   ONE ERA — SITE DATA
   Central configuration for product categories
   ========================================================= */

const ONE_ERA_CATEGORIES = {
  smoke: {
    name: "Smoke & Sacred Botanicals",
    eyebrow: "01 · SMOKE",
    description:
      "Incense, sacred botanicals, resins and objects of smoke ritual.",
    keywords: [
      "incense",
      "incense stick",
      "sage",
      "agarwood",
      "palo santo"
    ]
  },

  crystals: {
    name: "Crystals & Earth",
    eyebrow: "02 · EARTH",
    description:
      "Crystals, minerals, stones and objects connected to the earth.",
    keywords: [
      "crystal",
      "quartz",
      "amethyst",
      "obsidian"
    ]
  },

  divination: {
    name: "Divination",
    eyebrow: "03 · DIVINATION",
    description:
      "Tarot, oracle, pendulums, runes and tools for symbolic inquiry.",
    keywords: [
      "tarot",
      "oracle",
      "pendulum",
      "rune"
    ]
  },

  ritual: {
    name: "Ritual & Altar",
    eyebrow: "04 · RITUAL",
    description:
      "Objects for sacred space, ritual practice and intentional living.",
    keywords: [
      "incense burner",
      "altar",
      "ritual",
      "candle holder",
      "offering bowl"
    ]
  }
};


/* =========================================================
   ONE ERA — SITE INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  updateCartCount();

  /*
    Only run the shop loader when the page
    actually contains the product grid.
  */

  const productGrid = document.getElementById("productGrid");

  if (productGrid) {
    loadShopProducts();
  }

});


/* =========================================================
   CART
   ========================================================= */

function updateCartCount() {

  const elements =
    document.querySelectorAll("[data-cart-count]");

  if (!elements.length) return;

  let cart = [];

  try {

    const storedCart =
      localStorage.getItem("oneEraCart");

    if (storedCart) {
      cart = JSON.parse(storedCart);
    }

  } catch (error) {

    console.warn(
      "ONE ERA: Could not read cart.",
      error
    );

    cart = [];

  }

  if (!Array.isArray(cart)) {
    cart = [];
  }

  const count = cart.reduce(function (total, item) {

    return total + (
      Number(item.quantity) > 0
        ? Number(item.quantity)
        : 1
    );

  }, 0);


  elements.forEach(function (element) {

    element.textContent = count;

  });

}


/* =========================================================
   CATEGORY
   ========================================================= */

function getCategoryFromURL() {

  const params =
    new URLSearchParams(window.location.search);

  const category =
    params.get("category");

  if (!category) {
    return null;
  }

  return category.toLowerCase();

}


function getCurrentCategory() {

  const categoryKey =
    getCategoryFromURL();

  if (!categoryKey) {
    return null;
  }

  return (
    ONE_ERA_CATEGORIES[categoryKey] ||
    null
  );

}


/* =========================================================
   PRODUCTS
   ========================================================= */

async function loadProducts() {

  const response =
    await fetch("products.json", {
      cache: "no-store"
    });

  if (!response.ok) {

    throw new Error(
      "products.json could not be loaded. HTTP " +
      response.status
    );

  }

  const data =
    await response.json();


  /*
    Support:

    {
      "products": [...]
    }

    and:

    [...]
  */

  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    Array.isArray(data.products)
  ) {
    return data.products;
  }

  throw new Error(
    "Invalid products.json format."
  );

}


/* =========================================================
   SHOP
   ========================================================= */

async function loadShopProducts() {

  const grid =
    document.getElementById("productGrid");

  const status =
    document.getElementById("shopStatus");


  if (!grid) {
    return;
  }


  try {

    /*
      Show loading state
    */

    grid.innerHTML = `
      <div class="empty-state">
        Loading ONE ERA objects...
      </div>
    `;


    /*
      Load catalogue
    */

    let products =
      await loadProducts();


    /*
      Only show products that are:

      available = true

      OR

      testMode = true
    */

    products =
      products.filter(function (product) {

        return (
          product &&
          (
            product.available === true ||
            product.testMode === true
          )
        );

      });


    /*
      Read category from URL
    */

    const category =
      getCategoryFromURL();


    /*
      Filter category if one exists
    */

    if (category) {

      products =
        products.filter(function (product) {

          if (!product.category) {
            return false;
          }

          return (
            String(product.category)
              .toLowerCase()
              .trim()
            === category
          );

        });

    }


    /*
      Update shop heading when category exists
    */

    updateShopCategoryHeading(category);


    /*
      No products
    */

    if (!products.length) {

      grid.innerHTML = `
        <div class="empty-state">
          No ONE ERA objects are currently
          available in this collection.
        </div>
      `;

      return;

    }


    /*
      Render products
    */

    grid.innerHTML =
      products.map(function (product) {

        return createProductCard(product);

      }).join("");


  } catch (error) {

    console.error(
      "ONE ERA SHOP ERROR:",
      error
    );


    grid.innerHTML = "";


    if (status) {

      status.innerHTML = `
        <div class="error-state">

          <strong>
            SHOP COULD NOT LOAD
          </strong>

          <br><br>

          ${escapeHTML(error.message)}

          <br><br>

          Please make sure
          <strong>products.json</strong>
          exists in the same GitHub repository
          as this page.

        </div>
      `;

    }

  }

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

  const slug =
    product.slug ||
    product.id ||
    "";


  const name =
    product.name ||
    product.title ||
    "Untitled Product";


  const collection =
    product.collection ||
    "";


  const description =
    product.shortDescription ||
    product.description ||
    "";


  /*
    Product image
  */

  let imageHTML = `
    <div class="product-placeholder">
      ONE ERA
    </div>
  `;


  if (
    product.images &&
    Array.isArray(product.images) &&
    product.images.length
  ) {

    const firstImage =
      product.images[0];


    let imageURL = "";


    if (typeof firstImage === "string") {

      imageURL = firstImage;

    } else if (
      firstImage &&
      firstImage.url
    ) {

      imageURL = firstImage.url;

    }


    if (imageURL) {

      const alt =
        (
          firstImage &&
          typeof firstImage === "object" &&
          firstImage.alt
        )
          ? firstImage.alt
          : name;


      imageHTML = `
        <img
          src="${escapeAttribute(imageURL)}"
          alt="${escapeAttribute(alt)}"
          loading="lazy"
        >
      `;

    }

  }


  /*
    Price
  */

  let price =
    "TEST PRICE";


  if (
    product.price &&
    product.price.display
  ) {

    price =
      product.price.display;

  }


  /*
    Test product label
  */

  let testStatus = "";


  if (product.testMode === true) {

    testStatus = `
      <div class="product-status">
        TEST PRODUCT
      </div>
    `;

  }


  /*
    Product URL
  */

  const productURL =
    "product.html?product=" +
    encodeURIComponent(slug);


  return `

    <article class="product-card">

      <a
        href="${productURL}"
        aria-label="View ${escapeAttribute(name)}"
      >

        <div class="product-image">

          ${imageHTML}

        </div>

      </a>


      <div class="product-info">

        <div class="product-eyebrow">

          ${escapeHTML(collection)}

        </div>


        <h2>

          ${escapeHTML(name)}

        </h2>


        <p>

          ${escapeHTML(description)}

        </p>


        <div class="product-price">

          ${escapeHTML(price)}

        </div>


        ${testStatus}


        <a
          class="product-link"
          href="${productURL}"
        >

          View product

        </a>

      </div>

    </article>

  `;

}


/* =========================================================
   SHOP CATEGORY HEADING
   ========================================================= */

function updateShopCategoryHeading(category) {

  if (!category) {
    return;
  }


  const categoryData =
    ONE_ERA_CATEGORIES[category];


  if (!categoryData) {
    return;
  }


  const intro =
    document.querySelector(".shop-intro");


  if (!intro) {
    return;
  }


  const eyebrow =
    intro.querySelector(".eyebrow");


  const heading =
    intro.querySelector("h1");


  const description =
    intro.querySelector("p");


  if (eyebrow) {

    eyebrow.textContent =
      "ONE ERA · " +
      categoryData.eyebrow;

  }


  if (heading) {

    heading.innerHTML =
      categoryData.name.replace(
        " & ",
        " &<br>"
      );

  }


  if (description) {

    description.textContent =
      categoryData.description;

  }

}


/* =========================================================
   HTML SAFETY HELPERS
   ========================================================= */

function escapeHTML(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

  return escapeHTML(value);

}


/* =========================================================
   PUBLIC HELPERS
   ========================================================= */

window.ONE_ERA = {

  categories:
    ONE_ERA_CATEGORIES,

  getCategoryFromURL:
    getCategoryFromURL,

  getCurrentCategory:
    getCurrentCategory,

  loadProducts:
    loadProducts,

  updateCartCount:
    updateCartCount

};
