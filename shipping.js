/* ONE ERA — Phase 4.2 Shipping Architecture
   Foundation only. No fake/live shipping rates are generated.
*/
(function () {
  const SHIPPING_CONFIG = "shipping.json";
  let config = null;

  async function loadShippingConfig() {
    try {
      const response = await fetch(SHIPPING_CONFIG);
      if (!response.ok) throw new Error("shipping.json not found");
      config = await response.json();
      return config;
    } catch (error) {
      console.error("ONE ERA Shipping:", error);
      return null;
    }
  }

  function getSelectedCountry() {
    if (window.ONEERA_COMMERCE?.getCountry) {
      return window.ONEERA_COMMERCE.getCountry();
    }
    return localStorage.getItem("oneera_country") || "TH";
  }

  function render() {
    if (!config) return;

    const country = getSelectedCountry();

    const countryCode = document.querySelector("[data-shipping-country]");
    if (countryCode) countryCode.textContent = country;

    const provider = document.querySelector("[data-fulfillment-provider]");
    if (provider) provider.textContent = config.fulfillment.provider;

    const status = document.querySelector("[data-shipping-status]");
    if (status) {
      status.textContent =
        "Shipping rate will be calculated at checkout.";
    }

    document.querySelectorAll("[data-shipping-service]")
      .forEach((select) => {
        select.innerHTML = "";

        config.services.forEach((service) => {
          const option = document.createElement("option");
          option.value = service.id;
          option.textContent = service.name;
          select.appendChild(option);
        });
      });
  }

  window.ONEERA_SHIPPING = {
    loadShippingConfig,
    get config() {
      return config;
    }
  };

  document.addEventListener("DOMContentLoaded", async () => {
    await loadShippingConfig();
    render();

    document.addEventListener("oneera:countrychange", render);
  });
})();
