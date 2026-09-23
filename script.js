/* =========================================================
   ONE ERA — SITE DATA
   Central configuration for product categories
   ========================================================= */

const ONE_ERA_CATEGORIES = {
  smoke: {
    name: "Smoke & Sacred Botanicals",
    eyebrow: "01 · SMOKE",
    description: "Incense, sacred botanicals, resins and objects of smoke ritual.",
    keywords: [
      "incense",
      "incense stick",
      "sage",
      "agarwood",
      "palo santo"
    ],
    url: "shop.html?category=smoke"
  },

  crystals: {
    name: "Crystals & Earth",
    eyebrow: "02 · EARTH",
    description: "Crystals, minerals, stones and objects connected to the earth.",
    keywords: [
      "crystal",
      "quartz",
      "amethyst",
      "obsidian"
    ],
    url: "shop.html?category=crystals"
  },

  divination: {
    name: "Divination",
    eyebrow: "03 · DIVINATION",
    description: "Tarot, oracle, pendulums, runes and tools for symbolic inquiry.",
    keywords: [
      "tarot",
      "oracle",
      "pendulum",
      "rune"
    ],
    url: "shop.html?category=divination"
  },

  ritual: {
    name: "Ritual & Altar",
    eyebrow: "04 · RITUAL",
    description: "Objects for sacred space, ritual practice and intentional living.",
    keywords: [
      "incense burner",
      "altar",
      "ritual",
      "candle holder",
      "offering bowl"
    ],
    url: "shop.html?category=ritual"
  }
};


/* =========================================================
   ONE ERA — BASIC SITE FUNCTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  // Update cart count if available
  updateCartCount();

});


/* =========================================================
   CART
   ========================================================= */

function updateCartCount() {
  const cartCountElements =
    document.querySelectorAll("[data-cart-count]");

  if (!cartCountElements.length) return;

  let cart = [];

  try {
    cart = JSON.parse(localStorage.getItem("oneEraCart")) || [];
  } catch (error) {
    cart = [];
  }

  const count = cart.reduce((total, item) => {
    return total + (Number(item.quantity) || 1);
  }, 0);

  cartCountElements.forEach(element => {
    element.textContent = count;
  });
}


/* =========================================================
   CATEGORY HELPER
   ========================================================= */

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}


function getCurrentCategory() {
  const categoryKey = getCategoryFromURL();

  if (!categoryKey) return null;

  return ONE_ERA_CATEGORIES[categoryKey] || null;
}
