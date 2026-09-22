(function () {

  "use strict";

  const ORDER_KEY = "oneera_test_order";

  function getOrder() {

    try {

      const raw = localStorage.getItem(ORDER_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);

    } catch (error) {

      console.error(
        "ONE ERA CJ Adapter: Cannot read order",
        error
      );

      return null;

    }

  }


  function generateOrderNumber(order) {

    if (order && order.order_id) {
      return order.order_id;
    }

    return "OE-TEST-" + Date.now();

  }


  function mapMarket(order) {

    if (!order) {
      return "TH";
    }

    return (
      order.market ||
      order.country ||
      "TH"
    ).toUpperCase();

  }


  function mapCurrency(order) {

    if (!order) {
      return "THB";
    }

    return (
      order.currency ||
      "THB"
    ).toUpperCase();

  }


  function mapProducts(order) {

    if (
      !order ||
      !Array.isArray(order.items)
    ) {

      return [];

    }


    return order.items.map(function (item) {

      return {

        productId:
          item.product_id ||
          item.id ||
          "",

        name:
          item.name ||
          "ONE ERA Product",

        quantity:
          Number(item.quantity) || 1,

        price:
          Number(item.price) || 0

      };

    });

  }


  function createCJPayload(order) {

    if (!order) {

      throw new Error(
        "No ONE ERA test order found."
      );

    }


    return {

      testMode: true,

      source: "ONE ERA",

      orderNumber:
        generateOrderNumber(order),

      market:
        mapMarket(order),

      currency:
        mapCurrency(order),

      customer: {

        name:
          order.customer_name ||
          "ONE ERA Test Customer",

        email:
          order.customer_email ||
          "test@example.com"

      },

      products:
        mapProducts(order),

      totals: {

        subtotal:
          Number(
            order.subtotal
          ) || 0,

        shipping:
          Number(
            order.shipping
          ) || 0,

        total:
          Number(
            order.total
          ) || 0

      },

      shipping: {

        country:
          mapMarket(order),

        address:
          order.shipping_address ||
          null

      },

      fulfillment: {

        status:
          order.fulfillment_status ||
          "pending"

      }

    };

  }


  function generateTestPayload() {

    const order = getOrder();

    return createCJPayload(order);

  }


  window.ONEERA_CJ = {

    getOrder:
      getOrder,

    createCJPayload:
      createCJPayload,

    generateTestPayload:
      generateTestPayload

  };


  console.log(
    "ONE ERA CJ Adapter: READY"
  );


})();
