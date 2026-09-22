/* ONE ERA — Phase 4.3 Payment / Checkout Foundation
   No live payment is processed by this file.
*/

(function () {

  const CONFIG_FILE = "payment.json";
  let config = null;


  // -----------------------------------------
  // Get selected market
  // -----------------------------------------

  function getMarket() {

    return localStorage.getItem("oneera_country") || "TH";

  }


  // -----------------------------------------
  // Load payment configuration
  // -----------------------------------------

  async function loadPaymentConfig() {

    try {

      const response = await fetch(CONFIG_FILE);

      if (!response.ok) {
        throw new Error("payment.json not found");
      }

      config = await response.json();

      return config;

    } catch (error) {

      console.error("ONE ERA Payment:", error);

      return null;

    }

  }


  // -----------------------------------------
  // Convert internal payment name
  // into customer-facing text
  // -----------------------------------------

  function humanize(method) {

    const names = {

      card: "Card",

      wallet: "Digital wallet",

      local_method: "Local payment method"

    };

    return names[method] || method;

  }


  // -----------------------------------------
  // Render payment methods
  // -----------------------------------------

  function render() {

    if (!config) return;


    const market = getMarket();

    const marketConfig =
      config.markets[market] || config.markets.TH;


    const marketElement =
      document.querySelector("[data-checkout-market]");


    const currencyElement =
      document.querySelector("[data-checkout-currency]");


    const methodsElement =
      document.querySelector("[data-payment-methods]");


    // Market

    if (marketElement) {

      marketElement.textContent = market;

    }


    // Currency

    if (currencyElement) {

      currencyElement.textContent =
        marketConfig.currency;

    }


    // Payment methods

    if (methodsElement) {

      methodsElement.innerHTML = "";


      marketConfig.methods.forEach(
        function (method, index) {

          const label =
            document.createElement("label");

          label.className =
            "payment-option";


          const input =
            document.createElement("input");

          input.type = "radio";

          input.name =
            "payment_method";

          input.value =
            method;

          input.checked =
            index === 0;


          const span =
            document.createElement("span");

          span.textContent =
            humanize(method);


          label.appendChild(input);

          label.appendChild(span);

          methodsElement.appendChild(label);

        }
      );

    }

  }


  // -----------------------------------------
  // Public ONE ERA payment object
  // -----------------------------------------

  window.ONEERA_PAYMENT = {

    loadPaymentConfig: loadPaymentConfig,

    get config() {

      return config;

    },

    refresh: render

  };


  // -----------------------------------------
  // Start
  // -----------------------------------------

  document.addEventListener(
    "DOMContentLoaded",
    async function () {

      const loaded =
        await loadPaymentConfig();


      if (loaded) {

        render();

      } else {

        const status =
          document.querySelector(
            "[data-payment-status]"
          );


        if (status) {

          status.textContent =
            "Payment configuration could not be loaded.";

        }

      }

    }
  );


  // -----------------------------------------
  // Refresh if market changes
  // -----------------------------------------

  window.addEventListener(
    "storage",
    function () {

      render();

    }
  );

})();
