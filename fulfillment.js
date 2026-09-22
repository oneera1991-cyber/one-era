/* =====================================================
   ONE ERA
   PHASE 4.8.1
   PRODUCT MAPPING
   ORDER → FULFILLMENT → CJ
   TEST MODE
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
     ONE ERA → CJ PRODUCT MAPPING
     ===================================================== */

  const PRODUCT_MAPPING = {

    "one-era-green-fluorite": {

      oneEraProductId:
        "one-era-green-fluorite",

      slug:
        "green-fluorite",

      name:
        "Green Fluorite",

      cjPlatform:
        "CJdropshipping",

      cjSku:
        "CJZS237829401AZ",

      testMode:
        true,

      fulfillmentStatus:
        "NOT_SUBMITTED"

    }

  };


  /* =====================================================
     LEGACY TEST SKU MAPPING
     Allows existing test orders to continue working.
     ===================================================== */

  const LEGACY_SKU_MAPPING = {

    "ONEERA-TEST-001":
      "one-era-green-fluorite"

  };


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
     RESOLVE PRODUCT MAPPING
     ===================================================== */

  function resolveProductMapping(item) {

    if (!item) {

      return null;

    }


    /*
      1. Direct ONE ERA product ID
    */

    if (
      item.product_id &&
      PRODUCT_MAPPING[item.product_id]
    ) {

      return PRODUCT_MAPPING[
        item.product_id
      ];

    }


    /*
      2. Direct ONE ERA SKU
    */

    if (
      item.sku &&
      PRODUCT_MAPPING[item.sku]
    ) {

      return PRODUCT_MAPPING[
        item.sku
      ];

    }


    /*
      3. Legacy test SKU
    */

    if (
      item.sku &&
      LEGACY_SKU_MAPPING[item.sku]
    ) {

      const productId =
        LEGACY_SKU_MAPPING[
          item.sku
        ];


      return PRODUCT_MAPPING[
        productId
      ];

    }


    /*
      4. No mapping
    */

    return null;

  }


  /* =====================================================
     MAP ORDER ITEM
     ===================================================== */

  function mapOrderItem(item) {

    const mapping =
      resolveProductMapping(
        item
      );


    /*
      Product not mapped
    */

    if (!mapping) {

      return {

        product_id:
          item.product_id ||
          null,

        original_sku:
          item.sku ||
          null,

        cj_sku:
          null,

        quantity:
          item.quantity || 1,

        mapping_status:
          "UNMAPPED",

        test_mode:
          true

      };

    }


    /*
      Product successfully mapped
    */

    return {

      product_id:
        mapping.oneEraProductId,

      product_name:
        mapping.name,

      original_sku:
        item.sku ||
        mapping.oneEraProductId,

      cj_sku:
        mapping.cjSku,

      quantity:
        item.quantity || 1,

      mapping_status:
        "MAPPED",

      cj_platform:
        mapping.cjPlatform,

      test_mode:
        mapping.testMode

    };

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


    const originalItems =
      Array.isArray(order.items)
        ? order.items
        : [];


    /*
      Map every order item
    */

    const mappedItems =
      originalItems.map(
        mapOrderItem
      );


    /*
      Check mapping
    */

    const unmappedItems =
      mappedItems.filter(
        function (item) {

          return (
            item.mapping_status !==
            "MAPPED"
          );

        }
      );


    const fulfillmentStatus =
      unmappedItems.length > 0

        ? "MAPPING_REQUIRED"

        : "READY_FOR_FULFILLMENT";


    const fulfillment = {

      fulfillment_id:
        generateFulfillmentId(),

      order_id:
        order.order_id,

      created_at:
        new Date().toISOString(),

      status:
        fulfillmentStatus,

      test_mode:
        true,

      destination: {

        country:
          order.market,

        currency:
          order.currency

      },

      items:
        mappedItems,

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


    /*
      TEST SAFETY CHECK
    */

    if (
      fulfillment.test_mode !== true
    ) {

      throw new Error(
        "Live fulfillment is disabled. TEST MODE only."
      );

    }


    /*
      Do not create CJ payload
      when product mapping is incomplete.
    */

    const unmapped =
      fulfillment.items.filter(
        function (item) {

          return (
            item.mapping_status !==
            "MAPPED"
          );

        }
      );


    if (unmapped.length > 0) {

      throw new Error(
        "One or more products are not mapped to a CJ SKU."
      );

    }


    /*
      Create TEST CJ payload
    */

    const payload = {

      test_mode:
        true,

      platform:
        "ONE_ERA",

      fulfillment_status:
        "NOT_SUBMITTED",

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

              one_era_product_id:
                item.product_id,

              product_name:
                item.product_name,

              cj_sku:
                item.cj_sku,

              quantity:
                item.quantity,

              mapping_status:
                item.mapping_status

            };

          }

        ),

      shipping_method:
        fulfillment
          .shipping
          .method,

      /*
        Explicit safety marker.
      */

      submission:
        "TEST_ONLY",

      cj_order_id:
        null

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
     UPDATE FULFILLMENT STATUS
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
     GET PRODUCT MAPPING
     ===================================================== */

  function getProductMapping(
    productId
  ) {

    return (
      PRODUCT_MAPPING[
        productId
      ] || null
    );

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
      updateStatus,

    getProductMapping:
      getProductMapping

  };


  console.log(
    "ONE ERA Fulfillment: READY"
  );

  console.log(
    "ONE ERA Product Mapping: READY"
  );

  console.log(
    "Green Fluorite → CJZS237829401AZ"
  );


})();
