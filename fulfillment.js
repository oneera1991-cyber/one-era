/* =====================================================
   ONE ERA
   PHASE 4.5
   ORDER → FULFILLMENT → CJ
   TEST / ARCHITECTURE VERSION
   ===================================================== */

(function () {

  "use strict";


  /* =====================================================
     STORAGE
     ===================================================== */

  const ORDER_KEY =
    "oneera_test_order";

  const FULFILLMENT_KEY =
    "oneera_fulfillment";


  /* =====================================================
     GET ORDER
     ===================================================== */

  function getOrder() {

    try {

      const data =
        localStorage.getItem(
          ORDER_KEY
        );

      if (!data) {

        return null;

      }

      return JSON.parse(data);

    }

    catch (error) {

      console.error(
        "ONE ERA: Cannot read order",
        error
      );

      return null;

    }

  }


  /* =====================================================
     GENERATE FULFILLMENT ID
     ===================================================== */

  function generateFulfillmentId() {

    const date =
      new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");


    const random =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();


    return (
      "FUL-" +
      date +
      "-" +
      random
    );

  }


  /* =====================================================
     CREATE FULFILLMENT
     ===================================================== */

  function createFulfillment(order) {

    if (!order) {

      throw new Error(
        "No ONE ERA order found."
      );

    }


    const fulfillment = {

      fulfillment_id:
        generateFulfillmentId(),

      order_id:
        order.order_id,

      created_at:
        new Date().toISOString(),

      status:
        "READY_FOR_FULFILLMENT",

      destination: {

        country:
          order.market,

        currency:
          order.currency

      },

      items:
        order.items || [],

      shipping: {

        method:
          "STANDARD",

        tracking_number:
          null

      },

      cj: {

        status:
          "NOT_SUBMITTED",

        cj_order_id:
          null

      }

    };


    localStorage.setItem(

      FULFILLMENT_KEY,

      JSON.stringify(
        fulfillment
      )

    );


    return fulfillment;

  }


  /* =====================================================
     CREATE CJ PAYLOAD
     ===================================================== */

  function createCJPayload(
    fulfillment
  ) {

    if (!fulfillment) {

      throw new Error(
        "No fulfillment record found."
      );

    }


    const payload = {

      platform:
        "ONE_ERA",

      external_order_id:
        fulfillment.order_id,

      fulfillment_id:
        fulfillment.fulfillment_id,

      shipping_country:
        fulfillment
          .destination
          .country,

      currency:
        fulfillment
          .destination
          .currency,

      items:
        fulfillment.items.map(

          function (item) {

            return {

              sku:
                item.sku ||
                item.product_id ||
                "SKU-UNKNOWN",

              quantity:
                item.quantity || 1

            };

          }

        ),

      shipping_method:
        fulfillment
          .shipping
          .method

    };


    return payload;

  }


  /* =====================================================
     GET FULFILLMENT
     ===================================================== */

  function getFulfillment() {

    try {

      const data =
        localStorage.getItem(
          FULFILLMENT_KEY
        );


      if (!data) {

        return null;

      }


      return JSON.parse(
        data
      );

    }

    catch (error) {

      console.error(
        "ONE ERA: Cannot read fulfillment",
        error
      );

      return null;

    }

  }


  /* =====================================================
     UPDATE FULFILLMENT
     ===================================================== */

  function updateStatus(
    status
  ) {

    const fulfillment =
      getFulfillment();


    if (!fulfillment) {

      return false;

    }


    fulfillment.status =
      status;


    localStorage.setItem(

      FULFILLMENT_KEY,

      JSON.stringify(
        fulfillment
      )

    );


    return true;

  }


  /* =====================================================
     PUBLIC API
     ===================================================== */

  window.ONEERA_FULFILLMENT = {

    getOrder:
      getOrder,

    createFulfillment:
      createFulfillment,

    createCJPayload:
      createCJPayload,

    getFulfillment:
      getFulfillment,

    updateStatus:
      updateStatus

  };


  console.log(
    "ONE ERA Fulfillment: READY"
  );


})();
