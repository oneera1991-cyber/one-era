/* =========================================================
   ONE ERA — CURRENCY SYSTEM
   ========================================================= */

const ONE_ERA_CURRENCIES = {

  THB: {
    code: "THB",
    symbol: "฿",
    name: "Thai Baht",
    rate: 1,
    decimals: 0,
    locale: "th-TH"
  },

  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    rate: 0.029,
    decimals: 2,
    locale: "en-US"
  },

  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    rate: 0.021,
    decimals: 2,
    locale: "en-GB"
  },

  HKD: {
    code: "HKD",
    symbol: "HK$",
    name: "Hong Kong Dollar",
    rate: 0.227,
    decimals: 2,
    locale: "en-HK"
  }

};


const ONE_ERA_CURRENCY_KEY = "oneEraCurrency";


function getSelectedCurrency() {

  const saved =
    localStorage.getItem(
      ONE_ERA_CURRENCY_KEY
    );

  if (
    saved &&
    ONE_ERA_CURRENCIES[saved]
  ) {
    return ONE_ERA_CURRENCIES[saved];
  }

  return ONE_ERA_CURRENCIES.THB;
}


function setCurrency(currencyCode) {

  if (
    !ONE_ERA_CURRENCIES[currencyCode]
  ) {
    return;
  }

  localStorage.setItem(
    ONE_ERA_CURRENCY_KEY,
    currencyCode
  );

  window.location.reload();

}


function convertTHB(amountTHB) {

  const currency =
    getSelectedCurrency();

  return (
    Number(amountTHB || 0) *
    currency.rate
  );

}


function formatONEERAPrice(amountTHB) {

  const currency =
    getSelectedCurrency();

  const converted =
    convertTHB(amountTHB);

  return new Intl.NumberFormat(
    currency.locale,
    {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits:
        currency.decimals,
      maximumFractionDigits:
        currency.decimals
    }
  ).format(converted);

}


/* =========================================================
   CURRENCY SELECTOR
   ========================================================= */

function createCurrencySelector() {

  const currency =
    getSelectedCurrency();

  const options =
    Object.values(
      ONE_ERA_CURRENCIES
    )
    .map(function(item) {

      return `
        <option
          value="${item.code}"
          ${item.code === currency.code ? "selected" : ""}
        >
          ${item.code}
        </option>
      `;

    })
    .join("");


  return `
    <select
      class="one-era-currency"
      aria-label="Select currency"
      onchange="setCurrency(this.value)"
    >
      ${options}
    </select>
  `;

}


function initializeCurrencySelector() {

  const existing =
    document.querySelector(
      ".one-era-currency"
    );

  if (existing) {
    return;
  }

  const navIcons =
    document.querySelector(
      ".nav-icons"
    );

  if (!navIcons) {
    return;
  }

  navIcons.insertAdjacentHTML(
    "afterbegin",
    createCurrencySelector()
  );

}


/* =========================================================
   ONE ERA — SITE DATA
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
   SITE INITIALIZATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    initializeCurrencySelector();

    updateCartCount();

    const productGrid =
      document.getElementById(
        "productGrid"
      );

    if (productGrid) {
      loadShopProducts();
    }

  }
);


/* =========================================================
   CART
   ========================================================= */

