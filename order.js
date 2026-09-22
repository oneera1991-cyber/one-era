/* ONE ERA — Phase 4.4
   Order + Fulfillment Foundation

   IMPORTANT:
   This is a local/demo order architecture.
   It does NOT process real payments.
   It does NOT send orders to CJ.
*/


(function () {

  // -----------------------------------------
  // Configuration
  // -----------------------------------------

  const CONFIG_FILE = "orders.json";

  const ORDER_KEY = "oneera_demo_orders";

  let config = null;


  // -----------------------------------------
  // Load orders.json
  // -----------------------------------------

  async function loadOrderConfig() {

    try {

      const response =
        await fetch(CONFIG_FILE);

      if (!response.ok) {

        throw new Error(
          "orders.json not found"
        );

      }

      config =
        await response.json();

      return config;

    } catch (error) {

      console.error(
        "ONE ERA Orders:",
        error
      );

      return null;

    }

  }


  // -----------------------------------------
  // Get selected market
  // -----------------------------------------

  function getMarket() {

    return (
      localStorage.getItem(
        "oneera_country"
      ) || "TH"
    );

  }


  // -----------------------------------------
  // Get currency
  // -----------------------------------------

  function getCurrency() {

    const market =
      getMarket();


    /*
      If commerce.js already provides
      country information, use it.
    */

    const commerce =
      window.ONEERA_COMMERCE;


    if (
      commerce &&
      commerce.getCountryByCode
    ) {

      const country =
        commerce.getCountryByCode(
          market
        );


      if (
        country &&
        country.currency
      ) {

        return country.currency;

      }

    }


    /*
      Fallback currencies
    */

    const currencies = {

      TH: "THB",

      GB: "GBP",

      US: "USD",

      AU: "AUD",

      ID: "IDR",

      SG: "SGD",

      HK: "HKD"

    };


    return (
      currencies[market] || "THB"
    );

  }


  // -----------------------------------------
  // Generate ONE ERA Order ID
  // -----------------------------------------

  function generateOrderId() {

    const date =
      new Date();


    const datePart =
      date
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");


    const randomPart =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();


    return (
      "OE-" +
      datePart +
      "-" +
      randomPart
    );

  }


  // -----------------------------------------
  // Create Order
  // -----------------------------------------

  function createDemoOrder(data) {

    data =
      data || {};


    const order = {

      order_id:
        generateOrderId(),


      created_at:
        new Date().toISOString(),


      market:
        getMarket(),


      currency:
        getCurrency(),


      customer:
        data.customer || {},


      shipping_address:
        data.shipping_address || {},


      items:
        data.items || [],


      subtotal:
        Number(
          data.subtotal || 0
        ),


      shipping:
        Number(
          data.shipping || 0
        ),


      taxes:
        Number(
          data.taxes || 0
        ),


      duties:
        Number(
          data.duties || 0
        ),


      total:
        Number(
          data.total || 0
        ),


      payment_status:
        data.payment_status ||
        "paid",


      fulfillment_status:
        data.fulfillment_status ||
        "pending",


      tracking_number:
        data.tracking_number ||
        null

    };


    // -------------------------------------
    // Get existing orders
    // -------------------------------------

    const existingOrders =
      JSON.parse(

        localStorage.getItem(
          ORDER_KEY
        ) || "[]"

      );


    // -------------------------------------
    // Add new order
    // -------------------------------------

    existingOrders.push(
      order
    );


    // -------------------------------------
    // Save
    // -------------------------------------

    localStorage.setItem(

      ORDER_KEY,

      JSON.stringify(
        existingOrders
      )

    );


    return order;

  }


  // -----------------------------------------
  // Get ALL Orders
  // -----------------------------------------

  function getOrders() {

    try {

      return JSON.parse(

        localStorage.getItem(
          ORDER_KEY
        ) || "[]"

      );

    } catch (error) {

      console.error(
        "ONE ERA Orders:",
        error
      );

      return [];

    }

  }


  // -----------------------------------------
  // Get Latest Order
  // -----------------------------------------

  function getLatestOrder() {

    const orders =
      getOrders();


    if (
      orders.length === 0
    ) {

      return null;

    }


    return (
      orders[
        orders.length - 1
      ]
    );

  }


  // -----------------------------------------
  // Find Order
  // -----------------------------------------

  function getOrderById(
    orderId
  ) {

    const orders =
      getOrders();


    return orders.find(

      function (order) {

        return (
          order.order_id ===
          orderId
        );

      }

    ) || null;

  }


  // -----------------------------------------
  // Update Order Status
  // -----------------------------------------

  function updateOrderStatus(
    orderId,
    status,
    trackingNumber
  ) {

    const orders =
      getOrders();


    const order =
      orders.find(

        function (item) {

          return (
            item.order_id ===
            orderId
          );

        }

      );


    if (!order) {

      return false;

    }


    order.fulfillment_status =
      status;


    if (
      trackingNumber
    ) {

      order.tracking_number =
        trackingNumber;

    }


    localStorage.setItem(

      ORDER_KEY,

      JSON.stringify(
        orders
      )

    );


    return true;

  }


  // -----------------------------------------
  // Delete Demo Orders
  // -----------------------------------------

  function clearDemoOrders() {

    localStorage.removeItem(
      ORDER_KEY
    );

  }


  // -----------------------------------------
  // Public ONE ERA API
  // -----------------------------------------

  window.ONEERA_ORDERS = {

    loadOrderConfig:

      loadOrderConfig,


    createDemoOrder:

      createDemoOrder,


    getOrders:

      getOrders,


    getLatestOrder:

      getLatestOrder,


    getOrderById:

      getOrderById,


    updateOrderStatus:

      updateOrderStatus,


    clearDemoOrders:

      clearDemoOrders,


    generateOrderId:

      generateOrderId,


    get config() {

      return config;

    }

  };


  // -----------------------------------------
  // Initialize
  // -----------------------------------------

  document.addEventListener(

    "DOMContentLoaded",

    async function () {

      await loadOrderConfig();

    }

  );


})();
