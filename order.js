/* =====================================================
   ONE ERA
   PHASE 4.6
   ORDER CONTROL CENTER
   TEST MODE
   ===================================================== */

(function () {

  "use strict";


  /* =====================================================
     STORAGE
     ===================================================== */

  const ORDER_KEY =
    "oneera_test_order";


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
     SAVE ORDER
     ===================================================== */

  function saveOrder(order) {

    localStorage.setItem(

      ORDER_KEY,

      JSON.stringify(
        order
      )

    );

  }


  /* =====================================================
     UPDATE ORDER STATUS
     ===================================================== */

  function updateOrderStatus(
    status
  ) {

    const order =
      getOrder();


    if (!order) {

      return null;

    }


    order.status =
      status;


    /*
      Keep the original fulfillment
      status separate.
    */


    saveOrder(
      order
    );


    return order;

  }


  /* =====================================================
     UPDATE PAYMENT STATUS
     ===================================================== */

  function updatePaymentStatus(
    status
  ) {

    const order =
      getOrder();


    if (!order) {

      return null;

    }


    order.payment_status =
      status;


    saveOrder(
      order
    );


    return order;

  }


  /* =====================================================
     UPDATE FULFILLMENT STATUS
     ===================================================== */

  function updateFulfillmentStatus(
    status
  ) {

    const order =
      getOrder();


    if (!order) {

      return null;

    }


    order.fulfillment_status =
      status;


    saveOrder(
      order
    );


    return order;

  }


  /* =====================================================
     CLEAR TEST ORDER
     ===================================================== */

  function clearOrder() {

    localStorage.removeItem(
      ORDER_KEY
    );

  }


  /* =====================================================
     PUBLIC API
     ===================================================== */

  window.ONEERA_ORDERS = {

    getOrder:
      getOrder,

    saveOrder:
      saveOrder,

    updateOrderStatus:
      updateOrderStatus,

    updatePaymentStatus:
      updatePaymentStatus,

    updateFulfillmentStatus:
      updateFulfillmentStatus,

    clearOrder:
      clearOrder

  };


  console.log(
    "ONE ERA Orders: READY"
  );


})();
