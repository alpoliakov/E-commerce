import React, { useEffect, useRef } from 'react';
import { postData } from '../../utils/fetchData';

// eslint-disable-next-line react/prop-types,no-unused-vars
const PaypalBtn = ({ total, address, mobile, state, dispatch }) => {
  const refPaypalBtn = useRef();
  // eslint-disable-next-line no-unused-vars,react/prop-types
  const { cart, auth, orders } = state;

  useEffect(() => {
    // eslint-disable-next-line no-undef
    paypal
      .Buttons({
        createOrder: function (data, actions) {
          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total,
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          // This function captures the funds from the transaction.
          return actions.order.capture().then(function (details) {
            dispatch({ type: 'NOTIFY', payload: { loading: true } });
            // eslint-disable-next-line react/prop-types
            postData('order', { address, mobile, cart, total }, auth.token).then((res) => {
              if (res.err) {
                return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
              }

              dispatch({ type: 'ADD_CART', payload: [] });

              const newOrder = {
                ...res.newOrder,
                // eslint-disable-next-line react/prop-types
                user: auth.user,
              };
              dispatch({ type: 'ADD_ORDERS', payload: [...orders, newOrder] });

              return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
            });
            // This function shows a transaction success message to your buyer.
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        },
      })
      .render(refPaypalBtn.current);
  }, []);

  return <div ref={refPaypalBtn}></div>;
};

export default PaypalBtn;
