/* =====================================================
   ONE ERA — PHASE 4.4
   ORDER ENGINE
   Standalone Demo Version
   ===================================================== */

(function () {

  "use strict";


  /* -----------------------------------------------------
     CONFIG
     ----------------------------------------------------- */

  const ORDER_STORAGE_KEY =
    "oneera_demo_orders";


  /* -----------------------------------------------------
     MARKET / CURRENCY
     ----------------------------------------------------- */

  const currencies = {

    TH: "THB",
    GB: "GBP",
    US: "USD",
    AU: "AUD",
    ID: "IDR",
    SG: "SGD",
    HK: "HKD"

  };


  /* -----------------------------------------------------
     GET MARKET
     ----------------------------------------------------- */

  function getMarket() {

    return (
      localStorage.getItem(
        "oneera_country"
      ) || "TH"
    );

  }


  /* -----------------------------------------------------
     GET CURRENCY
     ----------------------------------------------------- */

  function getCurrency() {

    const market =
      getMarket();

    return (
      currencies[market] || "THB"
    );

  }


  /* -----------------------------------------------------
     GENERATE ORDER ID
     ----------------------------------------------------- */

  function generateOrderId() {

    const now =
      new Date();

    const date =
      now
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");


    const random =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();


    return (
      "OE-" +
      date +
      "-" +
      random
    );

  }


  /* -----------------------------------------------------
     GET ORDERS
     ----------------------------------------------------- */

  function getOrders() {

    try {

      const stored =
        localStorage.getItem(
          ORDER_STORAGE_KEY
        );


      if (!stored) {

        return [];

      }


      return JSON.parse(
        stored
      );

    } catch (error) {

      console.error(
        "ONE ERA: Could not read orders.",
        error
      );

      return [];

    }

  }


  /* -----------------------------------------------------
     SAVE ORDERS
     ----------------------------------------------------- */

  function saveOrders(
    orders
  ) {

    localStorage.setItem(

      ORDER_STORAGE_KEY,

      JSON.stringify(
        orders
      )

    );

  }


  /* -----------------------------------------------------
     CREATE TEST ORDER
     ----------------------------------------------------- */

  function createTestOrder() {

    const order = {

      order_id:
        generateOrderId(),

      created_at:
        new Date().toISOString(),

      market:
        getMarket(),

      currency:
        getCurrency(),

      customer: {

        name:
          "ONE ERA Test Customer",

        email:
          "test@example.com"

      },

      shipping_address: {

        country:
          getMarket()

      },

      items: [

        {

          product_id:
            "TEST-001",

          quantity:
            1

        }

      ],

      subtotal:
        100,

      shipping:
        20,

      taxes:
        0,

      duties:
        0,

      total:
        120,

      payment_status:
        "paid",

      fulfillment_status:
        "pending",

      tracking_number:
        null

    };


    const orders =
      getOrders();


    orders.push(
      order
    );


    saveOrders(
      orders
    );


    return order;

  }


  /* -----------------------------------------------------
     FIND ORDER
     ----------------------------------------------------- */

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


  /* -----------------------------------------------------
     UPDATE ORDER
     ----------------------------------------------------- */

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


    saveOrders(
      orders
    );


    return true;

  }


  /* -----------------------------------------------------
     CLEAR TEST ORDERS
     ----------------------------------------------------- */

  function clearOrders() {

    localStorage.removeItem(
      ORDER_STORAGE_KEY
    );

  }


  /* -----------------------------------------------------
     PUBLIC API
     ----------------------------------------------------- */

  window.ONEERA_ORDERS = {

    getMarket:
      getMarket,

    getCurrency:
      getCurrency,

    generateOrderId:
      generateOrderId,

    getOrders:
      getOrders,

    createTestOrder:
      createTestOrder,

    getOrderById:
      getOrderById,

    updateOrderStatus:
      updateOrderStatus,

    clearOrders:
      clearOrders

  };


  /* -----------------------------------------------------
     CONFIRM SCRIPT LOADED
     ----------------------------------------------------- */

  console.log(
    "ONE ERA Orders: READY"
  );


})();