function updateCartCount() {

  const elements =
    document.querySelectorAll(
      "[data-cart-count]"
    );

  if (!elements.length) {
    return;
  }

  let cart = [];

  try {

    const storedCart =
      localStorage.getItem(
        "oneEraCart"
      );

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

  const count =
    cart.reduce(
      function(total, item) {

        const quantity =
          Number(item.quantity);

        return total +
          (
            quantity > 0
              ? quantity
              : 1
          );

      },
      0
    );


  elements.forEach(
    function(element) {

      element.textContent =
        count;

    }
  );

}


/* =========================================================
   CATEGORY
   ========================================================= */

function getCategoryFromURL() {

  const params =
    new URLSearchParams(
      window.location.search
    );

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
    await fetch(
      "products.json",
      {
        cache: "no-store"
      }
    );

  if (!response.ok) {

    throw new Error(
      "products.json could not be loaded. HTTP " +
      response.status
    );

  }

  const data =
    await response.json();


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
   LIVE PRODUCT FILTER
   ========================================================= */

function isLiveProduct(product) {

  if (!product) {
    return false;
  }

  return (
    product.available === true &&
    product.status === "active" &&
    product.testMode !== true
  );

}


/* =========================================================
   SHOP
   ========================================================= */

async function loadShopProducts() {

  const grid =
    document.getElementById(
      "productGrid"
    );

  const status =
    document.getElementById(
      "shopStatus"
    );


  if (!grid) {
    return;
  }


  try {

    grid.innerHTML = `
      <div class="empty-state">
        Loading ONE ERA objects...
      </div>
    `;


    let products =
      await loadProducts();


    /*
      LIVE CATALOGUE ONLY

      Products must be:
      available = true
      status = active
      testMode = false
    */

    products =
      products.filter(
        isLiveProduct
      );


    const category =
      getCategoryFromURL();


    if (category) {

      products =
        products.filter(
          function(product) {

            if (!product.category) {
              return false;
            }

            return (
              String(
                product.category
              )
              .toLowerCase()
              .trim()
              === category
            );

          }
        );

    }


    updateShopCategoryHeading(
      category
    );


    if (!products.length) {

      grid.innerHTML = `
        <div class="empty-state">
          No ONE ERA objects are currently
          available in this collection.
        </div>
      `;

      return;

    }


    grid.innerHTML =
      products
        .map(
          function(product) {

            return createProductCard(
              product
            );

          }
        )
        .join("");


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

          ${escapeHTML(
            error.message
          )}

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


  /* -------------------------------------------------------
     IMAGE
     ------------------------------------------------------- */

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


    if (
      typeof firstImage === "string"
    ) {

      imageURL =
        firstImage;

    } else if (
      firstImage &&
      firstImage.url
    ) {

      imageURL =
        firstImage.url;

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
          src="${escapeAttribute(
            imageURL
          )}"
          alt="${escapeAttribute(
            alt
          )}"
          loading="lazy"
        >
      `;

    }

  }


  /* -------------------------------------------------------
     PRICE
     ------------------------------------------------------- */

  const amountTHB =
    Number(
      product.price_thb ||
      (
        product.price &&
        product.price.amount
      ) ||
      0
    );


  const price =
    formatONEERAPrice(
      amountTHB
    );


  /* -------------------------------------------------------
     PRODUCT URL
     ------------------------------------------------------- */

  const productURL =
    "product.html?product=" +
    encodeURIComponent(
      slug
    );


  return `

    <article class="product-card">

      <a
        href="${productURL}"
        aria-label="View ${escapeAttribute(
          name
        )}"
      >

        <div class="product-image">

          ${imageHTML}

        </div>

      </a>


      <div class="product-info">

        <div class="product-eyebrow">

          ${escapeHTML(
            collection
          )}

        </div>


        <h2>
          ${escapeHTML(
            name
          )}
        </h2>


        <p>
          ${escapeHTML(
            description
          )}
        </p>


        <div class="product-price">

          ${escapeHTML(
            price
          )}

        </div>


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

function updateShopCategoryHeading(
  category
) {

  if (!category) {
    return;
  }


  const categoryData =
    ONE_ERA_CATEGORIES[
      category
    ];


  if (!categoryData) {
    return;
  }


  const intro =
    document.querySelector(
      ".shop-intro"
    );


  if (!intro) {
    return;
  }


  const eyebrow =
    intro.querySelector(
      ".eyebrow"
    );


  const heading =
    intro.querySelector(
      "h1"
    );


  const description =
    intro.querySelector(
      "p"
    );


  if (eyebrow) {

    eyebrow.textContent =
      "ONE ERA · " +
      categoryData.eyebrow;

  }


  if (heading) {

    heading.innerHTML =
      escapeHTML(
        categoryData.name
      )
      .replace(
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
   HTML SAFETY
   ========================================================= */

function escapeHTML(
  value
) {

  return String(
    value || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


function escapeAttribute(
  value
) {

  return escapeHTML(
    value
  );

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.ONE_ERA = {

  categories:
    ONE_ERA_CATEGORIES,

  currencies:
    ONE_ERA_CURRENCIES,

  getCategoryFromURL:
    getCategoryFromURL,

  getCurrentCategory:
    getCurrentCategory,

  getSelectedCurrency:
    getSelectedCurrency,

  convertTHB:
    convertTHB,

  formatONEERAPrice:
    formatONEERAPrice,

  loadProducts:
    loadProducts,

  updateCartCount:
    updateCartCount

};
