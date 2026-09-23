/* =========================================================
   ONE ERA — SITE ENGINE
   Categories + Cart + CJ Product API + Shop Filtering
   ========================================================= */


/* =========================================================
   ONE ERA — CONFIG
   ========================================================= */

const ONE_ERA_CONFIG = {

  API_BASE:
    "https://one-era-api.oneera1991.workers.dev/products",

  MAX_PAGES_PER_KEYWORD: 8,

  PAGE_SIZE: 20,

  CATEGORIES: {

    smoke: {
      name: "Smoke & Sacred Botanicals",
      eyebrow: "01 · SMOKE",

      description:
        "Incense, sacred botanicals, resins and objects of smoke ritual.",

      keywords: [
        "incense",
        "incense stick",
        "agarwood incense",
        "oud incense",
        "sandalwood incense",
        "sage incense",
        "palo santo",
        "resin incense"
      ],

      positiveTerms: [
        "incense",
        "agarwood",
        "oud",
        "sandalwood",
        "palo santo",
        "sage",
        "resin",
        "frankincense",
        "myrrh",
        "bakhoor"
      ],

      negativeTerms: [
        "chair",
        "sofa",
        "recliner",
        "bookshelf",
        "shelf",
        "table",
        "cabinet",
        "furniture",
        "clothing",
        "dress",
        "shoes",
        "toy",
        "phone case"
      ],

      url:
        "shop.html?category=smoke"
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
        "obsidian",
        "fluorite",
        "citrine",
        "rose quartz",
        "moonstone"
      ],

      positiveTerms: [
        "crystal",
        "quartz",
        "amethyst",
        "obsidian",
        "fluorite",
        "citrine",
        "moonstone",
        "tourmaline",
        "agate",
        "jasper",
        "selenite",
        "calcite",
        "stone",
        "mineral"
      ],

      negativeTerms: [
        "chair",
        "sofa",
        "recliner",
        "bookshelf",
        "shelf",
        "table",
        "cabinet",
        "clothing",
        "dress",
        "shoes",
        "toy",
        "phone case"
      ],

      url:
        "shop.html?category=crystals"
    },


    divination: {
      name: "Divination",
      eyebrow: "03 · DIVINATION",

      description:
        "Tarot, oracle, pendulums, runes and tools for symbolic inquiry.",

      keywords: [
        "tarot",
        "oracle cards",
        "oracle",
        "pendulum",
        "rune",
        "divination"
      ],

      positiveTerms: [
        "tarot",
        "oracle",
        "pendulum",
        "rune",
        "divination",
        "fortune telling",
        "spiritual cards",
        "tarot deck"
      ],

      negativeTerms: [
        "chair",
        "sofa",
        "recliner",
        "bookshelf",
        "shelf",
        "table",
        "cabinet",
        "clothing",
        "dress",
        "shoes",
        "toy",
        "phone case"
      ],

      url:
        "shop.html?category=divination"
    },


    ritual: {
      name: "Ritual & Altar",
      eyebrow: "04 · RITUAL",

      description:
        "Objects for sacred space, ritual practice and intentional living.",

      keywords: [
        "incense burner",
        "incense holder",
        "altar",
        "ritual",
        "candle holder",
        "offering bowl",
        "ritual tools"
      ],

      positiveTerms: [
        "incense burner",
        "incense holder",
        "altar",
        "ritual",
        "candle holder",
        "offering bowl",
        "offering",
        "altar tool",
        "ritual tool",
        "ceremonial"
      ],

      negativeTerms: [
        "chair",
        "sofa",
        "recliner",
        "bookshelf",
        "shelf",
        "table",
        "cabinet",
        "clothing",
        "dress",
        "shoes",
        "toy",
        "phone case"
      ],

      url:
        "shop.html?category=ritual"
    }

  }

};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  updateCartCount();

  initializeShop();

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

    cart =
      JSON.parse(
        localStorage.getItem("oneEraCart")
      ) || [];

  } catch (error) {

    cart = [];

  }

  const count =
    cart.reduce(
      (total, item) => {

        return total +
          (Number(item.quantity) || 1);

      },
      0
    );

  elements.forEach(element => {

    element.textContent = count;

  });

}


/* =========================================================
   CATEGORY HELPERS
   ========================================================= */

function getCategoryFromURL() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("category");

}


function getCurrentCategory() {

  const key =
    getCategoryFromURL();

  if (!key) return null;

  return (
    ONE_ERA_CONFIG.CATEGORIES[key]
    || null
  );

}


/* =========================================================
   SHOP INITIALIZATION
   ========================================================= */

async function initializeShop() {

  const grid =
    document.getElementById(
      "productGrid"
    );

  if (!grid) {

    return;

  }

  const status =
    document.getElementById(
      "shopStatus"
    );

  const category =
    getCurrentCategory();


  updateShopHeader(category);


  if (status) {

    status.innerHTML = `
      <div class="test-banner">
        <strong>LOADING ONE ERA</strong>
        Searching the current product catalogue...
      </div>
    `;

  }


  try {

    let products;


    if (category) {

      products =
        await loadCategoryProducts(
          category
        );

    } else {

      products =
        await loadShopAll();

    }


    renderProducts(
      products,
      grid,
      category
    );


    if (status) {

      status.innerHTML = "";

    }


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

          Please try again.

        </div>

      `;

    }

  }

}


/* =========================================================
   SHOP HEADER
   ========================================================= */

function updateShopHeader(category) {

  const eyebrow =
    document.querySelector(
      ".shop-intro .eyebrow"
    );

  const heading =
    document.querySelector(
      ".shop-intro h1"
    );

  const description =
    document.querySelector(
      ".shop-intro p"
    );


  if (!category) {

    return;

  }


  if (eyebrow) {

    eyebrow.textContent =
      "ONE ERA · " +
      category.eyebrow
        .split("·")[1]
        .trim();

  }


  if (heading) {

    heading.innerHTML =
      escapeHTML(category.name)
        .replace(
          " & ",
          " &<br>"
        );

  }


  if (description) {

    description.textContent =
      category.description;

  }

}


/* =========================================================
   LOAD CATEGORY PRODUCTS
   ========================================================= */

async function loadCategoryProducts(category) {

  const productMap =
    new Map();


  for (
    const keyword of category.keywords
  ) {

    const products =
      await searchAllPages(
        keyword
      );


    products.forEach(
      product => {

        if (!product) return;


        const id =
          getProductUniqueId(
            product
          );


        if (!id) return;


        if (
          isRelevantProduct(
            product,
            category
          )
        ) {

          productMap.set(
            id,
            product
          );

        }

      }
    );

  }


  return Array.from(
    productMap.values()
  );

}


/* =========================================================
   LOAD SHOP ALL
   ========================================================= */

async function loadShopAll() {

  /*
    Shop All currently uses a broad spiritual
    product search instead of requesting the
    entire CJ catalogue.

    This keeps the first version manageable
    and prevents thousands of unrelated products.
  */

  const keywords = [

    "incense",

    "crystal",

    "tarot",

    "oracle",

    "pendulum",

    "ritual",

    "altar"

  ];


  const productMap =
    new Map();


  for (
    const keyword of keywords
  ) {

    const products =
      await searchAllPages(
        keyword
      );


    products.forEach(
      product => {

        if (!product) return;


        const id =
          getProductUniqueId(
            product
          );


        if (!id) return;


        productMap.set(
          id,
          product
        );

      }
    );

  }


  return Array.from(
    productMap.values()
  );

}


/* =========================================================
   SEARCH API — ALL PAGES
   ========================================================= */

async function searchAllPages(keyword) {

  const results = [];


  for (
    let page = 1;
    page <=
      ONE_ERA_CONFIG.MAX_PAGES_PER_KEYWORD;
    page++
  ) {

    const url =
      ONE_ERA_CONFIG.API_BASE +
      "?keyword=" +
      encodeURIComponent(
        keyword
      ) +
      "&page=" +
      page +
      "&size=" +
      ONE_ERA_CONFIG.PAGE_SIZE;


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "API request failed: HTTP " +
        response.status
      );

    }


    const data =
      await response.json();


    const products =
      extractProducts(
        data
      );


    results.push(
      ...products
    );


    const pageNumber =
      Number(
        data?.data?.pageNumber ??
        data?.pageNumber ??
        page
      );


    const totalPages =
      Number(
        data?.data?.totalPages ??
        data?.totalPages ??
        page
      );


    if (
      pageNumber >= totalPages
    ) {

      break;

    }


    if (
      products.length === 0
    ) {

      break;

    }

  }


  return results;

}


/* =========================================================
   EXTRACT PRODUCTS FROM API RESPONSE
   ========================================================= */

function extractProducts(data) {

  if (
    Array.isArray(data)
  ) {

    return data;

  }


  if (
    Array.isArray(
      data?.data
    )
  ) {

    return data.data;

  }


  if (
    Array.isArray(
      data?.data?.list
    )
  ) {

    return data.data.list;

  }


  if (
    Array.isArray(
      data?.data?.content
    )
  ) {

    return data.data.content;

  }


  if (
    Array.isArray(
      data?.list
    )
  ) {

    return data.list;

  }


  return [];

}


/* =========================================================
   PRODUCT ID
   ========================================================= */

function getProductUniqueId(product) {

  return (
    product.id ||
    product.pid ||
    product.productId ||
    product.product_id ||
    product.sku ||
    product.slug ||
    product.name
  );

}


/* =========================================================
   PRODUCT TEXT
   ========================================================= */

function getProductSearchText(product) {

  const values = [

    product.name,

    product.productName,

    product.title,

    product.description,

    product.shortDescription,

    product.categoryName,

    product.category,

    product.collection

  ];


  return values

    .filter(Boolean)

    .join(" ")

    .toLowerCase();

}


/* =========================================================
   RELEVANCE FILTER
   ========================================================= */

function isRelevantProduct(
  product,
  category
) {

  const text =
    getProductSearchText(
      product
    );


  if (!text) {

    return false;

  }


  /*
    Remove obvious unrelated products.
  */

  const hasNegative =
    category.negativeTerms.some(
      term =>
        text.includes(
          term.toLowerCase()
        )
    );


  if (hasNegative) {

    return false;

  }


  /*
    Product must contain at least
    one meaningful spiritual term.
  */

  const hasPositive =
    category.positiveTerms.some(
      term =>
        text.includes(
          term.toLowerCase()
        )
    );


  return hasPositive;

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(
  products,
  grid,
  category
) {

  if (
    !products ||
    products.length === 0
  ) {

    grid.innerHTML = `

      <div class="empty-state">

        ${
          category
            ? `
              No products currently match
              this ONE ERA category.
            `
            : `
              No products are currently
              available in the ONE ERA catalogue.
            `
        }

      </div>

    `;

    return;

  }


  grid.innerHTML =
    products
      .map(
        product =>
          createProductCard(
            product,
            category
          )
      )
      .join("");

}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(
  product,
  category
) {

  const id =
    getProductUniqueId(
      product
    );


  const slug =
    product.slug ||
    product.id ||
    product.productId ||
    id;


  const name =
    product.name ||
    product.productName ||
    product.title ||
    "ONE ERA Object";


  const description =
    product.shortDescription ||
    product.description ||
    "A selected object for spiritual practice.";


  const imageURL =
    getProductImage(
      product
    );


  const price =
    getProductPrice(
      product
    );


  const collection =
    category
      ? category.eyebrow
      : (
          product.collection ||
          "ONE ERA · OBJECT"
        );


  const imageHTML =
    imageURL

      ? `
        <img
          src="${escapeAttribute(
            imageURL
          )}"
          alt="${escapeAttribute(
            name
          )}"
          loading="lazy"
        >
      `

      : `
        <div class="product-placeholder">
          ONE ERA
        </div>
      `;


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


        <div class="product-status">

          ONE ERA · TEST CATALOGUE

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
   PRODUCT IMAGE
   ========================================================= */

function getProductImage(product) {

  if (
    Array.isArray(
      product.images
    )
  ) {

    for (
      const image of product.images
    ) {

      if (
        typeof image === "string" &&
        image.startsWith("http")
      ) {

        return image;

      }


      if (
        image &&
        typeof image.url === "string" &&
        image.url.startsWith("http")
      ) {

        return image.url;

      }

    }

  }


  const imageFields = [

    product.image,

    product.imageUrl,

    product.productImage,

    product.mainImage,

    product.img

  ];


  return (
    imageFields.find(
      value =>
        typeof value === "string" &&
        value.startsWith("http")
    ) || null
  );

}


/* =========================================================
   PRODUCT PRICE
   ========================================================= */

function getProductPrice(product) {

  if (
    product.price &&
    typeof product.price === "object"
  ) {

    if (
      product.price.display
    ) {

      return String(
        product.price.display
      );

    }


    if (
      product.price.amount
    ) {

      return String(
        product.price.amount
      );

    }

  }


  if (
    product.price !== undefined &&
    product.price !== null
  ) {

    return String(
      product.price
    );

  }


  if (
    product.salePrice
  ) {

    return String(
      product.salePrice
    );

  }


  return "TEST PRICE";

}


/* =========================================================
   SECURITY HELPERS
   ========================================================= */

function escapeHTML(value) {

  return String(value ?? "")

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


function escapeAttribute(value) {

  return escapeHTML(
    value
  );

}
